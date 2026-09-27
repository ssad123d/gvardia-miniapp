import "./style.css";
import gvardiyaLogo from "../../assets/gvardiya.jpg"; import mfkLogo from "../../assets/mfk-simferopol.png"; import nazvanieLogo from "../../assets/nazvanie.png"; import interLogo from "../../assets/inter.png"; import selhozLogo from "../../assets/selhoz.png"; import duoLogo from "../../assets/duo.png"; import arsOilLogo from "../../assets/ars-oil.png"; import nomadLogo from "../../assets/nomad.png"; import superGeroiLogo from "../../assets/super-geroi.png"; import moguchayaKuchkaLogo from "../../assets/moguchaya-kuchka.png"; import rkSportLogo from "../../assets/rk-sport.png"; import ribizaLogo from "../../assets/ribiza.png";
type Team = { name: string; logo: string; };
type Pair = { team1: Team; team2: Team; score1a: number; score2a: number; score1b: number; score2b: number; };
type FinalMatch = { team1: Team; team2: Team; date: string; time: string; };
const teams = { selhoz: { name: "Сельхоз Юнайтед", logo: selhozLogo, }, nomad: { name: "Nomad", logo: nomadLogo, }, duo: { name: "DUO", logo: duoLogo, }, ars: { name: "ARS OIL", logo: arsOilLogo, }, super: { name: "Супер Герои", logo: superGeroiLogo, }, mfk: { name: "МФК Симферополь", logo: mfkLogo, }, kuchka: { name: "Могучая кучка | Buddies & Co.", logo: moguchayaKuchkaLogo, }, rk: { name: "РК-Спорт", logo: rkSportLogo, }, ribiza: { name: "RIBIZA", logo: ribizaLogo, }, nazvanie: { name: "Название", logo: nazvanieLogo, }, inter: { name: "Интер-Национал", logo: interLogo, }, gvardiya: { name: "Гвардия", logo: gvardiyaLogo, }, };
/* Пары плей-офф */
const pairs: Pair[] = [ { team1: teams.selhoz, team2: teams.nomad, score1a: 6, score2a: 2, score1b: 5, score2b: 4, },
{ team1: teams.duo, team2: teams.ars, score1a: 3, score2a: 4, score1b: 3, score2b: 3, },
{ team1: teams.super, team2: teams.mfk, score1a: 4, score2a: 3, score1b: 4, score2b: 3, },
{ team1: teams.kuchka, team2: teams.rk, score1a: 3, score2a: 2, score1b: 2, score2b: 7, },
{ team1: teams.ribiza, team2: teams.nazvanie, score1a: 5, score2a: 4, score1b: 7, score2b: 5, },
{ team1: teams.inter, team2: teams.gvardiya, score1a: 4, score2a: 5, score1b: 6, score2b: 4, }, ];
/* Определяем победителя пары */
function getWinner(pair: Pair): Team { const total1 = pair.score1a + pair.score1b; const total2 = pair.score2a + pair.score2b;
if (total1 > total2) { return pair.team1; }
if (total2 > total1) { return pair.team2; }
return pair.team1; }
/* Победители */
const winners = pairs.map((pair) => getWinner(pair));
/* Следующий раунд. Пока здесь отображаются реальные назначенные матчи из текущей сетки турнира. */
const finalMatches: FinalMatch[] = [ { team1: winners[4], team2: winners[5], date: "06 сент.", time: "16:30", },
{ team1: winners[2], team2: winners[3], date: "06 сент.", time: "17:30", },
{ team1: winners[0], team2: winners[1], date: "06 сент.", time: "18:30", }, ];
function TeamRow({ team, score1, score2, }: { team: Team; score1: number; score2: number; }) { return ( <div className="bracket-team">
  <div className="bracket-team-info">
    <img
      src={team.logo}
      alt={team.name}
    />

    <span>{team.name}</span>
  </div>

  <div className="team-scores">
    <strong>{score1}</strong>
    <strong>{score2}</strong>
  </div>

</div>); }
function PairCard({ pair, }: { pair: Pair; }) { return ( <div className="pair-card">
  <div className="score-head">
    <span></span>
    <span>1</span>
    <span>2</span>
  </div>

  <TeamRow
    team={pair.team1}
    score1={pair.score1a}
    score2={pair.score1b}
  />

  <TeamRow
    team={pair.team2}
    score1={pair.score2a}
    score2={pair.score2b}
  />

</div>); }
function FinalCard({ match, }: { match: FinalMatch; }) { return ( <div className="final-card">
  <div className="final-teams">

    <div className="final-team">

      <img
        src={match.team1.logo}
        alt={match.team1.name}
      />

      <span>{match.team1.name}</span>

    </div>

    <div className="final-team">

      <img
        src={match.team2.logo}
        alt={match.team2.name}
      />

      <span>{match.team2.name}</span>

    </div>

  </div>
  <div className="final-date">

    <span>{match.date}</span>

    <strong>
      ВС / {match.time}
    </strong>

  </div>

</div>); }
export default function Playoff() { const branches = [ { pairs: [ pairs[0], pairs[1], ], final: finalMatches[2], },
{
  pairs: [
    pairs[2],
    pairs[3],
  ],
  final: finalMatches[1],
},

{
  pairs: [
    pairs[4],
    pairs[5],
  ],
  final: finalMatches[0],
},];
return ( <div className="playoff-page">
  <div className="playoff-header">

    <h1>ПЛЕЙ-ОФФ</h1>

    <p>
      Кубок КСЛ
    </p>

  </div>

  <div className="bracket-scroll">

    <div className="bracket">

      <div className="bracket-headings">

        <h2>ПОЛУФИНАЛ</h2>

        <h2>ФИНАЛ</h2>

      </div>

      {branches.map((branch, index) => (

        <div
          className="bracket-branch"
          key={index}
        >

          <div className="branch-semifinals">

            <PairCard
              pair={branch.pairs[0]}
            />

            <PairCard
              pair={branch.pairs[1]}
            />

          </div>

          <div className="branch-connector">

            <span className="connector-top"></span>

            <span className="connector-middle"></span>

            <span className="connector-bottom"></span>

          </div>

          <div className="branch-final">

            <FinalCard
              match={branch.final}
            />

          </div>

        </div>

      ))}

    </div>

  </div>

  <div className="playoff-note">

    <span>⚔️</span>

    <p>
      Результаты и расписание плей-офф
    </p>

  </div>

</div>); }