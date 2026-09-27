import { useNavigate } from "react-router-dom";
import "./ArchiveMatches.css";

const archiveMatches = [
  {
    id: "3",
    date: "30 АВГ",
    fullDate: "30 августа 2026",
    opponent: "Интер-Национал",
    score: "5 : 6",
    logo: "/src/assets/inter.png",
    result: "Поражение",
    resultType: "loss",
  },
  {
    id: "4",
    date: "23 АВГ",
    fullDate: "23 августа 2026",
    opponent: "Название",
    score: "7 : 4",
    logo: "/src/assets/nazvanie.png",
    result: "Победа",
    resultType: "win",
  },
];

const gvardiyaLogo = "/src/assets/gvardiya.jpg";

export default function ArchiveMatches() {
  const navigate = useNavigate();

  return (
    <main className="archive-matches-page">
      <button
        className="archive-matches-back"
        type="button"
        onClick={() => navigate("/tournaments/archive")}
      >
        ← Назад к турниру
      </button>

      <header className="archive-matches-header">
        <span>КУБОК КСЛ 2025/26</span>

        <h1>РЕЗУЛЬТАТЫ</h1>

        <p>Все сыгранные матчи ФК «Гвардия»</p>
      </header>

      <section className="archive-matches-summary">
        <div>
          <strong>{archiveMatches.length}</strong>
          <span>матча</span>
        </div>

        <div>
          <strong>1</strong>
          <span>победа</span>
        </div>

        <div>
          <strong>1</strong>
          <span>поражение</span>
        </div>
      </section>

      <section className="archive-matches-list">
        {archiveMatches.map((match) => (
          <button
            key={match.id}
            type="button"
            className="archive-match-card"
            onClick={() => navigate(`/matches/${match.id}`)}
          >
            <div className="archive-match-date">
              <strong>{match.date}</strong>
              <span>2026</span>
            </div>

            <div className="archive-match-content">
              <div className="archive-match-top">
                <span>КУБОК КСЛ</span>

                <b className={match.resultType}>
                  {match.result}
                </b>
              </div>

              <div className="archive-match-teams">
                <div className="archive-match-team">
                  <div className="archive-team-logo gvardiya-logo">
                    <img
                      src={gvardiyaLogo}
                      alt="Гвардия"
                    />
                  </div>

                  <span>ГВАРДИЯ</span>
                </div>

                <div className="archive-match-score">
                  <strong>{match.score}</strong>
                </div>

                <div className="archive-match-team">
                  <div className="archive-team-logo">
                    <img
                      src={match.logo}
                      alt={match.opponent}
                    />
                  </div>

                  <span>{match.opponent}</span>
                </div>
              </div>

              <div className="archive-match-footer">
                <span>{match.fullDate}</span>

                <strong>Подробнее ›</strong>
              </div>
            </div>
          </button>
        ))}
      </section>

      <section className="archive-matches-note">
        <div className="archive-matches-note-icon">
          ℹ
        </div>

        <div>
          <strong>История турнира</strong>

          <p>
            Здесь будут храниться результаты матчей
            ФК «Гвардия» в завершённом чемпионате
            Кубка КСЛ 2025/26.
          </p>
        </div>
      </section>
    </main>
  );
}