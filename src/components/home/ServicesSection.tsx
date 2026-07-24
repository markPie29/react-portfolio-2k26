import React from 'react';
import { Link } from 'react-router-dom';
import ScrollFloat from '../../../components/ScrollFloat';
import FadeContent from '../../../components/FadeContent';
import { servicesData } from '../../data/services';
import { ArrowRight } from 'lucide-react';

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            textClassName="font-neutralfacebold text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase !leading-none text-gray-900 dark:text-white"
            containerClassName="text-left w-fit !my-0"
          >
            SERVICES
          </ScrollFloat>
        </div>

        <FadeContent blur duration={1} ease="power3.out" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesData.map((service) => (
              <div
                key={service.slug}
                className="bg-white/80 dark:bg-[#080a0f]/40 border border-slate-200 dark:border-[#48cae4]/20 rounded-2xl p-8 flex flex-col justify-between hover:border-accent/40 transition-all group shadow-sm backdrop-blur-sm"
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
                  <Link
                    to={service.href || `/services/${service.slug}`}
                    className="text-xs font-bold tracking-widest uppercase text-gray-800 dark:text-gray-200 group-hover:text-accent inline-flex items-center gap-2 transition-colors"
                  >
                    <span>LEARN MORE</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </FadeContent>
      </div>
    </section>
  );
};

export default ServicesSection;
