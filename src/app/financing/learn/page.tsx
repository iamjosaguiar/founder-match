"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { FinancingDisclaimer } from "@/components/financing-disclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Clock,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  Play,
  Download,
  Star,
  Users,
  FileText,
  Video,
  Calculator,
  CheckCircle,
  Filter,
  Calendar
} from "lucide-react";

// Sample data - would come from API in real implementation
const sampleContent = [
  {
    id: "1",
    title: "Fundraising Basics: A Complete Guide for First-Time Founders",
    slug: "fundraising-basics",
    excerpt: "Learn the fundamentals of raising capital, from understanding different funding types to preparing your first pitch deck.",
    category: "fundraising",
    difficulty: "beginner",
    readTime: 12,
    type: "guide",
    featured: true,
    published: true,
    author: "Sarah Chen",
    updatedAt: "2024-01-15",
    tags: ["Fundraising", "Basics", "Pitch Deck", "Investors"],
    views: 2340,
    rating: 4.8,
    completions: 456
  },
  {
    id: "2", 
    title: "Startup Valuation Methods: Pre-Money vs Post-Money",
    slug: "valuation-methods",
    excerpt: "Understand how startups are valued, different valuation methodologies, and how to negotiate fair terms with investors.",
    category: "valuation",
    difficulty: "intermediate",
    readTime: 18,
    type: "guide",
    featured: true,
    published: true,
    author: "Michael Rodriguez",
    updatedAt: "2024-01-10",
    tags: ["Valuation", "Term Sheets", "Equity", "Negotiations"],
    views: 1890,
    rating: 4.9,
    completions: 234
  },
  {
    id: "3",
    title: "Building the Perfect Pitch Deck: 2024 Template & Examples",
    slug: "pitch-deck-guide",
    excerpt: "A comprehensive guide to creating investor pitch decks that get meetings, with real examples and downloadable templates.",
    category: "pitching",
    difficulty: "beginner",
    readTime: 25,
    type: "template",
    featured: false,
    published: true,
    author: "Lisa Thompson",
    updatedAt: "2024-01-08",
    tags: ["Pitch Deck", "Templates", "Presentation", "Storytelling"],
    views: 3120,
    rating: 4.7,
    completions: 678
  },
  {
    id: "4",
    title: "Due Diligence Checklist: What Investors Really Look For",
    slug: "due-diligence-checklist",
    excerpt: "Prepare for investor due diligence with this comprehensive checklist covering financials, legal, and operational requirements.",
    category: "legal",
    difficulty: "advanced",
    readTime: 15,
    type: "checklist",
    featured: false,
    published: true,
    author: "James Park",
    updatedAt: "2024-01-05",
    tags: ["Due Diligence", "Legal", "Compliance", "Documentation"],
    views: 1560,
    rating: 4.6,
    completions: 189
  },
  {
    id: "5",
    title: "Term Sheet Negotiation Masterclass (Video Series)",
    slug: "term-sheet-negotiation",
    excerpt: "A 5-part video series covering everything from understanding term sheets to negotiating favorable terms for your startup.",
    category: "legal",
    difficulty: "advanced",
    readTime: 120, // 2 hours total
    type: "video",
    featured: true,
    published: true,
    author: "Alex Kumar",
    updatedAt: "2024-01-12",
    tags: ["Term Sheets", "Negotiation", "Legal", "Video Course"],
    views: 892,
    rating: 4.9,
    completions: 67
  },
  {
    id: "6",
    title: "SaaS Metrics Calculator & Benchmarking Tool",
    slug: "saas-metrics-calculator",
    excerpt: "Interactive calculator for key SaaS metrics (ARR, CAC, LTV, Churn) with industry benchmarks and investor expectations.",
    category: "metrics",
    difficulty: "intermediate",
    readTime: 5,
    type: "tool",
    featured: false,
    published: true,
    author: "CoLaunchr Team",
    updatedAt: "2024-01-03",
    tags: ["SaaS", "Metrics", "Calculator", "Benchmarks"],
    views: 4230,
    rating: 4.8,
    completions: 1234
  }
];

const categoryOptions = ["All Categories", "fundraising", "valuation", "pitching", "legal", "metrics"];
const difficultyOptions = ["All Levels", "beginner", "intermediate", "advanced"];
const typeOptions = ["All Types", "guide", "template", "video", "tool", "checklist"];

const categoryLabels = {
  fundraising: "Fundraising",
  valuation: "Valuation", 
  pitching: "Pitching",
  legal: "Legal & Terms",
  metrics: "Metrics & Analytics"
};

const difficultyColors = {
  beginner: "bg-green-50 text-green-700 border-green-200",
  intermediate: "bg-blue-50 text-blue-700 border-blue-200", 
  advanced: "bg-purple-50 text-purple-700 border-purple-200"
};

const typeIcons = {
  guide: BookOpen,
  template: Download,
  video: Video,
  tool: Calculator,
  checklist: CheckCircle
};

export default function LearningHubPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [selectedType, setSelectedType] = useState("All Types");
  const [content, setContent] = useState(sampleContent);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/financing/learn"));
      return;
    }
  }, [session, status, router]);

  // Filter content based on search and filters
  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All Levels" || item.difficulty === selectedDifficulty;
    const matchesType = selectedType === "All Types" || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
  });

  const featuredContent = filteredContent.filter(item => item.featured);
  const regularContent = filteredContent.filter(item => !item.featured);

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading learning resources...</p>
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/financing" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Financing Hub
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Hub</h1>
          <p className="text-slate-600">Comprehensive guides, tools, and resources for startup fundraising</p>
        </div>

        {/* Legal Disclaimer */}
        <FinancingDisclaimer variant="info" className="mb-6" />

        {/* Search and Filters */}
        <Card className="border-0 bg-white shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search guides, tools, and resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category}>
                    {category === "All Categories" ? category : categoryLabels[category as keyof typeof categoryLabels] || category}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                {difficultyOptions.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === "All Levels" ? difficulty : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                {typeOptions.map(type => (
                  <option key={type} value={type}>
                    {type === "All Types" ? type : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                {filteredContent.length} resources found
              </p>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Sort by: Most Popular</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-900">42</div>
              <div className="text-sm text-blue-700">Total Resources</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-900">8.2k</div>
              <div className="text-sm text-green-700">Total Views</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-900">1.5k</div>
              <div className="text-sm text-purple-700">Completions</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-900">4.8</div>
              <div className="text-sm text-orange-700">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Content */}
        {featuredContent.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Resources
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredContent.map((item) => {
                const TypeIcon = typeIcons[item.type as keyof typeof typeIcons] || BookOpen;
                return (
                  <Card key={item.id} className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <TypeIcon className="w-5 h-5 text-white" />
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            ⭐ Featured
                          </Badge>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={difficultyColors[item.difficulty as keyof typeof difficultyColors]}
                        >
                          {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{item.excerpt}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-white/50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.readTime}min {item.type === 'video' ? 'watch' : 'read'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {item.completions}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {item.rating}
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        {item.type === 'video' ? 'Watch Now' : 
                         item.type === 'tool' ? 'Use Tool' :
                         item.type === 'template' ? 'Download' : 'Read Guide'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">All Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularContent.map((item) => {
              const TypeIcon = typeIcons[item.type as keyof typeof typeIcons] || BookOpen;
              return (
                <Card key={item.id} className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <TypeIcon className="w-5 h-5 text-slate-600" />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={difficultyColors[item.difficulty as keyof typeof difficultyColors]}
                      >
                        {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">{item.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.readTime}min
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {item.rating}
                        </div>
                      </div>
                      <div className="text-slate-400">
                        by {item.author}
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      {item.type === 'video' ? 'Watch' : 
                       item.type === 'tool' ? 'Use Tool' :
                       item.type === 'template' ? 'Download' : 'Read'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <Card className="border-0 bg-white shadow-lg">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No resources found</h3>
              <p className="text-slate-500 mb-6">
                Try adjusting your search terms or filters to find more learning resources.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
                setSelectedDifficulty("All Levels");
                setSelectedType("All Types");
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}