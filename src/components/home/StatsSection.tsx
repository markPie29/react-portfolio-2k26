import React from 'react';
import { motion } from 'motion/react';
import { statsData } from '../../data/stats';

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statsData.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-200 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:min-h-[160px] shadow-sm hover:border-accent/40 transition-all group"
            >
              <span className="font-neutralfacebold text-3xl sm:text-4xl md:text-5xl tracking-tight text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-2">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
