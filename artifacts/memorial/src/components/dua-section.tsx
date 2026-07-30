import { useState } from "react";
import { motion } from "framer-motion";
import { useGetDuas, useSubmitDua, getGetDuasQueryKey, getGetStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Send, HeartHandshake, Loader2 } from "lucide-react";
import { toArabicNumerals } from "@/lib/utils";

const GOLD = "linear-gradient(135deg, #B8860B 0%, #C9A227 50%, #8B6914 100%)";

export function DuaSection() {
  const [duaText, setDuaText]   = useState("");
  const { data, isLoading } = useGetDuas();
  // A default of [] only covers `undefined`. If /api/duas ever answers with a
  // non-array (an HTML error page comes back as a string), the .map below would
  // throw and blank the whole page, so narrow to an array here.
  const duas = Array.isArray(data) ? data : [];
  const submitDua   = useSubmitDua();
  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duaText.trim()) return;
    submitDua.mutate(
      { data: { text: duaText } },
      {
        onSuccess: () => {
          setDuaText("");
          queryClient.invalidateQueries({ queryKey: getGetDuasQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        },
      }
    );
  };

  return (
    <section className="py-28 px-4 bg-[#FEFCF5] relative z-10 border-y border-gray-100">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{ background: "rgba(201,162,39,0.07)", border: "1px solid rgba(201,162,39,0.18)" }}>
            <HeartHandshake className="w-6 h-6 text-[#C9A227]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif mb-3"
            style={{ background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            سجّل دعاءك
          </h2>
          <p className="text-gray-500 text-lg">اكتب دعاءً نابعاً من القلب، يكون له نوراً وسلاماً.</p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="rounded-2xl p-4 md:p-6 mb-16"
          style={{
            background: "rgba(255,253,245,0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(201,162,39,0.2)",
            boxShadow: "0 4px 30px rgba(201,162,39,0.07)",
          }}
        >
          <div className="relative">
            <textarea
              value={duaText}
              onChange={e => setDuaText(e.target.value)}
              placeholder="اللهم اغفر له وارحمه..."
              className="w-full bg-white border border-gray-200 rounded-xl p-4 min-h-[120px] text-gray-800 font-serif text-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]/40 resize-none transition-all placeholder:text-gray-300"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={!duaText.trim() || submitDua.isPending}
              className="absolute bottom-4 left-4 text-white px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
              style={{ background: GOLD }}
            >
              {submitDua.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-1" />}
              أرسل الدعاء
            </button>
          </div>
        </motion.form>

        {/* Visitor duas */}
        <div className="space-y-6">
          <h3 className="text-2xl font-serif text-gray-700 border-b border-gray-100 pb-4 flex justify-between items-center">
            <span>دعوات الزوار</span>
            <span className="text-sm font-sans text-[#B8860B] bg-[#C9A227]/08 px-3 py-1 rounded-full arabic-numerals border border-[#C9A227]/20">
              {toArabicNumerals(duas.length)} دعاء
            </span>
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#C9A227]" />
            </div>
          ) : duas.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-serif">كن أول من يدعو له اليوم.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {duas.map((dua, i) => (
                <motion.div
                  key={dua.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 10) * 0.05 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#C9A227]/25 transition-colors shadow-sm hover:shadow-md"
                >
                  <p className="text-gray-700 font-serif text-lg leading-loose mb-4">"{dua.text}"</p>
                  <div className="text-xs text-gray-400 font-sans arabic-numerals">
                    {formatDistanceToNow(new Date(dua.createdAt), { addSuffix: true, locale: ar })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
