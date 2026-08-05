import { useState, useEffect, useMemo } from 'react';
import { GraphicProject, GraphicProjectImage } from '../data/graphicProjects';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface ExtendedImage extends GraphicProjectImage {
  projectId: string;
  projectName: string;
  aspectRatio: number;
  colSpan: number;
  rowSpan: number;
}

export function useBentoLayout(
  projects: GraphicProject[],
  columnCount: number,
  containerWidth: number
) {
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  // 1. Round-Robin Interleave images across projects to avoid same-project grouping
  const interleavedImages = useMemo(() => {
    const result: (GraphicProjectImage & { projectId: string; projectName: string })[] = [];
    if (!projects || projects.length === 0) return result;

    const maxImages = Math.max(...projects.map((p) => p.images.length));
    for (let i = 0; i < maxImages; i++) {
      for (const project of projects) {
        if (project.images[i]) {
          result.push({
            ...project.images[i],
            projectId: project.id,
            projectName: project.name,
          });
        }
      }
    }
    return result;
  }, [projects]);

  // 2. Preload/load image aspect ratios and track broken images
  useEffect(() => {
    let isMounted = true;

    interleavedImages.forEach((img) => {
      if (aspectRatios[img.src] || brokenImages.has(img.src)) return;

      const imageObj = new Image();
      imageObj.src = img.src;
      imageObj.onload = () => {
        if (isMounted && imageObj.naturalWidth && imageObj.naturalHeight) {
          const ratio = imageObj.naturalWidth / imageObj.naturalHeight;
          setAspectRatios((prev) => {
            if (prev[img.src] === ratio) return prev;
            return { ...prev, [img.src]: ratio };
          });
        }
      };
      imageObj.onerror = () => {
        if (isMounted) {
          setBrokenImages((prev) => {
            const next = new Set(prev);
            next.add(img.src);
            return next;
          });
        }
      };
    });

    return () => {
      isMounted = false;
    };
  }, [interleavedImages]);

  // 3. Filter out broken images
  const validImages = useMemo(() => {
    return interleavedImages.filter((img) => !brokenImages.has(img.src));
  }, [interleavedImages, brokenImages]);

  // 4. Calculate Grid Layout Spans (Col Span & Row Span)
  const layoutImages = useMemo<ExtendedImage[]>(() => {
    const gap = 16; // 16px grid gap (gap-4)
    const baseRowHeight = 10; // 10px base row height
    const cols = Math.max(1, columnCount);

    // Calculate width of a single column track
    const safeWidth = containerWidth > 0 ? containerWidth : 1152;
    const colWidth = Math.max(100, (safeWidth - (cols - 1) * gap) / cols);

    return validImages.map((img) => {
      const ratio = aspectRatios[img.src] || 1.0;
      const isLandscape = ratio >= 1.15;

      // Landscape images span 2 columns if total columns >= 2
      const colSpan = isLandscape && cols >= 2 ? Math.min(2, cols) : 1;

      // Calculate rendered pixel width and height
      const itemWidth = colSpan * colWidth + (colSpan - 1) * gap;
      const renderedHeight = itemWidth / ratio;

      // Calculate grid row span (auto-rows: 10px + 16px gap = 26px unit per row track)
      const trackUnit = baseRowHeight + gap;
      const rowSpan = Math.max(2, Math.round((renderedHeight + gap) / trackUnit));

      return {
        ...img,
        aspectRatio: ratio,
        colSpan,
        rowSpan,
      };
    });
  }, [validImages, aspectRatios, columnCount, containerWidth]);

  // 5. Refresh GSAP ScrollTrigger whenever aspect ratios update layout dimensions
  useEffect(() => {
    if (Object.keys(aspectRatios).length > 0) {
      ScrollTrigger.refresh();
    }
  }, [aspectRatios]);

  const handleImageError = (src: string) => {
    setBrokenImages((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  };

  return {
    allImages: layoutImages,
    handleImageError,
  };
}

