import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Plus, Play, BarChart3, Clock, Calendar, Mic, Settings, LogOut, TrendingUp, Award, Target, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import InterviewAnalytics from "@/components/advanced/InterviewAnalytics";
import VoiceAgent from "@/components/voice/VoiceAgent";
import { useAuth } from "@/contexts/AuthContext";

// Mock data
const recentInterviews = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Corp",
    date: "2024-01-15",
    score: 85,
    status: "completed"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartUp Inc",
    date: "2024-01-12",
    score: 78,
    status: "completed"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "AI Company",
    date: "2024-01-10",
    score: 92,
    status: "completed"
  }
];

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [userInfo, setUserInfo] = useState<any>({});
  const [showAnalytics, setShowAnalytics] = useState(false);
  const userName = profile?.full_name || user?.email?.split('@')[0] || "User";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-glow/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      {/* Header */}
      <header className="border-b border-border glass-card-elevated relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center glow-effect animate-pulse-glow">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">PrepWise</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {userInfo.name || userName}
                  {userInfo.city && <span className="text-primary"> from {userInfo.city}</span>}
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="hover-lift"
              >
                <BarChart3 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover-lift">
                <Link to="/settings">
                  <Settings className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover-lift">
                <Link to="/" onClick={async () => {
                  const { signOut } = useAuth();
                  await signOut();
                }}>
                  <LogOut className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <InterviewAnalytics />
          </motion.div>
        )}
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={itemVariants}
            >
              <Card className="glass-card-elevated hover:border-primary/50 transition-all duration-300 group cursor-pointer hover-lift interactive-scale">
                <Link to="/interview/new">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:glow-effect transition-all">
                        <Plus className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg gradient-text">Start New Interview</CardTitle>
                        <CardDescription>Begin a new AI mock interview</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
              
              <Card className="glass-card-elevated hover:border-accent/50 transition-all duration-300 group cursor-pointer hover-lift interactive-scale">
                <Link to="/practice">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center group-hover:glow-effect transition-all">
                        <Mic className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg gradient-text">Practice Session</CardTitle>
                        <CardDescription>Quick practice questions</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>

              <Card className="glass-card-elevated hover:border-primary-glow/50 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-glow/20 rounded-lg flex items-center justify-center group-hover:bg-primary-glow/30 transition-colors">
                      <Brain className="w-6 h-6 text-primary-glow" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Voice AI Coach</CardTitle>
                      <CardDescription>Talk with your AI assistant</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Voice Agent Section */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <VoiceAgent onUserInfoCollected={setUserInfo} />
            </motion.div>

            {/* Recent Interviews */}
            <motion.div variants={itemVariants}>
              <Card className="glass-card-elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl gradient-text">Recent Interviews</CardTitle>
                      <CardDescription>Your latest interview sessions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild className="hover-lift">
                      <Link to="/interviews">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInterviews.map((interview, index) => (
                    <motion.div 
                      key={interview.id} 
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 glass-card hover:glass-card-elevated transition-all duration-300 hover-lift interactive-scale cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{interview.title}</h3>
                          <p className="text-sm text-muted-foreground">{interview.company}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{interview.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold gradient-text">{interview.score}</div>
                          <div className="text-sm text-muted-foreground">Score</div>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {interview.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Performance Overview */}
            <Card className="glass-card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary animate-pulse-glow" />
                  <span className="gradient-text">Performance Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Average Score</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Interviews Completed</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Practice Hours</span>
                    <span className="font-semibold">8.5h</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card className="glass-card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent animate-pulse-glow" />
                  <span className="gradient-text">Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center p-3 bg-primary/10 rounded-lg">
                  <Star className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs font-medium">Perfect Score</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-accent/10 rounded-lg">
                  <Target className="w-6 h-6 text-accent mb-1" />
                  <span className="text-xs font-medium">Streak Master</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-primary-glow/10 rounded-lg">
                  <Brain className="w-6 h-6 text-primary-glow mb-1" />
                  <span className="text-xs font-medium">AI Whisperer</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-destructive/10 rounded-lg">
                  <Clock className="w-6 h-6 text-destructive mb-1" />
                  <span className="text-xs font-medium">Speed Demon</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent animate-pulse-glow" />
                  <span className="gradient-text">Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-semibold">3 interviews</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best Score</span>
                  <span className="font-semibold text-primary">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Streak</span>
                  <span className="font-semibold text-accent">7 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Card */}
            <Card className="glass-card-elevated border-primary/20 bg-gradient-primary/10 hover-lift interactive-scale">
              <CardHeader>
                <CardTitle className="text-lg gradient-text">Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock unlimited interviews and advanced analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-primary hover:bg-gradient-accent glow-effect hover-lift transition-all">
                  <Star className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;