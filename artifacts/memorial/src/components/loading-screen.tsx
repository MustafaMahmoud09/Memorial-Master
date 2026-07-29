import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          {/* Soft radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(201,162,39,0.08),transparent)]" />

          {/* Islamic ornament ring */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-10"
          >
            {/* Outer ring */}
            <div className="w-28 h-28 rounded-full border border-[#C9A227]/25 flex items-center justify-center">
              {/* Middle ring */}
              <div className="w-20 h-20 rounded-full border border-[#C9A227]/40 flex items-center justify-center">
                {/* Inner circle */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C9A227]/15 to-[#C9A227]/5 flex items-center justify-center border border-[#C9A227]/30">
                  {/* SVG Islamic star */}
                  <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                    <path
                      d="M20 4 L22 16 L34 12 L24 20 L34 28 L22 24 L20 36 L18 24 L6 28 L16 20 L6 12 L18 16 Z"
                      fill="none"
                      stroke="#C9A227"
                      strokeWidth="1"
                      strokeLinejoin="round"
                    />
                    <circle cx="20" cy="20" r="3" fill="#C9A227" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rotating dots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                <div
                  key={deg}
                  className="absolute w-1 h-1 rounded-full bg-[#C9A227]/50"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translateY(-56px) translate(-50%, -50%)`,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Bismillah */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-2xl font-serif text-[#C9A227] mb-3 tracking-wide"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>

          {/* Site name */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-lg font-display text-gray-700 tracking-widest"
          >
            المهندس أيمن مبروك ريان
          </motion.h1>

          {/* Thin gold progress line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
