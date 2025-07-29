import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Plus, Play, BarChart3, Clock, Calendar, Mic, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

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
  const [userName] = useState("John Doe");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">PrepWise</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <LogOut className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                <Link to="/interview/new">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Plus className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Start New Interview</CardTitle>
                        <CardDescription>Begin a new AI mock interview</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
              
              <Card className="glass-card hover:border-accent/50 transition-all duration-300 group cursor-pointer">
                <Link to="/practice">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Mic className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Practice Session</CardTitle>
                        <CardDescription>Quick practice questions</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            </div>

            {/* Recent Interviews */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Interviews</CardTitle>
                    <CardDescription>Your latest interview sessions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/interviews">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInterviews.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-primary" />
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
                          <div className="text-2xl font-bold text-primary">{interview.score}</div>
                          <div className="text-sm text-muted-foreground">Score</div>
                        </div>
                        <Badge variant="secondary">{interview.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance Overview
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

            {/* Quick Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Quick Stats
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
            <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock unlimited interviews and advanced analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-primary">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;