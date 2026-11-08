import React from 'react';
import { ViewMode } from '../types/content';
import { Menu, Sparkles, Plus, ChevronRight } from 'lucide-react';

interface DashboardHeaderProps {
  currentView: ViewMode;
  onOpenMobileSidebar: () => void;
  onOpenCreate: () => void;
  onOpenAiStudio: () => void;
}

const VIEW_TITLES: Record<ViewMode, string> = {
  calendar: 'Kalender Editorial',
  weekly: 'Jadwal Jam (Prime Time)',
  board: 'Papan Alur Produksi',
  feed: 'Preview Feed (Visual)',
  list: 'Semua Konten (Tabel)',
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentView,
  onOpenMobileSidebar,
  onOpenCreate,
  onOpenAiStudio,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0c0e12]/95 backdrop-blur-md border-b border-neutral-800 px-6 py-3.5 shrink-0">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Contextual Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg lg:hidden transition-colors"
            title="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* SaaS Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-400 min-w-0">
            <span className="text-neutral-500 font-medium hidden sm:inline">Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600 hidden sm:inline" />
            <span className="text-neutral-400 font-medium">Content Planner</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-white font-semibold truncate">
              {VIEW_TITLES[currentView]}
            </span>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAiStudio}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 rounded-lg transition-all whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Studio</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Buat Konten</span>
          </button>
        </div>
      </div>
    </header>
  );
};
