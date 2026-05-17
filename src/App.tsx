import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LanguageSelector from "./components/LanguageSelector";
import BentoGrid from "./components/BentoGrid";
import AnimatedBackground from "./components/AnimatedBackground";
import "./App.css";

const TravelPage = lazy(() => import("./pages/TravelPage"));
const TravelDetailPage = lazy(() => import("./pages/TravelDetailPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));

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

        <Suspense fallback={<div className="route-loading" aria-live="polite">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/travel" element={<TravelPage />} />
            <Route path="/travel/:id" element={<TravelDetailPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
