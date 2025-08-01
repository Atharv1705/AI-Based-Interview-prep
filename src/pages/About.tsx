import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Target, Zap, ArrowLeft, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "CEO & Co-founder",
    bio: "Former Google engineer with 10+ years in AI and machine learning.",
    image: "/placeholder-avatar.jpg",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
  {
    name: "Sarah Chen",
    role: "CTO & Co-founder",
    bio: "AI researcher with expertise in natural language processing and voice technology.",
    image: "/placeholder-avatar.jpg",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
  {
    name: "Michael Rodriguez",
    role: "Head of Product",
    bio: "Product strategist focused on creating intuitive user experiences.",
    image: "/placeholder-avatar.jpg",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
  {
    name: "Emily Davis",
    role: "Lead Developer",
    bio: "Full-stack developer passionate about building scalable AI applications.",
    image: "/placeholder-avatar.jpg",
    social: { github: "#", linkedin: "#", twitter: "#" }
  }
];

const stats = [
  { number: "10k+", label: "Interviews Conducted" },
  { number: "95%", label: "Success Rate" },
  { number: "500+", label: "Companies Trust Us" },
  { number: "24/7", label: "AI Availability" }
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-card-elevated">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover-lift">
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center glow-effect">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">About PrepWise</h1>
                <p className="text-sm text-muted-foreground">Revolutionizing interview preparation with AI</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Empowering Your Career Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            PrepWise combines cutting-edge AI technology with proven interview techniques to help you 
            land your dream job. Our platform provides personalized coaching, real-time feedback, 
            and comprehensive preparation tools.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card-elevated">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl gradient-text">Our Mission</CardTitle>
              <CardDescription className="text-lg">
                Making interview success accessible to everyone
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
                <p className="text-muted-foreground">
                  AI-driven insights tailored to your industry, role, and experience level.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Feedback</h3>
                <p className="text-muted-foreground">
                  Instant analysis of your responses, body language, and communication skills.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-glow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-glow" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
                <p className="text-muted-foreground">
                  Learn from thousands of successful interviews and best practices.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="glass-card-elevated">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl gradient-text">Powered by Advanced AI</CardTitle>
              <CardDescription className="text-lg">
                Built on the latest breakthroughs in artificial intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Technologies We Use</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">GPT-4</Badge>
                      <span>Advanced language understanding and generation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">Vapi.ai</Badge>
                      <span>Voice AI for natural conversations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">React</Badge>
                      <span>Modern, responsive user interface</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">Machine Learning</Badge>
                      <span>Personalized recommendations and insights</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Natural language processing for realistic conversations</li>
                    <li>• Voice recognition and analysis</li>
                    <li>• Real-time performance scoring</li>
                    <li>• Adaptive questioning based on your responses</li>
                    <li>• Industry-specific interview scenarios</li>
                    <li>• Progress tracking and analytics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Passionate experts dedicated to your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="glass-card-elevated hover-lift interactive-scale text-center">
                  <CardHeader>
                    <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-foreground">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon" className="hover-lift">
                        <Github className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover-lift">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover-lift">
                        <Twitter className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="glass-card-elevated border-primary/20">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Ready to Ace Your Next Interview?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have transformed their careers with PrepWise. 
                Start your journey today and unlock your potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-primary hover-lift glow-effect">
                  <Link to="/auth">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="hover-lift">
                  <Link to="/dashboard">View Demo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;