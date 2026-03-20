import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { config, selfieBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { sqft, floors, style, views, hasGarden, gardenStyle } = config;

    const styleDescriptions: Record<string, string> = {
      modern: "modern minimalist architecture with clean lines, flat roof, large glass windows, concrete and steel",
      traditional: "traditional Indian architecture with ornate details, arched doorways, jali patterns, warm tones",
      contemporary: "contemporary architecture with mixed materials, asymmetric design, earth tones",
      villa: "luxury villa with Mediterranean influences, grand entrance, premium finishes, marble and wood",
    };

    const viewDescriptions: Record<string, string> = {
      exterior_front: "front exterior view of the house from street level, showing full facade, driveway, and entrance",
      exterior_aerial: "aerial drone view of the entire property showing the roof, layout, and surrounding landscape",
      living_room: "spacious living room interior with premium furniture, natural light from large windows",
      bedroom: "master bedroom interior with elegant bed, ambient lighting, large windows with curtains",
      kitchen: "modern kitchen interior with island counter, premium appliances, and organized storage",
      bathroom: "luxury bathroom with walk-in shower, freestanding bathtub, marble finishes",
    };

    const gardenDescriptions: Record<string, string> = {
      minimal: "with a minimal manicured lawn and pathway",
      lush: "with a lush tropical garden, palm trees, and flowering plants",
      zen: "with a zen garden featuring pebbles, bamboo, and a small water feature",
      rooftop: "with a rooftop garden featuring potted plants and seating area",
    };

    const baseDesc = `${styleDescriptions[style] || styleDescriptions.modern}, ${sqft} square feet, ${floors}-storey house`;
    const gardenDesc = hasGarden ? gardenDescriptions[gardenStyle] || "" : "";

    const generatedImages: { view: string; imageUrl: string }[] = [];

    for (const view of views) {
      const viewDesc = viewDescriptions[view] || view;
      const prompt = `Professional architectural visualization render: ${viewDesc} of a ${baseDesc}${gardenDesc}. Photorealistic, high quality, 8K, architectural photography style, golden hour lighting. Built with JK Cement premium materials.`;

      console.log(`Generating image for view: ${view}`);

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-image-preview",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "Usage limit reached. Please add credits." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errText = await response.text();
        console.error(`AI gateway error for ${view}:`, response.status, errText);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      // Check if the response contains an image (base64 in content parts)
      if (Array.isArray(content)) {
        for (const part of content) {
          if (part.type === "image_url" && part.image_url?.url) {
            generatedImages.push({ view, imageUrl: part.image_url.url });
            break;
          }
        }
      } else if (typeof content === "string" && content.startsWith("data:image")) {
        generatedImages.push({ view, imageUrl: content });
      } else {
        // Try to extract image from the response structure
        const parts = data.choices?.[0]?.message?.content;
        if (parts) {
          generatedImages.push({ view, imageUrl: "" });
          console.log(`Response for ${view}:`, JSON.stringify(data.choices?.[0]?.message).substring(0, 500));
        }
      }

      // Small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return new Response(
      JSON.stringify({
        success: true,
        images: generatedImages,
        config: { sqft, floors, style, views, hasGarden, gardenStyle },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-dream-home error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
