'use client';

import { Github, Twitter, MessageCircle, Book, FileText, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Demo', href: '#demo' },
  ],
  resources: [
    { label: 'Documentation', href: '#docs', icon: Book },
    { label: 'GitHub', href: '#github', icon: Github },
    { label: 'Community', href: '#community', icon: MessageCircle },
  ],
  connect: [
    { label: 'Discord', href: '#discord' },
    { label: 'Twitter/X', href: '#twitter' },
    { label: 'Email', href: '#email' },
  ],
};

const socialLinks = [
  { icon: Github, href: '#github', label: 'GitHub' },
  { icon: Twitter, href: '#twitter', label: 'Twitter' },
  { icon: MessageCircle, href: '#discord', label: 'Discord' },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background to-[oklch(0.94_0.015_280)] border-t border-border/50">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.45_0.2_280)] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎼
                </motion.span>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[oklch(0.45_0.2_280)] to-[oklch(0.65_0.18_285)] bg-clip-text text-transparent">
                  Maestro
                </h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Conduct your video editing workflow with AI-powered natural language commands for DaVinci Resolve.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-muted hover:bg-[oklch(0.45_0.2_280)] text-muted-foreground hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -3 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-[oklch(0.75_0.15_75)]">♪</span>
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-[oklch(0.45_0.2_280)] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-[oklch(0.75_0.15_75)]">♫</span>
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-[oklch(0.45_0.2_280)] transition-colors duration-200 flex items-center gap-2"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-[oklch(0.75_0.15_75)]">♬</span>
              Connect
            </h4>
            <ul className="space-y-3">
              {footerLinks.connect.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-[oklch(0.45_0.2_280)] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p>© 2025 Maestro. All rights reserved. Made with ❤️ for creators.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-[oklch(0.45_0.2_280)] transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-[oklch(0.45_0.2_280)] transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[oklch(0.45_0.2_280)] via-[oklch(0.65_0.18_285)] to-[oklch(0.75_0.15_75)] opacity-50" />
    </footer>
  );
}