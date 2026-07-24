import { useState, useEffect, useMemo } from 'react';
import { GraphicProject, GraphicProjectImage } from '../data/graphicProjects';

export interface ExtendedImage extends GraphicProjectImage {
  projectId: string;
  projectName: string;
}

export function useBentoLayout(projects: GraphicProject[], columnCount: number) {
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  // 1. Round-Robin Interleave images across projects to avoid same-project grouping
  const interleavedImages = useMemo(() => {
    const result: ExtendedImage[] = [];
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

  // 4. Shortest-Column Bin Packing Algorithm
  const columns = useMemo(() => {
    const numCols = Math.max(1, columnCount);
    const colHeights = new Array(numCols).fill(0);
    const cols: ExtendedImage[][] = Array.from({ length: numCols }, () => []);

    validImages.forEach((image) => {
      const ratio = aspectRatios[image.src] || 1; // Default to 1 (square) until loaded
      const heightFactor = 1 / ratio; // Higher value for tall/portrait images

      // Find the column with the minimum height
      let minColIndex = 0;
      let minHeight = colHeights[0];
      for (let i = 1; i < numCols; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i];
          minColIndex = i;
        }
      }

      // Add image to shortest column
      cols[minColIndex].push(image);
      colHeights[minColIndex] += heightFactor;
    });

    return cols;
  }, [validImages, aspectRatios, columnCount]);

  const handleImageError = (src: string) => {
    setBrokenImages((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  };

  return {
    allImages: validImages,
    columns,
    handleImageError,
  };
}
