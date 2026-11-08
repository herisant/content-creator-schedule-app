import React from 'react';
import { ViewMode } from '../types/content';
import { Calendar, LayoutGrid, Kanban, List, Clock, Sparkles, Plus } from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenCreate: () => void;
  onOpenAiStudio: () => void;
  postCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenCreate,
  onOpenAiStudio,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0c0e12]/95 backdrop-blur-md border-b border-neutral-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-neutral-950 font-bold text-sm shadow-sm">
            K
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onViewChange('calendar');
            }}
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
          >
            KarsaPost
          </a>
        </div>

        {/* Zone 2: Navigation Links (Views) */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800 shrink-0">
          <button
            onClick={() => onViewChange('calendar')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentView === 'calendar'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Kalender
          </button>

          <button
            onClick={() => onViewChange('weekly')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentView === 'weekly'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            Jadwal Jam
          </button>

          <button
            onClick={() => onViewChange('board')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentView === 'board'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-purple-400" />
            Papan Alur
          </button>

          <button
            onClick={() => onViewChange('feed')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentView === 'feed'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            Preview Feed
          </button>

          <button
            onClick={() => onViewChange('list')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentView === 'list'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <List className="w-3.5 h-3.5 text-neutral-400" />
            Daftar
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAiStudio}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-all whitespace-nowrap"
            title="Buka AI Ide & Hook Generator"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Studio</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Buat Konten</span>
          </button>
        </div>
      </div>
    </header>
  );
};
