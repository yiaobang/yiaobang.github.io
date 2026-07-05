import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LocationIcon, EmailIcon, GitHubIcon } from './Icons';
import './HeroSection.css';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="hero-container">
      <div className="hero-content-centered">
        <div className="avatar-wrapper">
          <img src="/Tohru.jfif" alt="Avatar" className="avatar-img" />
          <div className="avatar-glow"></div>
        </div>
        
        <h1 className="hero-name">{t('profile.name')}</h1>
        <p className="hero-desc">{t('profile.subtitle')}</p>
        
        <div className="hero-location-badge">
          <LocationIcon /> Osaka
        </div>

        <div className="pill-nav-container">
          <Link to="/travel" className="nav-pill travel-pill">
            <span className="pill-icon">🌏</span>
            <span className="pill-text">{t('categories.travel')}</span>
          </Link>
          
          <a href="https://github.com/yiaobang" target="_blank" rel="noopener noreferrer" className="nav-pill github-pill">
            <GitHubIcon />
            <span className="pill-text">GitHub</span>
          </a>
          
          <a href="mailto:yiaobang@gmail.com" className="nav-pill email-pill">
            <EmailIcon />
            <span className="pill-text">Email</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
