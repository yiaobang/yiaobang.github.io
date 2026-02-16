import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './TravelPage.css';

interface TravelItem {
  id: string;
  folder: string;
  zh: { location: string; date: string; description: string; short_description: string };
  en: { location: string; date: string; description: string; short_description: string };
  ja: { location: string; date: string; description: string; short_description: string };
}

const TravelPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [travels, setTravels] = useState<TravelItem[]>([]);
  const [photoCount, setPhotoCount] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([
      fetch('/data/travels.json').then(res => res.json()),
      fetch('/data/photos.json').then(res => res.json())
    ]).then(([travelsData, photosData]) => {
      setTravels(travelsData.reverse());
      const counts: Record<string, number> = {};
      Object.keys(photosData).forEach(id => {
        counts[id] = photosData[id].length;
      });
      setPhotoCount(counts);
    });
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
    if (folder.includes('ハルカス')) return '🏢';
    if (folder.includes('花見')) return '🌸';
    if (folder.includes('夜景')) return '🌃';
    if (folder.includes('金剛山')) return '⛰️';
    if (folder.includes('午後')) return '🌅';
    if (folder.includes('博物館')) return '🚴';
    if (folder.includes('生駒山')) return '🌲';
    if (folder.includes('海道')) return '🌊';
    return '📸';
  };

  return (
    <div className="travel-page">
      <div className="travel-header">
        <button className="back-button" onClick={() => navigate('/')}>
          {t('back_to_home')}
        </button>
        <h1 className="travel-title">{t('categories.travel')}</h1>
      </div>

      <div className="timeline-container">
        <div className="timeline">
          {travels.map((trip, index) => {
            const lang = i18n.language as 'zh' | 'en' | 'ja';
            const tripData = trip[lang];
            return (
              <div 
                key={trip.id} 
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                data-date={tripData.date}
                onClick={() => handleTripClick(trip.id)}
              >
                <div className="timeline-content">
                  <div className="trip-icon">{getEmoji(trip.folder)}</div>
                  <div className="trip-date-mobile">{tripData.date}</div>
                  <h3 className="trip-location">{tripData.location}</h3>
                  <p className="trip-description">{tripData.short_description}</p>
                  <div className="photo-count">
                    {photoCount[trip.id] || 0} {t('photos_count')}
                  </div>
                  <div className="view-photos">{t('view_photos')}</div>
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