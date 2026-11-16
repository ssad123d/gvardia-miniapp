import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import {
  getTeamDisplayName,
  getTeamLogo,
} from "../../utils/teamLogos";

import {
  getRKSportMatches,
  getRKSportTable,
  type RKSportMatch,
  type RKSportTeam,
} from "../../api/rksport";

function getOpponent(match: RKSportMatch) {
  const isGvardiyaHome = match.homeTeam
    .toLowerCase()
    .includes("гвард");

  return isGvardiyaHome
    ? {
        name: getTeamDisplayName(match.awayTeam),
        logo: getTeamLogo(match.awayTeam, match.awayLogo),
      }
    : {
        name: getTeamDisplayName(match.homeTeam),
        logo: getTeamLogo(match.homeTeam, match.homeLogo),
      };
}

function formatMatchDate(match: RKSportMatch) {
  return match.date || "Дата уточняется";
}

export default function Home() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<RKSportMatch[]>([]);
  const [table, setTable] = useState<RKSportTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadHomeData() {
      try {
        const [matchesData, tableData] = await Promise.all([
          getRKSportMatches(),
          getRKSportTable(),
        ]);

        if (!active) return;

        setMatches(matchesData);
        setTable(tableData);
        setError(false);
      } catch (err) {
        console.error("Ошибка загрузки главной страницы:", err);

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadHomeData();

    return () => {
      active = false;
    };
  }, []);

  const nextMatch =
    matches.find((match) => match.type === "upcoming") || null;

  const opponent = nextMatch ? getOpponent(nextMatch) : null;

  return (
    <main className="home-page">
      {/* HEADER */}
      <header className="home-header">
        <div className="home-brand">
          <div className="home-brand-logo">
            <img src={getTeamLogo("Гвардия")} alt="ФК Гвардия" />
          </div>

          <div>
            <strong>ФК «ГВАРДИЯ»</strong>
            <span>Корпоративная Супер Лига</span>
          </div>
        </div>

        <button
          className="home-notification"
          type="button"
          aria-label="Новости"
          onClick={() => navigate("/news")}
        >
          🔔
        </button>
      </header>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-glow" />

        <div className="home-hero-content">
          <span>Корпоративная Супер Лига</span>

          <h1>
            ВМЕСТЕ К
            <br />
            НОВЫМ ПОБЕДАМ
          </h1>

          <p>
            Новый сезон уже начался.
            <br />
            Следи за «Гвардией» здесь.
          </p>
        </div>

        <img
          className="home-hero-logo"
          src={getTeamLogo("Гвардия")}
          alt="Гвардия"
        />
      </section>

      {/* NEXT MATCH */}
      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <span>БЛИЖАЙШИЙ МАТЧ</span>
            <h2>Следующая игра</h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/schedule")}
          >
            Все →
          </button>
        </div>

        {loading ? (
          <div className="home-next-match">
            Загружаем расписание...
          </div>
        ) : nextMatch && opponent ? (
          <button
            className="home-next-match"
            type="button"
            onClick={() => navigate(`/matches/${nextMatch.id}`)}
          >
            <div className="home-match-date">
              <strong>{formatMatchDate(nextMatch)}</strong>
              <span>{nextMatch.time || "Время уточняется"}</span>
            </div>

            <div className="home-match-team">
              <div className="home-match-logo">
                <img
                  src={getTeamLogo("Гвардия")}
                  alt="Гвардия"
                />
              </div>

              <strong>ГВАРДИЯ</strong>
            </div>

            <div className="home-match-center">
              <span>VS</span>
              <small>{nextMatch.time || "Время уточняется"}</small>
            </div>

            <div className="home-match-team">
              <div className="home-match-logo">
                {opponent.logo ? (
                  <img
                    src={opponent.logo}
                    alt={opponent.name}
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <span>⚽</span>
                )}
              </div>

              <strong>{opponent.name.toUpperCase()}</strong>
            </div>

            <div className="home-match-arrow">›</div>
          </button>
        ) : (
          <div className="home-next-match">
            {error
              ? "Не удалось загрузить ближайший матч"
              : "Предстоящие матчи пока не найдены"}
          </div>
        )}
      </section>

      {/* QUICK LINKS */}
      <section className="home-quick-links">
        <button
          type="button"
          onClick={() => navigate("/schedule")}
        >
          <span>📅</span>
          <strong>Расписание</strong>
        </button>

        <button
          type="button"
          onClick={() => navigate("/table")}
        >
          <span>🏆</span>
          <strong>Таблица</strong>
        </button>

        <button
          type="button"
          onClick={() => navigate("/squad")}
        >
          <span>👥</span>
          <strong>Состав</strong>
        </button>

        <button
          type="button"
          onClick={() => navigate("/news")}
        >
          <span>📰</span>
          <strong>Новости</strong>
        </button>
      </section>

      {/* TABLE */}
      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <span>Корпоративная Супер Лига</span>
            <h2>Турнирная таблица</h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/table")}
          >
            Все →
          </button>
        </div>

        {loading ? (
          <div className="home-table">
            <p>Загружаем турнирную таблицу...</p>
          </div>
        ) : table.length > 0 ? (
          <div className="home-table">
            {table.slice(0, 5).map((team) => {
              const teamName = getTeamDisplayName(team.name);
              const teamLogo = getTeamLogo(team.name, team.logo);

              return (
                <button
                  key={team.id}
                  type="button"
                  className={`home-table-row ${
                    team.name.toLowerCase().includes("гвард")
                      ? "home-table-row-current"
                      : ""
                  }`}
                  onClick={() => navigate("/table")}
                >
                  <span className="home-table-place">
                    {team.position}
                  </span>

                  <div className="home-table-team">
                    <div className="home-table-logo">
                      {teamLogo ? (
                        <img
                          src={teamLogo}
                          alt={teamName}
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                        />
                      ) : (
                        <span>⚽</span>
                      )}
                    </div>

                    <strong>{teamName}</strong>
                  </div>

                  <span className="home-table-games">
                    {team.played}
                  </span>

                  <strong className="home-table-points">
                    {team.points}
                  </strong>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="home-table">
            {error
              ? "Не удалось загрузить турнирную таблицу"
              : "Данных о командах пока нет"}
          </div>
        )}
      </section>

      {/* FOOTER INFO */}
      <section className="home-season-info">
        <div className="home-season-info-icon">🏆</div>

        <div>
          <strong>Сезон 2026/27</strong>
          <p>
            Следи за матчами, результатами и положением
            «Гвардии» в новом чемпионате.
          </p>
        </div>
      </section>
    </main>
  );
}