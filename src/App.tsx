import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector";
import AnimatedBackground from "./components/AnimatedBackground";
import LifeCategoriesSection from "./components/SkillsSection";
import AboutSection from "./components/AboutSection";
import TravelPage from "./pages/TravelPage";
import TravelDetailPage from "./pages/TravelDetailPage";
import "./App.css";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <main className="main-content">
      <div className="hero-section">
        <h1 className="title">{t("title")}</h1>
        <p className="subtitle">{t("welcome")}</p>
        
        <AboutSection />
        <LifeCategoriesSection />
        
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
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AnimatedBackground />
        <LanguageSelector />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/travel/:id" element={<TravelDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
