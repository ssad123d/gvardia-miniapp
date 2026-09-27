import { useNavigate } from "react-router-dom"; import "./news.css";
type NewsItem = { id: number; date: string; title: string; preview: string; };
const news: NewsItem[] = [ { id: 1, date: "12 СЕНТЯБРЯ 2026", title: "ФК «Гвардия» готовится к следующему матчу", preview: "Команда продолжает подготовку к очередной игре в рамках Кубка КСЛ.", }, { id: 2, date: "10 СЕНТЯБРЯ 2026", title: "Итоги последнего матча", preview: "Подводим итоги прошедшей встречи и готовимся к следующим матчам.", }, { id: 3, date: "8 СЕНТЯБРЯ 2026", title: "Обновление состава команды", preview: "В составе команды произошли изменения. Следите за актуальным составом в приложении.", }, ];
function News() { const navigate = useNavigate();
return ( <div className="news-page"> {/* Заголовок страницы */} <header className="news-header"> <h1>Новости</h1>
    <div className="news-header-team">
      ФК «ГВАРДИЯ»
    </div>

    <p>Последние события команды</p>
  </header>

  {/* Новости */}
  <main className="news-list">
    {news.map((item) => (
      <article className="news-card" key={item.id}>
        {/* Превью новости */}
        <div className="news-image">
          <div className="news-image-placeholder">
            <span>G</span>
          </div>
        </div>

        {/* Информация */}
        <div className="news-card-content">
          <div className="news-date">
            {item.date}
          </div>

          <h2>{item.title}</h2>

          <p>{item.preview}</p>

          <button
            className="news-more"
            onClick={() => navigate(`/news/${item.id}`)}
          >
            <span>Читать далее</span>
            <span className="news-arrow">→</span>
          </button>
        </div>

        {/* Стрелка справа */}
        <button
          className="news-card-arrow"
          onClick={() => navigate(`/news/${item.id}`)}
          aria-label="Открыть новость"
        >
          →
        </button>
      </article>
    ))}
  </main>
</div>); }
export default News;