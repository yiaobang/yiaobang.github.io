import { useState } from 'react';
import './PhotoViewer.css';

interface PhotoViewerProps {
  photos: string[];
  currentIndex: number;
  onClose: () => void;
}

const PhotoViewer = ({ photos, currentIndex, onClose }: PhotoViewerProps) => {
  const [index, setIndex] = useState(currentIndex);

  const nextPhoto = () => {
    setIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="photo-viewer-overlay" onClick={onClose} onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="photo-viewer-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="photo-container">
          <button className="nav-button prev" onClick={prevPhoto}>‹</button>
          <img src={photos[index]} alt={`Photo ${index + 1}`} className="viewer-image" />
          <button className="nav-button next" onClick={nextPhoto}>›</button>
        </div>
        
        <div className="photo-info">
          <span>{index + 1} / {photos.length}</span>
        </div>
        
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
      </div>
    </div>
  );
};

export default PhotoViewer;