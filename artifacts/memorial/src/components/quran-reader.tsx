import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  BookOpen, Trophy, X, ChevronDown, Check, Loader2
} from "lucide-react";
import { toArabicNumerals } from "@/lib/utils";

const TOTAL_PAGES = 604;

function loadPagesRead(): Set<number> {
  try {
    const raw = localStorage.getItem("quran_khatma_pages");
    return raw ? new Set<number>(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function savePagesRead(set: Set<number>) {
  localStorage.setItem("quran_khatma_pages", JSON.stringify([...set]));
}

function loadLastPage(): number {
  const val = parseInt(localStorage.getItem("quran_last_page") || "1");
  return isNaN(val) ? 1 : Math.min(Math.max(1, val), TOTAL_PAGES);
}

export function QuranReader() {
  const [currentPage, setCurrentPage] = useState<number>(loadLastPage);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeVerse, setActiveVerse] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pagesRead, setPagesRead] = useState<Set<number>>(loadPagesRead);
  const [pageInput, setPageInput] = useState("");
  const [showKhatma, setShowKhatma] = useState(false);
  const [surahNames, setSurahNames] = useState<Record<number, string>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeVerseRef = useRef<HTMLDivElement | null>(null);

  // Fetch verses whenever page changes
  useEffect(() => {
    localStorage.setItem("quran_last_page", currentPage.toString());
    setActiveVerse(null);
    stopAudio();
    setLoading(true);

    fetch(
      `https://api.quran.com/api/v4/verses/by_page/${currentPage}?language=ar&fields=text_uthmani,verse_key,chapter_id,verse_number&per_page=50`
    )
      .then(r => r.json())
      .then(data => {
        const vs = data.verses || [];
        setVerses(vs);
        // collect unique chapter IDs for surah names
        const ids: number[] = [...new Set<number>(vs.map((v: any) => v.chapter_id))];
        const missing = ids.filter(id => !surahNames[id]);
        if (missing.length > 0) {
          fetch(`https://api.quran.com/api/v4/chapters?language=ar`)
            .then(r => r.json())
            .then(d => {
              const map: Record<number, string> = {};
              (d.chapters || []).forEach((c: any) => { map[c.id] = c.name_arabic; });
              setSurahNames(prev => ({ ...prev, ...map }));
            })
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Scroll active verse into view
  useEffect(() => {
    if (activeVerse && activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeVerse]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playVerse = useCallback((verse: any) => {
    stopAudio();
    const audio = new Audio(
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verse.id}.mp3`
    );
    audioRef.current = audio;
    audio.play().catch(() => {});
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
  }, [stopAudio]);

  const handleVerseClick = (verse: any) => {
    if (activeVerse?.id === verse.id) {
      // toggle play/pause
      if (isPlaying) {
        stopAudio();
        setActiveVerse(verse); // keep selected but stopped
      } else {
        playVerse(verse);
      }
    } else {
      setActiveVerse(verse);
      playVerse(verse);
    }
  };

  const repeatVerse = () => {
    if (activeVerse) playVerse(activeVerse);
  };

  const goTo = (page: number) => {
    const p = Math.min(Math.max(1, page), TOTAL_PAGES);
    setCurrentPage(p);
  };

  const markPageRead = () => {
    const newSet = new Set(pagesRead);
    newSet.add(currentPage);
    setPagesRead(newSet);
    savePagesRead(newSet);
  };

  const resetKhatma = () => {
    const fresh = new Set<number>();
    setPagesRead(fresh);
    savePagesRead(fresh);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(pageInput);
    if (!isNaN(n)) { goTo(n); setPageInput(""); }
  };

  const isRead = pagesRead.has(currentPage);
  const khatmaPercent = Math.round((pagesRead.size / TOTAL_PAGES) * 100);

  // Group verses by surah to insert Basmalah headings
  const groups: { chapterId: number; verses: any[] }[] = [];
  verses.forEach(v => {
    const last = groups[groups.length - 1];
    if (last && last.chapterId === v.chapter_id) {
      last.verses.push(v);
    } else {
      groups.push({ chapterId: v.chapter_id, verses: [v] });
    }
  });

  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif gold-gradient-text mb-4">ورد القرآن</h2>
          <p className="text-muted-foreground">"اقرأوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه"</p>
        </div>

        <div className="bg-card/80 backdrop-blur border border-primary/20 rounded-3xl overflow-hidden shadow-2xl">

          {/* ── Top Bar ── */}
          <div className="p-4 border-b border-border/50 bg-background/50 flex flex-wrap items-center justify-between gap-3">
            {/* Page jump */}
            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">انتقل للصفحة</span>
              <input
                type="number"
                min={1} max={604}
                value={pageInput}
                onChange={e => setPageInput(e.target.value)}
                placeholder="١–٦٠٤"
                className="w-20 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 text-center"
              />
              <button type="submit" className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                اذهب
              </button>
            </form>

            {/* Khatma button */}
            <button
              onClick={() => setShowKhatma(v => !v)}
              className="flex items-center gap-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors font-medium"
            >
              <Trophy className="w-4 h-4" />
              الختمة
              <span className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs">
                {toArabicNumerals(pagesRead.size)}/{toArabicNumerals(TOTAL_PAGES)}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showKhatma ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* ── Khatma Panel ── */}
          <AnimatePresence>
            {showKhatma && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-b border-border/50"
              >
                <div className="p-5 bg-amber-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-lg text-foreground">تتبّع الختمة</h3>
                    <button onClick={resetKhatma} className="text-xs text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1">
                      <X className="w-3 h-3" /> إعادة ضبط
                    </button>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-border rounded-full h-3 mb-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${khatmaPercent}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span>{toArabicNumerals(pagesRead.size)} صفحة مقروءة</span>
                    <span className="text-primary font-bold">{toArabicNumerals(khatmaPercent)}٪</span>
                    <span>{toArabicNumerals(TOTAL_PAGES - pagesRead.size)} متبقية</span>
                  </div>
                  {/* Mark current page */}
                  <button
                    onClick={markPageRead}
                    disabled={isRead}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2
                      ${isRead
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                  >
                    {isRead ? <><Check className="w-4 h-4" /> تمت قراءة الصفحة {toArabicNumerals(currentPage)}</> : <>علّم الصفحة {toArabicNumerals(currentPage)} كمقروءة</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Page Header ── */}
          <div className="flex items-center justify-between px-6 py-3 bg-amber-50/30 border-b border-border/30 text-sm text-muted-foreground" dir="rtl">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
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
            </div>
            <div className="flex items-center gap-2">
              {isRead && <span className="text-green-600 flex items-center gap-1 text-xs"><Check className="w-3 h-3" /> مقروءة</span>}
              <span className="text-primary font-bold arabic-numerals">صفحة {toArabicNumerals(currentPage)}</span>
            </div>
          </div>

          {/* ── Reader Area ── */}
          <div className="p-6 md:p-10 min-h-[55vh] max-h-[65vh] overflow-y-auto" dir="rtl">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-8">
                {groups.map(group => (
                  <div key={group.chapterId}>
                    {/* Basmalah for new surah (except Al-Fatiha page 1 and At-Tawbah) */}
                    {group.verses[0]?.verse_number === 1 && group.chapterId !== 1 && group.chapterId !== 9 && (
                      <div className="text-center my-4">
                        <div className="inline-block border border-primary/30 rounded-2xl px-8 py-3 bg-amber-50/60 text-2xl font-serif gold-gradient-text">
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </div>
                      </div>
                    )}
                    {/* Surah name label when surah starts mid-page */}
                    {groups.length > 1 && (
                      <div className="text-center text-sm text-primary/70 mb-2 font-serif">
                        ── {surahNames[group.chapterId] ? `سورة ${surahNames[group.chapterId]}` : ""} ──
                      </div>
                    )}
                    {/* Verses */}
                    <div className="text-center leading-[3.2] text-2xl md:text-3xl font-serif text-foreground/90">
                      {group.verses.map(verse => {
                        const isActive = activeVerse?.id === verse.id;
                        return (
                          <span
                            key={verse.id}
                            ref={isActive ? (el => { activeVerseRef.current = el; }) : null}
                            onClick={() => handleVerseClick(verse)}
                            className={`inline cursor-pointer transition-all duration-200 rounded-sm px-0.5
                              ${isActive
                                ? "bg-amber-100 text-amber-900 ring-2 ring-amber-400/60 rounded-md"
                                : "hover:bg-amber-50"
                              }`}
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
                ))}
              </div>
            )}
          </div>

          {/* ── Active Verse Controls ── */}
          <AnimatePresence>
            {activeVerse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border-t border-amber-200/60 bg-amber-50/70 px-5 py-3 flex items-center gap-3 flex-wrap"
                dir="rtl"
              >
                <span className="text-xs text-muted-foreground">
                  {surahNames[activeVerse.chapter_id]
                    ? `سورة ${surahNames[activeVerse.chapter_id]}`
                    : `سورة ${activeVerse.chapter_id}`} – آية {toArabicNumerals(activeVerse.verse_number)}
                </span>
                <div className="flex items-center gap-2 mr-auto">
                  <button
                    onClick={() => isPlaying ? stopAudio() : playVerse(activeVerse)}
                    className="flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    {isPlaying ? <><Pause className="w-3 h-3" /> إيقاف</> : <><Play className="w-3 h-3" /> استمع</>}
                  </button>
                  <button
                    onClick={repeatVerse}
                    className="flex items-center gap-1.5 bg-secondary text-foreground/70 hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> تكرار
                  </button>
                  <button
                    onClick={() => { stopAudio(); setActiveVerse(null); }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Navigation Footer ── */}
          <div className="p-4 border-t border-border/50 bg-background/50 flex justify-between items-center">
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === TOTAL_PAGES}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              الصفحة التالية
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={markPageRead}
                disabled={isRead}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1
                  ${isRead ? "text-green-600 bg-green-50" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
              >
                {isRead ? <><Check className="w-3 h-3" /> مقروءة</> : "✓ علّم مقروءة"}
              </button>
              <span className="text-sm text-primary arabic-numerals font-bold">
                {toArabicNumerals(currentPage)} / {toArabicNumerals(TOTAL_PAGES)}
              </span>
            </div>

            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
            >
              الصفحة السابقة
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-muted-foreground/60 mt-4">
          اضغط على أي آية للاستماع إليها · يتم حفظ تقدّمك تلقائياً
        </p>
      </div>
    </section>
  );
}
