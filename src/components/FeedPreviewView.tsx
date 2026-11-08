import React, { useState } from 'react';
import { Post } from '../types/content';
import { Instagram, Smartphone, Calendar, Heart, MessageCircle, Bookmark, Layers, Film } from 'lucide-react';

interface FeedPreviewViewProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onOpenCreate: () => void;
}

export const FeedPreviewView: React.FC<FeedPreviewViewProps> = ({
  posts,
  onSelectPost,
  onOpenCreate,
}) => {
  const [feedMode, setFeedMode] = useState<'instagram' | 'tiktok'>('instagram');

  // Filter posts relevant to this platform
  const feedPosts = posts.filter((p) => p.platforms.includes(feedMode));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
        <div>
          <h3 className="text-sm font-semibold text-white">Visual Grid & Feed Simulator</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Lihat keserasian visual tata letak postingan sebelum dipublikasikan untuk menjaga estetika brand Anda.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setFeedMode('instagram')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              feedMode === 'instagram'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram Grid 3x3</span>
          </button>
          <button
            onClick={() => setFeedMode('tiktok')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              feedMode === 'tiktok'
                ? 'bg-neutral-800 text-cyan-400 shadow-sm border border-cyan-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>TikTok / Reels Vertical</span>
          </button>
        </div>
      </div>

      {/* Simulated Device Container */}
      <div className="bg-[#12151b] border border-neutral-800 rounded-2xl p-6 shadow-xl max-w-xl mx-auto">
        {/* Creator Profile Header */}
        <div className="flex items-center gap-4 pb-5 mb-5 border-b border-neutral-800">
          <div className="relative w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shrink-0">
            <img
              src="/src/assets/images/avatar_creator_profile_1794135166065.jpg"
              alt="Creator Profile"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full border border-neutral-900"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white truncate">@winda.creative</h4>
              <span className="text-[11px] text-amber-400 font-medium">Digital Creator</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              Membagikan strategi konten, produktivitas, dan alur kerja kreator digital yang efisien.
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-neutral-300 font-mono tabular-nums">
              <span><strong>{feedPosts.length}</strong> posts</span>
              <span><strong>48.2k</strong> followers</span>
              <span><strong>492</strong> following</span>
            </div>
          </div>
        </div>

        {/* Instagram Grid Mode (3 Columns Square) */}
        {feedMode === 'instagram' && (
          <div className="grid grid-cols-3 gap-1.5 bg-neutral-950 p-2 rounded-xl">
            {feedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group relative aspect-square rounded-md overflow-hidden bg-neutral-900 cursor-pointer border border-neutral-800/80"
              >
                {post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                    <p className="text-[11px] font-medium text-neutral-300 line-clamp-3">
                      {post.title}
                    </p>
                  </div>
                )}

                {/* Format icon badge */}
                <div className="absolute top-1.5 right-1.5 text-white/90 drop-shadow">
                  {post.format === 'carousel' && <Layers className="w-3.5 h-3.5" />}
                  {post.format === 'reel' && <Film className="w-3.5 h-3.5" />}
                </div>

                {/* Scheduled banner */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-amber-300 font-mono tabular-nums truncate">
                    {post.scheduledDate} · {post.scheduledTime}
                  </p>
                </div>

                {/* Hover overlay with mock engagement */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span className="font-mono tabular-nums">2.4k</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                    <span className="font-mono tabular-nums">184</span>
                  </span>
                </div>
              </div>
            ))}

            {/* Empty filler slots */}
            {Array.from({ length: Math.max(0, 9 - feedPosts.length) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                onClick={onOpenCreate}
                className="aspect-square rounded-md border border-dashed border-neutral-800/80 bg-neutral-950/40 hover:bg-neutral-900/50 flex flex-col items-center justify-center p-2 text-center text-neutral-600 hover:text-amber-400 cursor-pointer transition-colors"
              >
                <span className="text-xl leading-none mb-1">+</span>
                <span className="text-[10px]">Slot {feedPosts.length + idx + 1}</span>
              </div>
            ))}
          </div>
        )}

        {/* TikTok / Reels Mode (3 Columns Vertical 9:16) */}
        {feedMode === 'tiktok' && (
          <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-2 rounded-xl">
            {feedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group relative aspect-[9/16] rounded-lg overflow-hidden bg-neutral-900 cursor-pointer border border-neutral-800/80"
              >
                {post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-neutral-800 via-neutral-900 to-black">
                    <p className="text-xs font-semibold text-neutral-200 line-clamp-4">
                      {post.hook || post.title}
                    </p>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2 flex flex-col justify-end">
                  <p className="text-[11px] font-semibold text-white line-clamp-2 leading-tight">
                    {post.hook || post.title}
                  </p>
                  <p className="text-[10px] text-cyan-400 font-mono tabular-nums mt-1">
                    {post.scheduledDate} {post.scheduledTime}
                  </p>
                </div>
              </div>
            ))}

            {Array.from({ length: Math.max(0, 6 - feedPosts.length) }).map((_, idx) => (
              <div
                key={`empty-tt-${idx}`}
                onClick={onOpenCreate}
                className="aspect-[9/16] rounded-lg border border-dashed border-neutral-800/80 bg-neutral-950/40 hover:bg-neutral-900/50 flex flex-col items-center justify-center p-2 text-center text-neutral-600 hover:text-cyan-400 cursor-pointer transition-colors"
              >
                <span className="text-xl leading-none mb-1">+</span>
                <span className="text-[10px]">Slot Video</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
