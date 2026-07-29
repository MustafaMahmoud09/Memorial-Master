import { useState } from "react";
import { motion } from "framer-motion";
import { useGetDuas, useSubmitDua, getGetDuasQueryKey, getGetStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Send, HeartHandshake, Loader2 } from "lucide-react";
import { toArabicNumerals } from "@/lib/utils";

export function DuaSection() {
  const [duaText, setDuaText] = useState("");
  const { data: duas = [], isLoading } = useGetDuas();
  const submitDua = useSubmitDua();
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
        }
      }
    );
  };

  return (
    <section className="py-24 px-4 bg-black/20 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <HeartHandshake className="w-10 h-10 text-primary mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-serif text-foreground gold-gradient-text mb-4">سجل دعاءك</h2>
          <p className="text-muted-foreground text-lg">
            اكتب دعاءً نابعاً من القلب، يكون له نوراً وسلاماً.
          </p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit} 
          className="glass-panel rounded-2xl p-4 md:p-6 mb-16 border border-primary/20 shadow-2xl"
        >
          <div className="relative">
            <textarea
              value={duaText}
              onChange={(e) => setDuaText(e.target.value)}
              placeholder="اللهم اغفر له وارحمه..."
              className="w-full bg-background/50 border border-border rounded-xl p-4 min-h-[120px] text-foreground font-serif text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all placeholder:text-muted-foreground/50"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={!duaText.trim() || submitDua.isPending}
              className="absolute bottom-4 left-4 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitDua.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-1" />}
              أرسل الدعاء
            </button>
          </div>
        </motion.form>

        <div className="space-y-6">
          <h3 className="text-2xl font-serif text-foreground/90 border-b border-border/50 pb-4 flex justify-between items-center">
            <span>دعوات الزوار</span>
            <span className="text-sm font-sans text-primary bg-primary/10 px-3 py-1 rounded-full arabic-numerals">
              {toArabicNumerals(duas.length)} دعاء
            </span>
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : duas.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground font-serif">
              كن أول من يدعو له اليوم.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {duas.map((dua, i) => (
                <motion.div
                  key={dua.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 10) * 0.05 }}
                  className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-primary/30 transition-colors"
                >
                  <p className="text-foreground/90 font-serif text-lg leading-loose mb-4">
                    "{dua.text}"
                  </p>
                  <div className="text-xs text-muted-foreground font-sans arabic-numerals">
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
