import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory & File backed post store
const DATA_FILE = path.join(__dirname, 'content-planner-data.json');

const INITIAL_SAMPLE_POSTS = [
  {
    id: 'post-1',
    title: '5 Kesalahan Fatal Content Creator Pemula di 2026',
    hook: 'Stop posting setiap hari kalau kalian masih ngelakuin 3 kesalahan fatal ini!',
    caption: `Banyak kreator terjebak di lingkaran "burnout" karena merasa harus upload konten 3x sehari. Padahal algoritma sekarang jauh lebih mementingkan:\n\n1. Watch Time & Retention Rate\n2. Save & Share Metric (Bukan cuma like!)\n3. Niche Authority & Kejelasan Topik\n\nFokus ke 2-3 konten bermutu tinggi per minggu jauh lebih berdampak daripada spam 10 konten template. Simpan postingan ini buat diingat pas bikin jadwal minggu depan!`,
    platforms: ['instagram', 'tiktok'],
    format: 'carousel',
    pillar: 'Edukasi & Tips',
    status: 'scheduled',
    scheduledDate: '2026-11-09',
    scheduledTime: '18:30',
    mediaUrl: '/src/assets/images/creator_desk_setup_1794135166490.jpg',
    mediaType: 'image',
    hashtags: ['#ContentCreatorTips', '#StrategiKonten', '#DigitalCreatorIndonesia', '#CreatorEconomy', '#TipsReels'],
    targetAudience: 'Kreator pemula & UMKM',
    estimatedReach: 12500,
    notes: 'Desain slide carousel pakai warna kontras. Slide 1 judul tebal, slide 5 CTA follow & save.',
    engagementTarget: 'Save > 300',
    createdAt: '2026-11-08T09:00:00Z',
    updatedAt: '2026-11-08T09:00:00Z'
  },
  {
    id: 'post-2',
    title: 'Setup Minimalis Workspace Creator: Produktif Tanpa Ribet',
    hook: 'Nggak butuh studio mahal buat mulai bikin video berkualitas profesional.',
    caption: `Setup kerja sederhana yang aku pakai buat produksi ratusan video:\n\n• Audio: Mic condenser USB dengan shock mount sederhana\n• Lighting: Key light 45 derajat + soft natural window light\n• Kamera: Smartphone kamera utama + tripod kokoh\n• Editing: iPad + stylus buat storyboard cepat\n\nInvestasi terbesar bukan di gear termahal, tapi konsistensi ide dan storytelling kamu. Mana gear yang paling pengen kamu upgrade tahun ini? Komen di bawah yuk!`,
    platforms: ['instagram', 'youtube'],
    format: 'reel',
    pillar: 'Behind The Scenes',
    status: 'published',
    scheduledDate: '2026-11-07',
    scheduledTime: '12:00',
    mediaUrl: '/src/assets/images/creator_tech_gadgets_1794135165979.jpg',
    mediaType: 'image',
    hashtags: ['#WorkspaceSetup', '#CreatorStudio', '#MinimalistDesk', '#BehindTheScenes', '#VideoProduction'],
    targetAudience: 'Tech & Lifestyle Enthusiasts',
    estimatedReach: 8900,
    notes: 'Format 9:16 vertical video. Durasi 45 detik dengan transisi snappy.',
    engagementTarget: 'Comments > 50',
    createdAt: '2026-11-06T10:00:00Z',
    updatedAt: '2026-11-07T12:05:00Z'
  },
  {
    id: 'post-3',
    title: 'Rahasia Menulis Hook Konten yang Bikin Jempol Berhenti Scrolling',
    hook: '3 detik pertama menentukan 80% keberhasilan video kamu.',
    caption: `Formula hook 3 detik yang terbukti menaikkan retention rate hingga 240%:\n\n1. The Negative Frame: "Jangan lakukan ini..." (Picu rasa penasaran)\n2. The Immediate Payoff: "Trik 1 menit ini hemat 3 jam waktu edit kamu"\n3. Visual Pattern Interrupt: Tunjukkan hasil akhir dulu sebelum prosesnya.\n\nSimpan template ini dan uji di video kamu berikutnya!`,
    platforms: ['tiktok', 'instagram', 'threads'],
    format: 'video',
    pillar: 'Edukasi & Tips',
    status: 'scheduled',
    scheduledDate: '2026-11-10',
    scheduledTime: '19:15',
    mediaUrl: '/src/assets/images/creator_lifestyle_coffee_1794135167276.jpg',
    mediaType: 'image',
    hashtags: ['#HookKonten', '#TipsTikTok', '#StrategiViral', '#Storytelling', '#CopywritingTips'],
    targetAudience: 'Kreator Edukasi & Marketer',
    estimatedReach: 15000,
    notes: 'Siapkan text overlay bold di awal detik ke-0.',
    engagementTarget: 'Share > 150',
    createdAt: '2026-11-08T08:30:00Z',
    updatedAt: '2026-11-08T08:30:00Z'
  },
  {
    id: 'post-4',
    title: 'Curhat Realita Jadi Full-time Creator: Ekspektasi vs Kenyataan',
    hook: 'Semua orang pamer kebebasan waktu, tapi jarang yang bahas kesepian di balik layar.',
    caption: `Tahun ketiga transisi dari jam kantor 9-to-5 ke full-time content creator.\n\nYang orang lihat: Bebas bangun siang, kerja di cafe estetik, brand deals masuk sendiri.\n\nRealitanya: Tidak ada jam pasti berhenti kerja, algoritma naik turun bikin cemas, dan self-discipline harus 10x lipat lebih kuat.\n\nTapi kalau ditanya menyesal? Sama sekali nggak. Karena proses belajar dan kebebasan berkarya ini nggak ternilai.\n\nBuat teman-teman yang lagi merintis, tetap semangat ya! Langkah kecilmu hari ini ada hasilnya kelak.`,
    platforms: ['linkedin', 'threads', 'instagram'],
    format: 'text',
    pillar: 'Personal & Story',
    status: 'draft',
    scheduledDate: '2026-11-12',
    scheduledTime: '08:30',
    mediaUrl: '/src/assets/images/avatar_creator_profile_1794135166065.jpg',
    mediaType: 'image',
    hashtags: ['#CreatorJourney', '#WorkLifeBalance', '#Solopreneur', '#MindsetKreator', '#PersonalBranding'],
    targetAudience: 'Profesional & Aspiring Creators',
    estimatedReach: 6500,
    notes: 'Gunakan tone introspektif dan jujur. Cocok buat engagement di LinkedIn & Threads.',
    engagementTarget: 'Comments > 80',
    createdAt: '2026-11-08T07:15:00Z',
    updatedAt: '2026-11-08T07:15:00Z'
  },
  {
    id: 'post-5',
    title: 'Peluncuran Template Notion Content Planner 2026',
    hook: 'Akhirnya sistem yang aku pakai buat kelola 50+ postingan sebulan dibuka untuk umum!',
    caption: `Kerapian sistem adalah kunci konsistensi tanpa burnout.\n\nMemperkenalkan Notion Content OS 2026:\n✓ Kalender editorial otomatis\n✓ Bank ide konten & formula hook\n✓ Tracker analitik mingguan\n✓ Manajemen sponsorship & invoice\n\nKhusus 100 orang pertama hari ini ada diskon early-bird 50%. Link di bio atau ketik "SISTEM" di DM buat langsung dapetin aksesnya!`,
    platforms: ['instagram', 'x', 'tiktok'],
    format: 'carousel',
    pillar: 'Promosi & Launch',
    status: 'idea',
    scheduledDate: '2026-11-14',
    scheduledTime: '20:00',
    mediaUrl: '/src/assets/images/creator_tech_gadgets_1794135165979.jpg',
    mediaType: 'image',
    hashtags: ['#DigitalProduct', '#TemplateNotion', '#ProductivityHacks', '#CreatorTools', '#Launching'],
    targetAudience: 'Komunitas Pengikut Setia',
    estimatedReach: 20000,
    notes: 'Follow up dengan 3 Story berseri di IG saat jam peluncuran.',
    engagementTarget: 'Conversion / Click-through > 250',
    createdAt: '2026-11-08T06:00:00Z',
    updatedAt: '2026-11-08T06:00:00Z'
  }
];

let postsCache: any[] = [];

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      postsCache = JSON.parse(content);
    } else {
      postsCache = [...INITIAL_SAMPLE_POSTS];
      saveData();
    }
  } catch (err) {
    postsCache = [...INITIAL_SAMPLE_POSTS];
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(postsCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save data file:', err);
  }
}

loadData();

// API Endpoints for Posts CRUD
app.get('/api/posts', (_req: Request, res: Response) => {
  res.json({ success: true, posts: postsCache });
});

app.post('/api/posts', (req: Request, res: Response) => {
  const newPost = {
    ...req.body,
    id: req.body.id || `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  postsCache.unshift(newPost);
  saveData();
  res.status(201).json({ success: true, post: newPost });
});

app.put('/api/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = postsCache.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Post tidak ditemukan' });
  }
  postsCache[index] = {
    ...postsCache[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };
  saveData();
  res.json({ success: true, post: postsCache[index] });
});

app.delete('/api/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = postsCache.length;
  postsCache = postsCache.filter((p) => p.id !== id);
  if (postsCache.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Post tidak ditemukan' });
  }
  saveData();
  res.json({ success: true, message: 'Post berhasil dihapus' });
});

// Quick reset endpoint for testing
app.post('/api/posts/reset', (_req: Request, res: Response) => {
  postsCache = [...INITIAL_SAMPLE_POSTS];
  saveData();
  res.json({ success: true, posts: postsCache });
});

// AI Content Generation Endpoints using gemini-3.8-flash
app.post('/api/ai/generate-hooks', async (req: Request, res: Response) => {
  const { topic, platform = 'instagram', niche = 'general', tone = 'engaging' } = req.body;
  if (!topic) {
    return res.status(400).json({ success: false, error: 'Topic wajib diisi' });
  }

  if (ai) {
    try {
      const prompt = `Anda adalah asisten konsultan konten media sosial kelas dunia untuk kreator digital Indonesia.
Buatkan 5 variasi HOOK kalimat pembuka yang sangat memikat, scroll-stopping, dan natural dalam Bahasa Indonesia untuk konten tentang: "${topic}".
Platform tujuan: ${platform}
Niche: ${niche}
Tone: ${tone}

Format output HARUS JSON valid berupa array objek:
[
  {
    "type": "Curiosity Gap (Bikin Penasaran)",
    "hook": "Contoh kalimat hook...",
    "explanation": "Kenapa hook ini bekerja"
  },
  {
    "type": "Kontroversial / Opini Tajam",
    "hook": "Contoh kalimat...",
    "explanation": "..."
  },
  {
    "type": "Solusi Cepat & Angka",
    "hook": "Contoh kalimat...",
    "explanation": "..."
  },
  {
    "type": "Pertanyaan Menohok / Relatable",
    "hook": "Contoh kalimat...",
    "explanation": "..."
  },
  {
    "type": "Story / Pengakuan Personal",
    "hook": "Contoh kalimat...",
    "explanation": "..."
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'Anda adalah copywriter viral dan creative director media sosial untuk kreator Indonesia. Output harus JSON murni.',
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json({ success: true, hooks: parsed });
    } catch (err: any) {
      console.warn('Gemini generate-hooks fallback:', err?.message);
    }
  }

  // High quality fallback hooks
  const fallbackHooks = [
    {
      type: 'Curiosity Gap (Bikin Penasaran)',
      hook: `Hal yang paling disembunyikan tentang ${topic} yang jarang dibahas orang...`,
      explanation: 'Memicu dopamine dan rasa ingin tahu penonton dalam 2 detik pertama.'
    },
    {
      type: 'Kontroversial / Opini Tajam',
      hook: `Stop lakuin ${topic} cara lama kalau kamu nggak mau rugi waktu!`,
      explanation: 'Menantang kebiasaan umum sehingga penonton tergerak membantah atau menyimak.'
    },
    {
      type: 'Solusi Cepat & Angka',
      hook: `3 rumus sederhana buat optimalkan ${topic} dalam waktu kurang dari 5 menit.`,
      explanation: 'Memberikan janji hasil nyata yang spesifik dan terukur.'
    },
    {
      type: 'Pertanyaan Menohok / Relatable',
      hook: `Pernah ngerasa udah capek-capek mikirin ${topic} tapi hasilnya jalan di tempat?`,
      explanation: 'Menghubungkan langsung dengan frustrasi nyata audiens.'
    },
    {
      type: 'Story / Pengakuan Personal',
      hook: `Kesalahan terbesar yang pernah aku buat pas mulai fokus di ${topic}...`,
      explanation: 'Membangun trust dan koneksi emosional lewat kerentanan.'
    }
  ];
  res.json({ success: true, hooks: fallbackHooks });
});

app.post('/api/ai/generate-caption', async (req: Request, res: Response) => {
  const { title, hook, pillar = 'Edukasi', platform = 'instagram', audience = 'Kreator' } = req.body;

  if (ai) {
    try {
      const prompt = `Buatkan caption postingan media sosial yang lengkap, rapi, dan konversi tinggi dalam Bahasa Indonesia.
Judul/Topik: ${title}
Hook awal: ${hook || title}
Pilar Konten: ${pillar}
Platform: ${platform}
Target Audiens: ${audience}

Format output HARUS JSON valid dengan struktur:
{
  "caption": "Teks caption lengkap dengan spacing paragraf rapi, poin-poin jelas, dan Call To Action kuat",
  "callToAction": "Kalimat ajakan bertindak spesifik (komen, save, share, klik link)",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "visualPrompt": "Saran visual / thumbnail yang cocok untuk mendampingi caption ini",
  "bestTimeTip": "Saran waktu posting terbaik untuk topik ini"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'Anda adalah master content planner dan copywriter media sosial handal.',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, result: parsed });
    } catch (err: any) {
      console.warn('Gemini caption fallback:', err?.message);
    }
  }

  // Fallback caption generator
  const fallbackResult = {
    caption: `${hook || title}\n\nBanyak orang mengira konsistensi di media sosial itu tentang seberapa sering kita posting. Faktanya, kualitas dan kejelasan pesan jauh lebih diutamakan.\n\nBerikut 3 poin penting yang perlu diingat:\n1. Tentukan satu tujuan per konten (edukasi, menghibur, atau promosi).\n2. Buat pembukaan yang to-the-point tanpa basa-basi.\n3. Ajak audiens berdialog di kolom komentar.\n\nBagaimana pengalaman teman-teman sejauh ini? Tulis pendapat kalian di kolom komentar ya!`,
    callToAction: 'Simpan postingan ini untuk contekan ide kamu minggu ini & bagikan ke teman sesama kreator!',
    hashtags: ['#CreatorEconomy', '#StrategiKonten', '#ContentPlanner', '#TipsKreator', '#DigitalMarketingID'],
    visualPrompt: 'Foto meja kerja minimalis dengan pencahayaan hangat dan catatan editorial yang rapi.',
    bestTimeTip: 'Waktu terbaik posting untuk platform ini adalah jam 18:30 - 20:30 WIB saat audiens bersantai.'
  };
  res.json({ success: true, result: fallbackResult });
});

app.post('/api/ai/repurpose-content', async (req: Request, res: Response) => {
  const { originalContent, originalPlatform = 'instagram' } = req.body;
  if (!originalContent) {
    return res.status(400).json({ success: false, error: 'Konten asal wajib diisi' });
  }

  if (ai) {
    try {
      const prompt = `Anda adalah Content Strategist. Ambil ide/konten asal berikut dan buatkan adaptasi (repurpose) ke 3 format platform berbeda:
Konten Asal (${originalPlatform}):
"${originalContent}"

Keluarkan JSON valid:
{
  "instagramCarousel": {
    "title": "Judul Carousel",
    "slides": [
      {"slide": 1, "heading": "Cover/Hook", "content": "Teks cover"},
      {"slide": 2, "heading": "Masalah", "content": "Penjelasan"},
      {"slide": 3, "heading": "Solusi Poin 1", "content": "Detail"},
      {"slide": 4, "heading": "Solusi Poin 2", "content": "Detail"},
      {"slide": 5, "heading": "CTA & Ringkasan", "content": "Aksi"}
    ]
  },
  "tiktokScript": {
    "duration": "45 detik",
    "hookSec0to3": "Visual & Voiceover hook",
    "bodySec4to35": "Isi daging / tutorial cepat",
    "ctaSec36to45": "Call to action penutup"
  },
  "linkedinPost": {
    "headline": "Satu baris pembuka profesional",
    "story": "Uraian format insight karir / bisnis / produktivitas",
    "takeaway": "Pelajaran utama"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'Anda adalah Content Repurposing Expert. Maksimalkan efisiensi kreator.',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, repurposed: parsed });
    } catch (err: any) {
      console.warn('Gemini repurpose fallback:', err?.message);
    }
  }

  // Fallback repurpose
  const fallbackRepurpose = {
    instagramCarousel: {
      title: 'Panduan Praktis Step-by-Step',
      slides: [
        { slide: 1, heading: 'Cover', content: originalContent.slice(0, 60) + '...' },
        { slide: 2, heading: 'Realita', content: 'Kenapa cara lama seringkali bikin waktu kita terbuang sia-sia.' },
        { slide: 3, heading: 'Langkah 1', content: 'Fokus ke satu topik spesifik yang kamu kuasai.' },
        { slide: 4, heading: 'Langkah 2', content: 'Gunakan template konsisten agar proses produksi cepat.' },
        { slide: 5, heading: 'Penutup', content: 'Save slide ini biar gak lupa pas jadwal produksi konten!' }
      ]
    },
    tiktokScript: {
      duration: '40 detik',
      hookSec0to3: 'Tatap kamera, tunjukkan gestur stop: "' + originalContent.slice(0, 45) + '"',
      bodySec4to35: 'Bahas 3 poin cepat dengan screen recording atau b-roll dinamis tiap 3 detik.',
      ctaSec36to45: 'Komen "MAU" di bawah kalau kamu butuh panduan lengkapnya, nanti aku DM!'
    },
    linkedinPost: {
      headline: 'Efisiensi bukan tentang bekerja lebih keras, tapi membangun alur kerja yang repeatable.',
      story: originalContent + '\n\nBagi seorang kreator mandiri, membagi waktu antara riset, produksi, dan distribusi adalah tantangan terbesar.',
      takeaway: 'Sistem yang baik membebaskan energi kreatif Anda.'
    }
  };
  res.json({ success: true, repurposed: fallbackRepurpose });
});

// 7-day content matrix generator
app.post('/api/ai/generate-week-plan', async (req: Request, res: Response) => {
  const { niche = 'Kreator & Produktivitas', goals = 'Naikkan Engagement & Followers' } = req.body;

  if (ai) {
    try {
      const prompt = `Buatkan jadwal rencana konten 7 hari (Senin s/d Minggu) yang seimbang untuk kreator di niche "${niche}" dengan tujuan "${goals}".
Kombinasikan pilar: Edukasi, Hiburan/Relatable, Behind The Scenes, Personal Story, dan Promosi/Value.

Format output JSON valid berupa array 7 hari:
[
  {
    "day": "Senin",
    "pillar": "Edukasi & Tips",
    "platform": "instagram",
    "format": "carousel",
    "title": "Ide Judul Konten",
    "hook": "Hook pembuka",
    "bestTime": "12:00",
    "objective": "Menarik save & share"
  },
  ...
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'Anda adalah Senior Content Strategist untuk media sosial Indonesia.',
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json({ success: true, plan: parsed });
    } catch (err: any) {
      console.warn('Gemini week-plan fallback:', err?.message);
    }
  }

  // Fallback 7-day plan
  const fallbackPlan = [
    { day: 'Senin', pillar: 'Edukasi & Tips', platform: 'instagram', format: 'carousel', title: `5 Cara Mulai ${niche} dari Nol`, hook: 'Jangan mulai sebelum tahu 5 fondasi ini...', bestTime: '12:00', objective: 'Tingkatkan Save & Share' },
    { day: 'Selasa', pillar: 'Behind The Scenes', platform: 'tiktok', format: 'video', title: 'Rutinitas Pagi & Persiapan Bikin Konten', hook: 'Ini yang terjadi sebelum tombol record dipencet...', bestTime: '19:00', objective: 'Humanize brand & relate' },
    { day: 'Rabu', pillar: 'Opini & Diskusi', platform: 'threads', format: 'text', title: 'Mitos Terbesar di Industri Ini yang Harus Berhenti', hook: 'Pendapat tidak populer tentang cara kerja algoritma...', bestTime: '08:30', objective: 'Picu diskusi komentar' },
    { day: 'Kamis', pillar: 'Tutorial & How-to', platform: 'youtube', format: 'reel', title: 'Tutorial Cepat 60 Detik Step by Step', hook: 'Trik rahasia yang cuma butuh waktu 1 menit...', bestTime: '18:30', objective: 'Watch time tinggi' },
    { day: 'Jumat', pillar: 'Personal Story', platform: 'linkedin', format: 'text', title: 'Pelajaran Terbesar Minggu Ini', hook: 'Satu keputusan kecil yang mengubah alur kerja saya...', bestTime: '09:00', objective: 'Membangun trust & authority' },
    { day: 'Sabtu', pillar: 'Hiburan / Relatable', platform: 'tiktok', format: 'video', title: 'Ekspektasi vs Realita Jadi Kreator', hook: 'Ada yang ngerasain hal yang sama pas lagi ngedit?', bestTime: '20:00', objective: 'Viral reach & share' },
    { day: 'Minggu', pillar: 'Refleksi & Q&A', platform: 'instagram', format: 'story', title: 'Review Target Mingguan & Sesi Tanya Jawab', hook: 'Berapa persen target minggu ini yang tercapai?', bestTime: '19:30', objective: 'Koneksi intim dengan followers' }
  ];
  res.json({ success: true, plan: fallbackPlan });
});

// Setup Vite or static serving
async function setupServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 KarsaPost Server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
