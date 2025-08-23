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

  const handleBackToTimeline = () => {
    window.history.back();
  };

  const folderMap: Record<string, string> = {
    '1': '1.しまなみ海道',
    '2': '2.生驹山',
    '3': '3.自転車博物館',
    '4': '4.某个午后',
    '5': '5.奈良金刚山',
    '6': '6.夜景',
    '7': '7.お花見',
    '8': '8.ハルカス'
  };

  useEffect(() => {
    const loadPhotos = async () => {
      if (id && folderMap[id]) {
        setLoading(true);
        try {
          const photoMap: Record<string, string[]> = {
            '1.しまなみ海道': [
              '/images/1.しまなみ海道/20240729_143758.jpg',
              '/images/1.しまなみ海道/20240729_143804.jpg',
              '/images/1.しまなみ海道/20240729_180255.jpg',
              '/images/1.しまなみ海道/20240729_180301.jpg',
              '/images/1.しまなみ海道/20240729_180305.jpg',
              '/images/1.しまなみ海道/20240730_073641.jpg',
              '/images/1.しまなみ海道/20240730_073647.jpg',
              '/images/1.しまなみ海道/20240730_073655.jpg',
              '/images/1.しまなみ海道/20240730_084244.jpg',
              '/images/1.しまなみ海道/20240730_084254.jpg',
              '/images/1.しまなみ海道/20240730_084948.jpg',
              '/images/1.しまなみ海道/20240730_105919.jpg',
              '/images/1.しまなみ海道/20240730_105927.jpg',
              '/images/1.しまなみ海道/20240730_130223.jpg',
              '/images/1.しまなみ海道/20240730_130236.jpg',
              '/images/1.しまなみ海道/20240730_224341.jpg',
              '/images/1.しまなみ海道/20240730_225107.jpg',
              '/images/1.しまなみ海道/20240730_225116.jpg'
            ],
            '2.生驹山': [
              '/images/2.生驹山/20240811_143230.jpg',
              '/images/2.生驹山/20240811_154805.jpg',
              '/images/2.生驹山/20240811_155149.jpg',
              '/images/2.生驹山/20240811_155229.jpg',
              '/images/2.生驹山/20240811_155235.jpg',
              '/images/2.生驹山/20240811_155240.jpg',
              '/images/2.生驹山/20240811_155244.jpg',
              '/images/2.生驹山/20240811_155303.jpg',
              '/images/2.生驹山/20240811_155354.jpg',
              '/images/2.生驹山/20240811_155426.jpg',
              '/images/2.生驹山/20240811_155618.jpg',
              '/images/2.生驹山/20240811_164904.jpg'
            ],
            '3.自転車博物館': [
              '/images/3.自転車博物館/20240816_152306.jpg',
              '/images/3.自転車博物館/20240816_152655.jpg',
              '/images/3.自転車博物館/20240816_152925.jpg',
              '/images/3.自転車博物館/20240816_152933.jpg',
              '/images/3.自転車博物館/20240816_155121.jpg',
              '/images/3.自転車博物館/20240816_160708.jpg',
              '/images/3.自転車博物館/20240816_160738.jpg',
              '/images/3.自転車博物館/20240816_160745.jpg'
            ],
            '4.某个午后': [
              '/images/4.某个午后/20240904_180621.jpg',
              '/images/4.某个午后/20240904_180631.jpg'
            ],
            '5.奈良金刚山': [
              '/images/5.奈良金刚山/20240916_102751.jpg',
              '/images/5.奈良金刚山/20240916_103322.jpg',
              '/images/5.奈良金刚山/20240916_103412.jpg',
              '/images/5.奈良金刚山/20240916_103504.jpg',
              '/images/5.奈良金刚山/20240916_105403.jpg',
              '/images/5.奈良金刚山/20240916_110400.jpg',
              '/images/5.奈良金刚山/20240916_111016.jpg',
              '/images/5.奈良金刚山/20240916_111153.jpg',
              '/images/5.奈良金刚山/20240916_111945.jpg',
              '/images/5.奈良金刚山/20240916_112043.jpg',
              '/images/5.奈良金刚山/20240916_112304.jpg',
              '/images/5.奈良金刚山/20240916_113626.jpg',
              '/images/5.奈良金刚山/20240916_124349.jpg',
              '/images/5.奈良金刚山/20240916_124458.jpg',
              '/images/5.奈良金刚山/20240916_131340.jpg',
              '/images/5.奈良金刚山/20240916_131350.jpg'
            ],
            '6.夜景': [
              '/images/6.夜景/20241220_171849.jpg'
            ],
            '7.お花見': [
              '/images/7.お花見/20250406_142806.jpg',
              '/images/7.お花見/20250406_142821.jpg',
              '/images/7.お花見/20250406_142829.jpg',
              '/images/7.お花見/20250406_143037.jpg',
              '/images/7.お花見/20250406_143246.jpg',
              '/images/7.お花見/20250406_143247.jpg',
              '/images/7.お花見/20250406_143313.jpg',
              '/images/7.お花見/20250406_143349.jpg',
              '/images/7.お花見/20250406_143356.jpg',
              '/images/7.お花見/20250406_143524.jpg',
              '/images/7.お花見/20250406_143642.jpg',
              '/images/7.お花見/20250406_143841.jpg',
              '/images/7.お花見/20250406_144128.jpg',
              '/images/7.お花見/20250406_144138.jpg',
              '/images/7.お花見/20250406_151038.jpg'
            ],
            '8.ハルカス': [
              '/images/8.ハルカス/20250506_144331.jpg',
              '/images/8.ハルカス/20250506_150012.jpg',
              '/images/8.ハルカス/20250506_150140.jpg',
              '/images/8.ハルカス/20250506_150854.jpg',
              '/images/8.ハルカス/20250506_151536.jpg',
              '/images/8.ハルカス/20250506_152059.jpg'
            ]
          };
          
          setPhotos(photoMap[folderMap[id]] || []);
        } catch (error) {
          console.error('Error loading photos:', error);
        }
        setLoading(false);
      }
    };
    loadPhotos();
  }, [id]);

  if (!id || !folderMap[id]) {
    return <div className="travel-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={handleBackToTimeline}>
          {t('back_to_timeline')}
        </button>
        <h1>{t('trip_not_found')}</h1>
      </div>
    </div>;
  }

  return (
    <div className="travel-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={handleBackToTimeline}>
          {t('back_to_timeline')}
        </button>
        <h1 className="detail-title">
          {t(`travel_data.${id}.location`)}
        </h1>
        <div className="detail-date">{t(`travel_data.${id}.date`)}</div>
      </div>

      <div className="photo-gallery">
        <h2 className="gallery-title">{t('photo_gallery')} ({photos.length} {t('photos_count')})</h2>
        {loading ? (
          <div className="loading">{t('loading_photos')}</div>
        ) : (
          <div className="photos-grid">
            {photos.map((photo, index) => (
              <div key={index} className="photo-item" onClick={() => openViewer(index)}>
                <img src={photo} alt={`Photo ${index + 1}`} className="photo-image" />
                <div className="photo-overlay">
                  <span>{t('view_full_size')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="trip-story">
        <h2 className="story-title">{t('travel_story')}</h2>
        <p className="story-text">
          {t(`travel_data.${id}.description`)}
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