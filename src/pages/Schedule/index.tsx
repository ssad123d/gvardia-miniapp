import { useNavigate } from "react-router-dom";
import "./Schedule.css";

const matches = [
  {
    id: "1",
    date: "20 сентября 2026",
    time: "19:00",
    opponent: "Могучая Кучка",
    logo: "/src/assets/moguchaya-kuchka.png",
  },
  {
    id: "2",
    date: "27 сентября 2026",
    time: "18:30",
    opponent: "Сельхоз Юнайтед",
    logo: "/src/assets/selhoz.png",
  },
];

const gvardiyaLogo = "/src/assets/gvardiya.jpg";

export default function Schedule() {
  const navigate = useNavigate();

  return (
    <main className="schedule-page">

      <header className="schedule-header">
        <h1>РАСПИСАНИЕ</h1>
        <p>Матчи ФК «Гвардия»</p>
      </header>

      <section className="schedule-list">

        {matches.map((match) => (
          <button
            key={match.id}
            className="schedule-card"
            type="button"
            onClick={() => navigate(`/matches/${match.id}`)}
          >

            <div className="schedule-date">
              {match.date}
            </div>

            <div className="schedule-tournament">
              🏆 Кубок КСЛ
            </div>

            <div className="schedule-status">
              ПРЕДСТОЯЩИЙ МАТЧ
            </div>

            <div className="schedule-match">

              <div className="schedule-team">
                <img
                  src={gvardiyaLogo}
                  alt="Гвардия"
                />

                <span>ГВАРДИЯ</span>
              </div>

              <div className="schedule-center">
                <strong>VS</strong>

                <span>
                  {match.time}
                </span>
              </div>

              <div className="schedule-team">
                <img
                  src={match.logo}
                  alt={match.opponent}
                />

                <span>
                  {match.opponent}
                </span>
              </div>

            </div>

            <div className="schedule-place">
              📍 РК Спорт
            </div>

            <div className="schedule-arrow">
              ›
            </div>

          </button>
        ))}

      </section>

    </main>
  );
}