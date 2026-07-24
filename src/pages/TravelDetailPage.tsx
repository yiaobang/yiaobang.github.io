import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useRef, useState, useEffect } from 'react';
import PhotoViewer from '../components/PhotoViewer';
import { toDisplayImagePath, toThumbImagePath } from '../data/imageVariants';
import { loadTravelData, type TravelItem, type PhotosByTravelId } from '../data/travelData';
import './TravelDetailPage.css';

const PHOTOS_PER_PAGE = 12;

const getPaginationItems = (currentPage: number, pageCount: number) => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const items: Array<number | 'ellipsis-left' | 'ellipsis-right'> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(pageCount - 1, currentPage + 1);

  if (start > 2) items.push('ellipsis-left');
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < pageCount - 1) items.push('ellipsis-right');
  items.push(pageCount);

  return items;
};

const TravelDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [travelData, setTravelData] = useState<TravelItem | null>(null);
  const [photosList, setPhotosList] = useState<PhotosByTravelId>({});
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    loadTravelData().then(({ travels, photosByTravelId }) => {
      if (!isMounted) return;

      const item = travels.find((travel) => travel.id === id);
      setTravelData(item || null);
      setPhotosList(photosByTravelId);
      setLoadedId(id ?? null);
      setCurrentPage(1);
      setViewerOpen(false);
    }).catch((error) => {
      console.error('Error loading travel data:', error);
      if (isMounted) setLoadedId(id ?? null);
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

  const pageCount = Math.max(1, Math.ceil(photos.length / PHOTOS_PER_PAGE));
  const pageStart = (currentPage - 1) * PHOTOS_PER_PAGE;
  const pageEnd = Math.min(pageStart + PHOTOS_PER_PAGE, photos.length);
  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, pageCount),
    [currentPage, pageCount]
  );

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), pageCount);
    if (nextPage === currentPage) return;

    setCurrentPage(nextPage);
    window.requestAnimationFrame(() => {
      galleryRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  };

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

  if (loadedId !== id) {
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

      <div className="photo-gallery" ref={galleryRef}>
        <div className="gallery-header reveal-on-scroll">
          <div>
            <h2 className="gallery-title">{t('photo_gallery')}</h2>
            {photos.length > 0 && (
              <p className="gallery-page-summary">
                {t('gallery_range', {
                  start: pageStart + 1,
                  end: pageEnd,
                  total: photos.length,
                })}
              </p>
            )}
          </div>
          <span className="gallery-count">{photos.length} {t('photos_count')}</span>
        </div>

        <div className="photos-grid" key={currentPage}>
          {thumbPhotos.slice(pageStart, pageEnd).map((photo, index) => {
            const photoIndex = pageStart + index;

            return (
              <button
                type="button"
                key={`${photo}-${photoIndex}`}
                className="photo-item"
                onClick={() => openViewer(photoIndex)}
                aria-label={t('open_photo', { number: photoIndex + 1 })}
              >
                <img
                  src={photo}
                  alt={t('photo_alt', { number: photoIndex + 1 })}
                  className="photo-image"
                  loading={index < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <span className="photo-number" aria-hidden="true">
                  {String(photoIndex + 1).padStart(2, '0')}
                </span>
                <span className="photo-overlay" aria-hidden="true">
                  <span>{t('view_full_size')}</span>
                </span>
              </button>
            );
          })}
        </div>

        {pageCount > 1 && (
          <nav className="gallery-pagination" aria-label={t('photo_pagination')}>
            <button
              type="button"
              className="pagination-direction"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label={t('previous_page')}
            >
              <span aria-hidden="true">←</span>
              <span className="pagination-direction-label">{t('previous')}</span>
            </button>

            <div className="pagination-pages">
              {paginationItems.map((item) => (
                typeof item === 'number' ? (
                  <button
                    type="button"
                    key={item}
                    className={`pagination-page${item === currentPage ? ' active' : ''}`}
                    onClick={() => handlePageChange(item)}
                    aria-label={t('go_to_page', { page: item })}
                    aria-current={item === currentPage ? 'page' : undefined}
                  >
                    {item}
                  </button>
                ) : (
                  <span className="pagination-ellipsis" key={item} aria-hidden="true">…</span>
                )
              ))}
            </div>

            <button
              type="button"
              className="pagination-direction"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageCount}
              aria-label={t('next_page')}
            >
              <span className="pagination-direction-label">{t('next')}</span>
              <span aria-hidden="true">→</span>
            </button>

            <span className="pagination-mobile-status">
              {t('page_status', { current: currentPage, total: pageCount })}
            </span>
          </nav>
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
