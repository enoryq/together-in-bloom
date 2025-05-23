
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompt for Bloom, the relationship companion
const RELATIONSHIP_SYSTEM_PROMPT = `You are Bloom, a compassionate and wise AI relationship companion. 
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
    console.log("AI Companion function called");

    // Get the request body
    const requestData = await req.json();
    const { message, history = [] } = requestData;

    console.log("Received request:", { message, historyLength: history.length });

    if (!message) {
      console.error("No message provided in request");
      return new Response(
        JSON.stringify({ error: "No message provided" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    console.log("API key available:", !!openaiApiKey);
    
    if (!openaiApiKey) {
      console.error("Missing OpenAI API Key");
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured. Please add your OpenAI API key in the Supabase dashboard under Edge Functions secrets." }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate API key format (OpenAI keys start with "sk-")
    if (!openaiApiKey.startsWith("sk-")) {
      console.error("Invalid OpenAI API key format");
      return new Response(
        JSON.stringify({ error: "Invalid OpenAI API key format. OpenAI API keys should start with 'sk-'. Please check your API key in the Supabase dashboard." }),
        { 
          status: 401, 
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

    console.log("Calling OpenAI API...");

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

    console.log("OpenAI response status:", openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API Error:", errorData);
      
      if (errorData.error?.code === "invalid_api_key") {
        return new Response(
          JSON.stringify({ error: "Invalid OpenAI API key. Please check your API key in the Supabase dashboard under Edge Functions secrets." }),
          { 
            status: 401, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` }),
        { 
          status: openaiResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";

    console.log("OpenAI response received successfully");

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
      JSON.stringify({ 
        error: `Failed to process your request. Please try again. Error: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
