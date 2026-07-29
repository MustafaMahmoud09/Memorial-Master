import { Heart, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { toArabicNumerals } from "@/lib/utils";

export function Footer() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'صدقة جارية | المهندس أيمن مبروك ريان',
          text: 'منصة دعاء وذكر وصدقة جارية لروح المهندس أيمن مبروك ريان.',
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ الرابط");
    }
  };

  return (
    <footer className="py-12 border-t border-border/40 relative z-10 bg-background">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        <Heart className="w-6 h-6 text-primary mx-auto mb-6 opacity-50" />
        
        <p className="text-lg md:text-xl font-serif text-foreground/80 leading-loose mb-8">
          اللهم اجعل هذا الموقع صدقةً جاريةً خالصةً لوجهك الكريم، في ميزان حسنات المهندس أيمن مبروك ريان، واكتب الأجر لكل من زاره ودعا له وذكرك فيه.
        </p>

        <div className="flex justify-center gap-4 mb-12">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-2.5 rounded-full transition-colors font-medium text-sm"
          >
            <Share2 className="w-4 h-4" />
            شارك الموقع كصدقة جارية
          </button>
        </div>

        <div className="text-muted-foreground/60 text-sm font-sans flex flex-col gap-2">
          <p>
            توفي إلى رحمة الله في ١١ مارس ٢٠٢٢
          </p>
          <p className="dir-ltr flex items-center justify-center gap-1 opacity-50">
            Made with reverence <Heart className="w-3 h-3 fill-current" />
          </p>
        </div>

      </div>
    </footer>
  );
}
