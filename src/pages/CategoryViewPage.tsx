import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Star, ExternalLink, Shield, Skull } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  healthScore: number;
  isVillain: boolean;
  affiliateUrl: string;
}

const categoryProducts: Record<string, Product[]> = {
  biscuits: [
    {
      id: "1",
      name: "Parle-G Gold",
      brand: "Parle",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop",
      healthScore: 45,
      isVillain: false,
      affiliateUrl: "https://blinkit.com",
    },
    {
      id: "2",
      name: "Oreo Original",
      brand: "Cadbury",
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=200&h=200&fit=crop",
      healthScore: 32,
      isVillain: true,
      affiliateUrl: "https://zepto.co",
    },
    {
      id: "3",
      name: "Digestive Biscuits",
      brand: "McVities",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop",
      healthScore: 58,
      isVillain: false,
      affiliateUrl: "https://blinkit.com",
    },
    {
      id: "4",
      name: "Marie Gold",
      brand: "Britannia",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop",
      healthScore: 72,
      isVillain: false,
      affiliateUrl: "https://zepto.co",
    },
  ],
  drinks: [
    {
      id: "5",
      name: "Coca-Cola Classic",
      brand: "Coca-Cola",
      image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop",
      healthScore: 15,
      isVillain: true,
      affiliateUrl: "https://blinkit.com",
    },
    {
      id: "6",
      name: "Real Fruit Juice",
      brand: "Dabur",
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop",
      healthScore: 55,
      isVillain: false,
      affiliateUrl: "https://zepto.co",
    },
    {
      id: "7",
      name: "Paper Boat Aam Panna",
      brand: "Paper Boat",
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=200&h=200&fit=crop",
      healthScore: 68,
      isVillain: false,
      affiliateUrl: "https://blinkit.com",
    },
  ],
  chocolates: [
    {
      id: "8",
      name: "Dairy Milk Silk",
      brand: "Cadbury",
      image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200&h=200&fit=crop",
      healthScore: 28,
      isVillain: true,
      affiliateUrl: "https://zepto.co",
    },
    {
      id: "9",
      name: "Dark Fantasy",
      brand: "Sunfeast",
      image: "https://images.unsplash.com/photo-1548907040-4bea42c3d7c5?w=200&h=200&fit=crop",
      healthScore: 35,
      isVillain: true,
      affiliateUrl: "https://blinkit.com",
    },
  ],
  noodles: [
    {
      id: "10",
      name: "Maggi 2-Minute",
      brand: "Nestle",
      image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200&h=200&fit=crop",
      healthScore: 22,
      isVillain: true,
      affiliateUrl: "https://zepto.co",
    },
    {
      id: "11",
      name: "Top Ramen",
      brand: "Nissin",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop",
      healthScore: 25,
      isVillain: true,
      affiliateUrl: "https://blinkit.com",
    },
  ],
  snacks: [
    {
      id: "12",
      name: "Lays Magic Masala",
      brand: "PepsiCo",
      image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop",
      healthScore: 18,
      isVillain: true,
      affiliateUrl: "https://zepto.co",
    },
    {
      id: "13",
      name: "Kurkure",
      brand: "PepsiCo",
      image: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=200&h=200&fit=crop",
      healthScore: 15,
      isVillain: true,
      affiliateUrl: "https://blinkit.com",
    },
    {
      id: "14",
      name: "Cornitos",
      brand: "Cornitos",
      image: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=200&h=200&fit=crop",
      healthScore: 52,
      isVillain: false,
      affiliateUrl: "https://zepto.co",
    },
  ],
  dairy: [
    {
      id: "15",
      name: "Amul Gold Milk",
      brand: "Amul",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
      healthScore: 85,
      isVillain: false,
      affiliateUrl: "https://blinkit.com",
    },
    {
      id: "16",
      name: "Greek Yogurt",
      brand: "Epigamia",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop",
      healthScore: 82,
      isVillain: false,
      affiliateUrl: "https://zepto.co",
    },
  ],
};

const categoryMeta: Record<string, { emoji: string; title: string }> = {
  biscuits: { emoji: "🍪", title: "Biscuits" },
  drinks: { emoji: "🥤", title: "Drinks" },
  chocolates: { emoji: "🍫", title: "Chocolates" },
  noodles: { emoji: "🍜", title: "Noodles" },
  snacks: { emoji: "🍿", title: "Snacks" },
  dairy: { emoji: "🥛", title: "Dairy" },
};

const CategoryViewPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  const products = categoryProducts[category?.toLowerCase() || ""] || [];
  const meta = categoryMeta[category?.toLowerCase() || ""] || { emoji: "📦", title: category };

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
    const platform = product.affiliateUrl.includes("blinkit") ? "Blinkit" : "Zepto";
    toast.success(`Redirecting to ${platform}...`, {
      description: `Opening ${product.name} on ${platform}`,
      duration: 2000,
    });
    // Simulate affiliate redirect
    setTimeout(() => {
      window.open(product.affiliateUrl, "_blank");
    }, 1500);
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
          <div
            key={product.id}
            className="bg-card/50 rounded-2xl p-4 border border-border/30 backdrop-blur-sm hover:bg-card/70 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Product Image (App-style) */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted border border-border/30 shadow-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
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
          </div>
        ))}
      </div>

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
