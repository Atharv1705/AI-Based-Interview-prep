import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, ArrowLeft, Mic, MicOff, Square, Play, MessageSquare, Clock, Phone, User, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import VoiceAgent from "@/components/voice/VoiceAgent";

// Mock interview data
const mockInterview = {
  id: 1,
  jobTitle: "Senior Software Engineer",
  company: "Tech Corp",
  duration: 30, // minutes
  questions: [
    "Tell me about yourself and your experience with software engineering.",
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "How do you approach system design for a large-scale application?",
    "What's your experience with agile development methodologies?",
    "How do you handle code reviews and ensure code quality?"
  ]
};

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [useVoiceAgent, setUseVoiceAgent] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (interviewStarted && !interviewEnded) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted, interviewEnded]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartInterview = () => {
    setInterviewStarted(true);
    toast({
      title: "Interview Started!",
      description: useVoiceAgent 
        ? `Good luck${userInfo.name ? `, ${userInfo.name}` : ''}! Your AI voice coach is ready.`
        : "Good luck! The AI interviewer will ask you questions.",
    });
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate adding transcript
      setTimeout(() => {
        setTranscript(prev => [...prev, "This is a simulated response to the current question."]);
      }, 2000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockInterview.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsRecording(false);
    } else {
      handleEndInterview();
    }
  };

  const handleEndInterview = () => {
    setInterviewEnded(true);
    setIsRecording(false);
    toast({
      title: "Interview Completed!",
      description: "Processing your responses and generating feedback...",
    });
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border glass-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold gradient-text">PrepWise</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Start?</CardTitle>
              <CardDescription>
                Your AI mock interview for {mockInterview.jobTitle} at {mockInterview.company}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">Duration</div>
                  <div className="text-muted-foreground">{mockInterview.duration} minutes</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <MessageSquare className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="font-semibold">Questions</div>
                  <div className="text-muted-foreground">{mockInterview.questions.length} questions</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Interview Options:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUseVoiceAgent(false)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      !useVoiceAgent 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-secondary/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">Text Interview</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Traditional text-based interview experience
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUseVoiceAgent(true)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      useVoiceAgent 
                        ? 'border-accent bg-accent/10' 
                        : 'border-border bg-secondary/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      <span className="font-medium">Voice Interview</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI-powered voice coaching experience
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Interview Tips:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Speak clearly and at a moderate pace</li>
                  <li>• Take your time to think before answering</li>
                  <li>• Use the STAR method for behavioral questions</li>
                  <li>• Ask clarifying questions if needed</li>
                  {useVoiceAgent && (
                    <>
                      <li>• The AI will personalize responses based on your information</li>
                      <li>• Say "human agent" if you need to escalate to support</li>
                    </>
                  )}
                </ul>
              </div>

              <Button 
                onClick={handleStartInterview}
                className="w-full bg-gradient-primary text-lg py-6"
              >
                {useVoiceAgent ? (
                  <>
                    <Phone className="w-5 h-5 mr-2" />
                    Start Voice Interview
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Interview
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold gradient-text">PrepWise</span>
              </div>
              <Badge variant="secondary">
                {mockInterview.jobTitle} at {mockInterview.company}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Time</div>
                <div className="font-semibold">{formatTime(timeElapsed)}</div>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleEndInterview}
                className="bg-red-600 hover:bg-red-700"
              >
                <Square className="w-4 h-4 mr-2" />
                End Interview
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Interview Area */}
          <div className="lg:col-span-2">
            {useVoiceAgent ? (
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Voice Interview Session
                    {userInfo.name && (
                      <Badge variant="secondary">
                        Welcome, {userInfo.name}!
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-secondary/20 rounded-lg border border-border/50"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                      <User className="w-5 h-5" />
                      AI Voice Coach:
                    </h3>
                    <p className="text-lg leading-relaxed">
                      I'm your personal AI interview coach. I'll help you practice with natural conversation, 
                      provide real-time feedback, and adapt to your specific needs. Let's start by getting to know each other!
                    </p>
                  </motion.div>

                  <div className="flex items-center justify-center">
                    <VoiceAgent onUserInfoCollected={setUserInfo} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={handleNextQuestion}
                      variant="outline"
                      className="w-full"
                    >
                      {currentQuestion < mockInterview.questions.length - 1 ? "Next Topic" : "Complete Session"}
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Human Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Question {currentQuestion + 1} of {mockInterview.questions.length}</CardTitle>
                    <Progress value={(currentQuestion / mockInterview.questions.length) * 100} className="w-32" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-secondary/20 rounded-lg border border-border/50"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-primary">AI Interviewer:</h3>
                    <p className="text-lg leading-relaxed">
                      {mockInterview.questions[currentQuestion]}
                    </p>
                  </motion.div>

                  <div className="flex items-center justify-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        variant={isRecording ? "destructive" : "default"}
                        onClick={handleToggleRecording}
                        className={`w-20 h-20 rounded-full ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-gradient-primary'}`}
                      >
                        {isRecording ? (
                          <MicOff className="w-8 h-8" />
                        ) : (
                          <Mic className="w-8 h-8" />
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {isRecording ? "Recording your response..." : "Click the microphone to start recording"}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button 
                      onClick={handleNextQuestion}
                      disabled={transcript.length <= currentQuestion}
                      variant="outline"
                    >
                      {currentQuestion < mockInterview.questions.length - 1 ? "Next Question" : "Finish Interview"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Questions</span>
                    <span>{currentQuestion + 1} / {mockInterview.questions.length}</span>
                  </div>
                  <Progress value={(currentQuestion / mockInterview.questions.length) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Time Elapsed</span>
                    <span>{formatTime(timeElapsed)}</span>
                  </div>
                  <Progress value={(timeElapsed / (mockInterview.duration * 60)) * 100} />
                </div>
              </CardContent>
            </Card>

            {/* Live Transcript */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Live Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {transcript.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      Your responses will appear here...
                    </p>
                  ) : (
                    transcript.map((text, index) => (
                      <div key={index} className="text-sm p-2 bg-secondary/20 rounded">
                        <span className="font-semibold text-accent">Q{index + 1}:</span> {text}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;