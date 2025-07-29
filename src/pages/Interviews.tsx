import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, ArrowLeft, Search, Calendar, Play, BarChart3, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";

// Mock interview history data
const interviewHistory = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp",
    date: "2024-01-15",
    duration: "28 mins",
    score: 85,
    status: "completed",
    type: "Full Interview",
    feedback: "Strong technical answers, good system design approach"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartUp Inc",
    date: "2024-01-12",
    duration: "22 mins",
    score: 78,
    status: "completed",
    type: "Behavioral Practice",
    feedback: "Good storytelling, work on quantifying achievements"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "AI Company",
    date: "2024-01-10",
    duration: "35 mins",
    score: 92,
    status: "completed",
    type: "Technical Practice",
    feedback: "Excellent problem-solving skills and communication"
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "Design Studio",
    date: "2024-01-08",
    duration: "15 mins",
    score: 70,
    status: "incomplete",
    type: "Quick Practice",
    feedback: "Session ended early, good start on technical questions"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Cloud Solutions",
    date: "2024-01-05",
    duration: "30 mins",
    score: 88,
    status: "completed",
    type: "Full Interview",
    feedback: "Strong infrastructure knowledge, clear explanations"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
    case "incomplete": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "in-progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-500";
  if (score >= 80) return "text-primary";
  if (score >= 70) return "text-yellow-500";
  return "text-red-500";
};

const Interviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredInterviews = interviewHistory.filter(interview => {
    const matchesSearch = interview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    const matchesType = typeFilter === "all" || interview.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            <Button className="bg-gradient-primary" asChild>
              <Link to="/interview/new">
                <Plus className="w-4 h-4 mr-2" />
                New Interview
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Interview History</h1>
          <p className="text-muted-foreground">
            Review your past interviews and track your progress over time
          </p>
        </div>

        {/* Filters */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search interviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full Interview">Full Interview</SelectItem>
                  <SelectItem value="Behavioral Practice">Behavioral Practice</SelectItem>
                  <SelectItem value="Technical Practice">Technical Practice</SelectItem>
                  <SelectItem value="Quick Practice">Quick Practice</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interview List */}
        <div className="space-y-4">
          {filteredInterviews.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No interviews found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Start your first interview to see your history here"
                  }
                </p>
                <Button className="bg-gradient-primary" asChild>
                  <Link to="/interview/new">Start Your First Interview</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredInterviews.map((interview) => (
              <Card key={interview.id} className="glass-card hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{interview.title}</h3>
                        <p className="text-muted-foreground">{interview.company}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {interview.date}
                          </div>
                          <Badge variant="outline">{interview.type}</Badge>
                          <Badge className={getStatusColor(interview.status)}>
                            {interview.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(interview.score)}`}>
                          {interview.score}
                        </div>
                        <div className="text-sm text-muted-foreground">Score</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{interview.duration}</div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/interview/${interview.id}/feedback`}>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Report
                          </Link>
                        </Button>
                        {interview.status === "incomplete" && (
                          <Button size="sm" className="bg-gradient-primary" asChild>
                            <Link to={`/interview/${interview.id}`}>
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {interview.feedback && (
                    <div className="mt-4 p-3 bg-secondary/20 rounded-lg border border-border/50">
                      <p className="text-sm text-muted-foreground italic">
                        "{interview.feedback}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Interviews;