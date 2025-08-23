import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector";
import AnimatedBackground from "./components/AnimatedBackground";
import "./App.css";

function App() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <AnimatedBackground />
      <LanguageSelector />
      
      <main className="main-content">
        <div className="hero-section">
          <h1 className="title">{t("title")}</h1>
          <p className="subtitle">{t("welcome")}</p>
          <div className="cta-section">
            <p>{t("find_projects")}</p>
            <a
              className="github-link"
              href="https://github.com/yiaobang"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("my_github")}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
