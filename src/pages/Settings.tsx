import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, Key, Shield, Bell, User, Mic, Volume2, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user, profile: userProfile } = useAuth();
  const { toast } = useToast();
  const [vapiApiKey, setVapiApiKey] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    experience: 'mid-level',
    bio: ''
  });
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: false,
    voiceEnabled: true,
    autoRecord: false,
    difficulty: 'medium'
  });

  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.full_name || '',
        email: user?.email || '',
        company: '',
        role: '',
        experience: userProfile.skill_level || 'mid-level',
        bio: ''
      });
    }
    
    // Load saved API key
    const savedApiKey = localStorage.getItem('vapi_api_key');
    if (savedApiKey) {
      setVapiApiKey(savedApiKey);
    }
  }, [userProfile, user]);

  const handleSaveApiKey = () => {
    if (vapiApiKey) {
      localStorage.setItem('vapi_api_key', vapiApiKey);
      toast({
        title: "API Key Saved",
        description: "Your Vapi.ai API key has been saved successfully.",
      });
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleSavePreferences = () => {
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
    toast({
      title: "Preferences Updated",
      description: "Your preferences have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl gradient-text">PrepWise</span>
            <div className="w-px h-6 bg-border" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              API & Integration
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* API & Integration */}
          <TabsContent value="api" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Vapi.ai Integration
                </CardTitle>
                <CardDescription>
                  Configure your Vapi.ai API key for voice agent functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vapi-key">Vapi.ai API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="vapi-key"
                      type="password"
                      placeholder="Enter your Vapi.ai API key"
                      value={vapiApiKey}
                      onChange={(e) => setVapiApiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSaveApiKey} disabled={!vapiApiKey}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get your API key from <a href="https://dashboard.vapi.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vapi.ai Dashboard</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>API Endpoint</Label>
                  <Input value="https://api.vapi.ai/call" disabled className="bg-muted" />
                  <p className="text-sm text-muted-foreground">
                    Default Vapi.ai API endpoint
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Current Status</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={vapiApiKey ? "default" : "destructive"} className={vapiApiKey ? "bg-green-500 text-white" : ""}>
                      {vapiApiKey ? "Connected" : "Not Connected"}
                    </Badge>
                    {vapiApiKey && (
                      <span className="text-sm text-muted-foreground">
                        Voice agent ready
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your profile information for personalized interview preparation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Current or target company"
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      placeholder="Current or target role"
                      value={profile.role}
                      onChange={(e) => setProfile({...profile, role: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select value={profile.experience} onValueChange={(value) => setProfile({...profile, experience: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid-level">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                      <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your background, and career goals..."
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={4}
                  />
                </div>

                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Application Preferences
                </CardTitle>
                <CardDescription>
                  Customize your experience and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about interview reminders and updates
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications}
                      onCheckedChange={(checked) => setPreferences({...preferences, notifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get weekly progress reports and tips via email
                      </p>
                    </div>
                    <Switch
                      checked={preferences.emailUpdates}
                      onCheckedChange={(checked) => setPreferences({...preferences, emailUpdates: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-primary" />
                      <div>
                        <Label className="text-base">Voice Features</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable voice-based interviews and interactions
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.voiceEnabled}
                      onCheckedChange={(checked) => setPreferences({...preferences, voiceEnabled: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-Record Sessions</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically record interview sessions for review
                      </p>
                    </div>
                    <Switch
                      checked={preferences.autoRecord}
                      onCheckedChange={(checked) => setPreferences({...preferences, autoRecord: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Default Interview Difficulty</Label>
                  <Select value={preferences.difficulty} onValueChange={(value) => setPreferences({...preferences, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="adaptive">Adaptive (Adjusts based on performance)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSavePreferences} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Password</h4>
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">2FA Status</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Badge variant="outline">Not Enabled</Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-2">
                      Enable 2FA
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Data Privacy</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Privacy Settings
                      </Button>
                      <Button variant="destructive" className="w-full justify-start">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;