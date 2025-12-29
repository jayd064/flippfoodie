import { useState, useCallback } from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ScanButton = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleScan = useCallback(async (barcode: string) => {
    setIsChecking(true);
    setIsScannerOpen(false);
    
    console.log("Checking barcode:", barcode);
    
    try {
      // Check if product exists in database
      const { data: product, error } = await supabase
        .from("products")
        .select("barcode")
        .eq("barcode", barcode)
        .maybeSingle();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      if (product) {
        // Product exists, navigate to product page
        toast({
          title: "Product Found!",
          description: "Loading product details...",
        });
        navigate(`/product/${barcode}`);
      } else {
        // Product doesn't exist, navigate to add product page
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

  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-full bg-primary/15 animate-pulse-ring animation-delay-300" />
          
          {/* Main button */}
          <button
            onClick={() => setIsScannerOpen(true)}
            disabled={isChecking}
            className="relative flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-glow-primary hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center gap-2 text-primary-foreground">
              <Camera className="w-12 h-12" strokeWidth={1.5} />
              <span className="text-sm font-semibold tracking-wide">
                {isChecking ? "Checking..." : "Scan Food"}
              </span>
            </div>
          </button>
        </div>
        
        <p className="text-muted-foreground text-sm text-center max-w-[200px]">
          Point your camera at any food product to see its health score
        </p>
      </div>

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />
    </>
  );
};
