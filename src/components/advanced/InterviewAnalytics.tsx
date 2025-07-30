import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Target, Clock, Brain, Star, Award, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const mockPerformanceData = [
  { month: 'Jan', score: 65, interviews: 5 },
  { month: 'Feb', score: 72, interviews: 8 },
  { month: 'Mar', score: 78, interviews: 12 },
  { month: 'Apr', score: 85, interviews: 15 },
  { month: 'May', score: 88, interviews: 18 },
  { month: 'Jun', score: 92, interviews: 22 },
];

const skillData = [
  { skill: 'Communication', current: 85, target: 95 },
  { skill: 'Technical', current: 78, target: 90 },
  { skill: 'Problem Solving', current: 92, target: 95 },
  { skill: 'Leadership', current: 70, target: 85 },
  { skill: 'Adaptability', current: 88, target: 92 },
];

const categoryData = [
  { name: 'Technical', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Behavioral', value: 25, color: 'hsl(var(--accent))' },
  { name: 'Case Study', value: 20, color: 'hsl(var(--secondary))' },
  { name: 'System Design', value: 20, color: 'hsl(var(--muted))' },
];

const radarData = [
  { subject: 'Clarity', current: 85, benchmark: 75 },
  { subject: 'Confidence', current: 78, benchmark: 80 },
  { subject: 'Structure', current: 92, benchmark: 85 },
  { subject: 'Examples', current: 88, benchmark: 70 },
  { subject: 'Timing', current: 76, benchmark: 75 },
  { subject: 'Enthusiasm', current: 94, benchmark: 80 },
];

const InterviewAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">92%</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500">+8% from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-accent">22</div>
                  <div className="text-sm text-muted-foreground">Interviews</div>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Target className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-blue-500">4 this week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary-glow">48m</div>
                  <div className="text-sm text-muted-foreground">Avg Duration</div>
                </div>
                <div className="w-10 h-10 bg-primary-glow/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-glow" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-orange-500">+5m improvement</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-secondary">A+</div>
                  <div className="text-sm text-muted-foreground">Grade</div>
                </div>
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-yellow-500">Top 5% performer</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Performance Trend
                </CardTitle>
                <CardDescription>Your interview scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Interview Volume
                </CardTitle>
                <CardDescription>Number of interviews per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="interviews" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Skill Progress
                </CardTitle>
                <CardDescription>Current vs target skill levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillData.map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{skill.current}%</span>
                        <Badge variant="outline" className="text-xs">
                          Target: {skill.target}%
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={skill.current} className="h-2" />
                      <div className="flex justify-end">
                        <div 
                          className="h-1 w-1 bg-accent rounded-full"
                          style={{ marginRight: `${100 - skill.target}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary-glow" />
                  Skill Radar
                </CardTitle>
                <CardDescription>Performance vs industry benchmark</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Benchmark"
                      dataKey="benchmark"
                      stroke="hsl(var(--muted-foreground))"
                      fill="hsl(var(--muted-foreground))"
                      fillOpacity={0.1}
                      strokeWidth={1}
                      strokeDasharray="5 5"
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Interview Categories</CardTitle>
              <CardDescription>Distribution of your practice sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/20"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {category.value}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">🎯 Key Strengths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="font-medium text-green-700 dark:text-green-400">Excellent Structure</div>
                  <div className="text-sm text-green-600 dark:text-green-500">
                    You consistently organize your answers using clear frameworks
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="font-medium text-blue-700 dark:text-blue-400">Strong Examples</div>
                  <div className="text-sm text-blue-600 dark:text-blue-500">
                    Your use of specific examples greatly enhances your responses
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="font-medium text-purple-700 dark:text-purple-400">High Enthusiasm</div>
                  <div className="text-sm text-purple-600 dark:text-purple-500">
                    Your passion for the role comes through clearly
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">📈 Areas to Improve</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="font-medium text-orange-700 dark:text-orange-400">Time Management</div>
                  <div className="text-sm text-orange-600 dark:text-orange-500">
                    Practice keeping responses within 2-3 minutes
                  </div>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="font-medium text-red-700 dark:text-red-400">Technical Depth</div>
                  <div className="text-sm text-red-600 dark:text-red-500">
                    Add more technical details to system design answers
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="font-medium text-yellow-700 dark:text-yellow-400">Question Clarification</div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-500">
                    Ask more clarifying questions before answering
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewAnalytics;