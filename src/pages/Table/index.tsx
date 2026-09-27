import gvardiyaLogo from "../../assets/gvardiya.jpg"; import interLogo from "../../assets/inter.png"; import selhozLogo from "../../assets/selhoz.png"; import duoLogo from "../../assets/duo.png"; import arsOilLogo from "../../assets/ars-oil.png"; import nomadLogo from "../../assets/nomad.png"; import superGeroiLogo from "../../assets/super-geroi.png"; import moguchayaKuchkaLogo from "../../assets/moguchaya-kuchka.png"; import rkSportLogo from "../../assets/rk-sport.png";
type Team = { name: string; logo: string | null; games: number; wins: number; draws: number; losses: number; points: number; };
const teams: Team[] = [ { name: "Сельхоз Юнайтед", logo: selhozLogo, games: 8, wins: 6, draws: 2, losses: 0, points: 20, }, { name: "DUO", logo: duoLogo, games: 8, wins: 6, draws: 2, losses: 0, points: 20, }, { name: "ARS OIL", logo: arsOilLogo, games: 8, wins: 5, draws: 0, losses: 3, points: 15, }, { name: "Nomad", logo: nomadLogo, games: 8, wins: 5, draws: 0, losses: 3, points: 15, }, { name: "Супер Герои", logo: superGeroiLogo, games: 8, wins: 4, draws: 2, losses: 2, points: 14, }, { name: "Могучая кучка | Buddies ...", logo: moguchayaKuchkaLogo, games: 8, wins: 4, draws: 0, losses: 4, points: 12, }, { name: "РК-Спорт", logo: rkSportLogo, games: 8, wins: 3, draws: 1, losses: 4, points: 10, }, { name: "МФК Симферополь", logo: null, games: 8, wins: 3, draws: 0, losses: 5, points: 9, }, { name: "RIBIZA", logo: null, games: 8, wins: 2, draws: 1, losses: 5, points: 7, }, { name: "Интер-Национал", logo: interLogo, games: 8, wins: 2, draws: 1, losses: 5, points: 7, }, { name: "Гвардия", logo: gvardiyaLogo, games: 8, wins: 2, draws: 0, losses: 6, points: 6, }, { name: "Название", logo: null, games: 8, wins: 1, draws: 1, losses: 6, points: 4, }, ];
function Table() { return ( <div className="table-page"> <h1>ТАБЛИЦА</h1>
  <p className="table-subtitle">
    Кубок КСЛ
  </p>

  <div className="table-wrapper">

    <div className="table-header">
      <div className="position">#</div>

      <div className="team-name">
        КОМАНДА
      </div>

      <div>И</div>
      <div>В</div>
      <div>Н</div>
      <div>П</div>
      <div>О</div>
    </div>

    {teams.map((team, index) => (
      <div
        className={`table-row ${
          team.name === "Гвардия"
            ? "gvardia-row"
            : ""
        }`}
        key={team.name}
      >

        <div className="position">
          {index + 1}
        </div>

        <div className="team-name">

          <div className="team-logo">

            {team.logo ? (
              <img src={team.logo ?? undefined} alt={team.name} />
            ) : (
              <div className="team-logo-placeholder">
                {team.name.charAt(0)}
              </div>
            )}

          </div>

          <strong>
            {team.name}
          </strong>

        </div>

        <div>
          {team.games}
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