
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

    // Get Google Gemini API key from environment variables
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    console.log("API key available:", !!geminiApiKey);
    
    if (!geminiApiKey) {
      console.error("Missing Gemini API Key");
      return new Response(
        JSON.stringify({ error: "Gemini API key is not configured. Please add your Gemini API key in the Supabase dashboard under Edge Functions secrets." }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Prepare the conversation for Gemini
    let conversationText = RELATIONSHIP_SYSTEM_PROMPT + "\n\n";
    
    // Add conversation history
    for (const msg of history) {
      if (msg.role === 'user') {
        conversationText += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        conversationText += `Bloom: ${msg.content}\n`;
      }
    }
    
    // Add current message
    conversationText += `User: ${message}\nBloom:`;

    console.log("Calling Gemini API...");

    // Call Google Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: conversationText
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    });

    console.log("Gemini response status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("Gemini API Error:", errorData);
      
      if (geminiResponse.status === 401 || geminiResponse.status === 403) {
        return new Response(
          JSON.stringify({ error: "Invalid Gemini API key. Please check your API key in the Supabase dashboard under Edge Functions secrets." }),
          { 
            status: 401, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${errorData.error?.message || 'Unknown error'}` }),
        { 
          status: geminiResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const data = await geminiResponse.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request.";

    console.log("Gemini response received successfully");

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
