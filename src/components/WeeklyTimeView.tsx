import React, { useState } from 'react';
import { Post, Platform } from '../types/content';
import { PLATFORMS, PRIME_TIME_WINDOWS, STATUS_CONFIG } from '../utils/constants';
import { Clock, Plus, Flame } from 'lucide-react';

interface WeeklyTimeViewProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onAddPostForDateAndTime: (dateStr: string, timeStr: string) => void;
}

export const WeeklyTimeView: React.FC<WeeklyTimeViewProps> = ({
  posts,
  onSelectPost,
  onAddPostForDateAndTime,
}) => {
  // Current week starting Monday 2026-11-02 or 2026-11-09
  const weekDays = [
    { name: 'Senin', dateStr: '2026-11-09', dayNum: 9 },
    { name: 'Selasa', dateStr: '2026-11-10', dayNum: 10 },
    { name: 'Rabu', dateStr: '2026-11-11', dayNum: 11 },
    { name: 'Kamis', dateStr: '2026-11-12', dayNum: 12 },
    { name: 'Jumat', dateStr: '2026-11-13', dayNum: 13 },
    { name: 'Sabtu', dateStr: '2026-11-14', dayNum: 14 },
    { name: 'Minggu', dateStr: '2026-11-15', dayNum: 15 },
  ];

  const timeBlocks = [
    { id: 'morning', label: 'Pagi (07:00 - 10:30)', defaultTime: '08:30', isPrime: false, hint: 'LinkedIn & X commute' },
    { id: 'lunch', label: 'Siang (11:30 - 13:30)', defaultTime: '12:00', isPrime: true, hint: 'IG & TikTok lunch break' },
    { id: 'afternoon', label: 'Sore (15:00 - 17:30)', defaultTime: '16:00', isPrime: false, hint: 'YouTube Shorts casual' },
    { id: 'prime_evening', label: 'Prime Time (18:30 - 21:00)', defaultTime: '19:15', isPrime: true, hint: 'Peak engagement tertinggi' },
    { id: 'night', label: 'Malam Santai (21:00 - 23:00)', defaultTime: '21:30', isPrime: false, hint: 'TikTok & Threads chill' },
  ];

  const getPostsForDayAndSlot = (dateStr: string, blockId: string) => {
    return posts.filter((p) => {
      if (p.scheduledDate !== dateStr) return false;
      const hour = parseInt(p.scheduledTime.split(':')[0], 10);
      if (blockId === 'morning') return hour >= 6 && hour < 11;
      if (blockId === 'lunch') return hour >= 11 && hour < 14;
      if (blockId === 'afternoon') return hour >= 14 && hour < 18;
      if (blockId === 'prime_evening') return hour >= 18 && hour < 21;
      if (blockId === 'night') return hour >= 21;
      return false;
    });
  };

  return (
    <div className="space-y-4">
      {/* Intro info bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Matriks Jadwal Mingguan Berdasarkan Waktu Emas (Prime Time WIB)</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Susun frekuensi posting merata agar algoritma platform mengenali akun Anda konsisten dan tidak spamming dalam satu waktu.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span>
            <span>Slot Prime Time Emas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-700"></span>
            <span>Slot Biasa</span>
          </div>
        </div>
      </div>

      {/* 7 Days Table Grid */}
      <div className="bg-[#12151b] border border-neutral-800 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/90 text-xs">
              <th className="py-3 px-4 font-semibold text-neutral-400 w-44">
                Zona Waktu
              </th>
              {weekDays.map((d) => (
                <th key={d.dateStr} className="py-3 px-3 font-semibold text-center text-neutral-300">
                  <div>{d.name}</div>
                  <div className="text-[11px] font-mono tabular-nums text-neutral-500 font-normal">
                    {d.dayNum} Nov
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80 text-xs">
            {timeBlocks.map((block) => (
              <tr key={block.id} className="hover:bg-neutral-900/20 transition-colors">
                {/* Time block label */}
                <td className="py-4 px-4 align-top bg-neutral-950/40 border-r border-neutral-800/80">
                  <div className="flex items-center gap-1.5">
                    {block.isPrime && (
                      <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span className={`font-medium ${block.isPrime ? 'text-amber-300' : 'text-neutral-300'}`}>
                      {block.label}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    {block.hint}
                  </div>
                </td>

                {/* Day Columns */}
                {weekDays.map((day) => {
                  const slotPosts = getPostsForDayAndSlot(day.dateStr, block.id);
                  return (
                    <td
                      key={day.dateStr}
                      className={`p-2 align-top border-r border-neutral-800/60 relative group min-h-[100px] ${
                        block.isPrime ? 'bg-amber-500/[0.015]' : ''
                      }`}
                    >
                      <div className="space-y-1.5 min-h-[70px]">
                        {slotPosts.map((post) => (
                          <div
                            key={post.id}
                            onClick={() => onSelectPost(post)}
                            className="cursor-pointer p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all text-left"
                          >
                            <div className="flex items-center justify-between text-[10px] mb-1">
                              <span className="font-mono tabular-nums text-amber-400">
                                {post.scheduledTime}
                              </span>
                              <div className="flex items-center gap-0.5">
                                {post.platforms.map((p) => {
                                  const c = PLATFORMS[p as Platform];
                                  return (
                                    <span
                                      key={p}
                                      className="w-1.5 h-1.5 rounded-full"
                                      style={{ backgroundColor: c?.iconColor || '#fff' }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                            <p className="text-xs font-medium text-neutral-200 line-clamp-2 leading-tight">
                              {post.title}
                            </p>
                          </div>
                        ))}

                        {slotPosts.length === 0 && (
                          <button
                            onClick={() => onAddPostForDateAndTime(day.dateStr, block.defaultTime)}
                            className="w-full h-full min-h-[50px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-800 hover:border-amber-500/50 hover:bg-amber-500/5 text-neutral-500 hover:text-amber-400 transition-all text-[11px]"
                          >
                            <Plus className="w-3.5 h-3.5 mb-0.5" />
                            <span>+ Isi Slot</span>
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
