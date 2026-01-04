import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Shield, Skull } from "lucide-react";
import { toast } from "sonner";
import { getProductsByCategory, categoryMeta, Product } from "@/data/GlobalStore";
import { getAffiliateLink, AMAZON_DISCLAIMER } from "@/lib/linkUtils";
import { useAdmin } from "@/contexts/AdminContext";

const CategoryViewPage = () => {
  const { getLinkOverride } = useAdmin();
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  const products = getProductsByCategory(category || "");
  const meta = categoryMeta[category?.toLowerCase() || ""] || { emoji: "📦", title: category || "Products" };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-score-good text-white";
    if (score >= 40) return "bg-score-okay text-white";
    return "bg-score-bad text-white";
  };

  const getScoreGlow = (score: number) => {
    if (score >= 70) return "shadow-[0_0_20px_rgba(34,197,94,0.4)]";
    if (score >= 40) return "shadow-[0_0_20px_rgba(234,179,8,0.4)]";
    return "shadow-[0_0_20px_rgba(239,68,68,0.4)]";
  };

  const handleGetProduct = (product: Product) => {
    const adminOverride = getLinkOverride(product.name);
    const affiliateLink = getAffiliateLink(product.name, product.affiliateUrl, adminOverride);
    
    toast.success("Opening Amazon...", {
      description: `Redirecting to ${product.name}`,
      duration: 2000,
    });
    setTimeout(() => {
      window.open(affiliateLink, "_blank");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-border/20">
        <div className="px-5 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-card/50 border border-border/30 hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meta.emoji}</span>
            <h1 className="text-xl font-bold text-foreground">{meta.title}</h1>
          </div>
        </div>
      </header>

      {/* Product Count */}
      <div className="px-5 py-4">
        <p className="text-sm text-muted-foreground">
          {products.length} products found
        </p>
      </div>

      {/* Product List */}
      <div className="px-5 space-y-3">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="block bg-card/50 rounded-2xl p-4 border border-border/30 backdrop-blur-sm hover:bg-card/70 hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center gap-4">
              {/* Product Image (App-style) */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-border/30 shadow-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                {/* Hero/Villain Badge */}
                <div
                  className={`absolute -bottom-1 -right-1 p-1.5 rounded-full ${
                    product.isVillain
                      ? "bg-destructive"
                      : "bg-score-good"
                  }`}
                >
                  {product.isVillain ? (
                    <Skull className="w-3 h-3 text-white" />
                  ) : (
                    <Shield className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.brand}
                </p>
                <div
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    product.isVillain
                      ? "bg-destructive/20 text-destructive"
                      : "bg-score-good/20 text-score-good"
                  }`}
                >
                  {product.isVillain ? (
                    <>
                      <Skull className="w-3 h-3" />
                      Villain
                    </>
                  ) : (
                    <>
                      <Shield className="w-3 h-3" />
                      Hero
                    </>
                  )}
                </div>
              </div>

              {/* Score & CTA */}
              <div className="flex flex-col items-end gap-2">
                {/* Health Score Badge */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg ${getScoreColor(
                    product.healthScore
                  )} ${getScoreGlow(product.healthScore)}`}
                >
                  {product.healthScore}
                </div>
                
                {/* Get Product Button */}
                <button
                  onClick={() => handleGetProduct(product)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  <span>Get</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Amazon Disclaimer */}
      {products.length > 0 && (
        <div className="px-5 py-4">
          <p className="text-[10px] text-muted-foreground text-center opacity-70">
            {AMAZON_DISCLAIMER}
          </p>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-5">
          <span className="text-6xl mb-4">🔍</span>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No products yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Be the first to scan a product in this category!
          </p>
          <Link
            to="/scan"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Scan Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryViewPage;
