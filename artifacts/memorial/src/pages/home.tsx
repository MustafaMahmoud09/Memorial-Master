import { useEffect } from "react";
import { useRecordVisit } from "@workspace/api-client-react";
import { LoadingScreen }   from "@/components/loading-screen";
import { ParticleBackground } from "@/components/particle-bg";
import { Hero }            from "@/components/hero";
import { TimeCounter }     from "@/components/time-counter";
import { PrayerTimesSection } from "@/components/prayer-times";
import { TasbeehSection }  from "@/components/tasbeeh";
import { DuaSection }      from "@/components/dua-section";
import { DailyContent }    from "@/components/daily-content";
import { QuranReader }     from "@/components/quran-reader";
import { LetterToFather }  from "@/components/letter-to-father";
import { Statistics }      from "@/components/statistics";
import { Footer }          from "@/components/footer";

export function Home() {
  const recordVisit = useRecordVisit();

  useEffect(() => {
    if (!sessionStorage.getItem("visit_recorded")) {
      recordVisit.mutate({ data: { country: "غير معروف" } });
      sessionStorage.setItem("visit_recorded", "true");
    }

    // Friday Mode
    const today = new Date().getDay();
    if (today === 5) document.documentElement.classList.add("friday-mode");
    else document.documentElement.classList.remove("friday-mode");
  }, []);

  const isFriday = new Date().getDay() === 5;

  return (
    <>
      {/* Luxury loading screen — disappears after ~2.8s */}
      <LoadingScreen />

      <main className="min-h-screen bg-white text-gray-800 overflow-x-hidden selection:bg-[#C9A227]/25 selection:text-[#8B6914]">
        <ParticleBackground />

        {isFriday && (
          <div className="py-2.5 text-center text-sm font-serif font-semibold sticky top-0 z-50 text-white"
            style={{ background: "linear-gradient(90deg, #B8860B, #C9A227, #B8860B)" }}>
            يوم الجمعة المبارك — لا تنسَ قراءة سورة الكهف والإكثار من الصلاة على النبي ﷺ
          </div>
        )}

        <Hero />
        <TimeCounter />
        <PrayerTimesSection />
        <TasbeehSection />
        <DailyContent />
        <QuranReader />
        <DuaSection />
        <LetterToFather />
        <Statistics />
        <Footer />
      </main>
    </>
  );
}
