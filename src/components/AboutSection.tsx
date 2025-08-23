import { useTranslation } from 'react-i18next';
import './AboutSection.css';

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section className="about-section">
      <h2 className="section-title">{t('about_title')}</h2>
      <div className="about-content">
        <div className="about-text">
          <p>{t('about_text')}</p>
          <div className="status-badge">
            {t('current_status')}
          </div>
        </div>
        <div className="about-stats">
          <div className="stat-item">
            <div className="stat-number">🌍</div>
            <div className="stat-label">Exploring</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">📚</div>
            <div className="stat-label">Learning</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">✨</div>
            <div className="stat-label">Growing</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;