
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./news.css";

import {
  addNews,
  updateNews,
  deleteNews,
  getNews,
  isNewsAdmin,
  type NewsItem,
} from "./newsStorage";

function News() {
  const navigate = useNavigate();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const admin = isNewsAdmin();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(
    new Date()
      .toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      .toUpperCase(),
  );
  const [preview, setPreview] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  function resetForm() {
    setTitle("");
    setDate(
      new Date()
        .toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
        .toUpperCase(),
    );
    setPreview("");
    setContent("");
    setImage("");
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(item: NewsItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setDate(item.date);
    setPreview(item.preview);
    setContent(item.content);
    setImage(item.image ?? "");
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      try {
        setLoading(true);
        setError("");

        const result = await getNews();

        if (!cancelled) {
          setNews(result);
        }
      } catch (err) {
        console.error("Ошибка загрузки новостей:", err);

        if (!cancelled) {
          setError(
            "Не удалось загрузить новости. Попробуй обновить страницу.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadNews();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSaveNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!admin || saving) return;

    const item = {
      title: title.trim(),
      date: date.trim(),
      preview: preview.trim(),
      content: content.trim(),
      image: image.trim() || undefined,
    };

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        const updatedItem = await updateNews(editingId, item);

        setNews((current) =>
          current.map((newsItem) =>
            newsItem.id === updatedItem.id
              ? updatedItem
              : newsItem,
          ),
        );
      } else {
        const newItem = await addNews(item);

        setNews((current) => [
          newItem,
          ...current.filter(
            (newsItem) => newsItem.id !== newItem.id,
          ),
        ]);
      }

      resetForm();
    } catch (err) {
      console.error("Ошибка сохранения новости:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Не удалось сохранить новость.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!admin || deletingId || saving) return;

    if (!window.confirm("Удалить эту новость?")) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteNews(id);

      setNews((current) =>
        current.filter((item) => item.id !== id),
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("Ошибка удаления новости:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Не удалось удалить новость.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="news-page">
      <header className="news-header">
        <h1>Новости</h1>
        <div className="news-header-team">ФК «ГВАРДИЯ»</div>
        <p>Последние события команды</p>

        {admin && (
          <button
            className="news-more"
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setError("");
                setShowForm(true);
              }
            }}
          >
            {showForm ? "Закрыть форму" : "+ Добавить новость"}
          </button>
        )}
      </header>

      {admin && showForm && (
        <form
          className="news-editor"
          onSubmit={handleSaveNews}
        >
          <h2>
            {editingId
              ? "Редактирование новости"
              : "Новая публикация"}
          </h2>

          <label>
            Заголовок
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={120}
              placeholder="Например, Гвардия одержала победу"
            />
          </label>

          <label>
            Дата публикации
            <input
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              placeholder="15 НОЯБРЯ 2026"
            />
          </label>

          <label>
            Краткое описание
            <textarea
              value={preview}
              onChange={(event) => setPreview(event.target.value)}
              required
              maxLength={300}
              rows={3}
              placeholder="Текст для карточки новости"
            />
          </label>

          <label>
            Полный текст статьи
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
              rows={7}
              placeholder="Полный текст новости"
            />
          </label>

          <label>
            Ссылка на фотографию (необязательно)
            <input
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://..."
            />
          </label>

          <button
            className="news-more"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Сохраняем..."
              : editingId
                ? "Сохранить изменения"
                : "Опубликовать"}
          </button>

          {editingId && (
            <button
              className="news-delete"
              type="button"
              disabled={saving}
              onClick={resetForm}
            >
              Отменить редактирование
            </button>
          )}
        </form>
      )}

      {error && (
        <p className="news-error" role="alert">
          {error}
        </p>
      )}

      <main className="news-list">
        {loading ? (
          <p>Загружаем новости...</p>
        ) : news.length === 0 ? (
          <p>Пока новостей нет. Добавь первую публикацию.</p>
        ) : (
          news.map((item) => (
            <article className="news-card" key={item.id}>
              <button
                className="news-card-open"
                type="button"
                onClick={() => navigate(`/news/${item.id}`)}
                aria-label={`Открыть новость: ${item.title}`}
              >
                <div className="news-image">
                  {item.image ? (
                    <img src={item.image} alt="" />
                  ) : (
                    <div className="news-image-placeholder">
                      <span>G</span>
                    </div>
                  )}
                </div>

                <div className="news-card-content">
                  <div className="news-date">{item.date}</div>
                  <h2>{item.title}</h2>
                  <p>{item.preview}</p>
                  <span className="news-more">
                    Читать далее{" "}
                    <span className="news-arrow">→</span>
                  </span>
                </div>
              </button>

              {admin && (
                <div className="news-admin-actions">
                  <button
                    className="news-more"
                    type="button"
                    disabled={saving || deletingId !== null}
                    onClick={() => handleEdit(item)}
                  >
                    Редактировать
                  </button>

                  <button
                    className="news-delete"
                    type="button"
                    disabled={deletingId !== null || saving}
                    onClick={() => void handleDelete(item.id)}
                    aria-label={`Удалить новость: ${item.title}`}
                  >
                    {deletingId === item.id
                      ? "Удаляем..."
                      : "Удалить"}
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </main>
    </div>
  );
}

export default News;
