import React, { useState, useEffect, useMemo } from 'react';
import { ProjectItem } from '../../types/content';
import { servicesData } from '../../data/services';
import { serviceSlugToCategory, projectMatchesCategory } from '../../utils/categoryFilter';
import { fetchAllServicePins, saveServicePins } from '../../services/serviceFeaturedService';
import {
  Pin,
  GripVertical,
  X,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Save,
  Search,
  Plus,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

interface ServiceShowcasePanelProps {
  projects: ProjectItem[];
}

export const ServiceShowcasePanel: React.FC<ServiceShowcasePanelProps> = ({ projects }) => {
  const [activeSlug, setActiveSlug] = useState<string>('graphic-design');
  const [pinsMap, setPinsMap] = useState<Record<string, string[]>>({});
  const [pendingSlots, setPendingSlots] = useState<(string | null)[]>([null, null, null]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [draggedSlotIndex, setDraggedSlotIndex] = useState<number | null>(null);

  // Load existing pins from Supabase / localStorage on mount
  useEffect(() => {
    fetchAllServicePins().then((data) => {
      setPinsMap(data);
    });
  }, []);

  // Sync active service pins into pendingSlots when activeSlug or pinsMap changes
  useEffect(() => {
    const currentPins = pinsMap[activeSlug] || [];
    const slots: (string | null)[] = [
      currentPins[0] || null,
      currentPins[1] || null,
      currentPins[2] || null,
    ];
    setPendingSlots(slots);
    setSaveSuccess(false);
  }, [activeSlug, pinsMap]);

  const activeService = useMemo(() => {
    return servicesData.find((s) => s.slug === activeSlug) || servicesData[0];
  }, [activeSlug]);

  const activeCategory = useMemo(() => {
    return serviceSlugToCategory(activeSlug);
  }, [activeSlug]);

  // Projects matching active service category
  const categoryProjects = useMemo(() => {
    return projects.filter((p) => projectMatchesCategory(p, activeCategory));
  }, [projects, activeCategory]);

  // Filtered by search query
  const filteredAvailableProjects = useMemo(() => {
    if (!searchQuery.trim()) return categoryProjects;
    const q = searchQuery.toLowerCase();
    return categoryProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
    );
  }, [categoryProjects, searchQuery]);

  // Check if current pendingSlots differ from saved pins
  const isDirty = useMemo(() => {
    const saved = pinsMap[activeSlug] || [];
    const currentClean = pendingSlots.filter((id): id is string => id !== null);
    if (saved.length !== currentClean.length) return true;
    return saved.some((id, idx) => id !== currentClean[idx]);
  }, [pinsMap, activeSlug, pendingSlots]);

  const handlePinProject = (projectId: string, targetSlotIdx?: number) => {
    const newSlots = [...pendingSlots];
    
    // If project is already pinned in a slot, unpin it first
    const existingIdx = newSlots.indexOf(projectId);
    if (existingIdx !== -1) {
      newSlots[existingIdx] = null;
    }

    if (targetSlotIdx !== undefined && targetSlotIdx >= 0 && targetSlotIdx < 3) {
      newSlots[targetSlotIdx] = projectId;
    } else {
      // Find first empty slot
      const firstEmpty = newSlots.findIndex((s) => s === null);
      if (firstEmpty !== -1) {
        newSlots[firstEmpty] = projectId;
      } else {
        // If all full, replace slot 0
        newSlots[0] = projectId;
      }
    }
    setPendingSlots(newSlots);
    setSaveSuccess(false);
  };

  const handleUnpinSlot = (slotIdx: number) => {
    const newSlots = [...pendingSlots];
    newSlots[slotIdx] = null;
    setPendingSlots(newSlots);
    setSaveSuccess(false);
  };

  const handleClearAllSlots = () => {
    setPendingSlots([null, null, null]);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const cleanIds = pendingSlots.filter((id): id is string => id !== null);
    const res = await saveServicePins(activeSlug, cleanIds);
    setIsSaving(false);
    if (res.success) {
      setPinsMap((prev) => ({
        ...prev,
        [activeSlug]: cleanIds,
      }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(`Failed to save service showcase pins: ${res.error || 'Unknown error'}`);
    }
  };

  // Drag and Drop handlers
  const handleDragStartProject = (e: React.DragEvent, projectId: string) => {
    setDraggedProjectId(projectId);
    setDraggedSlotIndex(null);
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'project', id: projectId }));
  };

  const handleDragStartSlot = (e: React.DragEvent, slotIdx: number, projectId: string) => {
    setDraggedProjectId(projectId);
    setDraggedSlotIndex(slotIdx);
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'slot', fromIdx: slotIdx, id: projectId }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnSlot = (e: React.DragEvent, targetSlotIdx: number) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      const newSlots = [...pendingSlots];
      
      if (data.type === 'project') {
        // Dragged from pool
        const existingIdx = newSlots.indexOf(data.id);
        if (existingIdx !== -1) {
          // Swap or clear existing
          newSlots[existingIdx] = newSlots[targetSlotIdx];
        }
        newSlots[targetSlotIdx] = data.id;
      } else if (data.type === 'slot') {
        // Dragged from another slot
        const fromIdx = data.fromIdx;
        const temp = newSlots[targetSlotIdx];
        newSlots[targetSlotIdx] = newSlots[fromIdx];
        newSlots[fromIdx] = temp;
      }

      setPendingSlots(newSlots);
      setSaveSuccess(false);
    } catch (err) {
      console.error('Drop handling error:', err);
    } finally {
      setDraggedProjectId(null);
      setDraggedSlotIndex(null);
    }
  };

  return (
    <div className="bg-[#080b11] border border-sky-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Panel Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Pin className="w-3.5 h-3.5" />
            <span>Service Showcase Control</span>
          </div>
          <h2 className="font-neutralfacebold text-xl sm:text-2xl text-white uppercase tracking-tight">
            Pin Projects Per Service Page
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Choose exactly which 3 projects appear in the showcase section of each service page. Drag projects into the slots below.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          {isDirty && (
            <button
              onClick={() => {
                const saved = pinsMap[activeSlug] || [];
                setPendingSlots([saved[0] || null, saved[1] || null, saved[2] || null]);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard Changes</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className={`px-5 py-2.5 rounded-xl font-neutralfacebold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : isDirty
                ? 'gradient-bg text-white shadow-lg shadow-sky-500/25 hover:brightness-110'
                : 'bg-white/10 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved to Service Page!</span>
              </>
            ) : isSaving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Showcase</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Service Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {servicesData.map((s) => {
          const isSelected = s.slug === activeSlug;
          const currentPinsCount = (pinsMap[s.slug] || []).filter(Boolean).length;
          return (
            <button
              key={s.slug}
              onClick={() => setActiveSlug(s.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-neutralfacebold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-sky-500/20 border border-sky-400 text-sky-300 shadow-md shadow-sky-500/10'
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{s.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-sky-500/30 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                {currentPinsCount}/3 Pinned
              </span>
            </button>
          );
        })}
      </div>

      {/* Showcase Slots Section (3 Slots) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
              {activeService.title} — SHOWCASE SLOTS (MAX 3)
            </h3>
            <span className="text-[11px] text-gray-500">
              (Drag and drop to rearrange slots)
            </span>
          </div>

          {pendingSlots.some(Boolean) && (
            <button
              onClick={handleClearAllSlots}
              className="text-[11px] font-mono text-red-400 hover:text-red-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Clear Slots (Revert to Auto)</span>
            </button>
          )}
        </div>

        {/* 3 Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((slotIdx) => {
            const pinnedId = pendingSlots[slotIdx];
            const project = pinnedId ? projects.find((p) => p.id === pinnedId) : null;

            return (
              <div
                key={slotIdx}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, slotIdx)}
                draggable={!!project}
                onDragStart={(e) => project && handleDragStartSlot(e, slotIdx, project.id)}
                className={`relative min-h-[140px] rounded-2xl border-2 transition-all p-4 flex flex-col justify-between group ${
                  project
                    ? 'bg-[#0f1420] border-sky-500/50 hover:border-sky-400 shadow-lg shadow-sky-950/40 cursor-grab active:cursor-grabbing'
                    : 'bg-white/[0.02] border-dashed border-white/20 hover:border-sky-500/40 hover:bg-white/[0.04]'
                }`}
              >
                {/* Slot Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Pin className="w-3 h-3" />
                    Slot {slotIdx + 1}
                  </span>

                  {project && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <GripVertical className="w-3 h-3" />
                        Drag to reorder
                      </span>
                      <button
                        onClick={() => handleUnpinSlot(slotIdx)}
                        title="Remove from slot"
                        className="p-1 rounded-lg bg-white/10 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Slot Content */}
                {project ? (
                  <div className="flex items-center gap-3 mt-1">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-14 h-14 object-cover rounded-xl border border-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-500 text-xs font-mono shrink-0">
                        NO IMG
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-neutralfacebold text-xs text-white truncate group-hover:text-sky-300 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                          {project.category}
                        </span>
                        {project.isFeatured && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center my-auto py-4 text-center">
                    <p className="text-xs font-mono text-gray-500">Empty Slot {slotIdx + 1}</p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      Drag a project here or click "+ Pin" below
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Projects Pool for Active Category */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <span>Available {activeCategory} Projects</span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-[10px]">
                {filteredAvailableProjects.length} total
              </span>
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Showing projects matching category "{activeCategory}"
            </p>
          </div>

          {/* Search filter input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter category projects..."
              className="w-full bg-[#0c1017] border border-white/10 focus:border-sky-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Project Pool Grid */}
        {filteredAvailableProjects.length === 0 ? (
          <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-2xl">
            <Info className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No projects found for category "{activeCategory}".</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-sky-400 hover:underline font-mono"
              >
                Clear search filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAvailableProjects.map((p) => {
              const pinnedSlotIdx = pendingSlots.indexOf(p.id);
              const isPinned = pinnedSlotIdx !== -1;

              return (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStartProject(e, p.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                    isPinned
                      ? 'bg-sky-950/20 border-sky-500/40 opacity-90'
                      : 'bg-[#0c1017] border-white/10 hover:border-sky-500/40 hover:bg-white/[0.04] cursor-grab active:cursor-grabbing'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical className="w-4 h-4 text-gray-600 group-hover:text-sky-400 shrink-0" />
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-[10px] text-gray-500 font-mono shrink-0">
                        NO IMG
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-neutralfacebold text-xs text-white truncate group-hover:text-sky-300 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate">
                        {p.category}
                      </p>
                    </div>
                  </div>

                  {/* Pin action button */}
                  {isPinned ? (
                    <button
                      onClick={() => handleUnpinSlot(pinnedSlotIdx)}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 transition-colors shrink-0 cursor-pointer"
                    >
                      Slot {pinnedSlotIdx + 1} ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePinProject(p.id)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-sky-400 hover:bg-sky-500/20 text-gray-300 hover:text-sky-300 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Pin</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceShowcasePanel;
