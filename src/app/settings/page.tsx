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
import BusinessSelector from "@/components/business/business-selector";
import BusinessForm from "@/components/business/business-form";
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
  Upload,
  Building2,
  Plus,
  Settings as SettingsIcon
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/settings"));
      return;
    }
    setLoading(false);
    loadBusinesses();
  }, [session, status, router]);

  const loadBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses');
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses || []);
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoadingBusinesses(false);
    }
  };

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
      const errorData = await response.json();
      console.error('Avatar upload failed:', errorData);
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to upload avatar`);
    }
    const data = await response.json();
    console.log('Avatar uploaded successfully:', data);
    return data.avatarUrl;
  };

  const handleSave = async () => {
    if (!avatarFile) return;
    
    setUploading(true);
    try {
      const avatarUrl = await uploadAvatar(avatarFile);
      
      // Update profile with new avatar (send only necessary fields)
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: session?.user?.name || '',
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
        const errorData = await response.json();
        console.error('Profile update failed:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update profile`);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert(`Failed to update profile photo: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const handleBusinessSave = async (businessData: any) => {
    try {
      const url = editingBusiness ? `/api/businesses/${editingBusiness.id}` : '/api/businesses';
      const method = editingBusiness ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData)
      });

      if (response.ok) {
        await loadBusinesses();
        setShowBusinessForm(false);
        setEditingBusiness(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving business:', error);
      alert('Failed to save business. Please try again.');
    }
  };

  const handleEditBusiness = (business: any) => {
    setEditingBusiness(business);
    setShowBusinessForm(true);
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;

    try {
      const response = await fetch(`/api/businesses/${businessId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadBusinesses();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business. Please try again.');
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

            {/* Business Management */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Business Management
                  </div>
                  <Button
                    onClick={() => {
                      setEditingBusiness(null);
                      setShowBusinessForm(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Business
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showBusinessForm ? (
                  <BusinessForm
                    business={editingBusiness}
                    onSave={handleBusinessSave}
                    onCancel={() => {
                      setShowBusinessForm(false);
                      setEditingBusiness(null);
                    }}
                  />
                ) : loadingBusinesses ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-slate-600">Loading businesses...</p>
                  </div>
                ) : businesses.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No businesses yet</h3>
                    <p className="text-slate-600 mb-4">Add your first business to get personalized AI assistance</p>
                    <Button
                      onClick={() => setShowBusinessForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Business
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {businesses.map((business) => (
                      <div key={business.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{business.name}</h3>
                            <p className="text-sm text-slate-600">
                              {business.businessType} • {business.industry} • {business.stage}
                            </p>
                            {business.location && (
                              <p className="text-sm text-slate-500">{business.location}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBusiness(business)}
                            >
                              <SettingsIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBusiness(business.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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