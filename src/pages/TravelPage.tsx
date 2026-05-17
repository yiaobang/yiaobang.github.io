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

  const getEmoji = (folder: string) => {
    if (folder.includes('奈良公園') || folder.includes('奈良公园')) return '🌸🦌';
    if (folder.includes('ハルカス')) return '🏢';
    if (folder.includes('花见') || folder.includes('花見')) return '🌸';
    if (folder.includes('夜景')) return '🌃';
    if (folder.includes('金剛山') || folder.includes('金刚山')) return '⛰️';
    if (folder.includes('生駒山') || folder.includes('生驹山')) return '⛰️';
    if (folder.includes('午後') || folder.includes('午后')) return '🌅';
    if (folder.includes('博物馆') || folder.includes('博物館')) return '🚴';
    if (folder.includes('海道')) return '🌊';
    return '📸';
  };


  return (
    <div className="travel-page page-reveal">
      <div className="travel-top-nav">
        <button className="back-button-circle" onClick={() => navigate('/')} title={t('back_to_home')}>
          ←
        </button>
      </div>

      <div className="travel-simple-header">
        <h1 className="travel-page-title">{t('categories.travel')}</h1>
        <div className="title-underline" />
      </div>

      <div className="timeline-container">
        <div className="timeline-path-line"></div>
        
        <div className="timeline-items">
          {travels.map((trip) => {
            const lang = i18n.language as 'zh' | 'en' | 'ja';
            const tripData = trip[lang];
            return (
              <div 
                key={trip.id} 
                className="timeline-card-wrapper"
              >
                <div className="timeline-dot"></div>
                <div 
                  className="timeline-item bento-link reveal-on-scroll"
                  onClick={() => handleTripClick(trip.id)}
                >
                  <div className="timeline-content">
                    <div className="travel-top">
                      <span className="trip-date-badge">{tripData.date}</span>
                      <span className="photo-count-badge">
                        📸 {photoCount[trip.id] || 0}
                      </span>
                    </div>
                    
                    <h3 className="trip-location">{tripData.location}</h3>
                    <p className="trip-description">{tripData.short_description}</p>
                    
                    <div className="bento-icon-bg travel-bg-icon">
                      {getEmoji(trip.folder)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TravelPage;
