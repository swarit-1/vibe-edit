'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

const commandExamples = [
  "Click the Export button",
  "Adjust the color grading panel",
  "Open the timeline settings",
  "Apply the transition effect",
  "Navigate to the media pool",
];

// Musical note characters
const musicalNotes = ['♪', '♫', '♬', '♩'];

export default function HeroSection() {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCommand((prev) => (prev + 1) % commandExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Orchestral Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.25_0.15_280)] via-[oklch(0.20_0.12_260)] to-[oklch(0.15_0.10_240)]" />
      
      {/* Animated Music Staff Lines with Wave */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-[2px] bg-white"
            style={{ top: `${20 + i * 15}%` }}
            animate={{
              scaleX: [0.98, 1.02, 0.98],
              y: [0, Math.sin(i) * 3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Floating Musical Notes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl text-[oklch(0.75_0.15_75)] opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-10%',
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 0.6, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          >
            {musicalNotes[Math.floor(Math.random() * musicalNotes.length)]}
          </motion.div>
        ))}
      </div>

      {/* Sheet Music Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? 'oklch(0.75 0.15 75)' : i % 3 === 1 ? 'oklch(0.65 0.18 285)' : 'white',
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, (Math.random() - 0.5) * 30],
              opacity: [0.2, 1, 0.2],
              rotate: [0, 180, 360],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Spotlight effect following mouse */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(244, 166, 56, 0.15) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-[oklch(0.75_0.15_75)]" />
            <span className="text-sm text-white/90">AI-Powered Editing Assistant</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your AI Guide
            <br />
            <span className="relative inline-block">
              for{' '}
              <motion.span
                className="relative inline-block bg-gradient-to-r from-[oklch(0.75_0.15_75)] via-[oklch(0.85_0.15_75)] to-[oklch(0.75_0.15_75)] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundSize: '200% auto',
                }}
              >
                DaVinci Resolve
              </motion.span>
              {/* Chat icon */}
              <motion.span
                className="inline-block ml-4 text-[oklch(0.75_0.15_75)]"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                💬
              </motion.span>
            </span>
          </h1>

          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            A smart chat assistant that guides you through DaVinci Resolve, telling you exactly what buttons to click and how to make edits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="relative bg-[oklch(0.75_0.15_75)] hover:bg-[oklch(0.70_0.15_75)] text-black font-semibold px-8 py-6 text-lg rounded-full shadow-2xl shadow-[oklch(0.75_0.15_75)]/50 transition-all duration-300"
              >
                Download Plugin
                {/* Pulse animation */}
                <motion.span
                  className="absolute inset-0 rounded-full bg-[oklch(0.75_0.15_75)]"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg rounded-full transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* DaVinci Resolve Mockup with Command Bubbles */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {/* Mockup Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl p-4">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=675&fit=crop"
                alt="Video editing interface"
                className="w-full h-full object-cover opacity-70"
              />
              
              {/* Floating Command Bubbles */}
              <motion.div
                key={currentCommand}
                className="absolute top-1/4 left-1/4 px-6 py-3 rounded-full bg-[oklch(0.65_0.18_285)]/90 backdrop-blur-md text-white font-medium shadow-lg"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                "{commandExamples[currentCommand]}"
              </motion.div>

              <motion.div
                className="absolute bottom-1/4 right-1/4 px-4 py-2 rounded-full bg-[oklch(0.75_0.15_75)]/90 backdrop-blur-md text-black font-medium shadow-lg text-sm"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ✓ Applied
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 bg-[oklch(0.75_0.15_75)] rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-[oklch(0.65_0.18_285)] rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}