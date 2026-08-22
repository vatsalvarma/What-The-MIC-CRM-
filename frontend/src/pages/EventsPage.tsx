import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Heart, ArrowRight, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/events`);
        if (!res.ok) throw new Error('Failed to fetch from backend');
        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  return (
    <div style={{ backgroundColor: '#0d0d10', minHeight: '100vh', color: '#fff', paddingTop: '120px', paddingBottom: '4rem' }}>
      <div className="container" style={{ padding: '0 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 800, fontFamily: '"Outfit", sans-serif', marginBottom: '3rem', textAlign: 'center' }}>
          Explore <span style={{ color: '#ff3366' }}>Events</span>
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.5)' }}>Loading events...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#ff3366' }}>Error: {error}</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.5)' }}>No events found.</div>
        ) : (
          <div className="event-grid">
            {events.map((event, i) => (
               <PremiumEventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

// PREMIUM EVENT CARD COMPONENT (Ported from HeroPage)
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
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
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
            <Link to={`/perform?eventId=${event.id}`} style={{ textDecoration: 'none' }}>
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

export default EventsPage;
