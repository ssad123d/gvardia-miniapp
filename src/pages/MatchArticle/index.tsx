import { useNavigate, useParams } from "react-router-dom";
import "./MatchArticle.css";

const matches = [
  {
    id: "1",
    date: "20 сентября 2026",
    time: "19:00",
    opponent: "Могучая Кучка",
    score: "—",
    status: "Предстоящий матч",
    opponentLogo: "/src/assets/moguchaya-kuchka.png",
  },
  {
    id: "2",
    date: "27 сентября 2026",
    time: "18:30",
    opponent: "Сельхоз Юнайтед",
    score: "—",
    status: "Предстоящий матч",
    opponentLogo: "/src/assets/selhoz.png",
  },
  {
    id: "3",
    date: "30 августа 2026",
    time: "",
    opponent: "Интер-Национал",
    score: "5 : 6",
    status: "Завершён",
    opponentLogo: "/src/assets/inter.png",
  },
  {
    id: "4",
    date: "23 августа 2026",
    time: "",
    opponent: "Название",
    score: "7 : 4",
    status: "Завершён",
    opponentLogo: "/src/assets/nazvanie.png",
  },
];

const gvardiyaLogo = "/src/assets/gvardiya.jpg";

export default function MatchArticle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const match = matches.find((item) => item.id === id);

  if (!match) {
    return (
      <main className="match-article-page">
        <button
          className="match-back-button"
          onClick={() => navigate("/matches")}
        >
          ← Назад к матчам
        </button>

        <div className="match-not-found">
          <h1>Матч не найден</h1>
          <p>Такого матча пока нет.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="match-article-page">
      <button
        className="match-back-button"
        onClick={() => navigate("/matches")}
      >
        ← Назад к матчам
      </button>

      <div className="match-article-header">
        <span>КУБОК КСЛ</span>

        <h1>{match.status}</h1>

        <p>{match.date}</p>
      </div>

      <section className="match-main-card">
        <div className="match-main-team">
          <div className="match-main-logo">
            <img src={gvardiyaLogo} alt="Гвардия" />
          </div>

          <strong>ГВАРДИЯ</strong>
        </div>

        <div className="match-main-score">
          <strong>{match.score}</strong>

          {match.time && <span>{match.time}</span>}
        </div>

        <div className="match-main-team">
          <div className="match-main-logo opponent-logo">
            <img src={match.opponentLogo} alt={match.opponent} />
          </div>

          <strong>{match.opponent}</strong>
        </div>
      </section>

      <div className="match-location">
        📍 РК Спорт
      </div>

      <section className="match-info-section">
        <h2>Информация о матче</h2>

        <div className="match-info-card">
          <div>
            <span>Турнир</span>
            <strong>Кубок КСЛ</strong>
          </div>

          <div>
            <span>Дата</span>
            <strong>{match.date}</strong>
          </div>

          <div>
            <span>Стадион</span>
            <strong>РК Спорт</strong>
          </div>
        </div>
      </section>

      {match.status === "Завершён" && (
        <section className="match-events-section">
          <h2>События матча</h2>

          <div className="match-empty-card">
            <span>⚽</span>

            <p>
              Статистика и события матча появятся
              после подключения данных.
            </p>
          </div>
        </section>
      )}

      <button
        className="match-bottom-button"
        onClick={() => navigate("/matches")}
      >
        ← Вернуться к матчам
      </button>
    </main>
  );
}