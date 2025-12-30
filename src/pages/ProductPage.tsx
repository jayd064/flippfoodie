import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Share2, Bookmark, Loader2, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Meme video arrays - 5 videos each
const guiltyMemes = [
  "https://media.giphy.com/media/3o7TKnO6Wve6502iJ2/giphy.mp4",
  "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.mp4",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.mp4",
  "https://media.giphy.com/media/3ohzdYJK1lneMN8Ymc/giphy.mp4",
  "https://media.giphy.com/media/JTzPN5kkobFv7X0zPJ/giphy.mp4",
];

const confusedMemes = [
  "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.mp4",
  "https://media.giphy.com/media/WRQBXSCnEFJIuxktnw/giphy.mp4",
  "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.mp4",
  "https://media.giphy.com/media/3o7527pa7qs9kCG78A/giphy.mp4",
  "https://media.giphy.com/media/a5viI92PAF89q/giphy.mp4",
];

const victoryMemes = [
  "https://media.giphy.com/media/l0MYJnJQ4EiYLxvQ4/giphy.mp4",
  "https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.mp4",
  "https://media.giphy.com/media/3oz8xRF0v9WMAUVLNK/giphy.mp4",
  "https://media.giphy.com/media/xUPGGDNsLvqsBOhuU0/giphy.mp4",
  "https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.mp4",
];

// Ingredient roasts
const ingredientRoasts: Record<string, string> = {
  "palm oil": "⚠️ The guest nobody invited.",
  "sugar": "⚠️ Sweet but toxic.",
  "maida": "⚠️ Glue for your gut.",
};

// Get random video from array
const getRandomVideo = (videos: string[]) => {
  return videos[Math.floor(Math.random() * videos.length)];
};

// Get meme based on score
const getMemeForScore = (score: number | null) => {
  if (score === null) return null;
  if (score < 40) return getRandomVideo(guiltyMemes);
  if (score < 70) return getRandomVideo(confusedMemes);
  return getRandomVideo(victoryMemes);
};

// Parse ingredients and add roasts
const parseIngredientsWithRoasts = (ingredientsText: string | null) => {
  if (!ingredientsText) return [];
  
  const ingredientsList = ingredientsText.split(',').map(i => i.trim()).filter(Boolean);
  
  return ingredientsList.map(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    let roast = "";
    
    for (const [key, value] of Object.entries(ingredientRoasts)) {
      if (lowerIngredient.includes(key)) {
        roast = value;
        break;
      }
    }
    
    return { name: ingredient, roast };
  });
};

// Get score color based on value
const getScoreBgColor = (score: number) => {
  if (score < 40) return "bg-red-500";
  if (score <= 70) return "bg-yellow-500";
  return "bg-green-500";
};

const ProductPage = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const [searchParams] = useSearchParams();
  const isAnalyzing = searchParams.get("analyzing") === "true";
  const [showSpinner, setShowSpinner] = useState(true);
  const [revealedScore, setRevealedScore] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
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
  });

  // Random meme video - memoized so it stays the same during the session
  const memeVideo = useMemo(() => {
    return getMemeForScore(revealedScore);
  }, [revealedScore]);

  // Simple 3-second timeout to force hide spinner
  useEffect(() => {
    if (isAnalyzing || (product && product.health_score === null)) {
      setShowSpinner(true);
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(false);
    }
  }, [isAnalyzing, product?.health_score]);

  // If product already has a score, use it
  useEffect(() => {
    if (product?.health_score !== null && product?.health_score !== undefined) {
      setRevealedScore(product.health_score);
    }
  }, [product?.health_score]);

  const handleRevealResult = async () => {
    if (!barcode) return;
    
    setIsFetching(true);
    toast({ title: "Fetching...", description: "Getting your results." });

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("barcode", barcode)
        .maybeSingle();

      if (error) throw error;

      if (data?.health_score !== null && data?.health_score !== undefined) {
        setRevealedScore(data.health_score);
        toast({ title: "Score Ready!", description: `Health Score: ${data.health_score}` });
      } else {
        toast({ 
          title: "Still Analyzing...", 
          description: "Analysis in progress. Try again in 5 seconds.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({ title: "Error", description: "Could not fetch results.", variant: "destructive" });
    } finally {
      setIsFetching(false);
    }
  };

  // Parse real ingredients with roasts
  const ingredients = parseIngredientsWithRoasts(product?.ingredients_text || null);
  
  // Show "Tap to Reveal" button when spinner has stopped but no score yet
  const showRevealButton = !showSpinner && revealedScore === null && barcode;
  const hasScore = revealedScore !== null;

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

  const imageUrl = product?.front_image_url || "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop";
  const productName = product?.name || "Unknown Product";
  const productBrand = product?.brand || "Unknown Brand";

  return (
    <div className="min-h-screen pb-8">
      {/* Spinner Banner - Shows for exactly 3 seconds */}
      {showSpinner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-3 px-4">
          <div className="flex items-center justify-center gap-2 animate-pulse">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">AI is Analyzing Label...</span>
          </div>
        </div>
      )}

      {/* Header - Video Player when score revealed, Image otherwise */}
      <div className={`relative h-56 ${showSpinner ? 'mt-12' : ''}`}>
        {hasScore && memeVideo ? (
          <video
            src={memeVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover"
          />
        )}
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
            <div className="flex flex-col items-end gap-1">
              {/* Health Score or Spinner */}
              {showSpinner ? (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                </div>
              ) : hasScore && revealedScore !== null ? (
                <div className={`w-16 h-16 rounded-full ${getScoreBgColor(revealedScore)} flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl font-bold text-white">{revealedScore}</span>
                </div>
              ) : null}
              
              {/* Last analyzed timestamp */}
              {product?.last_analyzed_at && hasScore && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Updated: {format(new Date(product.last_analyzed_at), "h:mm a")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tap to Reveal Button */}
        {showRevealButton && (
          <div className="mt-5 bg-card rounded-2xl p-6 border border-border/50 shadow-soft text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Analysis Complete!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tap the button below to see your result.
            </p>
            <button
              onClick={handleRevealResult}
              disabled={isFetching}
              className="w-full py-4 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  ✨ Tap to View Result
                </>
              )}
            </button>
          </div>
        )}

        {/* Real Ingredients with Roasts - Only show when score is revealed */}
        {hasScore && (
          <div className="mt-5 bg-card rounded-2xl p-4 border border-border/50 shadow-soft animate-fade-up animation-delay-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-full bg-primary/10">
                <AlertTriangle className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Ingredients</h3>
            </div>
            
            {ingredients.length > 0 ? (
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-xl border ${
                      ingredient.roast 
                        ? 'bg-destructive/5 border-destructive/20' 
                        : 'bg-muted/50 border-border/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {ingredient.roast && (
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-destructive flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{ingredient.name}</p>
                        {ingredient.roast && (
                          <p className="text-sm text-destructive mt-0.5">{ingredient.roast}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No ingredients detected.</p>
            )}
          </div>
        )}

        {/* Nutritional Overview - Only show when score is revealed */}
        {hasScore && (
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
      </div>
    </div>
  );
};

export default ProductPage;
