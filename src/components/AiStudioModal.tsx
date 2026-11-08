import React, { useState } from 'react';
import { generateHooksApi, generateCaptionApi, repurposeContentApi, generateWeekPlanApi } from '../utils/api';
import { Post, Platform } from '../types/content';
import { X, Sparkles, Wand2, Copy, Check, ArrowRight, Calendar, Layers, Video, FileText, Loader2 } from 'lucide-react';

interface AiStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialMode?: 'hook' | 'caption' | 'repurpose' | 'week-plan';
  onApplyPost: (postData: Partial<Post>) => void;
  onApplyBatchPosts: (posts: Partial<Post>[]) => void;
}

export const AiStudioModal: React.FC<AiStudioModalProps> = ({
  isOpen,
  onClose,
  initialTopic = '',
  initialMode = 'hook',
  onApplyPost,
  onApplyBatchPosts,
}) => {
  const [activeTab, setActiveTab] = useState<'hook' | 'caption' | 'repurpose' | 'week-plan'>(
    initialMode
  );

  // Hook Generator state
  const [hookTopic, setHookTopic] = useState(initialTopic || '5 Cara Bangun Personal Branding di 2026');
  const [hookPlatform, setHookPlatform] = useState<Platform>('instagram');
  const [hookNiche, setHookNiche] = useState('Digital Creator & Bisnis');
  const [hookTone, setHookTone] = useState('Menarik & Relatable');
  const [hooksList, setHooksList] = useState<any[]>([]);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);

  // Caption Generator state
  const [captionTitle, setCaptionTitle] = useState(initialTopic || 'Formula Hook 3 Detik yang Bikin Viral');
  const [captionPillar, setCaptionPillar] = useState('Edukasi & Tips');
  const [captionResult, setCaptionResult] = useState<any | null>(null);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

  // Repurpose state
  const [repurposeInput, setRepurposeInput] = useState(
    'Alur kerja membuat 1 konten video panjang bisa dipecah jadi 1 carousel Instagram, 3 video TikTok pendek, dan 1 newsletter mingguan.'
  );
  const [repurposeResult, setRepurposeResult] = useState<any | null>(null);
  const [isRepurposing, setIsRepurposing] = useState(false);

  // 7-Day Plan state
  const [nicheInput, setNicheInput] = useState('Tech, Gadgets & Produktivitas');
  const [goalsInput, setGoalsInput] = useState('Menaikkan Engagement dan Follower Organik');
  const [weekPlanResult, setWeekPlanResult] = useState<any[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerateHooks = async () => {
    setIsGeneratingHooks(true);
    try {
      const res = await generateHooksApi(hookTopic, hookPlatform, hookNiche, hookTone);
      if (res.hooks) setHooksList(res.hooks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  const handleGenerateCaption = async () => {
    setIsGeneratingCaption(true);
    try {
      const res = await generateCaptionApi({
        title: captionTitle,
        pillar: captionPillar,
        platform: 'instagram',
      });
      if (res.result) setCaptionResult(res.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleRepurpose = async () => {
    setIsRepurposing(true);
    try {
      const res = await repurposeContentApi(repurposeInput, 'instagram');
      if (res.repurposed) setRepurposeResult(res.repurposed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRepurposing(false);
    }
  };

  const handleGenerateWeekPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await generateWeekPlanApi(nicheInput, goalsInput);
      if (res.plan) setWeekPlanResult(res.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const applyPlanToCalendar = () => {
    if (!weekPlanResult || weekPlanResult.length === 0) return;
    const baseDate = new Date(2026, 10, 9); // Monday Nov 9, 2026

    const newPosts: Partial<Post>[] = weekPlanResult.map((item, index) => {
      const targetDate = new Date(baseDate);
      targetDate.setDate(baseDate.getDate() + index);
      const dateStr = targetDate.toISOString().split('T')[0];

      return {
        title: item.title,
        hook: item.hook,
        caption: `${item.hook}\n\nTopik ini membahas strategi praktis seputar ${item.title}. Simpan postingan ini untuk contekan produksi kamu!`,
        platforms: [item.platform || 'instagram'],
        format: item.format || 'carousel',
        pillar: item.pillar || 'Edukasi & Tips',
        status: 'scheduled',
        scheduledDate: dateStr,
        scheduledTime: item.bestTime || '18:30',
        hashtags: ['#ContentPlanner', '#StrategiKonten', '#CreatorID'],
        engagementTarget: item.objective,
        notes: `Rencana AI untuk hari ${item.day}`,
      };
    });

    onApplyBatchPosts(newPosts);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#12151b] border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>AI Content Studio</span>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Asisten cerdas kreator: Hook viral, caption, repurposing, dan kalender mingguan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-neutral-800 bg-[#0e1117] overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('hook')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'hook'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>1. Generator Hook Viral</span>
          </button>

          <button
            onClick={() => setActiveTab('caption')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'caption'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Tulis Caption & Hashtags</span>
          </button>

          <button
            onClick={() => setActiveTab('repurpose')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'repurpose'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Repurpose 1 Jadi 3 Format</span>
          </button>

          <button
            onClick={() => setActiveTab('week-plan')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'week-plan'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>4. Rencana Konten 7 Hari</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: HOOK GENERATOR */}
          {activeTab === 'hook' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Topik / Ide Konten yang Mau Dibahas *
                  </label>
                  <input
                    type="text"
                    value={hookTopic}
                    onChange={(e) => setHookTopic(e.target.value)}
                    placeholder="misal: Cara konsisten bikin konten meski sibuk kerja kantor"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Tone Penyampaian</label>
                  <select
                    value={hookTone}
                    onChange={(e) => setHookTone(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Menarik & Relatable">Menarik & Relatable</option>
                    <option value="Tegas & Menggugah">Tegas & Menggugah</option>
                    <option value="Storytelling Hangat">Storytelling Hangat</option>
                    <option value="To-the-point & Edukatif">To-the-point & Edukatif</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateHooks}
                disabled={isGeneratingHooks || !hookTopic.trim()}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-all shadow-sm"
              >
                {isGeneratingHooks ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Meracik 5 Hook Viral...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Hasilkan 5 Variasi Hook AI</span>
                  </>
                )}
              </button>

              {/* Hooks Output Cards */}
              {hooksList.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    5 Pilihan Hook Siap Pakai:
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {hooksList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="text-[11px] font-semibold text-amber-400 font-mono">
                            {item.type}
                          </span>
                          <p className="text-sm font-semibold text-white leading-snug">
                            "{item.hook}"
                          </p>
                          <p className="text-[11px] text-neutral-400 italic">
                            {item.explanation}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => copyToClipboard(item.hook, `hook-${idx}`)}
                            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            title="Salin Hook"
                          >
                            {copiedIndex === `hook-${idx}` ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              onApplyPost({
                                title: hookTopic,
                                hook: item.hook,
                                pillar: 'Edukasi & Tips',
                                status: 'draft',
                              });
                              onClose();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all"
                          >
                            <span>Pakai di Jadwal</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CAPTION GENERATOR */}
          {activeTab === 'caption' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Judul Konten / Hook
                  </label>
                  <input
                    type="text"
                    value={captionTitle}
                    onChange={(e) => setCaptionTitle(e.target.value)}
                    placeholder="misal: 3 Strategi Konten Meningkatkan Watch Time"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Pilar Konten</label>
                  <select
                    value={captionPillar}
                    onChange={(e) => setCaptionPillar(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Edukasi & Tips">Edukasi & Tips</option>
                    <option value="Behind The Scenes">Behind The Scenes</option>
                    <option value="Personal & Story">Personal & Story</option>
                    <option value="Promosi & Launch">Promosi & Launch</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateCaption}
                disabled={isGeneratingCaption || !captionTitle.trim()}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-all shadow-sm"
              >
                {isGeneratingCaption ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyusun Caption Lengkap...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Buatkan Caption & Hashtags</span>
                  </>
                )}
              </button>

              {captionResult && (
                <div className="p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <span className="text-xs font-bold text-amber-400">Caption Siap Upload</span>
                    <button
                      onClick={() => copyToClipboard(captionResult.caption, 'cap-res')}
                      className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white"
                    >
                      {copiedIndex === 'cap-res' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Caption</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-200 whitespace-pre-wrap leading-relaxed">
                    {captionResult.caption}
                  </p>

                  <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap gap-1.5">
                    {(captionResult.hashtags || []).map((t: string) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-xs bg-neutral-950 text-sky-400 border border-neutral-800 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {captionResult.bestTimeTip && (
                    <div className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                      💡 <strong>Tips Waktu:</strong> {captionResult.bestTimeTip}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        onApplyPost({
                          title: captionTitle,
                          caption: captionResult.caption,
                          hashtags: captionResult.hashtags || [],
                          pillar: captionPillar as any,
                          status: 'scheduled',
                        });
                        onClose();
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
                    >
                      <span>Jadwalkan Konten Ini Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REPURPOSE CONTENT */}
          {activeTab === 'repurpose' && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Ide Inti / Skrip Konten Utama yang Mau Direpurpose:
                </label>
                <textarea
                  rows={3}
                  value={repurposeInput}
                  onChange={(e) => setRepurposeInput(e.target.value)}
                  placeholder="Ketik ide atau rangkuman konten Anda di sini..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleRepurpose}
                disabled={isRepurposing || !repurposeInput.trim()}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-all shadow-sm"
              >
                {isRepurposing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memecah Ide ke 3 Format...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Repurpose ke 3 Platform Berbeda</span>
                  </>
                )}
              </button>

              {repurposeResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Format 1: IG Carousel */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-pink-400 mb-2">
                        <Layers className="w-4 h-4" />
                        <span>Instagram Carousel 5 Slide</span>
                      </div>
                      <h5 className="text-xs font-semibold text-white mb-2">
                        {repurposeResult.instagramCarousel?.title}
                      </h5>
                      <div className="space-y-1.5 text-[11px] text-neutral-300">
                        {repurposeResult.instagramCarousel?.slides?.map((s: any, idx: number) => (
                          <div key={idx} className="bg-neutral-950 p-2 rounded border border-neutral-800/80">
                            <span className="font-mono text-neutral-500 font-bold mr-1">
                              Slide {s.slide}:
                            </span>
                            <span className="font-medium text-white">{s.heading}</span>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{s.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onApplyPost({
                          title: repurposeResult.instagramCarousel?.title,
                          platforms: ['instagram'],
                          format: 'carousel',
                          caption: `Carousel Slide Breakdown:\n` +
                            repurposeResult.instagramCarousel?.slides?.map((s: any) => `Slide ${s.slide} - ${s.heading}: ${s.content}`).join('\n\n'),
                          status: 'draft',
                        });
                        onClose();
                      }}
                      className="w-full mt-3 py-1.5 text-[11px] font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg"
                    >
                      + Buat Post Carousel
                    </button>
                  </div>

                  {/* Format 2: TikTok Video Script */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2">
                        <Video className="w-4 h-4" />
                        <span>TikTok & Shorts Script</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 block mb-2">
                        Durasi target: {repurposeResult.tiktokScript?.duration}
                      </span>
                      <div className="space-y-2 text-[11px]">
                        <div className="bg-neutral-950 p-2 rounded border border-neutral-800/80">
                          <span className="text-amber-400 font-mono font-bold">0-3s Hook:</span>
                          <p className="text-neutral-200 mt-0.5">{repurposeResult.tiktokScript?.hookSec0to3}</p>
                        </div>
                        <div className="bg-neutral-950 p-2 rounded border border-neutral-800/80">
                          <span className="text-sky-400 font-mono font-bold">4-35s Isi Tutorial:</span>
                          <p className="text-neutral-300 mt-0.5">{repurposeResult.tiktokScript?.bodySec4to35}</p>
                        </div>
                        <div className="bg-neutral-950 p-2 rounded border border-neutral-800/80">
                          <span className="text-emerald-400 font-mono font-bold">CTA Akhir:</span>
                          <p className="text-neutral-300 mt-0.5">{repurposeResult.tiktokScript?.ctaSec36to45}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onApplyPost({
                          title: 'Skrip TikTok: ' + repurposeInput.slice(0, 40) + '...',
                          hook: repurposeResult.tiktokScript?.hookSec0to3,
                          platforms: ['tiktok', 'youtube'],
                          format: 'video',
                          caption: `Skrip TikTok Video:\n\n[0-3s Hook]: ${repurposeResult.tiktokScript?.hookSec0to3}\n\n[Isi]: ${repurposeResult.tiktokScript?.bodySec4to35}\n\n[CTA]: ${repurposeResult.tiktokScript?.ctaSec36to45}`,
                          status: 'draft',
                        });
                        onClose();
                      }}
                      className="w-full mt-3 py-1.5 text-[11px] font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg"
                    >
                      + Buat Video TikTok
                    </button>
                  </div>

                  {/* Format 3: LinkedIn Value Post */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-2">
                        <FileText className="w-4 h-4" />
                        <span>LinkedIn Otoritas Post</span>
                      </div>
                      <p className="text-xs font-semibold text-white leading-snug mb-2">
                        {repurposeResult.linkedinPost?.headline}
                      </p>
                      <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80 text-[11px] text-neutral-300 space-y-2">
                        <p className="whitespace-pre-wrap">{repurposeResult.linkedinPost?.story}</p>
                        <p className="text-amber-400 font-medium pt-1 border-t border-neutral-800">
                          Pelajaran Utama: {repurposeResult.linkedinPost?.takeaway}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onApplyPost({
                          title: repurposeResult.linkedinPost?.headline || 'Post LinkedIn',
                          platforms: ['linkedin'],
                          format: 'text',
                          caption: `${repurposeResult.linkedinPost?.headline}\n\n${repurposeResult.linkedinPost?.story}\n\nTakeaway: ${repurposeResult.linkedinPost?.takeaway}`,
                          status: 'draft',
                        });
                        onClose();
                      }}
                      className="w-full mt-3 py-1.5 text-[11px] font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg"
                    >
                      + Buat Post LinkedIn
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 7-DAY WEEKLY CONTENT PLAN */}
          {activeTab === 'week-plan' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Niche / Bidang Kreator Anda
                  </label>
                  <input
                    type="text"
                    value={nicheInput}
                    onChange={(e) => setNicheInput(e.target.value)}
                    placeholder="misal: Desain Grafis & Freelance"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Tujuan Konten</label>
                  <input
                    type="text"
                    value={goalsInput}
                    onChange={(e) => setGoalsInput(e.target.value)}
                    placeholder="misal: Tambah Followers & Bangun Otoritas"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateWeekPlan}
                disabled={isGeneratingPlan}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-all shadow-sm"
              >
                {isGeneratingPlan ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Merancang Jadwal 7 Hari...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Buatkan Kalender Konten 7 Hari Otomatis</span>
                  </>
                )}
              </button>

              {weekPlanResult.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Jadwal 7 Hari Rekomendasi AI:
                    </h4>
                    <button
                      onClick={applyPlanToCalendar}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Terapkan 7 Konten ke Kalender Saya</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {weekPlanResult.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="w-16 font-bold text-amber-400 shrink-0 font-mono">
                            {item.day}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{item.title}</p>
                            <p className="text-[11px] text-neutral-400 truncate italic">
                              "{item.hook}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 text-neutral-400 text-[11px]">
                          <span className="capitalize text-neutral-300">{item.pillar}</span>
                          <span className="font-mono text-amber-300">{item.bestTime} WIB</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
