import { useNavigate, useParams } from "react-router-dom"; import "./Player.css";
type PlayerStats = { name: string; position: string; matches: number; goals: number; assists: number; yellowCards: number; redCards: number; };
const players: PlayerStats[] = [ { name: "Кирилл Очнев", position: "Вратарь", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Алим Белялов", position: "Вратарь", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Роман Драновский", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Керим Зинетдинов", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Эмиль Джелилов", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Демирель Ирых", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Константин Соловищук", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Павел Шиховцов", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Ильяс Велиляев", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Максим Туник", position: "Защитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, },
{ name: "Андрей Балюк", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Арсен Гафаров", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Егор Набоков", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Абдурашид Тохиров", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Эмир Лапа", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Владимир Баранов", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Владимир Селезнев", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Эдем Мустафаев", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Рустам Тохиров", position: "Полузащитник", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, },
{ name: "Ислям Таиров", position: "Нападающий", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Нурик Чабанов", position: "Нападающий", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, { name: "Эмир Мустафаев", position: "Нападающий", matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, }, ];
function createPlayerId(name: string): string { return name .toLowerCase() .replace(/ё/g, "е") .replace(/\s+/g, "-"); }
function Player() { const navigate = useNavigate(); const { id } = useParams();
const player = players.find( (item) => createPlayerId(item.name) === id );
if (!player) { return ( <div className="player-page"> <button className="back-button" onClick={() => navigate("/squad")} > ← Назад </button>
    <div className="player-not-found">
      <h2>Игрок не найден</h2>
    </div>
  </div>
);}
return ( <div className="player-page">
  <button
    className="back-button"
    onClick={() => navigate("/squad")}
  >
    ← Назад
  </button>

  <div className="player-profile">

    <div className="player-avatar">
      {player.name.charAt(0)}
    </div>

    <h1>{player.name}</h1>

    <p>{player.position}</p>

  </div>

  <section className="stats-section">

    <h2>Статистика</h2>

    <div className="stats-grid">

      <div className="stat-card">
        <span className="stat-icon">⚽</span>
        <strong>{player.goals}</strong>
        <span>Голы</span>
      </div>

      <div className="stat-card">
        <span className="stat-icon">🅰️</span>
        <strong>{player.assists}</strong>
        <span>Ассисты</span>
      </div><div className="stat-card">
        <span className="stat-icon">🏟️</span>
        <strong>{player.matches}</strong>
        <span>Матчи</span>
      </div>

      <div className="stat-card">
        <span className="stat-icon">🟨</span>
        <strong>{player.yellowCards}</strong>
        <span>Жёлтые карточки</span>
      </div>

      <div className="stat-card">
        <span className="stat-icon">🟥</span>
        <strong>{player.redCards}</strong>
        <span>Красные карточки</span>
      </div>

    </div>

  </section>

  <section className="matches-section">

    <h2>Последние матчи</h2>

    <div className="empty-matches">
      Статистика матчей появится здесь
    </div>

  </section>

</div>); }
export default Player;