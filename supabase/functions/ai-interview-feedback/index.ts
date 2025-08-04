import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { interviewId, response, questionText } = await req.json()

    if (!interviewId || !response || !questionText) {
      throw new Error('Missing required fields: interviewId, response, questionText')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get OpenAI API key from secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Call OpenAI API for feedback
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert interview coach. Analyze the candidate's response and provide constructive feedback. 
            
            Provide your feedback in the following JSON format:
            {
              "score": 85,
              "strengths": ["Clear communication", "Relevant experience"],
              "improvements": ["Add more specific examples", "Structure answer better"],
              "overall_feedback": "Good response with room for improvement...",
              "keyword_analysis": {
                "keywords_used": ["teamwork", "leadership"],
                "keywords_missing": ["collaboration", "project management"]
              }
            }`
          },
          {
            role: 'user',
            content: `Question: ${questionText}\n\nCandidate's Response: ${response}\n\nPlease analyze this response and provide detailed feedback.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    const feedbackText = openaiData.choices[0]?.message?.content

    let feedback
    try {
      feedback = JSON.parse(feedbackText)
    } catch (e) {
      // Fallback if JSON parsing fails
      feedback = {
        score: 70,
        strengths: ["Response provided"],
        improvements: ["Could be more detailed"],
        overall_feedback: feedbackText || "Unable to generate detailed feedback",
        keyword_analysis: {
          keywords_used: [],
          keywords_missing: []
        }
      }
    }

    // Store the feedback in the database
    const { error: updateError } = await supabaseClient
      .from('interviews')
      .update({
        feedback: feedback,
        score: feedback.score,
        updated_at: new Date().toISOString()
      })
      .eq('id', interviewId)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw updateError
    }

    // Also store analytics data
    const { data: interview } = await supabaseClient
      .from('interviews')
      .select('user_id')
      .eq('id', interviewId)
      .single()

    if (interview) {
      await supabaseClient
        .from('user_analytics')
        .insert({
          user_id: interview.user_id,
          metric_type: 'interview_score',
          metric_value: feedback.score,
          metadata: {
            interview_id: interviewId,
            question_text: questionText
          }
        })
    }

    return new Response(
      JSON.stringify({ success: true, feedback }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in ai-interview-feedback function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})