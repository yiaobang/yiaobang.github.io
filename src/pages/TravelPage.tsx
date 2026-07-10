import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loadTravelData, type TravelItem } from '../data/travelData';
import './TravelPage.css';

const TravelPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [travels, setTravels] = useState<TravelItem[]>([]);
  const [photoCount, setPhotoCount] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;

    loadTravelData().then(({ travels, photosByTravelId }) => {
      if (!isMounted) return;

      setTravels([...travels].reverse());
      
      const counts: Record<string, number> = {};
      Object.keys(photosByTravelId).forEach(id => {
        counts[id] = photosByTravelId[id].length;
      });
      setPhotoCount(counts);
    });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const savedScrollY = sessionStorage.getItem('travelPageScrollY');
    if (savedScrollY) {
      window.scrollTo(0, parseInt(savedScrollY));
      sessionStorage.removeItem('travelPageScrollY');
    }
  }, []);

  const handleTripClick = (tripId: string) => {
    sessionStorage.setItem('travelPageScrollY', window.scrollY.toString());
    navigate(`/travel/${tripId}`);
  };

  return (
    <div className="travel-page page-reveal">
      <div className="travel-top-nav">
        <button className="pill-back-button" onClick={() => navigate('/')} title={t('back_to_home')}>
          <span>←</span> {t('back_to_home') || 'Back'}
        </button>
      </div>

      <div className="travel-simple-header reveal-on-scroll">
        <h1 className="travel-page-title">{t('categories.travel')}</h1>
      </div>

      <div className="travel-list-container">
        {travels.map((trip, index) => {
          const lang = i18n.language as 'zh' | 'en' | 'ja';
          const tripData = trip[lang];
          return (
            <div 
              key={trip.id} 
              className="travel-strip reveal-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleTripClick(trip.id)}
            >
              <div className="strip-main">
                <h2 className="strip-location">{tripData.location}</h2>
                <div className="strip-meta">
                  <span className="strip-date">{tripData.date}</span>
                  <span className="strip-arrow">→</span>
                </div>
              </div>
              <div className="strip-hover-content">
                <p className="strip-desc">{tripData.short_description}</p>
                <div className="strip-photo-count">📸 {photoCount[trip.id] || 0} Photos</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TravelPage;
