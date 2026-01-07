import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Share2,
  Loader2,
  Sparkles,
  Clock,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  Skull,
  Leaf,
  Edit3,
} from "lucide-react";
import { TikTokHeader } from "@/components/product/TikTokHeader";
import { VillainsSection } from "@/components/product/VillainsSection";
import { HeroSwapCard } from "@/components/product/HeroSwapCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import { products, getHeroSwap, Product } from "@/data/GlobalStore";
import { getAffiliateLink, AMAZON_DISCLAIMER } from "@/lib/linkUtils";
import { useAdmin } from "@/contexts/AdminContext";
import { usePosts } from "@/contexts/PostContext";
import { cn } from "@/lib/utils";

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

const getRandomVideo = (videos: string[]) => {
  return videos[Math.floor(Math.random() * videos.length)];
};

const getMemeForScore = (score: number | null) => {
  if (score === null || score === 0) return null;
  if (score < 40) return getRandomVideo(guiltyMemes);
  if (score < 70) return getRandomVideo(confusedMemes);
  return getRandomVideo(victoryMemes);
};

// Theme configuration based on score
const getTheme = (score: number | null) => {
  if (score === null) return "neutral";
  return score < 50 ? "villain" : "hero";
};

const ProductPage = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const [searchParams] = useSearchParams();
  const isAnalyzing = searchParams.get("analyzing") === "true";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getLinkOverride } = useAdmin();
  const { posts } = usePosts();
  
  const [showSpinner, setShowSpinner] = useState(true);
  const [revealedScore, setRevealedScore] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [analysisFailed, setAnalysisFailed] = useState(false);
  const [isCalculatingDetails, setIsCalculatingDetails] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { data: product, isLoading, refetch } = useQuery({
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

  const memeVideo = useMemo(() => {
    return getMemeForScore(revealedScore);
  }, [revealedScore]);

  const theme = getTheme(revealedScore);
  const isVillain = theme === "villain";
  const isHero = theme === "hero";

  // Get sample community discussions related to this product
  const relatedDiscussions = useMemo(() => {
    if (!product?.name) return [];
    const productWords = product.name.toLowerCase().split(" ");
    return posts
      .filter(post => 
        productWords.some(word => 
          post.title.toLowerCase().includes(word) || 
          post.caption.toLowerCase().includes(word)
        )
      )
      .slice(0, 3);
  }, [posts, product?.name]);

  useEffect(() => {
    if (product) {
      if (product.health_score !== null && product.health_score !== undefined) {
        setRevealedScore(product.health_score);
        setShowSpinner(false);
        
        if (product.health_score === 0 && product.analysis_summary?.includes("Could not analyze")) {
          setAnalysisFailed(true);
        }
        
        if (product.health_score > 0 && !product.ingredients_text && product.back_image_url) {
          setIsCalculatingDetails(true);
          
          supabase.functions.invoke("analyze-product", {
            body: { barcode, fillMissingData: true }
          }).then(({ error }) => {
            if (!error) {
              setTimeout(() => {
                refetch();
                setIsCalculatingDetails(false);
              }, 3000);
            } else {
              setIsCalculatingDetails(false);
            }
          });
        }
        
        return;
      }
      
      if (isAnalyzing) {
        setShowSpinner(true);
        const timer = setTimeout(() => {
          setShowSpinner(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
    
    setShowSpinner(false);
  }, [product, isAnalyzing, barcode, refetch]);

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
        queryClient.invalidateQueries({ queryKey: ["product", barcode] });
        
        if (data.health_score === 0 && data.analysis_summary?.includes("Could not analyze")) {
          setAnalysisFailed(true);
          toast({ 
            title: "Analysis Failed", 
            description: "Could not find data. Try rescanning.",
            variant: "destructive"
          });
        } else {
          toast({ title: "Score Ready!", description: `Health Score: ${data.health_score}` });
        }
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

  const shareTextFallback = async () => {
    const shareText = `Check out this product I scanned on FlippFoodie! Score: ${revealedScore ?? "Pending"}`;
    const shareUrl = window.location.href;
    
    try {
      const nav = navigator as any;
      if (nav.share) {
        await nav.share({
          title: product?.name || "FlippFoodie Scan",
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({ title: "Copied!", description: "Link copied to clipboard." });
      }
    } catch {
      try {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        toast({ title: "Copied!", description: "Link copied to clipboard." });
      } catch {
        toast({ title: "Share failed", description: "Could not share.", variant: "destructive" });
      }
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    toast({ title: "Cooking your meme... 🍳", description: "Generating image..." });

    const backBtn = document.getElementById("back-button");
    const shareBtn = document.getElementById("share-button");

    try {
      if (backBtn) backBtn.style.opacity = "0";
      if (shareBtn) shareBtn.style.opacity = "0";

      if (!cardRef.current) {
        await shareTextFallback();
        return;
      }

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
      });

      const blob: Blob | null = await new Promise((resolve) => 
        canvas.toBlob((b) => resolve(b), "image/png")
      );

      if (!blob) {
        await shareTextFallback();
        return;
      }

      const file = new File([blob], "flippfoodie-scan.png", { type: "image/png" });
      
      if ((navigator as any).canShare?.({ files: [file] })) {
        await (navigator as any).share({ files: [file], title: "FlippFoodie Scan" });
      } else {
        await shareTextFallback();
      }
    } catch {
      await shareTextFallback();
    } finally {
      if (backBtn) backBtn.style.opacity = "1";
      if (shareBtn) shareBtn.style.opacity = "1";
      setIsSharing(false);
    }
  };

  const showRevealButton = !showSpinner && revealedScore === null && barcode;
  const hasScore = revealedScore !== null && revealedScore > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (barcode && !product && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 bg-background">
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

  // Theme-based styles
  const bgClass = isVillain 
    ? "bg-[#0a0a0a]" 
    : isHero 
    ? "bg-gradient-to-b from-emerald-50 via-white to-mint-50" 
    : "bg-background";
  
  const cardClass = isVillain
    ? "bg-[#151515] border-red-500/20"
    : isHero
    ? "bg-white/80 backdrop-blur-sm border-emerald-200"
    : "bg-card border-border/50";

  const textClass = isVillain
    ? "text-white"
    : isHero
    ? "text-gray-900"
    : "text-foreground";

  const mutedTextClass = isVillain
    ? "text-zinc-400"
    : isHero
    ? "text-gray-600"
    : "text-muted-foreground";

  // Screen glow effect based on score
  const glowClass = isVillain 
    ? "shadow-[0_0_100px_-20px_rgba(239,68,68,0.4)]" 
    : isHero 
    ? "shadow-[0_0_100px_-20px_rgba(16,185,129,0.4)]" 
    : "";

  return (
    <div className={cn("min-h-screen pb-8 transition-colors duration-500", bgClass, glowClass)}>
      {showSpinner && (
        <div className={cn(
          "fixed top-0 left-0 right-0 z-50 py-3 px-4",
          isVillain ? "bg-red-600 text-white" : "bg-primary text-primary-foreground"
        )}>
          <div className="flex items-center justify-center gap-2 animate-pulse">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">AI is Analyzing Label...</span>
          </div>
        </div>
      )}

      <div ref={cardRef} className={`relative ${showSpinner ? "mt-12" : ""}`}>
        <TikTokHeader
          score={revealedScore}
          videoUrl={memeVideo}
          productImageUrl={imageUrl}
          productName={productName}
          isRevealed={hasScore}
          isCalculating={isCalculatingDetails}
        />
        
        <div id="back-button" className="absolute top-0 left-0 p-4 pt-12 z-20 transition-opacity">
          <Link
            to="/"
            className={cn(
              "p-2.5 rounded-full backdrop-blur-sm border shadow-soft hover:opacity-80 transition-all",
              isVillain 
                ? "bg-black/50 border-red-500/30" 
                : isHero 
                ? "bg-white/80 border-emerald-200" 
                : "bg-card/90 border-border/50"
            )}
          >
            <ArrowLeft className={cn("w-5 h-5", isVillain ? "text-white" : isHero ? "text-gray-900" : "text-foreground")} />
          </Link>
        </div>
        
        <div id="share-button" className="absolute bottom-20 right-4 z-40 transition-opacity">
          <button 
            onClick={handleShare}
            disabled={isSharing}
            className={cn(
              "p-2.5 rounded-full backdrop-blur-sm border shadow-soft hover:opacity-80 transition-all disabled:opacity-50",
              isVillain 
                ? "bg-black/50 border-red-500/30" 
                : isHero 
                ? "bg-white/80 border-emerald-200" 
                : "bg-card/90 border-border/50"
            )}
          >
            {isSharing ? (
              <Loader2 className={cn("w-5 h-5 animate-spin", textClass)} />
            ) : (
              <Share2 className={cn("w-5 h-5", textClass)} />
            )}
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 relative z-10">
        {/* Product Info Card */}
        <div className={cn(
          "rounded-2xl p-5 shadow-card border animate-fade-up text-center",
          cardClass
        )}>
          <p className={cn("text-sm", mutedTextClass)}>{productBrand}</p>
          <h1 className={cn("text-xl font-bold mt-1", textClass)}>{productName}</h1>
          
          {product?.last_analyzed_at && hasScore && (
            <div className={cn("flex items-center justify-center gap-1 text-xs mt-2", mutedTextClass)}>
              <Clock className="w-3 h-3" />
              <span>Updated: {format(new Date(product.last_analyzed_at), "h:mm a")}</span>
            </div>
          )}
        </div>

        {/* Hero vs Villain Story Card */}
        {hasScore && (
          <div className={cn(
            "mt-5 rounded-2xl p-5 border backdrop-blur-sm animate-fade-up",
            isVillain 
              ? "bg-gradient-to-br from-red-950/50 to-black border-red-500/30" 
              : "bg-gradient-to-br from-emerald-50 to-white border-emerald-200"
          )}>
            <div className="flex items-center gap-2 mb-3">
              {isVillain ? (
                <Skull className="w-5 h-5 text-red-400" />
              ) : (
                <Leaf className="w-5 h-5 text-emerald-600" />
              )}
              <h3 className={cn("font-bold", isVillain ? "text-red-400" : "text-emerald-700")}>
                {isVillain ? "Villain Detected 👿" : "Hero Product 🌿"}
              </h3>
            </div>
            <p className={cn("text-sm leading-relaxed", isVillain ? "text-zinc-300" : "text-gray-700")}>
              {isVillain 
                ? `This product scored ${revealedScore}/100. It may contain ingredients that aren't great for your health. Consider checking the alternatives below for a healthier swap!`
                : `Great choice! This product scored ${revealedScore}/100. It's made with cleaner ingredients and is a better option for your health.`
              }
            </p>
          </div>
        )}

        {analysisFailed && (
          <div className="mt-5 bg-destructive/10 rounded-2xl p-6 border border-destructive/30 shadow-soft text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-destructive" />
            </div>
            <h3 className={cn("font-semibold mb-2", textClass)}>Could Not Find Data</h3>
            <p className={cn("text-sm mb-4", mutedTextClass)}>
              🔄 Flip the pack and rescan the Nutrition Table for better results.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-5 h-5" />
              Rescan Product
            </Link>
          </div>
        )}

        {showRevealButton && !analysisFailed && (
          <div className={cn(
            "mt-5 rounded-2xl p-6 border shadow-soft text-center animate-fade-up",
            cardClass
          )}>
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-success" />
            </div>
            <h3 className={cn("font-semibold mb-2", textClass)}>Analysis Complete!</h3>
            <p className={cn("text-sm mb-4", mutedTextClass)}>
              Tap the button below to see your result.
            </p>
            <button
              onClick={handleRevealResult}
              disabled={isFetching}
              className="w-full py-4 bg-success text-success-foreground font-bold text-lg rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>✨ Tap to View Result</>
              )}
            </button>
          </div>
        )}

        {isCalculatingDetails && hasScore && (
          <div className="mt-5 bg-primary/10 rounded-2xl p-4 border border-primary/30 shadow-soft animate-fade-up">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <div>
                <p className={cn("text-sm font-medium", textClass)}>Calculating details...</p>
                <p className={cn("text-xs", mutedTextClass)}>Finding ingredients & nutrition info</p>
              </div>
            </div>
          </div>
        )}

        {hasScore && (
          <div className="mt-5">
            <VillainsSection 
              ingredientsText={product?.ingredients_text || null}
              isLoading={isCalculatingDetails}
            />
          </div>
        )}

        {/* Hero Swap Card for Villains (Score < 50) */}
        {hasScore && revealedScore !== null && revealedScore < 50 && (() => {
          const matchedVillain = products.find(
            (p) => p.isVillain && product?.name?.toLowerCase().includes(p.name.split(' ')[0].toLowerCase())
          );
          const heroSwap = matchedVillain ? getHeroSwap(matchedVillain.id) : undefined;
          
          if (heroSwap) {
            return (
              <div className="mt-5">
                <HeroSwapCard hero={heroSwap} villainName={matchedVillain?.name} />
              </div>
            );
          }
          return null;
        })()}

        {/* Tribe Discussions Section */}
        {hasScore && (
          <div className={cn(
            "mt-5 rounded-2xl p-5 border animate-fade-up",
            cardClass
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className={cn("w-5 h-5", isVillain ? "text-red-400" : isHero ? "text-emerald-600" : "text-primary")} />
                <h3 className={cn("font-bold", textClass)}>Tribe Discussions</h3>
              </div>
              <span className={cn("text-xs", mutedTextClass)}>
                {relatedDiscussions.length} threads
              </span>
            </div>
            
            {relatedDiscussions.length > 0 ? (
              <div className="space-y-3">
                {relatedDiscussions.map((discussion) => (
                  <button
                    key={discussion.id}
                    onClick={() => navigate("/community")}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all hover:scale-[1.02]",
                      isVillain 
                        ? "bg-black/30 border-white/10 hover:border-red-500/30" 
                        : isHero 
                        ? "bg-emerald-50/50 border-emerald-100 hover:border-emerald-300" 
                        : "bg-muted/30 border-border/30 hover:border-primary/30"
                    )}
                  >
                    <p className={cn("text-sm font-medium line-clamp-1", textClass)}>
                      {discussion.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("text-xs", mutedTextClass)}>
                        t/{discussion.community.replace("r/", "")}
                      </span>
                      <span className={mutedTextClass}>•</span>
                      <span className={cn("text-xs", mutedTextClass)}>
                        {discussion.comments.length} replies
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className={cn("text-sm text-center py-4", mutedTextClass)}>
                No discussions yet. Be the first to share your thoughts!
              </p>
            )}
            
            {/* Write Review FAB */}
            <button
              onClick={() => navigate("/community")}
              className={cn(
                "w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                isVillain 
                  ? "bg-red-600 text-white hover:bg-red-500" 
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              )}
            >
              <Edit3 className="w-4 h-4" />
              Write a Review
            </button>
          </div>
        )}

        {hasScore && product?.analysis_summary && (
          <div className={cn(
            "mt-5 rounded-2xl p-4 border shadow-soft animate-fade-up animation-delay-200",
            cardClass
          )}>
            <h3 className={cn("font-semibold mb-2", textClass)}>Summary</h3>
            <p className={cn("text-sm", mutedTextClass)}>{product.analysis_summary}</p>
          </div>
        )}

        {/* Dynamic CTA Button based on theme */}
        {hasScore && product && (
          <div className="mt-5 space-y-3 animate-fade-up animation-delay-300">
            <button
              onClick={() => {
                const matchedProduct = products.find(
                  (p) => product.name?.toLowerCase().includes(p.name.split(' ')[0].toLowerCase())
                );
                const adminOverride = getLinkOverride(product.name);
                const manualUrl = matchedProduct?.affiliateUrl;
                const affiliateLink = getAffiliateLink(product.name, manualUrl, adminOverride);
                
                toast({
                  title: "Opening Amazon...",
                  description: `Finding ${product.name}`,
                });
                setTimeout(() => window.open(affiliateLink, "_blank"), 1000);
              }}
              className={cn(
                "w-full py-4 font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2",
                isVillain 
                  ? "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/25" 
                  : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/25"
              )}
            >
              {isVillain ? (
                <>😈 Indulge (At Your Own Risk)</>
              ) : (
                <>🌿 Grab the Goodness</>
              )}
              <ExternalLink className="w-5 h-5" />
            </button>
            <p className={cn("text-[10px] text-center opacity-70", mutedTextClass)}>
              {AMAZON_DISCLAIMER}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
