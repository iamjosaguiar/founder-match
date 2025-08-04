import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "The Complete Guide to Finding Your Perfect Co-Founder",
      excerpt: "Discover the key strategies and red flags to look for when searching for a business partner who will help take your startup to the next level.",
      author: "Sarah Chen",
      date: "December 15, 2024",
      category: "Co-Founder Matching",
      readTime: "8 min read",
      featured: true
    },
    {
      id: 2,
      title: "How AI is Revolutionizing Founder-Market Fit",
      excerpt: "Learn how artificial intelligence is helping entrepreneurs better understand their target market and optimize their business strategies.",
      author: "Marcus Rodriguez", 
      date: "December 10, 2024",
      category: "AI & Technology",
      readTime: "6 min read",
      featured: false
    },
    {
      id: 3,
      title: "Building a Remote-First Startup: Lessons from 50+ Founders",
      excerpt: "Insights and best practices from successful remote startups, including tools, culture, and communication strategies that actually work.",
      author: "Emily Johnson",
      date: "December 5, 2024", 
      category: "Remote Work",
      readTime: "10 min read",
      featured: false
    },
    {
      id: 4,
      title: "The Psychology of Co-Founder Compatibility",
      excerpt: "Understanding personality types, working styles, and communication patterns that make or break co-founder relationships.",
      author: "Dr. Alex Kim",
      date: "November 28, 2024",
      category: "Psychology",
      readTime: "12 min read",
      featured: false
    },
    {
      id: 5,
      title: "From Idea to MVP: A 30-Day Sprint Framework",
      excerpt: "A proven methodology for rapidly validating and building your minimum viable product, used by hundreds of successful startups.",
      author: "Mike Thompson",
      date: "November 20, 2024",
      category: "Product Development", 
      readTime: "9 min read",
      featured: false
    },
    {
      id: 6,
      title: "Equity Splits: How to Divide Ownership Fairly",
      excerpt: "Navigate one of the most difficult conversations in startup founding with frameworks and real-world examples from successful partnerships.",
      author: "Lisa Park",
      date: "November 15, 2024",
      category: "Legal & Finance",
      readTime: "7 min read",
      featured: false
    }
  ];

  const categories = ["All", "Co-Founder Matching", "AI & Technology", "Remote Work", "Psychology", "Product Development", "Legal & Finance"];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">CoFoundr Blog</h1>
          <p className="text-slate-600 text-lg">
            Insights, guides, and stories from the world of entrepreneurship
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge 
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-50"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {posts.filter(post => post.featured).map((post) => (
          <Card key={post.id} className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <Badge className="mb-4 bg-blue-600">Featured</Badge>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{post.title}</h2>
              <p className="text-slate-700 mb-6 text-lg leading-relaxed">{post.excerpt}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <Badge variant="outline">{post.category}</Badge>
                  <span>{post.readTime}</span>
                </div>
                
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Regular Posts */}
        <div className="grid md:grid-cols-2 gap-6">
          {posts.filter(post => !post.featured).map((post) => (
            <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="text-sm text-slate-500">{post.readTime}</span>
                </div>
                <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4 leading-relaxed">{post.excerpt}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12">
          <Card className="bg-slate-900 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Get the latest insights on entrepreneurship, co-founder matching, and startup building 
                delivered to your inbox every week.
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg text-slate-900"
                />
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                No spam, unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}