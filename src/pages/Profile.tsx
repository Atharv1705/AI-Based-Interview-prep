import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, User, Settings, Key, Bell, Shield, ArrowLeft, Save, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const { user, profile: userProfile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    experience: "beginner",
    bio: "",
    vapiApiKey: "",
    notifications: {
      email: true,
      interview: true,
      reminders: false
    }
  });

  useEffect(() => {
    if (userProfile && user) {
      setProfile({
        name: userProfile.full_name || "",
        email: user.email || "",
        company: "",
        role: "",
        experience: userProfile.skill_level || "beginner",
        bio: "",
        vapiApiKey: localStorage.getItem('vapi_api_key') || "",
        notifications: {
          email: true,
          interview: true,
          reminders: false
        }
      });
    }
  }, [userProfile, user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.name,
          company: profile.company,
          role: profile.role,
          experience_level: profile.experience,
          bio: profile.bio,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await updateProfile({
        full_name: profile.name,
        skill_level: profile.experience as 'beginner' | 'intermediate' | 'advanced'
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeySave = () => {
    localStorage.setItem('vapi_api_key', profile.vapiApiKey);
    toast({
      title: "API Key Saved",
      description: "Your Vapi.ai API key has been securely stored.",
    });
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
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Profile & Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card-elevated">
                  <CardHeader>
                    <CardTitle className="gradient-text">Personal Information</CardTitle>
                    <CardDescription>Update your profile details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" className="hover-lift">
                          <Upload className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) => setProfile({...profile, company: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Current Role</Label>
                        <Input
                          id="role"
                          value={profile.role}
                          onChange={(e) => setProfile({...profile, role: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSave} disabled={loading} className="bg-gradient-primary hover-lift">
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="api-keys" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card-elevated">
                  <CardHeader>
                    <CardTitle className="gradient-text">API Configuration</CardTitle>
                    <CardDescription>Configure your AI service API keys</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">Vapi.ai Integration</h3>
                          <Badge variant="secondary">Voice AI</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connect your Vapi.ai account to enable voice-based interviews and conversations.
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="vapi-key">Vapi.ai API Key</Label>
                          <Input
                            id="vapi-key"
                            type="password"
                            placeholder="Enter your Vapi.ai API key"
                            value={profile.vapiApiKey}
                            onChange={(e) => setProfile({...profile, vapiApiKey: e.target.value})}
                          />
                        </div>
                        <Button 
                          onClick={handleApiKeySave} 
                          className="mt-4 bg-gradient-primary hover-lift"
                          size="sm"
                        >
                          Save API Key
                        </Button>
                      </div>

                      <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-5 h-5 text-accent" />
                          <h3 className="font-semibold">OpenAI Integration</h3>
                          <Badge variant="outline">Coming Soon</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Direct OpenAI integration for custom AI models and advanced features.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card-elevated">
                  <CardHeader>
                    <CardTitle className="gradient-text">Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive email updates about your interviews
                          </p>
                        </div>
                        <Switch
                          checked={profile.notifications.email}
                          onCheckedChange={(checked) => 
                            setProfile({
                              ...profile,
                              notifications: { ...profile.notifications, email: checked }
                            })
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Interview Reminders</h3>
                          <p className="text-sm text-muted-foreground">
                            Get reminded about upcoming practice sessions
                          </p>
                        </div>
                        <Switch
                          checked={profile.notifications.interview}
                          onCheckedChange={(checked) => 
                            setProfile({
                              ...profile,
                              notifications: { ...profile.notifications, interview: checked }
                            })
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Weekly Progress</h3>
                          <p className="text-sm text-muted-foreground">
                            Weekly summary of your interview performance
                          </p>
                        </div>
                        <Switch
                          checked={profile.notifications.reminders}
                          onCheckedChange={(checked) => 
                            setProfile({
                              ...profile,
                              notifications: { ...profile.notifications, reminders: checked }
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSave} className="bg-gradient-primary hover-lift">
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card-elevated">
                  <CardHeader>
                    <CardTitle className="gradient-text">Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Change Password</h3>
                        <div className="space-y-2">
                          <Input type="password" placeholder="Current password" />
                          <Input type="password" placeholder="New password" />
                          <Input type="password" placeholder="Confirm new password" />
                        </div>
                        <Button variant="outline" className="mt-2 hover-lift">
                          Update Password
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add an extra layer of security to your account
                        </p>
                        <Button variant="outline" className="hover-lift">
                          Enable 2FA
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Permanently delete your account and all associated data
                        </p>
                        <Button variant="destructive" className="hover-lift">
                          Delete Account
                        </Button>
                      </div>
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

export default Profile;