import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, Play, Clock, Target, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const practiceCategories = [
  {
    id: 1,
    title: "Behavioral Questions",
    description: "Practice common behavioral interview questions using the STAR method",
    duration: "10-15 min",
    difficulty: "Beginner",
    questions: 8,
    icon: Target,
    color: "primary"
  },
  {
    id: 2,
    title: "Technical Skills",
    description: "Technical questions for software engineering and development roles",
    duration: "15-20 min",
    difficulty: "Intermediate",
    questions: 12,
    icon: Brain,
    color: "accent"
  },
  {
    id: 3,
    title: "System Design",
    description: "Practice designing scalable systems and architectures",
    duration: "20-30 min",
    difficulty: "Advanced",
    questions: 6,
    icon: Lightbulb,
    color: "secondary"
  },
  {
    id: 4,
    title: "Leadership & Management",
    description: "Questions focused on team leadership and project management",
    duration: "15-20 min",
    difficulty: "Intermediate",
    questions: 10,
    icon: Target,
    color: "primary"
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner": return "bg-green-500/10 text-green-500 border-green-500/20";
    case "Intermediate": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "Advanced": return "bg-red-500/10 text-red-500 border-red-500/20";
    default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const Practice = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Practice Sessions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sharpen your interview skills with focused practice sessions. Choose a category that matches your preparation needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {practiceCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className={`glass-card hover:border-primary/50 transition-all duration-300 cursor-pointer group ${
                  selectedCategory === category.id ? 'border-primary/50 bg-primary/5' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                      category.color === 'primary' ? 'bg-primary/10' :
                      category.color === 'accent' ? 'bg-accent/10' : 'bg-secondary/20'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        category.color === 'primary' ? 'text-primary' :
                        category.color === 'accent' ? 'text-accent' : 'text-foreground'
                      }`} />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(category.difficulty)}
                    >
                      {category.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {category.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {category.questions} questions
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      selectedCategory === category.id 
                        ? 'bg-gradient-primary' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    asChild
                  >
                    <Link to={`/interview/practice-${category.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Start Section */}
        <div className="mt-16 text-center">
          <Card className="glass-card max-w-2xl mx-auto border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="text-xl">Need Quick Practice?</CardTitle>
              <CardDescription>
                Jump into a random mix of questions from all categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                className="bg-gradient-primary text-lg px-8 py-6"
                asChild
              >
                <Link to="/interview/quick-practice">
                  <Play className="w-5 h-5 mr-2" />
                  Quick Practice (5 mins)
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Practice;