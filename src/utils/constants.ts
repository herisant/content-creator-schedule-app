import { Platform, PlatformMetadata, ContentPillar, ContentFormat, PostStatus } from '../types/content';

export const PLATFORMS: Record<Platform, PlatformMetadata> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    iconColor: '#E1306C',
    accentBg: 'rgba(225, 48, 108, 0.15)',
    maxChars: 2200,
    bestHoursWeekday: ['12:00', '18:30', '21:00'],
    bestHoursWeekend: ['10:00', '13:00', '19:30'],
    supportedFormats: ['carousel', 'reel', 'story', 'video'],
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    iconColor: '#00F2FE',
    accentBg: 'rgba(0, 242, 254, 0.15)',
    maxChars: 4000,
    bestHoursWeekday: ['12:30', '19:00', '21:30'],
    bestHoursWeekend: ['11:00', '16:00', '20:00'],
    supportedFormats: ['video', 'story'],
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    iconColor: '#FF0000',
    accentBg: 'rgba(255, 0, 0, 0.15)',
    maxChars: 5000,
    bestHoursWeekday: ['15:00', '18:00', '20:00'],
    bestHoursWeekend: ['09:00', '14:00', '17:00'],
    supportedFormats: ['short', 'video'],
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    iconColor: '#0A66C2',
    accentBg: 'rgba(10, 102, 194, 0.15)',
    maxChars: 3000,
    bestHoursWeekday: ['08:00', '12:00', '17:30'],
    bestHoursWeekend: ['10:00', '14:00'],
    supportedFormats: ['text', 'carousel', 'video'],
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    iconColor: '#E2E8F0',
    accentBg: 'rgba(255, 255, 255, 0.12)',
    maxChars: 280,
    bestHoursWeekday: ['08:30', '12:00', '19:00'],
    bestHoursWeekend: ['10:30', '15:00'],
    supportedFormats: ['text', 'video'],
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    iconColor: '#A855F7',
    accentBg: 'rgba(168, 85, 247, 0.15)',
    maxChars: 500,
    bestHoursWeekday: ['07:30', '12:00', '20:00'],
    bestHoursWeekend: ['11:00', '18:00'],
    supportedFormats: ['text', 'carousel', 'video'],
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    iconColor: '#1877F2',
    accentBg: 'rgba(24, 119, 242, 0.15)',
    maxChars: 63206,
    bestHoursWeekday: ['09:00', '13:00', '16:00'],
    bestHoursWeekend: ['12:00', '15:00'],
    supportedFormats: ['video', 'reel', 'text', 'carousel'],
  },
};

export const CONTENT_PILLARS: { name: ContentPillar; description: string; color: string }[] = [
  { name: 'Edukasi & Tips', description: 'Panduan, tutorial, rumus, dan wawasan berharga', color: '#38BDF8' },
  { name: 'Behind The Scenes', description: 'Proses kreatif, setup kerja, dan sisi manusiawi', color: '#F59E0B' },
  { name: 'Personal & Story', description: 'Opini, pengalaman hidup, kegagalan & kemenangan', color: '#EC4899' },
  { name: 'Promosi & Launch', description: 'Produk digital, jasa, sponsorship, atau newsletter', color: '#10B981' },
  { name: 'Opini & Diskusi', description: 'Debat sehat, pertanyaan audiens, dan tren terkini', color: '#A855F7' },
];

export const CONTENT_FORMATS: { id: ContentFormat; label: string; icon: string }[] = [
  { id: 'reel', label: 'Reels / Shorts (9:16)', icon: 'Film' },
  { id: 'carousel', label: 'Carousel (1:1 / 4:5)', icon: 'Layers' },
  { id: 'video', label: 'Video Horizontal / Feeds', icon: 'Video' },
  { id: 'story', label: 'Story (24 Jam)', icon: 'Clock' },
  { id: 'text', label: 'Teks / Thread / Artikel', icon: 'AlignLeft' },
  { id: 'short', label: 'Short Clip Cepat', icon: 'Zap' },
];

export const STATUS_CONFIG: Record<
  PostStatus,
  { label: string; bg: string; text: string; dot: string; description: string }
> = {
  idea: {
    label: 'Bank Ide',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    description: 'Ide mentah siap digodok',
  },
  draft: {
    label: 'Dalam Produksi',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    dot: 'bg-sky-400',
    description: 'Sedang penulisan skrip atau editing',
  },
  review: {
    label: 'Siap Review',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    dot: 'bg-purple-400',
    description: 'Menunggu pengecekan visual & caption',
  },
  scheduled: {
    label: 'Terjadwal',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    description: 'Sudah diset tanggal & jam tayang',
  },
  published: {
    label: 'Sudah Tayang',
    bg: 'bg-neutral-800',
    text: 'text-neutral-400',
    dot: 'bg-neutral-500',
    description: 'Konten telah diposting ke media sosial',
  },
};

export const DEFAULT_MEDIA_ASSETS = [
  {
    id: 'asset-1',
    title: 'Minimalist Creator Desk Setup',
    url: '/src/assets/images/creator_desk_setup_1794135166490.jpg',
    aspect: '16:9',
    category: 'Workspace & Gear',
  },
  {
    id: 'asset-2',
    title: 'Cafe Creative Journal & Coffee',
    url: '/src/assets/images/creator_lifestyle_coffee_1794135167276.jpg',
    aspect: '1:1',
    category: 'Lifestyle & Journal',
  },
  {
    id: 'asset-3',
    title: 'Modern Creator Tech Flatlay',
    url: '/src/assets/images/creator_tech_gadgets_1794135165979.jpg',
    aspect: '4:3',
    category: 'Gear Flatlay',
  },
  {
    id: 'asset-4',
    title: 'Creator Portrait Profile',
    url: '/src/assets/images/avatar_creator_profile_1794135166065.jpg',
    aspect: '1:1',
    category: 'Portrait & Avatar',
  },
];

export const PRIME_TIME_WINDOWS = [
  { time: '08:30', label: 'Morning Commute', desc: 'Cocok untuk LinkedIn & X (waktu perjalanan kerja)' },
  { time: '12:00', label: 'Lunch Break Boost', desc: 'Peak engagement Instagram & TikTok saat istirahat makan siang' },
  { time: '18:30', label: 'Prime Time Sore', desc: 'Waktu emas engagement tertinggi di seluruh platform' },
  { time: '20:30', label: 'Evening Relaxation', desc: 'Peak views YouTube Shorts & TikTok sebelum tidur' },
];
