import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector";
import AnimatedBackground from "./components/AnimatedBackground";
import LifeCategoriesSection from "./components/LifeCategoriesSection";
import AboutSection from "./components/AboutSection";
import TravelPage from "./pages/TravelPage";
import TravelDetailPage from "./pages/TravelDetailPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import "./App.css";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <main>
      {/* Hero Section - 全屏展示区域 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{t('hero.title')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <div className="hero-cta">
            <a href="#about" className="cta-button cta-primary">{t('hero.learnMore')}</a>
            <a href="#categories" className="cta-button cta-secondary">{t('hero.explore')}</a>
          </div>
        </div>
        <div className="scroll-indicator">
          <div>↓</div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="section-glass">
          <AboutSection />
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="section">
        <div className="section-glass">
          <LifeCategoriesSection />
        </div>
      </section>

      {/* GitHub Projects Section */}
      <section className="section">
        <div className="section-glass">
          <h2 style={{color: 'white', fontSize: '2rem', fontWeight: '600', marginBottom: '2rem', textAlign: 'center'}}>{t('github_projects')}</h2>
          <div className="github-projects">
            <div className="project-card">
              <h3 className="project-title">SerialPortToolFX</h3>
              <p className="project-description">{t('project_description')}</p>
              <div className="project-tech">
                <span className="tech-tag">JavaFX</span>
                <span className="tech-tag">Java</span>
                <span className="tech-tag">i18n</span>
                <span className="tech-tag">Serial</span>
              </div>
              <div className="project-actions">
                <Link to="/project/serialport" className="project-link">
                  {t('view_details')} →
                </Link>
                <a href="https://github.com/yiaobang/SerialPortToolFX" target="_blank" rel="noopener noreferrer" className="project-link">
                  {t('view_on_github')} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
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
          <Route path="/project/serialport" element={<ProjectDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
