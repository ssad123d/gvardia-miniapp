
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRKSportMatches } from "../../api/rksport";
import type { RKSportMatch } from "../../api/rksport";
import {
  getTeamDisplayName,
  getTeamLogo,
} from "../../utils/teamLogos";
import "./Matches.css";

type MatchFilter = "all" | "upcoming" | "finished";

const CACHE_KEY = "gvardia-matches-page-cache-v1";
const RKSPORT_CACHE_KEY = "gvardia-rksport-cache-v1:matches";

function TeamLogo({
  teamName,
  logo,
}: {
  teamName: string;
  logo?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = getTeamLogo(teamName, logo);

  useEffect(() => {
    setFailed(false);
  }, [teamName, src]);

  return (
    <div className="team-logo">
      {src && !failed ? (
        <img
          src={src}
          alt={teamName}
          onError={() => setFailed(true)}
        />
      ) : (
        <span>⚽</span>
      )}
    </div>
  );
}

function isFinished(match: RKSportMatch): boolean {
  return Boolean(
    match.score &&
      /\d+\s*[-:]\s*\d+/.test(match.score)
  );
}

function isGvardiyaMatch(match: RKSportMatch): boolean {
  return (
    match.homeTeam.toLowerCase().includes("гвард") ||
    match.awayTeam.toLowerCase().includes("гвард")
  );
}

function readPageCache(): RKSportMatch[] {
  try {
    const cached =
      localStorage.getItem(CACHE_KEY) ||
      localStorage.getItem(RKSPORT_CACHE_KEY);

    if (!cached) return [];

    const parsed = JSON.parse(cached);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isGvardiyaMatch);
  } catch (error) {
    console.warn("Не удалось прочитать кэш матчей:", error);
    return [];
  }
}

export default function Matches() {
  const [matches, setMatches] = useState<RKSportMatch[]>(
    () => readPageCache()
  );

  const [loading, setLoading] = useState(
    () => readPageCache().length === 0
  );

  const [error, setError] = useState("");
  const [filter, setFilter] = useState<MatchFilter>("all");

  useEffect(() => {
    let cancelled = false;

    async function refreshMatches() {
      try {
        const result = await getRKSportMatches();

        if (cancelled) return;

        const gvardiyaMatches = result.filter(isGvardiyaMatch);

        setMatches(gvardiyaMatches);
        setError("");

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify(gvardiyaMatches)
        );
      } catch (err) {
        console.error("Ошибка фонового обновления матчей:", err);

        if (!cancelled && matches.length === 0) {
          setError(
            "Не удалось загрузить матчи. Попробуйте обновить страницу."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    refreshMatches();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredMatches = matches.filter((match) => {
    if (filter === "upcoming") return !isFinished(match);
    if (filter === "finished") return isFinished(match);
    return true;
  });

  return (
    <div className="matches-page">
      <h1 className="matches-title">Матчи</h1>

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
          Предстоящие
        </button>

        <button
          className={filter === "finished" ? "active" : ""}
          onClick={() => setFilter("finished")}
        >
          Завершённые
        </button>
      </div>

      {loading && matches.length === 0 && (
        <p>Загружаем матчи...</p>
      )}

      {error && matches.length === 0 && (
        <p className="matches-error">{error}</p>
      )}

      {!loading && filteredMatches.length === 0 && !error && (
        <div className="matches-empty">
          <div>⚽</div>
          <h3>Матчей пока нет</h3>
          <p>Здесь появятся матчи команды «Гвардия».</p>
        </div>
      )}

      <div className="matches-list">
        {filteredMatches.map((match) => {
          const homeName = getTeamDisplayName(match.homeTeam);
          const awayName = getTeamDisplayName(match.awayTeam);

          const homeLogo = getTeamLogo(
            homeName,
            match.homeLogo
          );

          const awayLogo = getTeamLogo(
            awayName,
            match.awayLogo
          );

          const finished = isFinished(match);

          return (
            <Link
              to={`/matches/${match.id}`}
              className="match-card"
              key={match.id}
            >
              <div className="match-date">
                {match.date || "Дата уточняется"}
              </div>

              <div className="match-content">
                <div className="match-team">
                  <TeamLogo
                    teamName={homeName}
                    logo={homeLogo}
                  />
                  <span>{homeName}</span>
                </div>

                <div className="match-score">
                  <strong>{match.score || "— : —"}</strong>
                  <small>
                    {finished ? "ЗАВЕРШЁН" : "МАТЧ"}
                  </small>
                </div>

                <div className="match-team">
                  <TeamLogo
                    teamName={awayName}
                    logo={awayLogo}
                  />
                  <span>{awayName}</span>
                </div>
              </div>

              <div className="match-arrow">›</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
