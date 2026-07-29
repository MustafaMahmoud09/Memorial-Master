import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Bookmark, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { toArabicNumerals } from "@/lib/utils";

const SURAHS = Array.from({ length: 114 }, (_, i) => i + 1);

export function QuranReader() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fetch chapters list
    fetch("https://api.quran.com/api/v4/chapters?language=ar")
      .then(res => res.json())
      .then(data => {
        setSurahs(data.chapters);
        // Check bookmark
        const saved = localStorage.getItem("quran_bookmark");
        if (saved) {
          setSelectedSurah(parseInt(saved));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedSurah) return;
    setLoading(true);
    // Fetch verses with Uthmani text
    fetch(`https://api.quran.com/api/v4/verses/by_chapter/${selectedSurah}?language=ar&translations=131&fields=text_uthmani&per_page=300`)
      .then(res => res.json())
      .then(data => {
        setVerses(data.verses);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Reset audio
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [selectedSurah]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleBookmark = () => {
    localStorage.setItem("quran_bookmark", selectedSurah.toString());
    alert("تم حفظ العلامة المرجعية");
  };

  const filteredSurahs = surahs.filter(s => s.name_arabic.includes(searchQuery));

  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground gold-gradient-text mb-4">ورد القرآن</h2>
          <p className="text-muted-foreground">"اقرأوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه"</p>
        </div>

        <div className="bg-card/80 backdrop-blur border border-primary/20 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Controls */}
          <div className="p-4 border-b border-border/50 bg-background/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="ابحث عن سورة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-foreground"
                />
              </div>
              <select 
                value={selectedSurah} 
                onChange={(e) => setSelectedSurah(Number(e.target.value))}
                className="bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-full md:w-auto"
              >
                {filteredSurahs.map(s => (
                  <option key={s.id} value={s.id}>
                    {toArabicNumerals(s.id)}. سورة {s.name_arabic}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleBookmark}
                className="p-2 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                title="حفظ العلامة"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              
              <audio 
                ref={audioRef}
                src={`https://download.quranicaudio.com/quran/abdulbaset_mujawwad/${String(selectedSurah).padStart(3, '0')}.mp3`}
                onEnded={() => setIsPlaying(false)}
              />
              <button 
                onClick={toggleAudio}
                className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'إيقاف التلاوة' : 'استمع للسورة'}
              </button>
            </div>
          </div>

          {/* Reader Area */}
          <div className="p-6 md:p-10 min-h-[50vh] max-h-[70vh] overflow-y-auto bg-white/5 dark:bg-black/20" dir="rtl">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="text-center space-y-6">
                {selectedSurah !== 1 && selectedSurah !== 9 && (
                  <div className="text-2xl font-serif text-primary mb-8 gold-gradient-text">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                )}
                
                <p className="text-2xl md:text-3xl lg:text-4xl leading-[2.5] md:leading-[3] font-serif text-foreground/90">
                  {verses.map(verse => (
                    <span key={verse.id} className="inline">
                      {verse.text_uthmani}
                      <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mx-2 text-sm md:text-base border border-primary/30 rounded-full bg-primary/5 text-primary arabic-numerals my-1 align-middle">
                        {toArabicNumerals(verse.verse_number)}
                      </span>
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-border/50 bg-background/50 flex justify-between items-center">
            <button 
              onClick={() => setSelectedSurah(Math.min(114, selectedSurah + 1))}
              disabled={selectedSurah === 114}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
              السورة التالية
            </button>
            <span className="text-sm text-primary arabic-numerals">سورة {toArabicNumerals(selectedSurah)}</span>
            <button 
              onClick={() => setSelectedSurah(Math.max(1, selectedSurah - 1))}
              disabled={selectedSurah === 1}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              السورة السابقة
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
