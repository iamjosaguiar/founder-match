"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import UserAvatar from "@/components/user-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
  Eye,
  Heart,
  Share2,
  MoreHorizontal,
  Send,
  Image as ImageIcon,
  Smile
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

type FeedPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  isLocked: boolean;
  isLiked: boolean;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
    profileImage?: string;
    title?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon?: string;
  };
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
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/dashboard"));
      return;
    }
    fetchDashboardData();
    fetchFeedPosts();
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

  const fetchFeedPosts = async () => {
    if (!session) {
      setFeedLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/dashboard/feed?limit=10');
      if (response.ok) {
        const data = await response.json();
        setFeedPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching feed posts:', error);
    } finally {
      setFeedLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setFeedPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, isLiked: data.isLiked, likesCount: data.likesCount }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return postDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const handleDirectPost = async () => {
    if (!newPostContent.trim() || isPosting) return;

    setIsPosting(true);
    try {
      // Get the "General" category ID first
      const categoriesResponse = await fetch('/api/forum/categories');
      let generalCategoryId = '';
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        const generalCategory = categoriesData.find((cat: any) => cat.slug === 'general');
        generalCategoryId = generalCategory?.id || '';
      }

      // Create the post
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPostContent.length > 50 
            ? newPostContent.substring(0, 50).trim() + '...' 
            : newPostContent.trim(),
          content: newPostContent.trim(),
          categoryId: generalCategoryId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add the new post to the feed
        const newPost: FeedPost = {
          id: result.post.id,
          title: result.post.title,
          content: result.post.content,
          createdAt: result.post.createdAt,
          updatedAt: result.post.updatedAt,
          views: 0,
          likesCount: 0,
          commentsCount: 0,
          isPinned: false,
          isLocked: false,
          isLiked: false,
          author: {
            id: session?.user?.id || '',
            name: session?.user?.name || '',
            email: session?.user?.email || '',
            image: session?.user?.image,
            title: result.post.author?.title
          },
          category: result.post.category
        };

        setFeedPosts(prev => [newPost, ...prev]);
        setNewPostContent("");
        
        // Update stats
        setStats(prev => ({
          ...prev,
          communityPosts: prev.communityPosts + 1,
          totalConnections: prev.totalConnections + 1
        }));
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Post creation error:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
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
            Here&apos;s what&apos;s happening with your startup journey
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

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Post Composer */}
              <Card className="border-0 bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <UserAvatar 
                      size="md"
                      user={{
                        name: session?.user?.name || "",
                        email: session?.user?.email || "",
                        image: session?.user?.image
                      }}
                    />
                    <div className="flex-1">
                      <Textarea
                        placeholder="What's on your mind? Share an update, ask a question, or start a discussion..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && newPostContent.trim()) {
                            e.preventDefault();
                            handleDirectPost();
                          }
                        }}
                        className="border-0 resize-none text-lg placeholder:text-slate-500 focus:ring-0 p-0"
                        rows={3}
                      />
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Photo
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                            <Smile className="w-4 h-4 mr-2" />
                            Feeling
                          </Button>
                          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                            General
                          </Badge>
                          <span className="text-xs text-slate-400">Cmd+Enter to post</span>
                        </div>
                        <Button 
                          onClick={handleDirectPost}
                          disabled={!newPostContent.trim() || isPosting}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {isPosting ? "Posting..." : "Post"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Feed */}
              <div className="space-y-6">
                {feedLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading feed...</p>
                  </div>
                ) : feedPosts.length > 0 ? (
                  feedPosts.map((post) => (
                    <Card key={post.id} className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <UserAvatar 
                            size="md"
                            user={{
                              name: post.author.name,
                              email: post.author.email,
                              image: post.author.image,
                              profileImage: post.author.profileImage
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-900">{post.author.name}</p>
                                {post.author.title && (
                                  <p className="text-sm text-slate-600">{post.author.title}</p>
                                )}
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <span>{formatTimeAgo(post.createdAt)}</span>
                                  <span>•</span>
                                  <Badge 
                                    variant="secondary" 
                                    className="text-xs"
                                    style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
                                  >
                                    {post.category.name}
                                  </Badge>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <Link href={`/community/post/${post.id}`}>
                            <h3 className="font-semibold text-lg text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {truncateContent(post.content)}
                          </p>
                          {post.content.length > 200 && (
                            <Link 
                              href={`/community/post/${post.id}`}
                              className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                            >
                              Read more
                            </Link>
                          )}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-6 text-sm text-slate-500">
                            <span>{post.views} views</span>
                            <span>{post.commentsCount} comments</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikePost(post.id)}
                              className={post.isLiked ? "text-red-600 hover:text-red-700" : "text-slate-500 hover:text-slate-700"}
                            >
                              <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                              {post.likesCount}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Comment
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                              <Share2 className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-0 bg-white shadow-lg">
                    <CardContent className="p-12 text-center">
                      <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts yet</h3>
                      <p className="text-slate-600 mb-6">Be the first to share something with the community!</p>
                      <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        <Link href="/community/new">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Post
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
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
                  <Link href="/founder-matching">
                    <Users className="w-4 h-4 mr-2" />
                    Find Co-founders
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Your Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.slice(0, 3).map((activity) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className={`p-1.5 rounded-lg ${getActivityColor(activity.type)}`}>
                            <IconComponent className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-slate-900 truncate">{activity.title}</h4>
                            <p className="text-xs text-slate-600 truncate">{activity.description}</p>
                            <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-0 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">💡 Founder Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 mb-4">
                  Engage with the community by liking and commenting on posts to build meaningful connections.
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