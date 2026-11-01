import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { loadTravelData, type TravelItem } from '../data/travelData';
import './TravelPage.css';

type LoadState = 'loading' | 'ready' | 'error';

const TravelPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [travels, setTravels] = useState<TravelItem[]>([]);
  const [photoCount, setPhotoCount] = useState<Record<string, number>>({});
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let isMounted = true;

    loadTravelData()
      .then(({ travels: items, photosByTravelId }) => {
        if (!isMounted) return;

        setTravels([...items].reverse());

        const counts: Record<string, number> = {};
        Object.keys(photosByTravelId).forEach(id => {
          counts[id] = photosByTravelId[id].length;
        });
        setPhotoCount(counts);
        setLoadState('ready');
      })
      .catch((error: unknown) => {
        console.error('加载游记数据失败：', error);
        if (isMounted) setLoadState('error');
      });

    return () => { isMounted = false; };
  }, [reloadToken]);

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

  const handleRetry = useCallback(() => {
    setLoadState('loading');
    setReloadToken((token) => token + 1);
  }, []);

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

      {loadState === 'error' ? (
        <div className="travel-status" role="alert">
          <p className="travel-status-text">{t('travel_load_error')}</p>
          <button type="button" className="travel-status-action" onClick={handleRetry}>
            {t('retry')}
          </button>
        </div>
      ) : loadState === 'loading' ? (
        <div className="travel-status" role="status">
          <span className="travel-status-spinner" aria-hidden="true" />
          <p className="travel-status-text">{t('loading_photos')}</p>
        </div>
      ) : (
        <div className="travel-list-container">
          {travels.map((trip, index) => {
            const lang = i18n.language as 'zh' | 'en' | 'ja';
            const tripData = trip[lang] ?? trip.en;
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
      )}
    </div>
  );
};

export default TravelPage;
