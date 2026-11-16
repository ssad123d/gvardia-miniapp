
export type RKSportTeam = {
  id: string;
  name: string;
  city: string;
  logo: string;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

export type RKSportMatch = {
  id: string;
  type: "finished" | "upcoming";
  date: string;
  time: string;
  dateTime: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  score: string;
};
export type RKSportPlayerStats = {
  id: string;
  name: string;
  photo: string;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
};
export type RKSportMatchEvent = {
  minute: string;
  player: string;
  team: string;
  type: "goal" | "assist" | "card";
};

export type RKSportLineupPlayer = {
  id: string;
  name: string;
  shortName: string;
  number: string;
  photo: string;
  role: string;
  line: number;
  zone: number;
};

export type RKSportTeamLineup = {
  teamName: string;
  players: RKSportLineupPlayer[];
  substitutes: RKSportLineupPlayer[];
};


const TABLE_URL = "/rksport/tournament/1067181/tables";

const CALENDAR_URL =
  "/rksport/team/1498973/calendar?season_id=10131741";

const CACHE_PREFIX = "gvardia-rksport-cache-v1";

const REQUEST_TIMEOUT_MS = 15000;

/* =========================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
========================= */

function cleanText(
  value: string | null | undefined,
): string {
  if (!value) {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

/* =========================
   РЕЗЕРВНОЕ ХРАНИЛИЩЕ
========================= */

function readCache<T>(key: string): T[] | null {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = window.localStorage.getItem(
      `${CACHE_PREFIX}:${key}`,
    );

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("data" in parsed) ||
      !Array.isArray(parsed.data) ||
      parsed.data.length === 0
    ) {
      return null;
    }

    return parsed.data as T[];
  } catch {
    return null;
  }
}

function writeCache<T>(
  key: string,
  data: T[],
): void {
  try {
    if (
      typeof window === "undefined" ||
      !Array.isArray(data) ||
      data.length === 0
    ) {
      return;
    }

    window.localStorage.setItem(
      `${CACHE_PREFIX}:${key}`,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        data,
      }),
    );
  } catch (error) {
    console.warn(
      "Не удалось сохранить резерв РК-Спорт:",
      error,
    );
  }
}

/* =========================
   ЗАГРУЗКА С ТАЙМ-АУТОМ
========================= */

async function fetchRKSportPage(
  url: string,
): Promise<Document> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "text/html",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка РК-Спорт: ${response.status}`,
      );
    }

    const html = await response.text();
    if (!html.trim()) {
      throw new Error(
        "РК-Спорт вернул пустую страницу",
      );
    }

    const parser = new DOMParser();

    return parser.parseFromString(
      html,
      "text/html",
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "РК-Спорт не ответил за 15 секунд",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/* =========================
   ТУРНИРНАЯ ТАБЛИЦА
========================= */

async function fetchRKSportTable(): Promise<
  RKSportTeam[]
> {
  const doc = await fetchRKSportPage(TABLE_URL);

  const lines = Array.from(
    doc.querySelectorAll(
      "li.custom-table__line",
    ),
  );

  const teams: RKSportTeam[] = [];

  for (const line of lines) {
    const teamElement = line.querySelector(
      ".custom-table__team",
    );

    if (!teamElement) {
      continue;
    }

    const name = cleanText(
      teamElement.querySelector(
        ".custom-table__team-name",
      )?.textContent,
    );

    if (!name) {
      continue;
    }

    const city = cleanText(
      teamElement.querySelector(
        ".custom-table__team-attribute",
      )?.textContent,
    );

    const logo =
      teamElement
        .querySelector("img")
        ?.getAttribute("src") || "";

    const href =
      teamElement.getAttribute("href") || "";

    const id =
      href.match(/team_id=(\d+)/)?.[1] || name;

    const wins = line.querySelectorAll(
      ".progress__item--win",
    ).length;

    const draws = line.querySelectorAll(
      ".progress__item--draw",
    ).length;

    const losses = line.querySelectorAll(
      ".progress__item--loss",
    ).length;

    const played = wins + draws + losses;
    const points = wins * 3 + draws;

    teams.push({
      id,
      name,
      city,
      logo,
      position: 0,
      played,
      wins,
      draws,
      losses,
      points,
    });
  }

  const uniqueTeams = Array.from(
    new Map(
      teams.map((team) => [team.id, team]),
    ).values(),
  );

  const result = uniqueTeams.map(
    (team, index) => ({
      ...team,
      position: index + 1,
    }),
  );

  // Не заменяем сохранённую таблицу
  // результатом неудачного разбора HTML.
  if (result.length === 0) {
    throw new Error(
      "Не удалось разобрать таблицу РК-Спорт",
    );
  }

  return result;
}

export async function getRKSportTable(): Promise<
  RKSportTeam[]
> {
  try {
    const teams = await fetchRKSportTable();

    writeCache("table", teams);

    return teams;
  } catch (error) {
    const cached = readCache<RKSportTeam>("table");

    if (cached?.length) {
      console.warn(
        "РК-Спорт недоступен. Используем сохранённую таблицу.",
        error,
      );

      return cached;
    }

    throw error;
  }
}

/* =========================
   МАТЧИ И РАСПИСАНИЕ
========================= */


async function fetchRKSportMatches(): Promise<RKSportMatch[]> {
  const doc = await fetchRKSportPage(CALENDAR_URL);
  const baseUrl = "https://rksport8x8.ru";

  const clean = (value: string | null | undefined) =>
    cleanText(value);

  const absoluteUrl = (value: string | null | undefined) => {
    if (!value) return "";
    try {
      return new URL(value, baseUrl).href;
    } catch {
      return value;
    }
  };

  // DOMParser не гарантирует корректный innerText.
  // Восстанавливаем переносы строк по HTML-блокам.
  const getLines = (element: Element): string[] => {
    const clone = element.cloneNode(true) as HTMLElement;

    clone.querySelectorAll("script, style, noscript").forEach((el) =>
      el.remove(),
    );

    clone.querySelectorAll("br").forEach((el) => {
      el.replaceWith("\n");
    });

    clone.querySelectorAll(
      "div, p, li, section, article, header, footer, h1, h2, h3, h4",
    ).forEach((el) => {
      el.insertAdjacentText("afterbegin", "\n");
      el.insertAdjacentText("beforeend", "\n");
    });

    return (clone.textContent || "")
      .split(/\n+/)
      .map(clean)
      .filter(Boolean);
  };

  const anchors = Array.from(
    doc.querySelectorAll<HTMLAnchorElement>('a[href*="/match/"]'),
  );

  const matches: RKSportMatch[] = [];
  const seen = new Set<string>();

  
const datePattern =
  /\b\d{1,2}\s+(?:янв\.?(?:аря)?|фев\.?(?:раля)?|мар\.?(?:та)?|апр\.?(?:еля)?|ма[йя]|июн\.?(?:я)?|июл\.?(?:я)?|авг\.?(?:уста)?|сен\.?(?:тября)?|сент\.?(?:ября)?|окт\.?(?:ября)?|нояб?\.?(?:ря)?|дек\.?(?:абря)?)(?:\s+\d{4})?(?=$|[\s,])/i;
  const scorePattern = /\b\d{1,2}\s*[-:]\s*\d{1,2}\b/;

  // Ограничиваем каждый парсинг контейнером именно одного матча.
  // Это не позволяет захватить соседние игры и записать их весь текст в дату.
  const getMatchIds = (element: Element): Set<string> => {
    const ids = new Set<string>();
    const hrefs: string[] = [];

    if (element.matches('a[href*="/match/"]')) {
      const ownHref = element.getAttribute("href");
      if (ownHref) hrefs.push(ownHref);
    }

    element
      .querySelectorAll<HTMLAnchorElement>('a[href*="/match/"]')
      .forEach((link) => {
        const linkHref = link.getAttribute("href");
        if (linkHref) hrefs.push(linkHref);
      });

    hrefs.forEach((href) => {
      const matchId = href.match(/\/match\/(\d+)/)?.[1];
      if (matchId) ids.add(matchId);
    });

    return ids;
  };

  const ignoredLine =
    /^(?:подробнее|протокол|статистика|состав|смотреть|матч|арена|стадион|симферополь)$/i;

  for (const anchor of anchors) {
    const href = anchor.getAttribute("href") || "";
    const id = href.match(/\/match\/(\d+)/)?.[1];

    if (!id || seen.has(id)) continue;

    let block: Element | null = anchor;
    let chosen: Element | null = null;
    let lines: string[] = [];

    // Ищем ближайший небольшой контейнер, относящийся ровно к этому матчу.
    // Не требуем счёта: предстоящие игры обычно ещё не имеют результата.
    for (let level = 0; level < 10 && block; level++) {
      const currentLines = getLines(block);
      const currentText = currentLines.join(" ");
      const matchIds = getMatchIds(block);

      if (
        matchIds.size === 1 &&
        matchIds.has(id) &&
        currentLines.length >= 3 &&
        currentLines.length <= 35 &&
        datePattern.test(currentText)
      ) {
        chosen = block;
        lines = currentLines;
        break;
      }

      block = block.parentElement;
    }

    // Запасной поиск, всё равно запрещающий контейнеры с соседними матчами.
    if (!chosen) {
      let parent = anchor.parentElement;

      for (let level = 0; level < 10 && parent; level++) {
        const currentLines = getLines(parent);
        const matchIds = getMatchIds(parent);
        const hasDate = datePattern.test(currentLines.join(" "));
        const hasMatchLikeLine = currentLines.some(
          (line) => scorePattern.test(line) || /\b\d{1,2}:\d{2}\b/.test(line),
        );

        if (
          matchIds.size === 1 &&
          matchIds.has(id) &&
          currentLines.length >= 3 &&
          currentLines.length <= 35 &&
          hasMatchLikeLine
        ) {
          chosen = parent;
          lines = currentLines;
          if (hasDate) break;
        }

        parent = parent.parentElement;
      }
    }

    if (!chosen) continue;

    const blockAnchors = Array.from(
      chosen.querySelectorAll<HTMLAnchorElement>("a"),
    );

    const getTeamName = (a: HTMLAnchorElement): string => {
      const nameElement = a.querySelector(
        ".custom-table__team-name, .team-name, [class*='team-name']",
      );
      const image = a.querySelector<HTMLImageElement>("img");

      // Название команды может находиться не в textContent, а в alt/title.
      // Важно проверять все варианты по очереди: пробельный textContent
      // не должен мешать чтению следующего источника.
      const candidates = [
        nameElement?.textContent,
        a.getAttribute("aria-label"),
        a.getAttribute("title"),
        a.getAttribute("data-team-name"),
        image?.getAttribute("alt"),
        image?.getAttribute("title"),
        image?.getAttribute("data-team-name"),
        a.textContent,
      ];

      const name = candidates
        .map((candidate) => clean(candidate))
        .map((candidate) =>
          candidate.replace(/\s*Симферополь\s*$/i, "").trim(),
        )
        .find(
          (candidate) =>
            candidate.length > 1 &&
            !ignoredLine.test(candidate) &&
            !/^\d{1,2}\s*[-:]\s*\d{1,2}$/.test(candidate) &&
            !/^\d{1,2}:\d{2}$/.test(candidate),
        );

      return name || "";
    };

    const teamAnchors = blockAnchors.filter((a) => {
      const teamHref = a.getAttribute("href") || "";
      const name = getTeamName(a);

      return (
        (/\/team\/|team_id=/i.test(teamHref) ||
          !!a.querySelector("img")) &&
        name.length > 1 &&
        !ignoredLine.test(name) &&
        // Не отбрасываем название «82 Регион» только потому, что оно начинается с цифр.
        !/^\d+$/.test(name)
      );
    });

    const teamNames = Array.from(
      new Set(teamAnchors.map(getTeamName).filter(Boolean)),
    );

    console.log("КОМАНДЫ В БЛОКЕ МАТЧА:", {
      matchId: id,
      teamNames,
      teamAnchors: teamAnchors.map((a) => ({
        name: getTeamName(a),
        href: a.getAttribute("href"),
        imageAlt: a.querySelector("img")?.getAttribute("alt") || "",
      })),
    });

    const text = lines.join(" ");
    console.log(
  "РАЗБОР МАТЧА:",
  "id =", id,
  "| lines =", JSON.stringify(lines),
  "| blockText =", chosen.textContent?.trim(),
);
    const scoreLine = lines.find(
      (line) =>
        /^\s*\d{1,2}\s*[-:]\s*\d{1,2}\s*$/.test(line) &&
        !/^\s*\d{1,2}:\d{2}\s*$/.test(line),
    );

    const scoreMatch = scoreLine
      ? scoreLine.match(/^\s*(\d{1,2})\s*[-:]\s*(\d{1,2})\s*$/)
      : null;

    const score = scoreMatch
      ? `${scoreMatch[1]} - ${scoreMatch[2]}`
      : "- : -";

    // Извлекаем только саму дату, а не всю строку контейнера.
    // Именно возвращение целой строки приводило к длинному тексту над карточкой.
    const dateLine =
      lines.map((line) => line.match(datePattern)?.[0]).find(Boolean) ||
      text.match(datePattern)?.[0] ||
      "";

    const time =
      lines.map((line) => line.match(/\b\d{1,2}:\d{2}\b/)?.[0]).find(Boolean) ||
      text.match(/\b\d{1,2}:\d{2}\b/)?.[0] ||
      "";

    const date = clean(dateLine).trim();
console.log(
  "ДАТА МАТЧА:",
  JSON.stringify({
    id,
    dateLine,
    date,
    time,
    lines,
    blockText: chosen.textContent?.trim(),
  }),
);
    let homeTeam = teamNames[0] || "";
    let awayTeam = teamNames[1] || "";

    if (!homeTeam || !awayTeam) {
      const scoreLineIndex = lines.findIndex((line) =>
        scorePattern.test(line),
      );

      const candidates = lines.filter(
        (line) =>
          line.length > 1 &&
          !datePattern.test(line) &&
          !/\b\d{1,2}:\d{2}\b/.test(line) &&
          !scorePattern.test(line) &&
          !ignoredLine.test(line) &&
          !/арена|стадион|симферополь|протокол|статистика/i.test(line),
      );

      if (!homeTeam && candidates.length >= 2) {
        homeTeam = candidates[0];
      }

      if (!awayTeam && candidates.length >= 2) {
        awayTeam = candidates.find((name) => name !== homeTeam) || "";
      }

      if ((!homeTeam || !awayTeam) && scoreLineIndex >= 0) {
        const inlineScore = lines[scoreLineIndex].match(
          /^(.*?)\s*\d{1,2}\s*[-:]\s*\d{1,2}\s*(.*?)$/,
        );

        if (inlineScore) {
          homeTeam ||= clean(inlineScore[1]);
          awayTeam ||= clean(inlineScore[2]);
        }
      }
    }

    if (!homeTeam || !awayTeam || homeTeam === awayTeam) {
      console.warn("Не удалось определить команды матча:", id, lines);
      continue;
    }
    const logoFor = (teamName: string): string => {
      const normalize = (value: string) =>
        clean(value)
          .replace(/симферополь/gi, "")
          .replace(/ё/g, "е")
          .replace(/[^а-яёa-z0-9]/gi, "")
          .toLowerCase();

      const targetName = normalize(teamName);

      // Сначала ищем точное совпадение, затем допускаем частичное.
      // Используем getTeamName, чтобы учитывать alt/title и названия с цифр.
      const exactAnchor = teamAnchors.find(
        (a) => normalize(getTeamName(a)) === targetName,
      );

      const partialAnchor = exactAnchor
        ? undefined
        : teamAnchors.find((a) => {
            const anchorName = normalize(getTeamName(a));
            return (
              targetName.length > 3 &&
              anchorName.length > 3 &&
              (anchorName.includes(targetName) ||
                targetName.includes(anchorName))
            );
          });

      const teamAnchor = exactAnchor || partialAnchor;
      const img =
        teamAnchor?.querySelector<HTMLImageElement>("img") ||
        teamAnchor?.parentElement?.querySelector<HTMLImageElement>("img");

      if (!img) return "";

      const imageUrl =
        img.getAttribute("src") ||
        img.getAttribute("data-src") ||
        img.getAttribute("data-original") ||
        img.getAttribute("data-lazy-src") ||
        img.getAttribute("srcset")?.split(",")[0]?.trim().split(/\s+/)[0] ||
        "";

      return absoluteUrl(imageUrl);
    };
console.log(
  "ПРОВЕРКА ДАТЫ:",
  "dateLine =", dateLine,
  "| date =", date,
  "| time =", time,
  "| dateTime =", [date, time].filter(Boolean).join(" "),
);
    matches.push({
      id,
      type: scoreMatch ? "finished" : "upcoming",
      date,
      time,
      dateTime: [date, time].filter(Boolean).join(" ") || dateLine,
      homeTeam,
      awayTeam,
      homeLogo: logoFor(homeTeam),
      awayLogo: logoFor(awayTeam),
      score,
    });

    seen.add(id);
  }

  console.log("РК-Спорт: ссылок на матчи:", anchors.length);
  console.log("РК-Спорт: успешно разобрано матчей:", matches.length);

  if (matches.length === 0) {
    throw new Error(
      `РК-Спорт: ссылок на протоколы ${anchors.length}, но матчи не разобраны`,
    );
  }

  return matches;
}

export async function getRKSportMatches(): Promise<
  RKSportMatch[]
> {
  try {
    const matches = await fetchRKSportMatches();

    writeCache("matches", matches);

    return matches;
  } catch (error) {
    const cached = readCache<RKSportMatch>("matches");

    if (cached?.length) {
      console.warn(
        "РК-Спорт недоступен. Используем сохранённое расписание и матчи.",
        error,
      );

      return cached;
    }

    throw error;
  }
}

/* =========================
   СОБЫТИЯ МАТЧА
========================= */

async function fetchRKSportMatchEvents(
  matchId: string,
  homeTeam: string,
  awayTeam: string,
): Promise<RKSportMatchEvent[]> {
  const doc = await fetchRKSportPage(
    `/rksport/match/${matchId}`,
  );

  const events: RKSportMatchEvent[] = [];

  const eventElements = Array.from(
    doc.querySelectorAll(
      ".game-timeline__event",
    ),
  );

  for (const element of eventElements) {
    const className =
      typeof element.className === "string"
        ? element.className
        : "";

    const lowerClass = className.toLowerCase();

    const hasGoalClass =
      lowerClass.includes("goal");

    const hasPenaltyClass =
      lowerClass.includes("penalty");

    const hasGoalElement =
      element.querySelector(
        ".game-timeline__goal",
      ) !== null;

    if (
      !hasGoalClass &&
      !hasPenaltyClass &&
      !hasGoalElement
    ) {
      continue;
    }

    let minute =
      element.getAttribute("data-time") || "";

    if (!minute) {
      minute = cleanText(
        element.querySelector(
          ".game-timeline__minute",
        )?.textContent,
      );
    }

    if (!minute) {
      minute =
        element
          .querySelector("[data-time]")
          ?.getAttribute("data-time") || "";
    }

    if (!minute) {
      continue;
    }

    minute = cleanText(minute)
      .replace(/'/g, "")
      .replace(/′/g, "")
      .trim();

    const scorer = cleanText(
      element.getAttribute("data-player-first") ||
        element.querySelector("[data-player-first]")?.getAttribute("data-player-first") ||
        "",
    );

    const assistant = cleanText(
      element.getAttribute("data-player-second") ||
        element.querySelector("[data-player-second]")?.getAttribute("data-player-second") ||
        "",
    );

    // Имя автора гола; запасной вариант нужен для старой разметки.
    const player = scorer || cleanText(
      element.querySelector('a[href*="/player/"]')?.textContent ||
        element.querySelector(".game-timeline__name")?.textContent ||
        "",
    );

    if (!player) {
      continue;
    }

    let team = "";

    if (lowerClass.includes("team1")) {
      team = homeTeam;
    }

    if (lowerClass.includes("team2")) {
      team = awayTeam;
    }

    if (!team) {
      const team1Element =
        element.querySelector(".team1");

      const team2Element =
        element.querySelector(".team2");

      if (team1Element) {
        team = homeTeam;
      }

      if (team2Element) {
        team = awayTeam;
      }
    }

    if (!team) {
      const dataTeam =
        element.getAttribute("data-team");

      if (
        dataTeam === "1" ||
        dataTeam === "team1"
      ) {
        team = homeTeam;
      }

      if (
        dataTeam === "2" ||
        dataTeam === "team2"
      ) {
        team = awayTeam;
      }
    }

    if (!team) {
      let parent = element.parentElement;

      for (
        let i = 0;
        i < 5 && parent;
        i++
      ) {
        const parentClass =
          typeof parent.className === "string"
            ? parent.className
            : "";

        const parentLower =
          parentClass.toLowerCase();

        if (parentLower.includes("team1")) {
          team = homeTeam;
          break;
        }

        if (parentLower.includes("team2")) {
          team = awayTeam;
          break;
        }

        parent = parent.parentElement;
      }
    }

    if (!team) {
      const position =
        element.getAttribute("data-position");

      if (position === "left") {
        team = homeTeam;
      }

      if (position === "right") {
        team = awayTeam;
      }
    }

    if (!team) {
      continue;
    }

    const finalMinute = `${minute}′`;

    events.push({
      minute: finalMinute,
      player,
      team,
      type: "goal",
    });

    // В разметке РК-Спорт data-player-second содержит автора передачи.
    // Пенальти не считаем голевой передачей.
    if (
      hasGoalClass &&
      assistant &&
      assistant !== player
    ) {
      events.push({
        minute: finalMinute,
        player: assistant,
        team,
        type: "assist",
      });
    }
  }

  /* Дополнительный разбор событий */

  if (events.length === 0) {
    const dataTimeElements = Array.from(
      doc.querySelectorAll(
        "[data-time][data-player-first]",
      ),
    );

    for (const element of dataTimeElements) {
      const minute = cleanText(
        element.getAttribute("data-time"),
      )
        .replace(/'/g, "")
        .replace(/′/g, "")
        .trim();

      const player = cleanText(
        element.getAttribute("data-player-first"),
      );

      if (!minute || !player) {
        continue;
      }

      const className =
        typeof element.className === "string"
          ? element.className
          : "";

      const lowerClass = className.toLowerCase();

      if (
        !lowerClass.includes("goal") &&
        !lowerClass.includes("penalty") &&
        !element.querySelector(
          ".game-timeline__goal",
        )
      ) {
        continue;
      }

      let team = "";

      if (lowerClass.includes("team1")) {
        team = homeTeam;
      }

      if (lowerClass.includes("team2")) {
        team = awayTeam;
      }

      if (!team) {
        let parent = element.parentElement;

        for (
          let i = 0;
          i < 5 && parent;
          i++
        ) {
          const parentClass =
            typeof parent.className === "string"
              ? parent.className
              : "";

          const parentLower =
            parentClass.toLowerCase();

          if (parentLower.includes("team1")) {
            team = homeTeam;
            break;
          }

          if (parentLower.includes("team2")) {
            team = awayTeam;
            break;
          }

          parent = parent.parentElement;
        }
      }

      if (!team) {
        continue;
      }

      events.push({
        minute: `${minute}′`,
        player,
        team,
        type: "goal",
      });
    }
  }

  /* Удаляем дубликаты */

  const uniqueEvents = Array.from(
    new Map(
      events.map((event) => [
        `${event.type}|${event.team}|${event.player}|${event.minute}`,
        event,
      ]),
    ).values(),
  );

  /* Сортируем события по минуте */

  uniqueEvents.sort((a, b) => {
    const minuteA =
      parseInt(a.minute.replace(/\D/g, ""), 10) || 0;

    const minuteB =
      parseInt(b.minute.replace(/\D/g, ""), 10) || 0;

    return minuteA - minuteB;
  });

  return uniqueEvents;
}

export async function getRKSportMatchEvents(
  matchId: string,
  homeTeam: string,
  awayTeam: string,
): Promise<RKSportMatchEvent[]> {
  const cacheKey = `events-${matchId}`;

  try {
    const events = await fetchRKSportMatchEvents(
      matchId,
      homeTeam,
      awayTeam,
    );

    if (events.length > 0) {
      writeCache(cacheKey, events);
      return events;
    }

    // Не заменяем прежний протокол пустым ответом.
    const cached = readCache<RKSportMatchEvent>(
      cacheKey,
    );

    return cached ?? events;
  } catch (error) {
    const cached = readCache<RKSportMatchEvent>(
      cacheKey,
    );

    if (cached?.length) {
      console.warn(
        `Используем сохранённые события матча ${matchId}.`,
        error,
      );

      return cached;
    }

    throw error;
  }
}


/* =========================
   СОСТАВЫ МАТЧА
========================= */

function absoluteRKSportUrl(value: string | null | undefined): string {
  if (!value) return "";
  try {
    return new URL(value, "https://rksport8x8.ru").href;
  } catch {
    return value;
  }
}

function parseLineupPlayer(
  element: Element,
  line: number,
  zone: number,
): RKSportLineupPlayer | null {
  const link = element.querySelector<HTMLAnchorElement>(
    ".start__link, .protocol__link, a[href*='/player/']",
  );
  const href = link?.getAttribute("href") || "";
  const id = href.match(/\/player\/(\d+)/)?.[1] || "";
  const image = element.querySelector<HTMLImageElement>(
    ".start__img, .protocol__img, img",
  );
  // У запасных игроков alt фотографии часто содержит общий текст
  // «Фото игрока», поэтому сначала читаем настоящее имя из протокола.
  const name =
    cleanText(element.querySelector(".protocol__name")?.textContent) ||
    cleanText(element.querySelector(".start__text")?.textContent) ||
    cleanText(image?.getAttribute("alt"));
  const shortName =
    cleanText(element.querySelector(".start__text")?.textContent) ||
    name.split(" ")[0] ||
    name;
  const number = cleanText(
    element.querySelector(".start__number, .protocol__number-text")?.textContent,
  );
  // Позиция игрока необязательна: пустое значение не должно исключать его из заявки.
  const role = cleanText(element.querySelector(".protocol__role")?.textContent);
  const photo = absoluteRKSportUrl(
    image?.getAttribute("src") ||
      image?.getAttribute("data-src") ||
      image?.getAttribute("data-original"),
  );

  if (!name && !id) return null;

  return {
    id,
    name: name || shortName,
    shortName: shortName || name,
    number,
    photo,
    role,
    line,
    zone,
  };
}

export async function getRKSportMatchLineups(
  matchId: string,
): Promise<RKSportTeamLineup[]> {
  console.log("НАЧИНАЕМ ЗАГРУЗКУ СОСТАВОВ RK SPORT:", matchId);

  const doc = await fetchRKSportPage(`/rksport/match/${matchId}`);

  const normalizeTeamName = (value: string): string =>
    cleanText(value)
      .toLocaleLowerCase()
      .replace(/ё/g, "е")
      .replace(/симферополь/g, "")
      .replace(/[^а-яa-z0-9]/gi, "");

  // Базовая роль из публичного протокола: ВР / З / П / Н.
  // Она остаётся резервом, если точная позиция из заявки неизвестна.
  const getLineByRole = (role: string): number => {
    const value = cleanText(role).toLocaleUpperCase();
    if (value.includes("ВР")) return 0;
    if (value.includes("З")) return 1;
    if (value.includes("П")) return 2;
    if (value.includes("Н")) return 3;
    return 2;
  };

  // Точные позиции из заявки ФК «Гвардия».
  // Сначала сопоставляем по ID профиля RK Sport — это надёжнее фамилии.
  // Для игроков, чей ID ещё не был опубликован в протоколе, оставлен
  // резерв по нормализованному имени.
  const exactPositionsById: Record<string, string> = {
    "8766289": "ВР",  // Очнев Кирилл
    "9886181": "ВР",  // Шишов Артём
    "7716590": "ЦЗ",  // Велиляев Ильяс
    "9889697": "ПЗ",  // Ирых Демирель
    "9889773": "ПЗ",  // Зинетдинов Керим
    "6324689": "ЛЗ",  // Селезнёв Владимир
    "9882258": "ЛП",  // Набоков Егор
    "10445602": "ПП", // Балюк Артём
    "6325276": "ЦП",  // Балюк Андрей
    "6448893": "П",   // Мустафаев Эмир
    "9889802": "З",   // Лапа Эмир
    "9889666": "З",   // Драновский Роман
    "10437538": "З",  // Соловищук Константин
  };

  const exactPositionsByName: Record<string, string> = {
    "очнев": "ВР",
    "шишов": "ВР",
    "велиляев": "ЦЗ",
    "ирых": "ПЗ",
    "зинетдинов": "ПЗ",
    "селезнев": "ЛЗ",
    "набоков": "ЛП",
    "чабанов": "Н",
    "очневкирилл": "ВР",
    "шишовартем": "ВР",
    "велиляевильяс": "ЦЗ",
    "ирыхдемирель": "ПЗ",
    "зинетдиновкерим": "ПЗ",
    "селезневвладимир": "ЛЗ",
    "набоковегор": "ЛП",
    "балюкартем": "ПП",
    "балюкандрей": "ЦП",
    "мустафаевэмир": "П",
    "чабановнуреддин": "Н",
    "лапаэмир": "З",
    "драновскийроман": "З",
    "соловищукконстантин": "З",
  };

  const normalizePlayerName = (value: string): string =>
    cleanText(value)
      .toLocaleLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^а-яa-z0-9]/gi, "");

  const getExactPosition = (id: string, name: string): string => {
    if (exactPositionsById[id]) return exactPositionsById[id];

    const normalizedName = normalizePlayerName(name);
    const exactNamePosition = exactPositionsByName[normalizedName];
    if (exactNamePosition) return exactNamePosition;

    // Некоторые протоколы показывают только фамилию или короткое имя.
    const surnameMatch = Object.entries(exactPositionsByName).find(
      ([key]) => key.length >= 5 && normalizedName.includes(key),
    );

    return surnameMatch?.[1] || "";
  };

  // line: 0 — вратарь, 1 — защита, 2 — полузащита, 3 — нападение.
  // zone: 0 — слева, 1 — по центру, 2 — справа.
  const getLineAndZone = (
    exactPosition: string,
    fallbackRole: string,
    fallbackZone: number,
  ): { line: number; zone: number } => {
    const position = exactPosition.toLocaleUpperCase();
    const exact: Record<string, { line: number; zone: number }> = {
      "ВР": { line: 0, zone: 1 },
      "ЛЗ": { line: 1, zone: 0 },
      "ЦЗ": { line: 1, zone: 1 },
      "ПЗ": { line: 1, zone: 2 },
      "ЛП": { line: 2, zone: 0 },
      "ЦП": { line: 2, zone: 1 },
      "ПП": { line: 2, zone: 2 },
      "Н": { line: 3, zone: 1 },
    };

    if (exact[position]) return exact[position];

    return {
      line: getLineByRole(fallbackRole),
      zone: fallbackZone,
    };
  };

  const getUnitTeamName = (unit: Element): string => {
    const team = unit.querySelector<HTMLAnchorElement>(".protocol__team");
    return (
      cleanText(team?.getAttribute("title")) ||
      cleanText(team?.textContent)
    );
  };

  const getUnitPlayers = (
    unit: HTMLElement,
    isSubstitute: boolean,
  ): RKSportLineupPlayer[] => {
    const items = Array.from(
      unit.querySelectorAll<HTMLElement>(
        ".protocol__list > .protocol__item:not(.protocol__item--empty)",
      ),
    );

    const zoneByLine = new Map<number, number>();
    const players: RKSportLineupPlayer[] = [];

    for (const item of items) {
      // В протоколе могут присутствовать пустые элементы и текст-заглушка.
      // Настоящая запись игрока обязательно содержит ссылку на его профиль.
      if (!item.querySelector(".protocol__link, a[href*='/player/']")) {
        continue;
      }

      const role = cleanText(item.querySelector(".protocol__role")?.textContent);
      const playerLink = item.querySelector<HTMLAnchorElement>(
        ".protocol__link, a[href*='/player/']",
      );
      const playerId =
        playerLink?.getAttribute("href")?.match(/\/player\/(\d+)/)?.[1] || "";
      const playerName =
        cleanText(item.querySelector(".protocol__name")?.textContent) ||
        cleanText(item.querySelector(".start__text")?.textContent) ||
        cleanText(item.querySelector("img")?.getAttribute("alt"));
      const exactPosition = getExactPosition(playerId, playerName);
      const fallbackLine = getLineByRole(role);
      const fallbackZone = zoneByLine.get(fallbackLine) ?? 0;
      const placement = isSubstitute
        ? { line: -1, zone: 0 }
        : getLineAndZone(exactPosition, role, fallbackZone);

      const player = parseLineupPlayer(
        item,
        placement.line,
        placement.zone,
      );

      if (!player) continue;
      players.push(player);

      if (!isSubstitute && !exactPosition) {
        zoneByLine.set(placement.line, fallbackZone + 1);
      }
    }

    return players;
  };

  const mainUnits = Array.from(
    doc.querySelectorAll<HTMLElement>(
      ".protocol__block--main .protocol__unit",
    ),
  );

  const lineups: RKSportTeamLineup[] = mainUnits
    .map((unit) => ({
      teamName: getUnitTeamName(unit),
      players: getUnitPlayers(unit, false),
      substitutes: [],
    }))
    .filter((lineup) => lineup.teamName.length > 0);

  const substituteUnits = Array.from(
    doc.querySelectorAll<HTMLElement>(
      ".protocol__block--additional .protocol__unit",
    ),
  );

  for (const unit of substituteUnits) {
    const teamName = getUnitTeamName(unit);
    const normalizedName = normalizeTeamName(teamName);

    if (!normalizedName) continue;

    const exactMatches = lineups.filter(
      (lineup) => normalizeTeamName(lineup.teamName) === normalizedName,
    );

    // Частичное совпадение используем только при единственном результате.
    const partialMatches = exactMatches.length > 0 || normalizedName.length < 4
      ? []
      : lineups.filter((lineup) => {
          const lineupName = normalizeTeamName(lineup.teamName);
          return (
            lineupName.length >= 4 &&
            (lineupName.includes(normalizedName) ||
              normalizedName.includes(lineupName))
          );
        });

    const candidates = exactMatches.length > 0 ? exactMatches : partialMatches;
    const target = candidates.length === 1 ? candidates[0] : undefined;

    if (!target) {
      console.warn("Не удалось сопоставить запасных с командой:", {
        teamName,
        teams: lineups.map((lineup) => lineup.teamName),
      });
      continue;
    }

    target.substitutes.push(...getUnitPlayers(unit, true));
  }

  const validLineups = lineups.filter(
    (lineup) => lineup.players.length > 0 || lineup.substitutes.length > 0,
  );

  console.log("СОСТАВЫ RK SPORT РАЗОБРАНЫ:", {
    matchId,
    mainUnits: mainUnits.length,
    substituteUnits: substituteUnits.length,
    lineups: validLineups.map((lineup) => ({
      teamName: lineup.teamName,
      starters: lineup.players.length,
      substitutes: lineup.substitutes.length,
      players: lineup.players.map((player) => ({
        name: player.name,
        role: player.role,
        line: player.line,
      })),
    })),
  });

  return validLineups;
}

/* =========================
   ТЕСТ ПОДКЛЮЧЕНИЯ
========================= */

export async function testRKSportConnection() {
  const matches = await getRKSportMatches();
  const table = await getRKSportTable();

  return {
    matches,
    table,
    matchesCount: matches.length,
    teamsCount: table.length,
  };
}
export async function getRKSportPlayerStats(
  playerId: string
): Promise<RKSportPlayerStats> {
  const doc = await fetchRKSportPage(`/rksport/player/${playerId}`);

  const getNumber = (value: string | null | undefined): number => {
    const match = (value ?? "").replace(/\s/g, "").match(/^\d+/);
    return match ? Number(match[0]) : 0;
  };

  const nameMain = cleanText(
    doc.querySelector(".player-promo__name-main")?.textContent ?? ""
  );

  const nameMiddle = cleanText(
    doc.querySelector(".player-promo__name-middle")?.textContent ?? ""
  );

  const imageElement =
    doc.querySelector<HTMLImageElement>(".player-promo__img") ??
    doc.querySelector<HTMLImageElement>('img[alt*="Фото игрока"]');

  const photoSrc =
    imageElement?.getAttribute("src") ||
    imageElement?.getAttribute("data-src") ||
    imageElement?.getAttribute("data-original") ||
    "";

  const photo = photoSrc
    ? new URL(photoSrc, "https://rksport8x8.ru").href
    : "";

  const rows = Array.from(doc.querySelectorAll("tr"));

  const teamRow = rows.find((row) => {
    const cells = Array.from(row.querySelectorAll("td"));
    if (cells.length < 6) return false;

    const teamName = cleanText(cells[0]?.textContent ?? "");

    return /гвардия/i.test(teamName);
  });

  const cells = teamRow
    ? Array.from(teamRow.querySelectorAll("td"))
    : [];

  const values = cells.slice(1, 6).map((cell) =>
    cleanText(cell.textContent ?? "")
  );

  console.log("Статистика игрока РК-Спорт:", {
    playerId,
    name: [nameMain, nameMiddle].filter(Boolean).join(" "),
    photo,
    teamRow: cells.map((cell) =>
      cleanText(cell.textContent ?? "")
    ),
    tables: Array.from(doc.querySelectorAll("table")).map((table) => ({
      className: table.className,
      rows: Array.from(table.querySelectorAll("tr")).map((row) =>
        Array.from(row.querySelectorAll("th, td")).map((cell) =>
          cleanText(cell.textContent ?? "")
        )
      ),
    })),
  });

  return {
    id: playerId,
    name: [nameMain, nameMiddle].filter(Boolean).join(" "),
    photo,
    matches: getNumber(values[0]),
    goals: getNumber(values[1]),
    assists: getNumber(values[2]),
    yellowCards: getNumber(values[3]),
    redCards: getNumber(values[4]),
  };
}