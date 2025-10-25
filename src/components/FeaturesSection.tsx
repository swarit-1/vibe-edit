'use client';

import { motion } from 'framer-motion';
import { Wand2, Brain, Zap } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: Wand2,
    title: 'Step-by-Step Guidance',
    description: 'Ask how to do anything in DaVinci Resolve and get clear, actionable instructions on what buttons to click.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Understanding',
    description: 'Built with NVIDIA Nemotron 70B, the chatbot understands your editing goals and provides contextual help.',
  },
  {
    icon: Zap,
    title: 'Learn While You Edit',
    description: 'Speed up your workflow by getting instant answers. No more searching through tutorials or documentation.',
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="features" className="relative py-32 bg-gradient-to-b from-background to-[oklch(0.96_0.015_280)]">
      {/* Sound wave pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q25 25, 50 50 T100 50" stroke="currentColor" fill="none" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[oklch(0.45_0.2_280)] to-[oklch(0.65_0.18_285)] bg-clip-text text-transparent">
            💬 Your Personal Editing Coach
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant help and guidance for any task in DaVinci Resolve through an intelligent chat interface.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Gradient border with pulse */}
                <motion.div
                  className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(45deg, oklch(0.45 0.2 280), oklch(0.65 0.18 285), oklch(0.75 0.15 75))',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                <div className="relative h-full p-8 rounded-2xl bg-white dark:bg-card backdrop-blur-sm border border-[oklch(0.45_0.2_280)]/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                  {/* Icon with special animations per card */}
                  <div className="mb-6 relative">
                    {index === 0 ? (
                      // Card 1: Magic wand with sparkles
                      <motion.div
                        className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[oklch(0.45_0.2_280)] to-[oklch(0.65_0.18_285)] flex items-center justify-center shadow-lg group-hover:shadow-[oklch(0.45_0.2_280)]/50 transition-shadow duration-300"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                        {/* Sparkles on hover */}
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-[oklch(0.75_0.15_75)] rounded-full opacity-0 group-hover:opacity-100"
                            initial={{ scale: 0 }}
                            whileHover={{
                              scale: [0, 1, 0],
                              x: Math.cos((i * Math.PI * 2) / 6) * 30,
                              y: Math.sin((i * Math.PI * 2) / 6) * 30,
                            }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                          />
                        ))}
                      </motion.div>
                    ) : index === 1 ? (
                      // Card 2: Brain with neural network
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[oklch(0.45_0.2_280)] to-[oklch(0.65_0.18_285)] flex items-center justify-center shadow-lg group-hover:shadow-[oklch(0.45_0.2_280)]/50 transition-shadow duration-300">
                        <Icon className="w-8 h-8 text-white relative z-10" />
                        {/* Neural network connections */}
                        <svg className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                          {[...Array(4)].map((_, i) => (
                            <motion.line
                              key={i}
                              x1="50%"
                              y1="50%"
                              x2={`${50 + Math.cos((i * Math.PI) / 2) * 40}%`}
                              y2={`${50 + Math.sin((i * Math.PI) / 2) * 40}%`}
                              stroke="white"
                              strokeWidth="1"
                              initial={{ pathLength: 0 }}
                              whileHover={{ pathLength: 1 }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                            />
                          ))}
                        </svg>
                      </div>
                    ) : (
                      // Card 3: Lightning with speed lines
                      <motion.div
                        className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[oklch(0.45_0.2_280)] to-[oklch(0.65_0.18_285)] flex items-center justify-center shadow-lg group-hover:shadow-[oklch(0.45_0.2_280)]/50 transition-shadow duration-300 overflow-hidden"
                      >
                        <Icon className="w-8 h-8 text-white relative z-10" />
                        {/* Speed lines */}
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute left-0 w-full h-0.5 bg-white opacity-0 group-hover:opacity-70"
                            style={{ top: `${30 + i * 20}%` }}
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                          />
                        ))}
                      </motion.div>
                    )}
                    
                    {/* Orchestral pulse glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-[oklch(0.45_0.2_280)] blur-xl opacity-0 group-hover:opacity-40"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0, 0.4, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-[oklch(0.45_0.2_280)] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[oklch(0.75_0.15_75)]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}