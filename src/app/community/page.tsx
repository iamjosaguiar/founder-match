"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, MessageCircle, Heart, Users, TrendingUp, Lightbulb, Target, Code, Briefcase, Scale, Globe } from "lucide-react";
import Link from "next/link";

type ForumCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  order: number;
  posts: Array<{
    id: string;
    title: string;
    createdAt: string;
    author: {
      name: string;
      profileImage?: string;
    };
    commentsCount: number;
    likesCount: number;
  }>;
  _count: {
    posts: number;
  };
};

type CommunityStats = {
  totalPosts: number;
  totalCategories: number;
  totalMembers: number;
  onlineNow: number;
  recentPosts: number;
};

const categoryIcons = {
  general: MessageCircle,
  introductions: Users,
  'idea-validation': Lightbulb,
  'co-founder-search': Target,
  technical: Code,
  business: Briefcase,
  legal: Scale,
  marketing: TrendingUp,
  global: Globe
};

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [stats, setStats] = useState<CommunityStats>({
    totalPosts: 0,
    totalCategories: 0,
    totalMembers: 0,
    onlineNow: 0,
    recentPosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/community"));
      return;
    }
    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      const [categoriesResponse, statsResponse] = await Promise.all([
        fetch('/api/forum/categories'),
        fetch('/api/forum/stats')
      ]);

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } else if (categoriesResponse.status === 401) {
        router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/community"));
        return;
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while checking authentication or loading data
  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading community...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalPosts}</p>
                    <p className="text-sm text-slate-600">Total Posts</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalCategories}</p>
                    <p className="text-sm text-slate-600">Categories</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalMembers}</p>
                    <p className="text-sm text-slate-600">Members</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.onlineNow}</p>
                    <p className="text-sm text-slate-600">Active Recent</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {filteredCategories.length === 0 ? (
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-4">No categories found</h3>
                <p className="text-slate-600 mb-6">
                  {categories.length === 0 
                    ? "The community is just getting started!" 
                    : "Try adjusting your search criteria."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map((category) => {
              const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || MessageCircle;
              
              return (
                <Card key={category.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <IconComponent 
                            className="w-6 h-6" 
                            style={{ color: category.color }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            <Link 
                              href={`/community/category/${category.slug}`}
                              className="hover:text-purple-600 transition-colors"
                            >
                              {category.name}
                            </Link>
                          </CardTitle>
                          {category.description && (
                            <p className="text-slate-600 mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-slate-50">
                        {category._count.posts} posts
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {category.posts.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-slate-700 mb-3">Recent Posts</h4>
                        {category.posts.map((post) => (
                          <div key={post.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar className="w-8 h-8">
                                {post.author.profileImage ? (
                                  <img src={post.author.profileImage} alt={post.author.name} className="w-full h-full object-cover" />
                                ) : (
                                  <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                                    {post.author.name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <Link 
                                  href={`/community/post/${post.id}`}
                                  className="font-medium text-slate-900 hover:text-purple-600 transition-colors line-clamp-1"
                                >
                                  {post.title}
                                </Link>
                                <p className="text-xs text-slate-500">
                                  by {post.author.name} • {formatTimeAgo(post.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 ml-4">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {post.commentsCount}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {post.likesCount}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="pt-2">
                          <Button variant="outline" size="sm" asChild className="w-full">
                            <Link href={`/community/category/${category.slug}`}>
                              View All Posts in {category.name}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-slate-500 text-sm">No posts yet in this category</p>
                        <Button variant="outline" size="sm" asChild className="mt-2">
                          <Link href={`/community/new?category=${category.id}`}>
                            Start the conversation
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}