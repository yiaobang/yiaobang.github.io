import React from 'react';
import { useTranslation } from 'react-i18next';
import JapanMap from './JapanMap';
import './TravelHero.css';

interface TravelHeroProps {
  totalTrips: number;
  totalPhotos: number;
  yearsRange: string;
}

const TravelHero: React.FC<TravelHeroProps> = ({ totalTrips, totalPhotos, yearsRange }) => {
  const { t } = useTranslation();

  return (
    <div className="travel-hero-v2">
      <div className="hero-card-container glass-panel">
        {/* The map is now a subtle background element inside the card */}
        <div className="hero-map-bg">
          <JapanMap />
        </div>
        
        <div className="hero-content-wrapper">
          <h1 className="hero-title-v2">{t('categories.travel')}</h1>
          <p className="hero-subtitle-v2">{t('travel_description')}</p>
          
          <div className="hero-stats-row">
            <div className="mini-stat">
              <span className="mini-stat-value">{totalTrips}</span>
              <span className="mini-stat-label">{t('stats_milestones')}</span>
            </div>
            <div className="stat-divider" />
            <div className="mini-stat">
              <span className="mini-stat-value">{totalPhotos}</span>
              <span className="mini-stat-label">{t('stats_photos')}</span>
            </div>
            <div className="stat-divider" />
            <div className="mini-stat">
              <span className="mini-stat-value">{yearsRange}</span>
              <span className="mini-stat-label">{t('stats_years')}</span>
            </div>
          </div>
        </div>
        
        <div className="active-explorer-badge">
           <div className="pulse-dot" />
           <span>{t('stats_active')}</span>
        </div>
      </div>
    </div>
  );
};

export default TravelHero;
