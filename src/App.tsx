import React, { useState, useEffect, useMemo } from 'react';
import { Post, ViewMode, FilterOptions, PostStatus } from './types/content';
import { fetchPosts, createPost, updatePost, deletePost } from './utils/api';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { FilterBar } from './components/FilterBar';
import { CalendarView } from './components/CalendarView';
import { WeeklyTimeView } from './components/WeeklyTimeView';
import { KanbanBoardView } from './components/KanbanBoardView';
import { FeedPreviewView } from './components/FeedPreviewView';
import { ListView } from './components/ListView';
import { PostEditorModal } from './components/PostEditorModal';
import { AiStudioModal } from './components/AiStudioModal';
import { PostingTimeInsights } from './components/PostingTimeInsights';
import { CheckCircle } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<ViewMode>('calendar');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    platform: 'all',
    status: 'all',
    pillar: 'all',
    month: '2026-11',
  });

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);
  const [aiStudioTopic, setAiStudioTopic] = useState('');
  const [aiStudioMode, setAiStudioMode] = useState<'hook' | 'caption' | 'repurpose' | 'week-plan'>('hook');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Load posts on mount
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchPosts();
      setPosts(data);
      setIsLoading(false);
    };
    load();
  }, []);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesHook = post.hook?.toLowerCase().includes(q);
        const matchesCaption = post.caption?.toLowerCase().includes(q);
        const matchesHashtag = post.hashtags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesHook && !matchesCaption && !matchesHashtag) {
          return false;
        }
      }

      // Platform
      if (filters.platform !== 'all') {
        if (!post.platforms.includes(filters.platform)) {
          return false;
        }
      }

      // Status
      if (filters.status !== 'all') {
        if (post.status !== filters.status) {
          return false;
        }
      }

      // Pillar
      if (filters.pillar !== 'all') {
        if (post.pillar !== filters.pillar) {
          return false;
        }
      }

      return true;
    });
  }, [posts, filters]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: posts.length,
      scheduled: posts.filter((p) => p.status === 'scheduled').length,
      published: posts.filter((p) => p.status === 'published').length,
      draft: posts.filter((p) => p.status === 'draft').length,
      idea: posts.filter((p) => p.status === 'idea').length,
    };
  }, [posts]);

  // Handlers for Posts CRUD
  const handleSavePost = async (postData: Partial<Post>) => {
    if (selectedPost) {
      // Update existing
      const updated = await updatePost(selectedPost.id, postData);
      setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? updated : p)));
      showToast('Konten berhasil diperbarui!');
    } else {
      // Create new
      const created = await createPost(postData);
      setPosts((prev) => [created, ...prev]);
      showToast('Konten berhasil ditambahkan ke jadwal!');
    }
    setSelectedPost(null);
  };

  const handleDeletePost = async (id: string) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('Konten telah dihapus.');
  };

  const handleUpdateStatus = async (id: string, newStatus: PostStatus) => {
    await updatePost(id, { status: newStatus });
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    showToast(`Status konten diubah menjadi "${newStatus}"`);
  };

  const handleAddPostForDate = (dateStr: string) => {
    setSelectedPost(null);
    setIsEditorOpen(true);
  };

  const handleAddPostForDateAndTime = (dateStr: string, timeStr: string) => {
    setSelectedPost(null);
    setIsEditorOpen(true);
  };

  const handleOpenAiStudio = (topic: string = '', mode: 'hook' | 'caption' | 'repurpose' | 'week-plan' = 'hook') => {
    setAiStudioTopic(topic);
    setAiStudioMode(mode);
    setIsAiStudioOpen(true);
  };

  const handleApplySinglePostFromAi = async (postData: Partial<Post>) => {
    const created = await createPost({
      ...postData,
      scheduledDate: postData.scheduledDate || '2026-11-09',
      scheduledTime: postData.scheduledTime || '18:30',
    });
    setPosts((prev) => [created, ...prev]);
    showToast('Konten AI berhasil disimpan ke jadwal!');
  };

  const handleApplyBatchPostsFromAi = async (batch: Partial<Post>[]) => {
    const createdList: Post[] = [];
    for (const item of batch) {
      const created = await createPost(item);
      createdList.push(created);
    }
    setPosts((prev) => [...createdList, ...prev]);
    showToast(`Sukses menerapkan ${batch.length} rencana konten mingguan ke kalender!`);
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Judul', 'Hook', 'Platform', 'Format', 'Pilar', 'Status', 'Tanggal Tayang', 'Jam Tayang', 'Target Metrik'];
    const rows = filteredPosts.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${(p.hook || '').replace(/"/g, '""')}"`,
      `"${p.platforms.join(', ')}"`,
      p.format,
      `"${p.pillar}"`,
      p.status,
      p.scheduledDate,
      p.scheduledTime,
      `"${p.engagementTarget || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `karsapost_jadwal_konten_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Kalender konten berhasil diekspor ke CSV');
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      platform: 'all',
      status: 'all',
      pillar: 'all',
      month: '2026-11',
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-neutral-100 flex font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-xs font-medium rounded-xl shadow-2xl animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Dashboard Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenCreate={() => {
          setSelectedPost(null);
          setIsEditorOpen(true);
        }}
        onOpenAiStudio={() => handleOpenAiStudio('', 'hook')}
        postCount={posts.length}
        scheduledCount={stats.scheduled}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Dashboard Top Header with Breadcrumbs & Actions */}
        <DashboardHeader
          currentView={currentView}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreate={() => {
            setSelectedPost(null);
            setIsEditorOpen(true);
          }}
          onOpenAiStudio={() => handleOpenAiStudio('', 'hook')}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Filter Bar & Quick Metrics */}
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            onExportCsv={handleExportCsv}
            onResetFilters={handleResetFilters}
            stats={stats}
          />

          {/* Active View */}
          {isLoading ? (
            <div className="p-16 text-center text-xs text-neutral-500 space-y-3">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Memuat kalender konten kreator...</p>
            </div>
          ) : (
            <>
              {currentView === 'calendar' && (
                <CalendarView
                  posts={filteredPosts}
                  onSelectPost={(post) => {
                    setSelectedPost(post);
                    setIsEditorOpen(true);
                  }}
                  onAddPostForDate={handleAddPostForDate}
                />
              )}

              {currentView === 'weekly' && (
                <WeeklyTimeView
                  posts={filteredPosts}
                  onSelectPost={(post) => {
                    setSelectedPost(post);
                    setIsEditorOpen(true);
                  }}
                  onAddPostForDateAndTime={handleAddPostForDateAndTime}
                />
              )}

              {currentView === 'board' && (
                <KanbanBoardView
                  posts={filteredPosts}
                  onSelectPost={(post) => {
                    setSelectedPost(post);
                    setIsEditorOpen(true);
                  }}
                  onUpdateStatus={handleUpdateStatus}
                  onAddNewInStatus={(status) => {
                    setSelectedPost(null);
                    setIsEditorOpen(true);
                  }}
                />
              )}

              {currentView === 'feed' && (
                <FeedPreviewView
                  posts={filteredPosts}
                  onSelectPost={(post) => {
                    setSelectedPost(post);
                    setIsEditorOpen(true);
                  }}
                  onOpenCreate={() => {
                    setSelectedPost(null);
                    setIsEditorOpen(true);
                  }}
                />
              )}

              {currentView === 'list' && (
                <ListView
                  posts={filteredPosts}
                  onSelectPost={(post) => {
                    setSelectedPost(post);
                    setIsEditorOpen(true);
                  }}
                  onDeletePost={handleDeletePost}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}
            </>
          )}

          {/* Posting Time & Audience Engagement Insights */}
          <div className="pt-6 border-t border-neutral-800">
            <PostingTimeInsights posts={posts} />
          </div>
        </main>

        {/* Quiet Footer */}
        <footer className="border-t border-neutral-800/80 px-6 py-4 text-xs text-neutral-500 bg-[#0a0c0f] mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-300">KarsaPost Studio</span>
              <span>·</span>
              <span>Sistem Manajemen Konten Kreator Media Sosial</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>Waktu Indonesia Barat (WIB)</span>
              <span>·</span>
              <span>Versi 2026</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Post Editor / Scheduler Modal */}
      <PostEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        onSave={handleSavePost}
        onDelete={selectedPost ? handleDeletePost : undefined}
        onOpenAiStudioForField={(topic, mode) => {
          setIsEditorOpen(false);
          handleOpenAiStudio(topic, mode);
        }}
      />

      {/* AI Studio Assistant Modal */}
      <AiStudioModal
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
        initialTopic={aiStudioTopic}
        initialMode={aiStudioMode}
        onApplyPost={handleApplySinglePostFromAi}
        onApplyBatchPosts={handleApplyBatchPostsFromAi}
      />
    </div>
  );
}
