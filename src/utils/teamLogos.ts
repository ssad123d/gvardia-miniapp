import regionLogo from "../assets/82-region.png";
import start10Logo from "../assets/start-10.png";
import gvardiyaLogo from "../assets/gvardiya.png";

import advirLogo from "../assets/advir.png";
import arsOilLogo from "../assets/ars-oil.png";
import dortmundLogo from "../assets/dortmund.png";
import duoLogo from "../assets/duo.png";
import fortezzaNeraLogo from "../assets/fortezza-nera.png";
import heroLogo from "../assets/hero.png";
import interLogo from "../assets/inter.png";
import karasuvbazarLogo from "../assets/karasuvbazar.png";
import mandemLogo from "../assets/mandem.png";
import mfkSimferopolLogo from "../assets/mfk-simferopol.png";
import moguchayaKuchkaLogo from "../assets/moguchaya-kuchka.png";
import nomadLogo from "../assets/nomad.png";
import ravenfeedLogo from "../assets/ravenfeed.png";
import ribizaLogo from "../assets/ribiza.png";
import rkSportLogo from "../assets/rk-sport.png";
import segundoImperioLogo from "../assets/segundo-imperio.png";
import selhozLogo from "../assets/selhoz.png";
import superGeroiLogo from "../assets/super-geroi.png";
import torpedoLogo from "../assets/torpedo.png";
import vinnitskoeLogo from "../assets/vinnitskoe.png";

function normalizeTeamName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zа-я0-9]/gi, "");
}

const TEAM_LOGOS: Record<string, string> = {
  // Основные команды
  гвардия: gvardiyaLogo,
  "82регион": regionLogo,
  "82region": regionLogo,
  старт10: start10Logo,
  start10: start10Logo,

  // Остальные команды
  advir: advirLogo,
  адир: advirLogo,

  arsoil: arsOilLogo,

  dortmund: dortmundLogo,

  duo: duoLogo,

  fortezzanera: fortezzaNeraLogo,

  hero: heroLogo,

  inter: interLogo,

  карасувбазар: karasuvbazarLogo,
  къарасувбазар: karasuvbazarLogo,
  karasuvbazar: karasuvbazarLogo,

  mandem: mandemLogo,
  мандем: mandemLogo,

  мфксимферополь: mfkSimferopolLogo,
  mfksimferopol: mfkSimferopolLogo,

  могучаякучка: moguchayaKuchkaLogo,
  moguchayakuchka: moguchayaKuchkaLogo,

  nomad: nomadLogo,
  номад: nomadLogo,

  ravenfeed: ravenfeedLogo,

  ribiza: ribizaLogo,

  ркспорт: rkSportLogo,
  rksport: rkSportLogo,

  segundoimperio: segundoImperioLogo,

  сельхоз: selhozLogo,
  сельхозюнайтед: selhozLogo,
  сельхозюнайтед2: selhozLogo,
  selhoz: selhozLogo,

  супергерои: superGeroiLogo,
  supergeroi: superGeroiLogo,

  торпедо: torpedoLogo,
  torpedo: torpedoLogo,
  торнадо: torpedoLogo,

  винницкое: vinnitskoeLogo,
  vinnitskoe: vinnitskoeLogo,
};

function isRegionTeam(teamName: string): boolean {
  const name = normalizeTeamName(teamName);

  return (
    name.includes("82регион") ||
    name.includes("82region") ||
    name.includes("82регіон")
  );
}

export function getTeamDisplayName(teamName: string): string {
  if (isRegionTeam(teamName)) {
    return "82 Регион";
  }

  return teamName.trim();
}

export function getTeamLogo(
  teamName: string,
  originalLogo?: string
): string {
  const name = normalizeTeamName(teamName);

  if (name.includes("гвард")) {
    return gvardiyaLogo;
  }

  if (isRegionTeam(teamName)) {
    return regionLogo;
  }

  if (name.includes("старт10") || name.includes("start10")) {
    return start10Logo;
  }

  // Точное совпадение
  if (TEAM_LOGOS[name]) {
    return TEAM_LOGOS[name];
  }

  // Совпадение по части названия
  const matchingKey = Object.keys(TEAM_LOGOS).find(
    (key) => name.includes(key) || key.includes(name)
  );

  if (matchingKey) {
    return TEAM_LOGOS[matchingKey];
  }

  return originalLogo || "";
}