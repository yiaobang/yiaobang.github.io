import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector";
import AnimatedBackground from "./components/AnimatedBackground";
import LifeCategoriesSection from "./components/LifeCategoriesSection";
import AboutSection from "./components/AboutSection";
import TravelPage from "./pages/TravelPage";
import TravelDetailPage from "./pages/TravelDetailPage";
import "./App.css";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <main className="main-content">
      <div className="hero-section">
        <div className="blog-header">
          <h1 className="blog-title">{t("title")}</h1>
          <p className="blog-subtitle">{t("welcome")}</p>
        </div>
        
        <AboutSection />
        <LifeCategoriesSection />
        

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
