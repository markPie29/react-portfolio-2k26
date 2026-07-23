import React from 'react';
import { motion } from 'motion/react';
import { testimonialsData } from '../../data/testimonials';
import { Quote, Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-8 md:py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="font-neutralfacebold text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase !leading-none text-gray-900 dark:text-white text-left w-fit !my-0">
            TESTIMONIALS
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-accent/40 transition-all group shadow-sm backdrop-blur-sm relative"
              >
                {/* Quote Icon Background Accent */}
                <div className="absolute top-6 right-6 text-accent/15 dark:text-accent/20 group-hover:text-accent/30 transition-colors">
                  <Quote size={36} />
                </div>

                <div>
                  {/* Rating Stars & Project Tag */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                      {item.projectType}
                    </span>
                  </div>

                  {/* Quote Text */}
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic mb-8 relative z-10">
                    "{item.quote}"
                  </p>
                </div>

                {/* Client Profile */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/80 dark:border-white/10">
                  {/* Avatar Initials Badge */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0077b6] to-[#48cae4] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {item.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-neutralfacebold text-sm uppercase tracking-wide text-gray-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      {item.role} • <span className="text-accent">{item.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
