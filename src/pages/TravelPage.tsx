import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './TravelPage.css';

const TravelPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedScrollY = sessionStorage.getItem('travelPageScrollY');
    if (savedScrollY) {
      window.scrollTo(0, parseInt(savedScrollY));
      sessionStorage.removeItem('travelPageScrollY');
    }
  }, []);

  const travelData = [
    { id: 8, date: '2025-05', image: '🏢', folder: '8.ハルカス', photoCount: 6 },
    { id: 7, date: '2025-04', image: '🌸', folder: '7.お花見', photoCount: 15 },
    { id: 6, date: '2024-12', image: '🌃', folder: '6.夜景', photoCount: 1 },
    { id: 5, date: '2024-09', image: '⛰️', folder: '5.奈良金刚山', photoCount: 16 },
    { id: 4, date: '2024-09', image: '🌅', folder: '4.某个午后', photoCount: 2 },
    { id: 3, date: '2024-08', image: '🚴', folder: '3.自転車博物館', photoCount: 8 },
    { id: 2, date: '2024-08', image: '🌲', folder: '2.生駒山', photoCount: 12 },
    { id: 1, date: '2024-07', image: '🌊', folder: '1.しまなみ海道', photoCount: 18 }
  ];

  const handleTripClick = (tripId: number) => {
    sessionStorage.setItem('travelPageScrollY', window.scrollY.toString());
    navigate(`/travel/${tripId}`);
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
          {travelData.map((trip, index) => (
            <div 
              key={trip.id} 
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              onClick={() => handleTripClick(trip.id)}
            >
              <div className="timeline-content">
                <div className="trip-icon">{trip.image}</div>
                <div className="trip-date">{trip.date}</div>
                <h3 className="trip-location">
                  {t(`travel_data.${trip.id}.location`)}
                </h3>
                <p className="trip-description">
                  {t(`travel_data.${trip.id}.short_description`)}
                </p>
                <div className="photo-count">
                  {trip.photoCount} {t('photos_count')}
                </div>
                <div className="view-photos">{t('view_photos')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelPage;