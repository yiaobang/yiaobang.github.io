import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import PhotoViewer from '../components/PhotoViewer';
import { toDisplayImagePath, toThumbImagePath } from '../data/imageVariants';
import { loadTravelData, type TravelItem, type PhotosByTravelId } from '../data/travelData';
import './TravelDetailPage.css';

const TravelDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [displayedPhotos, setDisplayedPhotos] = useState(12);
  const [travelData, setTravelData] = useState<TravelItem | null>(null);
  const [photosList, setPhotosList] = useState<PhotosByTravelId>({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setDisplayedPhotos(12);
    setViewerOpen(false);

    loadTravelData().then(({ travels, photosByTravelId }) => {
      if (!isMounted) return;

      const item = travels.find((travel) => travel.id === id);
      setTravelData(item || null);
      setPhotosList(photosByTravelId);
      setLoading(false);
    }).catch((error) => {
      console.error('Error loading travel data:', error);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [id]);

  const photos = useMemo(() => {
    if (!travelData) return [];

    return (photosList[travelData.id] || []).map((photo) =>
      photo.replace(/\.jpe?g$/i, '.webp')
    );
  }, [photosList, travelData]);

  const displayPhotos = useMemo(() => photos.map(toDisplayImagePath), [photos]);
  const thumbPhotos = useMemo(() => photos.map(toThumbImagePath), [photos]);

  const remainingPhotos = Math.max(photos.length - displayedPhotos, 0);

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

  if (loading) {
    return (
      <div className="travel-detail-page page-reveal">
        <div className="travel-top-nav">
          <button className="pill-back-button" onClick={handleBackToTimeline}>
            <span>←</span> {t('back_to_timeline') || 'Back'}
          </button>
        </div>
        <div className="loading-container">
           <div className="loading-spinner"></div>
           <p>{t('loading_photos')}</p>
        </div>
      </div>
    );
  }

  if (!travelData) {
    return (
      <div className="travel-detail-page page-reveal">
        <div className="travel-top-nav">
          <button className="pill-back-button" onClick={handleBackToTimeline}>
            <span>←</span> {t('back_to_timeline') || 'Back'}
          </button>
        </div>
        <h1 style={{textAlign: 'center', marginTop: '4rem'}}>{t('trip_not_found')}</h1>
      </div>
    );
  }

  const lang = i18n.language as 'zh' | 'en' | 'ja';
  const tripData = travelData[lang];

  return (
    <div className="travel-detail-page page-reveal">
      <div className="travel-top-nav">
        <button className="pill-back-button" onClick={handleBackToTimeline}>
          <span>←</span> {t('back_to_timeline') || 'Back'}
        </button>
      </div>

      <div className="detail-header reveal-on-scroll">
        <h1 className="detail-title">{tripData.location}</h1>
        <div className="detail-date">{tripData.date}</div>
      </div>

      <div className="photo-gallery">
        <div className="gallery-header reveal-on-scroll">
          <h2 className="gallery-title">{t('photo_gallery')}</h2>
          <span className="gallery-count">{photos.length} {t('photos_count')}</span>
        </div>
        
        {loading ? (
          <div className="loading">{t('loading_photos')}</div>
        ) : (
          <>
            <div className="photos-grid">
              {thumbPhotos.slice(0, displayedPhotos).map((photo, index) => (
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
            {remainingPhotos > 0 && (
              <div className="load-more-container reveal-on-scroll">
                <button 
                  className="load-more-button" 
                  onClick={() => setDisplayedPhotos(prev => Math.min(prev + 12, photos.length))}
                >
                  {t('load_more')} ({remainingPhotos} {t('photos_remaining')})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {tripData.description && (
        <div className="trip-story reveal-on-scroll">
          <h2 className="story-title">{t('travel_story')}</h2>
          <p className="story-text">{tripData.description}</p>
        </div>
      )}
      
      {viewerOpen && (
        <PhotoViewer
          photos={displayPhotos}
          thumbnails={thumbPhotos}
          currentIndex={currentPhotoIndex}
          onClose={closeViewer}
        />
      )}
    </div>
  );
};

export default TravelDetailPage;
