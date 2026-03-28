import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LanguageSelector from "./components/LanguageSelector";
import ProfileCard from "./components/ProfileCard";
import ContentCard from "./components/ContentCard";
import TravelPage from "./pages/TravelPage";
import TravelDetailPage from "./pages/TravelDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import "./App.css";

const HomePage = () => {
  return (
    <div className="main-container">
      <div className="content-wrapper">
        <ProfileCard />
        <section className="content-section">
          <ContentCard 
            icon="🌏"
            titleKey="categories.travel"
            descriptionKey="travel_description"
            linkTo="/travel"
            buttonTextKey="view_travel"
          />
          <ContentCard 
            icon="💻"
            titleKey="project_title"
            descriptionKey="project_description"
            linkTo="/projects"
            buttonTextKey="view_details"
          />
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
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;