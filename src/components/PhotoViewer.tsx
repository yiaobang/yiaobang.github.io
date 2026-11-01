import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
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

interface ViewTransform {
  scale: number;
  x: number;
  y: number;
}

type GestureMode = 'pan' | 'pinch' | 'swipe';

interface Gesture {
  mode: GestureMode;
  /** 双指起始间距，仅 pinch 使用 */
  startDistance: number;
  /** 手势起点（视口坐标） */
  startPoint: Point;
  /** 手势开始时的变换 */
  startView: ViewTransform;
  /** 缩放锚点，相对 stage 中心 */
  anchor: Point;
  /** 双指手势结束后接续的单指手势不再参与双击判定，否则收拢双指会被误判成一次点击 */
  tapEligible: boolean;
}

interface Point {
  x: number;
  y: number;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.5;
const DOUBLE_TAP_ZOOM = 2.5;
/** 触发切图所需的水平位移（屏幕像素） */
const SWIPE_THRESHOLD = 64;
/** 拖动跟手时的阻尼，让边缘有"拉不动"的手感 */
const SWIPE_DAMPING = 0.55;
/** 判定为点击的最大位移 */
const TAP_TOLERANCE = 10;
const DOUBLE_TAP_DELAY = 300;
const DOUBLE_TAP_DISTANCE = 44;

const IDENTITY: ViewTransform = { scale: 1, x: 0, y: 0 };

const clampValue = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const distanceBetween = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const midpointOf = (a: Point, b: Point) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

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
  const [view, setView] = useState<ViewTransform>(IDENTITY);
  const [animating, setAnimating] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  /** 已成功解码的图片地址；用它判断"当前这张是否加载完"，天然避免快速切图的竞态 */
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);

  const viewRef = useRef<ViewTransform>(IDENTITY);
  const pointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef<Gesture | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);

  const currentPhoto = photos[index];
  const isLoading = loadedSrc !== currentPhoto;
  const isZoomed = view.scale > MIN_ZOOM + 0.001;

  /** stage 内容区的尺寸，以及图片在未缩放时的实际显示尺寸 */
  const getStageMetrics = useCallback(() => {
    const stage = stageRef.current;
    const image = imageRef.current;
    if (!stage || !image) return null;

    const style = window.getComputedStyle(stage);
    const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const viewWidth = Math.max(1, stage.clientWidth - paddingX);
    const viewHeight = Math.max(1, stage.clientHeight - paddingY);

    const naturalWidth = image.naturalWidth || viewWidth;
    const naturalHeight = image.naturalHeight || viewHeight;
    // 与 CSS 的 max-width/max-height + object-fit: contain 保持一致（小图不放大）
    const fit = Math.min(viewWidth / naturalWidth, viewHeight / naturalHeight, 1);

    return {
      viewWidth,
      viewHeight,
      width: naturalWidth * fit,
      height: naturalHeight * fit,
    };
  }, []);

  /**
   * 把变换限制在合理范围：
   * 放大后不允许把图片拖出可视区；未放大时只允许水平位移（用于左右滑动切图）。
   */
  const clampView = useCallback(
    (next: ViewTransform): ViewTransform => {
      const scale = clampValue(next.scale, MIN_ZOOM, MAX_ZOOM);
      const metrics = getStageMetrics();

      if (!metrics) return { scale, x: 0, y: 0 };

      if (scale <= MIN_ZOOM + 0.001) {
        const limit = metrics.viewWidth * 0.45;
        return { scale, x: clampValue(next.x, -limit, limit), y: 0 };
      }

      const maxX = Math.max(0, (metrics.width * scale - metrics.viewWidth) / 2);
      const maxY = Math.max(0, (metrics.height * scale - metrics.viewHeight) / 2);

      return {
        scale,
        x: clampValue(next.x, -maxX, maxX),
        y: clampValue(next.y, -maxY, maxY),
      };
    },
    [getStageMetrics]
  );

  /** 以屏幕上某个点为锚点缩放：锚点下的画面内容保持不动 */
  const zoomAt = useCallback(
    (targetScale: number, anchor: Point, from: ViewTransform): ViewTransform => {
      const scale = clampValue(targetScale, MIN_ZOOM, MAX_ZOOM);
      const ratio = scale / from.scale;

      return clampView({
        scale,
        x: anchor.x - (anchor.x - from.x) * ratio,
        y: anchor.y - (anchor.y - from.y) * ratio,
      });
    },
    [clampView]
  );

  /** 指针坐标 → 相对 stage 中心的坐标 */
  const toLocalPoint = useCallback((clientX: number, clientY: number): Point => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };

    const rect = stage.getBoundingClientRect();
    return {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2,
    };
  }, []);

  /** 手势过程中用 rAF 合并渲染，避免一次移动触发多次重绘 */
  const commitView = useCallback((next: ViewTransform) => {
    viewRef.current = next;

    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      setView(viewRef.current);
    });
  }, []);

  const commitImmediately = useCallback((next: ViewTransform) => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    viewRef.current = next;
    setView(next);
  }, []);

  const animateTo = useCallback(
    (next: ViewTransform) => {
      setAnimating(true);
      commitImmediately(next);
    },
    [commitImmediately]
  );

  const selectPhoto = useCallback(
    (nextIndex: number) => {
      if (photos.length === 0) return;

      const wrapped = (nextIndex + photos.length) % photos.length;

      setIndex(wrapped);
      setLoadedSrc(null);
      setAnimating(false);
      setIsPanning(false);
      gestureRef.current = null;
      pointersRef.current.clear();
      lastTapRef.current = null;
      commitImmediately(IDENTITY);
    },
    [commitImmediately, photos.length]
  );

  const nextPhoto = useCallback(() => selectPhoto(index + 1), [index, selectPhoto]);
  const previousPhoto = useCallback(() => selectPhoto(index - 1), [index, selectPhoto]);

  const resetView = useCallback(() => animateTo(IDENTITY), [animateTo]);

  const changeZoom = useCallback(
    (delta: number) => {
      setAnimating(true);
      commitImmediately(zoomAt(viewRef.current.scale + delta, { x: 0, y: 0 }, viewRef.current));
    },
    [commitImmediately, zoomAt]
  );

  const toggleZoomAt = useCallback(
    (anchor: Point) => {
      const current = viewRef.current;

      if (current.scale > MIN_ZOOM + 0.01) {
        animateTo(IDENTITY);
        return;
      }

      setAnimating(true);
      commitImmediately(zoomAt(DOUBLE_TAP_ZOOM, anchor, current));
    },
    [animateTo, commitImmediately, zoomAt]
  );

  /** 双击 / 双重点按：以点按位置为锚点放大，再点一次复位 */
  const registerTap = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const now = performance.now();
      const last = lastTapRef.current;

      if (
        last &&
        now - last.time < DOUBLE_TAP_DELAY &&
        Math.hypot(event.clientX - last.x, event.clientY - last.y) < DOUBLE_TAP_DISTANCE
      ) {
        lastTapRef.current = null;
        toggleZoomAt(toLocalPoint(event.clientX, event.clientY));
        return;
      }

      lastTapRef.current = { time: now, x: event.clientX, y: event.clientY };
    },
    [toLocalPoint, toggleZoomAt]
  );

  const beginGesture = useCallback(() => {
    const points = [...pointersRef.current.values()];
    const previousMode = gestureRef.current?.mode;

    if (points.length >= 2) {
      const [a, b] = points;
      const center = midpointOf(a, b);
      gestureRef.current = {
        mode: 'pinch',
        startDistance: Math.max(1, distanceBetween(a, b)),
        startPoint: center,
        startView: viewRef.current,
        anchor: toLocalPoint(center.x, center.y),
        tapEligible: false,
      };
      setIsPanning(true);
      setAnimating(false);
      lastTapRef.current = null;
      return;
    }

    if (points.length === 1) {
      const [point] = points;
      const zoomed = viewRef.current.scale > MIN_ZOOM + 0.001;
      gestureRef.current = {
        mode: zoomed ? 'pan' : 'swipe',
        startDistance: 0,
        startPoint: point,
        startView: viewRef.current,
        anchor: toLocalPoint(point.x, point.y),
        tapEligible: previousMode !== 'pinch',
      };
      setIsPanning(zoomed);
      setAnimating(false);
    }
  }, [toLocalPoint]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    stageRef.current?.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    beginGesture();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const gesture = gestureRef.current;
    if (!gesture) return;

    const points = [...pointersRef.current.values()];

    if (gesture.mode === 'pinch' && points.length >= 2) {
      const [a, b] = points;
      const center = midpointOf(a, b);
      const span = Math.max(1, distanceBetween(a, b));
      const nextScale = clampValue(
        (gesture.startView.scale * span) / gesture.startDistance,
        MIN_ZOOM,
        MAX_ZOOM
      );
      const ratio = nextScale / gesture.startView.scale;
      const { anchor, startView, startPoint } = gesture;

      commitView(
        clampView({
          scale: nextScale,
          x: anchor.x - (anchor.x - startView.x) * ratio + (center.x - startPoint.x),
          y: anchor.y - (anchor.y - startView.y) * ratio + (center.y - startPoint.y),
        })
      );
      return;
    }

    if (gesture.mode === 'pan') {
      commitView(
        clampView({
          scale: gesture.startView.scale,
          x: gesture.startView.x + (event.clientX - gesture.startPoint.x),
          y: gesture.startView.y + (event.clientY - gesture.startPoint.y),
        })
      );
      return;
    }

    // swipe：未放大时的水平拖动，跟手位移用于提示"要翻页了"
    const deltaX = event.clientX - gesture.startPoint.x;
    const deltaY = event.clientY - gesture.startPoint.y;

    if (Math.abs(deltaX) < TAP_TOLERANCE && Math.abs(deltaY) < TAP_TOLERANCE) return;

    commitView(
      clampView({
        scale: MIN_ZOOM,
        x: deltaX * SWIPE_DAMPING,
        y: 0,
      })
    );
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    const tracked = pointersRef.current.delete(event.pointerId);
    if (!tracked) return;

    if (pointersRef.current.size > 0) {
      // 双指松开一指后以剩余手指重建手势，避免跳变；顺便把缩回原尺寸时的偏移归零
      if (viewRef.current.scale <= MIN_ZOOM + 0.001 && Math.abs(viewRef.current.x) > 0.5) {
        animateTo(IDENTITY);
      }
      beginGesture();
      return;
    }

    gestureRef.current = null;
    setIsPanning(false);

    if (!gesture) return;

    const deltaX = event.clientX - gesture.startPoint.x;
    const deltaY = event.clientY - gesture.startPoint.y;
    const travel = Math.hypot(deltaX, deltaY);

    if (gesture.mode === 'swipe') {
      const shouldSwitch =
        Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY);

      if (shouldSwitch) {
        if (deltaX < 0) nextPhoto();
        else previousPhoto();
        return;
      }

      if (Math.abs(viewRef.current.x) > 0.5) {
        animateTo(IDENTITY);
      }

      if (travel <= TAP_TOLERANCE && gesture.tapEligible) {
        registerTap(event);
      } else if (travel > TAP_TOLERANCE) {
        lastTapRef.current = null;
      }
    }
  };

  // 打开时锁定滚动、把背景从无障碍树里摘掉，关闭时还原
  useEffect(() => {
    const root = document.getElementById('root');
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    document.body.style.overflow = 'hidden';
    root?.setAttribute('inert', '');
    root?.setAttribute('aria-hidden', 'true');
    viewerRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      root?.removeAttribute('inert');
      root?.removeAttribute('aria-hidden');
      previouslyFocused?.focus();
    };
  }, []);

  // 滚轮缩放：必须用非 passive 的原生监听，React 的 onWheel 是 passive 的，preventDefault 无效
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const anchor = toLocalPoint(event.clientX, event.clientY);
      const factor = Math.exp(-event.deltaY * 0.0012);

      setAnimating(false);
      commitImmediately(zoomAt(viewRef.current.scale * factor, anchor, viewRef.current));
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    return () => stage.removeEventListener('wheel', handleWheel);
  }, [commitImmediately, toLocalPoint, zoomAt]);

  // 键盘操作 + 焦点循环
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          return;
        case 'ArrowRight':
          event.preventDefault();
          nextPhoto();
          return;
        case 'ArrowLeft':
          event.preventDefault();
          previousPhoto();
          return;
        case '+':
        case '=':
          event.preventDefault();
          changeZoom(ZOOM_STEP);
          return;
        case '-':
        case '_':
          event.preventDefault();
          changeZoom(-ZOOM_STEP);
          return;
        case '0':
          event.preventDefault();
          resetView();
          return;
        case 'Home':
          event.preventDefault();
          selectPhoto(0);
          return;
        case 'End':
          event.preventDefault();
          selectPhoto(photos.length - 1);
          return;
        default:
          break;
      }

      if (event.key !== 'Tab' || !viewerRef.current) return;

      const focusable = Array.from(
        viewerRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [changeZoom, nextPhoto, onClose, photos.length, previousPhoto, resetView, selectPhoto]);

  // 预取相邻照片，切图时不至于白屏
  useEffect(() => {
    if (photos.length <= 1) return;

    [(index + 1) % photos.length, (index - 1 + photos.length) % photos.length].forEach(
      (photoIndex) => {
        const image = new Image();
        image.src = photos[photoIndex];
      }
    );
  }, [index, photos]);

  // 缩略图跟随高亮项滚动到可视区
  useEffect(() => {
    activeThumbnailRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [index]);

  // 卸载时取消挂起的帧
  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    },
    []
  );

  if (photos.length === 0) return null;

  return createPortal(
    <div className="photo-viewer-overlay" onClick={onClose} role="presentation">
      <div
        className="photo-viewer"
        ref={viewerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('photo_viewer')}
        tabIndex={-1}
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
              disabled={view.scale <= MIN_ZOOM + 0.001}
              aria-label={t('zoom_out')}
              title={t('zoom_out')}
            >
              <MinusIcon />
            </button>
            <button
              type="button"
              className="viewer-zoom-value"
              onClick={resetView}
              aria-label={t('reset_zoom')}
              title={t('reset_zoom')}
            >
              {Math.round(view.scale * 100)}%
            </button>
            <button
              type="button"
              className="viewer-icon-button"
              onClick={() => changeZoom(ZOOM_STEP)}
              disabled={view.scale >= MAX_ZOOM - 0.001}
              aria-label={t('zoom_in')}
              title={t('zoom_in')}
            >
              <PlusIcon />
            </button>
            <button
              type="button"
              className="viewer-icon-button viewer-reset-button"
              onClick={resetView}
              disabled={!isZoomed}
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
          className={`viewer-stage${isZoomed ? ' is-zoomed' : ''}${isPanning ? ' is-panning' : ''}`}
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-busy={isLoading}
        >
          {isLoading && (
            <div className="viewer-loading" role="status">
              <span className="viewer-spinner" aria-hidden="true" />
              <span className="sr-only">{t('loading_photos')}</span>
            </div>
          )}

          {thumbnails[index] && (
            <img
              className={`viewer-placeholder${isLoading ? '' : ' is-hidden'}`}
              src={thumbnails[index]}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          )}

          <img
            key={currentPhoto}
            ref={imageRef}
            src={currentPhoto}
            alt={t('photo_alt', { number: index + 1 })}
            className={`viewer-image${animating ? ' is-animating' : ''}${isLoading ? ' is-loading' : ''}`}
            draggable={false}
            onLoad={() => setLoadedSrc(currentPhoto)}
            onError={() => setLoadedSrc(currentPhoto)}
            style={{
              transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
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
                <img src={thumbnail} alt="" loading="lazy" decoding="async" />
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
