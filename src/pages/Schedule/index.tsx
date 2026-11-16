import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Schedule.css";
import {
  getTeamDisplayName,
  getTeamLogo,
} from "../../utils/teamLogos";
import gvardiyaLogo from "../../assets/gvardiya.png";
import {
  getRKSportMatches,
  type RKSportMatch,
} from "../../api/rksport";

type Match = {
  id: string;
  day: number;
  month: number;
  year: number;
  opponent: string;
  logo: string;
  time: string;
  score: string;
  result: "win" | "draw" | "loss" | "upcoming";
  isHome: boolean;
};

type MatchDateParts = { day: number; month: number; year: number };

const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const monthNames = [
  "ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ",
  "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ",
];

const firstMonth = 9; // октябрь
const firstYear = 2026;
const lastMonth = 0; // январь
const lastYear = 2027;

const monthMap: Record<string, number> = {
  янв: 0, января: 0, январь: 0,
  фев: 1, февраля: 1, февраль: 1,
  мар: 2, марта: 2, март: 2,
  апр: 3, апреля: 3, апрель: 3,
  май: 4, мая: 4,
  июн: 5, июня: 5, июнь: 5,
  июл: 6, июля: 6, июль: 6,
  авг: 7, августа: 7, август: 7,
  сен: 8, сент: 8, сентября: 8, сентябрь: 8,
  окт: 9, октября: 9, октябрь: 9,
  ноя: 10, нояб: 10, ноября: 10, ноябрь: 10,
  дек: 11, декабря: 11, декабрь: 11,
};

function isValidDateParts(day: number, month: number, year: number): boolean {
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    day < 1 ||
    month < 0 ||
    month > 11 ||
    year < 2000 ||
    year > 2100
  ) {
    return false;
  }
  return day <= new Date(year, month + 1, 0).getDate();
}

function inferYear(month: number, explicitYear?: number): number {
  if (explicitYear && Number.isFinite(explicitYear)) return explicitYear;
  // Текущий сезон охватывает октябрь 2026 — январь 2027.
  return month >= 8 ? 2026 : 2027;
}

function parseMatchDate(dateText?: string | null): MatchDateParts | null {
  if (!dateText) return null;

  const normalized = dateText
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // ISO date: 2026-10-31 or 2026-10-31T18:00:00
  const isoDate = normalized.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (isoDate) {
    const year = Number(isoDate[1]);
    const month = Number(isoDate[2]) - 1;
    const day = Number(isoDate[3]);
    if (isValidDateParts(day, month, year)) return { day, month, year };
  }

  // Day-first numeric date: 31.10.2026, 31/10/2026, 31-10-2026
  const numericDate = normalized.match(/\b(\d{1,2})[./-](\d{1,2})(?:[./-](20\d{2}))?\b/);
  if (numericDate) {
    const day = Number(numericDate[1]);
    const month = Number(numericDate[2]) - 1;
    const year = inferYear(month, numericDate[3] ? Number(numericDate[3]) : undefined);
    if (isValidDateParts(day, month, year)) return { day, month, year };
  }

  // Russian date, e.g. "16 янв., сб, 00:00", "31 октября 2026".
  const textDate = normalized.match(/\b(\d{1,2})\s+([а-я]+)\.?(?=\s|$)(?:\s+(20\d{2}))?/i);
  if (!textDate) return null;

  const day = Number(textDate[1]);
  const monthWord = textDate[2].replace(/\.$/, "");
  const month = monthMap[monthWord];
  if (month === undefined) return null;

  const year = inferYear(month, textDate[3] ? Number(textDate[3]) : undefined);
  if (!isValidDateParts(day, month, year)) return null;
  return { day, month, year };
}

function isGvardiya(teamName: string): boolean {
  return teamName.toLowerCase().replace(/ё/g, "е").includes("гвард");
}

function getOpponentLogo(teamName: string, originalLogo?: string): string {
  return getTeamLogo(teamName, originalLogo);
}

function parseScore(scoreText?: string | null): [number, number] | null {
  if (!scoreText) return null;
  const match = scoreText.match(/(?:^|\s)(\d{1,2})\s*[-–:]\s*(\d{1,2})(?:\s|$)/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2])];
}

type MatchWithExtraDateFields = RKSportMatch & {
  dateLine?: string;
  date_line?: string;
  time?: string;
  lines?: string[];
  dateText?: string;
  datetime?: string;
};

function getParsedMatchDate(match: RKSportMatch): MatchDateParts | null {
  const item = match as MatchWithExtraDateFields;

  // RK-Sport may put the date in a line such as "16 янв., сб, 00:00"
  // even when `date` and `dateTime` are empty or contain only the time.
  const candidates: Array<string | null | undefined> = [
    item.date,
    item.dateLine,
    item.date_line,
    item.dateText,
    item.dateTime,
    item.datetime,
    ...(Array.isArray(item.lines) ? item.lines : []),
  ];

  for (const candidate of candidates) {
    const parsed = parseMatchDate(candidate);
    if (parsed) return parsed;
  }

  return null;
}

export default function Schedule() {
  const navigate = useNavigate();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [currentMonth, setCurrentMonth] = useState(firstMonth);
  const [currentYear, setCurrentYear] = useState(firstYear);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      try {
        setLoading(true);
        setLoadError(false);

        const data = await getRKSportMatches();
        console.info("Расписание: получено матчей из РК-Спорт:", data.length);

        const parsedMatches: Match[] = data.flatMap((match: RKSportMatch) => {
          const homeIsGvardiya = isGvardiya(match.homeTeam || "");
          const awayIsGvardiya = isGvardiya(match.awayTeam || "");

          if (!homeIsGvardiya && !awayIsGvardiya) return [];

          const parsedDate = getParsedMatchDate(match);
          if (!parsedDate) {
            const item = match as MatchWithExtraDateFields;
            console.warn("Расписание: не удалось разобрать дату матча", {
              id: match.id,
              date: item.date,
              dateTime: item.dateTime,
              dateLine: item.dateLine,
              date_line: item.date_line,
              lines: item.lines,
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
            });
            return [];
          }

          const { day, month, year } = parsedDate;
          const opponentRaw = homeIsGvardiya ? match.awayTeam : match.homeTeam;
          const opponent = getTeamDisplayName(opponentRaw || "Соперник");
          const originalLogo = homeIsGvardiya ? match.awayLogo : match.homeLogo;
          const logo = getOpponentLogo(opponent, originalLogo);
          const scoreParts = parseScore(match.score);
          const score = scoreParts ? `${scoreParts[0]} - ${scoreParts[1]}` : "";

          let result: Match["result"] = "upcoming";
          if (scoreParts) {
            const homeGoals = scoreParts[0];
            const awayGoals = scoreParts[1];
            const gvardiyaGoals = homeIsGvardiya ? homeGoals : awayGoals;
            const opponentGoals = homeIsGvardiya ? awayGoals : homeGoals;
            result =
              gvardiyaGoals > opponentGoals
                ? "win"
                : gvardiyaGoals < opponentGoals
                  ? "loss"
                  : "draw";
          }

          return [{
            id: match.id,
            day,
            month,
            year,
            opponent,
            logo,
            time: (match as MatchWithExtraDateFields).time || "",
            score,
            result,
            isHome: homeIsGvardiya,
          }];
        });

        parsedMatches.sort((a, b) =>
          new Date(a.year, a.month, a.day).getTime() -
          new Date(b.year, b.month, b.day).getTime()
        );

        console.info("Расписание: матчей Гвардии с распознанной датой:", parsedMatches.length);
        if (!cancelled) {
          setMatches(parsedMatches);
          setLoadError(false);
        }
      } catch (error) {
        console.error("Ошибка загрузки расписания РК-Спорт:", error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadMatches();
    return () => {
      cancelled = true;
    };
  }, []);

  const isFirstMonth = currentYear === firstYear && currentMonth === firstMonth;
  const isLastMonth = currentYear === lastYear && currentMonth === lastMonth;

  const calendarDays: Array<number | null> = (() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const mondayOffset = (firstDay + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return [
      ...Array<number | null>(mondayOffset).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  })();

  const monthMatches = matches
    .filter((match) => match.month === currentMonth && match.year === currentYear)
    .sort((a, b) => a.day - b.day);

  const openMatch = (match: Match) => navigate(`/matches/${match.id}`);

  const changeMonth = (direction: -1 | 1) => {
    const nextDate = new Date(currentYear, currentMonth + direction, 1);
    const nextYear = nextDate.getFullYear();
    const nextMonth = nextDate.getMonth();
    const beforeStart = nextYear < firstYear ||
      (nextYear === firstYear && nextMonth < firstMonth);
    const afterEnd = nextYear > lastYear ||
      (nextYear === lastYear && nextMonth > lastMonth);
    if (beforeStart || afterEnd) return;
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };

  return (
    <main className="schedule-page">
      <header className="schedule-header">
        <div className="schedule-header-logo">
          <img src={gvardiyaLogo} alt="Гвардия" />
        </div>
        <div className="schedule-header-info">
          <h1>РАСПИСАНИЕ</h1>
          <p>Корпоративная Супер Лига</p>
        </div>
      </header>

      <section className="schedule-season">
        <div className="schedule-season-top">
          <span>ФК «ГВАРДИЯ»</span>
          <div className="schedule-season-badge">2026/27</div>
        </div>
        <h2>
          {monthNames[currentMonth][0] + monthNames[currentMonth].slice(1).toLowerCase()} {currentYear}
        </h2>
        <p>Календарь матчей ФК «Гвардия» в новом сезоне.</p>
      </section>

      <div className="schedule-switch">
        <button type="button" className={view === "calendar" ? "active" : ""} onClick={() => setView("calendar")}>
          ▦ Календарь
        </button>
        <button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
          ☰ Список
        </button>
      </div>

      {view === "calendar" ? (
        <section className="calendar-card">
          <div className="calendar-title">
            <button type="button" className="calendar-month-arrow" disabled={isFirstMonth} onClick={() => changeMonth(-1)} aria-label="Предыдущий месяц">
              ‹
            </button>
            <div className="calendar-month-label">
              <span>КОРПОРАТИВНАЯ СУПЕР ЛИГА</span>
              <h2>{monthNames[currentMonth]}</h2>
            </div>
            <div className="calendar-month-right">
              <div className="calendar-year">{currentYear}</div>
              <button type="button" className="calendar-month-arrow" disabled={isLastMonth} onClick={() => changeMonth(1)} aria-label="Следующий месяц">
                ›
              </button>
            </div>
          </div>

          <div className="calendar-weekdays">
            {weekDays.map((day) => <div key={day}>{day}</div>)}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div className="calendar-day empty" key={`empty-${index}`} />;
              }
              const dayMatches = monthMatches.filter((match) => match.day === day);
              const match = dayMatches[0];
              return (
                <button
                  key={day}
                  type="button"
                  className={match ? `calendar-day has-match ${match.score ? `result-border-${match.result}` : ""}` : "calendar-day"}
                  onClick={() => { if (match) openMatch(match); }}
                  disabled={!match}
                >
                  <span className="calendar-number">{day}</span>
                  {match && (
                    <div className="calendar-match">
                      <div className="calendar-match-logo">
                        {match.logo ? <img src={match.logo} alt={match.opponent} /> : <span aria-label={match.opponent}>⚽</span>}
                      </div>
                      <span>{match.opponent}</span>
                      {match.score && <strong className="calendar-match-score">{match.score}</strong>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span className="legend-dot" />
            <span>Матч «Гвардии»</span>
          </div>
          {loading && <p className="schedule-empty">Загружаем матчи из РК-Спорт…</p>}
          {!loading && loadError && <p className="schedule-empty">Не удалось загрузить расписание. Попробуйте обновить страницу.</p>}
          {!loading && !loadError && monthMatches.length === 0 && (
            <p className="schedule-empty">
              {matches.length === 0
                ? "Матчи не найдены. Проверьте консоль браузера: парсер не распознал команды или даты."
                : "На этот месяц подтверждённые матчи пока не найдены."}
            </p>
          )}
        </section>
      ) : (
        <section className="schedule-list">
          {loading ? (
            <div className="schedule-more"><strong>Загружаем расписание…</strong></div>
          ) : loadError ? (
            <div className="schedule-more"><strong>Не удалось загрузить матчи</strong><p>Попробуйте обновить страницу.</p></div>
          ) : monthMatches.length > 0 ? (
            monthMatches.map((match) => (
              <button
                type="button"
                className={`schedule-match ${match.result !== "upcoming" ? `result-border-${match.result}` : ""}`}
                key={match.id}
                onClick={() => openMatch(match)}
              >
                <div className="schedule-date">
                  <strong>{match.day} {monthNames[match.month].slice(0, 3)}</strong>
                  <span>{match.year}</span>
                </div>
                <div className="schedule-teams">
                  <div className="schedule-team">
                    <div className="schedule-logo">
                      {match.isHome ? <img src={gvardiyaLogo} alt="Гвардия" /> : match.logo ? <img src={match.logo} alt={match.opponent} /> : <span aria-label={match.opponent}>⚽</span>}
                    </div>
                    <span>{match.isHome ? "ГВАРДИЯ" : match.opponent}</span>
                  </div>
                  <div className="schedule-vs">
                    {match.score ? <strong className={`schedule-score result-${match.result}`}>{match.score}</strong> : <strong>VS</strong>}
                    <small>{match.score ? "ЗАВЕРШЁН" : match.time || "Время уточняется"}</small>
                  </div>
                  <div className="schedule-team">
                    <div className="schedule-logo">
                      {match.isHome ? match.logo ? <img src={match.logo} alt={match.opponent} /> : <span aria-label={match.opponent}>⚽</span> : <img src={gvardiyaLogo} alt="Гвардия" />}
                    </div>
                    <span>{match.isHome ? match.opponent : "ГВАРДИЯ"}</span>
                  </div>
                </div>
                <div className="schedule-arrow">›</div>
              </button>
            ))
          ) : (
            <div className="schedule-more">
              <div>📅</div>
              <strong>Матчи пока не найдены</strong>
              <p>На выбранный месяц в РК-Спорт пока нет подтверждённых матчей.</p>
            </div>
          )}
        </section>
      )}

      <section className="schedule-more">
        <div>📅</div>
        <strong>Продолжение календаря</strong>
        <p>Расписание обновляется на основе данных РК-Спорт.</p>
      </section>
    </main>
  );
}
