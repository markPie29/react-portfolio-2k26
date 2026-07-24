export interface GraphicProjectImage {
  src: string;
  alt: string;
}

export interface GraphicProject {
  id: string;
  name: string;
  images: GraphicProjectImage[];
}

// Dynamically discover all existing graphics images in /public/graphics/
const graphicsModules = import.meta.glob<string>('/public/graphics/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG}', {
  eager: true,
  query: '?url',
  import: 'default',
});

function formatProjectName(folderName: string): string {
  return folderName
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function buildGraphicProjects(): GraphicProject[] {
  const projectsMap: Record<string, GraphicProjectImage[]> = {};

  Object.keys(graphicsModules).forEach((filePath) => {
    // filePath is like "/public/graphics/access pubmats/1.png"
    const relativePath = filePath.replace('/public', ''); // "/graphics/access pubmats/1.png"
    const parts = relativePath.split('/');
    if (parts.length < 4) return; // Expecting ["", "graphics", "folderName", "fileName"]

    const folderName = parts[2];
    const fileName = parts[3];

    if (!projectsMap[folderName]) {
      projectsMap[folderName] = [];
    }

    const cleanName = fileName.replace(/\.[^/.]+$/, '');
    projectsMap[folderName].push({
      src: relativePath,
      alt: `${formatProjectName(folderName)} - ${cleanName}`,
    });
  });

  return Object.entries(projectsMap)
    .filter(([_, images]) => images.length > 0)
    .map(([folderName, images]) => ({
      id: folderName.toLowerCase().replace(/\s+/g, '-'),
      name: formatProjectName(folderName),
      images: images.sort((a, b) =>
        a.src.localeCompare(b.src, undefined, { numeric: true, sensitivity: 'base' })
      ),
    }));
}

export const graphicProjects: GraphicProject[] = buildGraphicProjects();
