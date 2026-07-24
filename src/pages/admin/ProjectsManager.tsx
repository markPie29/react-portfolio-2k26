import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  ProjectFormData, 
  MAX_FILE_SIZE_BYTES,
  uploadProjectMedia
} from '../../services/projectService';
import { ProjectItem } from '../../types/content';
import { isSupabaseConfigured } from '../../lib/supabase';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Upload, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  Tag, 
  Sparkles,
  ListPlus,
  FileWarning,
  Film,
  Eye,
  LayoutGrid,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Video,
  Star
} from 'lucide-react';
import { 
  SiGithub, 
  SiReact, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiLaravel, 
  SiFirebase, 
  SiExpress, 
  SiSupabase, 
  SiUnity, 
  SiFigma, 
  SiFramer, 
  SiCanva 
} from 'react-icons/si';
import { CustomPhotoshop, CustomIllustrator, CustomCapcut } from '../../components/CustomIcons';
import SpotlightCard from '../../components/SpotlightCard';

type GalleryItem = { id: string; type: 'url'; value: string } | { id: string; type: 'file'; value: File };

const CATEGORIES = [
  'Software Development',
  'Graphic Design',
  'Video Editing',
  'Social Media Management',
  'Graphic Design & Video Editing',
  'Other Custom Category',
];

const getTechIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('react')) return <SiReact className="text-[#61DAFB]" />;
  if (lower.includes('next')) return <SiNextdotjs className="text-white" />;
  if (lower.includes('tailwind')) return <SiTailwindcss className="text-[#38BDF8]" />;
  if (lower.includes('laravel')) return <SiLaravel className="text-[#FF2D20]" />;
  if (lower.includes('firebase')) return <SiFirebase className="text-[#FFCA28]" />;
  if (lower.includes('express')) return <SiExpress className="text-gray-300" />;
  if (lower.includes('supabase')) return <SiSupabase className="text-[#3ECF8E]" />;
  if (lower.includes('unity')) return <SiUnity className="text-white text-xs" />;
  if (lower.includes('figma')) return <SiFigma className="text-[#F24E1E]" />;
  if (lower.includes('framer')) return <SiFramer className="text-[#0055FF]" />;
  if (lower.includes('canva')) return <SiCanva className="text-[#00C4CC]" />;
  if (lower.includes('photoshop')) return <CustomPhotoshop className="w-3.5 h-3.5" />;
  if (lower.includes('illustrator')) return <CustomIllustrator className="w-3.5 h-3.5" />;
  if (lower.includes('capcut')) return <CustomCapcut className="w-3.5 h-3.5" />;
  if (lower.includes('premiere')) return <Film className="w-3.5 h-3.5 text-[#9999FF]" />;
  if (lower.includes('after effects')) return <Video className="w-3.5 h-3.5 text-[#9999FF]" />;
  return null;
};

const isVideoUrl = (url: string) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.ogg') ||
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('vimeo.com')
  );
};

/* --- 1:1 Live Portfolio Card Preview Component --- */
const ProjectCardImagePreview: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [project.image]);

  if (!project.image || imageError) {
    return (
      <div className="w-full h-full bg-[#0d111a] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden border border-white/5">
        <div className="p-3 rounded-2xl bg-white/5 text-sky-400 mb-2 border border-white/10 shadow-md">
          <ImageOff size={24} />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-sans">
          Preview Coming Soon
        </span>
      </div>
    );
  }

  return (
    <>
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 opacity-90 group-hover/card:opacity-100 filter grayscale group-hover/card:grayscale-0"
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-neutralfacebold text-xs uppercase tracking-widest backdrop-blur-[2px]">
        <span>View Project</span>
        <ExternalLink size={14} className="text-sky-400" />
      </div>
    </>
  );
};

const ProjectCardPreview: React.FC<{ project: ProjectItem; onClickDetail?: () => void }> = ({ project, onClickDetail }) => {
  return (
    <div 
      onClick={onClickDetail}
      className="group/card cursor-pointer w-full max-w-sm mx-auto"
    >
      <SpotlightCard
        className="flex flex-col justify-between rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300 w-full border border-white/10 hover:border-sky-400/50 bg-[#090c13]"
        spotlightColor="rgba(72, 202, 228, 0.12)"
      >
        <div className="flex flex-col w-full h-full">
          {/* Project Thumbnail */}
          <div className="w-full aspect-[16/10] bg-[#05070c] rounded-2xl relative overflow-hidden mb-5 border border-white/5 flex items-center justify-center">
            <ProjectCardImagePreview project={project} />
          </div>

          {/* Category Subtitle */}
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-1.5 block font-sans">
            {project.category || 'General'}
          </span>

          {/* Project Title */}
          <h3 className="font-neutralfacebold text-lg sm:text-xl text-white uppercase tracking-wide leading-snug mb-2 group-hover/card:text-sky-400 transition-colors">
            {project.title || 'Project Title Preview'}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed mb-6 line-clamp-3">
            {project.description || 'Short project description preview will appear here...'}
          </p>

          {/* Tech Stack Pills */}
          <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-2">
            {project.techStack.map((tech, tIdx) => {
              const icon = getTechIcon(tech);
              return (
                <span
                  key={tIdx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300"
                >
                  {icon && <span className="text-xs">{icon}</span>}
                  <span>{tech}</span>
                </span>
              );
            })}
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

/* --- 1:1 Live Portfolio Detail Modal Preview Component --- */
const ProjectDetailPreview: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);

  const mediaList = useMemo(() => {
    const items: { type: 'image' | 'video'; url: string }[] = [];
    if (project.videoUrl) {
      items.push({ type: 'video', url: project.videoUrl });
    }
    const rawImages = project.images && project.images.length > 0
      ? project.images
      : project.image
      ? [project.image]
      : [];

    rawImages.forEach((url) => {
      if (url && !items.some((item) => item.url === url)) {
        if (isVideoUrl(url)) {
          items.push({ type: 'video', url });
        } else {
          items.push({ type: 'image', url });
        }
      }
    });

    return items;
  }, [project]);

  useEffect(() => {
    setCurrentMediaIndex(0);
    setMediaError(false);
  }, [project]);

  useEffect(() => {
    setMediaError(false);
  }, [currentMediaIndex]);

  const currentMedia = mediaList[currentMediaIndex];

  return (
    <div className="w-full bg-[#0c0f17] border border-white/10 rounded-3xl shadow-2xl flex flex-col text-white overflow-hidden my-auto max-h-[80vh]">
      {/* Top Blue Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#48cae4] shadow-[0_0_12px_rgba(72,202,228,0.7)] flex-shrink-0" />

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-[#0c0f17]/95 flex-shrink-0 z-20">
        <div>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sky-400 mb-0.5 block">
            {project.category || 'Category Preview'}
          </span>
          <h2 className="font-neutralfacebold text-lg sm:text-xl uppercase tracking-wide leading-tight text-white">
            {project.title || 'Project Title'}
          </h2>
          {project.role && (
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
              Role: <span className="text-gray-300">{project.role}</span>
            </p>
          )}
        </div>
        <div className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-wider">
          Portfolio Modal View
        </div>
      </div>

      {/* Split View Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-white/10 min-h-0">
        {/* LEFT COLUMN: Media Section */}
        <div className="lg:col-span-7 flex flex-col p-4 sm:p-5 bg-[#06080e] min-h-[280px] justify-between overflow-hidden relative">
          <div className="relative w-full flex-1 min-h-[200px] bg-black/90 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center group shadow-xl">
            {mediaList.length > 0 && !mediaError && currentMedia ? (
              <>
                {currentMedia.type === 'image' && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-2xl scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${currentMedia.url})` }}
                  />
                )}
                <div className="w-full h-full flex items-center justify-center p-2 relative z-10">
                  {currentMedia.type === 'video' ? (
                    <video
                      src={currentMedia.url}
                      controls
                      autoPlay
                      muted
                      loop
                      className="w-full h-full max-h-[260px] max-w-full object-contain rounded-lg shadow-xl"
                      onError={() => setMediaError(true)}
                    />
                  ) : (
                    <img
                      src={currentMedia.url}
                      alt={project.title}
                      className="w-full h-full max-h-[260px] max-w-full object-contain rounded-lg shadow-xl"
                      onError={() => setMediaError(true)}
                    />
                  )}
                </div>

                {/* Navigation Arrows */}
                {mediaList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentMediaIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/75 hover:bg-black/95 text-white transition-all cursor-pointer shadow-lg border border-white/10"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentMediaIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/75 hover:bg-black/95 text-white transition-all cursor-pointer shadow-lg border border-white/10"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 right-3 z-20 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-white text-[11px] font-bold tracking-wider flex items-center gap-1.5">
                      {currentMedia.type === 'video' && <Film size={12} className="text-sky-400" />}
                      <span>{currentMediaIndex + 1} / {mediaList.length}</span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-sky-400">
                  <ImageOff size={28} />
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-sky-400/10 text-sky-400 border border-sky-400/20 mb-1">
                  No Media Uploaded
                </span>
                <p className="text-xs text-gray-400 font-sans">
                  Upload cover images or gallery media to preview them here.
                </p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {mediaList.length > 1 && !mediaError && (
            <div className="flex items-center gap-2.5 overflow-x-auto pt-3 pb-1 modal-scrollbar">
              {mediaList.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCurrentMediaIndex(idx)}
                  className={`relative w-16 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer bg-black ${
                    idx === currentMediaIndex
                      ? 'border-sky-400 shadow-md scale-105 ring-2 ring-sky-400/30'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                      <Film size={14} className="text-white" />
                    </div>
                  ) : (
                    <img src={item.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Details Panel */}
        <div className="lg:col-span-5 flex flex-col p-5 sm:p-6 overflow-y-auto modal-scrollbar bg-[#0c0f17] gap-5 max-h-[450px]">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-1.5">
              Project Overview
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line font-sans">
              {project.longDescription || project.description || 'Project description overview...'}
            </p>
          </div>

          {project.features && project.features.length > 0 && (
            <div className="pt-3 border-t border-white/10">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-2.5">
                Key Features & Highlights
              </h3>
              <ul className="flex flex-col gap-2">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="text-xs text-gray-300 flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5 font-sans">
                    <CheckCircle2 size={15} className="text-sky-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.techStack && project.techStack.length > 0 && (
            <div className="pt-3 border-t border-white/10">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-2.5">
                Technologies & Tools
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-gray-200 border border-white/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap items-center gap-2.5 pt-4 mt-auto border-t border-white/10">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 gradient-bg text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                  <span>Live Preview</span>
                  <ExternalLink size={13} />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                  <SiGithub size={13} />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // View Mode State inside Edit/Add Modal
  const [modalViewMode, setModalViewMode] = useState<'form' | 'split' | 'card' | 'modal'>('split');
  const [splitPreviewTab, setSplitPreviewTab] = useState<'card' | 'modal'>('card');

  // Form Fields State
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Software Development');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [longDescription, setLongDescription] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [techStackInput, setTechStackInput] = useState<string>('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState<string>('');
  const [features, setFeatures] = useState<string[]>([]);
  const [liveUrl, setLiveUrl] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  // Files State & Size Alerts
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [fileSizeWarning, setFileSizeWarning] = useState<string | null>(null);
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState<string>('');

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const modalScrollRef = useRef<HTMLFormElement>(null);

  const loadProjectsData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsData();
  }, []);

  // Prevent main page scroll when modal is open + ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (deleteTarget) setDeleteTarget(null);
      }
    };

    if (isModalOpen || deleteTarget) {
      document.body.style.overflow = 'hidden';
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, deleteTarget]);

  // Show temporary toast message
  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setCategory('Software Development');
    setCustomCategory('');
    setDescription('');
    setLongDescription('');
    setRole('');
    setTechStack(['React', 'Tailwind CSS']);
    setFeatures([]);
    setLiveUrl('');
    setGithubUrl('');
    setCoverUrl('');
    setGalleryItems([]);
    setVideoUrl('');
    setDisplayOrder(projects.length + 1);
    setIsFeatured(false);
    setCoverFile(null);
    setFileSizeWarning(null);
    setModalViewMode('split');
    setSplitPreviewTab('card');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (project: ProjectItem) => {
    setEditingProject(project);
    setTitle(project.title);

    if (CATEGORIES.includes(project.category)) {
      setCategory(project.category);
      setCustomCategory('');
    } else {
      setCategory('Other Custom Category');
      setCustomCategory(project.category);
    }

    setDescription(project.description);
    setLongDescription(project.longDescription || '');
    setRole(project.role || '');
    setTechStack(project.techStack || []);
    setFeatures(project.features || []);
    const cover = project.image || '';
    setCoverUrl(cover);
    const rawGallery = (project.images || []).filter((url) => !cover || url !== cover);
    setGalleryItems(rawGallery.map((url) => ({ id: Math.random().toString(36).substring(7), type: 'url', value: url })));
    setVideoUrl(project.videoUrl || '');
    setDisplayOrder(0);
    setIsFeatured(project.isFeatured ?? false);
    setCoverFile(null);
    setFileSizeWarning(null);
    setModalViewMode('split');
    setSplitPreviewTab('card');
    setIsModalOpen(true);
  };

  // Construct Dynamic 1:1 Preview Object
  const previewProject: ProjectItem = useMemo(() => {
    const finalCategory = category === 'Other Custom Category' ? customCategory.trim() || 'General' : category;

    let coverImg = coverUrl.trim() || undefined;
    if (coverFile) {
      try {
        coverImg = URL.createObjectURL(coverFile);
      } catch (e) {
        coverImg = coverUrl;
      }
    }

    const mappedGalleryUrls = galleryItems
      .map((item) => {
        if (item.type === 'url') return item.value;
        try {
          return URL.createObjectURL(item.value);
        } catch (e) {
          return '';
        }
      })
      .filter(Boolean);

    const allImages = mappedGalleryUrls;

    return {
      id: editingProject ? editingProject.id : 'preview-id',
      title: title.trim() || 'Project Title Preview',
      category: finalCategory,
      description: description.trim() || 'Short project description preview will appear here...',
      longDescription: longDescription.trim() || undefined,
      role: role.trim() || undefined,
      techStack: techStack.length > 0 ? techStack : ['React', 'Tailwind CSS'],
      features: features,
      image: coverImg,
      images: allImages,
      videoUrl: videoUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      isFeatured: isFeatured,
    };
  }, [
    editingProject,
    title,
    category,
    customCategory,
    description,
    longDescription,
    role,
    techStack,
    features,
    coverUrl,
    coverFile,
    galleryItems,
    videoUrl,
    liveUrl,
    githubUrl,
    isFeatured,
  ]);

  // Add Tech Tag
  const handleAddTechTag = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const trimmed = techStackInput.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack((prev) => [...prev, trimmed]);
      setTechStackInput('');
    }
  };

  // Remove Tech Tag
  const handleRemoveTechTag = (tagToRemove: string) => {
    setTechStack((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Add Feature
  const handleAddFeature = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const trimmed = featureInput.trim();
    if (trimmed) {
      setFeatures((prev) => [...prev, trimmed]);
      setFeatureInput('');
    }
  };

  // Remove Feature
  const handleRemoveFeature = (idx: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  // Add Gallery URL manually
  const handleAddGalleryUrl = () => {
    const trimmed = newGalleryUrlInput.trim();
    if (trimmed && !galleryItems.some(i => i.type === 'url' && i.value === trimmed)) {
      setGalleryItems((prev) => [...prev, { id: Math.random().toString(36).substring(7), type: 'url', value: trimmed }]);
      setNewGalleryUrlInput('');
    }
  };

  // Remove Gallery URL
  const handleRemoveGalleryItem = (idToRemove: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  // Handle Cover File Selection
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSizeWarning(
        `File "${file.name}" is ${sizeMb}MB (exceeds the 50MB Supabase Storage limit).\n💡 Suggestion: Place this file in /public/assets/projects/ and enter "/assets/projects/${file.name}" in the Cover Image URL field below instead!`
      );
      return;
    }

    setFileSizeWarning(null);
    setCoverFile(file);
  };

  // Handle Gallery Files Selection
  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const oversizedFiles = files.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (oversizedFiles.length > 0) {
      const oversizedNames = oversizedFiles.map((f) => `${f.name} (${(f.size / (1024 * 1024)).toFixed(1)}MB)`).join(', ');
      setFileSizeWarning(
        `The following file(s) exceed 50MB: ${oversizedNames}.\n💡 Suggestion: Place large videos/images in /public/assets/projects/ and enter their path (e.g. /assets/projects/filename.mp4) using the "Add URL / Local Asset Path" input!`
      );
      return;
    }

    setFileSizeWarning(null);
    setGalleryItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: Math.random().toString(36).substring(7),
        type: 'file' as const,
        value: file,
      })),
    ]);
  };

  // Handle Save / Submit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('error', 'Project Name / Title is required.');
      return;
    }
    if (!description.trim()) {
      showToast('error', 'Project Short Description is required.');
      return;
    }

    const finalCategory = category === 'Other Custom Category' ? customCategory.trim() || 'General' : category;

    setIsSubmitting(true);

    try {
      // Handle galleryItems upload preserving order
      const finalGalleryUrls: string[] = [];
      for (const item of galleryItems) {
        if (item.type === 'file' && isSupabaseConfigured) {
          const url = await uploadProjectMedia(item.value);
          finalGalleryUrls.push(url);
        } else if (item.type === 'url') {
          finalGalleryUrls.push(item.value);
        }
      }

      const formData: ProjectFormData = {
        title: title.trim(),
        category: finalCategory,
        description: description.trim(),
        longDescription: longDescription.trim() || undefined,
        role: role.trim() || undefined,
        techStack,
        features,
        image: coverUrl.trim() || undefined,
        images: finalGalleryUrls,
        videoUrl: videoUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        displayOrder,
        isFeatured,
      };

      if (editingProject) {
        const res = await updateProject(editingProject.id, formData, coverFile, []);
        if (res.success && res.project) {
          const updated = res.project;
          setProjects((prev) =>
            prev.map((p) => (p.id === editingProject.id ? updated : p))
          );
          showToast('success', `Project "${updated.title}" updated successfully!`);
          setIsModalOpen(false);
          await loadProjectsData();
        } else {
          showToast('error', res.error || 'Failed to update project.');
        }
      } else {
        const res = await createProject(formData, coverFile, []);
        if (res.success && res.project) {
          showToast('success', `Project "${res.project.title}" created successfully!`);
          setIsModalOpen(false);
          await loadProjectsData();
        } else {
          showToast('error', res.error || 'Failed to create project.');
        }
      }
    } catch (err: any) {
      showToast('error', err?.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Featured status directly from card
  const handleToggleFeatured = async (project: ProjectItem) => {
    const updatedStatus = !project.isFeatured;
    const formData: ProjectFormData = {
      title: project.title,
      category: project.category,
      description: project.description,
      longDescription: project.longDescription,
      role: project.role,
      techStack: project.techStack,
      features: project.features,
      image: project.image,
      images: project.images,
      videoUrl: project.videoUrl,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      href: project.href,
      isFeatured: updatedStatus,
    };
    const res = await updateProject(project.id, formData);
    if (res.success && res.project) {
      showToast('success', `Project "${project.title}" ${updatedStatus ? 'featured on homepage' : 'removed from featured works'}!`);
      await loadProjectsData();
    } else {
      showToast('error', res.error || 'Failed to update feature status.');
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const targetId = deleteTarget.id;
    const targetTitle = deleteTarget.title;

    setIsSubmitting(true);
    try {
      const res = await deleteProject(targetId);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== targetId));
        showToast('success', `Project "${targetTitle}" deleted.`);
        setDeleteTarget(null);
        await loadProjectsData();
      } else {
        showToast('error', res.error || 'Failed to delete project.');
      }
    } catch (err: any) {
      showToast('error', err?.message || 'Delete operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;

      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTech = p.techStack.some((t) => t.toLowerCase().includes(q));

      return matchCat && (matchTitle || matchDesc || matchTech);
    });
  }, [projects, selectedCategory, searchQuery]);

  // Render Editor Form Fields
  const renderFormFields = () => (
    <div className="space-y-6">
      {/* 1. General Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-sky-400">
          <Tag className="w-4 h-4" />
          <h3 className="font-neutralfacebold text-xs uppercase tracking-wider text-white">
            1. General Specifications
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. URSAC Hub 2.0"
              className="w-full px-4 py-2.5 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
              Classification / Category <span className="text-red-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-sky-500 transition-colors cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {category === 'Other Custom Category' && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
              Custom Classification Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. Augmented Reality / Motion Graphics"
              className="w-full px-4 py-2.5 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
              Your Role / Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Lead Developer & Designer"
              className="w-full px-4 py-2.5 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
              Display Order Index
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">Feature on Homepage</h4>
              <p className="text-[11px] text-amber-300/70">Enable this to highlight this project under "Featured Works" on the homepage.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
            Short Description (Card View) <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A concise overview of the project shown on project cards."
            className="w-full px-4 py-2.5 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors resize-y"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
            Detailed Overview (Modal View)
          </label>
          <textarea
            rows={3}
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            placeholder="In-depth breakdown, architecture, solution details..."
            className="w-full px-4 py-2.5 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
              Live Preview URL
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://myproject.com"
              className="w-full px-4 py-2.5 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
              GitHub Repository URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full px-4 py-2.5 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 2. Media Assets & Tech Stack */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-sky-400">
          <Sparkles className="w-4 h-4" />
          <h3 className="font-neutralfacebold text-xs uppercase tracking-wider text-white">
            2. Media Assets & Tech Stack
          </h3>
        </div>

        {/* Media Box */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
          {/* Cover Asset */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
              Cover Image Asset
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="file"
                ref={coverFileInputRef}
                onChange={handleCoverFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="px-3.5 py-2 bg-sky-500/15 border border-sky-500/30 hover:bg-sky-500/25 text-sky-400 text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{coverFile ? coverFile.name : 'Upload File'}</span>
              </button>
              <div className="text-[10px] text-gray-500 text-center font-bold uppercase">OR</div>
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="Direct URL or Path (e.g. /assets/projects/ursac.jpg)"
                className="flex-1 px-3.5 py-2 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Gallery Assets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
              Gallery & Video Assets
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="file"
                ref={galleryFileInputRef}
                onChange={handleGalleryFilesChange}
                multiple
                accept="image/*,video/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryFileInputRef.current?.click()}
                className="px-3.5 py-2 bg-white/10 border border-white/15 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Upload Files</span>
              </button>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={newGalleryUrlInput}
                  onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                  placeholder="Path or URL (e.g. /assets/projects/video.mp4)"
                  className="flex-1 px-3 py-2 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Add
                </button>
              </div>
            </div>

            {galleryItems.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Attached Assets ({galleryItems.length}) - Drag to reorder:
                </span>
                <div className="flex flex-wrap gap-2.5 max-h-36 overflow-y-auto modal-scrollbar p-1">
                  {galleryItems.map((item, idx) => {
                    let mediaUrl = '';
                    let isVideo = false;

                    if (item.type === 'url') {
                      mediaUrl = item.value;
                      isVideo = isVideoUrl(item.value);
                    } else {
                      try {
                        mediaUrl = URL.createObjectURL(item.value);
                      } catch (e) {
                        mediaUrl = '';
                      }
                      isVideo = item.value.type.startsWith('video/');
                    }

                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', idx.toString());
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const draggedIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
                          if (isNaN(draggedIdx) || draggedIdx === idx) return;

                          setGalleryItems((prev) => {
                            const newItems = [...prev];
                            const [draggedItem] = newItems.splice(draggedIdx, 1);
                            newItems.splice(idx, 0, draggedItem);
                            return newItems;
                          });
                        }}
                        className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/15 bg-black/60 cursor-move flex-shrink-0 shadow-md hover:border-sky-400 transition-all"
                      >
                        {isVideo ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/80 p-1 text-center">
                            <Film className="w-6 h-6 text-sky-400 mb-1" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-300">Video</span>
                          </div>
                        ) : (
                          <img
                            src={mediaUrl}
                            alt={`Gallery asset ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}

                        {/* Order Badge */}
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white leading-none pointer-events-none">
                          {idx + 1}
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryItem(item.id)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-red-500 text-white transition-colors cursor-pointer"
                          title="Remove asset"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
            <span>Tech Stack & Tools</span>
            <span className="text-gray-500 text-[10px] font-normal">Press Enter to add tag</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                onKeyDown={handleAddTechTag}
                placeholder="e.g. React, Next.js, Premiere Pro, Figma"
                className="w-full pl-9 pr-4 py-2 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={handleAddTechTag}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Add Tag
            </button>
          </div>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto modal-scrollbar">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 border border-sky-500/25 rounded-full text-xs font-semibold text-sky-300"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTechTag(tech)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Features Bullets */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
            <span>Key Highlights & Features</span>
            <span className="text-gray-500 text-[10px] font-normal">Press Enter to add bullet</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <ListPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={handleAddFeature}
                placeholder="e.g. Real-time post feed with image attachments"
                className="w-full pl-9 pr-4 py-2 bg-[#05070c] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Add Bullet
            </button>
          </div>
          {features.length > 0 && (
            <ul className="space-y-1.5 pt-1 max-h-32 overflow-y-auto modal-scrollbar">
              {features.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-xl text-xs text-gray-200"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{feat}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 text-gray-100 pb-12">
      {/* Banner / Header */}
      <div className="p-6 bg-gradient-to-r from-sky-950/40 via-cyan-950/20 to-transparent border border-sky-500/20 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Portfolio Projects</span>
          </div>
          <h1 className="font-neutralfacebold text-2xl uppercase tracking-tight text-white">
            Project Showcase Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Add, edit, upload media, or reorder projects displayed on your portfolio website.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 rounded-xl gradient-bg hover:brightness-110 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-500/25 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Local Fallback Warning if unconfigured */}
      {!isSupabaseConfigured && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            Supabase environment variables are missing. Operating in <strong>Local Offline Mode</strong>. Changes will persist in local state.
          </span>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-[10000] px-5 py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 border backdrop-blur-md transition-all animate-bounce ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/90 border-red-500/40 text-red-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, description, tech stack..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#080b12] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-sky-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 modal-scrollbar">
          {['ALL', ...CATEGORIES.filter((c) => c !== 'Other Custom Category')].map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/20 border border-sky-500/50 text-sky-300'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid Display */}
      {isLoading ? (
        <div className="py-20 text-center text-gray-500 text-xs uppercase tracking-widest font-mono">
          Loading project showcase data...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-[#080b12] border border-white/10 rounded-3xl space-y-3">
          <FolderKanban className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="font-neutralfacebold text-base uppercase text-white">No Projects Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto font-sans">
            No projects matched your criteria. Try resetting search filters or click "Add New Project" above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#090c13] border border-white/10 hover:border-sky-500/40 rounded-3xl overflow-hidden shadow-xl flex flex-col transition-all group"
            >
              {/* Card Header Media Preview */}
              <div className="h-48 bg-[#05070c] relative overflow-hidden flex items-center justify-center border-b border-white/5">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-gray-600">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">No Cover Image</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-sky-400 text-[10px] font-bold uppercase tracking-wider">
                  {project.category}
                </div>
                {project.isFeatured && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-neutralfacebold text-base text-white uppercase tracking-wide group-hover:text-sky-400 transition-colors">
                    {project.title}
                  </h3>

                  {project.role && (
                    <span className="text-[11px] text-gray-400 font-semibold block">
                      Role: <span className="text-gray-300">{project.role}</span>
                    </span>
                  )}

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 font-sans">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-semibold text-gray-300 uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Live Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="GitHub Repo"
                      >
                        <SiGithub className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`p-1.5 rounded-lg border transition-colors text-xs cursor-pointer ${
                        project.isFeatured 
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-amber-300 hover:bg-white/10'
                      }`}
                      title={project.isFeatured ? "Unfeature project" : "Feature project"}
                    >
                      <Star className={`w-4 h-4 ${project.isFeatured ? 'fill-amber-300 text-amber-300' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(project)}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:bg-sky-500/25 transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteTarget(project)}
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-xs cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- REDESIGNED CREATE / EDIT PROJECT MODAL WITH LIVE PORTFOLIO PREVIEW --- */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden pointer-events-auto">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Landscape Modal Window Container */}
            <div
              className={`relative z-10 w-full transition-all duration-300 bg-[#0c0f17] border border-white/15 rounded-3xl shadow-2xl flex flex-col text-gray-100 outline-none overflow-hidden my-auto ${
                modalViewMode === 'split'
                  ? 'max-w-[96vw] xl:max-w-7xl h-[92vh]'
                  : modalViewMode === 'card'
                  ? 'max-w-4xl max-h-[90vh]'
                  : modalViewMode === 'modal'
                  ? 'max-w-6xl max-h-[92vh]'
                  : 'max-w-5xl max-h-[90vh]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Blue Accent Scroll Line */}
              <div className="h-1 w-full bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#48cae4] shadow-[0_0_12px_rgba(72,202,228,0.7)] flex-shrink-0" />

              {/* Fixed Header with View Mode Switcher */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#080a0f] flex-shrink-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-neutralfacebold text-base sm:text-lg text-white uppercase tracking-tight">
                      {editingProject ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <span className="text-[11px] text-gray-400 block font-mono">
                      {editingProject ? `ID: ${editingProject.id}` : 'Fill in project specs & watch 1:1 live preview update'}
                    </span>
                  </div>
                </div>

                {/* View Mode Segmented Control Bar */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                  <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setModalViewMode('form')}
                      className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        modalViewMode === 'form'
                          ? 'bg-sky-500 text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Form</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalViewMode('split')}
                      className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        modalViewMode === 'split'
                          ? 'bg-sky-500 text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Split Live</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalViewMode('card')}
                      className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        modalViewMode === 'card'
                          ? 'bg-sky-500 text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Card Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalViewMode('modal')}
                      className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        modalViewMode === 'modal'
                          ? 'bg-sky-500 text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Modal Preview</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer shrink-0"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Modal Body Form Wrapper */}
              <form
                onSubmit={handleSubmitForm}
                className="flex-1 overflow-y-auto modal-scrollbar p-4 sm:p-6 flex flex-col min-h-0"
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                ref={modalScrollRef}
              >
                {/* File Size Warning */}
                {fileSizeWarning && (
                  <div className="p-4 mb-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <FileWarning className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Supabase Storage 50MB Limit Exceeded</span>
                    </div>
                    <p className="whitespace-pre-line leading-relaxed text-[11.5px] font-sans">
                      {fileSizeWarning}
                    </p>
                  </div>
                )}

                {/* --- VIEW MODE 1: SPLIT VIEW (Form on Left + Live Preview on Right) --- */}
                {modalViewMode === 'split' && (
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 items-start">
                    {/* Left Column: Form Editor */}
                    <div className="lg:col-span-6 overflow-y-auto modal-scrollbar pr-1 max-h-full">
                      {renderFormFields()}
                    </div>

                    {/* Right Column: Live Portfolio Preview Panel */}
                    <div className="lg:col-span-6 bg-[#07090e] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 sticky top-0 max-h-full overflow-y-auto modal-scrollbar">
                      {/* Sub-bar for Preview Switching */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                            Live Portfolio Preview
                          </span>
                        </div>

                        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                          <button
                            type="button"
                            onClick={() => setSplitPreviewTab('card')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              splitPreviewTab === 'card'
                                ? 'bg-sky-500 text-white shadow'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            Card View
                          </button>
                          <button
                            type="button"
                            onClick={() => setSplitPreviewTab('modal')}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              splitPreviewTab === 'modal'
                                ? 'bg-sky-500 text-white shadow'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            Detail Modal View
                          </button>
                        </div>
                      </div>

                      {/* Render Active Preview Component */}
                      <div className="flex-1 flex items-center justify-center min-h-[350px]">
                        {splitPreviewTab === 'card' ? (
                          <div className="w-full py-4">
                            <p className="text-[11px] text-gray-400 text-center mb-3 font-mono">
                              How this project card appears in the main Portfolio 3-column grid:
                            </p>
                            <ProjectCardPreview project={previewProject} />
                          </div>
                        ) : (
                          <div className="w-full">
                            <ProjectDetailPreview project={previewProject} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- VIEW MODE 2: FORM ONLY --- */}
                {modalViewMode === 'form' && (
                  <div className="max-w-4xl mx-auto w-full">
                    {renderFormFields()}
                  </div>
                )}

                {/* --- VIEW MODE 3: CARD PREVIEW ONLY --- */}
                {modalViewMode === 'card' && (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#07090e] border border-white/10 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2 font-mono">
                      Main Projects Page Card Grid Replica
                    </span>
                    <p className="text-xs text-gray-400 text-center max-w-md mb-6 font-sans">
                      This is the exact layout, hover interaction, and typography used on your portfolio's main Projects section.
                    </p>
                    <ProjectCardPreview project={previewProject} />
                  </div>
                )}

                {/* --- VIEW MODE 4: DETAIL MODAL PREVIEW ONLY --- */}
                {modalViewMode === 'modal' && (
                  <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#07090e] border border-white/10 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-3 font-mono">
                      Full Widescreen Landscape Project Detail Modal Replica
                    </span>
                    <ProjectDetailPreview project={previewProject} />
                  </div>
                )}

                {/* Sticky Action Footer */}
                <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between gap-4 bg-[#0c0f17] sticky bottom-0 py-2 z-20">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Real-time preview synchronized</span>
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl gradient-bg hover:brightness-110 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{editingProject ? 'Save Changes' : 'Publish Project'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>,
          document.body
        )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0c1017] border border-red-500/30 rounded-3xl p-6 space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="font-neutralfacebold text-lg uppercase text-white">Delete Project?</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Are you sure you want to delete <strong className="text-white">"{deleteTarget.title}"</strong>? This action will remove the record from your Supabase database.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ProjectsManager;
