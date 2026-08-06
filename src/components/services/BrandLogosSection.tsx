import React from 'react';
import { Building2, Sparkles } from 'lucide-react';

export interface BrandItem {
  id: string;
  name: string;
  logoUrl: string;
  hasWhiteBg?: boolean;
  scaleClass?: string;
}

const BRAND_ITEMS: BrandItem[] = [
  { id: '1', name: 'Association of Concerned Computer Engineering Students - URS Antipolo', logoUrl: '/brand-logos/ACCESS.png', scaleClass: 'scale-[1.25] sm:scale-[1.35] lg:scale-[1.45]' },
  { id: '2', name: 'Affiliate Hub PH', logoUrl: '/brand-logos/Affiliate Hub PH.png', scaleClass: 'scale-[1.45] sm:scale-[1.6] lg:scale-[1.75]' },
  { id: '3', name: 'Bola PH', logoUrl: '/brand-logos/Bola PH.png', scaleClass: 'scale-[1.3] sm:scale-[1.4] lg:scale-[1.5]' },
  { id: '4', name: 'College of Engineering Student Council - URS Antipolo', logoUrl: '/brand-logos/COENG.png' },
  { id: '5', name: 'Franchising PH', logoUrl: '/brand-logos/Franchising PH.png' },
  { id: '6', name: 'Higher than Limits', logoUrl: '/brand-logos/Higher than Limits.png', hasWhiteBg: true },
  { id: '7', name: 'Hope for Angels', logoUrl: '/brand-logos/Hope for Angels.png' },
  { id: '8', name: 'Kado Kohi', logoUrl: '/brand-logos/Kado Kohi.png', scaleClass: 'scale-[1.4] sm:scale-[1.55] lg:scale-[1.7]' },
  { id: '9', name: 'LVME Cafe', logoUrl: '/brand-logos/LVME Cafe.png' },
  { id: '10', name: 'Marked Media', logoUrl: '/brand-logos/Marked Media.png' },
  { id: '11', name: 'Marketing Hive', logoUrl: '/brand-logos/Marketing Hive.png' },
  { id: '12', name: 'Purehub Nutrition', logoUrl: '/brand-logos/Purehub Nutrition.png', scaleClass: 'scale-[1.45] sm:scale-[1.6] lg:scale-[1.75]' },
];

export const BrandLogosSection: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto my-12">
      <div className="relative rounded-3xl p-6 sm:p-10 bg-slate-950/80 dark:bg-[#07090e]/90 border border-sky-500/20 dark:border-[#48cae4]/30 shadow-[0_0_40px_rgba(72,202,228,0.08)] backdrop-blur-md group">
        {/* Glow ambient background accents (clipped inside sub-container) */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#0077b6]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#48cae4]/15 rounded-full blur-3xl" />
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-[#48cae4] shadow-[0_0_15px_rgba(72,202,228,0.2)]">
              <Building2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-[#48cae4] uppercase">
                  TRUSTED PARTNERS
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  <Sparkles size={10} className="mr-1" /> Client Roster
                </span>
              </div>
              <h2 className="font-neutralfacebold text-xl sm:text-2xl text-white tracking-wide mt-0.5 uppercase">
                Brands and Communities I Worked With
              </h2>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
            <span>12 Featured Collaborations</span>
          </div>
        </div>

        {/* 6x2 Seamless Clean Grid of Brand Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center relative z-10 py-6">
          {BRAND_ITEMS.map((brand, index) => {
            // Smart tooltip alignment based on column position (6-column desktop grid)
            const isLeftmostCol = index % 6 === 0;
            const isRightmostCol = index % 6 === 5;

            const alignmentClasses = isLeftmostCol
              ? 'left-0 translate-x-0'
              : isRightmostCol
              ? 'right-0 left-auto translate-x-0'
              : 'left-1/2 -translate-x-1/2';

            return (
              <div
                key={brand.id}
                className="group/logo relative flex items-center justify-center p-2 h-36 sm:h-40 lg:h-44 transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                {/* Logo Image Container */}
                <div
                  className={`flex items-center justify-center w-full h-full ${
                    brand.hasWhiteBg
                      ? 'bg-white rounded-2xl shadow-xl border border-white/60 p-3 sm:p-4'
                      : 'p-1'
                  }`}
                >
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className={`w-full h-full max-h-32 sm:max-h-36 lg:max-h-40 object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-transform duration-300 ${
                      brand.scaleClass || ''
                    }`}
                    loading="lazy"
                  />
                </div>

                {/* Hover Tooltip for Brand Name */}
                <div
                  className={`absolute -bottom-8 ${alignmentClasses} opacity-0 group-hover/logo:opacity-100 group-hover/logo:translate-y-0 translate-y-1 transition-all duration-200 pointer-events-none z-30 w-max max-w-[200px] sm:max-w-[260px] text-center whitespace-normal bg-slate-900/95 text-white font-neutralfacebold text-[10px] sm:text-[11px] px-3 py-1.5 rounded-lg border border-[#48cae4]/40 shadow-[0_0_15px_rgba(72,202,228,0.25)] tracking-wider uppercase leading-tight`}
                >
                  {brand.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-4 border-t border-slate-800/60 text-center relative z-10">
          <p className="text-xs font-mono text-slate-400">
            Interested in scaling your social media presence?{' '}
            <span
              className="text-[#48cae4] cursor-pointer hover:underline font-semibold"
              onClick={() => {
                const inquiryEl = document.getElementById('inquiry');
                if (inquiryEl) inquiryEl.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Let's collaborate.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandLogosSection;

