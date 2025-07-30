"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Search, 
  Plus,
  Eye,
  Heart,
  MapPin,
  Calendar,
  AlertTriangle,
  Info
} from "lucide-react";

export default function FinancingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/financing"));
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Financing Hub</h1>
          <p className="text-slate-600">Connect with investors, mentors, and funding opportunities</p>
        </div>

        {/* Legal Disclaimer */}
        <Card className="border-0 bg-amber-50 shadow-sm mb-8">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">Information Only Platform</p>
                <p className="text-amber-700">
                  This platform facilitates networking and information sharing only. We do not provide investment advice, 
                  facilitate transactions, or handle any investments. All interactions and decisions are between users directly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Showcase Company</h3>
              <p className="text-blue-700 text-sm mb-4">Share your company story and connect with supporters</p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/financing/showcase/create">
                  Create Showcase
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Browse Companies</h3>
              <p className="text-green-700 text-sm mb-4">Discover innovative startups seeking support</p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/financing/browse">
                  Browse Startups
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">Investor Network</h3>
              <p className="text-purple-700 text-sm mb-4">Connect with investors and mentors</p>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/financing/investors">
                  Find Investors
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-900 mb-2">Learning Hub</h3>
              <p className="text-orange-700 text-sm mb-4">Guides, resources, and best practices</p>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                <Link href="/financing/learn">
                  Start Learning
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search companies, investors, or resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-lg bg-white/80 backdrop-blur-sm border-slate-200"
          />
        </div>

        {/* Featured Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Companies */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Featured Companies
                </CardTitle>
                <Button variant="ghost" asChild>
                  <Link href="/financing/browse">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sample Company Cards */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">TechStart Inc.</h3>
                          <p className="text-sm text-slate-600">AI-powered analytics platform</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Growth Stage
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Revolutionary AI platform helping businesses make data-driven decisions faster than ever before.
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          San Francisco
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          1.2k views
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Platform Stats */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Platform Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Active Companies</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Investors & Mentors</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Connections Made</span>
                  <span className="font-semibold">324</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Success Stories</span>
                  <span className="font-semibold">27</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Resources */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/financing/learn/fundraising-basics" className="block p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <h4 className="font-medium text-sm">Fundraising Basics</h4>
                  <p className="text-xs text-slate-600">Essential guide for first-time founders</p>
                </Link>
                <Link href="/financing/learn/pitch-deck-guide" className="block p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <h4 className="font-medium text-sm">Pitch Deck Guide</h4>
                  <p className="text-xs text-slate-600">Create compelling investor presentations</p>
                </Link>
                <Link href="/financing/learn/valuation-methods" className="block p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <h4 className="font-medium text-sm">Valuation Methods</h4>
                  <p className="text-xs text-slate-600">Understanding startup valuations</p>
                </Link>
              </CardContent>
            </Card>

            {/* Success Story Highlight */}
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-800">Success Story</span>
                </div>
                <h3 className="font-semibold text-green-900 mb-2">DataFlow Analytics</h3>
                <p className="text-sm text-green-700 mb-3">
                  Connected with 3 mentors and 2 strategic partners through our platform, leading to successful seed round.
                </p>
                <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  Read Story
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}