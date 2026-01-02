import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { ScanResultOverlay } from "@/components/scanner/ScanResultOverlay";
import { ShareToCommunityDrawer } from "@/components/scanner/ShareToCommunitDrawer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductPreview {
  name: string;
  brand?: string;
  image?: string;
  score: number;
  ingredients?: string;
  negativePoints?: string[];
  positivePoints?: string[];
  barcode: string;
}

const ScannerPage = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [productPreview, setProductPreview] = useState<ProductPreview | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setIsScannerOpen(true);
  }, []);

  const handleScan = useCallback(async (barcode: string) => {
    setIsChecking(true);
    
    try {
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("barcode", barcode)
        .maybeSingle();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      if (product && product.health_score !== null) {
        setProductPreview({
          name: product.name,
          brand: product.brand || undefined,
          image: product.front_image_url || undefined,
          score: product.health_score,
          ingredients: product.ingredients_text || undefined,
          negativePoints: product.negative_points || undefined,
          positivePoints: product.positive_points || undefined,
          barcode: product.barcode,
        });
        setIsScannerOpen(false);
        setShowResultOverlay(true);
      } else if (product) {
        toast({
          title: "Product Found!",
          description: "Loading product details...",
        });
        navigate(`/product/${barcode}`);
      } else {
        toast({
          title: "New Product",
          description: "Help us add this product to our database!",
        });
        navigate(`/add-product?barcode=${barcode}`);
      }
    } catch (error) {
      console.error("Error checking product:", error);
      toast({
        title: "Error",
        description: "Failed to check product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  }, [navigate, toast]);

  const handleResultClose = () => {
    setShowResultOverlay(false);
    if (productPreview) {
      navigate(`/product/${productPreview.barcode}`);
    }
  };

  const handleScannerClose = () => {
    setIsScannerOpen(false);
    navigate("/");
  };

  const handleShareClick = () => {
    setShowShareDrawer(true);
  };

  const handleShareClose = () => {
    setShowShareDrawer(false);
    setShowResultOverlay(false);
  };

  return (
    <>
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={handleScannerClose}
        onScan={handleScan}
      />

      {productPreview && (
        <>
          <ScanResultOverlay
            isOpen={showResultOverlay}
            onClose={handleResultClose}
            onShare={handleShareClick}
            product={productPreview}
          />

          <ShareToCommunityDrawer
            isOpen={showShareDrawer}
            onClose={handleShareClose}
            product={productPreview}
          />
        </>
      )}
    </>
  );
};

export default ScannerPage;
