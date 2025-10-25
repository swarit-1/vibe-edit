'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Scissors, VolumeX, Sparkles, Palette, Waves, Upload } from 'lucide-react';

const useCases = [
  {
    title: 'Merge Clips',
    command: '"Merge these clips"',
    icon: Scissors,
    gradient: 'from-purple-500/20 to-blue-500/20',
  },
  {
    title: 'Delete Silence',
    command: '"Delete all silence"',
    icon: VolumeX,
    gradient: 'from-cyan-500/20 to-teal-500/20',
  },
  {
    title: 'Add Transition',
    command: '"Add fade transition"',
    icon: Sparkles,
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    title: 'Color Grade',
    command: '"Color grade this scene"',
    icon: Palette,
    gradient: 'from-pink-500/20 to-rose-500/20',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop',
  },
  {
    title: 'Sync Audio',
    command: '"Sync audio tracks"',
    icon: Waves,
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  {
    title: 'Export Video',
    command: '"Export in 4K"',
    icon: Upload,
    gradient: 'from-indigo-500/20 to-blue-500/20',
  },
];

export default function UseCasesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-[oklch(0.96_0.015_280)] to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[oklch(0.45_0.2_280)] to-[oklch(0.65_0.18_285)] bg-clip-text text-transparent">
            Every Command, Perfectly Performed 🎵
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From basic edits to advanced effects, Maestro handles it all with simple voice commands
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group relative"
              >
                <motion.div
                  className="relative overflow-hidden rounded-2xl"
                  whileHover={{ 
                    y: -8,
                    rotateX: hoveredCard === index ? 5 : 0,
                    rotateY: hoveredCard === index ? 5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Glassmorphism card */}
                  <div className="relative h-full p-8 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-60`} />
                    
                    {/* Image for color grade card */}
                    {useCase.image && (
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                        <img
                          src={useCase.image}
                          alt={useCase.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div
                        className="mb-6"
                        animate={hoveredCard === index ? { scale: 1.1, rotate: 360 } : { scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[oklch(0.45_0.2_280)] to-[oklch(0.65_0.18_285)] flex items-center justify-center shadow-lg">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-[oklch(0.45_0.2_280)] transition-colors duration-300">
                        {useCase.title}
                      </h3>

                      {/* Command prompt bubble */}
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[oklch(0.75_0.15_75)] flex-shrink-0 animate-pulse" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground/80 mb-2 font-mono">Voice Command:</p>
                          <motion.div
                            className="px-4 py-2 rounded-lg bg-[oklch(0.45_0.2_280)]/20 border border-[oklch(0.45_0.2_280)]/30"
                            animate={hoveredCard === index ? { scale: 1.05 } : { scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-base text-foreground font-medium italic">
                              {useCase.command}
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Edge glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(45deg, transparent, oklch(0.75 0.15 75) 50%, transparent)',
                        backgroundSize: '200% 200%',
                      }}
                      animate={hoveredCard === index ? {
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="absolute inset-[2px] rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl" />
                    </motion.div>

                    {/* Frosted glass shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ pointerEvents: 'none' }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-muted-foreground mb-4">
            And <span className="font-bold text-[oklch(0.45_0.2_280)]">50+ more commands</span> to discover
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[oklch(0.45_0.2_280)]/10 border border-[oklch(0.45_0.2_280)]/30">
            <span className="text-sm text-foreground font-medium">Full command library included</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}