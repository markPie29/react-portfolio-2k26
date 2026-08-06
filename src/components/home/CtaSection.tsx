import React from 'react';
import { motion } from 'motion/react';
import GradientText from '../../../components/GradientText';
import { ProjectInquiryForm } from './ProjectInquiryForm';
import { Sparkles } from 'lucide-react';

const CtaSection: React.FC = () => {
  return (
    <section
      id="cta"
      className="py-12 md:py-18 px-3 sm:px-6 md:px-12 lg:px-24 bg-transparent border-t border-black/10 dark:border-white/10 relative scroll-mt-20"
    >
      <div id="inquiry" className="max-w-6xl mx-auto space-y-12">
        {/* Heading & Subtitle */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left border-b border-gray-200 dark:border-white/10 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-3 flex flex-col items-center md:items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Inquiry & Discovery</span>
            </div>

            <GradientText
              colors={['#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef']}
              animationSpeed={6}
              showBorder={false}
              className="font-neutralfacebold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.95] text-center md:text-left"
            >
              <span className="block">LET'S WORK</span>
              <span className="block">TOGETHER</span>
            </GradientText>
          </motion.div>
        </div>

        {/* 2-Step Interactive Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ProjectInquiryForm />
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
