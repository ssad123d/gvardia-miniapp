import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Matches from "./pages/Matches/index";
import MatchArticle from "./pages/MatchArticle";
import Schedule from "./pages/Schedule";
import Table from "./pages/Table";
import Squad from "./pages/Squad";
import Player from "./pages/Player";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";

import Tournaments from "./pages/Tournaments";
import Tournament from "./pages/Tournament";

import ArchiveMatches from "./pages/ArchiveMatches";
import ArchivePlayoff from "./pages/ArchivePlayoff";

import BottomNav from "./components/BottomNav";

function App() {
  return (
    <>
      <Routes>
        {/* Главная */}
        <Route path="/" element={<Home />} />

        {/* Матчи */}
        <Route path="/matches" element={<Matches />} />

        <Route
          path="/matches/:id"
          element={<MatchArticle />}
        />

        {/* Расписание */}
        <Route path="/schedule" element={<Schedule />} />

        {/* Таблица */}
        <Route path="/table" element={<Table />} />

        {/* Турниры */}
        <Route
          path="/tournaments"
          element={<Tournaments />}
        />

        {/* Страница конкретного турнира */}
        <Route
          path="/tournaments/:id"
          element={<Tournament />}
        />

        {/* Архив Кубка КСЛ 2025/26 */}
        <Route
          path="/tournaments/archive/matches"
          element={<ArchiveMatches />}
        />

        <Route
          path="/tournaments/archive/table"
          element={<Table />}
        />

        <Route
          path="/tournaments/archive/playoff"
          element={<ArchivePlayoff />}
        />

        {/* Состав */}
        <Route
          path="/squad"
          element={<Squad />}
        />

        <Route
          path="/squad/player/:id"
          element={<Player />}
        />

        {/* Новости */}
        <Route
          path="/news"
          element={<News />}
        />

        <Route
          path="/news/:id"
          element={<NewsArticle />}
        />
      </Routes>

      <BottomNav />
    </>
  );
}

export default App;