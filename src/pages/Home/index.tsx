import { useEffect, useRef, useState } from "react"; import { useNavigate } from "react-router-dom"; import "./Home.css";
import gvardiyaLogo from "../../assets/gvardiya.jpg";
type NewsItem = { id: number; date: string; title: string; text: string; };
const news: NewsItem[] = [ { id: 1, date: "12 СЕНТЯБРЯ 2026", title: "ФК «Гвардия» готовится к следующему матчу", text: "Команда продолжает подготовку к очередной игре в рамках Кубка КСЛ.", }, { id: 2, date: "10 СЕНТЯБРЯ 2026", title: "Итоги последнего матча", text: "Подводим итоги прошедшей встречи и готовимся к следующим матчам.", }, { id: 3, date: "8 СЕНТЯБРЯ 2026", title: "Обновление состава команды", text: "В составе команды произошли изменения. Следите за актуальным составом.", }, ];
function Home() { const navigate = useNavigate();
const [currentNews, setCurrentNews] = useState(0);
const touchStartX = useRef<number | null>(null); const touchEndX = useRef<number | null>(null);
useEffect(() => { const interval = setInterval(() => { setCurrentNews((prev) => (prev + 1) % news.length); }, 5000);
return () => clearInterval(interval);}, []);
const handleTouchStart = (event: React.TouchEvent) => { touchStartX.current = event.touches[0].clientX; };
const handleTouchMove = (event: React.TouchEvent) => { touchEndX.current = event.touches[0].clientX; };
const handleTouchEnd = () => { if ( touchStartX.current === null || touchEndX.current === null ) { return; }
const distance =
  touchStartX.current - touchEndX.current;

if (distance > 50) {
  setCurrentNews(
    (prev) => (prev + 1) % news.length
  );
}

if (distance < -50) {
  setCurrentNews(
    (prev) =>
      (prev - 1 + news.length) % news.length
  );
}

touchStartX.current = null;
touchEndX.current = null;};
const activeNews = news[currentNews];
return ( <div className="home-page">
  {/* HEADER */}
  <header className="home-header">

    <div className="home-logo">
      <img
        src={gvardiyaLogo}
        alt="ФК Гвардия"
      />
    </div>

    <div className="home-title">
      <h1>ФК «ГВАРДИЯ»</h1>

      <span>
        БОЛЬШЕ ЧЕМ КОМАНДА
      </span>
    </div>

    <button
      className="notification-button"
      onClick={() => navigate("/news")}
    >
      🔔
    </button>

  </header>

  {/* HERO */}
  <section className="home-hero">

    <img
      className="hero-logo"
      src={gvardiyaLogo}
      alt="ФК Гвардия"
    />

    <div className="hero-overlay">

      <div className="hero-title">
        ВМЕСТЕ К НОВЫМ
        <br />
        ПОБЕДАМ
      </div>

    </div>

  </section>

  {/* NEXT MATCH */}
  <section className="home-section">

    <div className="section-title-row">

      <h2>
        БЛИЖАЙШИЙ МАТЧ
      </h2>

      <span>
        Кубок КСЛ
      </span>

    </div>

    <div className="next-match-card">

      <div className="team-block">

        <div className="team-logo big-logo">
          <img
            src={gvardiyaLogo}
            alt="Гвардия"
          />
        </div>

        <strong>
          ГВАРДИЯ
        </strong>

      </div>

      <div className="match-info">

        <div className="match-date">
          20 СЕНТЯБРЯ 2026
        </div>

        <div className="match-time">
          19:00
        </div>

        <div className="match-place">
          📍 РК Спорт
        </div>

      </div>

      <div className="team-block">

        <div className="opponent-logo">
          ⚽
        </div>

        <strong>
          СОПЕРНИК
        </strong>

      </div>

      <button
        className="gold-button"
        onClick={() => navigate("/matches")}
      >
        ПОДРОБНЕЕ О МАТЧЕ

        <span>
          →
        </span>

      </button>

    </div>

  </section>

  {/* LAST RESULT */}
  <section className="home-section">

    <div className="section-title-row">

      <h2>
        ПОСЛЕДНИЙ РЕЗУЛЬТАТ
      </h2>

      <span>
        Кубок КСЛ
      </span>

    </div>

    <div className="result-card">

      <div className="result-team">

        <div className="result-logo">
          <img
            src={gvardiyaLogo}alt="Гвардия"
          />
        </div>

        <strong>
          ГВАРДИЯ
        </strong>

      </div>

      <div className="result-score">

        <span className="result-status">
          ФИНАЛЬНЫЙ СЧЁТ
        </span>

        <strong>
          5 : 6
        </strong>

        <span className="result-date">
          30 АВГУСТА 2026
        </span>

      </div>

      <div className="result-team">

        <div className="opponent-logo result-opponent">
          ⚽
        </div>

        <strong>
          ИНТЕРНАЦИОНАЛ
        </strong>

      </div>

    </div>

    <button
      className="result-details-button"
      onClick={() => navigate("/matches")}
    >
      ПОСМОТРЕТЬ МАТЧ

      <span>
        →
      </span>

    </button>

  </section>

  {/* NEWS */}
  <section className="home-section">

    <div className="section-title-row">

      <h2>
        ПОСЛЕДНИЕ НОВОСТИ
      </h2>

      <button
        className="all-news-button"
        onClick={() => navigate("/news")}
      >
        Все новости →
      </button>

    </div>

    {/* NEWS CAROUSEL */}
    <div
      className="home-news-carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >

      <article
        className="home-news-card"
        onClick={() =>
          navigate(`/news/${activeNews.id}`)
        }
      >

        <div className="news-image-placeholder">

          <img
            src={gvardiyaLogo}
            alt="ФК Гвардия"
          />

        </div>

        <div className="home-news-content">

          <div className="home-news-date">
            {activeNews.date}
          </div>

          <h3>
            {activeNews.title}
          </h3>

          <p className="home-news-preview">
            {activeNews.text}
          </p>

        </div>

        <div className="news-arrow">
          →
        </div>

      </article>

      {/* DOTS */}
      <div className="news-dots">

        {news.map((item, index) => (

          <button
            key={item.id}
            className={
              index === currentNews
                ? "news-dot active"
                : "news-dot"
            }
            onClick={(event) => {
              event.stopPropagation();
              setCurrentNews(index);
            }}
            aria-label={`Новость ${index + 1}`}
          />

        ))}

      </div>

    </div>

  </section>

  {/* QUICK MENU */}
  <section className="quick-menu">

    <button
      onClick={() => navigate("/schedule")}
    >
      <span>
        📅
      </span>

      <strong>
        РАСПИСАНИЕ
      </strong>
    </button>

    <button
      onClick={() => navigate("/table")}
    >
      <span>
        🏆
      </span>

      <strong>
        ТУРНИРНАЯ
        <br />
        ТАБЛИЦА
      </strong>
    </button>

    <button
      onClick={() => navigate("/squad")}
    >
      <span>
        👥
      </span>

      <strong>
        СОСТАВ
      </strong>
    </button>

    <button
      onClick={() => navigate("/news")}
    >
      <span>
        📄
      </span>

      <strong>
        НОВОСТИ
      </strong>
    </button>

  </section>

</div>); }
export default Home;