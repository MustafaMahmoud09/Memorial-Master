import { useEffect } from "react";
import { useRecordVisit } from "@workspace/api-client-react";
import { ParticleBackground } from "@/components/particle-bg";
import { Hero } from "@/components/hero";
import { TimeCounter } from "@/components/time-counter";
import { PrayerTimesSection } from "@/components/prayer-times";
import { TasbeehSection } from "@/components/tasbeeh";
import { DuaSection } from "@/components/dua-section";
import { DailyContent } from "@/components/daily-content";
import { QuranReader } from "@/components/quran-reader";
import { Statistics } from "@/components/statistics";
import { Footer } from "@/components/footer";

export function Home() {
  const recordVisit = useRecordVisit();

  useEffect(() => {
    // Record visit once per session
    if (!sessionStorage.getItem("visit_recorded")) {
      recordVisit.mutate({ data: { country: "غير معروف" } }); // Real app would resolve IP
      sessionStorage.setItem("visit_recorded", "true");
    }

    // Friday Mode Check
    const today = new Date().getDay();
    if (today === 5) {
      document.documentElement.classList.add("friday-mode");
    } else {
      document.documentElement.classList.remove("friday-mode");
    }
  }, []);

  const isFriday = new Date().getDay() === 5;

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <ParticleBackground />
      
      {isFriday && (
        <div className="bg-primary text-primary-foreground py-2 text-center text-sm font-serif font-bold sticky top-0 z-50">
          يوم الجمعة المبارك - لا تنسَ قراءة سورة الكهف والإكثار من الصلاة على النبي ﷺ
        </div>
      )}

      <Hero />
      <TimeCounter />
      <PrayerTimesSection />
      <TasbeehSection />
      <QuranReader />
      <DailyContent />
      <DuaSection />
      <Statistics />
      <Footer />
    </main>
  );
}
