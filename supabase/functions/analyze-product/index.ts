import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisResult {
  health_score: number;
  analysis_summary: string;
  positive_points: string[];
  negative_points: string[];
}

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

    console.log(`[analyze-product] Starting analysis for barcode: ${barcode}`);

    // Initialize Supabase client with service role for updates
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch product data
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

    // Get the image URL for analysis (prefer back/ingredients image)
    const imageUrl = product.back_image_url || product.front_image_url;
    
    if (!imageUrl) {
      console.log(`[analyze-product] No image available for analysis`);
      return new Response(
        JSON.stringify({ error: "No image available for analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[analyze-product] Analyzing image: ${imageUrl}`);

    // Prepare AI prompt for ingredient analysis
    const systemPrompt = `You are a food health analyst. Analyze the ingredients from the provided product image and return a JSON response.

Your task:
1. Extract and read all ingredient text from the image (OCR)
2. Identify harmful additives, preservatives, artificial colors, and chemicals
3. Check for high sugar content, palm oil, trans fats, and processed ingredients
4. Calculate a Health Score from 0-100 where:
   - 80-100: Very healthy (whole foods, minimal processing)
   - 60-79: Good (some processing but mostly healthy)
   - 40-59: Moderate (notable concerns but acceptable)
   - 20-39: Poor (significant health concerns)
   - 0-19: Very unhealthy (highly processed, many harmful ingredients)

5. Generate a brief 1-2 sentence summary
6. List 2-4 positive points about the product
7. List 2-4 negative points or concerns

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "health_score": <number 0-100>,
  "analysis_summary": "<brief summary>",
  "positive_points": ["point 1", "point 2"],
  "negative_points": ["concern 1", "concern 2"]
}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI Gateway with vision capabilities
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
                text: `Analyze the ingredients in this product image and provide a health assessment. Product name: ${product.name || "Unknown"}, Brand: ${product.brand || "Unknown"}`
              },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error(`[analyze-product] AI API error: ${aiResponse.status} - ${errorText}`);
      
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (aiResponse.status === 402) {
        throw new Error("AI credits exhausted. Please add credits to continue.");
      }
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      console.error(`[analyze-product] No content in AI response`);
      throw new Error("AI returned empty response");
    }

    console.log(`[analyze-product] AI raw response: ${content}`);

    // Parse the JSON response from AI
    let analysis: AnalysisResult;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error(`[analyze-product] Failed to parse AI response: ${parseError}`);
      // Fallback to default analysis
      analysis = {
        health_score: 50,
        analysis_summary: "Unable to fully analyze. Manual review recommended.",
        positive_points: ["Product submitted for review"],
        negative_points: ["Analysis incomplete - please verify ingredients manually"]
      };
    }

    // Validate and clamp health score
    analysis.health_score = Math.max(0, Math.min(100, Math.round(analysis.health_score)));

    console.log(`[analyze-product] Final analysis:`, analysis);

    // Update product with analysis results and timestamp
    const { error: updateError } = await supabase
      .from("products")
      .update({
        health_score: analysis.health_score,
        analysis_summary: analysis.analysis_summary,
        positive_points: analysis.positive_points,
        negative_points: analysis.negative_points,
        updated_at: new Date().toISOString(),
        last_analyzed_at: new Date().toISOString()
      })
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
        analysis 
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
