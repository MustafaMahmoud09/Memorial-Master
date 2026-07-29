import { motion } from "framer-motion";
import { useGetStats } from "@workspace/api-client-react";
import { toArabicNumerals } from "@/lib/utils";
import { Users, Heart, Activity, Globe2, BookHeart } from "lucide-react";

const GOLD = "linear-gradient(135deg, #B8860B 0%, #C9A227 50%, #8B6914 100%)";

export function Statistics() {
  const { data: stats } = useGetStats();
  if (!stats) return null;

  const statCards = [
    { label: "الزوار الكرام",      value: stats.totalVisitors, icon: Users      },
    { label: "الدعوات المسجلة",    value: stats.totalDuas,     icon: Heart      },
    { label: "مجموع التسبيحات",    value: stats.totalDhikr,    icon: Activity   },
    { label: "الصلوات على النبي ﷺ", value: stats.totalSalawat,  icon: BookHeart  },
  ];

  return (
    <section className="py-28 px-4 z-10 relative bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <Globe2 className="w-8 h-8 text-[#C9A227] mx-auto mb-5 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-serif mb-4"
            style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            أثر باقٍ
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            هذه الأرقام هي شهادة حب ورجاء، ونور يتصل به في قبره بإذن الله.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="rounded-2xl p-6 text-center transition-all hover:shadow-lg group cursor-default"
              style={{
                background: "rgba(255,253,245,0.9)",
                border: "1px solid rgba(201,162,39,0.15)",
                boxShadow: "0 2px 16px rgba(201,162,39,0.05)",
              }}
            >
              <stat.icon className="w-6 h-6 mx-auto mb-3 text-[#C9A227]/60 group-hover:text-[#C9A227] transition-colors" />
              <div className="text-3xl md:text-4xl font-bold arabic-numerals mb-2 text-gray-800">
                {toArabicNumerals(stat.value)}
              </div>
              <div className="text-sm font-medium text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {stats.countries && stats.countries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center text-sm text-gray-400"
          >
            دعوات وصلت من {toArabicNumerals(stats.countries.length)} دولة حول العالم
          </motion.div>
        )}
      </div>
    </section>
  );
}
