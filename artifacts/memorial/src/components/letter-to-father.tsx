import { motion } from "framer-motion";

export function LetterToFather() {
  return (
    <section className="py-28 px-4 relative z-10 overflow-hidden">
      {/* Soft background tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFFDF5] to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A227]/60" />
            <span className="text-[#C9A227]/80 text-sm tracking-[0.3em] uppercase font-sans">رسالة خاصة</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A227]/60" />
          </div>
          <h2
            className="text-4xl md:text-5xl font-display"
            style={{
              background: "linear-gradient(135deg, #B8860B 0%, #C9A227 50%, #8B6914 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            رسالة إلى أبي
          </h2>
        </motion.div>

        {/* Letter card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Paper-like card */}
          <div
            className="relative rounded-3xl p-10 md:p-14"
            style={{
              background: "rgba(255, 253, 245, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(201, 162, 39, 0.18)",
              boxShadow: "0 8px 60px rgba(201, 162, 39, 0.08), 0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {/* Decorative top ornament */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A227]/40" />
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#C9A227]/60" fill="currentColor">
                <path d="M12 2 L13.5 9 L20 7 L15 12 L20 17 L13.5 15 L12 22 L10.5 15 L4 17 L9 12 L4 7 L10.5 9 Z" />
              </svg>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A227]/40" />
            </div>

            {/* Opening quote */}
            <div className="text-[#C9A227]/25 text-8xl font-serif leading-none text-right mb-2 -mt-4 -mr-2 select-none">"</div>

            {/* Letter body */}
            <div className="space-y-6 text-right" dir="rtl">
              <p className="text-2xl md:text-3xl font-serif text-gray-800 leading-loose">
                أبي الحبيب...
              </p>

              <p className="text-xl font-serif text-gray-700 leading-[2.2]">
                كلما أتيت إلى هذا الموقع، أشعر بأنك لم تغادر.
                <br />
                لأن الأثر الذي تركته في قلبي أكبر من أي غياب.
              </p>

              <p className="text-xl font-serif text-gray-700 leading-[2.2]">
                علّمتني بصمتك قبل كلامك، وبأفعالك قبل نصائحك.
                <br />
                علّمتني أن تكون رجلاً يُعتمد عليه، وأن يُحب من حوله بصدق.
              </p>

              <p className="text-xl font-serif text-gray-700 leading-[2.2]">
                أسأل الله كل يوم أن يجعل قبرك روضةً من رياض الجنة،
                <br />
                وأن يجمعنا بك في الفردوس الأعلى.
              </p>

              <p className="text-2xl font-serif text-gray-800 leading-loose mt-8">
                أحبك يا أبي، ولن أنساك أبدًا.
              </p>
            </div>

            {/* Closing ornament */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A227]/30" />
              <div className="flex gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#C9A227]/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227]/70" />
                <div className="w-1 h-1 rounded-full bg-[#C9A227]/50" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A227]/30" />
            </div>

            {/* Signature line */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-400 font-sans tracking-widest uppercase">
                ابنكم المحب — يدعو لك في كل صلاة
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
