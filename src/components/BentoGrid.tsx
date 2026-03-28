import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LocationIcon, EmailIcon, GitHubIcon } from './Icons';
import './BentoGrid.css';

const BentoGrid = () => {
  const { t } = useTranslation();

  return (
    <section className="bento-container">
      {/* 1. Hero / Profile (Large Block) */}
      <div className="bento-item bento-hero">
        <div className="hero-content">
          <img src="/Tohru.jfif" alt="Avatar" className="hero-avatar" />
          <h1 className="hero-title">{t('profile.name')}</h1>
          <p className="hero-subtitle">{t('profile.subtitle')}</p>
          <div className="hero-location">
            <LocationIcon /> Osaka
          </div>
        </div>
      </div>

      {/* 2. Travel Portal (Tall Block) */}
      <Link to="/travel" className="bento-item bento-link bento-travel">
        <div className="bento-link-content">
          <h2 className="bento-title">{t('categories.travel')}</h2>
          <p className="bento-desc">{t('travel_description')}</p>
        </div>
        <div className="bento-icon-bg">🌏</div>
      </Link>

      {/* 3. Projects Portal (Wide Block) */}
      <Link to="/projects" className="bento-item bento-link bento-projects">
        <div className="bento-link-content">
          <h2 className="bento-title">{t('project_title')}</h2>
          <p className="bento-desc">{t('project_description')}</p>
        </div>
        <div className="bento-icon-bg">💻</div>
      </Link>

      {/* 4. Social Stack */}
      <div className="bento-social-stack">
        <a href="https://github.com/yiaobang" target="_blank" rel="noopener noreferrer" className="bento-item bento-link bento-social github-link">
          <GitHubIcon />
          <span>GitHub</span>
        </a>
        <a href="mailto:yiaobang@gmail.com" className="bento-item bento-link bento-social email-link">
          <EmailIcon />
          <span>Email</span>
        </a>
      </div>
    </section>
  );
};

export default BentoGrid;
