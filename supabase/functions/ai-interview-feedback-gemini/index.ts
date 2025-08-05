import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, response: userResponse } = await req.json();

    if (!question || !userResponse) {
      throw new Error('Question and response are required');
    }

    // Initialize Gemini AI with the provided API key
    const geminiApiKey = 'AIzaSyBMBUXdD-7-V2iH4RC_DMrWok20lBhzerU';
    
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `As an AI interview coach, analyze this interview response:
            
            Question: "${question}"
            Candidate Response: "${userResponse}"
            
            Please provide:
            1. Detailed feedback on the response quality
            2. A score from 1-10 (10 being excellent)
            3. 3-5 specific suggestions for improvement
            
            Format your response as JSON:
            {
              "feedback": "detailed feedback here",
              "score": number,
              "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
            }`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    
    let feedbackText = '';
    if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content) {
      feedbackText = geminiData.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response from Gemini API');
    }

    // Parse JSON response from Gemini
    let parsedFeedback;
    try {
      // Remove any markdown formatting
      const cleanText = feedbackText.replace(/```json\n?|\n?```/g, '').trim();
      parsedFeedback = JSON.parse(cleanText);
    } catch (parseError) {
      console.log('Failed to parse Gemini response, using fallback');
      // Fallback if JSON parsing fails
      parsedFeedback = {
        feedback: feedbackText || "I couldn't analyze your response at this time. Please try again.",
        score: 5,
        suggestions: [
          "Try to be more specific in your answer",
          "Provide concrete examples",
          "Structure your response clearly"
        ]
      };
    }

    // Ensure score is within valid range
    if (typeof parsedFeedback.score !== 'number' || parsedFeedback.score < 1 || parsedFeedback.score > 10) {
      parsedFeedback.score = 5;
    }

    // Ensure suggestions is an array
    if (!Array.isArray(parsedFeedback.suggestions)) {
      parsedFeedback.suggestions = [
        "Try to be more specific in your answer",
        "Provide concrete examples",
        "Structure your response clearly"
      ];
    }

    console.log('Generated feedback:', parsedFeedback);

    return new Response(JSON.stringify(parsedFeedback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-interview-feedback-gemini function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        feedback: "I encountered an error while analyzing your response. Please try again.",
        score: 5,
        suggestions: [
          "Try to be more specific in your answer",
          "Provide concrete examples", 
          "Structure your response clearly"
        ]
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});