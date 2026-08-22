import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const manY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const logoY = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);

  return (
    <div className="relative w-full overflow-hidden bg-black text-white" ref={containerRef}>
      
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Image (Parallax) */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: bgY }}
        >
          <img 
            src="./bg.png" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Man Image (Parallax) */}
        <motion.div 
          className="absolute inset-0 z-10 flex items-end justify-center"
          style={{ y: manY }}
        >
          <img 
            src="./man.png" 
            alt="Man" 
            className="w-full h-full object-cover object-bottom"
          />
        </motion.div>

        {/* Logo (Drops from top) */}
        <motion.div 
          className="absolute top-10 z-20 w-3/4 max-w-lg"
          style={{ y: logoY }}
          initial={{ y: -500, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img 
            src="./logo.png" 
            alt="Logo" 
            className="w-full h-auto"
          />
        </motion.div>

        {/* Left Barricade */}
        <motion.div
          className="absolute top-0 left-0 h-full w-1/2 z-30 pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
          style={{
            backgroundImage: "url('./baricade.png')",
            backgroundSize: "200% 100%",
            backgroundPosition: "left center"
          }}
        />

        {/* Right Barricade */}
        <motion.div
          className="absolute top-0 right-0 h-full w-1/2 z-30 pointer-events-none"
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
          style={{
            backgroundImage: "url('./baricade.png')",
            backgroundSize: "200% 100%",
            backgroundPosition: "right center"
          }}
        />
        
      </section>

      {/* Content Section placeholder below fold to test scroll parallax */}
      <section className="relative z-40 bg-black min-h-screen p-10">
        <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
        <p className="text-gray-400">Scroll down to see the parallax effect on the hero section.</p>
        <div className="h-[200vh]"></div>
      </section>
      
    </div>
  );
}
