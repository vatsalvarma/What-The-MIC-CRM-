import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Plus, Mail } from 'lucide-react';

const faqs = [
  { question: "What exactly does MIC do?", answer: "MIC bridges the gap between artists, venues, and audiences. We curate high-quality live events, handle the production, and ensure performers get the spotlight they deserve." },
  { question: "How do I perform at a MIC event?", answer: "Artists can enroll directly through our platform. Create a profile, submit your portfolio, and our curation team will reach out when there's a perfect slot for your genre." },
  { question: "Is ticketing secure on the platform?", answer: "Yes. All tickets are securely processed via Razorpay. You'll receive a digital QR ticket immediately upon booking, which gets scanned at the venue." },
  { question: "Can I host my own private event with MIC?", answer: "Absolutely. We offer complete event curation and production services for private and corporate gatherings. Simply click 'Host an Event' to get started." },
  { question: "Do you provide equipment for performers?", answer: "We provide top-tier industry-standard sound and lighting equipment for all our curated events, ensuring you sound your absolute best on stage." }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const yParallax = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section ref={containerRef} style={{ 
      padding: isMobile ? '4rem 0' : '2rem 0', 
      position: 'relative', 
      height: isMobile ? 'auto' : '100vh', 
      minHeight: '100vh',
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      overflow: 'hidden' 
    }}>
      
      {/* Title Area */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <motion.span 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, fontFamily: '"Outfit", sans-serif', letterSpacing: '2px', color: '#ff3366', marginBottom: '0.5rem', textTransform: 'uppercase' }}
        >
          FAQ
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, fontFamily: '"Outfit", sans-serif', margin: 0, lineHeight: 1.1 }}
        >
          Frequently Asked <span style={{ color: '#ffd700' }}>Questions</span>
        </motion.h2>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column-reverse' : 'row', 
        alignItems: 'stretch', 
        flex: 1, 
        maxHeight: isMobile ? 'none' : '80vh',
        gap: isMobile ? '2rem' : '0'
      }}>
        
        {/* Left Side: FAQs Container */}
        <div style={{ 
          paddingLeft: isMobile ? '1.5rem' : '1.5rem', 
          paddingRight: isMobile ? '1.5rem' : '2rem', 
          display: 'flex', 
          flexDirection: 'column',
          width: isMobile ? '100%' : '50%'
        }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}
          >
          {/* Contact Box */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Email</span>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>hello@whatthemic.com</span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.1)' }}
            >
              <Mail size={16} /> Get in touch
            </motion.button>
          </div>

          {/* Accordion Items */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} style={{ borderBottom: i === faqs.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                  <button 
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontSize: '1.1rem', fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: isOpen ? '#ffd700' : '#fff', transition: 'color 0.3s ease', paddingRight: '1rem' }}>{faq.question}</span>
                    <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} style={{ minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '50%', color: '#000' }}>
                      <Plus size={14} strokeWidth={3} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 0 1rem 0', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, fontSize: '0.85rem' }}>
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          </motion.div>
        </div>

        {/* Right Side: Featured Image */}
        <motion.div 
          style={{ 
            position: 'relative', 
            height: isMobile ? '400px' : '100%', 
            width: isMobile ? '100%' : '50%',
            borderRadius: '0', 
            overflow: 'hidden', 
            border: '1px solid rgba(255,255,255,0.1)', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            margin: '0'
          }}
          initial={{ opacity: 0, scale: 0.9, x: 30 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          <motion.div style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', y: yParallax }}>
            <motion.div
              animate={{ scale: openIndex !== null ? 1.1 : 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', height: '100%' }}
            >
              <motion.img 
                src="/ev.png"
                alt="MIC Event"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          </motion.div>
          {/* Subtle gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,16,0.6), transparent)' }} />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', right: '2.5rem' }}
          >
             <div style={{ display: 'inline-block', padding: '10px 20px', background: '#ff3366', color: '#fff', borderRadius: '8px', fontWeight: 800, fontFamily: '"Outfit", sans-serif', fontSize: '1.8rem', letterSpacing: '1px', boxShadow: '0 10px 20px rgba(255,51,102,0.3)' }}>
               MIC LIVE
             </div>
             <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)', fontSize: '1rem', fontWeight: 500 }}>@whatthemic</p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
