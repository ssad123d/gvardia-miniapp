import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MatchArticle.css";
import { getTeamLogo } from "../../utils/teamLogos";

import {
  getRKSportMatches,
  getRKSportMatchEvents,
  getRKSportMatchLineups,
  type RKSportMatch,
  type RKSportMatchEvent,
  type RKSportTeamLineup,
} from "../../api/rksport";

export default function MatchArticle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [match, setMatch] = useState<RKSportMatch | null>(null);
  const [events, setEvents] = useState<RKSportMatchEvent[]>([]);
  const [lineups, setLineups] = useState<RKSportTeamLineup[]>([]);
  const [lineupsLoading, setLineupsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadMatch = async () => {
      try {
        setLoading(true);
        setError("");

        const allMatches = await getRKSportMatches();

        if (cancelled) return;

        const foundMatch = allMatches.find(
          (item) => String(item.id) === String(id),
        );

        if (!foundMatch) {
          setMatch(null);
          return;
        }

        setMatch(foundMatch);

        console.log("ДАННЫЕ МАТЧА:", {
          homeTeam: foundMatch.homeTeam,
          homeLogo: foundMatch.homeLogo,
          awayTeam: foundMatch.awayTeam,
          awayLogo: foundMatch.awayLogo,
        });

        setEventsLoading(true);

        try {
          const matchEvents = await getRKSportMatchEvents(
            foundMatch.id,
            foundMatch.homeTeam,
            foundMatch.awayTeam,
          );

          if (!cancelled) {
            setEvents(matchEvents);
          }
        } catch (eventError) {
          console.error("Ошибка загрузки протокола:", eventError);

          if (!cancelled) {
            setEvents([]);
          }
        } finally {
          if (!cancelled) {
            setEventsLoading(false);
          }
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Не удалось загрузить матч",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadMatch();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function loadLineups() {
      if (!id) {
        console.error("ID МАТЧА НЕ НАЙДЕН");
        setLineups([]);
        setLineupsLoading(false);
        return;
      }

      console.log("НАЧИНАЕМ ЗАГРУЗКУ СОСТАВОВ:", id);
      setLineupsLoading(true);

      try {
        const result = await getRKSportMatchLineups(id);

        console.log("ПОЛУЧЕНЫ СОСТАВЫ:", {
          matchId: id,
          lineupsCount: result.length,
          lineups: result.map((lineup) => ({
            teamName: lineup.teamName,
            startersCount: lineup.players.length,
            substitutesCount: lineup.substitutes.length,
            starters: lineup.players.map((player) => ({
              id: player.id,
              name: player.name,
              number: player.number,
              role: player.role,
              line: player.line,
              zone: player.zone,
            })),
            substitutes: lineup.substitutes.map((player) => ({
              id: player.id,
              name: player.name,
              number: player.number,
              role: player.role,
            })),
          })),
        });

        if (!cancelled) setLineups(result);
      } catch (lineupError) {
        console.error("ОШИБКА ЗАГРУЗКИ СОСТАВОВ:", {
          matchId: id,
          error: lineupError,
        });

        if (!cancelled) setLineups([]);
      } finally {
        if (!cancelled) setLineupsLoading(false);
      }
    }

    void loadLineups();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="match-article-page">
        <button
          className="match-back"
          type="button"
          onClick={() => navigate("/matches")}
        >
          ← Назад к расписанию
        </button>

        <section className="match-not-found">
          <div className="match-not-found-icon">⚽</div>
          <h1>Загрузка матча...</h1>
          <p>Получаем информацию из РК-Спорт.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="match-article-page">
        <button
          className="match-back"
          type="button"
          onClick={() => navigate("/matches")}
        >
          ← Назад к расписанию
        </button>

        <section className="match-not-found">
          <div className="match-not-found-icon">⚠️</div>
          <h1>Ошибка загрузки</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!match) {
    return (
      <main className="match-article-page">
        <button
          className="match-back"
          type="button"
          onClick={() => navigate("/matches")}
        >
          ← Назад к расписанию
        </button>

        <section className="match-not-found">
          <div className="match-not-found-icon">⚽</div>
          <h1>Матч не найден</h1>
          <p>
            Информация об этом матче пока недоступна.
          </p>
        </section>
      </main>
    );
  }

  const homeName = match.homeTeam;
  const awayName = match.awayTeam;

  const homeLogo = getTeamLogo(homeName, match.homeLogo);
  const awayLogo = getTeamLogo(awayName, match.awayLogo);

  const scoreParts = match.score
    ? match.score.split("-")
    : [];

  const homeScore =
    scoreParts.length > 0 ? scoreParts[0].trim() : "—";

  const awayScore =
    scoreParts.length > 1 ? scoreParts[1].trim() : "—";

  const finished = match.type === "finished";

  const normalizeTeamName = (value: string) =>
    value.toLocaleLowerCase().replace(/ё/g, "е").replace(/[^а-яa-z0-9]/gi, "");

  // Показываем только заявку Гвардии — состав соперника не требуется.
  const gvardiyaLineup = lineups.find((lineup) =>
    normalizeTeamName(lineup.teamName).includes("гвардия"),
  );


  // Оставляем голы отдельными событиями.
  // Голевые передачи будут показаны внутри карточки соответствующего гола.
  const goalEvents = events.filter(
    (event) => event.type === "goal",
  );

  // Ищем ассист той же команды и на той же минуте.
  const getAssistForGoal = (goal: RKSportMatchEvent) => {
    const goalMinute = goal.minute.replace(/\D/g, "");

    return events.find(
      (event) =>
        event.type === "assist" &&
        event.team === goal.team &&
        event.minute.replace(/\D/g, "") === goalMinute,
    );
  };

  return (
    <main className="match-article-page">
      <button
        className="match-back"
        type="button"
        onClick={() => navigate("/matches")}
      >
        ← Назад к расписанию
      </button>

      <section className="match-article-hero">
        <span className="match-article-tournament">
          Корпоративная Супер Лига
        </span>

        <h1>
          {finished ? "МАТЧ ЗАВЕРШЕН" : "ПРЕДСТОЯЩИЙ МАТЧ"}
        </h1>

        <p className="match-article-date">
          {match.date}
          {match.time ? ` в ${match.time}` : ""}
        </p>

        <div className="match-teams">
          <div className="match-article-team">
            <div className="match-article-logo">
              <img
                src={homeLogo || undefined}
                alt={homeName}
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
            </div>
            <strong>{homeName}</strong>
          </div>

          <div className="match-article-score">
            <span>{homeScore}</span>
            <small>VS</small>
            <span>{awayScore}</span>
          </div>

          <div className="match-article-team">
            <div className="match-article-logo">
              <img
                src={awayLogo || undefined}
                alt={awayName}
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
            </div>
            <strong>{awayName}</strong>
          </div>
        </div>
      </section>

      <section className="match-info-card">
        <div className="match-info-row">
          <span>🏆</span>
          <div>
            <small>Турнир</small>
            <strong>Корпоративная Супер Лига</strong>
          </div>
        </div>

        <div className="match-info-row">
          <span>📅</span>
          <div>
            <small>Дата</small>
            <strong>{match.date}</strong>
          </div>
        </div>

        <div className="match-info-row">
          <span>⏱️</span>
          <div>
            <small>Время</small>
            <strong>{match.time || "Уточняется"}</strong>
          </div>
        </div>

        <div className="match-info-row">
          <span>📍</span>
          <div>
            <small>Место проведения</small>
            <strong>РК-Спорт Арена</strong>
          </div>
        </div>
      </section>

      <section className="match-lineup-card">
        <div className="match-section-title">
          <span>⚽</span>
          <h2>СОБЫТИЯ</h2>
        </div>

        {eventsLoading ? (
          <div className="match-events-empty">
            <div>⚽</div>
            <strong>Загружаем события...</strong>
            <p>Получаем протокол матча из РК-Спорт.</p>
          </div>
        ) : goalEvents.length === 0 ? (
          <div className="match-events-empty">
            <div>⚽</div>
            <strong>События пока недоступны</strong>
            <p>
              РК-Спорт ещё не опубликовал события этого матча.
            </p>
          </div>
        ) : (
          <div className="match-events-list">
            {goalEvents.map((event, index) => {
              const isHome = event.team === homeName;
              const assist = getAssistForGoal(event);

              return (
                <div
                  className={
                    "match-event-row " +
                    (isHome
                      ? "match-event-home"
                      : "match-event-away")
                  }
                  key={`${event.team}-${event.player}-${event.minute}-${index}`}
                >
                  <div className="match-event-minute">
                    {event.minute}
                  </div>

                  <div className="match-event-icon">
                    ⚽
                  </div>

                  <div className="match-event-info">
                    <strong>{event.player}</strong>

                    <span className="match-event-type-label">
                      ГОЛ
                    </span>

                    {assist && (
                      <span className="match-event-assist">
                        Ассист: {assist.player}
                      </span>
                    )}

                    <span className="match-event-team-name">
                      {event.team}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="match-lineup-card">
        <div className="match-section-title">
          <span>👥</span>
          <h2>СОСТАВ ГВАРДИИ</h2>
        </div>

        {lineupsLoading ? (
          <div className="match-lineups-message">
            <strong>Проверяем заявку Гвардии...</strong>
            <p>Получаем опубликованный состав из РК-Спорт.</p>
          </div>
        ) : !gvardiyaLineup ? (
          <div className="match-lineups-message">
            <strong>Заявка Гвардии пока не опубликована</strong>
            <p>Стартовые игроки и запасные появятся здесь автоматически после публикации заявки в РК-Спорт.</p>
          </div>
        ) : (
          <div className="match-lineups-grid match-lineups-grid-single">
            {(() => {
              const lineup = gvardiyaLineup;
              const rows = Array.from(
                new Set(lineup.players.map((player) => player.line)),
              ).sort((a, b) => b - a);
              const fieldPlayers = lineup.players.filter((player) => player.line >= 0);
              const formation = rows
                .filter((row) => fieldPlayers.some((player) => player.line === row && player.line !== 0))
                .map((row) => fieldPlayers.filter((player) => player.line === row).length)
                .filter(Boolean)
                .join("-");

              return (
                <div className="match-lineup-team">
                  <div className="match-lineup-team-heading">
                    <strong>{lineup.teamName || "Гвардия"}</strong>
                    {formation && <span>Схема {formation}</span>}
                  </div>

                  <div className="match-tactical-pitch">
                    <div className="match-pitch-marking match-pitch-center-line" />
                    <div className="match-pitch-marking match-pitch-center-circle" />
                    <div className="match-pitch-box match-pitch-box-top" />
                    <div className="match-pitch-box match-pitch-box-bottom" />

                    {rows.map((row) => (
                      <div className="match-lineup-row" key={row}>
                        {fieldPlayers
  .filter((player) => player.line === row)
  .sort((a, b) => a.zone - b.zone)
  .map((player) => (
                          <div className="match-lineup-player" key={player.id || `${player.name}-${player.number}`}>
                            <div className="match-lineup-photo-wrap">
                              {player.photo ? (
                                <img className="match-lineup-photo" src={player.photo} alt={player.name} loading="lazy" />
                              ) : (
                                <div className="match-lineup-photo-fallback">{player.shortName.charAt(0)}</div>
                              )}
                              <span className="match-lineup-number">{player.number || "—"}</span>
                            </div>
                            <span className="match-lineup-player-name">{player.shortName}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="match-lineup-substitutes">
                    <h3>Запасные ({lineup.substitutes.length})</h3>
                    {lineup.substitutes.length === 0 ? (
                      <p>Запасные не указаны.</p>
                    ) : (
                      <div className="match-substitutes-list">
                        {lineup.substitutes.map((player) => (
                          <div className="match-substitute-player" key={player.id || `${player.name}-${player.number}`}>
                            {player.photo ? (
                              <img src={player.photo} alt={player.name} loading="lazy" />
                            ) : (
                              <span className="match-substitute-fallback">{player.shortName.charAt(0)}</span>
                            )}
                            <span className="match-substitute-number">{player.number || "—"}</span>
                            <span className="match-substitute-name">{player.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      <section className="match-stats-card">
        <div className="match-section-title">
          <span>📊</span>
          <h2>СТАТИСТИКА</h2>
        </div>

        <div className="match-stats-empty">
          <div>📊</div>
          <strong>Статистика пока недоступна</strong>
          <p>
            После проведения матча здесь появятся дополнительные
            показатели.
          </p>
        </div>
      </section>
    </main>
  );
}
