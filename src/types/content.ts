export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'x' | 'threads' | 'facebook';

export type ContentFormat = 'carousel' | 'reel' | 'video' | 'story' | 'text' | 'short';

export type ContentPillar =
  | 'Edukasi & Tips'
  | 'Behind The Scenes'
  | 'Personal & Story'
  | 'Promosi & Launch'
  | 'Opini & Diskusi';

export type PostStatus = 'idea' | 'draft' | 'review' | 'scheduled' | 'published';

export interface Post {
  id: string;
  title: string;
  hook: string;
  caption: string;
  platforms: Platform[];
  format: ContentFormat;
  pillar: ContentPillar;
  status: PostStatus;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  hashtags: string[];
  targetAudience?: string;
  estimatedReach?: number;
  notes?: string;
  engagementTarget?: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'calendar' | 'weekly' | 'board' | 'feed' | 'list';

export interface FilterOptions {
  search: string;
  platform: Platform | 'all';
  status: PostStatus | 'all';
  pillar: ContentPillar | 'all';
  month: string; // YYYY-MM
}

export interface PlatformMetadata {
  id: Platform;
  name: string;
  iconColor: string;
  accentBg: string;
  maxChars: number;
  bestHoursWeekday: string[];
  bestHoursWeekend: string[];
  supportedFormats: ContentFormat[];
}
