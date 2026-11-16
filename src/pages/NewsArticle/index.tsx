
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNewsById,
  type NewsItem,
} from "../News/newsStorage";
import "./NewsArticle.css";

export default function NewsArticle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [article, setArticle] = useState<NewsItem | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadArticle() {
      if (!id) {
        setArticle(undefined);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getNewsById(id);

        if (!cancelled) {
          setArticle(result);
        }
      } catch (err) {
        console.error("Ошибка загрузки статьи:", err);

        if (!cancelled) {
          setError("Не удалось загрузить новость. Попробуй ещё раз.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadArticle();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="news-article-page">
        <button
          className="news-article-back"
          type="button"
          onClick={() => navigate("/news")}
        >
          ← Все новости
        </button>

        <section className="news-article-content">
          <h1>Загружаем новость...</h1>
        </section>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="news-article-page">
        <button
          className="news-article-back"
          type="button"
          onClick={() => navigate("/news")}
        >
          ← Все новости
        </button>

        <section className="news-article-content">
          <h1>{error ? "Ошибка загрузки" : "Новость не найдена"}</h1>
          <p>
            {error || "Возможно, публикация была удалена."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="news-article-page">
      <button
        className="news-article-back"
        type="button"
        onClick={() => navigate("/news")}
      >
        ← Все новости
      </button>

      <article className="news-article-content">
        {article.image && (
          <img
            className="news-article-image"
            src={article.image}
            alt=""
          />
        )}

        <div className="news-article-date">{article.date}</div>

        <h1>{article.title}</h1>

        <p className="news-article-preview">{article.preview}</p>

        <div className="news-article-text">
          {article.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
