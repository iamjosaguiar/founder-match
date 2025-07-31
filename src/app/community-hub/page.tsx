"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  MessageCircle, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  Heart, 
  CheckCircle,
  Star,
  Rocket,
  Brain,
  Target,
  Globe,
  Coffee,
  BookOpen,
  Award,
  Zap,
  Shield,
  UserPlus,
  Calendar,
  Search,
  Filter
} from "lucide-react";

const communityCategories = [
  {
    name: "Founder Stories",
    icon: Heart,
    description: "Real experiences from founders at every stage of their journey",
    topics: ["Success Stories", "Failure Lessons", "Pivots", "Exit Stories", "First-time Founder"],
    posts: "2.3k",
    color: "from-red-500 to-red-600"
  },
  {
    name: "Technical Discussions",
    icon: Brain,
    description: "Deep dives into product development, architecture, and technology choices",
    topics: ["Tech Stack", "Architecture", "Security", "Scaling", "DevOps"],
    posts: "1.8k",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Business Strategy",
    icon: Target,
    description: "Strategies for growth, market entry, competitive analysis, and operations",
    topics: ["Go-to-Market", "Pricing", "Competition", "Operations", "Partnerships"],
    posts: "1.5k",
    color: "from-green-500 to-green-600"
  },
  {
    name: "Fundraising",
    icon: TrendingUp,
    description: "Everything about raising capital, from pitch decks to term sheets",
    topics: ["Pitch Decks", "Investor Relations", "Term Sheets", "Valuation", "Due Diligence"],
    posts: "1.2k",
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Product Development",
    icon: Rocket,
    description: "Building products users love, from MVP to scale",
    topics: ["MVP Strategy", "User Research", "Product-Market Fit", "Feature Planning", "Launch Strategy"],
    posts: "1.6k",
    color: "from-orange-500 to-orange-600"
  },
  {
    name: "Marketing & Growth",
    icon: Zap,
    description: "Proven strategies for customer acquisition and sustainable growth",
    topics: ["Customer Acquisition", "Content Marketing", "SEO", "Paid Ads", "Growth Hacking"],
    posts: "1.4k",
    color: "from-pink-500 to-pink-600"
  }
];

const features = [
  {
    icon: Users,
    title: "Expert Community",
    description: "Connect with successful founders, investors, and industry experts"
  },
  {
    icon: MessageCircle,
    title: "Quality Discussions",
    description: "Moderated discussions focused on actionable insights and learning"
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description: "Searchable archive of founder wisdom, templates, and resources"
  },
  {
    icon: Calendar,
    title: "Virtual Events",
    description: "Regular AMAs, workshops, and networking sessions with industry leaders"
  },
  {
    icon: Award,
    title: "Recognition System",
    description: "Earn reputation points for helpful contributions and expertise sharing"
  },
  {
    icon: Shield,
    title: "Safe Environment",
    description: "Verified members only with strict community guidelines and moderation"
  }
];

const stats = [
  { number: "5.2k", label: "Active Founders", icon: Users },
  { number: "850+", label: "Expert Contributors", icon: Star },
  { number: "12k+", label: "Knowledge Posts", icon: MessageCircle },
  { number: "89%", label: "Problem Resolution", icon: CheckCircle }
];

const recentTopics = [
  {
    title: "How to validate your SaaS idea before building?",
    author: "Sarah Chen",
    role: "Serial Entrepreneur",
    replies: 23,
    category: "Product Development",
    timeAgo: "2 hours ago"
  },
  {
    title: "Mistakes I made in my first funding round",
    author: "Mike Rodriguez",
    role: "3x Founder",
    replies: 45,
    category: "Fundraising",
    timeAgo: "4 hours ago"
  },
  {
    title: "Building a technical team without technical background",
    author: "Lisa Thompson",
    role: "Non-technical Founder",
    replies: 31,
    category: "Technical Discussions",
    timeAgo: "6 hours ago"
  }
];

export default function CommunityHubLanding() {
  const { data: session } = useSession();
  
  const getStartedUrl = session ? "/community" : "/auth/signup?callbackUrl=" + encodeURIComponent("/community");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-32">
          <Badge variant="secondary" className="mb-6 bg-green-100 text-green-700 border-green-200">
            <MessageCircle className="w-3 h-3 mr-1" />
            Founder Community Hub
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-12 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Learn From
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Founder Wisdom
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-16 leading-relaxed max-w-3xl mx-auto">
            Join thousands of founders sharing real experiences, solving problems together, and building 
            the next generation of successful startups. Get answers, share knowledge, and grow your network.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href={getStartedUrl} className="flex items-center gap-2">
                Join Community
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
              <Link href="#categories">Explore Categories</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-12 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>5.2k Active Founders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>850+ Expert Contributors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>12k+ Knowledge Posts</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <IconComponent className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Community Categories */}
      <div id="categories" className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <BookOpen className="w-3 h-3 mr-1" />
              Discussion Categories
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Every Founder Challenge Covered
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              From technical architecture to fundraising strategy, find focused discussions on every aspect of building a startup.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-8">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      <Badge variant="outline" className="text-xs text-green-700 bg-green-50">
                        {category.posts} posts
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{category.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {category.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Discussions */}
      <div className="bg-gradient-to-br from-slate-50 to-green-50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white text-slate-700 border-slate-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending Discussions
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Recent Community Highlights
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              See what founders are discussing right now and join the conversation on topics that matter.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {recentTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                        <span className="text-xs text-slate-500">{topic.timeAgo}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 hover:text-green-600 cursor-pointer">
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full"></div>
                          <span>{topic.author}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{topic.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{topic.replies}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href={getStartedUrl}>View All Discussions</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Star className="w-3 h-3 mr-1" />
              Community Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              More Than Just Discussion
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Our community platform is designed specifically for founders with features that drive real learning and connection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-green-50 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Our Community Values
              </h2>
              <p className="text-slate-600 text-lg">
                We maintain a high-quality environment focused on learning, sharing, and mutual support.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border-0 bg-white shadow-lg">
                <CardContent className="p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <h3 className="text-xl font-bold">What We Encourage</h3>
                  </div>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Sharing real experiences and lessons learned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Asking specific, actionable questions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Providing helpful, constructive feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Building authentic professional relationships</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-lg">
                <CardContent className="p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold">Quality Standards</h3>
                  </div>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Verified founder status required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>No spam, self-promotion, or sales pitches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Respectful, professional communication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Focus on educational and actionable content</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-32">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Join the Conversation</h3>
          <p className="text-xl text-green-100 mb-12 max-w-3xl mx-auto">
            Connect with thousands of founders who are building, learning, and succeeding together. 
            Your next breakthrough insight is one conversation away.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50 hover:text-green-700 font-semibold px-8 py-4">
              <Link href={getStartedUrl} className="flex items-center gap-2">
                Join Community Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
              <Link href="#categories">
                Browse Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Features */}
      <div className="bg-slate-50 py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Onboarding</h3>
              <p className="text-slate-600 text-sm">Simple verification process to maintain community quality</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Smart Search</h3>
              <p className="text-slate-600 text-sm">Find exactly what you need from our knowledge base</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Global Network</h3>
              <p className="text-slate-600 text-sm">Connect with founders from every industry and geography</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}