import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: '01',
    title: 'FOR/HER',
    desc: 'Morbi volutpat tortor sit amet aliquam pretium, ut scelerisque nunc fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing.',
    imgRight: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=80',
    imgLeft: 'https://images.unsplash.com/photo-1516057747705-0609711c1b31?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '02',
    title: 'ENIGMA',
    desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    imgRight: 'https://images.unsplash.com/photo-1516057747705-0609711c1b31?auto=format&fit=crop&w=1000&q=80',
    imgLeft: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: '03',
    title: 'NOSTALGIA',
    desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
    imgRight: 'https://images.unsplash.com/photo-1564585222527-c2777a5bc6cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imgLeft: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=80'
  }
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    zIndex: 0
  })
};

const textVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    y: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 50 : -50,
    opacity: 0
  })
};

const verticalTextVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? -50 : 50, // since it's rotated -90deg, x is the vertical axis
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? -50 : 50,
    opacity: 0
  })
};

export const ShowcaseGallery = () => {
  const [[page, direction], setPage] = useState([0, 0]);
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

  const yParallaxLarge = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const yParallaxSmall = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const currentIndex = ((page % slides.length) + slides.length) % slides.length;
  const slide = slides[currentIndex];

  const springConfig = { type: "spring", stiffness: 100, damping: 20 };

  return (
    <section ref={containerRef} style={{ height: '100vh', width: '100%', backgroundColor: '#0d0d10', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-start'
      }}>
        
        {/* Top Right Text Block - Hidden on mobile for space */}
        {!isMobile && (
          <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 50, maxWidth: '200px', textAlign: 'right' }}>
            <motion.p 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}
            >
              Curated experiences redefining live entertainment. Bringing the most enigmatic performances directly to the forefront.
            </motion.p>
          </div>
        )}

        {/* MASSIVE FULL HEIGHT IMAGE (Background on mobile, Left on desktop) */}
        <div style={{ 
          width: isMobile ? '100%' : '50%', 
          height: isMobile ? '100%' : '100%', 
          position: isMobile ? 'absolute' : 'relative', 
          inset: isMobile ? 0 : 'auto',
          overflow: 'hidden',
          zIndex: isMobile ? 1 : 10
        }}>
          <motion.div style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', y: yParallaxLarge }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={`right-${page}`}
                src={slide.imgRight}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={springConfig}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: isMobile ? 'brightness(0.3)' : 'none'
                }}
              />
            </AnimatePresence>
          </motion.div>
          
          {!isMobile && (
            <div style={{ position: 'absolute', bottom: '3rem', left: '4rem', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 20 }}>
               <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '2px', cursor: 'pointer' }}>VIEW GALLERY</span>
               <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.5)' }} />
            </div>
          )}
        </div>

        {/* CENTER COLUMN: Text & Controls */}
        <div style={{ 
          width: isMobile ? '100%' : '25%', 
          height: isMobile ? 'auto' : '100%', 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: isMobile ? 'center' : 'space-between', 
          zIndex: 20,
          padding: isMobile ? '2rem' : '0'
        }}>
          
          {!isMobile && <div style={{ flex: 1 }} />}

          {/* Text & Description Container */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 25,
            gap: isMobile ? '1.5rem' : '0'
          }}>
            
            <div style={{ transform: isMobile ? 'none' : 'rotate(-90deg)', display: 'grid', placeItems: 'center' }}>
              <AnimatePresence initial={false} custom={direction}>
                <motion.h2
                  key={`title-${page}`}
                  custom={direction}
                  variants={isMobile ? textVariants : verticalTextVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={springConfig}
                  style={{ 
                    gridArea: '1 / 1',
                    margin: 0,
                    fontSize: isMobile ? 'clamp(3rem, 15vw, 4rem)' : 'clamp(3.5rem, 5vw, 6rem)', 
                    fontWeight: 800, 
                    fontFamily: '"Outfit", sans-serif', 
                    color: '#fff', 
                    whiteSpace: isMobile ? 'normal' : 'nowrap',
                    letterSpacing: isMobile ? '2px' : '5px',
                    textAlign: 'center'
                  }}
                >
                  {slide.title}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Description Block */}
            <div style={{ 
              position: isMobile ? 'relative' : 'absolute', 
              left: isMobile ? 'auto' : '-100px', 
              width: isMobile ? '100%' : '220px', 
              maxWidth: '300px',
              background: isMobile ? 'transparent' : '#0a0a0f', 
              border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.1)', 
              padding: isMobile ? '0' : '1.5rem', 
              zIndex: 30 
            }}>
              <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: isMobile ? 'auto' : '100px' }}>
                <AnimatePresence initial={false} custom={direction}>
                  <motion.p
                    key={`desc-${page}`}
                    custom={direction}
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={springConfig}
                    style={{ 
                      gridArea: '1 / 1', 
                      margin: 0, 
                      color: 'rgba(255,255,255,0.8)', 
                      fontSize: isMobile ? '0.85rem' : '0.65rem', 
                      lineHeight: 1.6, 
                      fontWeight: 500,
                      textAlign: 'center'
                    }}
                  >
                    {slide.desc}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* Controls */}
          <div style={{ 
            flex: isMobile ? 'none' : 1, 
            display: 'flex', 
            alignItems: isMobile ? 'center' : 'flex-end', 
            justifyContent: 'center', 
            paddingBottom: isMobile ? '0' : '3rem',
            marginTop: isMobile ? '3rem' : '0'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={() => paginate(-1)}
                style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', transition: 'all 0.3s ease', borderRadius: '50%' }}
              >
                <ArrowLeft size={20} />
              </button>
              <button 
                onClick={() => paginate(1)}
                style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', background: '#fff', color: '#000', cursor: 'pointer', transition: 'all 0.3s ease' }}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* SMALL IMAGE COLUMN (Hidden on Mobile) */}
        {!isMobile && (
          <div style={{ width: '25%', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 10, paddingLeft: '2rem' }}>
            
            {/* Spacer to push image down */}
            <div style={{ flex: 1 }} />

            {/* Bottom Small Image */}
            <div style={{ width: '100%', height: '350px', position: 'relative', overflow: 'hidden', alignSelf: 'flex-start', marginBottom: '2rem' }}>
              <motion.div style={{ position: 'absolute', top: '-10%', left: 0, width: '100%', height: '120%', y: yParallaxSmall }}>
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={`left-${page}`}
                    src={slide.imgLeft}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={springConfig}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
