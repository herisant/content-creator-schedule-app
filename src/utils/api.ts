import { Post } from '../types/content';

const STORAGE_KEY = 'karsapost_content_planner_posts';

export async function fetchPosts(): Promise<Post[]> {
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data.posts && Array.isArray(data.posts)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.posts));
      return data.posts;
    }
  } catch (err) {
    console.warn('Using local fallback for fetchPosts:', err);
  }
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return [];
}

export async function createPost(postData: Partial<Post>): Promise<Post> {
  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error('Create error');
    const data = await res.json();
    return data.post;
  } catch (err) {
    console.warn('Fallback local create:', err);
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: postData.title || 'Untitled Post',
      hook: postData.hook || '',
      caption: postData.caption || '',
      platforms: postData.platforms || ['instagram'],
      format: postData.format || 'carousel',
      pillar: postData.pillar || 'Edukasi & Tips',
      status: postData.status || 'draft',
      scheduledDate: postData.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: postData.scheduledTime || '18:30',
      mediaUrl: postData.mediaUrl,
      mediaType: postData.mediaType || 'image',
      hashtags: postData.hashtags || [],
      targetAudience: postData.targetAudience,
      estimatedReach: postData.estimatedReach,
      notes: postData.notes,
      engagementTarget: postData.engagementTarget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newPost;
  }
}

export async function updatePost(id: string, updates: Partial<Post>): Promise<Post> {
  try {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Update error');
    const data = await res.json();
    return data.post;
  } catch (err) {
    console.warn('Fallback local update:', err);
    return {
      ...(updates as any),
      id,
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Fallback local delete:', err);
    return true;
  }
}

export async function generateHooksApi(topic: string, platform: string, niche: string, tone: string) {
  const res = await fetch('/api/ai/generate-hooks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, platform, niche, tone }),
  });
  if (!res.ok) throw new Error('Gagal menghasilkan hook');
  return res.json();
}

export async function generateCaptionApi(params: {
  title: string;
  hook?: string;
  pillar?: string;
  platform?: string;
  audience?: string;
}) {
  const res = await fetch('/api/ai/generate-caption', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Gagal menghasilkan caption');
  return res.json();
}

export async function repurposeContentApi(originalContent: string, originalPlatform: string) {
  const res = await fetch('/api/ai/repurpose-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalContent, originalPlatform }),
  });
  if (!res.ok) throw new Error('Gagal repurpose konten');
  return res.json();
}

export async function generateWeekPlanApi(niche: string, goals: string) {
  const res = await fetch('/api/ai/generate-week-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ niche, goals }),
  });
  if (!res.ok) throw new Error('Gagal membuat rencana mingguan');
  return res.json();
}
