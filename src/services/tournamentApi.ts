export type Match = {
  id: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  score1: number | null;
  score2: number | null;
  status: "finished" | "upcoming";
};

export type TeamTableRow = {
  position: number;
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

const matches: Match[] = [
  {
    id: "match-30-august",
    date: "30 АВГУСТА",
    time: "18:00",
    team1: "ГВАРДИЯ",
    team2: "ИНТЕР",
    score1: null,
    score2: null,
    status: "upcoming",
  },
  {
    id: "match-26-august",
    date: "26 АВГУСТА",
    time: "20:00",
    team1: "ГВАРДИЯ",
    team2: "ИНТЕР",
    score1: 3,
    score2: 0,
    status: "finished",
  },
];

const table: TeamTableRow[] = [
  {
    position: 1,
    name: "Сельхоз Юнайтед",
    played: 8,
    wins: 6,
    draws: 2,
    losses: 0,
    points: 20,
  },
  {
    position: 2,
    name: "DUO",
    played: 8,
    wins: 6,
    draws: 2,
    losses: 0,
    points: 20,
  },
  {
    position: 3,
    name: "ARS OIL",
    played: 8,
    wins: 5,
    draws: 0,
    losses: 3,
    points: 15,
  },
  {
    position: 4,
    name: "Nomad",
    played: 8,
    wins: 5,
    draws: 0,
    losses: 3,
    points: 15,
  },
  {
    position: 5,
    name: "Супер Герои",
    played: 8,
    wins: 4,
    draws: 2,
    losses: 2,
    points: 14,
  },
  {
    position: 6,
    name: "Могучая кучка | Buddies & Co.",
    played: 8,
    wins: 4,
    draws: 0,
    losses: 4,
    points: 12,
  },
  {
    position: 7,
    name: "РК-Спорт",
    played: 8,
    wins: 3,
    draws: 1,
    losses: 4,
    points: 10,
  },
  {
    position: 8,
    name: "МФК Симферополь",
    played: 8,
    wins: 3,
    draws: 0,
    losses: 5,
    points: 9,
  },
  {
    position: 9,
    name: "RIBIZA",
    played: 8,
    wins: 2,
    draws: 1,
    losses: 5,
    points: 7,
  },
  {
    position: 10,
    name: "Интер-Национал",
    played: 8,
    wins: 2,
    draws: 1,
    losses: 5,
    points: 7,
  },
  {
    position: 11,
    name: "Гвардия",
    played: 8,
    wins: 2,
    draws: 0,
    losses: 6,
    points: 6,
  },
  {
    position: 12,
    name: "Название",
    played: 8,
    wins: 1,
    draws: 1,
    losses: 6,
    points: 4,
  },
];

export async function getMatches(): Promise<Match[]> {
  return matches;
}

export async function getTable(): Promise<TeamTableRow[]> {
  return table;
}