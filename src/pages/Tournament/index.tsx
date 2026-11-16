import { useNavigate, useParams } from "react-router-dom"; import "./Tournament.css";
const tournamentData = { current: { title: "Корпоративная Супер Лига", status: "ИДЁТ", period: "Сезон 2026/27", description: "Новый чемпионат ФК «Гвардия». Следи за матчами, турнирной таблицей и расписанием нового сезона.", archive: false, },
archive: { title: "Кубок КСЛ 2025/26", status: "ЗАВЕРШЁН", period: "Сезон 2025/26", description: "Завершённый чемпионат ФК «Гвардия». Здесь сохранена история выступления команды.", archive: true, }, };
export default function Tournament() { const navigate = useNavigate(); const { id } = useParams();
const tournament = tournamentData[id as keyof typeof tournamentData];
if (!tournament) { return ( <main className="tournament-page"> <button className="tournament-back" type="button" onClick={() => navigate("/tournaments")} > ← Назад к турнирам </button>
    <div className="tournament-not-found">
      <div>🏆</div>

      <h1>Турнир не найден</h1>

      <p>
        Такого турнира пока нет в приложении.
      </p>
    </div>
  </main>
);}
return ( <main className="tournament-page"> <button className="tournament-back" type="button" onClick={() => navigate("/tournaments")} > ← Назад к турнирам </button>
  <section className="tournament-hero">
    <div className="tournament-hero-icon">
      🏆
    </div>

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
        {/* Архивные матчи */}
        <button
          type="button"
          className="tournament-section-card"
          onClick={() =>
            navigate("/tournaments/archive/matches")
          }
        >
          <div className="section-icon">
            ⚽
          </div>

          <div>
            <strong>
              Результаты матчей
            </strong>

            <span>
              Все сыгранные матчи
            </span>
          </div>

          <b>›</b>
        </button>

        {/* Архивная таблица */}
        <button
          type="button"
          className="tournament-section-card"
          onClick={() =>
            navigate("/tournaments/archive/table")
          }
        >
          <div className="section-icon">
            🏆
          </div>

          <div>
            <strong>
              Итоговая таблица
            </strong>

            <span>
              Положение команд
            </span>
          </div>

          <b>›</b>
        </button>

        {/* Архивный плей-офф */}
        <button
          type="button"
          className="tournament-section-card"
          onClick={() =>
            navigate("/tournaments/archive/playoff")
          }
        >
          <div className="section-icon">
            🥇
          </div>

          <div>
            <strong>
              Плей-офф
            </strong>

            <span>
              Сетка завершённого турнира
            </span>
          </div>

          <b>›</b>
        </button>

        {/* Статистика */}
        <button
          type="button"
          className="tournament-section-card"
        >
          <div className="section-icon">
            📊
          </div>

          <div>
            <strong>
              Статистика игроков
            </strong>

            <span>
              Голы и ассисты
            </span>
          </div>

          <b>›</b>
        </button>
      </>
    ) : (
      <>
        {/* Участники */}
        <button
          type="button"
          className="tournament-section-card"
          onClick={() =>
            navigate("/table")
          }
        >
          <div className="section-icon">
            👥
          </div>

          <div>
            <strong>
              Участники
            </strong>

            <span>
              18 команд нового сезона</span>
          </div>

          <b>›</b>
        </button>

        {/* Расписание */}
        <button
          type="button"
          className="tournament-section-card"
          onClick={() =>
            navigate("/schedule")
          }
        >
          <div className="section-icon">
            📅
          </div>

          <div>
            <strong>
              Календарь
            </strong>

            <span>
              Расписание матчей
            </span>
          </div>

          <b>›</b>
        </button>

        {/* Турнирная таблица */}
        <button
          type="button"
          className="tournament-section-card"
          onClick={() =>
            navigate("/table")
          }
        >
          <div className="section-icon">
            🏆
          </div>

          <div>
            <strong>
              Турнирная таблица
            </strong>

            <span>
              Актуальное положение команд
            </span>
          </div>

          <b>›</b>
        </button>

        {/* Матчи Гвардии */}
        <button
          type="button"
          className="tournament-section-card"
          onClick={() =>
            navigate("/matches")
          }
        >
          <div className="section-icon">
            ⚽
          </div>

          <div>
            <strong>
              Матчи «Гвардии»
            </strong>

            <span>
              Результаты и ближайшие игры
            </span>
          </div>

          <b>›</b>
        </button>

        {/* Статистика */}
        <button
          type="button"
          className="tournament-section-card"
        >
          <div className="section-icon">
            📊
          </div>

          <div>
            <strong>
              Статистика
            </strong>

            <span>
              Статистика игроков
            </span>
          </div>

          <b>›</b>
        </button>
      </>
    )}
  </section>

  {!tournament.archive && (
    <section className="tournament-info">
      <div className="tournament-info-icon">
        ℹ
      </div>

      <div>
        <strong>
          Новый сезон уже начался
        </strong>

        <p>
          В чемпионате участвуют 18 команд.
          Следи за результатами матчей и
          актуальной турнирной таблицей.
        </p>
      </div>
    </section>
  )}
</main>); }