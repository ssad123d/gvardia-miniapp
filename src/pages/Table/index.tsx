
import { useEffect, useState } from "react";
import "./Table.css";

import {
  getTeamDisplayName,
  getTeamLogo,
} from "../../utils/teamLogos";

import { getRKSportTable } from "../../api/rksport";
import type { RKSportTeam } from "../../api/rksport";

const TABLE_CACHE_KEY = "gvardia-table-page-cache-v1";

type TableCache = {
  savedAt: string;
  data: RKSportTeam[];
};

function normalizeTeamName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^а-яa-z0-9]/gi, "");
}

function readSavedTable(): TableCache | null {
  try {
    const raw = localStorage.getItem(TABLE_CACHE_KEY);

    if (!raw) return null;

    const cached = JSON.parse(raw) as TableCache;

    if (
      !Array.isArray(cached.data) ||
      cached.data.length === 0
    ) {
      return null;
    }

    return cached;
  } catch {
    return null;
  }
}

function saveTable(teams: RKSportTeam[]): void {
  try {
    if (teams.length === 0) return;

    const cache: TableCache = {
      savedAt: new Date().toISOString(),
      data: teams,
    };

    localStorage.setItem(
      TABLE_CACHE_KEY,
      JSON.stringify(cache),
    );
  } catch (error) {
    console.warn(
      "Не удалось сохранить резервную таблицу",
      error,
    );
  }
}

export default function Table() {
  const [teams, setTeams] = useState<RKSportTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingCache, setUsingCache] = useState(false);
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTable() {
      const cached = readSavedTable();

      if (cached) {
        setTeams(cached.data);
        setSavedAt(cached.savedAt);
        setUsingCache(true);
        setLoading(false);
      }

      try {
        const data = await getRKSportTable();

        if (cancelled) return;

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Получена пустая таблица");
        }

        saveTable(data);

        setTeams(data);
        setSavedAt(new Date().toISOString());
        setUsingCache(false);
        setError("");
      } catch (err) {
        console.error("Ошибка загрузки таблицы:", err);

        if (cancelled) return;

        const fallback = readSavedTable();

        if (fallback) {
          setTeams(fallback.data);
          setSavedAt(fallback.savedAt);
          setUsingCache(true);
          setError("");
        } else {
          setError(
            "РК-Спорт сейчас недоступен. Резервной таблицы пока нет. Она появится после первой успешной загрузки.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTable();

    return () => {
      cancelled = true;
    };
  }, []);

  const formattedSavedAt = savedAt
    ? new Date(savedAt).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <main className="table-page">
      <header className="table-header">
        <div className="table-header-logo">
          <img
            src={getTeamLogo("Гвардия")}
            alt="Гвардия"
          />
        </div>

        <div>
          <h1>ТАБЛИЦА</h1>
          <p>Корпоративная Супер Лига</p>
        </div>
      </header>

      <section className="table-card">
        <div className="table-title">
          <span>ТУРНИР</span>
          <h2>Корпоративная Супер Лига</h2>
        </div>

        {loading && teams.length === 0 && (
          <div className="table-state">
            <div className="table-state-icon">⏳</div>
            <strong>Загружаем таблицу...</strong>
            <p>Получаем актуальные данные с РК-Спорт.</p>
          </div>
        )}

        {!loading && error && teams.length === 0 && (
          <div className="table-state table-error">
            <div className="table-state-icon">⚠️</div>
            <strong>Таблица временно недоступна</strong>
            <p>{error}</p>
          </div>
        )}

        {teams.length > 0 && (
          <>
            {usingCache && (
              <div className="table-state">
                <strong>
                  ⚠️ Показана сохранённая таблица
                </strong>
                <p>
                  РК-Спорт сейчас недоступен.
                  {formattedSavedAt &&
                    ` Последнее сохранение: ${formattedSavedAt}.`}
                </p>
              </div>
            )}

            {!usingCache && loading && (
              <div className="table-state">
                <p>Обновляем данные таблицы...</p>
              </div>
            )}

            <div className="table-head">
              <span>#</span>
              <span>КОМАНДА</span>
              <span>И</span>
              <span>В</span>
              <span>Н</span>
              <span>П</span>
              <span>О</span>
            </div>

            <div className="table-list">
              {teams.map((team) => {
                const teamName = getTeamDisplayName(team.name);

                const normalizedName = normalizeTeamName(
                  team.name,
                );

                const isGvardiya =
                  String(team.id) === "1498973" ||
                  normalizedName.includes("гвардия");

                const teamLogo = getTeamLogo(
                  teamName,
                  team.logo,
                );

                return (
                  <div
                    className={`table-row ${
                      isGvardiya
                        ? "table-row-gvardiya"
                        : ""
                    }`}
                    key={team.id}
                  >
                    <div className="table-place">
                      {team.position}
                    </div>

                    <div className="table-team">
                      <div className="table-team-logo">
                        {teamLogo ? (
                          <img
                            src={teamLogo}
                            alt={teamName}
                          />
                        ) : (
                          <span>⚽</span>
                        )}
                      </div>

                      <div className="table-team-info">
                        <strong>{teamName}</strong>

                        {team.city && (
                          <span>{team.city}</span>
                        )}
                      </div>
                    </div>

                    <div>{team.played}</div>
                    <div>{team.wins}</div>
                    <div>{team.draws}</div>
                    <div>{team.losses}</div>

                    <div className="table-points">
                      {team.points}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="table-updated">
              <span />
              {usingCache
                ? "Показаны последние сохранённые данные"
                : "Данные загружены с РК-Спорт"}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
