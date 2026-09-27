import "./MatchCard.css";
import guardiyaLogo from "../../assets/gvardiya.jpg";
import interLogo from "../../assets/inter.png";
export default function MatchCard() {
  return (
    <div className="match-card">
      <div className="league">
        Кубок КСЛ • Полуфинал
<div className="teams">

  <div className="team">
    <div className="badge">
      <img src={guardiyaLogo} alt="Гвардия" />
    </div>
    <span>Гвардия</span>
  </div>

  <div className="score">VS</div>

  <div className="team">
    <div className="badge">
      <img src={interLogo} alt="Интер-Национал" />
    </div>
    <span>Интер-Национал</span>
  </div>

</div>

<div className="info"></div>
        📅 24 августа 2026<br />
        🕖 19:00<br />
        📍 Стадион «РK-Спорт»
      </div>

      <button className="match-button">
        Подробнее
      </button>
    </div>
  );
}