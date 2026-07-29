import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Compass, Loader2 } from "lucide-react";
import { toArabicNumerals } from "@/lib/utils";

function to12Hour(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, "0");
  const suffix = h < 12 ? "ص" : "م";
  if (h === 0) h = 12;
  else if (h > 12) h = h - 12;
  return `${h}:${m} ${suffix}`;
}

type PrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

const ARABIC_PRAYERS: Record<keyof PrayerTimes, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

export function PrayerTimesSection() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("القاهرة، مصر");
  
  useEffect(() => {
    async function fetchTimes(lat: number, lng: number) {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        // Method 4 is Umm Al-Qura
        const res = await fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=4`);
        const data = await res.json();
        
        if (data && data.data && data.data.timings) {
          const t = data.data.timings;
          setTimes({
            Fajr: t.Fajr,
            Sunrise: t.Sunrise,
            Dhuhr: t.Dhuhr,
            Asr: t.Asr,
            Maghrib: t.Maghrib,
            Isha: t.Isha
          });
        }
      } catch (e) {
        console.error("Failed to fetch prayer times", e);
      } finally {
        setLoading(false);
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode to get city name
          try {
            const geo = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ar`,
              { headers: { "Accept-Language": "ar" } }
            );
            const geoData = await geo.json();
            const city =
              geoData?.address?.city ||
              geoData?.address?.town ||
              geoData?.address?.village ||
              geoData?.address?.county ||
              "الموقع الحالي";
            const country = geoData?.address?.country || "";
            setLocationName(country ? `${city}، ${country}` : city);
          } catch {
            setLocationName("الموقع الحالي");
          }
          fetchTimes(latitude, longitude);
        },
        () => {
          // Fallback to Cairo
          fetchTimes(30.0444, 31.2357);
        },
        { timeout: 10000 }
      );
    } else {
      fetchTimes(30.0444, 31.2357);
    }
  }, []);

  return (
    <section className="py-20 px-4 z-10 relative bg-background/50 border-y border-border/50">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4 text-center md:text-right">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground gold-gradient-text flex items-center gap-3 justify-center md:justify-start">
              <Compass className="w-6 h-6 text-primary" />
              مواقيت الصلاة
            </h2>
            <p className="text-muted-foreground mt-2">لا تنسَ الدعاء له في سجودك وبعد الصلوات المكتوبة</p>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-border/50 text-sm text-foreground/80">
            <MapPin className="w-4 h-4 text-primary" />
            {locationName}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {times && Object.entries(times).map(([key, timeStr], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card/60 backdrop-blur border border-border rounded-xl p-5 text-center hover:border-primary/40 transition-colors"
              >
                <div className="text-lg font-serif mb-2 text-foreground/90">
                  {ARABIC_PRAYERS[key as keyof PrayerTimes]}
                </div>
                <div className="text-xl md:text-2xl font-bold text-primary font-sans arabic-numerals">
                  {toArabicNumerals(to12Hour(timeStr))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
