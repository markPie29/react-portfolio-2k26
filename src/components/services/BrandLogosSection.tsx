import React from 'react';
import { Building2, Sparkles, Image as ImageIcon, ArrowUpRight } from 'lucide-react';

export interface BrandItem {
  id: string;
  name: string;
  category?: string;
  logoUrl?: string;
}

const PLACEHOLDER_BRANDS: BrandItem[] = [
  { id: '1', name: 'Brand Partner #1', category: 'E-Commerce & Retail' },
  { id: '2', name: 'Brand Partner #2', category: 'Tech & SaaS' },
  { id: '3', name: 'Brand Partner #3', category: 'Lifestyle & Wellness' },
  { id: '4', name: 'Brand Partner #4', category: 'Food & Beverage' },
  { id: '5', name: 'Brand Partner #5', category: 'Fashion & Apparel' },
  { id: '6', name: 'Brand Partner #6', category: 'Corporate & Real Estate' },
];

export const BrandLogosSection: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto my-12">
      <div className="relative rounded-3xl p-6 sm:p-10 bg-slate-950/80 dark:bg-[#07090e]/90 border border-sky-500/20 dark:border-[#48cae4]/30 shadow-[0_0_40px_rgba(72,202,228,0.08)] backdrop-blur-md overflow-hidden group">
        {/* Glow ambient background accents */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#0077b6]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#48cae4]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10 border-b border-slate-800/80 pb-6">
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
                Brands & Communities I've Managed
              </h2>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
            <span>6 Featured Collaborations</span>
          </div>
        </div>

        {/* 2x3 Grid of Brand Logo Placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
          {PLACEHOLDER_BRANDS.map((brand, index) => (
            <div
              key={brand.id}
              className="group/card relative rounded-2xl p-6 bg-slate-900/40 dark:bg-[#0c101a]/70 border border-slate-800/80 hover:border-[#48cae4]/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(72,202,228,0.15)] flex flex-col items-center justify-center min-h-[160px] text-center"
            >
              {/* Top Card Badge / Number */}
              <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500 font-semibold">
                0{index + 1}
              </div>
              <div className="absolute top-3 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity text-[#48cae4]">
                <ArrowUpRight size={14} />
              </div>

              {/* Logo Graphic or Placeholder Icon */}
              <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-slate-800 group-hover/card:border-[#48cae4]/40 flex items-center justify-center text-slate-400 group-hover/card:text-[#48cae4] transition-all duration-300 mb-3 shadow-inner">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} className="w-10 h-10 object-contain" />
                ) : (
                  <ImageIcon size={22} className="opacity-70 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all" />
                )}
              </div>

              {/* Brand Name & Category */}
              <h3 className="font-neutralfacebold text-sm text-slate-200 group-hover/card:text-white transition-colors tracking-wider uppercase">
                {brand.name}
              </h3>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                {brand.category}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-slate-800/60 text-center relative z-10">
          <p className="text-xs font-mono text-slate-400">
            Interested in scaling your social media presence? <span className="text-[#48cae4] cursor-pointer hover:underline" onClick={() => {
              const inquiryEl = document.getElementById('inquiry');
              if (inquiryEl) inquiryEl.scrollIntoView({ behavior: 'smooth' });
            }}>Let's collaborate.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandLogosSection;
