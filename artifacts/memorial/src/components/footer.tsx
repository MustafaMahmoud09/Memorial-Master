import { Heart, Share2 } from "lucide-react";

export function Footer() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "صدقة جارية | المهندس أيمن مبروك ريان",
          text:  "منصة دعاء وذكر وصدقة جارية لروح المهندس أيمن مبروك ريان.",
          url:   window.location.href,
        });
      } catch { /* dismissed */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <footer className="py-16 border-t border-gray-100 relative z-10 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">

        {/* Ornament */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A227]/30" />
          <Heart className="w-5 h-5 text-[#C9A227] opacity-50" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A227]/30" />
        </div>

        {/* Dua */}
        <p className="text-lg md:text-xl font-serif text-gray-600 leading-[2.2] mb-10 max-w-2xl mx-auto">
          اللهم اجعل هذا الموقع صدقةً جاريةً خالصةً لوجهك الكريم، في ميزان حسنات المهندس أيمن مبروك ريان، واكتب الأجر لكل من زاره ودعا له وذكرك فيه.
        </p>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white font-medium text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #B8860B 0%, #C9A227 50%, #8B6914 100%)" }}
        >
          <Share2 className="w-4 h-4" />
          شارك الموقع كصدقة جارية
        </button>

        {/* Meta */}
        <div className="mt-10 text-gray-400 text-sm flex flex-col gap-1.5">
          <p>توفي إلى رحمة الله في ١١ مارس ٢٠٢٢</p>
          <p className="flex items-center justify-center gap-1 opacity-50" dir="ltr">
            Made with reverence <Heart className="w-3 h-3 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
