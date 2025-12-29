import { ArrowLeft, Share2, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { HealthScore } from "@/components/product/HealthScore";
import { IngredientAlert } from "@/components/product/IngredientAlert";
import { BetterAlternative } from "@/components/product/BetterAlternative";

const mockProduct = {
  name: "Oat Cookies",
  brand: "Nature's Best",
  score: 35,
  image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
  ingredients: [
    { name: "Palm Oil", concern: "High in saturated fats, environmental concerns" },
    { name: "Added Sugar", concern: "25g per serving, exceeds daily recommended intake" },
  ],
};

const mockAlternative = {
  name: "Organic Oat Bites",
  brand: "Green Valley",
  score: 78,
  image: "https://images.unsplash.com/photo-1499636136210-6598f4a9a2e0?w=200&h=200&fit=crop",
};

const ProductPage = () => {
  return (
    <div className="min-h-screen pb-8">
      {/* Header Image */}
      <div className="relative h-56">
        <img
          src={mockProduct.image}
          alt={mockProduct.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12">
          <Link
            to="/"
            className="p-2.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-soft hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          
          <div className="flex gap-2">
            <button className="p-2.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-soft hover:bg-card transition-colors">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-soft hover:bg-card transition-colors">
              <Bookmark className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-8 relative z-10">
        {/* Product Info Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 animate-fade-up">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{mockProduct.brand}</p>
              <h1 className="text-xl font-bold text-foreground mt-1">
                {mockProduct.name}
              </h1>
            </div>
            <HealthScore score={mockProduct.score} size="md" />
          </div>
        </div>

        {/* Ingredient Alerts */}
        <div className="mt-5">
          <IngredientAlert ingredients={mockProduct.ingredients} />
        </div>

        {/* Better Alternative */}
        <div className="mt-5">
          <BetterAlternative product={mockAlternative} />
        </div>

        {/* Nutritional Overview */}
        <div className="mt-5 bg-card rounded-2xl p-4 border border-border/50 shadow-soft animate-fade-up animation-delay-300">
          <h3 className="font-semibold text-foreground mb-4">Nutritional Facts</h3>
          <div className="space-y-3">
            {[
              { label: "Calories", value: "180 kcal", bar: 35 },
              { label: "Sugar", value: "25g", bar: 85 },
              { label: "Fat", value: "8g", bar: 45 },
              { label: "Fiber", value: "2g", bar: 15 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.bar > 70 ? "bg-score-bad" : item.bar > 40 ? "bg-score-medium" : "bg-score-good"
                    }`}
                    style={{ width: `${item.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
