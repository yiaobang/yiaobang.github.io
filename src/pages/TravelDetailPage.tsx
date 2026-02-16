import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import PhotoViewer from '../components/PhotoViewer';
import './TravelDetailPage.css';

interface TravelItem {
  id: string;
  folder: string;
  zh: { location: string; date: string; description: string; short_description: string };
  en: { location: string; date: string; description: string; short_description: string };
  ja: { location: string; date: string; description: string; short_description: string };
}

const TravelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [displayedPhotos, setDisplayedPhotos] = useState(12);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [travelData, setTravelData] = useState<TravelItem | null>(null);
  const [photosList, setPhotosList] = useState<Record<string, string[]>>({});

  useEffect(() => {
    Promise.all([
      fetch('/data/travels.json').then(res => res.json()),
      fetch('/data/photos.json').then(res => res.json())
    ]).then(([travelsData, photosData]) => {
      const item = travelsData.find((t: TravelItem) => t.id === id);
      setTravelData(item || null);
      setPhotosList(photosData);
    });
  }, [id]);

  useEffect(() => {
    if (travelData && photosList[travelData.id]) {
      setPhotos(photosList[travelData.id]);
      setShowLoadMore(photosList[travelData.id].length > 12);
      setLoading(false);
    }
  }, [travelData, photosList]);

  const openViewer = (index: number) => {
    setCurrentPhotoIndex(index);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
  };

  const handleBackToTimeline = () => {
    window.history.back();
  };

  if (!travelData) {
    return <div className="travel-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={handleBackToTimeline}>
          {t('back_to_timeline')}
        </button>
        <h1>{t('trip_not_found')}</h1>
      </div>
    </div>;
  }

  const lang = i18n.language as 'zh' | 'en' | 'ja';
  const tripData = travelData[lang];

  return (
    <div className="travel-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={handleBackToTimeline}>
          {t('back_to_timeline')}
        </button>
        <h1 className="detail-title">{tripData.location}</h1>
        <div className="detail-date">{tripData.date}</div>
      </div>

      <div className="photo-gallery">
        <h2 className="gallery-title">{t('photo_gallery')} ({photos.length} {t('photos_count')})</h2>
        {loading ? (
          <div className="loading">{t('loading_photos')}</div>
        ) : (
          <>
            <div className="photos-grid">
              {photos.slice(0, displayedPhotos).map((photo, index) => (
                <div key={index} className="photo-item" onClick={() => openViewer(index)}>
                  <img 
                    src={photo} 
                    alt={`Photo ${index + 1}`} 
                    className="photo-image"
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => e.currentTarget.style.opacity = '1'}
                  />
                  <div className="photo-overlay">
                    <span>{t('view_full_size')}</span>
                  </div>
                </div>
              ))}
            </div>
            {showLoadMore && displayedPhotos < photos.length && (
              <div className="load-more-container">
                <button 
                  className="load-more-button" 
                  onClick={() => {
                    setDisplayedPhotos(prev => Math.min(prev + 12, photos.length));
                    if (displayedPhotos + 12 >= photos.length) {
                      setShowLoadMore(false);
                    }
                  }}
                >
                  {t('load_more')} ({photos.length - displayedPhotos} {t('photos_remaining')})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="trip-story">
        <h2 className="story-title">{t('travel_story')}</h2>
        <p className="story-text">{tripData.description}</p>
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