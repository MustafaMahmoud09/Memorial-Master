import { motion } from "framer-motion";
import { useHijriDate } from "@/hooks/use-time";
import portraitSrc from "@assets/Gemini_Generated_Image_cei9zxcei9zxcei9_1785280305382.png";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const hijri = useHijriDate();
  const gregorian = new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" }).format(new Date());

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 pb-16 px-4 md:px-8 z-10">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center w-full max-w-4xl mx-auto flex flex-col items-center"
      >
        <div className="relative mb-10 w-48 h-48 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-br from-primary/60 to-primary/10 animate-float">
          <div className="absolute inset-0 rounded-full animate-pulse-gold pointer-events-none" />
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/40 shadow-2xl relative z-10">
            <img 
              src={portraitSrc} 
              alt="المهندس أيمن مبروك ريان" 
              className="w-full h-full object-cover object-top filter brightness-110 contrast-110 saturate-90"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h2 className="text-primary tracking-widest text-sm md:text-base mb-4 font-sans font-medium uppercase opacity-90">
            في ذمة الله • 11 مارس 2022
          </h2>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-8 gold-gradient-text leading-tight md:leading-tight py-2">
            المهندس أيمن مبروك ريان
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-2xl mx-auto glass-panel p-6 md:p-10 rounded-2xl shadow-xl relative"
        >
          <div className="absolute -top-3 -left-3 text-4xl text-primary/30 font-serif">"</div>
          <div className="absolute -bottom-6 -right-3 text-4xl text-primary/30 font-serif">"</div>
          <p className="text-lg md:text-2xl leading-loose text-foreground/90 font-serif arabic-numerals">
            اللهم اغفر للمهندس أيمن مبروك ريان، وارحمه رحمةً واسعة، وعافه واعفُ عنه، وأكرم نُزُله، ووسِّع مُدخله، واغسله بالماء والثلج والبرد، ونقِّه من الذنوب والخطايا كما يُنقَّى الثوب الأبيض من الدنس، واجعل قبره روضةً من رياض الجنة، وافتح له بابًا إلى الفردوس الأعلى، واجعل هذا الموقع صدقةً جاريةً له، واجعل كل دعاء وذكر وقراءة قرآن تتم من خلاله في ميزان حسناته. اللهم آمين.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col md:flex-row gap-6 mt-12 text-sm md:text-base font-sans text-muted-foreground/80 justify-center items-center arabic-numerals"
        >
          <span className="px-4 py-1.5 rounded-full border border-border/50 bg-background/50 backdrop-blur">
            الموافق: {gregorian}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 hidden md:block" />
          <span className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary backdrop-blur">
            {hijri}
          </span>
        </motion.div>

      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-6 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs tracking-widest uppercase opacity-60">اسحب للأسفل</span>
        <ChevronDown className="w-5 h-5 text-primary/70" />
      </motion.div>

    </section>
  );
}
