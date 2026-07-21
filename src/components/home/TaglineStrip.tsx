import React from 'react';
import { motion } from 'motion/react';

interface TaglineStripProps {
  direction?: 'left' | 'right';
  speed?: number;
}

const TaglineStrip: React.FC<TaglineStripProps> = ({
  direction = 'left',
  speed = 45,
}) => {
  const taglineText = 'GRAPHIC DESIGN – SOFTWARE DEVELOPMENT – SOCIAL MEDIA MANAGEMENT';

  return (
    <div className="w-full bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#48cae4] text-white py-3.5 border-y border-white/20 overflow-hidden whitespace-nowrap select-none shadow-md">
      <motion.div
        className="inline-flex gap-8 items-center"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="text-xs sm:text-sm md:text-base font-neutralfacebold tracking-widest uppercase flex items-center gap-8 drop-shadow-sm text-white"
          >
            <span>{taglineText}</span>
            <span className="opacity-60">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default TaglineStrip;
