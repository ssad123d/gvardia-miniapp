
import { useNavigate } from "react-router-dom";
import "./Squad.css";

type Player = {
  name: string;
  position: string;
  number?: number;
};

const squad = {
  goalkeepers: [
    { name: "Кирилл Очнев", position: "Вратарь" },
    { name: "Шишов Артём", position: "Вратарь", number: 99 },
  ],
  defenders: [
    { name: "Роман Драновский", position: "Защитник" },
    { name: "Керим Зинетдинов", position: "Защитник" },
    { name: "Демирель Ирых", position: "Защитник" },
    { name: "Константин Соловищук", position: "Защитник" },
    { name: "Ильяс Велиляев", position: "Защитник" },
    { name: "Максим Туник", position: "Защитник" },
    { name: "Рустам Тохиров", position: "Защитник" },
    { name: "Владимир Селезнёв", position: "Защитник" },
  ],
  midfielders: [
    { name: "Андрей Балюк", position: "Полузащитник" },
    { name: "Артем Балюк", position: "Полузащитник" },
    { name: "Арсен Гафаров", position: "Полузащитник" },
    { name: "Левиз Гафаров", position: "Полузащитник" },
    { name: "Егор Набоков", position: "Полузащитник" },
    { name: "Абдурашид Тохиров", position: "Полузащитник" },
    { name: "Эмир Лапа", position: "Полузащитник" },
    { name: "Эдем Мустафаев", position: "Полузащитник" },
    { name: "Сервер Османов", position: "Полузащитник" },
    { name: "Сейран Гафаров", position: "Полузащитник" },
  ],
  forwards: [
    { name: "Ислям Таиров", position: "Нападающий" },
    { name: "Нуреддин Чабанов", position: "Нападающий" },
    { name: "Эмир Мустафаев", position: "Нападающий" },
  ],
};

const totalPlayers =
  squad.goalkeepers.length +
  squad.defenders.length +
  squad.midfielders.length +
  squad.forwards.length;

function playerWord(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return "игрок";
  if (
    count % 10 >= 2 &&
    count % 10 <= 4 &&
    (count % 100 < 12 || count % 100 > 14)
  ) {
    return "игрока";
  }
  return "игроков";
}

type PositionSectionProps = {
  title: string;
  icon: string;
  players: Player[];
};

function PositionSection({
  title,
  icon,
  players,
}: PositionSectionProps) {
  const navigate = useNavigate();

  const openPlayer = (name: string) => {
    const playerId = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zа-я0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");

    navigate(`/squad/player/${playerId}`);
  };

  return (
    <section className="position-section">
      <div className="position-header">
        <div className="position-title">
          <span className="position-icon">{icon}</span>
          <h2>{title}</h2>
        </div>

        <span className="player-count">
          {players.length} {playerWord(players.length)}
        </span>
      </div>

      <div className="players-list">
        {players.map((player, index) => (
          <button
            type="button"
            className="player-card"
            key={player.name}
            onClick={() => openPlayer(player.name)}
          >
            <div className="player-number">
              {String(player.number ?? index + 1).padStart(2, "0")}
            </div>

            <div className="player-avatar">
              {player.name.charAt(0)}
            </div>

            <div className="player-info">
              <div className="player-name">{player.name}</div>
              <div className="player-position">{player.position}</div>
            </div>

            <div className="player-arrow">›</div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function Squad() {
  return (
    <div className="squad-page">
      <div className="squad-header">
        <div>
          <h1>Состав команды</h1>
          <p>ФК «Гвардия»</p>
        </div>

        <div className="squad-total">
          <strong>{totalPlayers}</strong>
          <span>{playerWord(totalPlayers)}</span>
        </div>
      </div>

      <div className="squad-content">
        <PositionSection
          title="Вратари"
          icon="🧤"
          players={squad.goalkeepers}
        />

        <PositionSection
          title="Защитники"
          icon="🛡️"
          players={squad.defenders}
        />

        <PositionSection
          title="Полузащитники"
          icon="⚡"
          players={squad.midfielders}
        />

        <PositionSection
          title="Нападающие"
          icon="⚽"
          players={squad.forwards}
        />
      </div>
    </div>
  );
}
