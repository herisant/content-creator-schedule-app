import React from 'react';
import { FilterOptions, Platform, PostStatus, ContentPillar } from '../types/content';
import { PLATFORMS, CONTENT_PILLARS, STATUS_CONFIG } from '../utils/constants';
import { Search, Download, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onExportCsv: () => void;
  onResetFilters: () => void;
  stats: {
    total: number;
    scheduled: number;
    published: number;
    draft: number;
    idea: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onExportCsv,
  onResetFilters,
  stats,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.platform !== 'all' ||
    filters.status !== 'all' ||
    filters.pillar !== 'all';

  return (
    <div className="space-y-4">
      {/* Metrics Row: Tabular Numerals, Clean Typographic Separators */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-3 text-neutral-400">
          <span className="text-white font-medium">Ringkasan Jadwal:</span>
          <span>
            Total <strong className="font-mono text-white tabular-nums">{stats.total}</strong> konten
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span>
            <strong className="font-mono text-emerald-400 tabular-nums">{stats.scheduled}</strong> terjadwal
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span>
            <strong className="font-mono text-neutral-300 tabular-nums">{stats.published}</strong> sudah tayang
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span>
            <strong className="font-mono text-sky-400 tabular-nums">{stats.draft}</strong> produksi
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span>
            <strong className="font-mono text-amber-400 tabular-nums">{stats.idea}</strong> ide
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400 hover:text-white transition-colors"
              title="Reset semua filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Ekspor Kalender (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Cari judul, hook, atau #hashtag..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
          />
        </div>

        {/* Platform Selector */}
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1 overflow-x-auto max-w-full">
          <button
            onClick={() => onFilterChange({ ...filters, platform: 'all' })}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filters.platform === 'all'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Semua Platform
          </button>
          {(Object.keys(PLATFORMS) as Platform[]).map((pKey) => {
            const p = PLATFORMS[pKey];
            const isActive = filters.platform === pKey;
            return (
              <button
                key={pKey}
                onClick={() => onFilterChange({ ...filters, platform: pKey })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: p.iconColor }}
                />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Status Dropdown */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as PostStatus | 'all' })}
          className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
        >
          <option value="all">Semua Status</option>
          {(Object.keys(STATUS_CONFIG) as PostStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>

        {/* Pillar Dropdown */}
        <select
          value={filters.pillar}
          onChange={(e) => onFilterChange({ ...filters, pillar: e.target.value as ContentPillar | 'all' })}
          className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
        >
          <option value="all">Semua Pilar Konten</option>
          {CONTENT_PILLARS.map((pil) => (
            <option key={pil.name} value={pil.name}>
              {pil.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
