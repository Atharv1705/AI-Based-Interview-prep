import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { jobRole, industry, difficulty, count = 5 } = await req.json();

    if (!jobRole || !industry || !difficulty) {
      throw new Error('Job role, industry, and difficulty are required');
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
            text: `Generate ${count} interview questions for a ${jobRole} position in the ${industry} industry.
            Difficulty level: ${difficulty}
            
            For each question, provide:
            1. The question text
            2. The category (technical, behavioral, situational, etc.)
            3. A sample expected answer or key points to cover
            
            Format as JSON array:
            [
              {
                "question": "question text",
                "category": "category name",
                "expected_answer": "sample answer or key points"
              }
            ]`
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
    
    let questionsText = '';
    if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content) {
      questionsText = geminiData.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response from Gemini API');
    }

    // Parse JSON response from Gemini
    let parsedQuestions;
    try {
      // Remove any markdown formatting
      const cleanText = questionsText.replace(/```json\n?|\n?```/g, '').trim();
      parsedQuestions = JSON.parse(cleanText);
    } catch (parseError) {
      console.log('Failed to parse Gemini response, using fallback');
      // Fallback questions if JSON parsing fails
      parsedQuestions = [
        {
          question: "Tell me about yourself and your experience in this field.",
          category: "general",
          expected_answer: "Provide a brief overview of your background, relevant experience, and what you're looking for in this role."
        },
        {
          question: "What are your greatest strengths and how do they apply to this position?",
          category: "behavioral",
          expected_answer: "Identify 2-3 key strengths with specific examples of how they've helped you succeed."
        },
        {
          question: "Describe a challenging project you worked on and how you overcame obstacles.",
          category: "situational",
          expected_answer: "Use the STAR method (Situation, Task, Action, Result) to structure your response."
        }
      ];
    }

    // Ensure it's an array
    if (!Array.isArray(parsedQuestions)) {
      parsedQuestions = [parsedQuestions];
    }

    // Validate and clean up the questions
    const validQuestions = parsedQuestions.map((q: any) => ({
      question: q.question || "Please describe your experience with this role.",
      category: q.category || "general",
      expected_answer: q.expected_answer || "Provide relevant examples and specifics about your experience."
    }));

    console.log('Generated questions:', validQuestions);

    return new Response(JSON.stringify(validQuestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-interview-questions-gemini function:', error);
    
    // Return fallback questions on error
    const fallbackQuestions = [
      {
        question: "Tell me about yourself and your experience.",
        category: "general",
        expected_answer: "Provide a brief overview of your background, relevant experience, and what you're looking for in this role."
      },
      {
        question: "What interests you about this position?",
        category: "behavioral",
        expected_answer: "Connect your skills and interests to the specific role and company."
      },
      {
        question: "Describe a time when you faced a challenge at work.",
        category: "situational",
        expected_answer: "Use the STAR method to describe the situation, your actions, and the results."
      }
    ];
    
    return new Response(JSON.stringify(fallbackQuestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});