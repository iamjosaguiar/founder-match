"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, Settings, DollarSign, Clock, MapPin, Star, 
  FileText, TrendingUp, Users, CheckCircle 
} from "lucide-react";
import Link from "next/link";

type ServiceProviderProfile = {
  id: string;
  name: string;
  title: string;
  bio: string;
  location?: string;
  serviceTypes: string[];
  skills: string[];
  experience: string;
  hourlyRate: number;
  availability: string;
  remoteOk: boolean;
  portfolio: any[];
  profileImage?: string;
};

export default function ServiceProviderDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ServiceProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchProfile();
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        
        // Set profile regardless of role - we'll show different dashboards
        // No redirect needed - we'll show appropriate content based on role
        
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Loading dashboard...</h2>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
            <Button asChild>
              <Link href="/execution-network/join">Complete Setup</Link>
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const formatRate = (rate: number) => `$${rate}/hour`;
  
  const formatAvailability = (availability: string) => {
    const map: Record<string, string> = {
      immediate: "Available immediately",
      within_week: "Available within a week", 
      within_month: "Available within a month",
      flexible: "Flexible scheduling"
    };
    return map[availability] || availability;
  };

  const formatExperience = (exp: string) => {
    const map: Record<string, string> = {
      "entry-level": "Entry Level",
      "intermediate": "Intermediate", 
      "senior": "Senior",
      "expert": "Expert"
    };
    return map[exp] || exp;
  };

  const isServiceProvider = profile?.roles?.includes('service_provider');
  const isFounder = !isServiceProvider; // Default to founder if not service provider

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {isServiceProvider ? "Service Provider Dashboard" : "Execution Network Dashboard"}
              </h1>
              <p className="text-slate-600">
                {isServiceProvider ? "Manage your execution network profile" : "Manage your projects and find expert providers"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
              <Button variant="outline" asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {isFounder ? (
          // Founder Dashboard Content
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Post New Project</h3>
                  <p className="text-slate-600 text-sm mb-4">Get expert help for your startup</p>
                  <Button asChild className="w-full">
                    <Link href="/execution-network/projects/new">Post Project</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Find Providers</h3>
                  <p className="text-slate-600 text-sm mb-4">Browse vetted service providers</p>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/execution-network/providers">Browse Providers</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">My Projects</h3>
                  <p className="text-slate-600 text-sm mb-4">Manage your active projects</p>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/execution-network/projects">View Projects</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Welcome to Execution Network!</p>
                      <p className="text-xs text-slate-500">Start by posting your first project or browsing providers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Service Provider Dashboard Content
          <div className="space-y-8">
            {/* Profile Overview */}
            <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                      {profile.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                  <p className="text-lg text-slate-600">{profile.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatRate(profile.hourlyRate)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-slate-700 leading-relaxed mb-4">{profile.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.serviceTypes.map((service) => (
                    <Badge key={service} className="bg-purple-100 text-purple-700 border-purple-200 capitalize">
                      {service.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">0</div>
              <p className="text-sm text-slate-500">No active projects yet</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">$0</div>
              <p className="text-sm text-slate-500">Start taking projects</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">-</div>
              <p className="text-sm text-slate-500">No ratings yet</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold text-green-600">{formatAvailability(profile.availability)}</div>
              <p className="text-sm text-slate-500">Current status</p>
            </CardContent>
          </Card>
        </div>

        {/* Skills & Experience */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Experience Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {formatExperience(profile.experience)}
              </Badge>
              <p className="text-sm text-slate-500 mt-2">
                {profile.remoteOk ? "Open to remote work" : "In-person only"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="border-0 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg">
          <CardHeader>
            <CardTitle>🚀 Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-600">
                Welcome to the CoLaunchr Execution Network! Here's how to get started:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">1. Complete Your Profile</h4>
                  <p className="text-sm text-slate-600">
                    Add portfolio items and showcase your best work to attract founders.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">2. Browse Projects</h4>
                  <p className="text-sm text-slate-600">
                    Look for projects that match your skills and interests.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">3. Submit Proposals</h4>
                  <p className="text-sm text-slate-600">
                    Write compelling proposals explaining how you can help.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">4. Deliver Excellence</h4>
                  <p className="text-sm text-slate-600">
                    Build great relationships and earn stellar reviews.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button asChild>
                  <Link href="/execution-network/projects">
                    Browse Projects
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/profile">
                    Complete Profile
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}