import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisResult {
  health_score: number;
  ingredients_text?: string;
  analysis_summary: string;
  positive_points: string[];
  negative_points: string[];
  source: "openfoodfacts" | "ai" | "failed";
}

interface OpenFoodFactsProduct {
  product_name?: string;
  brands?: string;
  ingredients_text?: string;
  image_front_url?: string;
  image_url?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    sugars_100g?: number;
    fat_100g?: number;
    "saturated-fat_100g"?: number;
    proteins_100g?: number;
    fiber_100g?: number;
    sodium_100g?: number;
    salt_100g?: number;
  };
  nutriscore_grade?: string;
  nova_group?: number;
}

// Calculate health score from OpenFoodFacts data
const calculateHealthScore = (product: OpenFoodFactsProduct): number => {
  let score = 70; // Start with a moderate score
  
  const nutriments = product.nutriments || {};
  
  // Deduct for high sugar (per 100g)
  const sugar = nutriments.sugars_100g;
  if (sugar !== undefined) {
    if (sugar > 20) score -= 25;
    else if (sugar > 10) score -= 15;
    else if (sugar > 5) score -= 5;
  }
  
  // Deduct for high fat
  const fat = nutriments.fat_100g;
  if (fat !== undefined) {
    if (fat > 20) score -= 15;
    else if (fat > 10) score -= 8;
  }
  
  // Deduct for saturated fat
  const satFat = nutriments["saturated-fat_100g"];
  if (satFat !== undefined) {
    if (satFat > 5) score -= 15;
    else if (satFat > 2) score -= 8;
  }
  
  // Deduct for high sodium/salt
  const sodium = nutriments.sodium_100g || (nutriments.salt_100g ? nutriments.salt_100g / 2.5 : undefined);
  if (sodium !== undefined) {
    if (sodium > 0.6) score -= 15;
    else if (sodium > 0.3) score -= 8;
  }
  
  // Bonus for protein
  const protein = nutriments.proteins_100g;
  if (protein !== undefined && protein > 10) score += 10;
  
  // Bonus for fiber
  const fiber = nutriments.fiber_100g;
  if (fiber !== undefined && fiber > 5) score += 10;
  
  // Use Nutriscore if available for adjustment
  if (product.nutriscore_grade) {
    const nutriscoreBonus: Record<string, number> = {
      'a': 15, 'b': 8, 'c': 0, 'd': -10, 'e': -20
    };
    score += nutriscoreBonus[product.nutriscore_grade.toLowerCase()] || 0;
  }
  
  // Nova group penalty (ultra-processed)
  if (product.nova_group === 4) score -= 15;
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Extended analysis result with product metadata
interface ExtendedAnalysisResult extends AnalysisResult {
  product_name?: string;
  brand?: string;
  front_image_url?: string;
  nutriments?: {
    energy_kcal?: number;
    sugars?: number;
    fat?: number;
    protein?: number;
  };
}

// Generate summary and points from OpenFoodFacts data
const generateAnalysisFromOFF = (product: OpenFoodFactsProduct, healthScore: number): ExtendedAnalysisResult => {
  const positivePoints: string[] = [];
  const negativePoints: string[] = [];
  const nutriments = product.nutriments || {};
  
  // Positive points
  if (nutriments.proteins_100g && nutriments.proteins_100g > 10) {
    positivePoints.push(`Good protein content (${nutriments.proteins_100g.toFixed(1)}g per 100g)`);
  }
  if (nutriments.fiber_100g && nutriments.fiber_100g > 3) {
    positivePoints.push(`Contains dietary fiber (${nutriments.fiber_100g.toFixed(1)}g per 100g)`);
  }
  if (product.nutriscore_grade && ['a', 'b'].includes(product.nutriscore_grade.toLowerCase())) {
    positivePoints.push(`Good Nutri-Score: ${product.nutriscore_grade.toUpperCase()}`);
  }
  if (nutriments.sugars_100g !== undefined && nutriments.sugars_100g < 5) {
    positivePoints.push("Low in sugar");
  }
  
  // Negative points
  if (nutriments.sugars_100g && nutriments.sugars_100g > 15) {
    negativePoints.push(`High sugar content (${nutriments.sugars_100g.toFixed(1)}g per 100g)`);
  }
  if (nutriments["saturated-fat_100g"] && nutriments["saturated-fat_100g"] > 5) {
    negativePoints.push(`High in saturated fat (${nutriments["saturated-fat_100g"].toFixed(1)}g per 100g)`);
  }
  if (product.nova_group === 4) {
    negativePoints.push("Ultra-processed food (NOVA Group 4)");
  }
  const sodium = nutriments.sodium_100g || (nutriments.salt_100g ? nutriments.salt_100g / 2.5 : undefined);
  if (sodium && sodium > 0.6) {
    negativePoints.push("High sodium content");
  }
  
  // Ensure at least one point in each category
  if (positivePoints.length === 0) {
    positivePoints.push("Product data available from global database");
  }
  if (negativePoints.length === 0 && healthScore < 70) {
    negativePoints.push("Limited nutritional information available");
  }
  
  // Generate summary
  const productDisplayName = product.product_name || "This product";
  let summary = "";
  if (healthScore >= 70) {
    summary = `${productDisplayName} is a relatively healthy choice with a score of ${healthScore}/100.`;
  } else if (healthScore >= 40) {
    summary = `${productDisplayName} has some nutritional concerns. Consume in moderation.`;
  } else {
    summary = `${productDisplayName} has significant nutritional concerns. Consider healthier alternatives.`;
  }
  
  return {
    health_score: healthScore,
    ingredients_text: product.ingredients_text || undefined,
    analysis_summary: summary,
    positive_points: positivePoints.slice(0, 4),
    negative_points: negativePoints.slice(0, 4),
    source: "openfoodfacts",
    // Include product metadata from OpenFoodFacts
    product_name: product.product_name,
    brand: product.brands,
    front_image_url: product.image_front_url || product.image_url,
    nutriments: {
      energy_kcal: nutriments["energy-kcal_100g"],
      sugars: nutriments.sugars_100g,
      fat: nutriments.fat_100g,
      protein: nutriments.proteins_100g,
    }
  };
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { barcode } = await req.json();

    if (!barcode) {
      throw new Error("Barcode is required");
    }

    console.log(`[analyze-product] Starting hybrid analysis for barcode: ${barcode}`);

    // Initialize Supabase client with service role for updates
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch product data from our DB
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("barcode", barcode)
      .single();

    if (fetchError || !product) {
      console.error(`[analyze-product] Product not found: ${fetchError?.message}`);
      throw new Error(`Product not found: ${barcode}`);
    }

    console.log(`[analyze-product] Found product: ${product.name}`);

    // PRIORITY 1: Try OpenFoodFacts API first (instant data)
    console.log(`[analyze-product] Trying OpenFoodFacts API...`);
    let analysis: ExtendedAnalysisResult | null = null;
    
    try {
      const offResponse = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
        { headers: { "User-Agent": "FlipApp/1.0" } }
      );
      
      if (offResponse.ok) {
        const offData = await offResponse.json();
        
        // CRITICAL DEBUG: Log the full API response structure
        console.log(`[analyze-product] OpenFoodFacts API Response:`, JSON.stringify({
          status: offData.status,
          product_name: offData.product?.product_name,
          brands: offData.product?.brands,
          image_front_url: offData.product?.image_front_url,
          image_url: offData.product?.image_url,
          ingredients_text: offData.product?.ingredients_text?.substring(0, 100),
          nutriments: offData.product?.nutriments ? {
            "energy-kcal_100g": offData.product.nutriments["energy-kcal_100g"],
            sugars_100g: offData.product.nutriments.sugars_100g,
            fat_100g: offData.product.nutriments.fat_100g,
            proteins_100g: offData.product.nutriments.proteins_100g,
          } : null
        }));
        
        if (offData.status === 1 && offData.product) {
          console.log(`[analyze-product] ✅ OpenFoodFacts HIT! Product: ${offData.product.product_name}`);
          
          const offProduct: OpenFoodFactsProduct = offData.product;
          const healthScore = calculateHealthScore(offProduct);
          
          analysis = generateAnalysisFromOFF(offProduct, healthScore);
          
          console.log(`[analyze-product] Extracted data - Name: ${analysis.product_name}, Brand: ${analysis.brand}, Image: ${analysis.front_image_url}`);
          console.log(`[analyze-product] Nutriments: calories=${analysis.nutriments?.energy_kcal}, sugar=${analysis.nutriments?.sugars}, fat=${analysis.nutriments?.fat}, protein=${analysis.nutriments?.protein}`);
          console.log(`[analyze-product] OpenFoodFacts score: ${healthScore}, source: openfoodfacts`);
        } else {
          console.log(`[analyze-product] OpenFoodFacts: Product not found (status: ${offData.status})`);
        }
      }
    } catch (offError) {
      console.error(`[analyze-product] OpenFoodFacts API error:`, offError);
    }

    // PRIORITY 2: Fallback to AI Vision if OpenFoodFacts failed
    if (!analysis) {
      console.log(`[analyze-product] Falling back to AI Vision analysis...`);
      
      const ingredientsImageUrl = product.back_image_url || product.front_image_url;
      
      if (!ingredientsImageUrl) {
        console.log(`[analyze-product] No image available for AI analysis`);
        // Return failed state - no data available
        analysis = {
          health_score: 0,
          analysis_summary: "Could not analyze product. Please flip the pack and rescan the nutrition label.",
          positive_points: [],
          negative_points: ["No data available from database or image"],
          source: "failed"
        };
      } else {
        // AI Vision analysis
        console.log(`[analyze-product] Analyzing image with AI: ${ingredientsImageUrl}`);
        
        const systemPrompt = `You are a food health analyst. Your task is to analyze the SPECIFIC ingredient label image provided.

CRITICAL INSTRUCTIONS:
- You MUST extract and read the ACTUAL text from THIS specific image using OCR
- DO NOT provide generic or default scores - analyze the REAL ingredients you see
- If you cannot read the image clearly, return health_score: 0 and say "Image unreadable" in summary

NUTRITIONAL EXTRACTION PRIORITY:
- Look specifically for keywords: 'Energy', 'Kcal', 'Calories', 'Sugar', 'Carbohydrate', 'Fat', 'Protein', 'Sodium', 'Fiber'
- Extract exact values with units (e.g., "180 kcal", "25g sugar")
- If the nutritional table is blurry, focus on extracting ingredients_text accurately instead

Analysis Steps:
1. OCR: Extract ALL ingredient text visible in this image - this is the PRIORITY
2. Identify: Harmful additives, preservatives, artificial colors, chemicals
3. Check: Sugar content, palm oil, trans fats, processed ingredients
4. Calculate Health Score (0-100):
   - 80-100: Very healthy (whole foods, minimal processing)
   - 60-79: Good (some processing but mostly healthy)
   - 40-59: Moderate (notable concerns but acceptable)
   - 20-39: Poor (significant health concerns)
   - 0-19: Very unhealthy (highly processed, many harmful ingredients)

5. Generate a 1-2 sentence summary of THIS product
6. List 2-4 positive points
7. List 2-4 negative points

RESPOND ONLY with valid JSON:
{
  "health_score": <number 0-100 based on ACTUAL ingredients, or 0 if unreadable>,
  "ingredients_text": "<comma-separated list of ALL ingredients extracted from the image>",
  "analysis_summary": "<summary of THIS product>",
  "positive_points": ["point 1", "point 2"],
  "negative_points": ["concern 1", "concern 2"]
}`;

        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        if (!LOVABLE_API_KEY) {
          throw new Error("LOVABLE_API_KEY is not configured");
        }

        try {
          console.log(`[analyze-product] Sending to Gemini Flash...`);
          const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: systemPrompt },
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: `ANALYZE THIS SPECIFIC IMAGE NOW. Extract the ingredients from the image and calculate a health score.

Product: ${product.name || "Unknown"}
Brand: ${product.brand || "Unknown"}
Barcode: ${barcode}

READ THE ACTUAL TEXT IN THIS IMAGE and provide a score based on what you see.`
                    },
                    {
                      type: "image_url",
                      image_url: { url: ingredientsImageUrl }
                    }
                  ]
                }
              ],
            }),
          });

          console.log(`[analyze-product] Gemini response status: ${aiResponse.status}`);

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const content = aiData.choices?.[0]?.message?.content;

            if (content) {
              console.log(`[analyze-product] AI raw response: ${content}`);

              try {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  const parsed = JSON.parse(jsonMatch[0]);
                  analysis = {
                    health_score: Math.max(0, Math.min(100, Math.round(parsed.health_score || 0))),
                    ingredients_text: parsed.ingredients_text,
                    analysis_summary: parsed.analysis_summary || "AI analysis completed.",
                    positive_points: parsed.positive_points || [],
                    negative_points: parsed.negative_points || [],
                    source: "ai"
                  };
                  console.log(`[analyze-product] AI score: ${analysis.health_score}`);
                }
              } catch (parseError) {
                console.error(`[analyze-product] Failed to parse AI response:`, parseError);
              }
            }
          } else {
            const errorText = await aiResponse.text();
            console.error(`[analyze-product] AI API error: ${aiResponse.status} - ${errorText}`);
          }
        } catch (aiError) {
          console.error(`[analyze-product] AI analysis error:`, aiError);
        }
      }
    }

    // Final fallback if both methods failed
    if (!analysis) {
      analysis = {
        health_score: 0,
        analysis_summary: "Could not analyze product. Please flip the pack and rescan the nutrition label.",
        positive_points: [],
        negative_points: ["Analysis failed - try rescanning with clearer image"],
        source: "failed"
      };
    }

    console.log(`[analyze-product] Final analysis (source: ${analysis.source}):`, analysis);

    // Update product with analysis results
    const updatePayload: Record<string, unknown> = {
      health_score: analysis.health_score,
      analysis_summary: analysis.analysis_summary,
      positive_points: analysis.positive_points,
      negative_points: analysis.negative_points,
      updated_at: new Date().toISOString(),
      last_analyzed_at: new Date().toISOString()
    };

    // Update product metadata from OpenFoodFacts if available
    const extendedAnalysis = analysis as ExtendedAnalysisResult;
    
    // Update name if we got it from API and current name is generic
    if (extendedAnalysis.product_name && (product.name === "Unknown Product" || product.name === barcode)) {
      updatePayload.name = extendedAnalysis.product_name;
      console.log(`[analyze-product] Updating name to: ${extendedAnalysis.product_name}`);
    }
    
    // Update brand if we got it from API and current brand is missing
    if (extendedAnalysis.brand && !product.brand) {
      updatePayload.brand = extendedAnalysis.brand;
      console.log(`[analyze-product] Updating brand to: ${extendedAnalysis.brand}`);
    }
    
    // Update front image if we got it from API and current image is missing
    if (extendedAnalysis.front_image_url && !product.front_image_url) {
      updatePayload.front_image_url = extendedAnalysis.front_image_url;
      console.log(`[analyze-product] Updating front_image_url to: ${extendedAnalysis.front_image_url}`);
    }

    // Update ingredients_text if we got it and product doesn't have it
    if (analysis.ingredients_text && !product.ingredients_text) {
      updatePayload.ingredients_text = analysis.ingredients_text;
      console.log(`[analyze-product] Updating ingredients_text`);
    }
    
    console.log(`[analyze-product] Update payload:`, JSON.stringify(updatePayload));

    const { error: updateError } = await supabase
      .from("products")
      .update(updatePayload)
      .eq("barcode", barcode);

    if (updateError) {
      console.error(`[analyze-product] Update error: ${updateError.message}`);
      throw new Error(`Failed to save analysis: ${updateError.message}`);
    }

    console.log(`[analyze-product] Analysis saved successfully for ${barcode}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        barcode,
        analysis,
        source: analysis.source
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error(`[analyze-product] Error:`, error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
