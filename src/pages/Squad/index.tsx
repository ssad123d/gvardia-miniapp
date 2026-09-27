import "./Squad.css";
type Player = { name: string; position: string; };
const squad = { goalkeepers: [ { name: "Кирилл Очнев", position: "Вратарь" }, { name: "Алим Белялов", position: "Вратарь" }, ],
defenders: [ { name: "Роман Драновский", position: "Защитник" }, { name: "Керим Зинетдинов", position: "Защитник" }, { name: "Эмиль Джелилов", position: "Защитник" }, { name: "Демирель Ирых", position: "Защитник" }, { name: "Константин Соловищук", position: "Защитник" }, { name: "Павел Шиховцов", position: "Защитник" }, { name: "Ильяс Велиляев", position: "Защитник" }, { name: "Максим Туник", position: "Защитник" }, ],
midfielders: [ { name: "Андрей Балюк", position: "Полузащитник" }, { name: "Арсен Гафаров", position: "Полузащитник" }, { name: "Егор Набоков", position: "Полузащитник" }, { name: "Абдурашид Тохиров", position: "Полузащитник" }, { name: "Эмир Лапа", position: "Полузащитник" }, { name: "Владимир Баранов", position: "Полузащитник" }, { name: "Владимир Селезнев", position: "Полузащитник" }, { name: "Эдем Мустафаев", position: "Полузащитник" }, { name: "Рустам Тохиров", position: "Полузащитник" }, ],
forwards: [ { name: "Ислям Таиров", position: "Нападающий" }, { name: "Нуреддин Чабанов", position: "Нападающий" }, { name: "Эмир Мустафаев", position: "Нападающий" }, ], };
type PositionSectionProps = { title: string; icon: string; players: Player[]; };
function PositionSection({ title, icon, players, }: PositionSectionProps) { const openPlayer = (name: string) => { const playerId = name .toLowerCase() .replace(/ё/g, "е") .replace(/\s+/g, "-");
window.location.href = `/squad/player/${playerId}`;};
return ( <section className="position-section"> <div className="position-header"> <div className="position-title"> <span className="position-icon">{icon}</span>
      <h2>{title}</h2>
    </div>

    <span className="player-count">
      {players.length}{" "}
      {players.length === 1
        ? "игрок"
        : players.length >= 2 && players.length <= 4
        ? "игрока"
        : "игроков"}
    </span>
  </div>

  <div className="players-list">
    {players.map((player, index) => (
      <div
        className="player-card"
        key={player.name}
        onClick={() => openPlayer(player.name)}
      >
        <div className="player-number">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="player-avatar">
          {player.name.charAt(0)}
        </div>

        <div className="player-info">
          <div className="player-name">
            {player.name}
          </div>

          <div className="player-position">
            {player.position}
          </div>
        </div>

        <div className="player-arrow">
          ›
        </div>
      </div>
    ))}
  </div>
</section>); }
function Squad() { return ( <div className="squad-page"> <div className="squad-header"> <div> <h1>Состав команды</h1> <p>ФК «Гвардия»</p> </div>
    <div className="squad-total">
      <strong>22</strong>
      <span>игрока</span>
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
</div>); }
export default Squad;