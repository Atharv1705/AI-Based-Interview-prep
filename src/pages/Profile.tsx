import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, User, Settings, Key, Bell, Shield, ArrowLeft, Save, Upload } from "lucide-react";

const Profile = () => {
  const { user, profile: userProfile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile && user) {
      setProfile({
        full_name: userProfile.full_name || "",
        email: user.email || "",
        company: userProfile.company || "",
        role: userProfile.role || "",
        experience: userProfile.skill_level || "beginner",
        bio: userProfile.bio || "",
        vapiApiKey: localStorage.getItem('vapi_api_key') || "",
        notifications: {
          email: true,
          interview: true,
          reminders: false
        }
      });
      setAvatarUrl(userProfile.avatar_url);
    }
  }, [userProfile, user]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, or GIF).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch(`/api/profile/${user.id}/photo`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload photo');
      }

      const data = await res.json();
      setAvatarUrl(data.avatar_url);
      
      // Update the profile with new avatar URL
      await updateProfile({
        avatar_url: data.avatar_url,
      });

      toast({
        title: "Photo uploaded successfully",
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await updateProfile({
        full_name: profile.full_name,
        avatar_url: avatarUrl,
        company: profile.company,
        role: profile.role,
        skill_level: profile.experience as 'beginner' | 'intermediate' | 'advanced',
        bio: profile.bio,
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
      description: "Your Vapi API key has been saved locally.",
    });
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4 hover-lift" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-2 gradient-text">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="max-w-4xl">
              <Card className="glass-card-elevated hover-lift interactive-scale">
                <CardHeader>
                  <CardTitle className="gradient-text">Personal Information</CardTitle>
                  <CardDescription>Update your profile details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={avatarUrl || "/placeholder-avatar.jpg"} />
                      <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                        {profile.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        className="hover-lift"
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        disabled={loading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {loading ? 'Uploading...' : 'Change Photo'}
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
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="bg-muted/50"
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
            </div>
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6">
            <div className="max-w-4xl">
              <Card className="glass-card-elevated hover-lift interactive-scale">
                <CardHeader>
                  <CardTitle className="gradient-text">API Configuration</CardTitle>
                  <CardDescription>Configure your AI service API keys</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vapi-api-key">Vapi API Key</Label>
                      <Input
                        id="vapi-api-key"
                        type="password"
                        value={profile.vapiApiKey}
                        onChange={(e) => setProfile({...profile, vapiApiKey: e.target.value})}
                        placeholder="Enter your Vapi API key"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Your API key is stored locally and never sent to our servers
                      </p>
                    </div>
                    <Button onClick={handleApiKeySave} className="bg-gradient-primary hover-lift">
                      <Key className="w-4 h-4 mr-2" />
                      Save API Key
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="max-w-4xl">
              <Card className="glass-card-elevated hover-lift interactive-scale">
                <CardHeader>
                  <CardTitle className="gradient-text">Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Notification settings coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="max-w-4xl">
              <Card className="glass-card-elevated hover-lift interactive-scale">
                <CardHeader>
                  <CardTitle className="gradient-text">Privacy & Security</CardTitle>
                  <CardDescription>Manage your privacy settings and account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Privacy settings coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;