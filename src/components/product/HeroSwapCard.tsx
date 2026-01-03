import { ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/data/GlobalStore";
import { getAffiliateLink, AMAZON_DISCLAIMER } from "@/lib/linkUtils";
import { useAdmin } from "@/contexts/AdminContext";

interface HeroSwapCardProps {
  hero: Product;
  villainName?: string;
}

export const HeroSwapCard = ({ hero, villainName }: HeroSwapCardProps) => {
  const { getLinkOverride } = useAdmin();
  
  const handleGetProduct = () => {
    const adminOverride = getLinkOverride(hero.name);
    const affiliateLink = getAffiliateLink(hero.name, hero.affiliateUrl, adminOverride);
    
    toast.success("Opening Amazon...", {
      description: `Redirecting to ${hero.name}`,
      duration: 2000,
    });
    setTimeout(() => {
      window.open(affiliateLink, "_blank");
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-score-good/20 to-primary/10 rounded-2xl p-5 border border-score-good/30 shadow-lg animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-score-good/20">
          <Sparkles className="w-5 h-5 text-score-good" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Hero Swap 🦸</h3>
          <p className="text-xs text-muted-foreground">
            {villainName ? `Switch from ${villainName}` : "Healthier alternative"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-border/30 shadow-md flex-shrink-0">
          <img
            src={hero.image}
            alt={hero.name}
            className="w-full h-full object-contain p-1"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{hero.name}</h4>
          <p className="text-sm text-muted-foreground">{hero.brand}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-score-good text-white text-xs font-bold">
              Score: {hero.healthScore}
            </span>
            <span className="text-xs text-score-good font-medium">✓ Clean Label</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleGetProduct}
        className="w-full py-3.5 bg-score-good text-white font-bold rounded-xl hover:bg-score-good/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-score-good/25"
      >
        Get Healthier Alternative
        <ExternalLink className="w-4 h-4" />
      </button>
      
      <p className="text-[10px] text-muted-foreground text-center mt-2 opacity-70">
        {AMAZON_DISCLAIMER}
      </p>
    </div>
  );
};
