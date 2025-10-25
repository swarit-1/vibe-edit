'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Download, Github } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="download" className="relative py-32 overflow-hidden">
      {/* Dramatic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.25_0.15_280)] via-[oklch(0.20_0.12_260)] to-[oklch(0.15_0.10_240)]" />
      
      {/* Animated spotlight effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(244, 166, 56, 0.2) 0%, transparent 70%)',
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Floating badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.75_0.15_75)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[oklch(0.75_0.15_75)]"></span>
            </span>
            <span className="text-white/90 font-medium">Now Available for DaVinci Resolve 18+</span>
          </motion.div>

          <motion.h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Ready to Take the Stage? 🎭
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of editors who've discovered the power of voice-driven editing. Download now and conduct your first edit in minutes.
          </motion.p>

          {/* Testimonial Carousel Placeholder */}
          <motion.div
            className="mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-[oklch(0.75_0.15_75)] text-2xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
                  >
                    ★
                  </motion.span>
                ))}
              </div>
              <p className="text-white/90 text-lg italic mb-4">
                "Maestro has completely transformed my workflow. What used to take hours now takes minutes. It's like having an assistant who understands exactly what I want."
              </p>
              <p className="text-white/60 text-sm">
                — Alex Chen, Professional Video Editor
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="relative bg-[oklch(0.75_0.15_75)] hover:bg-[oklch(0.70_0.15_75)] text-black font-bold px-10 py-7 text-lg rounded-full shadow-2xl shadow-[oklch(0.75_0.15_75)]/50 transition-all duration-300 hover:shadow-[oklch(0.75_0.15_75)]/70 group"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Download Maestro
                {/* Pulse animation */}
                <motion.span
                  className="absolute inset-0 rounded-full bg-[oklch(0.75_0.15_75)]"
                  animate={{
                    scale: [1, 1.2, 1],
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
                className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-7 text-lg rounded-full transition-all duration-300 group"
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Free to try</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>5-minute setup</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 bg-[oklch(0.75_0.15_75)] rounded-full blur-3xl opacity-20 pointer-events-none"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-64 h-64 bg-[oklch(0.65_0.18_285)] rounded-full blur-3xl opacity-20 pointer-events-none"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2.5,
          }}
        />
      </div>
    </section>
  );
}