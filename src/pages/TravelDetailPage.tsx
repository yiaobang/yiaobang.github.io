import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import PhotoViewer from '../components/PhotoViewer';
import './TravelDetailPage.css';

const TravelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openViewer = (index: number) => {
    setCurrentPhotoIndex(index);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
  };

  const travelDetails: Record<string, any> = {
    1: {
      location: 'Shimanami Kaido',
      locationZh: '岛波海道',
      date: '2024-07-29~30',
      folder: '1.しまなみ海道',
      description: 'Amazing cycling route connecting islands with beautiful ocean views and bridges!',
      descriptionZh: '连接岛屿的绝美骑行路线，海景和大桥令人震撼！'
    },
    2: {
      location: 'Mount Ikoma',
      locationZh: '生驹山',
      date: '2024-08-11',
      folder: '2.生驹山',
      description: 'Beautiful mountain views and peaceful nature walks with stunning panoramas.',
      descriptionZh: '美丽的山景和宁静的自然漫步，全景令人难忘。'
    },
    3: {
      location: 'Bicycle Museum',
      locationZh: '自行车博物馆',
      date: '2024-08-16',
      folder: '3.自転車博物館',
      description: 'Fascinating history of bicycles and cycling culture exploration.',
      descriptionZh: '迷人的自行车历史和骑行文化探索之旅。'
    },
    4: {
      location: 'Peaceful Afternoon',
      locationZh: '某个午后',
      date: '2024-09-04',
      folder: '4.某个午后',
      description: 'A quiet moment captured in time, simple beauty of everyday life.',
      descriptionZh: '被定格的宁静时光，日常生活中的简单美好。'
    },
    5: {
      location: 'Mount Kongo, Nara',
      locationZh: '奈良金刚山',
      date: '2024-09-16',
      folder: '5.奈良金刚山',
      description: 'Challenging mountain hike with rewarding views and nature immersion.',
      descriptionZh: '具有挑战性的登山之旅，收获美景与自然沉浸。'
    },
    6: {
      location: 'Night Views',
      locationZh: '夜景',
      date: '2024-12-20',
      folder: '6.夜景',
      description: 'Stunning city lights and magical night atmosphere.',
      descriptionZh: '迷人的城市灯光和神奇的夜晚氛围。'
    },
    7: {
      location: 'Cherry Blossom Viewing',
      locationZh: '赏樱',
      date: '2025-04-06',
      folder: '7.お花見',
      description: 'Beautiful sakura season in full bloom, spring at its finest!',
      descriptionZh: '樱花盛开的美丽季节，春天最美的时刻！'
    },
    8: {
      location: 'Abeno Harukas, Osaka',
      locationZh: '大阪阿倍野哈鲁卡斯',
      date: '2025-05-06',
      folder: '8.ハルカス',
      description: 'Amazing views from Japan\'s tallest building, breathtaking cityscape!',
      descriptionZh: '从日本最高楼俯瞰的惊人景色，令人屏息的城市景观！'
    }
  };

  const trip = travelDetails[id as string];

  useEffect(() => {
    const loadPhotos = async () => {
      if (trip?.folder) {
        setLoading(true);
        try {
          // 动态导入所有照片
          const photoModules = import.meta.glob('/src/assets/images/**/*.jpg', { eager: true });
          const folderPhotos: string[] = [];
          
          Object.keys(photoModules).forEach((path) => {
            if (path.includes(trip.folder)) {
              const module = photoModules[path] as { default: string };
              folderPhotos.push(module.default);
            }
          });
          
          // 按文件名排序
          folderPhotos.sort();
          setPhotos(folderPhotos);
        } catch (error) {
          console.error('Error loading photos:', error);
        }
        setLoading(false);
      }
    };
    loadPhotos();
  }, [id, trip]);

  if (!trip) {
    return <div className="travel-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate('/travel')}>
          ← Back to Timeline
        </button>
        <h1>Trip not found</h1>
      </div>
    </div>;
  }

  return (
    <div className="travel-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate('/travel')}>
          ← Back to Timeline
        </button>
        <h1 className="detail-title">
          {t('language') === 'zh' ? trip.locationZh : trip.location}
        </h1>
        <div className="detail-date">{trip.date}</div>
      </div>

      <div className="photo-gallery">
        <h2 className="gallery-title">📸 Photo Gallery ({photos.length} photos)</h2>
        {loading ? (
          <div className="loading">Loading photos...</div>
        ) : (
          <div className="photos-grid">
            {photos.map((photo, index) => (
              <div key={index} className="photo-item" onClick={() => openViewer(index)}>
                <img src={photo} alt={`Photo ${index + 1}`} className="photo-image" />
                <div className="photo-overlay">
                  <span>📷 View Full Size</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="trip-story">
        <h2 className="story-title">✨ Travel Story</h2>
        <p className="story-text">
          {t('language') === 'zh' ? trip.descriptionZh : trip.description}
        </p>
      </div>
      
      {viewerOpen && (
        <PhotoViewer
          photos={photos}
          currentIndex={currentPhotoIndex}
          onClose={closeViewer}
        />
      )}
    </div>
  );
};

export default TravelDetailPage;