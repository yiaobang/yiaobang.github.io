import { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './PhotoViewer.css';

interface PhotoViewerProps {
  photos: string[];
  thumbnails: string[];
  currentIndex: number;
  onClose: () => void;
}

const PhotoViewer = ({ photos, thumbnails, currentIndex, onClose }: PhotoViewerProps) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(currentIndex);
  const [showHint, setShowHint] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showZoomLevel, setShowZoomLevel] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [lastTap, setLastTap] = useState(0);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  const nextPhoto = useCallback(() => {
    setIndex((prev) => (prev + 1) % photos.length);
    resetZoom();
  }, [photos.length, resetZoom]);

  const prevPhoto = useCallback(() => {
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
    resetZoom();
  }, [photos.length, resetZoom]);

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom factor logic
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(10, zoom * zoomFactor));
    
    requestAnimationFrame(() => {
      setZoom(newZoom);
    });
    
    setShowZoomLevel(true);
    setTimeout(() => setShowZoomLevel(false), 1500);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipeLeft = distance > 50;
    const isSwipeRight = distance < -50;
    
    if (isSwipeLeft) nextPhoto();
    if (isSwipeRight) prevPhoto();
  };

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (zoom > 1) resetZoom();
      else setZoom(2.5);
      setLastTap(0);
    } else {
      setLastTap(now);
      if (zoom <= 1) {
        // e.stopPropagation() etc handled via overlay/image logic
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Show hint every time
    setShowHint(true);
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextPhoto, onClose, prevPhoto]);

  useEffect(() => {
    const nearbyIndexes = [
      (index + 1) % photos.length,
      (index - 1 + photos.length) % photos.length,
    ];

    nearbyIndexes.forEach((photoIndex) => {
      const image = new Image();
      image.src = photos[photoIndex];
    });
  }, [index, photos]);

  const visibleThumbnails = useMemo(() => {
    const windowSize = 17;
    const halfWindow = Math.floor(windowSize / 2);
    const start = Math.max(0, Math.min(index - halfWindow, photos.length - windowSize));
    const end = Math.min(photos.length, start + windowSize);

    return thumbnails.slice(start, end).map((thumbnail, offset) => ({
      thumbnail,
      index: start + offset,
    }));
  }, [index, photos.length, thumbnails]);

  const currentPhoto = photos[index];

  return (
    <div className="photo-viewer-overlay" onClick={onClose}>
      {/* Top action bar */}
      <div className="viewer-top-bar" onClick={(e) => e.stopPropagation()}>
        <div className="photo-info-top">
          {index + 1} / {photos.length}
        </div>
        <button className="close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      {/* Navigation Arrows fixed to edges */}
      <button 
        className="nav-button prev" 
        onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
      >
        ‹
      </button>
      <button 
        className="nav-button next" 
        onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
      >
        ›
      </button>

      <div className="photo-viewer-content" onClick={(e) => e.stopPropagation()}>
        <div className="photo-wrapper">
          <img 
            src={currentPhoto} 
            alt={`Photo ${index + 1}`} 
            className="viewer-image" 
            onClick={() => {
              handleTap();
              if (zoom <= 1) onClose();
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            draggable={false}
            style={{
              transform: `scale(${zoom}) translate(${imagePosition.x / zoom}px, ${imagePosition.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
              transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)',
              willChange: 'transform'
            }}
          />
        </div>
        
        {showZoomLevel && (
          <div className="zoom-indicator">
            {Math.round(zoom * 100)}%
          </div>
        )}
        
        <div className="photo-thumbnails">
          {visibleThumbnails.map(({ thumbnail, index: thumbnailIndex }) => (
            <img
              key={thumbnail}
              src={thumbnail}
              alt={`Thumbnail ${thumbnailIndex + 1}`}
              className={`thumbnail ${thumbnailIndex === index ? 'active' : ''}`}
              loading="lazy"
              decoding="async"
              onClick={() => {
                setIndex(thumbnailIndex);
                resetZoom();
              }}
            />
          ))}
        </div>
        
        {showHint && (
          <div className="usage-hint">
            <div className="hint-content">
              <p>{t('viewer_hint_title')}</p>
              <p>{t('viewer_hint_text')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoViewer;
