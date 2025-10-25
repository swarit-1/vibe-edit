'use client';

import { motion } from 'framer-motion';
import { Download, MessageCircle, Sparkles } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    icon: Download,
    title: 'Download Plugin',
    description: 'Install the chat assistant plugin for DaVinci Resolve in seconds. Compatible with version 18+.',
    number: '01',
  },
  {
    icon: MessageCircle,
    title: 'Ask Your Question',
    description: 'Type your question or describe what you want to do. The AI understands natural language.',
    number: '02',
  },
  {
    icon: Sparkles,
    title: 'Follow the Guidance',
    description: 'Get step-by-step instructions on exactly what buttons to click and settings to adjust.',
    number: '03',
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.96_0.015_280)] via-background to-[oklch(0.96_0.015_280)]" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[oklch(0.45_0.2_280)] rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[oklch(0.75_0.15_75)] rounded-full blur-3xl opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[oklch(0.45_0.2_280)] to-[oklch(0.65_0.18_285)] bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with your AI editing assistant in three simple steps
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Timeline - Musical Staff */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2">
            <motion.div
              className="h-full w-full bg-gradient-to-b from-[oklch(0.45_0.2_280)] via-[oklch(0.65_0.18_285)] to-[oklch(0.75_0.15_75)]"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
            />
            
            {/* Wavy conductor baton trail overlay */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-[oklch(0.75_0.15_75)] rounded-full left-1/2 -translate-x-1/2"
                style={{ top: `${i * 25}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
              />
            ))}
          </div>

          <div className="space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                  className={`relative flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col gap-8`}
                >
                  {/* Content Side */}
                  <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                    {/* Step number with crescendo effect */}
                    <motion.div
                      className="inline-block mb-4 text-8xl font-bold bg-gradient-to-br from-[oklch(0.45_0.2_280)] to-[oklch(0.65_0.18_285)] bg-clip-text text-transparent opacity-20"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={isInView ? { scale: 1, rotate: 0 } : {}}
                      transition={{ 
                        duration: 0.8, 
                        delay: index * 0.3 + 0.2, 
                        type: 'spring',
                        stiffness: 200
                      }}
                    >
                      {step.number}
                    </motion.div>

                    <h3 className="text-3xl font-bold mb-4 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                      {step.description}
                    </p>
                  </div>

                  {/* Center Icon */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ type: 'spring', stiffness: 200, duration: 0.8 }}
                    >
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[oklch(0.45_0.2_280)] to-[oklch(0.65_0.18_285)] flex items-center justify-center shadow-2xl shadow-[oklch(0.45_0.2_280)]/40 relative z-10">
                        {/* Special animation for each icon */}
                        {index === 0 ? (
                          // Download transforms into falling sheet music
                          <motion.div
                            animate={{
                              y: [0, 5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            <Icon className="w-16 h-16 text-white" />
                          </motion.div>
                        ) : index === 1 ? (
                          // Chat bubble with pulsing effect
                          <div className="relative">
                            <Icon className="w-16 h-16 text-white relative z-10" />
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute inset-0 rounded-full border-2 border-white"
                                animate={{
                                  scale: [1, 1.5, 2],
                                  opacity: [0.6, 0.3, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.4,
                                  ease: 'easeOut',
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          // Sparkles with magic effect
                          <motion.div
                            animate={{
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          >
                            <Icon className="w-16 h-16 text-white" />
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Glow pulse */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-[oklch(0.45_0.2_280)] blur-3xl opacity-40"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 0.5,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Empty space for layout balance */}
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom decorative wave */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <svg width="100%" height="60" viewBox="0 0 1200 60" className="opacity-20">
            <motion.path
              d="M0 30 Q300 10, 600 30 T1200 30"
              stroke="url(#gradient)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2, delay: 1.2 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(0.45 0.2 280)" />
                <stop offset="50%" stopColor="oklch(0.65 0.18 285)" />
                <stop offset="100%" stopColor="oklch(0.75 0.15 75)" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}