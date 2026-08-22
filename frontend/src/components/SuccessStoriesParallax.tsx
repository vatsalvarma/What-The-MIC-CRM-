import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Play, ArrowRight, ArrowDown } from 'lucide-react';

const stories = [
  {
    id: 1,
    name: "ELEVATE SOUNDS",
    subtitle: "ELECTRONIC DJ SET",
    image: "/images/artist_electronic_dj_1787380354184.png",
    description: "From bedroom producer to headlining the main stage. Experience the journey of Elevate Sounds as they completely revolutionized the electronic scene, blowing the crowd away with an unforgettable light show and heavy bass drops.",
    stats: { gigs: 45, fans: '120k', streams: '2.5M' },
    quote: "The city of freedom."
  },
  {
    id: 2,
    name: "LUNA SKYES",
    subtitle: "INDIE ROCK",
    image: "/images/artist_indie_guitarist_1787380273295.png",
    description: "Luna brought her unique indie flair and captivating guitar riffs to the MIC stage, leaving the audience entirely spellbound. Her breakout performance led to a major record deal.",
    stats: { gigs: 82, fans: '45k', streams: '800k' },
    quote: "Every chord tells a story."
  },
  {
    id: 3,
    name: "THE VELVET TONE",
    subtitle: "JAZZ SINGER",
    image: "/images/artist_jazz_singer_1787380235189.png",
    description: "With a voice as smooth as velvet, he turned a standard venue into a 1920s speakeasy. A masterclass in atmosphere and raw vocal talent that had everyone on their feet.",
    stats: { gigs: 110, fans: '20k', streams: '1.1M' },
    quote: "A conversation without words."
  },
  {
    id: 4,
    name: "MARCUS 'LYRIC' COLE",
    subtitle: "SPOKEN WORD POET",
    image: "/images/artist_spoken_word_1787380407971.png",
    description: "Powerful words, striking delivery. Marcus held the entire crowd in absolute silence as his words cut through the dark. A profoundly emotional performance.",
    stats: { gigs: 30, fans: '80k', streams: '500k' },
    quote: "Truth hits hardest out loud."
  },
  {
    id: 5,
    name: "DJ NEON",
    subtitle: "FESTIVAL CLOSER",
    image: "/images/artist_electronic_dj_1787380354184.png",
    description: "A monumental closer for the summer festival season. Lasers, heavy bass drops, and an unforgettable light show that set a new benchmark for live electronic acts.",
    stats: { gigs: 200, fans: '300k', streams: '5M' },
    quote: "We don't sleep, we dance."
  },
  {
    id: 6,
    name: "ECHO STRINGS",
    subtitle: "ALTERNATIVE INDIE",
    image: "/images/artist_indie_guitarist_1787380273295.png",
    description: "Breaking boundaries with alternative tuning and heavy distortion pedals. A raw, authentic rock performance that brought the true spirit of indie back to the main stage.",
    stats: { gigs: 55, fans: '60k', streams: '1.2M' },
    quote: "Distortion is organized chaos."
  },
  {
    id: 7,
    name: "ARTHUR PENN",
    subtitle: "CLASSIC JAZZ",
    image: "/images/artist_jazz_singer_1787380235189.png",
    description: "Bringing the classics back to life. A sensational tribute to the golden era of jazz music on the main stage, capturing the essence of the greats.",
    stats: { gigs: 90, fans: '15k', streams: '400k' },
    quote: "The classics never truly die."
  },
  {
    id: 8,
    name: "SILENT ECHOES",
    subtitle: "POETRY SLAM CHAMPION",
    image: "/images/artist_spoken_word_1787380407971.png",
    description: "Winner of the national poetry slam. A gripping, emotionally raw performance that left no dry eyes in the house, proving the power of spoken word.",
    stats: { gigs: 40, fans: '25k', streams: '100k' },
    quote: "Tears are unspoken words."
  },
  {
    id: 9,
    name: "CYBER PULSE",
    subtitle: "SYNTHWAVE PRODUCER",
    image: "/images/artist_electronic_dj_1787380354184.png",
    description: "Taking the audience back to the 80s future. A brilliant display of analog synthesizers and heavy rhythmic beats that kept the crowd jumping all night.",
    stats: { gigs: 60, fans: '90k', streams: '2M' },
    quote: "The future is retro."
  },
  {
    id: 10,
    name: "THE WILD ONES",
    subtitle: "GARAGE ROCK",
    image: "/images/artist_indie_guitarist_1787380273295.png",
    description: "Unfiltered, unapologetic garage rock. They tore the roof off the venue with their high-octane set, bringing massive chaotic energy.",
    stats: { gigs: 150, fans: '110k', streams: '3M' },
    quote: "Play it loud or not at all."
  }
];

interface StorySlideProps {
  story: typeof stories[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

const StorySlide: React.FC<StorySlideProps> = ({ story, index, total, scrollYProgress }) => {
  const step = 1 / total;
  const startVisible = index * step;
  const endVisible = (index + 1) * step;
  
  // 15% of the step is used for crossfading
  const fade = step * 0.15;
  
  const inStart = startVisible - fade;
  const inEnd = startVisible;
  const outStart = endVisible - fade;
  const outEnd = endVisible;

  // Ensure first and last slides anchor correctly at 0 and 1
  const opInStart = index === 0 ? 0 : inStart;
  const opInEnd = index === 0 ? 0 : inEnd;
  const yInStart = index === 0 ? 0 : 50;
  
  const opOutStart = index === total - 1 ? 1 : outStart;
  const opOutEnd = index === total - 1 ? 1 : outEnd;
  const yOutEnd = index === total - 1 ? 0 : -50;

  const opacity = useTransform(
    scrollYProgress,
    [opInStart, opInEnd, opOutStart, opOutEnd],
    [0, 1, 1, 0]
  );
  
  const textY = useTransform(
    scrollYProgress,
    [opInStart, opInEnd, opOutStart, opOutEnd],
    [yInStart, 0, 0, yOutEnd]
  );

  const imageScale = useTransform(
    scrollYProgress,
    [opInStart, opOutEnd],
    [1.15, 1]
  );

  // Z-index trick: if opacity > 0, display it, else hide it entirely from the DOM to prevent pointer event blocking
  const display = useTransform(opacity, (v) => (v > 0 ? 'flex' : 'none'));
  const zIndex = useTransform(opacity, (v) => (v > 0.5 ? 10 : 0));

  return (
    <motion.div style={{ opacity, display, zIndex }} className="absolute inset-0 flex flex-col md:flex-row w-full h-full">
      {/* Left Side: Image */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-black">
        <motion.img 
          style={{ scale: imageScale }} 
          src={story.image} 
          alt={story.name}
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ filter: 'brightness(0.6)' }}
        />
        
        {/* Gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:bg-gradient-to-t md:from-black/60 md:via-transparent md:to-transparent pointer-events-none" />
        
        {/* Abstract cyber/HUD overlay elements similar to reference */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        <motion.div style={{ y: textY }} className="absolute bottom-8 left-8 md:bottom-16 md:left-16">
          <h3 style={{ 
            color: '#fff', 
            fontSize: 'clamp(3rem, 6vw, 5rem)', 
            fontWeight: 900, 
            textTransform: 'uppercase', 
            lineHeight: 0.9, 
            letterSpacing: '-2px',
            textShadow: '0 10px 30px rgba(0,0,0,0.8)' 
          }}>
            {story.name.split(' ').map((word, i) => (
              <span key={i} style={{ display: 'block', color: i % 2 !== 0 ? 'var(--primary-color)' : '#fff' }}>{word}</span>
            ))}
          </h3>
        </motion.div>
      </div>

      {/* Right Side: Text & Data */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#050505] flex flex-col justify-center px-8 md:px-24 relative border-t md:border-t-0 md:border-l border-white/10">
        
        {/* Giant Background Number */}
        <div style={{ 
          position: 'absolute', 
          top: '10%', 
          left: '5%', 
          fontSize: 'clamp(10rem, 20vw, 25rem)', 
          fontWeight: 900, 
          color: 'rgba(255,255,255,0.02)', 
          lineHeight: 0.8,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        <motion.div style={{ y: textY, zIndex: 10, position: 'relative' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{String(index + 1).padStart(2, '0')}</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3vw, 3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, textTransform: 'uppercase' }}>
              {story.quote}
            </h2>
          </div>
          
          <p style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '4px', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            {story.subtitle}
          </p>

          <p style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '500px' }}>
            {story.description}
          </p>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
             <div>
               <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 900 }}>{story.stats.gigs}</div>
               <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>Live Shows</div>
             </div>
             <div>
               <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 900 }}>{story.stats.fans}</div>
               <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>Total Fans</div>
             </div>
             <div>
               <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 900 }}>{story.stats.streams}</div>
               <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>Streams</div>
             </div>
          </div>

          <div>
             <button className="btn" style={{ 
               background: 'transparent',
               border: '1px solid rgba(255,255,255,0.2)',
               borderRadius: '30px',
               padding: '1rem 3rem',
               color: '#fff',
               fontSize: '0.9rem',
               letterSpacing: '2px',
               textTransform: 'uppercase',
               display: 'inline-flex',
               alignItems: 'center',
               gap: '0.75rem',
               transition: 'all 0.3s ease'
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.background = '#fff';
               e.currentTarget.style.color = '#000';
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.background = 'transparent';
               e.currentTarget.style.color = '#fff';
             }}
             >
               Discover <ArrowRight size={16} />
             </button>
          </div>
        </motion.div>

        {/* Next preview indicator */}
        {index < total - 1 && (
          <div style={{ position: 'absolute', bottom: '3rem', right: '3rem', textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div>
                <p style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Next Story</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', color: '#fff' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{String(index + 2).padStart(2, '0')}</span>
                </div>
             </div>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <ArrowDown size={16} color="var(--primary-color)" />
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SuccessStoriesParallax: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // The container needs to be incredibly tall so that scrolling vertically triggers the progress
  // 100vh per story + a buffer
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });

  return (
    <section ref={targetRef} style={{ height: `${stories.length * 100}vh`, position: 'relative', background: '#050505' }}>
      {/* Sticky Container: stays fixed while scrolling through the tall section */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
        
        {/* Global Progress Bar at the top */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            height: '4px', 
            width: '100%', 
            background: 'var(--primary-color)',
            scaleX: scrollYProgress,
            transformOrigin: 'left',
            zIndex: 100 
          }} 
        />

        {stories.map((story, index) => (
          <StorySlide 
            key={story.id} 
            story={story} 
            index={index} 
            total={stories.length} 
            scrollYProgress={scrollYProgress} 
          />
        ))}

      </div>
    </section>
  );
};

export default SuccessStoriesParallax;
