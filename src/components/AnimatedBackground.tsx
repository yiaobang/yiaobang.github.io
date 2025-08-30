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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createBlobs = () => {
      const blobs: Blob[] = [];
      const colors = ['rgba(100, 200, 255, 0.3)', 'rgba(255, 100, 200, 0.3)', 'rgba(200, 255, 100, 0.3)', 'rgba(255, 200, 100, 0.3)'];
      
      for (let i = 0; i < 6; i++) {
        blobs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update blobs
      blobsRef.current.forEach((blob, index) => {
        // Smooth movement with sine waves
        blob.x += blob.vx + Math.sin(timeRef.current + index) * 0.2;
        blob.y += blob.vy + Math.cos(timeRef.current + index) * 0.2;
        
        // Bounce off edges
        if (blob.x < -blob.size/2) blob.x = canvas.width + blob.size/2;
        if (blob.x > canvas.width + blob.size/2) blob.x = -blob.size/2;
        if (blob.y < -blob.size/2) blob.y = canvas.height + blob.size/2;
        if (blob.y > canvas.height + blob.size/2) blob.y = -blob.size/2;
        
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
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      blobsRef.current = createBlobs();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
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