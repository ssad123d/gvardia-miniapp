
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./news.css";

import {
  addNews,
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
          setError("Не удалось загрузить новости. Попробуй обновить страницу.");
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

  async function handleAddNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!admin || saving) return;

    try {
      setSaving(true);
      setError("");

      const item = await addNews({
        title: title.trim(),
        date: date.trim(),
        preview: preview.trim(),
        content: content.trim(),
        image: image.trim() || undefined,
      });

      setNews((current) => [
        item,
        ...current.filter((newsItem) => newsItem.id !== item.id),
      ]);

      setTitle("");
      setPreview("");
      setContent("");
      setImage("");
      setShowForm(false);
    } catch (err) {
      console.error("Ошибка публикации:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось опубликовать новость.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!admin || deletingId) return;

    if (!window.confirm("Удалить эту новость?")) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteNews(id);

      setNews((current) => current.filter((item) => item.id !== id));
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
            onClick={() => setShowForm((value) => !value)}
          >
            {showForm ? "Закрыть форму" : "+ Добавить новость"}
          </button>
        )}
      </header>

      {admin && showForm && (
        <form className="news-editor" onSubmit={handleAddNews}>
          <h2>Новая публикация</h2>

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
            {saving ? "Публикуем..." : "Опубликовать"}
          </button>
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
                    Читать далее <span className="news-arrow">→</span>
                  </span>
                </div>
              </button>

              {admin && (
                <button
                  className="news-delete"
                  type="button"
                  disabled={deletingId !== null}
                  onClick={() => void handleDelete(item.id)}
                  aria-label={`Удалить новость: ${item.title}`}
                >
                  {deletingId === item.id ? "Удаляем..." : "Удалить"}
                </button>
              )}
            </article>
          ))
        )}
      </main>
    </div>
  );
}

export default News;
