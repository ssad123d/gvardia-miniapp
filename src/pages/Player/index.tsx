
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRKSportPlayerStats,
  getRKSportMatches,
  getRKSportMatchEvents,
  type RKSportMatch,
} from "../../api/rksport";
import "./Player.css";

type PlayerStats = {
  name: string;
  position: string;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rksportId?: string;
};

type LivePlayerStats = {
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  photo?: string;
};

type RecentMatch = {
  match: RKSportMatch;
  goals: string[];
  assists: string[];
};

const players: PlayerStats[] = [
  { name: "Кирилл Очнев", position: "Вратарь", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "8766289" },
  { name: "Алим Белялов", position: "Вратарь", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "10423436" },
  { name: "Роман Драновский", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "9889666" },
  { name: "Керим Зинетдинов", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "9889773" },
  { name: "Демирель Ирых", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "9889697" },
  { name: "Константин Соловищук", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "10437538" },
  { name: "Ильяс Велиляев", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "7716590" },
  { name: "Максим Туник", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "9882250" },
  { name: "Рустам Тохиров", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "6795674" },
  { name: "Эмир Исаев", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "9488136" },
  { name: "Андрей Балюк", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "6325276" },
  { name: "Артем Балюк", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "10445602" },
  { name: "Арсен Гафаров", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "6324974" },
  { name: "Левиз Гафаров", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "9881633" },
  { name: "Егор Набоков", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "9882258" },
  { name: "Абдурашид Тохиров", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "6542899" },
  { name: "Эмир Лапа", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "9889802" },
  { name: "Эдем Мустафаев", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "6448893" },
  { name: "Сервер Османов", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "9893584" },
  { name: "Сейран Гафаров", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "6866032" },
  { name: "Ислям Таиров", position: "Нападающий", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "10428125" },
  { name: "Нуреддин Чабанов", position: "Нападающий", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "10228391" },
  { name: "Эмир Мустафаев", position: "Нападающий", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "10415116" },
  { name: "Даниил Шилов", position: "Нападающий", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "9913500" },
  { name: "Владимир Селезнёв", position: "Нападающий", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rksportId: "6324689" },
];

function createPlayerId(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-|-$/g, "");
}

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^а-яa-z0-9\s]/gi, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function playerNameMatches(eventName: string, fullName: string) {
  const eventParts = normalizeName(eventName);
  const playerParts = normalizeName(fullName);

  return (
    playerParts.length > 0 &&
    playerParts.every((part) => eventParts.includes(part))
  );
}

function parseMatchDate(value: string): number {
  const match = value.match(
    /(\d{1,2})\s+([а-яё.]+)(?:\s+(\d{4}))?/i,
  );

  if (!match) return 0;

  const months: Record<string, number> = {
    янв: 0, января: 0,
    фев: 1, февраля: 1,
    мар: 2, марта: 2,
    апр: 3, апреля: 3,
    май: 4, мая: 4,
    июн: 5, июня: 5,
    июл: 6, июля: 6,
    авг: 7, августа: 7,
    сен: 8, сент: 8, сентября: 8,
    окт: 9, октября: 9,
    ноя: 10, ноября: 10,
    дек: 11, декабря: 11,
  };

  const day = Number(match[1]);
  const month = months[match[2].replace(/\./g, "").toLowerCase()];

  if (month === undefined) return 0;

  return new Date(
    Number(match[3] || new Date().getFullYear()),
    month,
    day,
  ).getTime();
}

export default function Player() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const player =
    players.find((item) => createPlayerId(item.name) === id) ??
    players[0];

  const [liveStats, setLiveStats] =
    useState<LivePlayerStats | null>(null);
  const [loading, setLoading] = useState(false);

  const [recentMatches, setRecentMatches] =
    useState<RecentMatch[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPlayerStats() {
      setLiveStats(null);

      if (!player.rksportId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const result = await getRKSportPlayerStats(player.rksportId);

        if (cancelled || !result) return;

        setLiveStats({
          matches: result.matches ?? 0,
          goals: result.goals ?? 0,
          assists: result.assists ?? 0,
          yellowCards: result.yellowCards ?? 0,
          redCards: result.redCards ?? 0,
          photo: result.photo,
        });
      } catch (error) {
        console.error("Не удалось загрузить статистику игрока:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPlayerStats();

    return () => {
      cancelled = true;
    };
  }, [player.name, player.rksportId]);

  useEffect(() => {
    let cancelled = false;

    async function loadRecentMatches() {
      setRecentMatches([]);
      setMatchesError(false);

      if (!player.rksportId) {
        setMatchesLoading(false);
        return;
      }

      setMatchesLoading(true);

      try {
        const allMatches = await getRKSportMatches();

        const finishedMatches = allMatches
          .filter(
            (match) =>
              match.type === "finished" &&
              match.score !== "- : -" &&
              /\d+\s*-\s*\d+/.test(match.score),
          )
          .sort(
            (a, b) =>
              parseMatchDate(b.dateTime || b.date) -
              parseMatchDate(a.dateTime || a.date),
          )
          .slice(0, 5);

        const results = await Promise.all(
          finishedMatches.map(async (match) => {
            try {
              const events = await getRKSportMatchEvents(
                match.id,
                match.homeTeam,
                match.awayTeam,
              );

              const goals = events
                .filter(
                  (event) =>
                    event.type === "goal" &&
                    playerNameMatches(event.player, player.name),
                )
                .map((event) => event.minute);

              const assists = events
                .filter(
                  (event) =>
                    event.type === "assist" &&
                    playerNameMatches(event.player, player.name),
                )
                .map((event) => event.minute);

              return { match, goals, assists };
            } catch (error) {
              console.warn("Не удалось загрузить протокол матча:", error);
              return {
                match,
                goals: [] as string[],
                assists: [] as string[],
              };
            }
          }),
        );

        if (!cancelled) setRecentMatches(results);
      } catch (error) {
        console.error("Не удалось загрузить последние матчи:", error);
        if (!cancelled) setMatchesError(true);
      } finally {
        if (!cancelled) setMatchesLoading(false);
      }
    }

    void loadRecentMatches();

    return () => {
      cancelled = true;
    };
  }, [player.name, player.rksportId]);

  const displayedStats = liveStats
    ? { ...player, ...liveStats }
    : player;

  return (
    <div className="player-page">
      <button
        type="button"
        className="player-back"
        onClick={() => navigate(-1)}
      >
        ← Назад
      </button>

      <section className="player-profile">
        <div className="player-profile__photo">
          {liveStats?.photo ? (
            <img src={liveStats.photo} alt={player.name} />
          ) : (
            <div className="player-profile__photo-placeholder">
              {player.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}
        </div>

        <div className="player-profile__info">
          <span className="player-profile__position">{player.position}</span>
          <h1 className="player-profile__name">{player.name}</h1>
          <p className="player-profile__team">ФК «Гвардия»</p>
        </div>
      </section>

      <section className="player-stats">
        <h2 className="player-section-title">Статистика сезона</h2>

        {loading && (
          <p className="player-loading">
            Загружаем статистику из РК Спорт…
          </p>
        )}

        <div className="player-stats__grid">
          <div className="player-stat">
            <span className="player-stat__value">{displayedStats.matches}</span>
            <span className="player-stat__label">Матчи</span>
          </div>
          <div className="player-stat">
            <span className="player-stat__value">{displayedStats.goals}</span>
            <span className="player-stat__label">Голы</span>
          </div>
          <div className="player-stat">
            <span className="player-stat__value">{displayedStats.assists}</span>
            <span className="player-stat__label">Передачи</span>
          </div>
          <div className="player-stat">
            <span className="player-stat__value">{displayedStats.yellowCards}</span>
            <span className="player-stat__label">Жёлтые карточки</span>
          </div>
          <div className="player-stat">
            <span className="player-stat__value">{displayedStats.redCards}</span>
            <span className="player-stat__label">Красные карточки</span>
          </div>
        </div>

        {!loading && !liveStats && player.rksportId && (
          <p className="player-stats__note">
            Не удалось получить актуальные данные. Показаны значения по умолчанию.
          </p>
        )}

        {!player.rksportId && (
          <p className="player-stats__note">
            Статистика этого игрока пока не подключена к РК Спорт.
          </p>
        )}
      </section>

      <section className="player-recent-matches">
        <h2 className="player-section-title">Последние матчи</h2>

        {matchesLoading && (
          <p className="player-loading">Загружаем последние матчи…</p>
        )}

        {matchesError && !matchesLoading && (
          <div className="player-empty">
            Не удалось загрузить матчи из РК-Спорт. Попробуй обновить страницу.
          </div>
        )}

        {!matchesLoading && !matchesError && recentMatches.length === 0 && (
          <div className="player-empty">
            Завершённые матчи пока не найдены.
          </div>
        )}

        <div className="player-recent-matches__list">
          {recentMatches.map(({ match, goals, assists }) => {
            const isHome = normalizeName(match.homeTeam).some(
              (part) => part === "гвардия",
            );

            const opponent = isHome ? match.awayTeam : match.homeTeam;

            return (
              <article className="player-match-card" key={match.id}>
                <div className="player-match-card__top">
                  <span className="player-match-card__date">
                    {match.date || match.dateTime}
                  </span>
                  <span className="player-match-card__status">Завершён</span>
                </div>

                <div className="player-match-card__main">
                  <div className="player-match-card__teams">
                    <span className="player-match-card__team">
                      {isHome ? "Гвардия" : opponent}
                    </span>
                    <strong className="player-match-card__score">
                      {match.score}
                    </strong>
                    <span className="player-match-card__team">
                      {isHome ? opponent : "Гвардия"}
                    </span>
                  </div>
                </div>

                <div className="player-match-card__actions">
                  <span className="player-match-card__action-label">
                    Действия игрока
                  </span>

                  {goals.length > 0 && (
                    <span className="player-match-card__goal">
                      ⚽ Гол{goals.length > 1 ? "ы" : ""}: {goals.join(", ")}
                    </span>
                  )}

                  {assists.length > 0 && (
                    <span className="player-match-card__goal">
                      👟 Передачи: {assists.join(", ")}
                    </span>
                  )}

                  {goals.length === 0 && assists.length === 0 && (
                    <span className="player-match-card__no-goals">
                      Нет отмеченных голов или передач
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
