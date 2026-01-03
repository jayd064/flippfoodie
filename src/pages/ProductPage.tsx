import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Share2,
  Loader2,
  Sparkles,
  Clock,
  RotateCcw,
} from "lucide-react";
import { TikTokHeader } from "@/components/product/TikTokHeader";
import { VillainsSection } from "@/components/product/VillainsSection";
import { HeroSwapCard } from "@/components/product/HeroSwapCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import { products, getHeroSwap, Product } from "@/data/GlobalStore";

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

const ProductPage = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const [searchParams] = useSearchParams();
  const isAnalyzing = searchParams.get("analyzing") === "true";
  const queryClient = useQueryClient();
  
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // Hide buttons for clean screenshot
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
      
      // Use any to bypass TypeScript strict checking
      if ((navigator as any).canShare?.({ files: [file] })) {
        await (navigator as any).share({ files: [file], title: "FlippFoodie Scan" });
      } else {
        await shareTextFallback();
      }
    } catch {
      await shareTextFallback();
    } finally {
      // Restore buttons
      if (backBtn) backBtn.style.opacity = "1";
      if (shareBtn) shareBtn.style.opacity = "1";
      setIsSharing(false);
    }
  };

  const showRevealButton = !showSpinner && revealedScore === null && barcode;
  const hasScore = revealedScore !== null && revealedScore > 0;

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
      {showSpinner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-3 px-4">
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
            className="p-2.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-soft hover:bg-card transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
        </div>
        
        <div id="share-button" className="absolute bottom-20 right-4 z-40 transition-opacity">
          <button 
            onClick={handleShare}
            disabled={isSharing}
            className="p-2.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-soft hover:bg-card transition-colors disabled:opacity-50"
          >
            {isSharing ? (
              <Loader2 className="w-5 h-5 text-foreground animate-spin" />
            ) : (
              <Share2 className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 relative z-10">
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 animate-fade-up text-center">
          <p className="text-sm text-muted-foreground">{productBrand}</p>
          <h1 className="text-xl font-bold text-foreground mt-1">{productName}</h1>
          
          {product?.last_analyzed_at && hasScore && (
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
              <Clock className="w-3 h-3" />
              <span>Updated: {format(new Date(product.last_analyzed_at), "h:mm a")}</span>
            </div>
          )}
        </div>

        {analysisFailed && (
          <div className="mt-5 bg-destructive/10 rounded-2xl p-6 border border-destructive/30 shadow-soft text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Could Not Find Data</h3>
            <p className="text-sm text-muted-foreground mb-4">
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
          <div className="mt-5 bg-card rounded-2xl p-6 border border-border/50 shadow-soft text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Analysis Complete!</h3>
            <p className="text-sm text-muted-foreground mb-4">
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
                <p className="text-sm font-medium text-foreground">Calculating details...</p>
                <p className="text-xs text-muted-foreground">Finding ingredients & nutrition info</p>
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

        {/* Hero Swap Card for Villains (Score < 40) */}
        {hasScore && revealedScore !== null && revealedScore < 40 && (() => {
          // Find matching villain from GlobalStore by name
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

        {hasScore && product?.analysis_summary && (
          <div className="mt-5 bg-card rounded-2xl p-4 border border-border/50 shadow-soft animate-fade-up animation-delay-200">
            <h3 className="font-semibold text-foreground mb-2">Summary</h3>
            <p className="text-muted-foreground text-sm">{product.analysis_summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
