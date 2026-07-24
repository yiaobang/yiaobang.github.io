import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import './PhotoViewer.css';

interface PhotoViewerProps {
  photos: string[];
  thumbnails: string[];
  currentIndex: number;
  onClose: () => void;
}

interface GestureState {
  pointerId: number;
  pointerType: string;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.5;

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const ChevronIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ResetIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4.5 9a8 8 0 1 1-.1 5.6M4.5 9V4.5M4.5 9H9" />
  </svg>
);

const PhotoViewer = ({ photos, thumbnails, currentIndex, onClose }: PhotoViewerProps) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const viewerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);
  const gestureRef = useRef<GestureState | null>(null);
  const lastTouchTapRef = useRef(0);

  const resetZoom = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPosition({ x: 0, y: 0 });
    setIsPanning(false);
  }, []);

  const selectPhoto = useCallback((nextIndex: number) => {
    if (photos.length === 0) return;

    const wrappedIndex = (nextIndex + photos.length) % photos.length;
    setIndex(wrappedIndex);
    setIsLoading(true);
    resetZoom();
  }, [photos.length, resetZoom]);

  const nextPhoto = useCallback(() => {
    selectPhoto(index + 1);
  }, [index, selectPhoto]);

  const previousPhoto = useCallback(() => {
    selectPhoto(index - 1);
  }, [index, selectPhoto]);

  const changeZoom = useCallback((delta: number) => {
    setZoom((currentZoom) => {
      const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom + delta));
      if (nextZoom === MIN_ZOOM) setPosition({ x: 0, y: 0 });
      return nextZoom;
    });
  }, []);

  const toggleZoom = useCallback(() => {
    if (zoom > MIN_ZOOM) {
      resetZoom();
    } else {
      setZoom(2.5);
    }
  }, [resetZoom, zoom]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElement?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextPhoto();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previousPhoto();
        return;
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        changeZoom(ZOOM_STEP);
        return;
      }

      if (event.key === '-') {
        event.preventDefault();
        changeZoom(-ZOOM_STEP);
        return;
      }

      if (event.key === '0') {
        event.preventDefault();
        resetZoom();
        return;
      }

      if (event.key !== 'Tab' || !viewerRef.current) return;

      const focusableElements = Array.from(
        viewerRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [changeZoom, nextPhoto, onClose, previousPhoto, resetZoom]);

  useEffect(() => {
    if (photos.length <= 1) return;

    const nearbyIndexes = [
      (index + 1) % photos.length,
      (index - 1 + photos.length) % photos.length,
    ];

    nearbyIndexes.forEach((photoIndex) => {
      const image = new Image();
      image.src = photos[photoIndex];
    });
  }, [index, photos]);

  useEffect(() => {
    activeThumbnailRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [index]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    changeZoom(event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    gestureRef.current = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
    if (zoom > MIN_ZOOM) setIsPanning(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId || zoom <= MIN_ZOOM) return;

    setPosition({
      x: gesture.originX + event.clientX - gesture.startX,
      y: gesture.originY + event.clientY - gesture.startY,
    });
  };

  const endPointerGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const distanceX = event.clientX - gesture.startX;
    const distanceY = event.clientY - gesture.startY;
    const isTap = Math.abs(distanceX) < 10 && Math.abs(distanceY) < 10;

    if (zoom === MIN_ZOOM && Math.abs(distanceX) > 58 && Math.abs(distanceY) < 100) {
      if (distanceX < 0) nextPhoto();
      else previousPhoto();
    } else if (gesture.pointerType === 'touch' && isTap) {
      const now = Date.now();
      if (now - lastTouchTapRef.current < 280) {
        toggleZoom();
        lastTouchTapRef.current = 0;
      } else {
        lastTouchTapRef.current = now;
      }
    }

    gestureRef.current = null;
    setIsPanning(false);
  };

  if (photos.length === 0) return null;

  const currentPhoto = photos[index];

  return createPortal(
    <div
      className="photo-viewer-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="photo-viewer"
        ref={viewerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('photo_viewer')}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="viewer-toolbar">
          <div className="viewer-position" aria-live="polite">
            <strong>{index + 1}</strong>
            <span>/ {photos.length}</span>
          </div>

          <div className="viewer-zoom-controls" role="group" aria-label={t('zoom_controls')}>
            <button
              type="button"
              className="viewer-icon-button"
              onClick={() => changeZoom(-ZOOM_STEP)}
              disabled={zoom === MIN_ZOOM}
              aria-label={t('zoom_out')}
              title={t('zoom_out')}
            >
              <MinusIcon />
            </button>
            <button
              type="button"
              className="viewer-zoom-value"
              onClick={resetZoom}
              aria-label={t('reset_zoom')}
              title={t('reset_zoom')}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              className="viewer-icon-button"
              onClick={() => changeZoom(ZOOM_STEP)}
              disabled={zoom === MAX_ZOOM}
              aria-label={t('zoom_in')}
              title={t('zoom_in')}
            >
              <PlusIcon />
            </button>
            <button
              type="button"
              className="viewer-icon-button viewer-reset-button"
              onClick={resetZoom}
              disabled={zoom === MIN_ZOOM}
              aria-label={t('reset_zoom')}
              title={t('reset_zoom')}
            >
              <ResetIcon />
            </button>
          </div>

          <button
            type="button"
            className="viewer-icon-button viewer-close-button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={t('close_viewer')}
            title={t('close_viewer')}
          >
            <CloseIcon />
          </button>
        </header>

        <main
          className={`viewer-stage${zoom > MIN_ZOOM ? ' is-zoomed' : ''}${isPanning ? ' is-panning' : ''}`}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointerGesture}
          onPointerCancel={endPointerGesture}
          onDoubleClick={toggleZoom}
          aria-busy={isLoading}
        >
          {isLoading && (
            <div className="viewer-loading" role="status">
              <span className="viewer-spinner" aria-hidden="true" />
              <span className="sr-only">{t('loading_photos')}</span>
            </div>
          )}

          <img
            key={currentPhoto}
            src={currentPhoto}
            alt={t('photo_alt', { number: index + 1 })}
            className={`viewer-image${isLoading ? ' is-loading' : ''}`}
            draggable={false}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
            }}
          />

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="viewer-nav-button previous"
                onClick={previousPhoto}
                onPointerDown={(event) => event.stopPropagation()}
                aria-label={t('previous_photo')}
                title={t('previous_photo')}
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                className="viewer-nav-button next"
                onClick={nextPhoto}
                onPointerDown={(event) => event.stopPropagation()}
                aria-label={t('next_photo')}
                title={t('next_photo')}
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          )}
        </main>

        <footer className="viewer-footer">
          <p className="viewer-help">{t('viewer_controls_hint')}</p>
          <div className="viewer-filmstrip" aria-label={t('photo_thumbnails')}>
            {thumbnails.map((thumbnail, thumbnailIndex) => (
              <button
                type="button"
                key={`${thumbnail}-${thumbnailIndex}`}
                ref={thumbnailIndex === index ? activeThumbnailRef : undefined}
                className={`viewer-thumbnail${thumbnailIndex === index ? ' active' : ''}`}
                onClick={() => selectPhoto(thumbnailIndex)}
                aria-label={t('open_photo', { number: thumbnailIndex + 1 })}
                aria-current={thumbnailIndex === index ? 'true' : undefined}
              >
                <img
                  src={thumbnail}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span aria-hidden="true">{thumbnailIndex + 1}</span>
              </button>
            ))}
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default PhotoViewer;
