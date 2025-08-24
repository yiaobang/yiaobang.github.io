import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './PhotoViewer.css';

interface PhotoViewerProps {
  photos: string[];
  currentIndex: number;
  onClose: () => void;
}

const PhotoViewer = ({ photos, currentIndex, onClose }: PhotoViewerProps) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(currentIndex);
  const [showHint, setShowHint] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showZoomLevel, setShowZoomLevel] = useState(false);

  const nextPhoto = () => {
    setIndex((prev) => (prev + 1) % photos.length);
    resetZoom();
  };

  const prevPhoto = () => {
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
    resetZoom();
  };

  const resetZoom = () => {
    setZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Smooth percentage-based zoom (10% change each scroll)
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(10, zoom * zoomFactor));
    setZoom(newZoom);
    
    // Show zoom level temporarily
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

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="photo-viewer-overlay" onClick={onClose}>
      <div className="photo-viewer-content" onClick={(e) => e.stopPropagation()}>
        <div className="photo-container">
          <button className="nav-button prev" onClick={prevPhoto}>‹</button>
          <img 
            src={photos[index]} 
            alt={`Photo ${index + 1}`} 
            className="viewer-image" 
            onClick={zoom > 1 ? undefined : onClose}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              transform: `scale(${zoom}) translate(${imagePosition.x / zoom}px, ${imagePosition.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          />
          <button className="nav-button next" onClick={nextPhoto}>›</button>
        </div>
        
        <div className="photo-info">
          <span>{index + 1} / {photos.length}</span>
        </div>
        
        {showZoomLevel && (
          <div className="zoom-indicator">
            {Math.round(zoom * 100)}%
          </div>
        )}
        
        <div className="photo-thumbnails">
          {photos.map((photo, i) => (
            <img
              key={i}
              src={photo}
              alt={`Thumbnail ${i + 1}`}
              className={`thumbnail ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
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