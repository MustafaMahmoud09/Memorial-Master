import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Compass, Loader2 } from "lucide-react";
import { toArabicNumerals } from "@/lib/utils";

const GOLD = "linear-gradient(135deg, #B8860B 0%, #C9A227 50%, #8B6914 100%)";

function to12Hour(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, "0");
  const suffix = h < 12 ? "ص" : "م";
  if (h === 0) h = 12;
  else if (h > 12) h = h - 12;
  return `${h}:${m} ${suffix}`;
}

type PrayerTimes = { Fajr: string; Sunrise: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string };
const ARABIC_PRAYERS: Record<keyof PrayerTimes, string> = {
  Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر",
  Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء",
};

export function PrayerTimesSection() {
  const [times, setTimes]               = useState<PrayerTimes | null>(null);
  const [loading, setLoading]           = useState(true);
  const [locationName, setLocationName] = useState("القاهرة، مصر");

  useEffect(() => {
    async function fetchTimes(lat: number, lng: number) {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const res  = await fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=4`);
        const data = await res.json();
        if (data?.data?.timings) {
          const t = data.data.timings;
          setTimes({ Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr, Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha });
        }
      } catch { /* ignore */ } finally { setLoading(false); }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, { headers: { "Accept-Language": "ar" } });
            const d   = await geo.json();
            const city    = d?.address?.city || d?.address?.town || d?.address?.village || "الموقع الحالي";
            const country = d?.address?.country || "";
            setLocationName(country ? `${city}، ${country}` : city);
          } catch { setLocationName("الموقع الحالي"); }
          fetchTimes(latitude, longitude);
        },
        () => fetchTimes(30.0444, 31.2357),
        { timeout: 10000 }
      );
    } else { fetchTimes(30.0444, 31.2357); }
  }, []);

  return (
    <section className="py-24 px-4 z-10 relative bg-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-14 gap-4 text-center md:text-right">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif mb-2 flex items-center gap-3 justify-center md:justify-start"
              style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              <Compass className="w-7 h-7 text-[#C9A227]" />
              مواقيت الصلاة
            </h2>
            <p className="text-gray-500">لا تنسَ الدعاء له في سجودك وبعد الصلوات المكتوبة</p>
          </div>
          <div className="flex items-center gap-2 bg-[#FEFCF5] px-4 py-2 rounded-full border border-[#C9A227]/20 text-sm text-gray-600 shadow-sm">
            <MapPin className="w-4 h-4 text-[#C9A227]" />
            {locationName}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#C9A227]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {times && Object.entries(times).map(([key, timeStr], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-5 text-center transition-all hover:shadow-md group cursor-default"
                style={{
                  background: "rgba(255,253,245,0.9)",
                  border: "1px solid rgba(201,162,39,0.15)",
                  boxShadow: "0 2px 12px rgba(201,162,39,0.05)",
                }}
              >
                <div className="text-sm font-serif mb-2 text-gray-600 group-hover:text-[#B8860B] transition-colors">
                  {ARABIC_PRAYERS[key as keyof PrayerTimes]}
                </div>
                <div className="text-xl font-bold arabic-numerals" style={{ color: "#B8860B" }}>
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
