"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageCircle, Users, Lightbulb, Target, Code, Briefcase, Scale, TrendingUp, Globe } from "lucide-react";
import Link from "next/link";

type PostData = {
  title: string;
  content: string;
  categoryId: string;
};

type ForumCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
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

function NewPostForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PostData>({
    defaultValues: {
      categoryId: searchParams.get('category') || ''
    }
  });

  // Register categoryId for form validation
  useEffect(() => {
    register('categoryId', { required: 'Please select a category' });
  }, [register]);

  const selectedCategoryId = watch('categoryId');
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/community/new"));
      return;
    }
    fetchCategories();
  }, [session, status, router]);

  const fetchCategories = async () => {
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/forum/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else if (response.status === 401) {
        router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/community/new"));
        return;
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PostData) => {
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/community/new"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/community/post/${result.post.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Post creation error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </Card>
      </div>
    );
  }

  // Don't render the form if not authenticated (redirect will happen)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/community" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Community
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Create New Post
            </h1>
            <p className="text-slate-600">Share your thoughts with the CoLaunchr community</p>
          </div>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">New Community Post</CardTitle>
            <p className="text-center text-slate-600">
              Connect with fellow founders and share your insights
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Category Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Category</h3>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {categories.map((category) => {
                    const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || MessageCircle;
                    const isSelected = selectedCategoryId === category.id;
                    
                    return (
                      <div
                        key={category.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-purple-300 bg-purple-50' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setValue("categoryId", category.id, { shouldValidate: true })}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500' : 'bg-slate-100'}`}
                            style={isSelected ? {} : { backgroundColor: `${category.color}20` }}
                          >
                            <IconComponent 
                              className={`w-5 h-5 ${isSelected ? 'text-white' : ''}`}
                              style={isSelected ? {} : { color: category.color }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{category.name}</h4>
                            {category.description && (
                              <p className="text-sm text-slate-600">{category.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.categoryId && <p className="text-red-500 text-sm">Please select a category</p>}
              </div>

              {/* Post Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Post Title *
                </label>
                <Input
                  id="title"
                  {...register("title", { required: "Post title is required" })}
                  placeholder="What's your post about?"
                  className="text-lg"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              {/* Post Content */}
              <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium">
                  Post Content *
                </label>
                <Textarea
                  id="content"
                  {...register("content", { required: "Post content is required" })}
                  placeholder="Share your thoughts, ask questions, or start a discussion..."
                  rows={12}
                  className="resize-none"
                />
                {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
              </div>

              {/* Category Preview */}
              {selectedCategory && (
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-semibold text-sm text-slate-700 mb-2">Posting to:</h4>
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${selectedCategory.color}20` }}
                    >
                      {(() => {
                        const IconComponent = categoryIcons[selectedCategory.slug as keyof typeof categoryIcons] || MessageCircle;
                        return <IconComponent className="w-4 h-4" style={{ color: selectedCategory.color }} />;
                      })()}
                    </div>
                    <div>
                      <p className="font-medium">{selectedCategory.name}</p>
                      {selectedCategory.description && (
                        <p className="text-sm text-slate-600">{selectedCategory.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-center pt-6 border-t">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting || !selectedCategoryId}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8"
                >
                  {isSubmitting ? "Creating Post..." : "Create Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </Card>
      </div>
    }>
      <NewPostForm />
    </Suspense>
  );
}