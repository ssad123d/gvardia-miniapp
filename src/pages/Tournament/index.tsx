import { useNavigate, useParams } from "react-router-dom";
import "./Tournament.css";

const tournamentData = {
  current: {
    title: "Кубок КСЛ 2026/27",
    status: "СКОРО СТАРТ",
    period: "Новый чемпионат",
    description:
      "Новый сезон Кубка КСЛ. Официальная информация об участниках, формате и расписании появится позже.",
    archive: false,
  },

  archive: {
    title: "Кубок КСЛ 2025/26",
    status: "ЗАВЕРШЁН",
    period: "Сезон 2025/26",
    description:
      "Завершённый чемпионат ФК «Гвардия». Здесь сохранена история выступления команды.",
    archive: true,
  },
};

export default function Tournament() {
  const navigate = useNavigate();
  const { id } = useParams();

  const tournament =
    tournamentData[id as keyof typeof tournamentData];

  if (!tournament) {
    return (
      <main className="tournament-page">
        <button
          className="tournament-back"
          type="button"
          onClick={() => navigate("/tournaments")}
        >
          ← Назад к турнирам
        </button>

        <div className="tournament-not-found">
          <div>🏆</div>
          <h1>Турнир не найден</h1>
          <p>Такого турнира пока нет в приложении.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="tournament-page">
      <button
        className="tournament-back"
        type="button"
        onClick={() => navigate("/tournaments")}
      >
        ← Назад к турнирам
      </button>

      <section className="tournament-hero">
        <div className="tournament-hero-icon">🏆</div>

        <span className="tournament-hero-status">
          {tournament.status}
        </span>

        <h1>{tournament.title}</h1>

        <p className="tournament-period">
          {tournament.period}
        </p>

        <p className="tournament-description">
          {tournament.description}
        </p>
      </section>

      <section className="tournament-sections">
        {tournament.archive ? (
          <>
            {/* Результаты матчей */}
            <button
              type="button"
              className="tournament-section-card"
              onClick={() =>
                navigate("/tournaments/archive/matches")
              }
            >
              <div className="section-icon">⚽</div>

              <div>
                <strong>Результаты матчей</strong>
                <span>Все сыгранные матчи</span>
              </div>

              <b>›</b>
            </button>

            {/* Итоговая таблица */}
            <button
              type="button"
              className="tournament-section-card"
              onClick={() =>
                navigate("/tournaments/archive/table")
              }
            >
              <div className="section-icon">🏆</div>

              <div>
                <strong>Итоговая таблица</strong>
                <span>Положение команд</span>
              </div>

              <b>›</b>
            </button>

            {/* Плей-офф */}
            <button
              type="button"
              className="tournament-section-card"
              onClick={() =>
                navigate("/tournaments/archive/playoff")
              }
            >
              <div className="section-icon">🥇</div>

              <div>
                <strong>Плей-офф</strong>
                <span>Сетка завершённого турнира</span>
              </div>

              <b>›</b>
            </button>

            {/* Статистика */}
            <button
              type="button"
              className="tournament-section-card"
            >
              <div className="section-icon">📊</div>

              <div>
                <strong>Статистика игроков</strong>
                <span>Голы и ассисты</span>
              </div>

              <b>›</b>
            </button>
          </>
        ) : (
          <>
            {/* Участники */}
            <div className="tournament-section-card disabled">
              <div className="section-icon">👥</div>

              <div>
                <strong>Участники</strong>
                <span>Информация появится позже</span>
              </div>

              <b>—</b>
            </div>

            {/* Календарь */}
            <div className="tournament-section-card disabled">
              <div className="section-icon">📅</div>

              <div>
                <strong>Календарь</strong>
                <span>Расписание ещё не опубликовано</span>
              </div>

              <b>—</b>
            </div>

            {/* Турнирная таблица */}
            <div className="tournament-section-card disabled">
              <div className="section-icon">🏆</div>

              <div>
                <strong>Турнирная таблица</strong>
                <span>Появится после старта чемпионата</span>
              </div>

              <b>—</b>
            </div>

            {/* Матчи Гвардии */}
            <div className="tournament-section-card disabled">
              <div className="section-icon">⚽</div>

              <div>
                <strong>Матчи «Гвардии»</strong>
                <span>Матчи появятся после жеребьёвки</span>
              </div>

              <b>—</b>
            </div>

            {/* Статистика */}
            <div className="tournament-section-card disabled">
              <div className="section-icon">📊</div>

              <div>
                <strong>Статистика</strong>
                <span>Станет доступна после первых матчей</span>
              </div>

              <b>—</b>
            </div>
          </>
        )}
      </section>

      {!tournament.archive && (
        <section className="tournament-info">
          <div className="tournament-info-icon">ℹ</div>

          <div>
            <strong>
              Информация обновится после объявления турнира
            </strong>

            <p>
              Когда организаторы объявят участников, формат
              турнира и календарь, эти данные можно будет добавить
              сюда без изменения структуры приложения.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}