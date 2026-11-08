import React, { useState, useEffect } from 'react';
import { Post, Platform, ContentFormat, ContentPillar, PostStatus } from '../types/content';
import { PLATFORMS, CONTENT_PILLARS, CONTENT_FORMATS, STATUS_CONFIG, DEFAULT_MEDIA_ASSETS } from '../utils/constants';
import { X, Sparkles, Image as ImageIcon, Clock, Check, Eye, Trash2, Copy, AlertCircle } from 'lucide-react';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onSave: (post: Partial<Post>) => void;
  onDelete?: (id: string) => void;
  onOpenAiStudioForField: (topic: string, mode: 'hook' | 'caption') => void;
}

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  isOpen,
  onClose,
  post,
  onSave,
  onDelete,
  onOpenAiStudioForField,
}) => {
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    hook: '',
    caption: '',
    platforms: ['instagram'],
    format: 'carousel',
    pillar: 'Edukasi & Tips',
    status: 'scheduled',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '18:30',
    mediaUrl: DEFAULT_MEDIA_ASSETS[0].url,
    mediaType: 'image',
    hashtags: ['#ContentCreator', '#StrategiKonten', '#DigitalCreator'],
    targetAudience: 'Kreator & Profesional Muda',
    estimatedReach: 10000,
    notes: '',
    engagementTarget: 'Save > 150',
  });

  const [newHashtag, setNewHashtag] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData(post);
    } else {
      setFormData({
        title: '',
        hook: '',
        caption: '',
        platforms: ['instagram'],
        format: 'carousel',
        pillar: 'Edukasi & Tips',
        status: 'scheduled',
        scheduledDate: '2026-11-09',
        scheduledTime: '18:30',
        mediaUrl: DEFAULT_MEDIA_ASSETS[0].url,
        mediaType: 'image',
        hashtags: ['#ContentCreator', '#StrategiKonten', '#DigitalCreator'],
        targetAudience: 'Kreator & Profesional Muda',
        estimatedReach: 10000,
        notes: '',
        engagementTarget: 'Save > 150',
      });
    }
  }, [post, isOpen]);

  if (!isOpen) return null;

  const togglePlatform = (p: Platform) => {
    const current = formData.platforms || [];
    if (current.includes(p)) {
      if (current.length > 1) {
        setFormData({ ...formData, platforms: current.filter((x) => x !== p) });
      }
    } else {
      setFormData({ ...formData, platforms: [...current, p] });
    }
  };

  const handleAddHashtag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if (!newHashtag.trim()) return;
    let tag = newHashtag.trim();
    if (!tag.startsWith('#')) tag = `#${tag}`;
    const list = formData.hashtags || [];
    if (!list.includes(tag)) {
      setFormData({ ...formData, hashtags: [...list, tag] });
    }
    setNewHashtag('');
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      hashtags: (formData.hashtags || []).filter((t) => t !== tagToRemove),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Judul postingan wajib diisi');
      return;
    }
    onSave(formData);
    onClose();
  };

  // Primary platform for character limits
  const primaryPlatformKey = (formData.platforms && formData.platforms[0]) || 'instagram';
  const primaryPlatformConfig = PLATFORMS[primaryPlatformKey];
  const charCount = (formData.caption || '').length;
  const isOverLimit = charCount > primaryPlatformConfig.maxChars;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#12151b] border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60 shrink-0">
          <div>
            <h3 className="text-base font-bold text-white">
              {post ? 'Edit Konten Terjadwal' : 'Buat Rencana Konten Baru'}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Atur detail jadwal, hook, caption, dan media untuk publikasi efisien
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                showPreview
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Tutup Preview' : 'Preview Tampilan'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form Fields (Left Column) */}
          <form
            id="post-editor-form"
            onSubmit={handleSubmit}
            className={`${showPreview ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-5`}
          >
            {/* Title & AI Hook trigger */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-200">
                  Judul Konten / Topik Utama *
                </label>
                <button
                  type="button"
                  onClick={() => onOpenAiStudioForField(formData.title || '', 'hook')}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Bantuan AI Hook</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="misal: 5 Kesalahan Fatal Content Creator Pemula di 2026"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Hook Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-200">
                Hook Pembuka (3 Detik Pertama / Baris Pertama)
              </label>
              <input
                type="text"
                placeholder="misal: Stop posting tiap hari kalau kalian masih ngelakuin kesalahan ini!"
                value={formData.hook || ''}
                onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-amber-300 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 italic"
              />
            </div>

            {/* Platform Multi-Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-200">
                Pilih Platform Distribusi
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PLATFORMS) as Platform[]).map((pKey) => {
                  const p = PLATFORMS[pKey];
                  const isSelected = (formData.platforms || []).includes(pKey);
                  return (
                    <button
                      type="button"
                      key={pKey}
                      onClick={() => togglePlatform(pKey)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-neutral-800 text-white border-neutral-600 shadow-sm'
                          : 'bg-neutral-950 text-neutral-500 border-neutral-800 hover:text-neutral-300'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: p.iconColor }}
                      />
                      <span>{p.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Two-Column Grid: Format, Pillar, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-200">Format</label>
                <select
                  value={formData.format || 'carousel'}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value as ContentFormat })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                >
                  {CONTENT_FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pillar */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-200">Pilar Konten</label>
                <select
                  value={formData.pillar || 'Edukasi & Tips'}
                  onChange={(e) => setFormData({ ...formData, pillar: e.target.value as ContentPillar })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                >
                  {CONTENT_PILLARS.map((pil) => (
                    <option key={pil.name} value={pil.name}>
                      {pil.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-200">Status Alur</label>
                <select
                  value={formData.status || 'scheduled'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatus })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                >
                  {(Object.keys(STATUS_CONFIG) as PostStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Schedule Date & Time Row */}
            <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Jadwal Tanggal & Jam Tayang</span>
                </label>
                <span className="text-[11px] text-neutral-400">Waktu Indonesia Barat (WIB)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="date"
                    value={formData.scheduledDate || ''}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono tabular-nums focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={formData.scheduledTime || '18:30'}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-amber-400 font-mono tabular-nums focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Quick Optimal Time recommendations */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] text-neutral-400">Rekomendasi Waktu Terbaik:</span>
                {['08:30', '12:00', '18:30', '20:30'].map((time) => (
                  <button
                    type="button"
                    key={time}
                    onClick={() => setFormData({ ...formData, scheduledTime: time })}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono tabular-nums transition-colors ${
                      formData.scheduledTime === time
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-800 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {time} WIB
                  </button>
                ))}
              </div>
            </div>

            {/* Media Asset Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-200">
                  Media / Thumbnail Konten
                </label>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{showMediaPicker ? 'Tutup Pustaka Media' : 'Pilih dari Aset Kreator'}</span>
                </button>
              </div>

              {showMediaPicker && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  {DEFAULT_MEDIA_ASSETS.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        setFormData({ ...formData, mediaUrl: asset.url });
                        setShowMediaPicker(false);
                      }}
                      className={`cursor-pointer rounded-lg overflow-hidden border transition-all ${
                        formData.mediaUrl === asset.url
                          ? 'border-amber-400 ring-2 ring-amber-400/20'
                          : 'border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <img
                        src={asset.url}
                        alt={asset.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-20 object-cover"
                      />
                      <p className="text-[10px] text-neutral-400 p-1 truncate bg-neutral-900">
                        {asset.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview currently chosen media */}
              {formData.mediaUrl && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                  <img
                    src={formData.mediaUrl}
                    alt="Selected media"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded bg-neutral-950"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-200 truncate">{formData.mediaUrl}</p>
                    <span className="text-[10px] text-neutral-500">Aset terpilih untuk postingan</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaUrl: undefined })}
                    className="text-xs text-neutral-500 hover:text-rose-400 px-2 py-1"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>

            {/* Caption Textarea & AI Caption trigger */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-200">
                  Caption & Script Lengkap
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenAiStudioForField(formData.title || '', 'caption')}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Caption AI</span>
                  </button>
                  <span
                    className={`text-[11px] font-mono tabular-nums ${
                      isOverLimit ? 'text-rose-400 font-bold' : 'text-neutral-500'
                    }`}
                  >
                    {charCount}/{primaryPlatformConfig.maxChars}
                  </span>
                </div>
              </div>
              <textarea
                rows={5}
                placeholder="Tulis caption lengkap, poin-poin penjelasan, dan Call-To-Action (CTA)..."
                value={formData.caption || ''}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
              />
            </div>

            {/* Hashtags Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-200">
                Hashtags & Kata Kunci
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ketik hashtag baru (contoh: #tipsreels) lalu tekan Enter..."
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  onKeyDown={handleAddHashtag}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddHashtag}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white rounded-lg transition-colors"
                >
                  Tambah
                </button>
              </div>

              {/* Hashtag items */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(formData.hashtags || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-neutral-900 border border-neutral-800 text-amber-300 font-mono"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(tag)}
                      className="text-neutral-500 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Target Audience & Target Metrik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300">Target Audiens</label>
                <input
                  type="text"
                  placeholder="misal: Freelancer & UMKM"
                  value={formData.targetAudience || ''}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300">Target Metrik</label>
                <input
                  type="text"
                  placeholder="misal: Save > 200, Share > 50"
                  value={formData.engagementTarget || ''}
                  onChange={(e) => setFormData({ ...formData, engagementTarget: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          </form>

          {/* Live Mobile Post Preview (Right Column if showPreview) */}
          {showPreview && (
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-neutral-800 lg:pl-6 pt-4 lg:pt-0 flex flex-col items-center">
              <div className="w-full max-w-sm sticky top-0">
                <div className="text-xs font-semibold text-neutral-400 mb-2 flex items-center justify-between">
                  <span>Simulasi Feed Instagram</span>
                  <span className="font-mono tabular-nums text-amber-400">
                    {formData.scheduledTime} WIB
                  </span>
                </div>

                {/* Simulated Instagram Post Card */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl text-white text-xs">
                  {/* Card Header */}
                  <div className="flex items-center gap-2.5 p-3 border-b border-neutral-900">
                    <img
                      src="/src/assets/images/avatar_creator_profile_1794135166065.jpg"
                      alt="Creator"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-neutral-800"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs truncate">winda.creative</p>
                      <p className="text-[10px] text-neutral-500">Audio Asli · Original</p>
                    </div>
                  </div>

                  {/* Card Media */}
                  <div className="aspect-square bg-neutral-900 relative">
                    {formData.mediaUrl ? (
                      <img
                        src={formData.mediaUrl}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-neutral-900 to-neutral-800">
                        <p className="font-bold text-sm text-amber-400 mb-2">{formData.title}</p>
                        <p className="text-xs text-neutral-300 italic">{formData.hook}</p>
                      </div>
                    )}
                  </div>

                  {/* Card Caption area */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-neutral-400 text-sm">
                      <div className="flex items-center gap-3">
                        <span>♡</span>
                        <span>💬</span>
                        <span>↗</span>
                      </div>
                      <span>☖</span>
                    </div>

                    <div className="space-y-1">
                      <p className="leading-snug">
                        <strong className="font-bold mr-1">winda.creative</strong>
                        {formData.hook && <span className="font-semibold block mb-1">{formData.hook}</span>}
                        <span className="text-neutral-300 whitespace-pre-wrap line-clamp-4">
                          {formData.caption}
                        </span>
                      </p>
                      {formData.hashtags && formData.hashtags.length > 0 && (
                        <p className="text-[11px] text-sky-400 font-mono">
                          {formData.hashtags.join(' ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-900/80 shrink-0">
          <div>
            {post && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Hapus konten ini secara permanen?')) {
                    onDelete(post.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Konten</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              form="post-editor-form"
              className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all"
            >
              {post ? 'Simpan Perubahan' : 'Jadwalkan Konten'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
