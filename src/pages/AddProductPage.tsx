import { useState } from "react";
import { ArrowLeft, Camera, Upload, Loader2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [ingredients, setIngredients] = useState("");
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

      // Calculate a basic health score (placeholder - can be enhanced with AI later)
      const healthScore = Math.floor(Math.random() * 40) + 30; // Random 30-70 for now

      const { error } = await supabase.from("products").insert({
        barcode,
        name: name.trim(),
        brand: brand.trim() || null,
        ingredients_text: ingredients.trim() || null,
        health_score: healthScore,
        front_image_url: frontImageUrl,
        back_image_url: backImageUrl,
      });

      if (error) throw error;

      toast({
        title: "Product Added!",
        description: "Thank you for contributing to our database.",
      });

      navigate(`/product/${barcode}`);
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
        {/* Product Images */}
        <div className="space-y-3">
          <Label className="text-foreground">Product Photos</Label>
          <div className="grid grid-cols-2 gap-4">
            {/* Front Image */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Front</p>
              <label className="block aspect-[3/4] rounded-xl border-2 border-dashed border-border bg-muted/50 cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                {frontPreview ? (
                  <img
                    src={frontPreview}
                    alt="Front preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Camera className="w-8 h-8" />
                    <span className="text-xs">Add Photo</span>
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

            {/* Back Image */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Ingredients</p>
              <label className="block aspect-[3/4] rounded-xl border-2 border-dashed border-border bg-muted/50 cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                {backPreview ? (
                  <img
                    src={backPreview}
                    alt="Back preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Upload className="w-8 h-8" />
                    <span className="text-xs">Add Photo</span>
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
          </div>
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

        {/* Ingredients */}
        <div className="space-y-2">
          <Label htmlFor="ingredients" className="text-foreground">
            Ingredients List
          </Label>
          <Textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients from the package..."
            className="bg-card border-border min-h-[120px]"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={isSubmitting || !name.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddProductPage;
