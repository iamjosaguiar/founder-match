"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/dashboard-layout";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  Share2, 
  Calendar,
  Eye,
  Send,
  Lightbulb,
  Users,
  Target,
  Code,
  Briefcase,
  Scale,
  TrendingUp,
  Globe
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
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon?: string;
  };
  comments: ForumComment[];
  isLiked?: boolean;
};

type ForumComment = {
  id: string;
  content: string;
  likesCount: number;
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
  isLiked?: boolean;
  replies?: ForumComment[];
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

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const postId = params?.id as string;

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent(`/community/post/${postId}`));
      return;
    }
    if (postId) {
      fetchPost();
    }
  }, [session, status, router, postId]);

  const fetchPost = async () => {
    if (!session || !postId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/forum/posts/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      } else if (response.status === 404) {
        router.push('/community');
      } else if (response.status === 401) {
        router.push("/auth/signup?callbackUrl=" + encodeURIComponent(`/community/post/${postId}`));
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/community');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!session || !post) return;

    try {
      const response = await fetch(`/api/forum/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setPost(prev => prev ? {
          ...prev,
          likesCount: data.likesCount,
          isLiked: data.isLiked
        } : null);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !post || !newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/forum/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setPost(prev => prev ? {
          ...prev,
          comments: [...prev.comments, data.comment],
          commentsCount: prev.commentsCount + 1
        } : null);
        setNewComment("");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading post...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  if (!post) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h1>
          <p className="text-slate-600 mb-6">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
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

  const CategoryIcon = categoryIcons[post.category.slug as keyof typeof categoryIcons] || MessageCircle;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/community" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Community
            </Link>
          </Button>
        </div>

        {/* Post Card */}
        <Card className="border-0 bg-white shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <UserAvatar 
                  size="md"
                  user={{
                    name: post.author.name,
                    email: post.author.email,
                    image: post.author.image,
                    profileImage: post.author.profileImage
                  }}
                />
                <div>
                  <p className="font-semibold text-slate-900">{post.author.name}</p>
                  {post.author.title && (
                    <p className="text-sm text-slate-600">{post.author.title}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1"
                  style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
                >
                  <CategoryIcon className="w-3 h-3" />
                  {post.category.name}
                </Badge>
                {post.isPinned && (
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Pinned
                  </Badge>
                )}
              </div>
            </div>
            
            <CardTitle className="text-2xl text-slate-900 mb-4">{post.title}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="prose max-w-none mb-6">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </div>
            
            {/* Post Stats & Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views} views
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {post.commentsCount} comments
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLikePost}
                  className={post.isLiked ? "bg-red-50 border-red-200 text-red-600" : ""}
                >
                  <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                  {post.likesCount}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-0 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments ({post.commentsCount})
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* New Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex gap-3">
                <UserAvatar 
                  size="sm"
                  user={{
                    name: session.user?.name || "",
                    email: session.user?.email || "",
                    image: session.user?.image
                  }}
                />
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="resize-none mb-3"
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={!newComment.trim() || submittingComment}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            {post.comments.length > 0 ? (
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <UserAvatar 
                      size="sm"
                      user={{
                        name: comment.author.name,
                        email: comment.author.email,
                        image: comment.author.image,
                        profileImage: comment.author.profileImage
                      }}
                    />
                    <div className="flex-1">
                      <div className="bg-slate-50 rounded-lg p-4 mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-slate-900">{comment.author.name}</p>
                            {comment.author.title && (
                              <p className="text-xs text-slate-600">{comment.author.title}</p>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{formatDate(comment.createdAt)}</p>
                        </div>
                        <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-slate-500 h-auto p-1">
                          <Heart className="w-3 h-3 mr-1" />
                          {comment.likesCount}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-500 h-auto p-1">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">No comments yet</p>
                <p className="text-sm text-slate-500">Be the first to share your thoughts!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}