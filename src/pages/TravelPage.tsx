import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './TravelPage.css';

const TravelPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const travelData = [
    {
      id: 8,
      date: '2025-05',
      location: 'Abeno Harukas, Osaka',
      locationZh: '大阪阿倍野ハルカス',
      description: 'Tallest building in Japan with amazing city views',
      descriptionZh: '日本最高楼，俯瞰城市美景',
      image: '🏢',
      folder: '8.ハルカス'
    },
    {
      id: 7,
      date: '2025-04',
      location: 'Cherry Blossom Viewing',
      locationZh: '赏樱',
      description: 'Beautiful sakura season in full bloom',
      descriptionZh: '樱花盛开的美丽季节',
      image: '🌸',
      folder: '7.お花見'
    },
    {
      id: 6,
      date: '2024-12',
      location: 'Night Views',
      locationZh: '夜景',
      description: 'Stunning night cityscape',
      descriptionZh: '迷人的城市夜景',
      image: '🌃',
      folder: '6.夜景'
    },
    {
      id: 5,
      date: '2024-09',
      location: 'Mount Kongo, Nara',
      locationZh: '奈良金刚山',
      description: 'Mountain hiking adventure',
      descriptionZh: '登山冒险之旅',
      image: '⛰️',
      folder: '5.奈良金刚山'
    },
    {
      id: 4,
      date: '2024-09',
      location: 'Peaceful Afternoon',
      locationZh: '某个午后',
      description: 'A quiet moment in time',
      descriptionZh: '宁静的时光',
      image: '🌅',
      folder: '4.某个午后'
    },
    {
      id: 3,
      date: '2024-08',
      location: 'Bicycle Museum',
      locationZh: '自行车博物馆',
      description: 'Exploring cycling history and culture',
      descriptionZh: '探索自行车历史文化',
      image: '🚴',
      folder: '3.自転車博物館'
    },
    {
      id: 2,
      date: '2024-08',
      location: 'Mount Ikoma',
      locationZh: '生驹山',
      description: 'Mountain views and nature',
      descriptionZh: '山景与自然',
      image: '🌲',
      folder: '2.生駒山'
    },
    {
      id: 1,
      date: '2024-07',
      location: 'Shimanami Kaido',
      locationZh: '岛波海道',
      description: 'Cycling route connecting islands',
      descriptionZh: '连接岛屿的骑行路线',
      image: '🌊',
      folder: '1.しまなみ海道'
    }
  ];

  const handleTripClick = (tripId: number) => {
    navigate(`/travel/${tripId}`);
  };

  return (
    <div className="travel-page">
      <div className="travel-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
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
                  {t('language') === 'zh' ? trip.locationZh : trip.location}
                </h3>
                <p className="trip-description">
                  {t('language') === 'zh' ? trip.descriptionZh : trip.description}
                </p>
                <div className="view-photos">📸 View Photos</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelPage;