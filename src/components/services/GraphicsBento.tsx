import React, { useState, useEffect } from 'react';
import { graphicProjects } from '../../data/graphicProjects';
import { useBentoLayout, ExtendedImage } from '../../hooks/useBentoLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';

const GraphicsBento: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ExtendedImage | null>(null);
  const [columnCount, setColumnCount] = useState<number>(4);

  // Responsive column calculation
  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumnCount(1);
      } else if (width < 768) {
        setColumnCount(2);
      } else if (width < 1024) {
        setColumnCount(3);
      } else {
        setColumnCount(4);
      }
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Dynamic Auto-Layout Algorithm Hook with automatic file scanning & broken image handling
  const { allImages, columns, handleImageError } = useBentoLayout(graphicProjects, columnCount);

  return (
    <div className="w-full max-w-6xl mx-auto mb-16 sm:mb-20">
      {/* Header section for the bento gallery */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
            DESIGN OUTPUTS & SHOWCASE
          </h3>
          <h2 className="font-neutralfacebold text-2xl sm:text-4xl text-gray-900 dark:text-white uppercase tracking-tight">
            GRAPHICS GALLERY
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-mono text-gray-500 dark:text-gray-400">
          Showing {allImages.length} uncropped visual items
        </p>
      </div>

      {/* Dynamic Balanced Multi-Column Bento Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
        {columns.map((columnImages, colIndex) => (
          <div key={`col-${colIndex}`} className="flex flex-col gap-4">
            {columnImages.map((image, imgIndex) => (
              <motion.div
                key={`${image.projectId}-${image.src}-${imgIndex}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: (imgIndex % 6) * 0.05 }}
                onClick={() => setSelectedImage(image)}
                className="group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image with 100% original uncropped aspect ratio */}
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  onError={() => handleImageError(image.src)}
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500 ease-out block"
                />

                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-semibold tracking-wider uppercase bg-white/20 dark:bg-black/40 text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {image.projectName}
                    </span>
                    <div className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                  <div className="mt-auto">
                    <p className="text-white text-xs font-medium truncate drop-shadow-sm">
                      {image.alt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />

              <div className="mt-4 text-center">
                <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold block mb-1">
                  {selectedImage.projectName}
                </span>
                <p className="text-white/80 text-sm font-medium">
                  {selectedImage.alt}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GraphicsBento;
