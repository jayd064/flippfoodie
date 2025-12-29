import { useState } from "react";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (file: File | null) => void,
    setPreview: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
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
      return null;
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

    setIsSubmitting(true);

    try {
      let frontImageUrl: string | null = null;
      let backImageUrl: string | null = null;

      if (frontImage) {
        frontImageUrl = await uploadImage(frontImage, "front");
      }
      if (backImage) {
        backImageUrl = await uploadImage(backImage, "back");
      }

      const { error } = await supabase.from("products").insert({
        barcode,
        name: name.trim(),
        brand: brand.trim() || null,
        ingredients_text: null,
        health_score: null, // AI will analyze
        front_image_url: frontImageUrl,
        back_image_url: backImageUrl,
      });

      if (error) throw error;

      toast({
        title: "Product Added!",
        description: "AI is analyzing the ingredients label...",
      });

      navigate(`/product/${barcode}?analyzing=true`);
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-5 py-6 space-y-6">
        {/* Main Action - Take Photo of Ingredients */}
        <div className="space-y-3">
          <Label className="text-foreground text-base font-semibold">
            📸 Take Photo of Ingredients
          </Label>
          <label className="block cursor-pointer">
            {backPreview ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary shadow-lg">
                <img
                  src={backPreview}
                  alt="Ingredients preview"
                  className="w-full aspect-[4/3] object-cover"
                />
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
              onChange={(e) => handleImageChange(e, setBackImage, setBackPreview)}
            />
          </label>
        </div>

        {/* Optional Front Image */}
        <div className="space-y-3">
          <Label className="text-foreground text-sm">Front Photo (Optional)</Label>
          <label className="block cursor-pointer">
            {frontPreview ? (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border">
                <img
                  src={frontPreview}
                  alt="Front preview"
                  className="w-full h-full object-cover"
                />
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
              onChange={(e) => handleImageChange(e, setFrontImage, setFrontPreview)}
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
          disabled={isSubmitting || !name.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            "Submit for AI Analysis"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddProductPage;
