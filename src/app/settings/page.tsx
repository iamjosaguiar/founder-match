"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  Link as LinkIcon,
  Bell,
  Shield,
  Palette,
  Save,
  Camera,
  Upload
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/settings"));
      return;
    }
    setLoading(false);
  }, [session, status, router]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to upload avatar");
    }
    const data = await response.json();
    return data.avatarUrl;
  };

  const handleSave = async () => {
    if (!avatarFile) return;
    
    setUploading(true);
    try {
      const avatarUrl = await uploadAvatar(avatarFile);
      
      // Update profile with new avatar
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: session?.user?.name || '',
          title: '',
          bio: '',
          skills: '',
          experience: '',
          lookingFor: '',
          projectLinks: '',
          avatar: avatarUrl,
          profileImage: avatarUrl
        }),
      });

      if (response.ok) {
        setAvatarFile(null);
        setAvatarPreview('');
        alert('Profile photo updated successfully!');
        // Force page reload to update avatar everywhere
        window.location.reload();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to update profile photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account and CoLaunchr preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative mb-4 inline-block">
                  {avatarPreview ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <UserAvatar size="xl" className="mx-auto" />
                  )}
                  
                  {/* Camera overlay button */}
                  <label className="absolute bottom-0 right-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Camera className="w-4 h-4" />
                    </div>
                  </label>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  {session.user?.name || 'User'}
                </h3>
                <p className="text-slate-600 text-sm mb-4">{session.user?.email}</p>
                
                <div className="space-y-2">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    Founder
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    Community Member
                  </Badge>
                </div>

                {avatarFile && (
                  <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 mb-4">
                    <Upload className="w-4 h-4" />
                    New photo selected: {avatarFile.name}
                  </div>
                )}
                
                {avatarFile ? (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview('');
                      }}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                      onClick={handleSave}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Photo
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mt-4">
                    Click the camera icon to change your profile photo
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input defaultValue={session.user?.name?.split(' ')[0] || ''} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input defaultValue={session.user?.name?.split(' ')[1] || ''} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" defaultValue={session.user?.email || ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Professional Title</label>
                  <Input placeholder="e.g., Founder & CEO" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input placeholder="e.g., San Francisco, CA" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea 
                    placeholder="Tell other founders about yourself and your startup journey..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Startup Information */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Startup Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input placeholder="Your startup name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl">
                      <option value="">Select industry</option>
                      <option value="fintech">Fintech</option>
                      <option value="healthtech">HealthTech</option>
                      <option value="edtech">EdTech</option>
                      <option value="saas">SaaS</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stage</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl">
                      <option value="">Select stage</option>
                      <option value="idea">Idea</option>
                      <option value="mvp">MVP</option>
                      <option value="early-revenue">Early Revenue</option>
                      <option value="scaling">Scaling</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <Input type="url" placeholder="https://your-startup.com" />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New co-founder matches</h4>
                    <p className="text-sm text-slate-600">Get notified when someone likes your profile</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Project proposals</h4>
                    <p className="text-sm text-slate-600">Get notified about new proposals on your projects</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Community activity</h4>
                    <p className="text-sm text-slate-600">Get notified about replies to your posts and comments</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>

            {/* Note about profile updates */}
            <Card className="border-0 bg-blue-50 shadow-lg">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-blue-700">
                  💡 Profile information and other settings can be updated from the full profile page.
                  <br />
                  <Link href="/profile" className="underline hover:text-blue-800 transition-colors">
                    Go to Profile Page
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}