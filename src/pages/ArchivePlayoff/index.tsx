import { useNavigate } from "react-router-dom";

export default function ArchivePlayoff() {
  const navigate = useNavigate();

  const quarterfinals = [
    {
      team1: "Сельхоз Юнайтед",
      logo1: "/src/assets/selhoz.png",
      team2: "Nomad",
      logo2: "/src/assets/nomad.png",
    },
    {
      team1: "DUO",
      logo1: "/src/assets/duo.png",
      team2: "ARS OIL",
      logo2: "/src/assets/ars-oil.png",
    },
    {
      team1: "Супер Герои",
      logo1: "/src/assets/super-geroi.png",
      team2: "МФК Симферополь",
      logo2: null,
    },
    {
      team1: "Могучая Кучка | Buddies & Co.",
      logo1: "/src/assets/moguchaya-kuchka.png",
      team2: "РК-Спорт",
      logo2: "/src/assets/rk-sport.png",
    },
  ];

  const semifinals = [
    {
      team1: "Сельхоз Юнайтед",
      logo1: "/src/assets/selhoz.png",
      score: "6 : 5",
      team2: "Nomad",
      logo2: "/src/assets/nomad.png",
    },
    {
      team1: "DUO",
      logo1: "/src/assets/duo.png",
      score: "3 : 4",
      team2: "ARS OIL",
      logo2: "/src/assets/ars-oil.png",
    },
    {
      team1: "Супер Герои",
      logo1: "/src/assets/super-geroi.png",
      score: "4 : 3",
      team2: "МФК Симферополь",
      logo2: null,
    },
    {
      team1: "Могучая Кучка | Buddies & Co.",
      logo1: "/src/assets/moguchaya-kuchka.png",
      score: "3 : 2",
      team2: "РК-Спорт",
      logo2: "/src/assets/rk-sport.png",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f1013",
        color: "#fff",
        padding: "24px 14px 110px",
      }}
    >
      {/* Назад */}
      <button
        type="button"
        onClick={() => navigate("/tournaments/archive")}
        style={{
          border: "none",
          background: "transparent",
          color: "#ffd900",
          fontSize: 15,
          fontWeight: 700,
          padding: "4px 0 20px",
          cursor: "pointer",
        }}
      >
        ← Назад к турниру
      </button>

      {/* Заголовок */}
      <header
        style={{
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        <div
          style={{
            color: "#ffd900",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 7,
          }}
        >
          КУБОК КСЛ 2025/26
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 31,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: 1,
          }}
        >
          ПЛЕЙ-ОФФ
        </h1>

        <p
          style={{
            marginTop: 9,
            color: "#a5a5a5",
            fontSize: 13,
          }}
        >
          Архив завершённого турнира
        </p>
      </header>

      {/* Четвертьфиналы */}
      <section>
        <h2
          style={{
            margin: "0 0 15px",
            color: "#ffd900",
            fontSize: 19,
            fontWeight: 900,
            textTransform: "uppercase",
          }}
        >
          Четвертьфинал
        </h2>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {quarterfinals.map((match, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #806d00",
                borderRadius: 16,
                background:
                  "linear-gradient(145deg, #303136, #1c1d21)",
                padding: "14px 12px",
              }}
            >
              <div
                style={{
                  color: "#777",
                  fontSize: 10,
                  fontWeight: 800,
                  marginBottom: 12,
                  textTransform: "uppercase",
                }}
              >
                Пара {index + 1}
              </div>

              <TeamRow
                name={match.team1}
                logo={match.logo1}
              />

              <div
                style={{
                  height: 1,
                  background: "#414146",
                  margin: "10px 0",
                }}
              />

              <TeamRow
                name={match.team2}
                logo={match.logo2}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Линия */}
      <div
        style={{
          height: 1,
          background: "#39393d",
          margin: "32px 0",
        }}
      />

      {/* Полуфиналы */}
      <section>
        <h2
          style={{
            margin: "0 0 15px",
            color: "#ffd900",
            fontSize: 19,
            fontWeight: 900,
            textTransform: "uppercase",
          }}
        >
          Полуфинал
        </h2>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {semifinals.map((match, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #806d00",
                borderRadius: 16,
                background:
                  "linear-gradient(145deg, #303136, #1c1d21)",
                padding: "14px 12px",
              }}
            >
              <div
                style={{
                  color: "#777",
                  fontSize: 10,
                  fontWeight: 800,
                  marginBottom: 12,
                  textTransform: "uppercase",
                }}
              >
                Полуфинал {index + 1}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 72px 1fr",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <TeamRow
                  name={match.team1}
                  logo={match.logo1}
                  center
                />

                <div
                  style={{
                    textAlign: "center",
                    color: "#ffd900",
                    fontSize: 21,
                    fontWeight: 900,
                  }}
                >
                  {match.score}
                </div>

                <TeamRow
                  name={match.team2}
                  logo={match.logo2}
                  center
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Финал */}
      <section
        style={{
          marginTop: 35,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            margin: "0 0 15px",
            color: "#ffd900",
            fontSize: 19,
            fontWeight: 900,
            textTransform: "uppercase",
          }}
        >
          🏆 Финал
        </h2>

        <div
          style={{
            border: "1px solid #c8a900",
            borderRadius: 22,
            background:
              "linear-gradient(145deg, #36372f, #1b1c20)",
            padding: "25px 18px",
            textAlign: "center",
            boxShadow: "0 0 25px rgba(255, 217, 0, 0.08)",
          }}
        >
          <div
            style={{
              fontSize: 34,
              marginBottom: 13,
            }}
          >
            🏆
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 45px 1fr",
              alignItems: "center",
              gap: 8,
            }}
          >
            <TeamRow
              name="Сельхоз Юнайтед"
              logo="/src/assets/selhoz.png"
              center
            />

            <div
              style={{
                color: "#ffd900",
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              VS
            </div>

            <TeamRow
              name="ARS OIL"
              logo="/src/assets/ars-oil.png"
              center
            />
          </div>

          <div
            style={{
              height: 1,
              background: "#555",
              margin: "20px 0 12px",
            }}
          />

          <span
            style={{
              color: "#999",
              fontSize: 12,
            }}
          >
            Финал турнира
          </span>
        </div>
      </section>

      {/* Назад */}
      <button
        type="button"
        onClick={() => navigate("/tournaments/archive")}
        style={{
          width: "100%",
          marginTop: 28,
          padding: "15px",
          border: "none",
          borderRadius: 14,
          background: "#ffd900",
          color: "#171717",
          fontSize: 15,
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        ← Вернуться к турниру
      </button>
    </main>
  );
}

function TeamRow({
  name,
  logo,
  center = false,
}: {
  name: string;
  logo: string | null;
  center?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        gap: 9,
        minWidth: 0,
        textAlign: center ? "center" : "left",
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt={name}
          style={{
            width: 35,
            height: 35,
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: 35,
            height: 35,
            borderRadius: "50%",
            background: "#292a2e",
            border: "1px solid #555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777",
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          ?
        </div>
      )}

      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {name}
      </span>
    </div>
  );
}