import React from 'react';
import { Post, PostStatus, Platform } from '../types/content';
import { PLATFORMS, STATUS_CONFIG } from '../utils/constants';
import { Plus, ArrowLeft, ArrowRight, Clock, Calendar, CheckCircle } from 'lucide-react';

interface KanbanBoardViewProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onUpdateStatus: (postId: string, newStatus: PostStatus) => void;
  onAddNewInStatus: (status: PostStatus) => void;
}

const COLUMNS: PostStatus[] = ['idea', 'draft', 'review', 'scheduled', 'published'];

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  posts,
  onSelectPost,
  onUpdateStatus,
  onAddNewInStatus,
}) => {
  const getNextStatus = (current: PostStatus): PostStatus | null => {
    const idx = COLUMNS.indexOf(current);
    if (idx < COLUMNS.length - 1) return COLUMNS[idx + 1];
    return null;
  };

  const getPrevStatus = (current: PostStatus): PostStatus | null => {
    const idx = COLUMNS.indexOf(current);
    if (idx > 0) return COLUMNS[idx - 1];
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
      {COLUMNS.map((statusKey) => {
        const conf = STATUS_CONFIG[statusKey];
        const columnPosts = posts.filter((p) => p.status === statusKey);

        return (
          <div
            key={statusKey}
            className="bg-[#12151b] border border-neutral-800/90 rounded-xl p-3 flex flex-col min-w-[260px] h-full"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {conf.label}
                </h3>
                <span className="font-mono text-xs text-neutral-500 tabular-nums">
                  ({columnPosts.length})
                </span>
              </div>

              <button
                onClick={() => onAddNewInStatus(statusKey)}
                className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                title={`Tambah konten baru ke status ${conf.label}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Posts Cards list */}
            <div className="space-y-2.5 flex-1 min-h-[300px]">
              {columnPosts.map((post) => {
                const next = getNextStatus(post.status);
                const prev = getPrevStatus(post.status);

                return (
                  <div
                    key={post.id}
                    className="p-3 bg-neutral-900/90 hover:bg-neutral-800/80 border border-neutral-800 rounded-lg transition-all group flex flex-col justify-between"
                  >
                    <div onClick={() => onSelectPost(post)} className="cursor-pointer">
                      {/* Media Thumbnail preview if available */}
                      {post.mediaUrl && (
                        <div className="relative w-full h-28 mb-2.5 rounded-md overflow-hidden bg-neutral-950">
                          <img
                            src={post.mediaUrl}
                            alt={post.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-neutral-300">
                            {post.format}
                          </div>
                        </div>
                      )}

                      {/* Platform icons row */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1">
                          {post.platforms.map((p) => {
                            const pConf = PLATFORMS[p as Platform];
                            return (
                              <span
                                key={p}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: pConf?.iconColor || '#fff' }}
                                title={pConf?.name}
                              />
                            );
                          })}
                        </div>
                        <span className="text-[11px] text-neutral-500 capitalize">
                          {post.pillar}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                        {post.title}
                      </h4>

                      {/* Hook snippet */}
                      {post.hook && (
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 italic">
                          "{post.hook}"
                        </p>
                      )}

                      {/* Scheduled date & time */}
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400 font-mono tabular-nums pt-2 border-t border-neutral-800/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-500" />
                          {post.scheduledDate}
                        </span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Clock className="w-3 h-3" />
                          {post.scheduledTime}
                        </span>
                      </div>
                    </div>

                    {/* Quick Move Status controls */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-800/80">
                      <div>
                        {prev && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateStatus(post.id, prev);
                            }}
                            className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white hover:bg-neutral-800 px-1.5 py-0.5 rounded transition-colors"
                            title={`Kembalikan ke ${STATUS_CONFIG[prev].label}`}
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Mundur</span>
                          </button>
                        )}
                      </div>

                      <div>
                        {next && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateStatus(post.id, next);
                            }}
                            className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2 py-0.5 rounded font-medium transition-colors"
                            title={`Lanjut ke ${STATUS_CONFIG[next].label}`}
                          >
                            <span>Lanjut</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {columnPosts.length === 0 && (
                <div className="h-32 border border-dashed border-neutral-800 rounded-lg flex flex-col items-center justify-center p-4 text-center text-xs text-neutral-600">
                  <p>Belum ada konten di tahap ini</p>
                  <button
                    onClick={() => onAddNewInStatus(statusKey)}
                    className="mt-2 text-amber-400 hover:underline text-[11px]"
                  >
                    + Buat pertama
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
