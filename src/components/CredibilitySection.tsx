'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Cpu } from 'lucide-react';

export default function CredibilitySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.08_280)] via-[oklch(0.15_0.10_260)] to-[oklch(0.12_0.08_240)]" />
      
      {/* Circuit board pattern mixed with musical staff */}
      <div className="absolute inset-0 opacity-10">
        {/* Circuit board pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        {/* Musical staff lines overlay */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-[1px] bg-white/20"
            style={{ top: `${20 + i * 15}%` }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Built on World-Class Technology
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Powered by cutting-edge AI and recognized innovation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* NVIDIA Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            className="group relative"
          >
            <div className="relative h-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-green-500/50 transition-all duration-300 overflow-hidden">
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                style={{ backgroundSize: '200% 200%' }}
              />
              
              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30"
                  animate={{
                    boxShadow: [
                      '0 10px 30px rgba(34, 197, 94, 0.3)',
                      '0 10px 40px rgba(34, 197, 94, 0.5)',
                      '0 10px 30px rgba(34, 197, 94, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Cpu className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  NVIDIA Nemotron 70B
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Fine-tuned on NVIDIA's state-of-the-art AI model for unparalleled natural language understanding
                </p>

                {/* Tech specs */}
                <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60 mb-2 font-mono">Technical Stack:</p>
                  <div className="space-y-1 text-xs text-white/80 font-mono text-left">
                    <div>• Fine-tuned NVIDIA Nemotron 70B</div>
                    <div>• DaVinci Resolve API Integration</div>
                    <div>• Real-time Command Processing</div>
                  </div>
                </div>

                {/* NVIDIA branding accent */}
                <div className="mt-6 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium">
                  AI Technology Partner
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hackathon Badge */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            className="group relative"
          >
            <div className="relative h-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-[oklch(0.75_0.15_75)]/50 transition-all duration-300 overflow-hidden">
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[oklch(0.75_0.15_75)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                style={{ backgroundSize: '200% 200%' }}
              />
              
              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.15_75)] to-[oklch(0.65_0.18_285)] flex items-center justify-center mb-6 shadow-lg shadow-[oklch(0.75_0.15_75)]/30"
                  animate={{
                    boxShadow: [
                      '0 10px 30px rgba(244, 166, 56, 0.3)',
                      '0 10px 40px rgba(244, 166, 56, 0.5)',
                      '0 10px 30px rgba(244, 166, 56, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Award className="w-10 h-10 text-black" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  NVIDIA AI Hackathon
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Recognized for innovation and excellence in AI-powered creative tools at the NVIDIA AI Hackathon
                </p>

                {/* Achievement highlights */}
                <div className="w-full space-y-3">
                  {[
                    'Best AI Integration',
                    'Innovation Award',
                    'Community Choice',
                  ].map((achievement, i) => (
                    <motion.div
                      key={achievement}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <p className="text-sm text-white/80">🏆 {achievement}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Winner badge */}
                <div className="mt-6 px-4 py-2 rounded-full bg-[oklch(0.75_0.15_75)]/20 border border-[oklch(0.75_0.15_75)]/30 text-[oklch(0.75_0.15_75)] text-sm font-medium">
                  🏆 Award Winner
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '10x', label: 'Faster Editing' },
            { value: '99%', label: 'Accuracy' },
            { value: '50+', label: 'Commands' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1, type: 'spring' }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[oklch(0.75_0.15_75)] to-[oklch(0.65_0.18_285)] bg-clip-text text-transparent mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-white/60 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}