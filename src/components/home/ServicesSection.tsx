import React from 'react';
import { motion } from 'motion/react';
import { servicesData } from '../../data/services';

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-neutralfacebold text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase mb-12">
          SERVICES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesData.map((service, idx) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-gray-200 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-accent/40 transition-all group shadow-sm"
            >
              <div>
                <h3 className="font-neutralfacebold text-xl sm:text-2xl tracking-wide uppercase mb-4 text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                <ul className="flex flex-col gap-2 mb-8">
                  {service.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-bold tracking-widest uppercase text-gray-800 dark:text-gray-200 group-hover:text-accent inline-flex items-center gap-2 transition-colors"
                >
                  <span>LEARN MORE</span>
                  <svg
                    className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
