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
  const [openYears, setOpenYears] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      fetch('/data/travels.json').then(res => res.json()),
      fetch('/data/photos.json').then(res => res.json())
    ]).then(([travelsData, photosData]) => {
      const reversed = (travelsData as TravelItem[]).reverse();
      setTravels(reversed);
      
      const counts: Record<string, number> = {};
      Object.keys(photosData).forEach(id => {
        counts[id] = photosData[id].length;
      });
      setPhotoCount(counts);

      // Default all years to open
      const lang = i18n.language as 'zh' | 'en' | 'ja';
      const yearsSet = new Set(reversed.map(trip => trip[lang].date.split('-')[0]));
      const initialOpen: Record<string, boolean> = {};
      yearsSet.forEach(year => initialOpen[year] = true);
      setOpenYears(initialOpen);
    });
  }, [i18n.language]);

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

  const toggleYear = (year: string) => {
    setOpenYears(prev => ({ ...prev, [year]: !prev[year] }));
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

  const groupTravelsByYear = () => {
    const groups: Record<string, TravelItem[]> = {};
    const lang = i18n.language as 'zh' | 'en' | 'ja';
    travels.forEach(trip => {
      const year = trip[lang].date.split('-')[0];
      if (!groups[year]) groups[year] = [];
      groups[year].push(trip);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
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
        {groupTravelsByYear().map(([year, items]) => (
          <div key={year} className={`year-drawer ${openYears[year] ? 'open' : ''}`}>
            <div className="year-header" onClick={() => toggleYear(year)}>
              <span className="year-number">{year}</span>
              <span className="year-arrow"></span>
            </div>
            
            <div className="year-content">
              <div className="timeline">
                {items.map((trip) => {
                  const lang = i18n.language as 'zh' | 'en' | 'ja';
                  const tripData = trip[lang];
                  return (
                    <div 
                      key={trip.id} 
                      className="timeline-item bento-link"
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
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelPage;