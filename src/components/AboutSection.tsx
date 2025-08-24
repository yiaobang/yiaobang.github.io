import { useTranslation } from 'react-i18next';
import './AboutSection.css';

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section className="about-section">
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
            <div className="stat-label">{t('stat_labels.exploring')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">📚</div>
            <div className="stat-label">{t('stat_labels.learning')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">✨</div>
            <div className="stat-label">{t('stat_labels.growing')}</div>
          </div>
          <a 
            href="https://github.com/yiaobang" 
            target="_blank" 
            rel="noopener noreferrer"
            className="stat-item github-stat"
          >
            <div className="stat-number">💻</div>
            <div className="stat-label">GitHub</div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;