import React from 'react';
import { Post, Platform } from '../types/content';
import { PLATFORMS, CONTENT_PILLARS } from '../utils/constants';
import { Clock, TrendingUp, Sparkles, Award, Zap } from 'lucide-react';

interface PostingTimeInsightsProps {
  posts: Post[];
}

export const PostingTimeInsights: React.FC<PostingTimeInsightsProps> = ({ posts }) => {
  // Compute pillar breakdown
  const pillarCounts: Record<string, number> = {};
  CONTENT_PILLARS.forEach((p) => {
    pillarCounts[p.name] = 0;
  });
  posts.forEach((p) => {
    if (pillarCounts[p.pillar] !== undefined) {
      pillarCounts[p.pillar]++;
    }
  });

  const scheduledThisWeek = posts.filter(
    (p) => p.status === 'scheduled' || p.status === 'published'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Konsistensi Jadwal</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {scheduledThisWeek} <span className="text-xs font-sans font-normal text-neutral-400">post aktif</span>
          </p>
          <p className="text-[11px] text-emerald-400">
            Target mingguan ideal: 4 - 7 konten
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Rekomendasi Waktu Emas (WIB)</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-lg font-bold font-mono text-white tabular-nums">
            12:00 <span className="text-neutral-500 font-sans font-normal">dan</span> 18:30 WIB
          </p>
          <p className="text-[11px] text-neutral-400">
            Tingkat pembukaan feed 2.8x lebih aktif
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Distribusi Nilai Konten</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-lg font-bold text-white">
            Formula 70 / 20 / 10
          </p>
          <p className="text-[11px] text-neutral-400">
            70% Edukasi, 20% Cerita/BTS, 10% Penjualan
          </p>
        </div>
      </div>

      {/* Platform Best Times Guide Matrix */}
      <div className="bg-[#12151b] border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/60">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Panduan Jam Posting Terbaik per Platform (Audiens Indonesia / WIB)</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Dihitung berdasarkan kebiasaan engagement kreator digital dan riset algoritma media sosial
          </p>
        </div>

        <div className="divide-y divide-neutral-800/80 text-xs">
          {(Object.keys(PLATFORMS) as Platform[]).map((pKey) => {
            const p = PLATFORMS[pKey];
            return (
              <div
                key={pKey}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-900/30 transition-colors"
              >
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: p.iconColor }}
                  />
                  <div>
                    <h4 className="font-semibold text-white">{p.name}</h4>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      Maks. {p.maxChars.toLocaleString('id-ID')} karakter
                    </span>
                  </div>
                </div>

                {/* Weekday best */}
                <div className="flex-1">
                  <span className="text-[11px] text-neutral-400 block mb-1">
                    Hari Kerja (Senin - Jumat):
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.bestHoursWeekday.map((hour) => (
                      <span
                        key={hour}
                        className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 font-mono tabular-nums text-amber-300 font-medium"
                      >
                        {hour} WIB
                      </span>
                    ))}
                  </div>
                </div>

                {/* Weekend best */}
                <div className="w-64 shrink-0">
                  <span className="text-[11px] text-neutral-400 block mb-1">
                    Akhir Pekan (Sabtu - Minggu):
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.bestHoursWeekend.map((hour) => (
                      <span
                        key={hour}
                        className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 font-mono tabular-nums text-sky-300 font-medium"
                      >
                        {hour} WIB
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pillar Balance Bar */}
      <div className="bg-[#12151b] border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Keseimbangan Pilar Konten di Kalender Anda
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {CONTENT_PILLARS.map((pil) => {
            const count = pillarCounts[pil.name] || 0;
            const pct = posts.length > 0 ? Math.round((count / posts.length) * 100) : 0;

            return (
              <div
                key={pil.name}
                className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-200 truncate">{pil.name}</span>
                  <span className="font-mono text-neutral-400 tabular-nums">{count} post</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pil.color,
                    }}
                  />
                </div>
                <p className="text-[10px] text-neutral-500 line-clamp-1">{pil.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
