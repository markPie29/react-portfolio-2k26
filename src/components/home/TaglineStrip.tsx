import React from 'react';

const TaglineStrip: React.FC = () => {
  const tagline = 'GRAPHIC DESIGN – SOFTWARE DEVELOPMENT – SOCIAL MEDIA MANAGEMENT';

  return (
    <div className="w-full bg-black/5 dark:bg-white/5 backdrop-blur-sm text-gray-800 dark:text-gray-200 py-4 px-6 border-y border-black/10 dark:border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto flex justify-center items-center text-center">
        <p className="text-xs sm:text-sm md:text-base font-neutralfacebold tracking-widest uppercase">
          {tagline}
        </p>
      </div>
    </div>
  );
};

export default TaglineStrip;
