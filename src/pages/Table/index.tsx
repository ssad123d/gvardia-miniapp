import { useEffect, useState } from "react"; import { getTable } from "../../services/tournamentApi"; import type { TeamTableRow } from "../../services/tournamentApi";
import gvardiyaLogo from "../../assets/gvardiya.jpg"; import mfkLogo from "../../assets/mfk-simferopol.png"; import nazvanieLogo from "../../assets/nazvanie.png"; import interLogo from "../../assets/inter.png"; import selhozLogo from "../../assets/selhoz.png"; import duoLogo from "../../assets/duo.png"; import arsOilLogo from "../../assets/ars-oil.png"; import nomadLogo from "../../assets/nomad.png"; import superGeroiLogo from "../../assets/super-geroi.png"; import moguchayaKuchkaLogo from "../../assets/moguchaya-kuchka.png"; import rkSportLogo from "../../assets/rk-sport.png"; import ribizaLogo from "../../assets/ribiza.png";
import Playoff from "../Playoff";
const teamLogos: Record<string, string> = { "Сельхоз Юнайтед": selhozLogo, "DUO": duoLogo, "ARS OIL": arsOilLogo, "Nomad": nomadLogo, "Супер Герои": superGeroiLogo, "Могучая кучка | Buddies & Co.": moguchayaKuchkaLogo, "РК-Спорт": rkSportLogo, "МФК Симферополь": mfkLogo, "RIBIZA": ribizaLogo, "Интер-Национал": interLogo, "Гвардия": gvardiyaLogo, "Название": nazvanieLogo, };
function Table() { const [activeTab, setActiveTab] = useState<"table" | "playoff">("table");
const [teams, setTeams] = useState<TeamTableRow[]>([]);
useEffect(() => { getTable().then(setTeams); }, []);
if (activeTab === "playoff") { return ( <div> <div className="table-tabs">
      <button
        onClick={() => setActiveTab("table")}
      >
        🏆 Групповой этап
      </button>

      <button
        className="active"
        onClick={() => setActiveTab("playoff")}
      >
        ⚔️ Плей-офф
      </button>

    </div>

    <Playoff />
  </div>
);}
return ( <div className="table-page">
  <h1>ТАБЛИЦА</h1>

  <p className="table-subtitle">
    Кубок КСЛ
  </p>

  <div className="table-tabs">

    <button
      className="active"
      onClick={() => setActiveTab("table")}
    >
      🏆 Групповой этап
    </button>

    <button
      onClick={() => setActiveTab("playoff")}
    >
      ⚔️ Плей-офф
    </button>

  </div>

  <div className="table-wrapper">

    <div className="table-header">

      <div className="position">
        #
      </div>

      <div className="team-name">
        КОМАНДА
      </div>

      <div>И</div>
      <div>В</div>
      <div>Н</div>
      <div>П</div>
      <div>О</div>

    </div>

    {teams.map((team) => (

      <div
        className={`table-row ${
          team.name === "Гвардия"
            ? "gvardia-row"
            : ""
        }`}
        key={team.name}
      >

        <div className="position">
          {team.position}
        </div>

        <div className="team-name">

          <div className="team-logo">

            {teamLogos[team.name] ? (
              <img
                src={teamLogos[team.name]}
                alt={team.name}
              />
            ) : (
              <div className="team-logo-placeholder">
                {team.name.charAt(0)}
              </div>
            )}

          </div>

          <strong>
            {team.name ===
            "Могучая кучка | Buddies & Co."
              ? "Могучая кучка | Buddies ..."
              : team.name}
          </strong>

        </div>

        <div>
          {team.played}
        </div>

        <div>
          {team.wins}
        </div>

        <div>
          {team.draws}
        </div>

        <div>
          {team.losses}
        </div>

        <div className="points">
          {team.points}
        </div>

      </div>

    ))}

  </div>

  <div className="table-info">

    <p>
      <b>И</b> — игры
    </p>

    <p>
      <b>В</b> — победы
    </p>

    <p>
      <b>Н</b> — ничьи
    </p>

    <p>
      <b>П</b> — поражения
    </p>

    <p>
      <b>О</b> — очки
    </p>

  </div>

</div>); }
export default Table;