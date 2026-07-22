import React, { useState } from 'react';
import { motion } from 'motion/react';
import GradientText from '../../../components/GradientText';
import { ProjectInquiryForm } from './ProjectInquiryForm';
import { Calendar, ChevronDown, Sparkles } from 'lucide-react';

const CtaSection: React.FC = () => {
  const [showDirectForm, setShowDirectForm] = useState(true);

  return (
    <section
      id="cta"
      className="py-12 md:py-18 px-6 md:px-12 lg:px-24 bg-transparent border-t border-black/10 dark:border-white/10 relative scroll-mt-20"
    >
      <div id="inquiry" className="max-w-6xl mx-auto space-y-12">
        {/* Heading & Subtitle */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-gray-200 dark:border-white/10 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Inquiry & Discovery</span>
            </div>

            <GradientText
              colors={['#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef']}
              animationSpeed={6}
              showBorder={false}
              className="font-neutralfacebold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.95]"
            >
              <span className="block">LET'S WORK</span>
              <span className="block">TOGETHER</span>
            </GradientText>
          </motion.div>

          {/* Quick Schedule Call Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-2"
          >
            <a
              href={import.meta.env.VITE_DISCOVERY_CALL_URL || 'https://cal.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold tracking-wider text-sky-500 hover:text-sky-400 inline-flex items-center gap-2 transition-colors uppercase cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Skip form & book call directly</span>
            </a>
          </motion.div>
        </div>

        {/* Multi-Step Interactive Form */}
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
