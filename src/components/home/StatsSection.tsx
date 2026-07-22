import React from 'react';
import FadeContent from '../../../components/FadeContent';
import BorderGlow from '../../../components/BorderGlow';
import DecryptedText from '../../../components/DecryptedText';
import { statsData } from '../../data/stats';

const StatsSection: React.FC = () => {
  return (
    <section className="py-8 md:py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <FadeContent blur duration={1} ease="power3.out" delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {statsData.map((stat, idx) => (
              <BorderGlow
                key={idx}
                edgeSensitivity={30}
                glowColor="80 80 80"
                backgroundColor=""
                borderRadius={16}
                glowRadius={30}
                glowIntensity={1}
                coneSpread={25}
                animated={true}
                colors={['#0077b6', '#00b4d8', '#48cae4']}
                className="w-full"
              >
                <div className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:min-h-[160px] shadow-sm backdrop-blur-sm transition-all group w-full">
                  <DecryptedText
                    text={stat.value}
                    speed={130}
                    maxIterations={20}
                    sequential={true}
                    revealDirection="start"
                    animateOn="inViewHover"
                    className="font-neutralfacebold text-3xl sm:text-4xl md:text-5xl tracking-tight text-gray-900 dark:text-white group-hover:text-accent transition-colors"
                    encryptedClassName="font-neutralfacebold text-3xl sm:text-4xl md:text-5xl tracking-tight text-accent"
                  />
                  <div className="mt-2">
                    <DecryptedText
                      text={stat.label}
                      speed={100}
                      maxIterations={16}
                      sequential={true}
                      revealDirection="start"
                      animateOn="inViewHover"
                      className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400"
                      encryptedClassName="text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent"
                    />
                  </div>
                </div>
              </BorderGlow>
            ))}
          </div>
        </FadeContent>
      </div>
    </section>
  );
};

export default StatsSection;
