import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  BookOpen, 
  Play,
  Brain,
  Mic,
  BarChart3,
  Settings,
  Users,
  Lightbulb
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const { toast } = useToast();

  const quickLinks = [
    {
      title: "Getting Started",
      description: "Set up your account and start your first interview",
      icon: Play,
      color: "primary",
      link: "#getting-started"
    },
    {
      title: "Voice AI Setup",
      description: "Configure your voice assistant and API keys",
      icon: Mic,
      color: "accent",
      link: "#voice-setup"
    },
    {
      title: "Understanding Analytics",
      description: "Learn how to interpret your performance data",
      icon: BarChart3,
      color: "primary-glow",
      link: "#analytics"
    },
    {
      title: "Account Settings",
      description: "Manage your profile and preferences",
      icon: Settings,
      color: "destructive",
      link: "#settings"
    }
  ];

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create my first interview?",
          answer: "Navigate to the Dashboard and click 'Start New Interview'. Fill in the job details, select your experience level, and choose between text or voice interview mode. The AI will then begin asking relevant questions based on your selections."
        },
        {
          question: "What information should I provide for better results?",
          answer: "Provide accurate job title, company name, industry, and your experience level. The more specific you are, the better our AI can tailor questions to your situation. Also, include any specific skills or technologies mentioned in the job description."
        },
        {
          question: "How long does a typical interview take?",
          answer: "Interview sessions typically last 15-45 minutes, depending on the role and number of questions. You can end the session at any time and resume later if needed."
        }
      ]
    },
    {
      category: "Voice AI Features",
      questions: [
        {
          question: "How do I set up the voice assistant?",
          answer: "Go to Profile > API Keys and enter your Vapi.ai API key. Once configured, you can use voice mode in interviews and practice sessions. The AI will speak questions aloud and listen to your verbal responses."
        },
        {
          question: "What if the voice AI doesn't understand me?",
          answer: "Ensure you have a good microphone and speak clearly. You can also switch to text mode at any time during the interview. The AI is continuously learning and improving its understanding of different accents and speech patterns."
        },
        {
          question: "Can I escalate to a human coach?",
          answer: "Yes! Click the 'Human Agent' button during any voice session. Our system will connect you with a human career coach who can provide personalized guidance and answer specific questions."
        }
      ]
    },
    {
      category: "Performance & Analytics",
      questions: [
        {
          question: "How is my interview score calculated?",
          answer: "Scores are based on multiple factors: response relevance, communication clarity, technical accuracy (for technical roles), and overall confidence. The AI analyzes your answers against industry best practices and successful response patterns."
        },
        {
          question: "What do the different analytics metrics mean?",
          answer: "The dashboard shows various metrics: Overall Score (0-100), Response Time (how quickly you answer), Confidence Level (based on speech patterns), and Skill Ratings for different competencies relevant to your target role."
        },
        {
          question: "How can I improve my scores?",
          answer: "Focus on areas highlighted in your feedback reports. Practice common question types for your industry, work on speaking clearly and confidently, and review the suggested improvements after each session."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          question: "The voice feature isn't working. What should I do?",
          answer: "First, check that you've entered a valid Vapi.ai API key in your profile settings. Ensure your browser has microphone permissions enabled. If issues persist, try refreshing the page or switching to text mode temporarily."
        },
        {
          question: "My interview session got disconnected. Can I resume?",
          answer: "Yes, your progress is automatically saved. Return to the Interview page and you'll see an option to resume your last session. All previous questions and responses are preserved."
        },
        {
          question: "How do I update my API key?",
          answer: "Go to Profile > API Keys tab. Delete the old key and enter your new Vapi.ai API key. Click 'Save' to update. The change will take effect immediately for new sessions."
        }
      ]
    }
  ];

  const tutorials = [
    {
      title: "Complete Beginner's Guide",
      duration: "10 min",
      description: "Everything you need to know to get started with PrepWise",
      steps: [
        "Create your account and complete profile setup",
        "Configure voice AI with your Vapi.ai API key",
        "Start your first practice interview",
        "Review your performance analytics",
        "Set up interview reminders and goals"
      ]
    },
    {
      title: "Advanced Voice AI Features",
      duration: "7 min",
      description: "Master the voice assistant and escalation features",
      steps: [
        "Understanding voice commands and interactions",
        "Using the human escalation feature effectively",
        "Customizing voice settings for your accent",
        "Troubleshooting common voice issues"
      ]
    },
    {
      title: "Performance Optimization",
      duration: "12 min",
      description: "Strategies to improve your interview scores",
      steps: [
        "Analyzing your performance dashboard",
        "Identifying improvement areas",
        "Practicing targeted skill development",
        "Setting and tracking progress goals"
      ]
    }
  ];

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you within 24 hours.",
    });
    
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-card-elevated">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover-lift">
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center glow-effect">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Help & Support</h1>
                <p className="text-sm text-muted-foreground">Get help and learn how to use PrepWise</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card-elevated">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search for help articles, tutorials, or FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-lg h-12"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Help Links */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold gradient-text mb-6">Quick Help</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <Card key={index} className="glass-card-elevated hover-lift interactive-scale cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${link.color}/20`}>
                        <link.icon className={`w-5 h-5 text-${link.color}`} />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card-elevated hover-lift interactive-scale">
                  <CardHeader>
                    <CardTitle className="gradient-text">Frequently Asked Questions</CardTitle>
                    <CardDescription>Find answers to common questions about PrepWise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {faqs.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-primary">{category.category}</h3>
                        <Accordion type="single" collapsible className="space-y-2">
                          {category.questions.map((faq, faqIndex) => (
                            <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                              <AccordionTrigger className="text-left hover:text-primary">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="tutorials" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card-elevated hover-lift interactive-scale">
                  <CardHeader>
                    <CardTitle className="gradient-text">Video Tutorials</CardTitle>
                    <CardDescription>Step-by-step guides to master PrepWise</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {tutorials.map((tutorial, index) => (
                      <div key={index} className="border border-border/50 rounded-lg p-6 glass-card hover-lift interactive-scale">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{tutorial.title}</h3>
                            <p className="text-muted-foreground mb-2">{tutorial.description}</p>
                            <Badge variant="secondary">{tutorial.duration}</Badge>
                          </div>
                          <Button className="bg-gradient-primary hover-lift">
                            <Play className="w-4 h-4 mr-2" />
                            Watch
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">What you'll learn:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {tutorial.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Contact Form */}
                <Card className="glass-card-elevated">
                  <CardHeader>
                    <CardTitle className="gradient-text">Send us a Message</CardTitle>
                    <CardDescription>Get personalized help from our support team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Name *</label>
                        <Input
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email *</label>
                        <Input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Input
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        placeholder="What can we help you with?"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message *</label>
                      <Textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        placeholder="Describe your issue or question..."
                        rows={6}
                      />
                    </div>
                    <Button onClick={handleContactSubmit} className="w-full bg-gradient-primary hover-lift">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-6">
                  <Card className="glass-card-elevated hover-lift interactive-scale">
                    <CardHeader>
                      <CardTitle className="gradient-text">Other Ways to Reach Us</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Email Support</h3>
                          <p className="text-sm text-muted-foreground">support@prepwise.ai</p>
                          <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-medium">Live Chat</h3>
                          <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM EST</p>
                          <Button variant="link" className="h-auto p-0 text-xs">
                            Start Chat
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-glow/20 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-glow" />
                        </div>
                        <div>
                          <h3 className="font-medium">Community Forum</h3>
                          <p className="text-sm text-muted-foreground">Get help from other users</p>
                          <Button variant="link" className="h-auto p-0 text-xs">
                            Visit Forum
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Pro Tip
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        For faster support, include your account email and describe the specific steps 
                        you took before encountering the issue. Screenshots are also helpful!
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card-elevated">
                  <CardHeader>
                    <CardTitle className="gradient-text">Additional Resources</CardTitle>
                    <CardDescription>Helpful links and documentation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-4">Documentation</h3>
                        <div className="space-y-3">
                          <Button variant="ghost" className="w-full justify-start hover-lift">
                            <BookOpen className="w-4 h-4 mr-2" />
                            API Documentation
                          </Button>
                          <Button variant="ghost" className="w-full justify-start hover-lift">
                            <Settings className="w-4 h-4 mr-2" />
                            Integration Guides
                          </Button>
                          <Button variant="ghost" className="w-full justify-start hover-lift">
                            <Brain className="w-4 h-4 mr-2" />
                            AI Model Information
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-4">Community</h3>
                        <div className="space-y-3">
                          <Button variant="ghost" className="w-full justify-start hover-lift">
                            <Users className="w-4 h-4 mr-2" />
                            User Community
                          </Button>
                          <Button variant="ghost" className="w-full justify-start hover-lift">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Feature Requests
                          </Button>
                          <Button variant="ghost" className="w-full justify-start hover-lift">
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Best Practices
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold mb-4">System Status & Updates</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">All systems operational</span>
                      </div>
                      <Button variant="link" className="h-auto p-0 text-sm">
                        View Status Page
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Help;