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

    // Get the UNIQUE image URL for analysis (prefer back/ingredients image)
    const ingredientsImageUrl = product.back_image_url || product.front_image_url;
    
    if (!ingredientsImageUrl) {
      console.log(`[analyze-product] No image available for analysis`);
      return new Response(
        JSON.stringify({ error: "No image available for analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // CRITICAL: Log the exact unique URL being analyzed
    console.log(`[analyze-product] *** ANALYZING UNIQUE IMAGE ***`);
    console.log(`[analyze-product] Image URL: ${ingredientsImageUrl}`);
    console.log(`[analyze-product] Product: ${product.name} | Brand: ${product.brand || 'Unknown'} | Barcode: ${barcode}`);

    // Prepare AI prompt with explicit instructions to analyze THIS specific image
    const systemPrompt = `You are a food health analyst. Your task is to analyze the SPECIFIC ingredient label image provided.

CRITICAL INSTRUCTIONS:
- You MUST extract and read the ACTUAL text from THIS specific image using OCR
- DO NOT provide generic or default scores - analyze the REAL ingredients you see
- If you cannot read the image clearly, say so in the summary
- The score MUST reflect the ACTUAL ingredients visible in this image

Analysis Steps:
1. OCR: Extract ALL ingredient text visible in this image
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
  "health_score": <number 0-100 based on ACTUAL ingredients>,
  "analysis_summary": "<summary of THIS product>",
  "positive_points": ["point 1", "point 2"],
  "negative_points": ["concern 1", "concern 2"]
}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI Gateway with vision capabilities
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
Image URL: ${ingredientsImageUrl}

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
