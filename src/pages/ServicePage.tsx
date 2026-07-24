import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { servicesData } from '../data/services';
import ScrollFloat from '../../components/ScrollFloat';
import FadeContent from '../../components/FadeContent';
import CtaSection from '../components/home/CtaSection';
import Footer from '../components/layout/Footer';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

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
      <main className="flex-grow max-w-5xl mx-auto px-6 md:px-12 w-full py-12">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
          >
            <ArrowLeft size={16} />
            <span>ALL SERVICES</span>
          </Link>
        </div>

        {/* Service Title */}
        <div className="mb-8">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            textClassName="font-neutralfacebold text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase !leading-tight text-gray-900 dark:text-white"
            containerClassName="text-left w-fit !my-0"
          >
            {service.title}
          </ScrollFloat>
        </div>

        {/* Service Details Card */}
        <FadeContent blur duration={1} ease="power3.out" delay={0.1}>
          <div className="bg-white/80 dark:bg-[#080a0f]/60 border border-slate-200 dark:border-[#48cae4]/20 rounded-3xl p-8 sm:p-12 shadow-lg backdrop-blur-md relative overflow-hidden mb-16">
            {/* Subtle Gradient Glow Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl -z-10 pointer-events-none" />

            {/* Sub-header badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles size={14} />
              <span>OFFERING OVERVIEW</span>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-10 font-normal">
              {service.description}
            </p>

            {/* Capabilities / Bullet points section */}
            <div className="border-t border-gray-200 dark:border-white/10 pt-8">
              <h3 className="font-neutralfacebold text-lg sm:text-xl uppercase tracking-wide mb-6 text-gray-900 dark:text-white">
                KEY CAPABILITIES & SCOPE
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {service.bullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 hover:border-accent/30 transition-colors"
                  >
                    <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
                      {bullet}
                    </span>
                  </div>
                ))}
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
