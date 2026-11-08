import React, { useState } from 'react';
import { Post, Platform } from '../types/content';
import { PLATFORMS, STATUS_CONFIG } from '../utils/constants';
import { ChevronLeft, ChevronRight, Plus, Clock, Sparkles } from 'lucide-react';

interface CalendarViewProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onAddPostForDate: (dateStr: string) => void;
  onQuickAiForDate?: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onSelectPost,
  onAddPostForDate,
}) => {
  // We can default to November 2026 based on context time
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 10, 1)); // 0-indexed month: 10 = Nov

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  // Days in current month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week for 1st of month: 0=Sun, 1=Mon, ..., 6=Sat
  // We want Monday as index 0:
  let firstDayIndex = firstDayOfMonth.getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6; // Sunday is 6th index

  const daysInMonth = lastDayOfMonth.getDate();

  // Days from previous month to fill grid
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    prevMonthDays.push({ dateStr, dayNum, isCurrentMonth: false });
  }

  // Days in current month
  const currentMonthDays: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    currentMonthDays.push({ dateStr, dayNum: i, isCurrentMonth: true });
  }

  // Next month days to complete 35 or 42 cells
  const totalCells = Math.ceil((prevMonthDays.length + currentMonthDays.length) / 7) * 7;
  const nextMonthDaysCount = totalCells - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    const m = month === 11 ? 1 : month + 2;
    const y = month === 11 ? year + 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    nextMonthDays.push({ dateStr, dayNum: i, isCurrentMonth: false });
  }

  const allCalendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleTodayJump = () => {
    setCurrentDate(new Date(2026, 10, 8)); // Current simulated date
  };

  const getPostsForDate = (dateStr: string) => {
    return posts.filter((p) => p.scheduledDate === dateStr);
  };

  return (
    <div className="bg-[#12151b] border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
      {/* Calendar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-white tracking-tight">
            {monthNames[month]} <span className="font-mono tabular-nums">{year}</span>
          </h2>
          <span className="text-xs text-neutral-500">
            ({posts.filter((p) => p.scheduledDate?.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length} post bulan ini)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTodayJump}
            className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700/80 rounded-lg transition-colors border border-neutral-700/60"
          >
            Hari Ini
          </button>
          <div className="flex items-center bg-neutral-800 rounded-lg border border-neutral-700/60 p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors"
              title="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-900/80 text-center">
        {dayNames.map((name, idx) => (
          <div
            key={name}
            className={`py-2.5 text-xs font-semibold ${
              idx === 5 || idx === 6 ? 'text-amber-400/90' : 'text-neutral-400'
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-neutral-800/80 bg-[#0e1117]">
        {allCalendarDays.map((cell) => {
          const dayPosts = getPostsForDate(cell.dateStr);
          const isToday = cell.dateStr === '2026-11-08';

          return (
            <div
              key={cell.dateStr}
              className={`min-h-[130px] p-2 flex flex-col justify-between group transition-colors relative ${
                cell.isCurrentMonth
                  ? isToday
                    ? 'bg-amber-500/[0.04]'
                    : 'bg-[#0f1218] hover:bg-neutral-900/40'
                  : 'bg-neutral-950/60 opacity-40'
              }`}
            >
              {/* Cell Top Bar */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-mono tabular-nums font-medium ${
                    isToday
                      ? 'w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold'
                      : cell.isCurrentMonth
                      ? 'text-neutral-300'
                      : 'text-neutral-600'
                  }`}
                >
                  {cell.dayNum}
                </span>

                {/* Quick Add Button on Hover */}
                {cell.isCurrentMonth && (
                  <button
                    onClick={() => onAddPostForDate(cell.dateStr)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-all"
                    title={`Tambah postingan untuk ${cell.dateStr}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Scheduled Posts in this Cell */}
              <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[140px] pr-0.5">
                {dayPosts.map((post) => {
                  const statusInfo = STATUS_CONFIG[post.status];
                  return (
                    <div
                      key={post.id}
                      onClick={() => onSelectPost(post)}
                      className="cursor-pointer p-1.5 rounded-md bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all hover:bg-neutral-800/90 text-left group/item"
                    >
                      {/* Top line: time + platforms */}
                      <div className="flex items-center justify-between gap-1 mb-1 text-[11px]">
                        <div className="flex items-center gap-1 font-mono tabular-nums text-neutral-400">
                          <Clock className="w-2.5 h-2.5 text-neutral-500" />
                          <span>{post.scheduledTime}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {post.platforms.map((p) => {
                            const conf = PLATFORMS[p as Platform];
                            return (
                              <span
                                key={p}
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: conf?.iconColor || '#fff' }}
                                title={conf?.name}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Title / Hook preview */}
                      <p className="text-xs font-medium text-neutral-200 line-clamp-2 leading-tight group-hover/item:text-amber-300">
                        {post.title}
                      </p>

                      {/* Clean typographic metadata */}
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-neutral-500">
                        <span>{statusInfo.label}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{post.format}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Day slot empty hint on hover */}
              {dayPosts.length === 0 && cell.isCurrentMonth && (
                <div
                  onClick={() => onAddPostForDate(cell.dateStr)}
                  className="mt-auto opacity-0 group-hover:opacity-100 py-1 text-center cursor-pointer text-[10px] text-neutral-500 hover:text-amber-400 transition-colors"
                >
                  + Jadwalkan
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
