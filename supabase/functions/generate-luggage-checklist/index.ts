import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, date, travelers, interests, duration } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemInstruction = `You are an expert travel packing advisor specialized in Indian destinations. Your task is to analyze weather and climate conditions based on destination and travel dates, then generate a comprehensive, weather-specific luggage checklist. Always consider:
1. Seasonal weather patterns in India (Monsoon, Winter, Summer, Spring)
2. Regional climate variations (Coastal, Mountain, Desert, Plains)
3. Specific location characteristics
4. Travel duration and trip type

Format your response as a JSON object with this structure:
{
  "weatherSummary": "Brief one-line weather description (e.g., 'Hot & Humid with chances of rain' or 'Very Cold with possible snowfall')",
  "categories": {
    "clothing": ["item1", "item2", ...],
    "essentials": ["item1", "item2", ...],
    "electronics": ["item1", "item2", ...],
    "medical": ["item1", "item2", ...]
  }
}

Be specific and weather-appropriate. Include quantities where relevant (e.g., "2-3 Light cotton t-shirts").`;

    // Calculate duration from date if not provided
    let durationText = duration || "Not specified";
    if (date) {
      const travelDate = new Date(date);
      const month = travelDate.toLocaleString('default', { month: 'long' });
      durationText = `${month} travel`;
    }

    const userPrompt = `Generate a weather-based luggage checklist for this trip:

Destination: ${destination}
Travel Date: ${date}
Duration: ${durationText}
Travelers: ${travelers}
Interests: ${interests ? interests.join(", ") : "General travel"}

IMPORTANT INSTRUCTIONS:
1. Analyze the expected weather and climate for ${destination} during ${date ? new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'the travel dates'}
2. Consider Indian seasonal patterns:
   - Monsoon (June-September): Rain gear, quick-dry clothes, waterproof items
   - Winter (November-February): Warm layers, thermal wear, jackets
   - Summer (March-May): Light cotton, sun protection, breathable fabrics
   - Spring/Fall: Moderate clothing with layers
3. Include location-specific items:
   - Coastal areas: Swimwear, beach essentials, sandals
   - Mountains: Warm clothes, hiking gear, altitude sickness medication
   - Desert: Sun protection, light colors, hydration items
   - Urban: Comfortable walking shoes, city-appropriate clothing
4. Provide a comprehensive list with specific quantities where needed
5. Ensure all items are practical and relevant to the weather conditions

Return ONLY valid JSON, no markdown formatting or additional text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error", details: errorText }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    let luggageData;
    
    try {
      const content = data.choices?.[0]?.message?.content || "{}";
      luggageData = typeof content === "string" ? JSON.parse(content) : content;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Fallback response
      luggageData = {
        weatherSummary: "Moderate weather expected",
        categories: {
          clothing: ["Light cotton t-shirts (2-3)", "Comfortable pants/shorts (2)", "1 Light jacket"],
          essentials: ["ID Proof (Aadhar/Passport)", "Flight/Train Tickets", "Hotel Bookings printout"],
          electronics: ["Mobile Charger", "Power Bank", "Camera (optional)"],
          medical: ["Personal Medications", "First-aid Kit", "Sunscreen"],
        },
      };
    }

    return new Response(
      JSON.stringify({ luggageChecklist: luggageData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

