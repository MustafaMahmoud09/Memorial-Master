import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  BookOpen, Trophy, X, ChevronDown, Check, Loader2, FileText, List,
  SkipForward, Square, Volume2, AlertCircle
} from "lucide-react";
import { toArabicNumerals } from "@/lib/utils";

const TOTAL_PAGES = 604;
const RECITER = "ar.minshawi"; // الشيخ محمد صديق المنشاوي رحمه الله
const AUDIO_BASE = `https://cdn.islamic.network/quran/audio/128/${RECITER}`;

/* ── persistence helpers ── */
function loadPagesRead(): Set<number> {
  try { return new Set<number>(JSON.parse(localStorage.getItem("quran_khatma_pages") || "[]")); }
  catch { return new Set(); }
}
function savePagesRead(s: Set<number>) {
  localStorage.setItem("quran_khatma_pages", JSON.stringify([...s]));
}
function loadLastPage() {
  const v = parseInt(localStorage.getItem("quran_last_page") || "1");
  return isNaN(v) ? 1 : Math.min(Math.max(1, v), TOTAL_PAGES);
}
function loadLastSurah() {
  const v = parseInt(localStorage.getItem("quran_last_surah") || "1");
  return isNaN(v) ? 1 : Math.min(Math.max(1, v), 114);
}

type Mode = "page" | "surah";

export function QuranReader() {
  const [mode, setMode] = useState<Mode>("page");

  /* page mode state */
  const [currentPage, setCurrentPage] = useState<number>(loadLastPage);
  const [pageInput, setPageInput] = useState("");

  /* surah mode state */
  const [selectedSurah, setSelectedSurah] = useState<number>(loadLastSurah);
  const [surahList, setSurahList] = useState<any[]>([]);
  const [surahSearch, setSurahSearch] = useState("");

  /* shared state */
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeVerse, setActiveVerse] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);   // 0–100
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);
  const [pagesRead, setPagesRead] = useState<Set<number>>(loadPagesRead);
  const [showKhatma, setShowKhatma] = useState(false);
  const [surahNames, setSurahNames] = useState<Record<number, string>>({});

  /* refs */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeVerseRef = useRef<HTMLElement | null>(null);
  const versesRef = useRef<any[]>([]);
  versesRef.current = verses;

  /* ── fetch surah list once ── */
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

  /* ── core audio stop ── */
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current.onloadedmetadata = null;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);
  }, []);

  /* ── play verse at index (stable via ref) ── */
  const playVerseAtIndex = useCallback((index: number, autoPlay = true) => {
    const vList = versesRef.current;
    if (!vList.length || index < 0 || index >= vList.length) return;

    const verse = vList[index];

    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current.onloadedmetadata = null;
      audioRef.current = null;
    }

    setCurrentVerseIndex(index);
    setActiveVerse(verse);
    setAudioError(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);

    const audio = new Audio(`${AUDIO_BASE}/${verse.id}.mp3`);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration || 0);
    };

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      const nextIdx = index + 1;
      if (nextIdx < versesRef.current.length) {
        playVerseAtIndex(nextIdx, true);
      } else {
        setIsPlaying(false);
        setAudioProgress(0);
        setAudioCurrentTime(0);
      }
    };

    audio.onerror = () => {
      // Skip to next verse silently on error
      const nextIdx = index + 1;
      if (nextIdx < versesRef.current.length) {
        playVerseAtIndex(nextIdx, true);
      } else {
        setIsPlaying(false);
        setAudioError(true);
      }
    };

    if (autoPlay) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setAutoPlayBlocked(false);
        })
        .catch(() => {
          // Browser blocked autoplay — show tap-to-play
          setIsPlaying(false);
          setAutoPlayBlocked(true);
        });
    }
  }, []);

  /* ── fetch verses when mode / page / surah changes ── */
  useEffect(() => {
    setActiveVerse(null);
    stopAudio();
    setLoading(true);
    setAudioError(false);
    setAutoPlayBlocked(false);

    const url = mode === "page"
      ? `https://api.quran.com/api/v4/verses/by_page/${currentPage}?language=ar&fields=text_uthmani,verse_key,chapter_id,verse_number&per_page=50`
      : `https://api.quran.com/api/v4/verses/by_chapter/${selectedSurah}?language=ar&fields=text_uthmani,verse_key,chapter_id,verse_number&per_page=300`;

    fetch(url)
      .then(r => r.json())
      .then(d => {
        const fetched = d.verses || [];
        setVerses(fetched);
        versesRef.current = fetched;
        setLoading(false);
        // Auto-play first verse of the new page/surah
        if (fetched.length > 0) {
          setCurrentVerseIndex(0);
          playVerseAtIndex(0, true);
        }
      })
      .catch(() => setLoading(false));

    if (mode === "page") localStorage.setItem("quran_last_page", currentPage.toString());
    else localStorage.setItem("quran_last_surah", selectedSurah.toString());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, currentPage, selectedSurah]);

  /* scroll active verse into view */
  useEffect(() => {
    if (activeVerse && activeVerseRef.current)
      activeVerseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeVerse]);

  /* ── player controls ── */
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) {
      // No audio loaded — play from current index
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

  const handleRepeat = useCallback(() => {
    playVerseAtIndex(currentVerseIndex, true);
  }, [currentVerseIndex, playVerseAtIndex]);

  const handleSkipNext = useCallback(() => {
    const next = currentVerseIndex + 1;
    if (next < verses.length) playVerseAtIndex(next, true);
  }, [currentVerseIndex, verses.length, playVerseAtIndex]);

  const handleVerseClick = useCallback((verse: any) => {
    const idx = versesRef.current.findIndex(v => v.id === verse.id);
    if (idx === -1) return;
    if (activeVerse?.id === verse.id) {
      handlePlayPause();
    } else {
      playVerseAtIndex(idx, true);
    }
  }, [activeVerse, handlePlayPause, playVerseAtIndex]);

  /* seek in current audio */
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !audioDuration) return;
    const pct = parseFloat(e.target.value);
    const time = (pct / 100) * audioDuration;
    audioRef.current.currentTime = time;
    setAudioProgress(pct);
    setAudioCurrentTime(time);
  }, [audioDuration]);

  /* format seconds → m:ss */
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const goTo = (p: number) => setCurrentPage(Math.min(Math.max(1, p), TOTAL_PAGES));

  const markPageRead = () => {
    const s = new Set(pagesRead); s.add(currentPage);
    setPagesRead(s); savePagesRead(s);
  };
  const resetKhatma = () => { const s = new Set<number>(); setPagesRead(s); savePagesRead(s); };
  const isRead = pagesRead.has(currentPage);
  const khatmaPercent = Math.round((pagesRead.size / TOTAL_PAGES) * 100);

  /* group page verses by surah */
  const groups: { chapterId: number; verses: any[] }[] = [];
  verses.forEach(v => {
    const last = groups[groups.length - 1];
    if (last && last.chapterId === v.chapter_id) last.verses.push(v);
    else groups.push({ chapterId: v.chapter_id, verses: [v] });
  });

  const filteredSurahs = surahList.filter(s =>
    s.name_arabic.includes(surahSearch) || String(s.id).includes(surahSearch)
  );

  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif gold-gradient-text mb-4">ورد القرآن</h2>
          <p className="text-muted-foreground">"اقرأوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه"</p>
        </div>

        <div className="bg-card/80 backdrop-blur border border-primary/20 rounded-3xl overflow-hidden shadow-2xl">

          {/* ── Mode Toggle ── */}
          <div className="p-4 border-b border-border/50 bg-background/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-secondary/60 rounded-xl p-1">
              <button
                onClick={() => setMode("page")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "page"
                    ? "bg-white shadow text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="w-4 h-4" />
                بالصفحة
              </button>
              <button
                onClick={() => setMode("surah")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "surah"
                    ? "bg-white shadow text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
                بالسورة
              </button>
            </div>

            {/* Page controls */}
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
                  type="text"
                  placeholder="ابحث عن سورة..."
                  value={surahSearch}
                  onChange={e => setSurahSearch(e.target.value)}
                  className="bg-background border border-border rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 w-40"
                />
                <select
                  value={selectedSurah}
                  onChange={e => setSelectedSurah(Number(e.target.value))}
                  className="bg-background border border-border rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50"
                >
                  {filteredSurahs.map(s => (
                    <option key={s.id} value={s.id}>
                      {toArabicNumerals(s.id)}. {s.name_arabic}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Khatma — only in page mode */}
            {mode === "page" && (
              <button
                onClick={() => setShowKhatma(v => !v)}
                className="flex items-center gap-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors font-medium"
              >
                <Trophy className="w-4 h-4" />
                الختمة
                <span className="bg-primary/20 rounded-full px-2 py-0.5 text-xs">
                  {toArabicNumerals(pagesRead.size)}/{toArabicNumerals(TOTAL_PAGES)}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showKhatma ? "rotate-180" : ""}`} />
              </button>
            )}
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
              {/* Reciter badge */}
              <span className="flex items-center gap-1 text-xs text-amber-700/80 bg-amber-100/60 px-2 py-0.5 rounded-full">
                <Volume2 className="w-3 h-3" />
                المنشاوي
              </span>
              <span className="text-primary font-bold arabic-numerals">
                {mode === "page"
                  ? `صفحة ${toArabicNumerals(currentPage)}`
                  : `سورة ${toArabicNumerals(selectedSurah)}`}
              </span>
            </div>
          </div>

          {/* ── Reader Area ── */}
          <div className="p-6 md:p-10 min-h-[55vh] max-h-[65vh] overflow-y-auto" dir="rtl">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-48 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">جارٍ تحميل الصفحة...</span>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Basmalah for surah mode */}
                {mode === "surah" && selectedSurah !== 1 && selectedSurah !== 9 && (
                  <div className="text-center my-4">
                    <div className="inline-block border border-primary/30 rounded-2xl px-8 py-3 bg-amber-50/60 text-2xl font-serif gold-gradient-text">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                  </div>
                )}

                {mode === "surah" ? (
                  /* ── Surah mode: one flowing block ── */
                  <div className="text-center leading-[3.2] text-2xl md:text-3xl font-serif text-foreground/90">
                    {verses.map((verse, idx) => {
                      const isActive = activeVerse?.id === verse.id;
                      return (
                        <span
                          key={verse.id}
                          ref={isActive ? (el => { activeVerseRef.current = el; }) : null}
                          onClick={() => handleVerseClick(verse)}
                          className={`inline cursor-pointer transition-all duration-200 rounded-sm px-0.5
                            ${isActive
                              ? "bg-amber-100 text-amber-900 ring-2 ring-amber-400/60 rounded-md"
                              : idx === currentVerseIndex && isPlaying
                                ? "bg-amber-50/80"
                                : "hover:bg-amber-50"}`}
                          title="اضغط للاستماع"
                        >
                          {verse.text_uthmani}
                          <span className={`inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 mx-1.5 text-xs border rounded-full align-middle
                            ${isActive ? "border-amber-500 bg-amber-400/20 text-amber-700" : "border-primary/30 bg-primary/5 text-primary"}`}>
                            {toArabicNumerals(verse.verse_number)}
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
                      <div className="text-center leading-[3.2] text-2xl md:text-3xl font-serif text-foreground/90">
                        {group.verses.map((verse) => {
                          const isActive = activeVerse?.id === verse.id;
                          return (
                            <span
                              key={verse.id}
                              ref={isActive ? (el => { activeVerseRef.current = el; }) : null}
                              onClick={() => handleVerseClick(verse)}
                              className={`inline cursor-pointer transition-all duration-200 rounded-sm px-0.5
                                ${isActive
                                  ? "bg-amber-100 text-amber-900 ring-2 ring-amber-400/60 rounded-md"
                                  : "hover:bg-amber-50"}`}
                              title="اضغط للاستماع"
                            >
                              {verse.text_uthmani}
                              <span className={`inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 mx-1.5 text-xs border rounded-full align-middle
                                ${isActive ? "border-amber-500 bg-amber-400/20 text-amber-700" : "border-primary/30 bg-primary/5 text-primary"}`}>
                                {toArabicNumerals(verse.verse_number)}
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

          {/* ── Persistent Player Bar ── */}
          <AnimatePresence>
            {(activeVerse || autoPlayBlocked) && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border-t border-amber-200/60 bg-gradient-to-b from-amber-50/80 to-amber-100/60 px-4 py-3"
                dir="rtl"
              >
                {/* Auto-play blocked notice */}
                {autoPlayBlocked && !audioError && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-amber-700 bg-amber-100 rounded-lg px-3 py-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>اضغط على زر التشغيل لبدء التلاوة</span>
                  </div>
                )}

                {/* Audio unavailable error */}
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

                {/* Verse info */}
                {activeVerse && (
                  <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                    <span>
                      {surahNames[activeVerse.chapter_id]
                        ? `سورة ${surahNames[activeVerse.chapter_id]}`
                        : `سورة ${activeVerse.chapter_id}`}
                      {" – آية "}{toArabicNumerals(activeVerse.verse_number)}
                    </span>
                    <span className="text-amber-700/70">
                      آية {toArabicNumerals(currentVerseIndex + 1)} / {toArabicNumerals(verses.length)}
                    </span>
                  </div>
                )}

                {/* Progress bar */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground tabular-nums w-8 text-left">
                    {fmt(audioCurrentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={audioProgress}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 appearance-none bg-amber-200 rounded-full cursor-pointer accent-amber-600"
                    style={{ direction: "ltr" }}
                  />
                  <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                    {fmt(audioDuration)}
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  {/* Repeat current verse */}
                  <button
                    onClick={handleRepeat}
                    title="إعادة الآية"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-amber-100 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Play / Pause */}
                  <button
                    onClick={handlePlayPause}
                    className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                  >
                    {isPlaying
                      ? <><Pause className="w-4 h-4" /> إيقاف مؤقت</>
                      : <><Play className="w-4 h-4" /> تشغيل</>}
                  </button>

                  {/* Skip to next verse */}
                  <button
                    onClick={handleSkipNext}
                    disabled={currentVerseIndex >= verses.length - 1}
                    title="الآية التالية"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-amber-100 transition-colors disabled:opacity-40"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  {/* Stop */}
                  <button
                    onClick={handleStop}
                    title="إيقاف"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Square className="w-4 h-4" />
                  </button>
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
          تلاوة الشيخ محمد صديق المنشاوي رحمه الله · تبدأ التلاوة تلقائياً عند اختيار الصفحة
        </p>
      </div>
    </section>
  );
}
