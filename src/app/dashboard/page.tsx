"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Code, 
  MessageCircle, 
  TrendingUp, 
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  Plus,
  Eye
} from "lucide-react";
import Link from "next/link";

type DashboardStats = {
  founderMatches: number;
  executionProjects: number;
  communityPosts: number;
  totalConnections: number;
};

type RecentActivity = {
  id: string;
  type: 'match' | 'project' | 'post' | 'comment';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    founderMatches: 0,
    executionProjects: 0,
    communityPosts: 0,
    totalConnections: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/dashboard"));
      return;
    }
    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      // Fetch real stats from APIs
      const [matchesResponse, projectsResponse, postsResponse] = await Promise.all([
        fetch('/api/matches').catch(() => ({ ok: false })),
        fetch('/api/projects/my').catch(() => ({ ok: false })),
        fetch('/api/community/posts/my').catch(() => ({ ok: false }))
      ]);

      let founderMatches = 0;
      let executionProjects = 0;
      let communityPosts = 0;
      const recentActivities: RecentActivity[] = [];

      // Get matches count
      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json();
        founderMatches = matchesData.matches?.length || 0;
        
        // Add recent match activities
        if (matchesData.matches?.length > 0) {
          matchesData.matches.slice(0, 2).forEach((match: any) => {
            recentActivities.push({
              id: match.id,
              type: 'match',
              title: 'New co-founder match',
              description: `Matched with ${match.user?.name || 'another founder'}`,
              timestamp: new Date(match.matchedAt).toLocaleDateString(),
              status: 'active'
            });
          });
        }
      }

      // Get projects count (fallback for now since API may not exist)
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        executionProjects = projectsData.projects?.length || 0;
      }

      // Get community posts count (fallback for now since API may not exist)
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        communityPosts = postsData.posts?.length || 0;
      }

      setStats({
        founderMatches,
        executionProjects,
        communityPosts,
        totalConnections: founderMatches + executionProjects + communityPosts
      });

      // If no real activity, show empty state
      setRecentActivity(recentActivities);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty stats on error
      setStats({
        founderMatches: 0,
        executionProjects: 0,
        communityPosts: 0,
        totalConnections: 0
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'match': return Users;
      case 'project': return Code;
      case 'post': return MessageCircle;
      case 'comment': return MessageCircle;
      default: return CheckCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'match': return 'text-blue-500 bg-blue-50';
      case 'project': return 'text-purple-500 bg-purple-50';
      case 'post': return 'text-emerald-500 bg-emerald-50';
      case 'comment': return 'text-emerald-500 bg-emerald-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading your dashboard...</p>
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
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {session.user?.name?.split(' ')[0] || 'Founder'}! 👋
          </h1>
          <p className="text-slate-600 text-lg">
            Here's what's happening with your startup journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-700">{stats.founderMatches}</p>
                  <p className="text-sm text-blue-600">Co-founder Matches</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm" className="w-full border-blue-200 hover:bg-blue-50">
                  <Link href="/founder-matching">
                    View Matches
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-700">{stats.executionProjects}</p>
                  <p className="text-sm text-purple-600">Active Projects</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm" className="w-full border-purple-200 hover:bg-purple-50">
                  <Link href="/execution-network/projects">
                    View Projects
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{stats.communityPosts}</p>
                  <p className="text-sm text-emerald-600">Community Posts</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <MessageCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm" className="w-full border-emerald-200 hover:bg-emerald-50">
                  <Link href="/community">
                    Visit Community
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-700">{stats.totalConnections}</p>
                  <p className="text-sm text-orange-600">Total Connections</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm" className="w-full border-orange-200 hover:bg-orange-50">
                  <Link href="/settings">
                    View Profile
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                          <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-slate-900">{activity.title}</h4>
                              {activity.status && (
                                <Badge variant="outline" className="text-xs">
                                  {activity.status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-slate-500 mt-2">{activity.timestamp}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No recent activity</p>
                    <p className="text-sm text-slate-500">Start connecting with the community!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="border-0 bg-white shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Link href="/community/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/execution-network/projects/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Project
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/execution-network/projects">
                    <Eye className="w-4 h-4 mr-2" />
                    Browse Projects
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/founder-matching">
                    <Users className="w-4 h-4 mr-2" />
                    Browse Co-founders
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-0 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">💡 Founder Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 mb-4">
                  Complete your profile to get better co-founder matches and attract top service providers.
                </p>
                <Button asChild size="sm" variant="outline" className="border-orange-200 hover:bg-orange-50">
                  <Link href="/settings">
                    Update Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}