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
    const { industry, difficulty, interviewType, jobDescription } = await req.json()

    if (!industry || !difficulty || !interviewType) {
      throw new Error('Missing required fields: industry, difficulty, interviewType')
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

    // Create prompt based on parameters
    const systemPrompt = `You are an expert interview question generator. Generate 5-8 relevant interview questions based on the provided parameters.

    Provide your response in the following JSON format:
    {
      "questions": [
        {
          "question_text": "Tell me about your experience with...",
          "category": "technical",
          "expected_keywords": ["keyword1", "keyword2"],
          "sample_answer": "A good answer would include..."
        }
      ]
    }`

    const userPrompt = `Generate ${interviewType} interview questions for:
    - Industry: ${industry}
    - Difficulty: ${difficulty}
    ${jobDescription ? `- Job Description: ${jobDescription}` : ''}
    
    Make sure questions are relevant, challenging but fair for the ${difficulty} level.`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    const responseText = openaiData.choices[0]?.message?.content

    let generatedQuestions
    try {
      generatedQuestions = JSON.parse(responseText)
    } catch (e) {
      throw new Error('Failed to parse generated questions')
    }

    // Store questions in database
    const questionsToInsert = generatedQuestions.questions.map((q: any) => ({
      category: q.category || interviewType,
      industry: industry,
      difficulty: difficulty,
      question_text: q.question_text,
      expected_keywords: q.expected_keywords || [],
      sample_answer: q.sample_answer
    }))

    const { data: insertedQuestions, error: insertError } = await supabaseClient
      .from('questions')
      .insert(questionsToInsert)
      .select()

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        questions: insertedQuestions,
        count: insertedQuestions.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in generate-interview-questions function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})