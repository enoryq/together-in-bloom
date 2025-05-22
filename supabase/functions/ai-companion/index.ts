
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// We define a default system prompt for relationship advice
const RELATIONSHIP_SYSTEM_PROMPT = `You are a compassionate and wise relationship companion AI. 
Your purpose is to help users navigate their relationship challenges, foster better communication, 
and build deeper connections with their partners. 

Guidelines:
- Be warm, empathetic, and supportive in your responses
- Provide practical, actionable advice based on healthy relationship principles
- Don't be judgmental, but do encourage healthy behaviors and boundaries
- When appropriate, suggest reflection questions to help users gain insights
- If users are in crisis or need professional help, gently suggest seeking a qualified therapist
- Always maintain a positive and hopeful tone, focusing on growth and healing
- Draw from research-based relationship psychology concepts when relevant
- For very serious issues (abuse, self-harm, etc.), emphasize the importance of professional help

The user is using "Together in Bloom" - a relationship growth app. You can reference features 
from the app like love languages, journal entries, relationship milestones, etc.`;

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the request body
    const requestData = await req.json();
    const { message, history = [] } = requestData;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "No message provided" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Prepare the messages for OpenAI
    const messages = [
      { role: "system", content: RELATIONSHIP_SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message }
    ];

    // Get OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("Missing OpenAI API Key");
      return new Response(
        JSON.stringify({ error: "Configuration error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || openaiResponse.statusText}`);
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";

    // Return the AI response
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in AI companion function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
