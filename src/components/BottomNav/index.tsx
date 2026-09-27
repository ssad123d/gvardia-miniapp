import { NavLink } from "react-router-dom";

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/">
        🏠
        <span>Главная</span>
      </NavLink>

      <NavLink to="/matches">
        ⚽
        <span>Матчи</span>
      </NavLink>

      <NavLink to="/schedule">
        📅
        <span>Расписание</span>
      </NavLink>

      <NavLink to="/tournaments">
        🏆
        <span>Турниры</span>
      </NavLink>

      <NavLink to="/squad">
        👥
        <span>Состав</span>
      </NavLink>

      <NavLink to="/news">
        📰
        <span>Новости</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;