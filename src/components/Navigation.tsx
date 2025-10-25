'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Music2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Demo', href: '#demo' },
  { label: 'Download', href: '#download' },
];

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[oklch(0.75_0.15_75)] via-[oklch(0.65_0.18_285)] to-[oklch(0.45_0.2_280)] origin-left z-[100]"
        style={{
          scaleX: useTransform(scrollY, [0, document.documentElement.scrollHeight - window.innerHeight], [0, 1]),
        }}
      />

      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Music2 className="w-6 h-6 text-[oklch(0.75_0.15_75)]" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-[oklch(0.75_0.15_75)] to-[oklch(0.65_0.18_285)] bg-clip-text text-transparent">
                Maestro
              </span>
            </a>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[oklch(0.75_0.15_75)] to-[oklch(0.65_0.18_285)] group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
