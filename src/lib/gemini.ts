// Client no longer calls Gemini directly. The server handles AI calls securely.

export const generateInterviewFeedback = async (
  question: string, 
  userResponse: string
): Promise<{ feedback: string; score: number; suggestions: string[] }> => {
  try {
    const response = await fetch('/api/ai/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        response: userResponse
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating feedback:', error);
    return {
      feedback: "I couldn't analyze your response at this time. Please try again.",
      score: 5,
      suggestions: ["Try to be more specific in your answer", "Provide concrete examples", "Structure your response clearly"]
    };
  }
};

export const generateInterviewQuestions = async (
  jobRole: string,
  industry: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number = 5
): Promise<Array<{ question: string; category: string; expected_answer: string }>> => {
  try {
    const response = await fetch('/api/ai/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobRole,
        industry,
        difficulty,
        count
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error generating questions:', error);
    return [
      {
        question: "Tell me about yourself and your experience.",
        category: "general",
        expected_answer: "Provide a brief overview of your background, relevant experience, and what you're looking for in this role."
      }
    ];
  }
};