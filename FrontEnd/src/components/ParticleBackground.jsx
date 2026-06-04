import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Mouse tracking variables
    const mouse = {
      x: null,
      y: null,
      radius: 120 // Radius of interaction field
    };

    // Resize handler to keep canvas full size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse position listeners
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle class definition
    class Particle {
      constructor(width, height) {
        this.reset(width, height, true);
      }

      reset(width, height, isInit = false) {
        this.x = Math.random() * width;
        // If initial load, distribute across screen, else spawn at bottom
        this.y = isInit ? Math.random() * height : height + 10;
        this.radius = Math.random() * 4.5 + 1.5; // Premium small-to-medium bokeh dots
        
        // Accelerated drift speed: swifter upward glide
        this.speedY = -(Math.random() * 1.5 + 0.6); 
        this.speedX = Math.random() * 0.4 - 0.2; // Slow side-to-side sway
        
        this.opacity = Math.random() * 0.3 + 0.7; // Highly opaque particles (70% - 100%)
        
        // Metallic gold tones: gold, pale gold, dark gold
        const goldTones = [
          '212, 175, 55',  // #D4AF37
          '191, 149, 63',  // #BF953F
          '170, 119, 28',  // #AA771C
          '245, 236, 200'  // Light gold highlight
        ];
        this.color = goldTones[Math.floor(Math.random() * goldTones.length)];
      }

      update(width, height) {
        // Base drift speed
        this.y += this.speedY;
        this.x += this.speedX;

        // Interactive Evasion: push particles away from cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            // Force strength scales inversely with distance
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);

            // Evade along angle vector
            this.x += Math.cos(angle) * force * 4;
            this.y += Math.sin(angle) * force * 4;
          }
        }

        // If particle moves off-screen or fades out, reset it at the bottom
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset(width, height, false);
        }
      }

      draw(context) {
        context.beginPath();
        // Add a soft glow effect to the gold bokeh particles
        const gradient = context.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 2
        );
        gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        
        context.fillStyle = gradient;
        context.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        context.fill();
      }
    }

    // Initialize particle pool (90 particles for a rich gold dust storm)
    const particleCount = 90;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
