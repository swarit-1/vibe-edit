'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function PerformanceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="demo" className="relative py-32 overflow-hidden">
      {/* Velvet Curtain Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.15_0.10_350)] via-[oklch(0.12_0.08_340)] to-[oklch(0.10_0.06_330)]" />
      
      {/* Velvet texture overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Stage lights */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[oklch(0.75_0.15_75)] rounded-full blur-3xl opacity-20" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-[oklch(0.65_0.18_285)] rounded-full blur-3xl opacity-20" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Watch Maestro in Action 🎬
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            See how natural language transforms into professional video edits
          </p>
        </motion.div>

        {/* Concert Hall Stage Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          {/* Ornate Frame */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-[oklch(0.75_0.15_75)]/30 bg-gradient-to-br from-[oklch(0.75_0.15_75)]/10 to-[oklch(0.65_0.18_285)]/10 p-2">
            {/* Inner Frame */}
            <div className="relative rounded-2xl overflow-hidden border-4 border-[oklch(0.75_0.15_75)]/20">
              {/* Video Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-black/80 to-black/60 flex items-center justify-center">
                {/* Thumbnail/Placeholder */}
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=675&fit=crop"
                  alt="Video editing demo"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                
                {/* Play Button as Conductor's Podium */}
                <motion.button
                  className="relative z-10 group/play"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Podium base */}
                  <div className="relative">
                    {/* Main play button */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[oklch(0.75_0.15_75)] to-[oklch(0.65_0.18_285)] flex items-center justify-center shadow-2xl shadow-[oklch(0.75_0.15_75)]/50 group-hover/play:shadow-[oklch(0.75_0.15_75)]/70 transition-all duration-300">
                      <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
                    </div>
                    
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[oklch(0.75_0.15_75)] blur-2xl opacity-0 group-hover/play:opacity-60"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>
                </motion.button>

                {/* Duration badge */}
                <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                  ⏱ 3:45 Demo
                </div>
              </div>
            </div>
          </div>

          {/* Decorative curtain tassels */}
          <div className="absolute -top-8 left-0 w-full flex justify-between px-8 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-16 bg-gradient-to-b from-[oklch(0.75_0.15_75)] to-transparent rounded-b-full opacity-60"
                animate={{
                  scaleY: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Stage lights effect */}
          <motion.div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[oklch(0.75_0.15_75)] rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          />
        </motion.div>

        {/* Feature highlights below video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          {[
            { label: 'Voice Commands', value: '50+' },
            { label: 'Languages Supported', value: '10+' },
            { label: 'Average Time Saved', value: '70%' },
          ].map((stat, index) => (
            <div key={stat.label} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold bg-gradient-to-r from-[oklch(0.75_0.15_75)] to-[oklch(0.65_0.18_285)] bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
