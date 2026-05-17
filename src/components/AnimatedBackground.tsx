import { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(window.innerWidth * pixelRatio);
      canvas.height = Math.floor(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const createBlobs = () => {
      const blobs: Blob[] = [];
      const colors = ['rgba(100, 200, 255, 0.3)', 'rgba(255, 100, 200, 0.3)', 'rgba(200, 255, 100, 0.3)', 'rgba(255, 200, 100, 0.3)'];
      
      for (let i = 0; i < 6; i++) {
        blobs.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 200 + 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.4 + 0.2,
        });
      }
      return blobs;
    };

    const animate = () => {
      timeRef.current += 0.005;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Update blobs
      blobsRef.current.forEach((blob, index) => {
        // Smooth movement with sine waves
        blob.x += blob.vx + Math.sin(timeRef.current + index) * 0.2;
        blob.y += blob.vy + Math.cos(timeRef.current + index) * 0.2;
        
        // Bounce off edges
        if (blob.x < -blob.size/2) blob.x = window.innerWidth + blob.size/2;
        if (blob.x > window.innerWidth + blob.size/2) blob.x = -blob.size/2;
        if (blob.y < -blob.size/2) blob.y = window.innerHeight + blob.size/2;
        if (blob.y > window.innerHeight + blob.size/2) blob.y = -blob.size/2;
        
        // Pulsing size
        const currentSize = blob.size + Math.sin(timeRef.current * 2 + index) * 20;
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, currentSize
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.filter = 'blur(20px)';
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';
      });
      

      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    blobsRef.current = createBlobs();
    if (!reduceMotion) {
      animate();
    }

    const handleResize = () => {
      resizeCanvas();
      blobsRef.current = createBlobs();
    };

    const handleVisibilityChange = () => {
      if (document.hidden && animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      } else if (!document.hidden && !animationRef.current && !reduceMotion) {
        animate();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="animated-background-container">
      <div className="gradient-background"></div>
      <canvas ref={canvasRef} className="particles-canvas" />
    </div>
  );
};

export default AnimatedBackground;
