import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LanguageSelector from "./components/LanguageSelector";
import BentoGrid from "./components/BentoGrid";
import TravelPage from "./pages/TravelPage";
import TravelDetailPage from "./pages/TravelDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AnimatedBackground from "./components/AnimatedBackground";
import "./App.css";

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