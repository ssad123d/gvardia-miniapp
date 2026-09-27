import { useNavigate } from "react-router-dom";
import "./Tournaments.css";

const tournaments = [
  {
    id: "current",
    title: "Кубок КСЛ 2026/27",
    status: "СКОРО",
    statusType: "current",
    description:
      "Новый чемпионат ФК «Гвардия». Информация об участниках и календаре появится позже.",
  },
  {
    id: "archive",
    title: "Кубок КСЛ 2025/26",
    status: "ЗАВЕРШЁН",
    statusType: "archive",
    description:
      "Завершённый чемпионат. Таблица, результаты и плей-офф доступны в архиве.",
  },
];

export default function Tournaments() {
  const navigate = useNavigate();

  return (
    <main className="tournaments-page">
      <header className="tournaments-header">
        <div className="tournaments-header-icon">🏆</div>

        <div>
          <h1>ТУРНИРЫ</h1>
          <p>История и будущие чемпионаты</p>
        </div>
      </header>

      <section className="tournaments-intro">
        <span>ФК «ГВАРДИЯ»</span>

        <h2>Наши турниры</h2>

        <p>
          Следи за выступлениями команды, результатами матчей
          и историей чемпионатов.
        </p>
      </section>

      <section className="tournaments-list">
        {tournaments.map((tournament) => (
          <button
            key={tournament.id}
            type="button"
            className={`tournament-card ${tournament.statusType}`}
            onClick={() =>
              navigate(`/tournaments/${tournament.id}`)
            }
          >
            <div className="tournament-top">
              <div className="tournament-icon">🏆</div>

              <span className="tournament-status">
                {tournament.status}
              </span>
            </div>

            <h3>{tournament.title}</h3>

            <p>{tournament.description}</p>

            <div className="tournament-bottom">
              <span>
                {tournament.statusType === "current"
                  ? "Открыть чемпионат"
                  : "Открыть архив"}
              </span>

              <strong>›</strong>
            </div>
          </button>
        ))}
      </section>

      <section className="tournaments-note">
        <div className="tournaments-note-icon">ℹ</div>

        <div>
          <strong>Новый чемпионат скоро</strong>

          <p>
            Как только появится официальная информация
            об участниках, формате и расписании, она будет
            добавлена сюда.
          </p>
        </div>
      </section>
    </main>
  );
}