import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LanguageSelector from "./components/LanguageSelector";
import BentoGrid from "./components/BentoGrid";
import TravelPage from "./pages/TravelPage";
import TravelDetailPage from "./pages/TravelDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AnimatedBackground from "./components/AnimatedBackground";
import "./App.css";

const NavigationRefinement = () => {
  const { pathname } = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // 1. Scroll to top on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // 2. Back to Top visibility logic
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button 
      className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to Top"
    >
      ↑
    </button>
  );
};


const HomePage = () => {
  return (
    <div className="main-container">
      <BentoGrid />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AnimatedBackground />
        <LanguageSelector />
        <NavigationRefinement />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/travel/:id" element={<TravelDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;