import React from 'react';
import { motion } from 'motion/react';

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-transparent backdrop-blur-sm"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center justify-center gap-6">
        {/* Pulsing animated spinner */}
        <div className="relative flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full border-t-2 border-l-2 border-accent"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ 
              boxShadow: '0 0 20px rgba(72, 202, 228, 0.3)' 
            }}
          />
          <motion.div
            className="absolute w-12 h-12 rounded-full border-b-2 border-r-2 border-[#90e0ef]"
            animate={{ rotate: -360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        {/* Loading Text */}
        <motion.p
          className="font-neutralfacebold text-xl md:text-2xl gradient-text tracking-[0.2em] uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Loading
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
