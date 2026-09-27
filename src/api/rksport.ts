const TOURNAMENT_ID = 1067181;

const TOURNAMENT_URL =
  `https://rksport8x8.ru/tournament/${TOURNAMENT_ID}/tables`;

type Team = {
  id: string;
  position: number;
  name: string;
  city: string;
  logo: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDifference: string;
  points: number;
};

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function cleanText(text: string): string {
  return decodeHtml(
    text.replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function getNumber(text: string): number {
  const match = text.match(/\d+/);

  return match ? Number(match[0]) : 0;
}

function parseTeams(html: string): Team[] {
  const teams: Team[] = [];

  const rowRegex =
    /<li class="custom-table__line">([\s\S]*?)<\/li>/g;

  const rows = html.matchAll(rowRegex);

  for (const rowMatch of rows) {
    const row = rowMatch[1];

    const positionMatch = row.match(
      /custom-table__number-wrapper">\s*(\d+)\s*<\/div>/
    );

    const teamMatch = row.match(
      /href="\/tournament\/1067181\/teams\/application\?team_id=(\d+)"[\s\S]*?custom-table__team-name">\s*([\s\S]*?)\s*<\/div>[\s\S]*?custom-table__team-attribute">\s*([\s\S]*?)\s*<\/div>/
    );

    const logoMatch = row.match(
      /custom-table__team-img"[^>]*src="([^"]+)"/
    );

    const values = [
      ...row.matchAll(
        /custom-table__content">\s*([\s\S]*?)\s*<\/div>/g
      ),
    ]
      .map((match) => cleanText(match[1]))
      .filter((value) => value !== "");

    if (!positionMatch || !teamMatch) {
      continue;
    }

    const position = Number(positionMatch[1]);

    const id = teamMatch[1];

    const name = cleanText(teamMatch[2]);

    const city = cleanText(teamMatch[3]);

    const logo = logoMatch?.[1] ?? "";

    const played = getNumber(values[1] ?? "0");

    const wins = getNumber(values[2] ?? "0");

    const draws = getNumber(values[3] ?? "0");

    const losses = getNumber(values[4] ?? "0");

    const goalDifference = values[5] ?? "0 - 0";

    const points = getNumber(values[6] ?? "0");

    teams.push({
      id,
      position,
      name,
      city,
      logo,
      played,
      wins,
      draws,
      losses,
      goalDifference,
      points,
    });
  }

  return teams;
}
export default async function handler(): Promise<Response> {
  try {
    const response = await fetch(TOURNAMENT_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "RK Sport returned an error",
          status: response.status,
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const html = await response.text();

    const teams = parseTeams(html);

    return new Response(
      JSON.stringify({
        success: true,
        tournament: {
          id: TOURNAMENT_ID,
          name: "КСЛ 2026/27",
          url: TOURNAMENT_URL,
        },
        teams,
        count: teams.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "s-maxage=60, stale-while-revalidate=300",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}