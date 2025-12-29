import { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Share2, Bookmark, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { HealthScore } from "@/components/product/HealthScore";
import { IngredientAlert } from "@/components/product/IngredientAlert";
import { BetterAlternative } from "@/components/product/BetterAlternative";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Mock data for demo when no barcode is provided
const mockProduct = {
  name: "Oat Cookies",
  brand: "Nature's Best",
  health_score: 35,
  front_image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
  ingredients_text: "Wheat flour, palm oil, sugar, oats, glucose syrup, raising agents, salt, emulsifier",
};

const mockAlternative = {
  name: "Organic Oat Bites",
  brand: "Green Valley",
  score: 78,
  image: "https://images.unsplash.com/photo-1499636136210-6598f4a9a2e0?w=200&h=200&fit=crop",
};

// Parse ingredients to find concerning ones
const parseIngredients = (ingredientsText: string | null) => {
  if (!ingredientsText) return [];
  
  const concerningIngredients: { name: string; concern: string }[] = [];
  const text = ingredientsText.toLowerCase();
  
  if (text.includes("palm oil")) {
    concerningIngredients.push({ name: "Palm Oil", concern: "High in saturated fats, environmental concerns" });
  }
  if (text.includes("sugar") || text.includes("glucose") || text.includes("fructose")) {
    concerningIngredients.push({ name: "Added Sugar", concern: "May exceed daily recommended intake" });
  }
  if (text.includes("sodium") || text.includes("salt")) {
    concerningIngredients.push({ name: "High Sodium", concern: "May contribute to high blood pressure" });
  }
  
  return concerningIngredients;
};

const ProductPage = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const [searchParams] = useSearchParams();
  const isAnalyzing = searchParams.get("analyzing") === "true";
  const [isRetrying, setIsRetrying] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", barcode],
    queryFn: async () => {
      if (!barcode) return null;
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("barcode", barcode)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!barcode,
    refetchInterval: (query) => {
      // Auto-refetch every 5 seconds while analyzing
      if (query.state.data?.health_score === null) {
        return 5000;
      }
      return false;
    },
  });

  const handleRetryAnalysis = async () => {
    if (!barcode) return;
    
    setIsRetrying(true);
    try {
      const { error } = await supabase.functions.invoke("analyze-product", {
        body: { barcode },
      });
      
      if (error) throw error;
      
      toast({
        title: "Analysis Started",
        description: "AI is re-analyzing the product. Results will appear shortly.",
      });
      
      // Refetch product data after a short delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["product", barcode] });
      }, 3000);
    } catch (error) {
      console.error("Retry analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not start analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  // Use mock data when no barcode (for demo purposes)
  const displayProduct = barcode ? product : mockProduct;
  const ingredients = parseIngredients(displayProduct?.ingredients_text || (barcode ? null : mockProduct.ingredients_text));
  
  // Check if AI is still analyzing (no health score yet)
  const showAnalyzingBanner = isAnalyzing || (product && product.health_score === null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (barcode && !product && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Product not found</p>
          <Link to="/" className="text-primary hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = displayProduct?.front_image_url || mockProduct.front_image_url;
  const productName = displayProduct?.name || mockProduct.name;
  const productBrand = displayProduct?.brand || mockProduct.brand;
  const score = displayProduct?.health_score ?? mockProduct.health_score;

  return (
    <div className="min-h-screen pb-8">
      {/* AI Analyzing Banner */}
      {showAnalyzingBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-3 px-4">
          <div className="flex items-center justify-center gap-2 animate-pulse">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">AI is Analyzing Label... Check back soon</span>
          </div>
        </div>
      )}

      {/* Header Image */}
      <div className={`relative h-56 ${showAnalyzingBanner ? 'mt-12' : ''}`}>
        <img
          src={imageUrl}
          alt={productName}
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
              <p className="text-sm text-muted-foreground">{productBrand}</p>
              <h1 className="text-xl font-bold text-foreground mt-1">
                {productName}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Health Score or Loading indicator */}
              {showAnalyzingBanner ? (
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : score !== null ? (
                <HealthScore score={score} size="md" />
              ) : null}
              
              {/* Always show refresh button */}
              <button
                onClick={handleRetryAnalysis}
                disabled={isRetrying}
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-50"
                title={showAnalyzingBanner ? "Retry Analysis" : "Refresh Score"}
              >
                <RefreshCw className={`w-5 h-5 text-primary ${isRetrying ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Ingredient Alerts */}
        {!showAnalyzingBanner && ingredients.length > 0 && (
          <div className="mt-5">
            <IngredientAlert ingredients={ingredients} />
          </div>
        )}

        {/* Better Alternative */}
        {!showAnalyzingBanner && (
          <div className="mt-5">
            <BetterAlternative product={mockAlternative} />
          </div>
        )}

        {/* Nutritional Overview */}
        {!showAnalyzingBanner && (
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
        )}

        {/* Analyzing State Content */}
        {showAnalyzingBanner && (
          <div className="mt-5 bg-card rounded-2xl p-6 border border-border/50 shadow-soft text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Analyzing Ingredients</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our AI is reading the ingredients label and calculating the health score. This usually takes a few minutes.
            </p>
            <button
              onClick={handleRetryAnalysis}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? "Retrying..." : "Retry Analysis"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
