"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/dashboard-layout";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  Eye, 
  Calendar,
  Plus,
  Search,
  TrendingUp,
  Users,
  Lightbulb,
  Target,
  Code,
  Briefcase,
  Scale,
  Globe,
  Pin
} from "lucide-react";
import Link from "next/link";

type ForumPost = {
  id: string;
  title: string;
  content: string;
  slug: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
    profileImage?: string;
    title?: string;
  };
};

type ForumCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  postsCount?: number;
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

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent');

  const categorySlug = params?.slug as string;

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent(`/community/category/${categorySlug}`));
      return;
    }
    if (categorySlug) {
      fetchCategoryData();
    }
  }, [session, status, router, categorySlug, sortBy]);

  const fetchCategoryData = async () => {
    if (!session || !categorySlug) {
      setLoading(false);
      return;
    }

    try {
      // Fetch category info and posts
      const [categoryResponse, postsResponse] = await Promise.all([
        fetch(`/api/forum/categories/${categorySlug}`),
        fetch(`/api/forum/categories/${categorySlug}/posts?sort=${sortBy}`)
      ]);

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setCategory(categoryData.category);
      } else if (categoryResponse.status === 404) {
        router.push('/community');
        return;
      }

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData.posts || []);
      }

    } catch (error) {
      console.error('Error fetching category data:', error);
      router.push('/community');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    searchQuery === "" || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading category...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  if (!category) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Category Not Found</h1>
          <p className="text-slate-600 mb-6">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/community">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Community
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const CategoryIcon = categoryIcons[category.slug as keyof typeof categoryIcons] || MessageCircle;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/community" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Community
            </Link>
          </Button>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <CategoryIcon 
                className="w-8 h-8" 
                style={{ color: category.color }}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
              {category.description && (
                <p className="text-slate-600 text-lg mt-1">{category.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span>{filteredPosts.length} posts</span>
              </div>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Link href={`/community/new?category=${category.id}`}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search posts in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              Recent
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('popular')}
            >
              Popular
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('oldest')}
            >
              Oldest
            </Button>
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="border-0 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <UserAvatar 
                      size="md"
                      user={{
                        name: post.author.name,
                        email: post.author.email,
                        image: post.author.image,
                        profileImage: post.author.profileImage
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {post.isPinned && (
                              <Pin className="w-4 h-4 text-orange-500" />
                            )}
                            <Link 
                              href={`/community/post/${post.id}`}
                              className="font-semibold text-lg text-slate-900 hover:text-blue-600 transition-colors"
                            >
                              {post.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <span className="font-medium">{post.author.name}</span>
                            {post.author.title && (
                              <>
                                <span>•</span>
                                <span>{post.author.title}</span>
                              </>
                            )}
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(post.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {truncateContent(post.content)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likesCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.commentsCount}</span>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/community/post/${post.id}`}>
                            Read More
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-12 border-0 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">
              {searchQuery ? 'No posts found' : 'No posts yet'}
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? `No posts match "${searchQuery}" in this category.` 
                : `Be the first to start a discussion in ${category.name}!`
              }
            </p>
            {!searchQuery && (
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Link href={`/community/new?category=${category.id}`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Link>
              </Button>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}