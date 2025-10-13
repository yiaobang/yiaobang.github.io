import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector";
import TravelPage from "./pages/TravelPage";
import TravelDetailPage from "./pages/TravelDetailPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import "./App.css";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="main-container">
      <div className="content-wrapper">
        {/* Profile Section */}
        <section className="profile-section">
          <img src="/Tohru.jfif" alt="Profile" className="profile-avatar" />
          <h1 className="profile-name">{t('profile.name')}</h1>
          <p className="profile-intro">{t('profile.intro')}</p>
        </section>

        {/* Content Section */}
        <section className="content-section">
          <div className="content-item travel-item">
            <div className="item-icon">🏔️</div>
            <h2 className="item-title">{t('categories.travel')}</h2>
            <p className="item-description">{t('travel_description')}</p>
            <Link to="/travel" className="item-button">
              {t('view_travel')} →
            </Link>
          </div>
          
          <div className="content-item project-item">
            <div className="item-icon">💻</div>
            <h2 className="item-title">{t('project_title')}</h2>
            <p className="item-description">{t('project_description')}</p>
            <div className="project-details">
              <div className="tech-stack">
                <span className="tech-tag">JavaFX</span>
                <span className="tech-tag">Java</span>
                <span className="tech-tag">i18n</span>
              </div>
              <div className="project-features">
                <div className="feature">• {t('feature_1')}</div>
                <div className="feature">• {t('feature_2')}</div>
                <div className="feature">• {t('feature_3')}</div>
              </div>
            </div>
            <Link to="/project" className="item-button">
              {t('view_details')} →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <LanguageSelector />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/travel/:id" element={<TravelDetailPage />} />
          <Route path="/project" element={<ProjectDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;