import React from 'react';
import { Post, Platform, PostStatus } from '../types/content';
import { PLATFORMS, STATUS_CONFIG } from '../utils/constants';
import { Clock, Calendar, Trash2, Edit3, ExternalLink } from 'lucide-react';

interface ListViewProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onUpdateStatus: (id: string, status: PostStatus) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  posts,
  onSelectPost,
  onDeletePost,
  onUpdateStatus,
}) => {
  return (
    <div className="bg-[#12151b] border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/90 text-xs font-semibold text-neutral-400">
              <th className="py-3 px-4 w-72">Judul Konten & Hook</th>
              <th className="py-3 px-3">Platform</th>
              <th className="py-3 px-3">Pilar & Format</th>
              <th className="py-3 px-3">Jadwal Tayang</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Target / Metrik</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80 text-xs">
            {posts.map((post) => {
              const statusConf = STATUS_CONFIG[post.status];

              return (
                <tr
                  key={post.id}
                  className="hover:bg-neutral-900/50 transition-colors group"
                >
                  {/* Judul & Hook */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex items-start gap-3">
                      {post.mediaUrl && (
                        <img
                          src={post.mediaUrl}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded object-cover shrink-0 bg-neutral-950 border border-neutral-800"
                        />
                      )}
                      <div className="min-w-0">
                        <button
                          onClick={() => onSelectPost(post)}
                          className="font-semibold text-neutral-100 hover:text-amber-400 text-left line-clamp-1 transition-colors"
                        >
                          {post.title}
                        </button>
                        {post.hook && (
                          <p className="text-[11px] text-neutral-400 line-clamp-1 italic mt-0.5">
                            "{post.hook}"
                          </p>
                        )}
                        {post.hashtags.length > 0 && (
                          <div className="text-[10px] text-neutral-500 line-clamp-1 mt-1 font-mono">
                            {post.hashtags.slice(0, 3).join(' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Platform Icons */}
                  <td className="py-3.5 px-3 align-top">
                    <div className="flex flex-wrap items-center gap-1">
                      {post.platforms.map((p) => {
                        const conf = PLATFORMS[p as Platform];
                        return (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-300"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: conf?.iconColor || '#fff' }}
                            />
                            <span>{conf?.name || p}</span>
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Pilar & Format */}
                  <td className="py-3.5 px-3 align-top">
                    <div className="space-y-0.5">
                      <div className="text-neutral-200 font-medium">{post.pillar}</div>
                      <div className="text-[11px] text-neutral-400 capitalize">{post.format}</div>
                    </div>
                  </td>

                  {/* Jadwal Tayang */}
                  <td className="py-3.5 px-3 align-top font-mono tabular-nums">
                    <div className="flex items-center gap-1.5 text-neutral-200">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      <span>{post.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400 text-[11px] mt-0.5">
                      <Clock className="w-3 h-3 text-amber-500/70" />
                      <span>{post.scheduledTime} WIB</span>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-3 align-top">
                    <select
                      value={post.status}
                      onChange={(e) => onUpdateStatus(post.id, e.target.value as PostStatus)}
                      className={`text-[11px] font-medium rounded-lg px-2 py-1 bg-neutral-900 border border-neutral-800 ${statusConf.text} focus:outline-none`}
                    >
                      {(Object.keys(STATUS_CONFIG) as PostStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Target / Metrik */}
                  <td className="py-3.5 px-3 align-top">
                    <span className="text-[11px] text-neutral-300 font-mono">
                      {post.engagementTarget || 'Organik'}
                    </span>
                    {post.estimatedReach && (
                      <div className="text-[10px] text-neutral-500 font-mono tabular-nums">
                        ~{post.estimatedReach.toLocaleString('id-ID')} est. reach
                      </div>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectPost(post)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                        title="Edit Konten"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus konten "${post.title}"?`)) {
                            onDeletePost(post.id);
                          }
                        }}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                        title="Hapus Konten"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && (
        <div className="p-8 text-center text-xs text-neutral-500">
          Tidak ada konten yang sesuai dengan filter saat ini.
        </div>
      )}
    </div>
  );
};
