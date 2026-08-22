import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic2, Ticket, Sparkles, ChevronRight, Calendar, MapPin, Star, Quote, ChevronUp, ChevronDown, ArrowRight, Heart, Lock } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import EcosystemSection from '../components/EcosystemSection';
import { FAQSection } from '../components/FAQSection';
import { ShowcaseGallery } from '../components/ShowcaseGallery';

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;

const HeroPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mobile check state
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigate = useNavigate();
  
  // Parallax scroll effects
  const { scrollY } = useScroll();

  // Mapping raw scroll pixels to Y translation pixels
  const bgY = useTransform(scrollY, [0, 1000], [0, 200]); // 50% reduced
  const logoY = useTransform(scrollY, [0, 1000], [0, 350]); // 50% reduced
  const manY = useTransform(scrollY, [0, 1000], [0, 50]); // 50% reduced
  
  // Parallax for Barricades moving outwards
  const leftBarricadeX = useTransform(scrollY, [0, 1000], ['0%', '-100%']);
  const rightBarricadeX = useTransform(scrollY, [0, 1000], ['0%', '100%']);

  // Multi-Set Scroll Animation (3 Sets)
  const multiSetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: setProgress } = useScroll({
    target: multiSetRef,
    offset: ["start start", "end end"]
  });

  // Set 1: ENROLL
  const opacity1 = useTransform(setProgress, [0, 0.20, 0.25], [1, 1, 0], { clamp: true });
  const bgX1 = useTransform(setProgress, [0, 0.25], ['-10%', '0%'], { clamp: true });
  const pngX1 = useTransform(setProgress, [0, 0.1, 0.25], ['50vw', '0vw', '0vw'], { clamp: true });
  const textX1 = useTransform(setProgress, [0, 0.1, 0.25], ['-50vw', '0vw', '5vw'], { clamp: true });
  const cardX1 = useTransform(setProgress, [0, 0.20, 0.25], ['0vw', '0vw', '10vw'], { clamp: true });
  const topLeftX1 = useTransform(setProgress, [0, 0.20, 0.25], ['0vw', '0vw', '-10vw'], { clamp: true });
  const topRightX1 = useTransform(setProgress, [0, 0.20, 0.25], ['0vw', '0vw', '10vw'], { clamp: true });

  // Set 2: INFO
  const opacity2 = useTransform(setProgress, [0.25, 0.30, 0.45, 0.50], [0, 1, 1, 0], { clamp: true });
  const bgX2 = useTransform(setProgress, [0.25, 0.50], ['-10%', '0%'], { clamp: true });
  const pngX2 = useTransform(setProgress, [0.25, 0.30, 0.50], ['50vw', '0vw', '0vw'], { clamp: true });
  const textX2 = useTransform(setProgress, [0.25, 0.30, 0.50], ['-50vw', '0vw', '5vw'], { clamp: true });
  const cardX2 = useTransform(setProgress, [0.25, 0.30, 0.45, 0.50], ['10vw', '0vw', '0vw', '10vw'], { clamp: true });
  const topLeftX2 = useTransform(setProgress, [0.25, 0.30, 0.45, 0.50], ['-10vw', '0vw', '0vw', '-10vw'], { clamp: true });

  // Set 3: TRACK
  const opacity3 = useTransform(setProgress, [0.50, 0.55, 0.70, 0.75], [0, 1, 1, 0], { clamp: true });
  const bgX3 = useTransform(setProgress, [0.50, 0.75], ['-10%', '0%'], { clamp: true });
  const pngX3 = useTransform(setProgress, [0.50, 0.55, 0.75], ['50vw', '0vw', '0vw'], { clamp: true });
  const pngRotateY3 = useTransform(setProgress, [0.50, 0.55, 0.75], [360, 0, 0], { clamp: true });
  const textX3 = useTransform(setProgress, [0.50, 0.55, 0.75], ['-50vw', '0vw', '5vw'], { clamp: true });
  const cardX3 = useTransform(setProgress, [0.50, 0.55, 0.70, 0.75], ['10vw', '0vw', '0vw', '10vw'], { clamp: true });
  const topLeftX3 = useTransform(setProgress, [0.50, 0.55, 0.70, 0.75], ['-10vw', '0vw', '0vw', '-10vw'], { clamp: true });

  // Set 4: PERFORM
  const opacity4 = useTransform(setProgress, [0.75, 0.80, 1], [0, 1, 1], { clamp: true });
  const bgX4 = useTransform(setProgress, [0.75, 1], ['-10%', '0%'], { clamp: true });
  const pngX4 = useTransform(setProgress, [0.75, 0.80, 1], ['50vw', '0vw', '0vw'], { clamp: true });
  const textX4 = useTransform(setProgress, [0.75, 0.80, 1], ['-50vw', '0vw', '5vw'], { clamp: true });
  const cardX4 = useTransform(setProgress, [0.75, 0.80, 1], ['10vw', '0vw', '0vw'], { clamp: true });
  const topLeftX4 = useTransform(setProgress, [0.75, 0.80, 1], ['-10vw', '0vw', '0vw'], { clamp: true });
  const topRightX4 = useTransform(setProgress, [0.75, 0.80, 1], ['10vw', '0vw', '0vw'], { clamp: true });

  // Display toggles to completely remove inactive sets from GPU to prevent ghosting
  const display1 = useTransform(setProgress, (p) => p > 0.26 ? 'none' : 'block');
  const display2 = useTransform(setProgress, (p) => p < 0.24 || p > 0.51 ? 'none' : 'block');
  const display3 = useTransform(setProgress, (p) => p < 0.49 || p > 0.76 ? 'none' : 'block');
  const display4 = useTransform(setProgress, (p) => p < 0.74 ? 'none' : 'block');

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/events`)
      .then(res => res.json())
      .then(data => setUpcomingEvents(data.slice(0, 3))) // Show only 3
      .catch(e => console.error(e));
  }, []);

  const smoothScrollTo = (targetY: number, duration: number = 2500) => {
    const startY = window.scrollY;
    const difference = targetY - startY;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // easeOutExpo: starts extremely fast, then crawls incredibly slowly to the end
      const easePercentage = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

      window.scrollTo(0, startY + difference * easePercentage);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const handleScrollToNext = () => {
    if (!multiSetRef.current) return;
    const currentP = setProgress.get();
    let nextP = 0;
    if (currentP < 0.20) nextP = 0.375; // Go to Set 2
    else if (currentP < 0.45) nextP = 0.625; // Go to Set 3
    else if (currentP < 0.70) nextP = 0.90; // Go to Set 4
    else return;

    const top = multiSetRef.current.offsetTop;
    const dist = multiSetRef.current.scrollHeight - window.innerHeight;
    smoothScrollTo(top + dist * nextP);
  };

  const handleScrollToPrev = () => {
    if (!multiSetRef.current) return;
    const currentP = setProgress.get();
    let nextP = 0;
    if (currentP > 0.80) nextP = 0.625;
    else if (currentP > 0.55) nextP = 0.375;
    else if (currentP > 0.30) nextP = 0.05; // Go to Set 1
    else return;

    const top = multiSetRef.current.offsetTop;
    const dist = multiSetRef.current.scrollHeight - window.innerHeight;
    smoothScrollTo(top + dist * nextP);
  };

  return (
    <div style={{ position: 'relative', overflow: 'clip' }} ref={containerRef}>
      {/* 1. PARALLAX HERO SECTION */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Background Image (Parallax) */}
        <motion.div 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, y: bgY, willChange: 'transform' }}
        >
          <img 
            src="/bg.png" 
            alt="Background" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'bottom center', transform: 'scale(1.2)' }}
          />
        </motion.div>

        {/* Logo Parallax Wrapper */}
        <motion.div 
          style={{ position: 'absolute', top: '14%', left: 0, width: '100%', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', y: logoY, willChange: 'transform' }}
        >
          {/* Logo Drop Animation */}
          <motion.div
            initial={{ y: -500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <img 
              src="/logo.png" 
              alt="Logo" 
              
              style={{ width: '85%', maxWidth: '500px', height: 'auto', }}
            />
          </motion.div>
        </motion.div>

        {/* Man Image (Parallax) - Z-INDEX 20 (In front of Logo) */}
        <motion.div 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', y: manY, willChange: 'transform' }}
        >
          <img 
            src="/man.png" 
            alt="Man" 
            style={{ width: 'auto', height: '45%', objectFit: 'contain', objectPosition: 'bottom' , marginBottom: '30px'}}
          />
        </motion.div>

        {/* Left Barricade Parallax Wrapper */}
        {!isMobile && (
          <motion.div style={{ position: 'absolute', bottom: '0px', left: 0, height: '100%', width: '50%', zIndex: 30, pointerEvents: 'none', x: leftBarricadeX, willChange: 'transform' }}>
            {/* Left Barricade Slide-in */}
            <motion.div
              initial={{ x: '-100%', rotate: -5 }}
              animate={{ x: '0%', rotate: -5 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
              style={{
                width: '100%', height: '100%',
                backgroundImage: "url('/baricade.png')",
                backgroundSize: "200% 100%",
                backgroundPosition: "left bottom",
                transformOrigin: "bottom left"
              }}
            />
          </motion.div>
        )}

        {/* Right Barricade Parallax Wrapper */}
        {!isMobile && (
          <motion.div style={{ position: 'absolute', bottom: '0px', right: 0, height: '100%', width: '50%', zIndex: 30, pointerEvents: 'none', x: rightBarricadeX, willChange: 'transform' }}>
            {/* Right Barricade Slide-in */}
            <motion.div
              initial={{ x: '100%', rotate: 5 }}
              animate={{ x: '0%', rotate: 5 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
              style={{
                width: '100%', height: '100%',
                backgroundImage: "url('/baricade.png')",
                backgroundSize: "200% 100%",
                backgroundPosition: "right bottom",
                transformOrigin: "bottom right"
              }}
            />
          </motion.div>
        )}
        
        {/* Left Card */}
        {!isMobile && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="hide-on-mobile"
            style={{ 
              position: 'absolute', bottom: '3%', left: '3%', zIndex: 40, maxWidth: '325px', padding: '20px', 
              background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px' 
            }}
          >
            <h3 style={{ color: '#ffd700', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontFamily: '"Outfit", system-ui, sans-serif' }}>
              The Stage is Yours
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', fontWeight: 400, lineHeight: '1.6', letterSpacing: '0.5px', fontFamily: '"Inter", system-ui, sans-serif' }}>
              Step into the spotlight and unleash your true potential. Our platform bridges the gap between emerging artists and massive global audiences. Whether you're a musician, comedian, or poet, MIC provides the perfect launchpad to showcase your raw talent, network with top industry professionals, and build a dedicated, loyal fanbase that grows with every single live performance.
            </p>
          </motion.div>
        )}

        {/* Right Card */}
        {!isMobile && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="hide-on-mobile"
            style={{ 
              position: 'absolute', bottom: '3%', right: '3%', zIndex: 40, maxWidth: '325px', padding: '20px', 
              background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px' 
            }}
          >
            <h3 style={{ color: '#ffd700', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontFamily: '"Outfit", system-ui, sans-serif' }}>
              Experience the Magic
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', fontWeight: 400, lineHeight: '1.6', letterSpacing: '0.5px', fontFamily: '"Inter", system-ui, sans-serif' }}>
              Discover unparalleled live performances explicitly tailored to your unique vibe. Browse exclusive underground events, secure your tickets instantly, and immerse yourself in unforgettable nights. From intimate acoustic sessions to massive high-energy raves, find your next favorite artist and experience the raw, unfiltered energy of live entertainment like never before.
            </p>
          </motion.div>
        )}

      </section>

      {/* ABOUT MIC WITH GOLDEN PARTICLES */}
      <section style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, #0f0f13, #1a1a24)' }}>
        {/* Floating Golden Particles */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: Math.random() * 0.4 + 0.1, rotate: Math.random() * 360 }}
              animate={{ y: '-20vh', rotate: Math.random() * 360 + 180 }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * -20
              }}
              style={{ position: 'absolute', color: '#ffd700', fontSize: `${Math.random() * 20 + 12}px`, willChange: 'transform' }}
            >
              {['🎵', '🎶', '🎸', '🎹', '🎤', '🎧', '🥁', '🎷', '✨'][Math.floor(Math.random() * 9)]}
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', padding: '3rem 2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#ffd700', fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '1.5rem', fontFamily: '"Outfit", system-ui, sans-serif' }}>About MIC</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', lineHeight: '2.2', letterSpacing: '1px', fontFamily: '"Inter", system-ui, sans-serif' }}>
            MIC is more than just an event platform—it is a revolution in live entertainment. Born out of a deep passion for live music, comedy, and performance art, our mission is to break down the barriers between emerging talent and passionate audiences. We provide a seamless, end-to-end ecosystem where artists can effortlessly book gigs, manage their schedules, and grow their fanbase, while attendees discover the most authentic and unforgettable underground events tailored perfectly to their vibe. Whether you are a creator ready to take the spotlight or a fan seeking raw, unfiltered energy, MIC is your ultimate backstage pass.
          </p>
        </div>
      </section>

      {/* MULTI-SET SCROLL ANIMATION SECTION */}
      <section ref={multiSetRef} style={{ position: 'relative', width: '100%', height: '400vh', background: '#000' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
          
          {/* Static UI Overlay: Arrows bottom left */}
          <div style={{ position: 'absolute', bottom: '5%', left: '5%', zIndex: 50, display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <p style={{ color: '#ffd700', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Scroll</p>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ChevronRight size={24} color="#ffd700" style={{ transform: 'rotate(90deg)' }} />
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>
                <ChevronRight size={24} color="#ffd700" style={{ transform: 'rotate(90deg)' }} />
              </motion.div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <motion.button 
                onClick={handleScrollToPrev}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
              >
                <ChevronUp size={20} color="#fff" />
              </motion.button>
              <motion.button 
                onClick={handleScrollToNext}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
              >
                <ChevronDown size={20} color="#fff" />
              </motion.button>
            </div>
          </div>

          {/* SET 1 */}
          <motion.div style={{ position: 'absolute', inset: 0, zIndex: 10, display: display1 }}>
            {/* Background */}
            <motion.img src="/bg3.1.png" style={{ position: 'absolute', width: '120%', height: '100%', objectFit: 'cover', x: bgX1, opacity: opacity1, willChange: 'transform' }} />
            
            {/* Top Left Animated Text */}
            <motion.div style={{ display: isMobile ? 'none' : 'block', position: 'absolute', top: '10%', left: '5%', zIndex: 20, maxWidth: '250px', x: topLeftX1, opacity: opacity1, willChange: 'transform' }}>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '2px' }}>Artist LIST</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 500, lineHeight: '1.5', fontFamily: '"Inter", sans-serif' }}>Its very easy you just have to fill up the enrollment form scroll see the from details.</p>
            </motion.div>

            {/* Top Right Animated Text */}
            <motion.div style={{ position: 'absolute', top: '10%', right: '5%', zIndex: 20, maxWidth: '250px', textAlign: 'right', x: topRightX1, opacity: opacity1, willChange: 'transform' }}>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '2px' }}>S1 enroll</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 500, lineHeight: '1.5', fontFamily: '"Inter", sans-serif' }}>go to the events section and renroll or scroll till enroll button and teh click on enroll.</p>
            </motion.div>

            {/* Text Layer (Between BG and PNG) */}
            <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', x: textX1, opacity: opacity1, willChange: 'transform', zIndex: 5 }}>
              <h1 style={{ fontSize: '15vw', fontWeight: 900, color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Outfit", sans-serif', letterSpacing: '10px' }}>ENROLL</h1>
            </motion.div>
            {/* PNG Foreground */}
            <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: isMobile ? '45%' : '10%', x: pngX1, opacity: opacity1, willChange: 'transform', zIndex: 10 }}>
              <img src="/mic3.png" style={{ height: isMobile ? '20%' : '35%', objectFit: 'contain' }} />
            </motion.div>
            {/* Bottom Right Glass Card */}
            <motion.div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20, maxWidth: '300px', padding: '20px', background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', x: cardX1, opacity: opacity1, willChange: 'transform' }}>
              <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, lineHeight: '1.6', fontFamily: '"Inter", sans-serif' }}>Secure your spot now and join the revolution. Be the first to experience the raw, unfiltered energy of MIC.</p>
            </motion.div>
          </motion.div>

          {/* SET 2 */}
          <motion.div style={{ position: 'absolute', inset: 0, zIndex: 20, display: display2 }}>
            <motion.img src="/bg3.3.png" style={{ position: 'absolute', width: '120%', height: '100%', objectFit: 'cover', x: bgX2, opacity: opacity2, willChange: 'transform' }} />
            
            {/* Top Left Animated Text */}
            <motion.div style={{ position: 'absolute', top: '10%', left: '5%', zIndex: 20, maxWidth: '250px', x: topLeftX2, opacity: opacity2, willChange: 'transform' }}>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '2px' }}>DETAILS</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 500, lineHeight: '1.5', fontFamily: '"Inter", sans-serif' }}>Fill in your details like name age instahandel gener and other infromation about you.</p>
            </motion.div>
            <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', x: textX2, opacity: opacity2, willChange: 'transform', zIndex: 5 }}>
              <h1 style={{ fontSize: '15vw', fontWeight: 900, color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Outfit", sans-serif', letterSpacing: '10px' }}>INFO</h1>
            </motion.div>
            <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', x: pngX2, opacity: opacity2, willChange: 'transform', zIndex: 10 }}>
              <img src="/man3.png" style={{ height: '65%', objectFit: 'contain' }} />
            </motion.div>
            <motion.div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20, maxWidth: '300px', padding: '20px', background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', x: cardX2, opacity: opacity2, willChange: 'transform' }}>
              <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, lineHeight: '1.6', fontFamily: '"Inter", sans-serif' }}>Your instgram hadel and watsapp number is mandatory to saty in touch and age shuld be 21+.</p>
            </motion.div>
          </motion.div>

          {/* SET 3 */}
          <motion.div style={{ position: 'absolute', inset: 0, zIndex: 30, display: display3 }}>
            <motion.img src="/bg3.4.png" style={{ position: 'absolute', width: '120%', height: '100%', objectFit: 'cover', x: bgX3, opacity: opacity3, willChange: 'transform' }} />

            {/* Top Left Animated Text */}
            <motion.div style={{ position: 'absolute', top: '10%', left: '5%', zIndex: 20, maxWidth: '250px', x: topLeftX3, opacity: opacity3, willChange: 'transform' }}>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '2px' }}>Track</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 500, lineHeight: '1.5', fontFamily: '"Inter", sans-serif' }}>Upload your track on which you want to perform in the form.</p>
            </motion.div>
            <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', x: textX3, opacity: opacity3, willChange: 'transform', zIndex: 5 }}>
              <h1 style={{ fontSize: '15vw', fontWeight: 900, color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Outfit", sans-serif', letterSpacing: '10px' }}>TRACK</h1>
            </motion.div>
            <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', x: pngX3, rotateY: pngRotateY3, opacity: opacity3, willChange: 'transform', zIndex: 10, perspective: '1000px' }}>
              <img src="/cst3.png" style={{ height: isMobile ? '40%' : '65%', objectFit: 'contain' }} />
            </motion.div>
            <motion.div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20, maxWidth: '300px', padding: '20px', background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', x: cardX3, opacity: opacity3, willChange: 'transform' }}>
              <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, lineHeight: '1.6', fontFamily: '"Inter", sans-serif' }}>you will recive the 2nd link on the watsapp on that form u have to upload the track.</p>
            </motion.div>
          </motion.div>

          {/* SET 4 */}
          <motion.div style={{ position: 'absolute', inset: 0, zIndex: 40, display: display4 }}>
            <motion.img src="/bg3.5.png" style={{ position: 'absolute', width: '120%', height: '100%', objectFit: 'cover', x: bgX4, opacity: opacity4, willChange: 'transform' }} />

            {/* Top Left Animated Text */}
            <motion.div style={{ position: 'absolute', top: '10%', left: '5%', zIndex: 20, maxWidth: '250px', x: topLeftX4, opacity: opacity4, willChange: 'transform' }}>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '2px' }}>STAGE</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 500, lineHeight: '1.5', fontFamily: '"Inter", sans-serif' }}>after the the formsubmit process completes teh stage is urs to perform.</p>
            </motion.div>

            {/* Top Right Animated Text */}
            <motion.div style={{ display: isMobile ? 'none' : 'block', position: 'absolute', top: '10%', right: '5%', zIndex: 20, maxWidth: '250px', textAlign: 'right', x: topRightX4, opacity: opacity4, willChange: 'transform' }}>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '2px' }}>SPOTLIGHT</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 500, lineHeight: '1.5', fontFamily: '"Inter", sans-serif' }}>It's your time to shine. Grab the mic and show your talent click onenroll now.</p>
            </motion.div>

            {/* Top Center Enroll Button */}
            <motion.div style={{ position: 'absolute', top: isMobile ? '25%' : '10%', left: '50%', x: '-50%', zIndex: 30, opacity: opacity4, willChange: 'transform' }}>
              <Link to="/events" style={{ textDecoration: 'none' }}>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.3)', '0 0 0px rgba(255,255,255,0)'] }}
                  transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(15px)', 
                    WebkitBackdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.3)', 
                    padding: '12px 32px', 
                    borderRadius: '30px',
                    color: '#fff',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    fontFamily: '"Outfit", sans-serif',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    letterSpacing: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Enroll Now
                  <motion.span
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                    style={{ display: 'inline-block', marginLeft: '2px' }}
                  >
                    !
                  </motion.span>
                </motion.button>
              </Link>
            </motion.div>
            <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', x: textX4, opacity: opacity4, willChange: 'transform', zIndex: 5 }}>
              <h1 style={{ fontSize: '15vw', fontWeight: 900, color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: '"Outfit", sans-serif', letterSpacing: '10px' }}>PERFORM</h1>
            </motion.div>
            <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '0%', x: pngX4, opacity: opacity4, willChange: 'transform', zIndex: 10 }}>
              <img src="/mn3.png" style={{ height: '65%', objectFit: 'contain' }} />
            </motion.div>
            <motion.div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 20, maxWidth: '300px', padding: '20px', background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', x: cardX4, opacity: opacity4, willChange: 'transform' }}>
              <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, lineHeight: '1.6', fontFamily: '"Inter", sans-serif' }}>Take the stage and captivate your audience. We provide the platform, you provide the talent.</p>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 2. ECOSYSTEM SECTION (Replaced About Us) */}
      <EcosystemSection />



      {/* 4. UPCOMING EVENTS (PREMIUM) */}
      <section style={{ padding: '6rem 0 2rem 0', backgroundColor: '#0d0d10', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,51,102,0.3), transparent)' }} />
        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, fontFamily: '"Outfit", sans-serif', margin: 0, lineHeight: 1.1, letterSpacing: '-1px' }}
              >
                Upcoming <span style={{ color: '#ff3366' }}>Events.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginTop: '1rem' }}
              >
                Secure your spot at the most anticipated events.
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Link to="/events" style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover="hover"
                  variants={{ hover: { backgroundColor: '#fff', color: '#000', scale: 1.05 } }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', color: '#fff', fontWeight: 600, transition: 'all 0.3s ease' }}
                >
                  Explore More Events <motion.div variants={{ hover: { x: 5 } }}><ArrowRight size={16} /></motion.div>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          <div className="event-grid">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 3).map((event, i) => (
                <PremiumEventCard key={event.id} event={event} index={i} />
              ))
            ) : (
              // MOCK DATA FALLBACK FOR SHOWCASE
              [
                { id: 1, name: "Midnight Sessions", venue: "The Grand Arena, Mumbai", eventDate: new Date("2026-08-24T20:00:00").toISOString(), price: 799, cat: "LIVE MUSIC", color: "#ff3366" },
                { id: 2, name: "Laugh Out Loud", venue: "The Comedy Club, Bangalore", eventDate: new Date("2026-08-27T19:30:00").toISOString(), price: 499, cat: "COMEDY", color: "#00e676" },
                { id: 3, name: "Words After Dark", venue: "The Culture House, Delhi", eventDate: new Date("2026-08-29T18:30:00").toISOString(), price: 299, cat: "POETRY", color: "#ffd700" }
              ].map((event, i) => (
                <PremiumEventCard key={event.id} event={event} index={i} />
              ))
            )}
          </div>
        </div>
      </section>


      {/* 7. FAQ SECTION */}
      <FAQSection />

      {/* 4.8. SHOWCASE GALLERY */}
      <ShowcaseGallery />

      {/* 4.9. AUDIENCE BOOKING CTA */}
      <section className="container text-center" style={{ padding: '6rem 1.5rem 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.7 }}
          >
            Don't just hear about it—be part of the magic! Grab your tickets now, experience raw talent live on stage, and cheer for the next big star. The energy of the crowd makes the show unforgettable.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/book-event" className="btn" style={{ 
                padding: '1rem 2.5rem', 
                fontSize: '1.1rem', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                fontWeight: 600, 
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                borderRadius: '12px'
              }}>
                <Ticket size={22} />
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. AUDIENCE REVIEWS */}
      <section className="container" style={{ padding: '3rem 1.5rem 8rem' }}>
        <div className="text-center mb-12">
          <h2 style={{ fontSize: '3rem' }}>Audience <span style={{ color: 'var(--warning)' }}>Reviews</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Hear from fans who have experienced the magic of the MIC stage.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { name: "Sarah Jenkins", role: "Music Enthusiast", quote: "Attending a MIC event was an unforgettable experience. The energy of the crowd and the incredible raw talent absolutely blew me away!" },
            { name: "Marcus 'Lyric' Cole", role: "Concert Goer", quote: "The atmosphere is unmatched. You get to see future stars before they blow up, and the ticketing process was completely seamless." },
            { name: "David & Emily", role: "Local Fans", quote: "Best night out we've had all year. The venues are always packed with great energy and the performances are top-tier." }
          ].map((story, idx) => (
            <div key={idx} className="glass" style={{ padding: '2.5rem', position: 'relative' }}>
              <Quote size={40} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'rgba(255,255,255,0.05)' }} />
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="var(--warning)" color="var(--warning)" />)}
              </div>
              <p style={{ color: '#ddd', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>"{story.quote}"</p>
              <div>
                <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>{story.name}</h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{story.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EXTENDED FOOTER */}
      <footer style={{ background: '#0a0a0f', padding: '4rem 0 2rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <Link to="/" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', display: 'block', marginBottom: '1rem' }}>MIC<span style={{ color: 'var(--primary-color)' }}>.</span></Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              The ultimate platform connecting passionate artists with eager audiences through seamless event experiences.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.5rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link to="/events" style={{ color: 'var(--text-muted)' }}>Browse Events</Link></li>
              <li><Link to="/perform" style={{ color: 'var(--text-muted)' }}>Artist Registration</Link></li>
              <li><Link to="/gallery" style={{ color: 'var(--text-muted)' }}>Photo Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.5rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link to="#" style={{ color: 'var(--text-muted)' }}>About Us</Link></li>
              <li><Link to="#" style={{ color: 'var(--text-muted)' }}>Contact Support</Link></li>
              <li><Link to="#" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container" style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          &copy; 2026 The MIC Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const CheckIcon = ({ color }: { color: string }) => (
  <div style={{ background: `${color}22`, borderRadius: '50%', padding: '4px' }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  </div>
);

export default HeroPage;

// PREMIUM EVENT CARD COMPONENT
const PremiumEventCard = ({ event, index }: { event: any, index: number }) => {
  const navigate = useNavigate();
  const d = new Date(event.eventDate || new Date());
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const categoryColor = event.color || '#ffd700';

  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover="hover"
      style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#0d0d10',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        height: '340px',
        transformStyle: 'preserve-3d',
        padding: '12px'
      }}
    >
      {/* CARD IMAGE AREA (70% height) */}
      <div style={{ position: 'relative', height: '70%', overflow: 'hidden', borderRadius: '16px' }}>
        <motion.div style={{ width: '100%', height: '100%', scale: imageScale }}>
          <motion.div
            variants={{ hover: { scale: 1.05 } }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundImage: event.bannerUrl ? `linear-gradient(to bottom, transparent, rgba(0,0,0,0.8)), url("${event.bannerUrl}")` : `linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </motion.div>
        
        {/* Date Badge */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.5rem 1rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color: '#fff' }}>{day}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: categoryColor }}>{month}</span>
        </div>

        {/* Favorite */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '40px', height: '40px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
          <Heart size={18} color="#fff" />
        </div>

        {/* Category Label */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', padding: '4px 8px', borderRadius: '4px', background: `${categoryColor}33`, color: categoryColor, border: `1px solid ${categoryColor}66` }}>
            {event.cat || "LIVE EVENT"}
          </span>
        </div>
      </div>

      {/* CARD CONTENT AREA (30% height) */}
      <div style={{ padding: '1rem 0.5rem 0 0.5rem', display: 'flex', flex: 1, justifyContent: 'space-between', background: 'transparent' }}>
        
        {/* Left Side: Title & Price */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingRight: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: '"Outfit", sans-serif', margin: 0, color: '#fff', lineHeight: 1.2 }}>{event.name}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Starting from</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>₹{event.price || 499}</span>
          </div>
        </div>

        {/* Right Side: Location, Date & Enroll */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', textAlign: 'right' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600 }}>
               <span>{event.venue}</span> <MapPin size={12} color={categoryColor} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
               <span>{day} {month} · {time}</span> <Calendar size={12} color={categoryColor} />
            </div>
          </div>

          {event.closed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '30px', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'not-allowed' }}>
              CLOSED <Lock size={12} />
            </div>
          ) : (
            <Link to="/perform" style={{ textDecoration: 'none' }}>
              <motion.div
                variants={{ hover: { backgroundColor: '#fff', color: '#000' } }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '30px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}
              >
                ENROLL <motion.div variants={{ hover: { x: 4 } }}><ArrowRight size={12} /></motion.div>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
      
      {/* Animated Border Glow on Hover */}
      <motion.div 
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: `1px solid ${categoryColor}66`, borderRadius: '24px', pointerEvents: 'none' }}
      />
    </motion.div>
  );
}
