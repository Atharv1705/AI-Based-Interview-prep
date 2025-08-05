import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Send, Clock, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateInterviewFeedback, generateInterviewQuestions } from '@/lib/gemini';
import { useInterviewData } from '@/hooks/useInterviewData';
import { useAuth } from '@/contexts/AuthContext';

export const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { updateInterview } = useInterviewData();
  
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Array<{ question: string; category: string; expected_answer: string }>>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<any>(null);
  const [overallScore, setOverallScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      // Generate questions using Gemini AI
      const generatedQuestions = await generateInterviewQuestions(
        'Software Developer',
        'Technology',
        'medium',
        5
      );
      setQuestions(generatedQuestions);
      setCurrentQuestion(generatedQuestions[0]?.question || 'Tell me about yourself.');
      toast({
        title: "Interview Started",
        description: "Your AI-powered interview session has begun. Good luck!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize interview session.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Please provide an answer",
        description: "You need to answer the current question before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get AI feedback for the current answer
      const aiResponse = await generateInterviewFeedback(
        currentQuestion,
        currentAnswer
      );
      
      const newAnswers = [...answers, currentAnswer];
      setAnswers(newAnswers);
      
      // Update feedback
      setFeedback(prev => ({
        ...prev,
        [questionIndex]: aiResponse
      }));

      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
        setCurrentQuestion(questions[questionIndex + 1].question);
        setCurrentAnswer('');
      } else {
        // Interview completed
        await completeInterview(newAnswers, aiResponse.score);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completeInterview = async (allAnswers: string[], finalScore: number) => {
    const duration = Math.round((Date.now() - sessionStartTime) / 1000 / 60); // in minutes
    const feedbackValues = Object.values(feedback || {}) as Array<{score: number}>;
    const totalScore = feedbackValues.reduce((acc: number, f: any) => acc + (f?.score || 0), finalScore);
    const avgScore = totalScore / (feedbackValues.length + 1);
    
    setOverallScore(avgScore);
    
    try {
      if (id && user) {
        await updateInterview(id, {
          score: avgScore,
          feedback: feedback,
          transcript: allAnswers.join('\n\n'),
          status: 'completed',
          duration
        });
      }
      
      toast({
        title: "Interview Completed!",
        description: `Your overall score: ${avgScore.toFixed(1)}/10`,
      });
      
      // Navigate to results page after a short delay
      setTimeout(() => {
        navigate(`/interview/${id}/results`);
      }, 2000);
    } catch (error) {
      console.error('Error updating interview:', error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would integrate with speech recognition
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Voice recording has been stopped." : "Voice recording is now active.",
    });
  };

  const progress = questions.length > 0 ? ((questionIndex + 1) / questions.length) * 100 : 0;

  if (isLoading && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Preparing your interview session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">AI Interview Session</h1>
            <Badge variant="outline" className="text-sm">
              <Clock className="w-4 h-4 mr-1" />
              Question {questionIndex + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Interview Question
              {questions[questionIndex] && (
                <Badge variant="secondary">{questions[questionIndex].category}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{currentQuestion}</p>
          </CardContent>
        </Card>

        {/* Answer Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here or use voice recording..."
              className="min-h-[120px]"
              disabled={isLoading}
            />
            <div className="flex gap-3">
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim() || isLoading}
                className="ml-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                {questionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Feedback */}
        {feedback && feedback[questionIndex - 1] && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                AI Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Score:</span>
                  <Badge variant={feedback[questionIndex - 1].score >= 7 ? "default" : "secondary"}>
                    {feedback[questionIndex - 1].score}/10
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feedback[questionIndex - 1].feedback}
                </p>
                {feedback[questionIndex - 1].suggestions && (
                  <div>
                    <p className="font-semibold text-sm mb-2">Suggestions:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {feedback[questionIndex - 1].suggestions.map((suggestion: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};