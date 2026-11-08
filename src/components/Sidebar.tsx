import React from 'react';
import { ViewMode, Platform } from '../types/content';
import { PLATFORMS } from '../utils/constants';
import {
  Calendar,
  Clock,
  Kanban,
  LayoutGrid,
  List,
  Sparkles,
  TrendingUp,
  Plus,
  Compass,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenCreate: () => void;
  onOpenAiStudio: () => void;
  postCount: number;
  scheduledCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onOpenCreate,
  onOpenAiStudio,
  postCount,
  scheduledCount,
  isMobileOpen,
  onCloseMobile,
}) => {
  const mainNavItems = [
    {
      id: 'calendar' as ViewMode,
      label: 'Kalender Editorial',
      icon: Calendar,
      count: scheduledCount,
    },
    {
      id: 'weekly' as ViewMode,
      label: 'Jadwal Jam (Prime Time)',
      icon: Clock,
    },
    {
      id: 'board' as ViewMode,
      label: 'Papan Alur (Kanban)',
      icon: Kanban,
    },
    {
      id: 'feed' as ViewMode,
      label: 'Preview Feed (Visual)',
      icon: LayoutGrid,
    },
    {
      id: 'list' as ViewMode,
      label: 'Semua Konten (Tabel)',
      icon: List,
      count: postCount,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0c10] border-r border-neutral-800/80 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header & Primary Action */}
        <div className="p-4 space-y-4">
          {/* Brand Wordmark (Strict single-element title) */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-neutral-950 font-bold text-sm shadow-sm">
              K
            </div>
            <div className="min-w-0">
              <span className="text-base font-bold tracking-tight text-white block">
                KarsaPost
              </span>
              <span className="text-[11px] text-neutral-400 block -mt-0.5">
                Content Planner Studio
              </span>
            </div>
          </div>

          {/* Quick Create Button */}
          <button
            onClick={() => {
              onOpenCreate();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Jadwalkan Postingan</span>
          </button>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Section 1: Perencanaan Jadwal */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Perencanaan Jadwal
            </span>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-neutral-800/90 text-white shadow-sm border border-neutral-700/60'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="font-mono text-[11px] text-neutral-400 tabular-nums">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section 2: Creator Tools & AI */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Kreativitas & AI
            </span>
            <button
              onClick={() => {
                onOpenAiStudio();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-amber-300 hover:text-white hover:bg-neutral-900/60 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>AI Content Studio</span>
              </div>
              <span className="text-[10px] bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                Gemini
              </span>
            </button>
          </div>

          {/* Section 3: Platform Distribusi */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Platform Aktif
            </span>
            <div className="px-3 space-y-2 pt-1">
              {(Object.keys(PLATFORMS) as Platform[]).map((pKey) => {
                const p = PLATFORMS[pKey];
                return (
                  <div key={pKey} className="flex items-center justify-between text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: p.iconColor }}
                      />
                      <span>{p.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {p.bestHoursWeekday[1]} WIB
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: Creator Profile Card */}
        <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/60">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/70">
            <img
              src="/src/assets/images/avatar_creator_profile_1794135166065.jpg"
              alt="Creator Profile"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover shrink-0 border border-neutral-700"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Winda Heris</p>
              <p className="text-[10px] text-amber-400 truncate flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Creator Pro</span>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
