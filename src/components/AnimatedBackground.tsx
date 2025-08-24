import { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface FloatingShape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'circle' | 'triangle' | 'square';
  opacity: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shapesRef = useRef<FloatingShape[]>([]);
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

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
      return particles;
    };

    const createFloatingShapes = () => {
      const shapes: FloatingShape[] = [];
      const shapeCount = Math.min(20, Math.floor((canvas.width * canvas.height) / 50000));
      const types: ('circle' | 'triangle' | 'square')[] = ['circle', 'triangle', 'square'];
      
      for (let i = 0; i < shapeCount; i++) {
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 30 + 10,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          type: types[Math.floor(Math.random() * types.length)],
          opacity: Math.random() * 0.1 + 0.05,
        });
      }
      return shapes;
    };

    const drawShape = (shape: FloatingShape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.fillStyle = `rgba(255, 255, 255, ${shape.opacity})`;
      ctx.strokeStyle = `rgba(255, 255, 255, ${shape.opacity * 0.5})`;
      ctx.lineWidth = 1;
      
      switch (shape.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.closePath();
          ctx.stroke();
          break;
        case 'square':
          ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          break;
      }
      ctx.restore();
    };

    const animate = () => {
      timeRef.current += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制流动光线效果
      const drawFlowingLights = () => {
        for (let i = 0; i < 4; i++) {
          const y = (canvas.height / 5) * (i + 1);
          const speed = 50 + i * 20;
          const offset = (timeRef.current * speed) % (canvas.width + 200);
          
          // 创建渐变光线
          const gradient = ctx.createLinearGradient(offset - 100, y, offset + 100, y);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.1)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
          gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(offset - 100, y);
          ctx.lineTo(offset + 100, y);
          ctx.stroke();
          
          // 添加一些闪烁点
          if (Math.random() > 0.98) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, y + (Math.random() - 0.5) * 20, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      };
      
      drawFlowingLights();
      
      // 更新和绘制浮动图形
      shapesRef.current.forEach(shape => {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;
        
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;
        
        drawShape(shape);
      });
      
      // 更新粒子位置
      particlesRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });

      // 绘制增强连线
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (150 - distance) / 150 * 0.3;
            const gradient = ctx.createLinearGradient(
              particlesRef.current[i].x, particlesRef.current[i].y,
              particlesRef.current[j].x, particlesRef.current[j].y
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(100, 200, 255, ${opacity * 0.5})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      // 绘制增强粒子
      particlesRef.current.forEach(particle => {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    particlesRef.current = createParticles();
    shapesRef.current = createFloatingShapes();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      particlesRef.current = createParticles();
      shapesRef.current = createFloatingShapes();
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