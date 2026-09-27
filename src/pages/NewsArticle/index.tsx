import { useNavigate, useParams } from "react-router-dom"; import "./NewsArticle.css";
type NewsArticleItem = { id: number; date: string; title: string; text: string; };
const news: NewsArticleItem[] = [ { id: 1, date: "12 СЕНТЯБРЯ 2026", title: "ФК «Гвардия» готовится к следующему матчу", text: "ФК «Гвардия» продолжает подготовку к следующему матчу в рамках Кубка КСЛ.\n\nКоманда проводит тренировочный процесс и настраивается на предстоящую игру.\n\nВпереди важная встреча, поэтому команда продолжает работать над своей игрой и готовится показать максимальный результат.\n\nСледите за новостями команды, расписанием и результатами матчей в приложении.", }, { id: 2, date: "10 СЕНТЯБРЯ 2026", title: "Итоги последнего матча", text: "Команда провела очередной матч в рамках турнира.\n\nБлагодарим всех игроков и болельщиков за поддержку.\n\nКаждый матч — это новый опыт и возможность стать сильнее. Команда продолжает подготовку к следующим встречам.\n\nСледите за результатами и расписанием следующих матчей.", }, { id: 3, date: "8 СЕНТЯБРЯ 2026", title: "Обновление состава команды", text: "В составе ФК «Гвардия» произошли изменения.\n\nАктуальный список игроков и распределение по позициям уже доступны в разделе «Состав».\n\nСледите за обновлениями команды и знакомьтесь с игроками ФК «Гвардия» в приложении.", }, ];
function NewsArticle() { const navigate = useNavigate(); const { id } = useParams();
const article = news.find( (item) => item.id === Number(id) );
if (!article) { return ( <div className="news-article-page"> <button className="news-back-button" onClick={() => navigate("/news")} > <span>←</span> Назад </button>
    <div className="news-not-found">
      <div className="news-not-found-icon">G</div>

      <h1>Новость не найдена</h1>

      <p>
        Возможно, новость была удалена или ссылка
        устарела.
      </p>
    </div>
  </div>
);}
return ( <div className="news-article-page"> <header className="news-article-header"> <button className="news-back-button" onClick={() => navigate("/news")} > <span>←</span> Назад </button>
    <div className="news-article-brand">
      ФК «ГВАРДИЯ»
    </div>
  </header>

  <div className="news-article-image">
    <div className="news-article-image-placeholder">
      <span>G</span>
    </div>
  </div>

  <article className="news-article">
    <div className="news-article-date">
      {article.date}
    </div>

    <h1>{article.title}</h1>

    <div className="news-article-line" />

    <div className="news-article-text">
      {article.text
        .split("\n\n")
        .map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
    </div>
  </article>

  <button
    className="news-bottom-back"
    onClick={() => navigate("/news")}
  >
    <span>←</span>
    Вернуться к новостям
  </button>
</div>); }
export default NewsArticle;