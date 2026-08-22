import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Calendar, MapPin, Mic2, Users, ArrowRight } from 'lucide-react';

// Counter component for animated stats
const AnimatedCounter = ({ from = 0, to, duration = 1.5, suffix = "" }: { from?: number, to: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration: duration,
        ease: [0.22, 1, 0.36, 1], // easeOutQuint-like curve for smooth ending
        onUpdate: (val) => setCount(Math.round(val)),
      });
      return controls.stop;
    }
  }, [from, to, duration, inView]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Canvas-based interactive Audience visualizer
const AudienceVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number, y: number, vx: number, vy: number, radius: number, baseAlpha: number }[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const init = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;

      particles = [];
      const particleCount = Math.min(Math.floor(width / 20), 40); // Responsive particle count
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
          baseAlpha: Math.random() * 0.5 + 0.2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += dx * 0.02;
          p.y += dy * 0.02;
        }

        // Normal movement
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.baseAlpha})`;
        ctx.fill();

        // Connect lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy);
          
          if (ddist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - ddist / 80)})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '80px', position: 'relative', overflow: 'hidden', marginTop: '0.5rem' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

// --- Mini Visualizations for Stats Cards ---

const Waveform = () => (
  <div style={{ display: 'flex', gap: '3px', height: '16px', alignItems: 'flex-end', opacity: 0.6 }}>
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <motion.div
        key={i}
        animate={{ height: ['4px', `${Math.random() * 12 + 4}px`, '4px'] }}
        transition={{ repeat: Infinity, duration: 0.8 + Math.random() * 0.5, delay: i * 0.1 }}
        style={{ width: '3px', backgroundColor: '#ff3366', borderRadius: '2px' }}
      />
    ))}
  </div>
);

const NetworkDots = () => (
  <div style={{ position: 'relative', width: '40px', height: '20px', opacity: 0.6 }}>
    <motion.div animate={{ x: [0, 5, 0], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ position: 'absolute', top: 5, left: 5, width: 4, height: 4, borderRadius: '50%', background: '#ffd700' }} />
    <motion.div animate={{ x: [0, -5, 0], y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ position: 'absolute', top: 10, left: 20, width: 4, height: 4, borderRadius: '50%', background: '#ffd700' }} />
    <motion.div animate={{ x: [0, 4, 0], y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 3.5 }} style={{ position: 'absolute', top: 2, left: 30, width: 4, height: 4, borderRadius: '50%', background: '#ffd700' }} />
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
      <path d="M 7 7 L 22 12 L 32 4" stroke="rgba(255, 215, 0, 0.4)" strokeWidth="1" fill="none" />
    </svg>
  </div>
);

const TrendGraph = () => (
  <div style={{ position: 'relative', width: '40px', height: '20px', opacity: 0.7 }}>
    <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d="M 0 20 L 10 15 L 20 18 L 30 5 L 40 0"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
      />
      <motion.circle
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        cx="40" cy="0" r="2" fill="#ffffff"
      />
    </svg>
  </div>
);


const EcosystemSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section style={{ 
      position: 'relative', 
      width: '100%',
      backgroundColor: '#0d0d10', 
      padding: '4rem 1.5rem',
      overflow: 'hidden',
      color: '#fff',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Background Ambience */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Subtle noise texture */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        {/* Blurred Radial Glows */}
        <motion.div 
          animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          style={{ position: 'absolute', top: '10%', left: '10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(255, 51, 102, 0.08) 0%, transparent 70%)', filter: 'blur(60px)', borderRadius: '50%' }} 
        />
        <motion.div 
          animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ position: 'absolute', top: '40%', right: '10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%' }} 
        />
      </div>

      <div style={{ width: '100%', maxWidth: '1500px', margin: '0 auto', position: 'relative', zIndex: 10, padding: isMobile ? '0 1rem' : '0 2rem' }}>
        
        {/* HERO AREA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4vh' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '4px 12px', 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '30px',
              marginBottom: '2vh'
            }}
          >
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff3366', boxShadow: '0 0 10px #ff3366' }} 
            />
            <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '2px', color: '#fff', fontFamily: '"Inter", sans-serif' }}>LIVE ECOSYSTEM</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, fontFamily: '"Outfit", sans-serif', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '2vh' }}
          >
            We bring the <span style={{ color: '#ff3366' }}>Audience.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', maxWidth: '700px', lineHeight: 1.5, fontFamily: '"Inter", sans-serif' }}
          >
            MIC is a community-driven ecosystem where talent meets opportunity. We strip away the paperwork and let you focus on what you do best: performing. Whether you are a poet, a musician, or a comedian, we provide the venue, the crowd, and the platform.
          </motion.p>
        </div>

        {/* STATISTICS AREA */}
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem', marginBottom: '4vh', width: '100%' }}>
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -4, backgroundColor: 'rgba(255, 51, 102, 0.05)', borderColor: 'rgba(255, 51, 102, 0.3)' }}
              style={{ flex: 1, width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', backdropFilter: 'blur(20px)', transition: 'all 0.4s ease', boxSizing: 'border-box' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: '#ff3366', lineHeight: 1 }}>
                  <AnimatedCounter to={50} suffix="+" />
                </span>
                <Waveform />
              </div>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>Events Hosted</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -4, backgroundColor: 'rgba(255, 215, 0, 0.05)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
              style={{ flex: 1, width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', backdropFilter: 'blur(20px)', transition: 'all 0.4s ease', boxSizing: 'border-box' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: '#ffd700', lineHeight: 1 }}>
                  <AnimatedCounter to={300} suffix="+" />
                </span>
                <NetworkDots />
              </div>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>Artists Onboarded</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              style={{ flex: 1, width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', backdropFilter: 'blur(20px)', transition: 'all 0.4s ease', boxSizing: 'border-box' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: '#ffffff', lineHeight: 1 }}>
                  <AnimatedCounter to={15} suffix="K+" />
                </span>
                <TrendGraph />
              </div>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>Tickets Sold</p>
            </motion.div>

          </div>
        </div>

        {/* AUDIENCE VISUALIZATION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ marginBottom: '4vh' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, color: '#fff' }}>The crowd is already here</h3>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.2), transparent)' }} />
          </div>
          <AudienceVisualizer />
        </motion.div>

        {/* ARTIST -> MIC -> AUDIENCE FLOW */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: isMobile ? '1.5rem 1rem' : '2rem', 
            background: 'linear-gradient(90deg, rgba(255,255,255,0.01), rgba(255,255,255,0.03), rgba(255,255,255,0.01))', 
            borderRadius: '16px', 
            border: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '4vh',
            flexWrap: 'nowrap',
            gap: isMobile ? '1rem' : '1rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <Mic2 color="#ffd700" size={18} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0' }}>ARTIST</h4>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>"Bring your talent"</p>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: isMobile ? '2px' : '100%', height: isMobile ? '20px' : '2px' }}>
            <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
              <motion.div 
                animate={isMobile ? { y: ['-100%', '200%'] } : { x: ['-100%', '200%'] }} 
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ 
                  position: 'absolute', top: 0, left: 0, 
                  width: isMobile ? '100%' : '50%', 
                  height: isMobile ? '50%' : '100%', 
                  background: isMobile ? 'linear-gradient(180deg, transparent, rgba(255,51,102,0.8), transparent)' : 'linear-gradient(90deg, transparent, rgba(255,51,102,0.8), transparent)' 
                }} 
              />
            </div>
            <ArrowRight size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', right: isMobile ? 'auto' : '0', bottom: isMobile ? '0' : 'auto', transform: isMobile ? 'rotate(90deg)' : 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', color: '#ff3366' }}>MIC</span>
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0' }}>PLATFORM</h4>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>"Take the stage"</p>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: isMobile ? '2px' : '100%', height: isMobile ? '20px' : '2px' }}>
            <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
              <motion.div 
                animate={isMobile ? { y: ['-100%', '200%'] } : { x: ['-100%', '200%'] }} 
                transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 0.5 }}
                style={{ 
                  position: 'absolute', top: 0, left: 0, 
                  width: isMobile ? '100%' : '50%', 
                  height: isMobile ? '50%' : '100%', 
                  background: isMobile ? 'linear-gradient(180deg, transparent, rgba(255,255,255,0.8), transparent)' : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' 
                }} 
              />
            </div>
            <ArrowRight size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', right: isMobile ? 'auto' : '0', bottom: isMobile ? '0' : 'auto', transform: isMobile ? 'rotate(90deg)' : 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <Users color="#ffffff" size={18} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0' }}>AUDIENCE</h4>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>"Find your crowd"</p>
          </div>
        </motion.div>

        {/* INFINITE MARQUEE */}
        <div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', marginBottom: '4vh', opacity: 0.4 }}>
          <motion.div 
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            style={{ display: 'inline-block' }}
          >
            <span style={{ fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase', WebkitTextStroke: '1px rgba(255,255,255,0.5)', color: 'transparent', marginRight: '4rem' }}>
              MUSIC · COMEDY · POETRY · LIVE EVENTS · ARTISTS · COMMUNITY · CULTURE · PERFORMANCE · 
              MUSIC · COMEDY · POETRY · LIVE EVENTS · ARTISTS · COMMUNITY · CULTURE · PERFORMANCE ·
            </span>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default EcosystemSection;
