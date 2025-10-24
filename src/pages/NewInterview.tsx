import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, ArrowLeft, Sparkles, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const jobRoles = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX/UI Designer",
  "Marketing Manager",
  "Sales Representative",
  "Business Analyst",
  "DevOps Engineer",
  "Other"
];

const experienceLevels = [
  "Entry Level (0-2 years)",
  "Mid Level (3-5 years)",
  "Senior Level (6-10 years)",
  "Executive Level (10+ years)"
];

const NewInterview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simulate interview creation
    setTimeout(() => {
      setIsLoading(false);
      // Persist basic context for voice agent
      const jobTitle = (document.getElementById('jobTitle') as HTMLInputElement)?.value || '';
      const company = (document.getElementById('company') as HTMLInputElement)?.value || '';
      localStorage.setItem('mock_job_title', jobTitle);
      localStorage.setItem('mock_company', company);
      localStorage.setItem('mock_difficulty', 'medium');
      toast({
        title: "Interview Created!",
        description: "Your AI mock interview is ready. Starting session...",
      });
      navigate('/interview/1/session');
    }, 2000);
  };

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
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Interview Setup</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create New Interview</h1>
          <p className="text-muted-foreground">
            Set up your personalized AI mock interview session
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Interview Details
            </CardTitle>
            <CardDescription>
              Tell us about the position you're preparing for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle" 
                    placeholder="e.g., Senior Software Engineer"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input 
                    id="company" 
                    placeholder="e.g., Google, Microsoft"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobRole">Job Role Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job role" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobRoles.map((role) => (
                        <SelectItem key={role} value={role.toLowerCase().replace(/\s+/g, '-')}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level.toLowerCase().replace(/\s+/g, '-')}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                <Textarea 
                  id="jobDescription" 
                  placeholder="Paste the job description here to get more targeted questions..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusAreas">Focus Areas (Optional)</Label>
                <Textarea 
                  id="focusAreas" 
                  placeholder="Any specific topics you want to focus on? e.g., System Design, Behavioral Questions, Technical Skills..."
                  rows={3}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary text-lg py-6" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Creating Interview...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start AI Interview
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Your interview will be customized based on the information provided
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewInterview;