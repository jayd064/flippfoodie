import { useState, useEffect } from "react";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OpenFoodFactsProduct {
  product_name?: string;
  brands?: string;
  image_front_url?: string;
  image_ingredients_url?: string;
}

const AddProductPage = () => {
  const [searchParams] = useSearchParams();
  const barcode = searchParams.get("barcode") || "";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [apiFrontImageUrl, setApiFrontImageUrl] = useState<string | null>(null);
  const [apiIngredientsImageUrl, setApiIngredientsImageUrl] = useState<string | null>(null);

  // Auto-fetch from OpenFoodFacts on page load
  useEffect(() => {
    const fetchFromOpenFoodFacts = async () => {
      if (!barcode) return;
      
      setIsFetchingProduct(true);
      try {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const data = await response.json();
        
        if (data.status === 1 && data.product) {
          const product: OpenFoodFactsProduct = data.product;
          
          // Auto-fill name
          if (product.product_name) {
            setName(product.product_name);
          }
          
          // Auto-fill brand
          if (product.brands) {
            setBrand(product.brands);
          }
          
          // Set front image from API
          if (product.image_front_url) {
            setApiFrontImageUrl(product.image_front_url);
            setFrontPreview(product.image_front_url);
          }

          // Set ingredients image from API if available
          if (product.image_ingredients_url) {
            setApiIngredientsImageUrl(product.image_ingredients_url);
            setBackPreview(product.image_ingredients_url);
          }
          
          toast({
            title: "Product Found!",
            description: product.image_ingredients_url 
              ? "Auto-filled with ingredients image from database." 
              : "Auto-filled from OpenFoodFacts database.",
          });
        }
      } catch (error) {
        console.error("OpenFoodFacts fetch error:", error);
        // Silently fail - user can still enter manually
      } finally {
        setIsFetchingProduct(false);
      }
    };

    fetchFromOpenFoodFacts();
  }, [barcode, toast]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (file: File | null) => void,
    setPreview: (url: string | null) => void,
    clearApiImage?: boolean
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      if (clearApiImage) {
        setApiFrontImageUrl(null);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, type: "front" | "back"): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${barcode}_${type}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      throw new Error(`Failed to upload ${type} image: ${error.message}`);
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    // Require ingredients photo (either from API or user capture)
    if (!backImage && !apiIngredientsImageUrl) {
      toast({
        title: "Error",
        description: "Please take a photo of the ingredients label",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let frontImageUrl: string | null = apiFrontImageUrl;
      let backImageUrl: string | null = apiIngredientsImageUrl;

      // Upload front image if user took a new one
      if (frontImage) {
        frontImageUrl = await uploadImage(frontImage, "front");
      }
      
      // Upload back/ingredients image if user took one (overrides API image)
      if (backImage) {
        backImageUrl = await uploadImage(backImage, "back");
      }

      const { error } = await supabase.from("products").insert({
        barcode,
        name: name.trim(),
        brand: brand.trim() || null,
        ingredients_text: null,
        health_score: null,
        front_image_url: frontImageUrl,
        back_image_url: backImageUrl,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Product Added!",
        description: "Starting AI analysis...",
      });

      // Immediately trigger AI analysis (don't wait for it to complete)
      console.log("[AddProductPage] Triggering analyze-product for barcode:", barcode);
      
      supabase.functions.invoke("analyze-product", {
        body: { barcode }
      }).then(({ data, error: analyzeError }) => {
        if (analyzeError) {
          console.error("[AddProductPage] Analysis invoke error:", analyzeError);
        } else {
          console.log("[AddProductPage] Analysis triggered successfully:", data);
        }
      });

      // Navigate immediately - analysis runs in background
      navigate(`/product/${barcode}?analyzing=true`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error adding product:", error);
      alert(`Failed to add product: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if we have both name and ingredients to show one-click submit
  const hasNameAndIngredients = name.trim() && (backImage || apiIngredientsImageUrl);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-4 p-4 pt-12">
          <Link
            to="/"
            className="p-2.5 rounded-full bg-card border border-border/50 shadow-soft hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Add New Product</h1>
            <p className="text-xs text-muted-foreground">Barcode: {barcode}</p>
          </div>
        </div>
      </div>

      {/* Loading indicator for API fetch */}
      {isFetchingProduct && (
        <div className="mx-5 mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm text-primary">Looking up product info...</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-5 py-6 space-y-6">
        {/* Main Action - Take Photo of Ingredients */}
        <div className="space-y-3">
          <Label className="text-foreground text-base font-semibold">
            📸 {apiIngredientsImageUrl && backPreview === apiIngredientsImageUrl ? "Ingredients Photo (Auto-fetched)" : "Take Photo of Ingredients *"}
          </Label>
          <label className="block cursor-pointer">
            {backPreview ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary shadow-lg">
                <img
                  src={backPreview}
                  alt="Ingredients preview"
                  className="w-full aspect-[4/3] object-cover"
                />
                {apiIngredientsImageUrl && backPreview === apiIngredientsImageUrl && (
                  <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
                    From database
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                    Tap to retake
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-primary bg-primary/5 flex flex-col items-center justify-center gap-3 hover:bg-primary/10 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary-foreground" />
                </div>
                <span className="text-primary font-medium">Take Photo of Ingredients</span>
                <span className="text-xs text-muted-foreground">Point camera at the back label</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                handleImageChange(e, setBackImage, setBackPreview);
                setApiIngredientsImageUrl(null); // Clear API image when user takes new one
              }}
            />
          </label>
        </div>

        {/* Optional Front Image */}
        <div className="space-y-3">
          <Label className="text-foreground text-sm">
            Front Photo {apiFrontImageUrl ? "(Auto-fetched)" : "(Optional)"}
          </Label>
          <label className="block cursor-pointer">
            {frontPreview ? (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border">
                <img
                  src={frontPreview}
                  alt="Front preview"
                  className="w-full h-full object-cover"
                />
                {apiFrontImageUrl && frontPreview === apiFrontImageUrl && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-xs py-1 text-center">
                    From database
                  </div>
                )}
              </div>
            ) : (
              <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors">
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add Front</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleImageChange(e, setFrontImage, setFrontPreview, true)}
            />
          </label>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">
            Product Name *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Oat Cookies"
            className="bg-card border-border"
            required
          />
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-foreground">
            Brand
          </Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g., Nature's Best"
            className="bg-card border-border"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-14 text-base font-semibold"
          disabled={isSubmitting || !hasNameAndIngredients}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : hasNameAndIngredients ? (
            "Confirm & Analyze"
          ) : (
            "Submit for AI Analysis"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddProductPage;
