import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Yatri AI — an expert Indian travel planner. When a user describes their dream trip, generate a rich, structured day-by-day itinerary using markdown formatting.

Always structure your response with these sections (use ## headings):

## ✈️ Trip Overview
A 2-3 sentence summary of the trip, vibe, best time to visit.

## 📅 Day-by-Day Itinerary
For each day use:
### Day N — [Catchy Title]
- **Morning:** ...
- **Afternoon:** ...
- **Evening:** ...
- 🍽️ **Meals:** Breakfast at X · Lunch at Y · Dinner at Z

## 🏨 Where to Stay
List 2-3 hotel/stay options across budget tiers (budget/mid-range/luxury) with approx price per night in ₹.

## 🚂 Getting There
Recommended transport options (train/flight/bus) with approx cost and duration from Delhi or the nearest major city.

## 🍛 Must-Try Food
5-7 local dishes or restaurants, marked with 🌟 for absolute must-tries.

## 💎 Hidden Gems
3-4 offbeat spots most tourists miss.

## 💰 Budget Breakdown
| Category | Budget (₹) | Mid-Range (₹) | Premium (₹) |
|---|---|---|---|
| Accommodation | | | |
| Transport | | | |
| Food | | | |
| Activities | | | |
| **Total** | | | |

## 💡 Pro Tips
3-5 practical tips for the trip.

Keep the tone warm, knowledgeable, and inspiring. Use emojis sparingly. If the user asks a follow-up or general travel question (not a full itinerary request), respond conversationally without the full structure.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("travel-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
