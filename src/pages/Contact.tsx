import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Brain, Mail, Phone, MapPin, MessageSquare, Send, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', subject: '', category: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl gradient-text">PrepWise</span>
            </Link>
            <div className="w-px h-6 bg-border" />
            <h1 className="text-2xl font-bold">Contact Us</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about PrepWise? Need help with interview preparation? 
              We're here to support your career journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="glass-card hover-lift interactive-scale">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing & Pricing</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide details about your inquiry..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-primary">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card className="glass-card hover-lift interactive-scale">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Multiple ways to reach our team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">support@prepwise.ai</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Office</p>
                      <p className="text-sm text-muted-foreground">
                        123 Innovation Drive<br />
                        Tech Valley, CA 94043
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card className="glass-card hover-lift interactive-scale">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Monday - Friday</span>
                    <span className="text-sm font-medium">9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Saturday</span>
                    <span className="text-sm font-medium">10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sunday</span>
                    <span className="text-sm font-medium">Closed</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Emergency support available 24/7 for premium subscribers
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Link */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Quick Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Looking for immediate answers? Check out our resources:
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/help">
                        Help Center & FAQ
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/about">
                        About PrepWise
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/pricing">
                        Pricing & Plans
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Need Immediate Assistance?</h3>
                <p className="text-muted-foreground mb-4">
                  For urgent technical issues or billing inquiries, our AI assistant is available 24/7 
                  to provide instant support and guide you to the right resources.
                </p>
                <Button className="bg-gradient-primary" asChild>
                  <Link to="/dashboard">
                    Start AI Chat Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;