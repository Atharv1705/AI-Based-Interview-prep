import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Award,
  ArrowLeft,
  Brain,
  Mic,
  MessageSquare,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("overall");

  // Mock data for charts
  const performanceData = [
    { date: "2024-01-01", score: 65, interviews: 2 },
    { date: "2024-01-08", score: 72, interviews: 3 },
    { date: "2024-01-15", score: 78, interviews: 4 },
    { date: "2024-01-22", score: 82, interviews: 3 },
    { date: "2024-01-29", score: 85, interviews: 5 },
  ];

  const skillsRadarData = [
    { skill: "Technical", score: 85, maxScore: 100 },
    { skill: "Communication", score: 90, maxScore: 100 },
    { skill: "Problem Solving", score: 78, maxScore: 100 },
    { skill: "Leadership", score: 72, maxScore: 100 },
    { skill: "Behavioral", score: 88, maxScore: 100 },
    { skill: "Cultural Fit", score: 80, maxScore: 100 },
  ];

  const interviewTypesData = [
    { type: "Technical", count: 12, avgScore: 82 },
    { type: "Behavioral", count: 8, avgScore: 88 },
    { type: "System Design", count: 5, avgScore: 76 },
    { type: "Cultural Fit", count: 6, avgScore: 91 },
  ];

  const weeklyActivityData = [
    { day: "Mon", interviews: 2, practice: 3 },
    { day: "Tue", interviews: 1, practice: 2 },
    { day: "Wed", interviews: 3, practice: 4 },
    { day: "Thu", interviews: 2, practice: 2 },
    { day: "Fri", interviews: 4, practice: 5 },
    { day: "Sat", interviews: 1, practice: 3 },
    { day: "Sun", interviews: 0, practice: 1 },
  ];

  const detailedMetrics = [
    {
      category: "Response Quality",
      metrics: [
        { name: "Clarity", value: 87, trend: "+5%" },
        { name: "Relevance", value: 82, trend: "+3%" },
        { name: "Depth", value: 79, trend: "-2%" },
        { name: "Structure", value: 85, trend: "+7%" },
      ]
    },
    {
      category: "Communication",
      metrics: [
        { name: "Confidence", value: 91, trend: "+8%" },
        { name: "Pace", value: 78, trend: "+2%" },
        { name: "Articulation", value: 84, trend: "+4%" },
        { name: "Engagement", value: 89, trend: "+6%" },
      ]
    },
    {
      category: "Technical Skills",
      metrics: [
        { name: "Problem Solving", value: 86, trend: "+9%" },
        { name: "Code Quality", value: 82, trend: "+3%" },
        { name: "Algorithm Knowledge", value: 75, trend: "+1%" },
        { name: "System Design", value: 78, trend: "+5%" },
      ]
    }
  ];

  const recentInterviews = [
    {
      id: 1,
      date: "2024-01-29",
      position: "Senior Frontend Developer",
      company: "TechCorp",
      score: 92,
      duration: "45 min",
      type: "Technical",
      improvement: "+8 points"
    },
    {
      id: 2,
      date: "2024-01-26",
      position: "Product Manager",
      company: "StartupXYZ",
      score: 87,
      duration: "38 min",
      type: "Behavioral",
      improvement: "+3 points"
    },
    {
      id: 3,
      date: "2024-01-24",
      position: "Full Stack Engineer",
      company: "DevCompany",
      score: 84,
      duration: "52 min",
      type: "Technical",
      improvement: "+5 points"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-card-elevated">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="hover-lift">
                <Link to="/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center glow-effect">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">Analytics Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Detailed performance insights and trends</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="hover-lift">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Key Metrics Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass-card-elevated hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                    <p className="text-3xl font-bold gradient-text">85</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">+12% from last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-elevated hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Interviews Completed</p>
                    <p className="text-3xl font-bold gradient-text">31</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">+8 this month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-elevated hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                    <p className="text-3xl font-bold gradient-text">2.4s</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">-0.3s improved</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary-glow/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary-glow" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-elevated hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Best Streak</p>
                    <p className="text-3xl font-bold gradient-text">12</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary">days active</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Analytics Tabs */}
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Trend */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="glass-card-elevated">
                    <CardHeader>
                      <CardTitle className="gradient-text">Performance Trend</CardTitle>
                      <CardDescription>Your interview scores over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Interview Types Distribution */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="glass-card-elevated">
                    <CardHeader>
                      <CardTitle className="gradient-text">Interview Types</CardTitle>
                      <CardDescription>Performance by interview category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={interviewTypesData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="avgScore" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Recent Interview Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-card-elevated">
                  <CardHeader>
                    <CardTitle className="gradient-text">Recent Interview Results</CardTitle>
                    <CardDescription>Your latest interview performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentInterviews.map((interview) => (
                        <div key={interview.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg glass-card hover-lift">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                              <Brain className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{interview.position}</h3>
                              <p className="text-sm text-muted-foreground">{interview.company}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {interview.date}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {interview.duration}
                                </span>
                                <Badge variant="secondary">{interview.type}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold gradient-text">{interview.score}</div>
                            <div className="text-sm text-green-500">{interview.improvement}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skills Radar Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="glass-card-elevated">
                    <CardHeader>
                      <CardTitle className="gradient-text">Skills Assessment</CardTitle>
                      <CardDescription>Your performance across different skill areas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={skillsRadarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="skill" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name="Score"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Skills Breakdown */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card className="glass-card-elevated">
                    <CardHeader>
                      <CardTitle className="gradient-text">Skills Breakdown</CardTitle>
                      <CardDescription>Detailed view of your skill ratings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {skillsRadarData.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.skill}</span>
                            <span className="text-muted-foreground">{skill.score}/100</span>
                          </div>
                          <Progress value={skill.score} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="glass-card-elevated">
                  <CardHeader>
                    <CardTitle className="gradient-text">Weekly Activity</CardTitle>
                    <CardDescription>Your interview and practice session activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weeklyActivityData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="interviews" fill="hsl(var(--primary))" name="Interviews" />
                        <Bar dataKey="practice" fill="hsl(var(--accent))" name="Practice Sessions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {detailedMetrics.map((category, index) => (
                  <Card key={index} className="glass-card-elevated">
                    <CardHeader>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{metric.name}</p>
                            <p className="text-sm text-muted-foreground">{metric.trend}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold gradient-text">{metric.value}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;