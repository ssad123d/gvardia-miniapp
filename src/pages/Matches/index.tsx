import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./matches.css";

const matches = [
  {
    id: "1",
    date: "20 СЕН",
    time: "19:00",
    opponent: "Могучая Кучка",
    score: "—",
    logo: "/src/assets/moguchaya-kuchka.png",
    type: "upcoming",
  },
  {
    id: "2",
    date: "27 СЕН",
    time: "18:30",
    opponent: "Сельхоз Юнайтед",
    score: "—",
    logo: "/src/assets/selhoz.png",
    type: "upcoming",
  },
  {
    id: "3",
    date: "30 АВГ",
    time: "",
    opponent: "Интер-Национал",
    score: "5 : 6",
    logo: "/src/assets/inter.png",
    type: "finished",
  },
  {
    id: "4",
    date: "23 АВГ",
    time: "",
    opponent: "Название",
    score: "7 : 4",
    logo: "/src/assets/nazvanie.png",
    type: "finished",
  },
];

const gvardiyaLogo = "/src/assets/gvardiya.jpg";

export default function Matches() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");

  const visibleMatches = matches.filter((match) => {
    if (filter === "upcoming") {
      return match.type === "upcoming";
    }

    if (filter === "finished") {
      return match.type === "finished";
    }

    return true;
  });

  return (
    <main className="matches-page">

      <header className="matches-header">

        <div className="matches-header-logo">
          G
        </div>

        <div>
          <h1>ФК «ГВАРДИЯ»</h1>
          <span>БОЛЬШЕ ЧЕМ КОМАНДА</span>
        </div>

        <button className="matches-notification">
          🔔
        </button>

      </header>

      <h2 className="matches-title">
        Матчи
      </h2>

      <div className="matches-tabs">

        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Все
        </button>

        <button
          className={filter === "upcoming" ? "active" : ""}
          onClick={() => setFilter("upcoming")}
        >
          Ближайшие
        </button>

        <button
          className={filter === "finished" ? "active" : ""}
          onClick={() => setFilter("finished")}
        >
          Результаты
        </button>

      </div>

      <section className="matches-list">

        {visibleMatches.map((match) => (

          <button
            key={match.id}
            className="match-card"
            onClick={() => navigate(`/matches/${match.id}`)}
            type="button"
          >

            <div className="match-date">
              {match.date}
            </div>

            <div className="match-content">

              <div className="match-team">

                <div className="team-logo">

                  <img
                    src={gvardiyaLogo}
                    alt="Гвардия"
                  />

                </div>

                <span>
                  ГВАРДИЯ
                </span>

              </div>

              <div className="match-score">

                <strong>
                  {match.score}
                </strong>

                {match.time && (
                  <small>
                    {match.time}
                  </small>
                )}

              </div>

              <div className="match-team">

                <div className="team-logo">

                  <img
                    src={match.logo}
                    alt={match.opponent}
                  />

                </div>

                <span>
                  {match.opponent}
                </span>

              </div>

            </div>

            <div className="match-arrow">
              ›
            </div>

          </button>

        ))}

      </section>

    </main>
  );
}