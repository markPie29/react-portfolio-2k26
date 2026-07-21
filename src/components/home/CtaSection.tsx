import React from 'react';
import { motion } from 'motion/react';
import GradientText from '../../../components/GradientText';

const CtaSection: React.FC = () => {
  return (
    <section id="cta" className="py-20 md:py-32 px-6 md:px-12 lg:px-24 bg-transparent border-t border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        {/* Heading with GradientText */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GradientText
            colors={['#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef']}
            animationSpeed={6}
            showBorder={false}
            className="font-neutralfacebold text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase leading-[0.95]"
          >
            <span className="block">LETS WORK</span>
            <span className="block">TOGETHER</span>
          </GradientText>
        </motion.div>

        {/* CTA Link / Button */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-2xl sm:text-3xl md:text-4xl font-helvetica-neue-medium text-gray-800 dark:text-gray-200 hover:text-accent dark:hover:text-accent transition-colors inline-flex items-center gap-3 group cursor-pointer"
          >
            <span>Book your free consultation</span>
            <svg
              className="w-8 h-8 md:w-10 md:h-10 transform group-hover:translate-x-2 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
