import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  BookOpen, Trophy, X, ChevronDown, Check, Loader2, FileText, List,
  SkipForward, Square, Volume2, AlertCircle, Bookmark, BookmarkCheck,
} from "lucide-react";
import { toArabicNumerals } from "@/lib/utils";
import {
  loadPreferencesSync, loadPreferences, savePreferences,
  loadBookmarks, saveBookmark, deleteBookmark,
  loadKhatmaPages, saveKhatmaPages,
  addToHistory,
  type QuranBookmark,
} from "@/lib/quran-storage";

// ── Constants ────────────────────────────────────────────────────────────────

const TOTAL_PAGES = 604;
const RECITER     = "ar.minshawi"; // الشيخ محمد صديق المنشاوي رحمه الله
const AUDIO_BASE  = `https://cdn.islamic.network/quran/audio/128/${RECITER}`;
const SPEEDS      = [0.75, 1.0, 1.25, 1.5] as const;
const MIN_FONT    = 18;
const MAX_FONT    = 40;

type Mode = "page" | "surah";

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// ── Component ────────────────────────────────────────────────────────────────

export function QuranReader() {
  // ── Initialise from synchronous localStorage (prevents flicker) ──────────
  const syncPrefs = loadPreferencesSync();

  const [prefsLoaded, setPrefsLoaded]       = useState(false);
  const [mode, setMode]                     = useState<Mode>(syncPrefs.mode);
  const [currentPage, setCurrentPage]       = useState<number>(syncPrefs.currentPage);
  const [selectedSurah, setSelectedSurah]   = useState<number>(syncPrefs.currentSurah);
  const [fontSize, setFontSize]             = useState<number>(syncPrefs.fontSize);
  const [playbackSpeed, setPlaybackSpeed]   = useState<number>(syncPrefs.playbackSpeed);
  const [volume, setVolume]                 = useState<number>(syncPrefs.volume);

  // ── Surah browser state ──────────────────────────────────────────────────
  const [pageInput, setPageInput]           = useState("");
  const [surahList, setSurahList]           = useState<any[]>([]);
  const [surahSearch, setSurahSearch]       = useState("");

  // ── Content state ────────────────────────────────────────────────────────
  const [verses, setVerses]                 = useState<any[]>([]);
  const [loading, setLoading]               = useState(false);
  const [surahNames, setSurahNames]         = useState<Record<number, string>>({});

  // ── Audio state ──────────────────────────────────────────────────────────
  const [activeVerse, setActiveVerse]       = useState<any | null>(null);
  const [isPlaying, setIsPlaying]           = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [audioProgress, setAudioProgress]   = useState(0);
  const [audioDuration, setAudioDuration]   = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioError, setAudioError]         = useState(false);
  const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);

  // ── Khatma state ────────────────────────────────────────────────────────
  const [pagesRead, setPagesRead]           = useState<Set<number>>(new Set());
  const [showKhatma, setShowKhatma]         = useState(false);

  // ── Bookmarks state ──────────────────────────────────────────────────────
  const [bookmarks, setBookmarks]           = useState<Map<string, QuranBookmark>>(new Map());
  const [showBookmarks, setShowBookmarks]   = useState(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const audioRef           = useRef<HTMLAudioElement | null>(null);
  const activeVerseRef     = useRef<HTMLElement | null>(null);
  const versesRef          = useRef<any[]>([]);
  const playbackSpeedRef   = useRef(playbackSpeed);
  const volumeRef          = useRef(volume);
  const pendingAutoplayRef = useRef(false); // queued after browser blocks autoplay

  versesRef.current    = verses;
  playbackSpeedRef.current = playbackSpeed;
  volumeRef.current    = volume;

  // ── Load full preferences from IndexedDB on mount ────────────────────────
  useEffect(() => {
    Promise.all([
      loadPreferences(),
      loadKhatmaPages(),
      loadBookmarks(),
    ]).then(([prefs, khatmaPages, bkList]) => {
      setMode(prefs.mode);
      setCurrentPage(prefs.currentPage);
      setSelectedSurah(prefs.currentSurah);
      setFontSize(prefs.fontSize);
      setPlaybackSpeed(prefs.playbackSpeed);
      setVolume(prefs.volume);
      playbackSpeedRef.current = prefs.playbackSpeed;
      volumeRef.current = prefs.volume;
      setPagesRead(khatmaPages);
      const map = new Map<string, QuranBookmark>();
      bkList.forEach(b => map.set(b.verseKey, b));
      setBookmarks(map);
      setPrefsLoaded(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch surah list once ─────────────────────────────────────────────────
  useEffect(() => {
    fetch("https://api.quran.com/api/v4/chapters?language=ar")
      .then(r => r.json())
      .then(d => {
        setSurahList(d.chapters || []);
        const map: Record<number, string> = {};
        (d.chapters || []).forEach((c: any) => { map[c.id] = c.name_arabic; });
        setSurahNames(map);
      })
      .catch(() => {});
  }, []);

  // ── Persist preferences on change (skip before prefs are loaded) ─────────
  useEffect(() => {
    if (!prefsLoaded) return;
    savePreferences({ mode, currentPage, currentSurah: selectedSurah });
  }, [prefsLoaded, mode, currentPage, selectedSurah]);

  useEffect(() => {
    if (!prefsLoaded) return;
    savePreferences({ fontSize });
  }, [prefsLoaded, fontSize]);

  useEffect(() => {
    if (!prefsLoaded) return;
    savePreferences({ playbackSpeed });
  }, [prefsLoaded, playbackSpeed]);

  useEffect(() => {
    if (!prefsLoaded) return;
    savePreferences({ volume });
  }, [prefsLoaded, volume]);

  // ── Track reading history (page mode only) ──────────────────────────────
  useEffect(() => {
    if (mode === "page") addToHistory(currentPage).catch(() => {});
  }, [mode, currentPage]);

  // ── Core audio stop ───────────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended         = null;
      audioRef.current.onerror         = null;
      audioRef.current.ontimeupdate    = null;
      audioRef.current.onloadedmetadata = null;
      audioRef.current                 = null;
    }
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);
  }, []);

  // ── Play verse at index ───────────────────────────────────────────────────
  const playVerseAtIndex = useCallback((index: number, autoPlay = true) => {
    const vList = versesRef.current;
    if (!vList.length || index < 0 || index >= vList.length) return;
    const verse = vList[index];

    // Tear down previous audio cleanly
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended          = null;
      audioRef.current.onerror          = null;
      audioRef.current.ontimeupdate     = null;
      audioRef.current.onloadedmetadata = null;
      audioRef.current                  = null;
    }

    setCurrentVerseIndex(index);
    setActiveVerse(verse);
    setAudioError(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);

    const audio = new Audio(`${AUDIO_BASE}/${verse.id}.mp3`);
    audio.volume       = volumeRef.current;
    audio.playbackRate = playbackSpeedRef.current;
    audioRef.current   = audio;

    audio.onloadedmetadata = () => setAudioDuration(audio.duration || 0);

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
      if (audio.duration) setAudioProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.onended = () => {
      const next = index + 1;
      if (next < versesRef.current.length) {
        playVerseAtIndex(next, true);
      } else {
        setIsPlaying(false);
        setAudioProgress(0);
        setAudioCurrentTime(0);
      }
    };

    audio.onerror = () => {
      setAudioError(true);
      setIsPlaying(false);
      const next = index + 1;
      if (next < versesRef.current.length) {
        setTimeout(() => {
          setAudioError(false);
          playVerseAtIndex(next, true);
        }, 2500);
      }
    };

    if (autoPlay) {
      audio.play()
        .then(() => { setIsPlaying(true); setAutoPlayBlocked(false); pendingAutoplayRef.current = false; })
        .catch(() => {
          // Browser blocked autoplay — queue it for first user interaction
          setIsPlaying(false);
          setAutoPlayBlocked(true);
          pendingAutoplayRef.current = true;
        });
    }
  }, []);

  // ── Deferred autoplay: fire on first user interaction ────────────────────
  useEffect(() => {
    if (!autoPlayBlocked) return;

    const resume = () => {
      if (!pendingAutoplayRef.current || !audioRef.current) return;
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setAutoPlayBlocked(false); pendingAutoplayRef.current = false; })
        .catch(() => {});
    };

    document.addEventListener("click",    resume, { once: true });
    document.addEventListener("keydown",  resume, { once: true });
    document.addEventListener("touchstart", resume, { once: true, passive: true });

    return () => {
      document.removeEventListener("click",    resume);
      document.removeEventListener("keydown",  resume);
      document.removeEventListener("touchstart", resume);
    };
  }, [autoPlayBlocked]);

  // ── Update volume on all active audio ────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ── Update playback speed on active audio ────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // ── Fetch verses when mode / page / surah changes ────────────────────────
  useEffect(() => {
    // Don't fetch on the very first render before prefs load from IndexedDB
    // (we'll fetch once after prefsLoaded flips to true and sets correct page)
    const controller = new AbortController();

    setActiveVerse(null);
    stopAudio();
    setVerses([]);
    versesRef.current = [];
    setLoading(true);
    setAudioError(false);
    setAutoPlayBlocked(false);
    pendingAutoplayRef.current = false;

    const url = mode === "page"
      ? `https://api.quran.com/api/v4/verses/by_page/${currentPage}?language=ar&fields=text_uthmani,verse_key,chapter_id,verse_number&per_page=50`
      : `https://api.quran.com/api/v4/verses/by_chapter/${selectedSurah}?language=ar&fields=text_uthmani,verse_key,chapter_id,verse_number&per_page=300`;

    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        if (controller.signal.aborted) return;
        const fetched = d.verses || [];
        setVerses(fetched);
        versesRef.current = fetched;
        setLoading(false);
        // Always start recitation from the first ayah of the displayed page/surah
        if (fetched.length > 0) {
          setCurrentVerseIndex(0);
          playVerseAtIndex(0, true);
        }
      })
      .catch(err => {
        if (err.name === "AbortError") return;
        setLoading(false);
      });

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, currentPage, selectedSurah]);

  // ── Scroll active verse into view ────────────────────────────────────────
  useEffect(() => {
    if (activeVerse && activeVerseRef.current)
      activeVerseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeVerse]);

  // ── Player controls ───────────────────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) {
      playVerseAtIndex(currentVerseIndex, true);
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setAutoPlayBlocked(false); })
        .catch(() => {});
    }
  }, [isPlaying, currentVerseIndex, playVerseAtIndex]);

  const handleStop = useCallback(() => {
    stopAudio();
    setActiveVerse(null);
    setCurrentVerseIndex(0);
  }, [stopAudio]);

  const handleRepeat = useCallback(() => playVerseAtIndex(currentVerseIndex, true),
    [currentVerseIndex, playVerseAtIndex]);

  const handleSkipNext = useCallback(() => {
    const next = currentVerseIndex + 1;
    if (next < verses.length) playVerseAtIndex(next, true);
  }, [currentVerseIndex, verses.length, playVerseAtIndex]);

  const handleVerseClick = useCallback((verse: any) => {
    const idx = versesRef.current.findIndex(v => v.id === verse.id);
    if (idx === -1) return;
    if (activeVerse?.id === verse.id) handlePlayPause();
    else playVerseAtIndex(idx, true);
  }, [activeVerse, handlePlayPause, playVerseAtIndex]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !audioDuration) return;
    const pct  = parseFloat(e.target.value);
    const time = (pct / 100) * audioDuration;
    audioRef.current.currentTime = time;
    setAudioProgress(pct);
    setAudioCurrentTime(time);
  }, [audioDuration]);

  // ── Bookmark toggle ───────────────────────────────────────────────────────
  const toggleBookmark = useCallback((verse: any, surahName: string) => {
    const key = verse.verse_key as string;
    setBookmarks(prev => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
        deleteBookmark(key).catch(() => {});
      } else {
        const b: QuranBookmark = {
          verseKey: key,
          verseId: verse.id,
          chapterId: verse.chapter_id,
          verseNumber: verse.verse_number,
          text: verse.text_uthmani,
          savedAt: Date.now(),
        };
        next.set(key, b);
        saveBookmark(b).catch(() => {});
      }
      return next;
    });
  }, []);

  // ── Khatma ────────────────────────────────────────────────────────────────
  const markPageRead = () => {
    const s = new Set(pagesRead); s.add(currentPage);
    setPagesRead(s); saveKhatmaPages(s);
  };
  const resetKhatma = () => { const s = new Set<number>(); setPagesRead(s); saveKhatmaPages(s); };
  const isRead = pagesRead.has(currentPage);
  const khatmaPercent = Math.round((pagesRead.size / TOTAL_PAGES) * 100);

  // ── Page navigation ───────────────────────────────────────────────────────
  const goTo = (p: number) => setCurrentPage(Math.min(Math.max(1, p), TOTAL_PAGES));

  // ── Group page verses by surah ────────────────────────────────────────────
  const groups: { chapterId: number; verses: any[] }[] = [];
  verses.forEach(v => {
    const last = groups[groups.length - 1];
    if (last && last.chapterId === v.chapter_id) last.verses.push(v);
    else groups.push({ chapterId: v.chapter_id, verses: [v] });
  });

  const filteredSurahs = surahList.filter(s =>
    s.name_arabic.includes(surahSearch) || String(s.id).includes(surahSearch)
  );

  const sortedBookmarks = [...bookmarks.values()].sort((a, b) => b.savedAt - a.savedAt);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif gold-gradient-text mb-4">ورد القرآن</h2>
          <p className="text-muted-foreground">"اقرأوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه"</p>
        </div>

        <div className="bg-card/80 backdrop-blur border border-primary/20 rounded-3xl overflow-hidden shadow-2xl">

          {/* ── Toolbar ── */}
          <div className="p-4 border-b border-border/50 bg-background/50 flex flex-wrap items-center justify-between gap-3">

            {/* Mode toggle */}
            <div className="flex items-center gap-1 bg-secondary/60 rounded-xl p-1">
              <button
                onClick={() => setMode("page")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "page" ? "bg-white shadow text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="w-4 h-4" /> بالصفحة
              </button>
              <button
                onClick={() => setMode("surah")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "surah" ? "bg-white shadow text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" /> بالسورة
              </button>
            </div>

            {/* Page go-to */}
            {mode === "page" && (
              <form
                onSubmit={e => { e.preventDefault(); const n = parseInt(pageInput); if (!isNaN(n)) { goTo(n); setPageInput(""); } }}
                className="flex items-center gap-2"
              >
                <span className="text-sm text-muted-foreground whitespace-nowrap">انتقل للصفحة</span>
                <input
                  type="number" min={1} max={604}
                  value={pageInput} onChange={e => setPageInput(e.target.value)}
                  placeholder="١–٦٠٤"
                  className="w-20 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 text-center"
                />
                <button type="submit" className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">اذهب</button>
              </form>
            )}

            {/* Surah selector */}
            {mode === "surah" && (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text" placeholder="ابحث عن سورة..."
                  value={surahSearch} onChange={e => setSurahSearch(e.target.value)}
                  className="bg-background border border-border rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 w-40"
                />
                <select
                  value={selectedSurah}
                  onChange={e => setSelectedSurah(Number(e.target.value))}
                  className="bg-background border border-border rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50"
                >
                  {filteredSurahs.map(s => (
                    <option key={s.id} value={s.id}>{toArabicNumerals(s.id)}. {s.name_arabic}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Right-side buttons */}
            <div className="flex items-center gap-2 mr-auto">
              {/* Font size controls */}
              <div className="flex items-center gap-1 bg-secondary/60 rounded-lg p-1">
                <button
                  onClick={() => setFontSize(f => Math.max(MIN_FONT, f - 2))}
                  disabled={fontSize <= MIN_FONT}
                  title="تصغير الخط"
                  className="px-2 py-1 text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >أ−</button>
                <button
                  onClick={() => setFontSize(f => Math.min(MAX_FONT, f + 2))}
                  disabled={fontSize >= MAX_FONT}
                  title="تكبير الخط"
                  className="px-2 py-1 text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >أ+</button>
              </div>

              {/* Bookmarks button */}
              <button
                onClick={() => setShowBookmarks(v => !v)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition-colors font-medium ${
                  showBookmarks
                    ? "bg-amber-200 text-amber-800"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">المرجعيات</span>
                {bookmarks.size > 0 && (
                  <span className="bg-primary/20 rounded-full px-1.5 py-0.5 text-xs">{toArabicNumerals(bookmarks.size)}</span>
                )}
              </button>

              {/* Khatma button — page mode only */}
              {mode === "page" && (
                <button
                  onClick={() => setShowKhatma(v => !v)}
                  className="flex items-center gap-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors font-medium"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">الختمة</span>
                  <span className="bg-primary/20 rounded-full px-2 py-0.5 text-xs">
                    {toArabicNumerals(pagesRead.size)}/{toArabicNumerals(TOTAL_PAGES)}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showKhatma ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          </div>

          {/* ── Khatma Panel ── */}
          <AnimatePresence>
            {showKhatma && mode === "page" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                className="overflow-hidden border-b border-border/50"
              >
                <div className="p-5 bg-amber-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-lg text-foreground">تتبّع الختمة</h3>
                    <button onClick={resetKhatma} className="text-xs text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1">
                      <X className="w-3 h-3" /> إعادة ضبط
                    </button>
                  </div>
                  <div className="w-full bg-border rounded-full h-3 mb-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${khatmaPercent}%` }} transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span>{toArabicNumerals(pagesRead.size)} صفحة مقروءة</span>
                    <span className="text-primary font-bold">{toArabicNumerals(khatmaPercent)}٪</span>
                    <span>{toArabicNumerals(TOTAL_PAGES - pagesRead.size)} متبقية</span>
                  </div>
                  <button
                    onClick={markPageRead} disabled={isRead}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2
                      ${isRead ? "bg-green-100 text-green-700 cursor-default" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                  >
                    {isRead
                      ? <><Check className="w-4 h-4" /> تمت قراءة الصفحة {toArabicNumerals(currentPage)}</>
                      : <>علّم الصفحة {toArabicNumerals(currentPage)} كمقروءة</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Bookmarks Panel ── */}
          <AnimatePresence>
            {showBookmarks && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                className="overflow-hidden border-b border-border/50"
              >
                <div className="p-5 bg-amber-50/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                      <BookmarkCheck className="w-5 h-5 text-primary" />
                      الآيات المحفوظة
                    </h3>
                    <span className="text-xs text-muted-foreground">اضغط على الآية لتشغيلها</span>
                  </div>
                  {sortedBookmarks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      لم تحفظ أي آيات بعد — اضغط على <Bookmark className="inline w-3.5 h-3.5" /> بجانب الآية لحفظها
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {sortedBookmarks.map(b => (
                        <div key={b.verseKey} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                              // Navigate to the bookmarked verse's page (surah mode)
                              setMode("surah");
                              setSelectedSurah(b.chapterId);
                              setShowBookmarks(false);
                            }}
                          >
                            <div className="text-right font-serif text-base leading-relaxed text-foreground/90 line-clamp-2">
                              {b.text}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 text-right">
                              {surahNames[b.chapterId] ? `سورة ${surahNames[b.chapterId]}` : `سورة ${b.chapterId}`}
                              {" – آية "}{toArabicNumerals(b.verseNumber)}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleBookmark({ id: b.verseId, verse_key: b.verseKey, chapter_id: b.chapterId, verse_number: b.verseNumber, text_uthmani: b.text }, "")}
                            className="text-amber-500 hover:text-red-400 transition-colors mt-1 flex-shrink-0"
                            title="حذف من المحفوظات"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Page / Surah info bar ── */}
          <div className="flex items-center justify-between px-6 py-3 bg-amber-50/30 border-b border-border/30 text-sm text-muted-foreground" dir="rtl">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              {mode === "page" ? (
                <span>
                  {groups.map((g, i) => (
                    <span key={g.chapterId}>
                      {i > 0 && " · "}
                      <span className="text-foreground font-medium">
                        {surahNames[g.chapterId] ? `سورة ${surahNames[g.chapterId]}` : `سورة ${g.chapterId}`}
                      </span>
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-foreground font-medium">
                  {surahNames[selectedSurah] ? `سورة ${surahNames[selectedSurah]}` : `سورة ${selectedSurah}`}
                  {" – "}{toArabicNumerals(verses.length)} آية
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {mode === "page" && isRead && (
                <span className="text-green-600 flex items-center gap-1 text-xs"><Check className="w-3 h-3" /> مقروءة</span>
              )}
              <span className="flex items-center gap-1 text-xs text-amber-700/80 bg-amber-100/60 px-2 py-0.5 rounded-full">
                <Volume2 className="w-3 h-3" /> المنشاوي
              </span>
              <span className="text-primary font-bold arabic-numerals">
                {mode === "page"
                  ? `صفحة ${toArabicNumerals(currentPage)}`
                  : `سورة ${toArabicNumerals(selectedSurah)}`}
              </span>
            </div>
          </div>

          {/* ── Reader Area ── */}
          <div
            className="p-6 md:p-10 min-h-[55vh] max-h-[65vh] overflow-y-auto"
            dir="rtl"
          >
            {loading ? (
              <div className="flex flex-col justify-center items-center h-48 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">جارٍ تحميل الصفحة...</span>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Basmalah */}
                {mode === "surah" && selectedSurah !== 1 && selectedSurah !== 9 && (
                  <div className="text-center my-4">
                    <div className="inline-block border border-primary/30 rounded-2xl px-8 py-3 bg-amber-50/60 text-2xl font-serif gold-gradient-text">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                  </div>
                )}

                {mode === "surah" ? (
                  /* ── Surah mode: flowing text ── */
                  <div className="text-center font-serif text-foreground/90" style={{ lineHeight: "3.4" }}>
                    {verses.map((verse, idx) => {
                      const isActive = activeVerse?.id === verse.id;
                      const isBookmarked = bookmarks.has(verse.verse_key);
                      return (
                        <span key={verse.id} className="inline">
                          <span
                            ref={isActive ? (el => { activeVerseRef.current = el; }) : null}
                            onClick={() => handleVerseClick(verse)}
                            className={`inline cursor-pointer transition-all duration-200 rounded-sm px-0.5
                              ${isActive
                                ? "bg-amber-100 text-amber-900 ring-2 ring-amber-400/60 rounded-md"
                                : idx === currentVerseIndex && isPlaying
                                  ? "bg-amber-50/80"
                                  : "hover:bg-amber-50"}`}
                            style={{ fontSize: `${fontSize}px` }}
                            title="اضغط للاستماع"
                          >
                            {verse.text_uthmani}
                          </span>
                          {/* Verse number + bookmark */}
                          <span className="inline-flex items-center gap-0.5 mx-1.5 align-middle">
                            <span className={`inline-flex items-center justify-center w-7 h-7 text-xs border rounded-full
                              ${isActive ? "border-amber-500 bg-amber-400/20 text-amber-700" : "border-primary/30 bg-primary/5 text-primary"}`}>
                              {toArabicNumerals(verse.verse_number)}
                            </span>
                            <button
                              onClick={e => { e.stopPropagation(); toggleBookmark(verse, surahNames[verse.chapter_id] ?? ""); }}
                              title={isBookmarked ? "إزالة من المحفوظات" : "حفظ الآية"}
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-full transition-colors
                                ${isBookmarked ? "text-amber-500" : "text-muted-foreground/40 hover:text-amber-400"}`}
                            >
                              <Bookmark className={`w-3 h-3 ${isBookmarked ? "fill-current" : ""}`} />
                            </button>
                          </span>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  /* ── Page mode: grouped by surah ── */
                  groups.map(group => (
                    <div key={group.chapterId}>
                      {group.verses[0]?.verse_number === 1 && group.chapterId !== 1 && group.chapterId !== 9 && (
                        <div className="text-center my-4">
                          <div className="inline-block border border-primary/30 rounded-2xl px-8 py-3 bg-amber-50/60 text-2xl font-serif gold-gradient-text">
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                          </div>
                        </div>
                      )}
                      {groups.length > 1 && (
                        <div className="text-center text-sm text-primary/70 mb-2 font-serif">
                          ── {surahNames[group.chapterId] ? `سورة ${surahNames[group.chapterId]}` : ""} ──
                        </div>
                      )}
                      <div className="text-center font-serif text-foreground/90" style={{ lineHeight: "3.4" }}>
                        {group.verses.map(verse => {
                          const isActive = activeVerse?.id === verse.id;
                          const isBookmarked = bookmarks.has(verse.verse_key);
                          return (
                            <span key={verse.id} className="inline">
                              <span
                                ref={isActive ? (el => { activeVerseRef.current = el; }) : null}
                                onClick={() => handleVerseClick(verse)}
                                className={`inline cursor-pointer transition-all duration-200 rounded-sm px-0.5
                                  ${isActive
                                    ? "bg-amber-100 text-amber-900 ring-2 ring-amber-400/60 rounded-md"
                                    : "hover:bg-amber-50"}`}
                                style={{ fontSize: `${fontSize}px` }}
                                title="اضغط للاستماع"
                              >
                                {verse.text_uthmani}
                              </span>
                              {/* Verse number + bookmark */}
                              <span className="inline-flex items-center gap-0.5 mx-1.5 align-middle">
                                <span className={`inline-flex items-center justify-center w-7 h-7 text-xs border rounded-full
                                  ${isActive ? "border-amber-500 bg-amber-400/20 text-amber-700" : "border-primary/30 bg-primary/5 text-primary"}`}>
                                  {toArabicNumerals(verse.verse_number)}
                                </span>
                                <button
                                  onClick={e => { e.stopPropagation(); toggleBookmark(verse, surahNames[verse.chapter_id] ?? ""); }}
                                  title={isBookmarked ? "إزالة من المحفوظات" : "حفظ الآية"}
                                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full transition-colors
                                    ${isBookmarked ? "text-amber-500" : "text-muted-foreground/40 hover:text-amber-400"}`}
                                >
                                  <Bookmark className={`w-3 h-3 ${isBookmarked ? "fill-current" : ""}`} />
                                </button>
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* ── Autoplay blocked notice (full-width tap prompt) ── */}
          <AnimatePresence>
            {autoPlayBlocked && !loading && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mx-4 mb-0 mt-0 bg-amber-100 border border-amber-300 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-amber-800"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>اضغط في أي مكان لبدء التلاوة تلقائياً من أول الصفحة</span>
                <button
                  onClick={handlePlayPause}
                  className="mr-auto flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600 transition-colors text-xs font-medium"
                >
                  <Play className="w-3.5 h-3.5" /> ابدأ
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Persistent Player Bar ── */}
          <AnimatePresence>
            {(activeVerse) && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border-t border-amber-200/60 bg-gradient-to-b from-amber-50/80 to-amber-100/60 px-4 py-3"
                dir="rtl"
              >
                {/* Audio error */}
                {audioError && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                    <span>تعذّر تحميل ملف التلاوة — تحقق من اتصالك بالإنترنت ثم حاول مجدداً</span>
                    <button
                      onClick={() => { setAudioError(false); playVerseAtIndex(currentVerseIndex, true); }}
                      className="mr-auto text-red-600 hover:text-red-800 underline whitespace-nowrap"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                )}

                {/* Verse info row */}
                <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                  <span>
                    {surahNames[activeVerse?.chapter_id]
                      ? `سورة ${surahNames[activeVerse.chapter_id]}`
                      : `سورة ${activeVerse?.chapter_id}`}
                    {" – آية "}{toArabicNumerals(activeVerse?.verse_number ?? 0)}
                  </span>
                  <span className="text-amber-700/70">
                    آية {toArabicNumerals(currentVerseIndex + 1)} / {toArabicNumerals(verses.length)}
                  </span>
                </div>

                {/* Seek bar */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground tabular-nums w-8 text-left">{fmt(audioCurrentTime)}</span>
                  <input
                    type="range" min={0} max={100} step={0.1}
                    value={audioProgress} onChange={handleSeek}
                    className="flex-1 h-1.5 appearance-none bg-amber-200 rounded-full cursor-pointer accent-amber-600"
                    style={{ direction: "ltr" }}
                  />
                  <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{fmt(audioDuration)}</span>
                </div>

                {/* Controls row */}
                <div className="flex items-center justify-between gap-2">
                  {/* Left: volume */}
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <input
                      type="range" min={0} max={1} step={0.05}
                      value={volume}
                      onChange={e => setVolume(parseFloat(e.target.value))}
                      className="w-20 h-1.5 appearance-none bg-amber-200 rounded-full cursor-pointer accent-amber-600"
                      style={{ direction: "ltr" }}
                      title="مستوى الصوت"
                    />
                  </div>

                  {/* Centre: playback controls */}
                  <div className="flex items-center gap-2">
                    <button onClick={handleRepeat} title="إعادة الآية"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-amber-100 transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handlePlayPause}
                      className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                      {isPlaying
                        ? <><Pause className="w-4 h-4" /> إيقاف مؤقت</>
                        : <><Play  className="w-4 h-4" /> تشغيل</>}
                    </button>

                    <button onClick={handleSkipNext} disabled={currentVerseIndex >= verses.length - 1} title="الآية التالية"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-amber-100 transition-colors disabled:opacity-40">
                      <SkipForward className="w-4 h-4" />
                    </button>

                    <button onClick={handleStop} title="إيقاف"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Square className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right: playback speed */}
                  <div className="flex items-center gap-1">
                    {SPEEDS.map(s => (
                      <button
                        key={s}
                        onClick={() => setPlaybackSpeed(s)}
                        className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                          playbackSpeed === s
                            ? "bg-primary text-primary-foreground font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title={`سرعة التشغيل ×${s}`}
                      >
                        {s}×
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Navigation Footer ── */}
          <div className="p-4 border-t border-border/50 bg-background/50 flex justify-between items-center">
            {mode === "page" ? (
              <>
                <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === TOTAL_PAGES}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors">
                  <ChevronRight className="w-4 h-4" /> الصفحة التالية
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={markPageRead} disabled={isRead}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1
                      ${isRead ? "text-green-600 bg-green-50" : "bg-primary/10 text-primary hover:bg-primary/20"}`}>
                    {isRead ? <><Check className="w-3 h-3" /> مقروءة</> : "✓ علّم مقروءة"}
                  </button>
                  <span className="text-sm text-primary arabic-numerals font-bold">
                    {toArabicNumerals(currentPage)} / {toArabicNumerals(TOTAL_PAGES)}
                  </span>
                </div>
                <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors">
                  الصفحة السابقة <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setSelectedSurah(s => Math.min(114, s + 1))} disabled={selectedSurah === 114}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors">
                  <ChevronRight className="w-4 h-4" /> السورة التالية
                </button>
                <span className="text-sm text-primary arabic-numerals font-bold">
                  سورة {toArabicNumerals(selectedSurah)} / {toArabicNumerals(114)}
                </span>
                <button onClick={() => setSelectedSurah(s => Math.max(1, s - 1))} disabled={selectedSurah === 1}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors">
                  السورة السابقة <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-4">
          تلاوة الشيخ محمد صديق المنشاوي رحمه الله · تُستعاد التلاوة تلقائياً من أول الصفحة عند كل تحديث
        </p>
      </div>
    </section>
  );
}
