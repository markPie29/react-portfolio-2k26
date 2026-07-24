import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesData } from '../data/services';
import FadeContent from '../../components/FadeContent';
import CtaSection from '../components/home/CtaSection';
import Footer from '../components/layout/Footer';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const ServicePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const service = servicesData.find(
    (s) =>
      s.slug === slug ||
      (slug === 'graphic-design-video-editing' && s.slug === 'graphic-design')
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, [slug]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-transparent text-foreground">
        <div className="max-w-4xl mx-auto px-6 pt-40 pb-20 text-center flex-grow flex flex-col items-center justify-center">
          <h1 className="font-neutralfacebold text-3xl sm:text-4xl mb-4">SERVICE NOT FOUND</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The requested service does not exist.</p>
          <button
            onClick={() => navigate('/')}
            className="gradient-bg text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>BACK TO HOME</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent text-foreground flex flex-col pt-28">
      <main className="flex-grow w-full px-6 md:px-12 lg:px-24 py-12">
        {/* Service Details */}
        <FadeContent blur duration={1} ease="power3.out" delay={0.1}>
          <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
            {/* Header: Sub-label on top, Title below */}
            <div className="mb-8 sm:mb-10">
              <p className="font-mono text-xs sm:text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-2">
                SERVICES
              </p>
              <h1 className="font-neutralfacebold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter uppercase leading-[0.95] text-gray-900 dark:text-white">
                {service.title}
              </h1>
            </div>

            {/* Vertical Stacked Content */}
            <div className="flex flex-col gap-8 sm:gap-10">
              {/* 1. Description Text (No container box) */}
              <div>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-normal max-w-4xl">
                  {service.description}
                </p>
              </div>

              {/* 2. Key Capabilities & Scope Block */}
              <div className="bg-white/80 dark:bg-[#080a0f]/40 border border-slate-200 dark:border-[#48cae4]/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-sm">
                <h3 className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
                  KEY CAPABILITIES & SCOPE
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {service.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeContent>

        {/* CTA section */}
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default ServicePage;
