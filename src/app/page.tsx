"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Users, Brain, Rocket, Target, TrendingUp, Code, Briefcase, Lightbulb, Shield, Star, CheckCircle, MessageCircle } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  const getExecutionNetworkUrl = (path: string) => {
    return session ? path : `/auth/signup?callbackUrl=${encodeURIComponent(path)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-6xl mx-auto mb-20">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            Your Startup's Ultimate Sidekick
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Don't Go It Alone.
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CoLaunch It.
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-4xl mx-auto">
            From idea to execution, CoLaunchr connects you with expert co-founders, advisory pods, 
            and execution teams. Get the support you need to build, launch, and scale—without breaking the bank.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="/auth/signup" className="flex items-center gap-2">
                Start Your CoLaunch
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
              <Link href="/founder-matching">Find Co-Founders</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500 mb-16">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>500+ Founders Served</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Expert Network</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>AI-Powered Matching</span>
            </div>
          </div>
        </div>

        {/* Core Services */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Rocket className="w-3 h-3 mr-1" />
              Complete Startup Ecosystem
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Everything You Need to Launch
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Access world-class expertise across every aspect of building your startup
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-5 gap-6">
            {/* Founder Matching */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  Co-Founder Matching
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 leading-relaxed mb-4">
                  AI-powered personality matching to find your perfect co-founder based on skills, values, and working style.
                </p>
                <Button asChild variant="outline" size="sm" className="group-hover:bg-blue-50 group-hover:border-blue-300">
                  <Link href="/founder-matching">
                    Explore Matching
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* CoLaunch Pods */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/30 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-green-600 transition-colors">
                  CoLaunch Pods
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 leading-relaxed mb-4">
                  Curated advisory pods with experts in marketing, tech, legal, and finance. Your dream team on-demand.
                </p>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>

            {/* Execution Network */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                  Execution Network
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 leading-relaxed mb-4">
                  Vetted technical teams, designers, and marketers. Build MVPs, run campaigns, and execute fast.
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="group-hover:bg-purple-50 group-hover:border-purple-300">
                      <Link href={getExecutionNetworkUrl("/execution-network/join")}>
                        Join Network
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="group-hover:bg-purple-50 group-hover:border-purple-300">
                      <Link href={getExecutionNetworkUrl("/execution-network/providers")}>
                        Find Providers
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <Button asChild variant="outline" size="sm" className="group-hover:bg-purple-50 group-hover:border-purple-300 w-full">
                    <Link href={getExecutionNetworkUrl("/execution-network/projects/new")}>
                      Post Project
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 leading-relaxed mb-4">
                  Connect with fellow founders, share insights, and learn from the community's collective wisdom.
                </p>
                <Button asChild variant="outline" size="sm" className="group-hover:bg-emerald-50 group-hover:border-emerald-300">
                  <Link href={getExecutionNetworkUrl("/community")}>
                    Join Discussion
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Growth Tracks */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50/30 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                  Growth Tracks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 leading-relaxed mb-4">
                  Structured programs from MVP to market. 1:1 coaching, group mentorship, and accountability.
                </p>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-10 mb-24 border border-slate-200/50 shadow-xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Target className="w-3 h-3 mr-1" />
              Built For Founders Like You
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Who We Serve
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Solo Founders</h3>
              <p className="text-slate-600 text-sm">Big ideas but limited network? We connect you with the right people.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Technical Builders</h3>
              <p className="text-slate-600 text-sm">Great at building? Get business, marketing, and operations support.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Business Leaders</h3>
              <p className="text-slate-600 text-sm">Have the strategy? Find technical talent and development teams.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Tier 2/3 Markets</h3>
              <p className="text-slate-600 text-sm">Priced out of top-tier agencies? Get world-class help at fair prices.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              How CoLaunchr Works
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Simple, flexible, and designed to get you moving fast
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Tell Us What You Need</h3>
              <p className="text-slate-600">Complete our smart intake to understand your goals, challenges, and ideal support structure.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Get Matched</h3>
              <p className="text-slate-600">Our AI connects you with perfectly suited co-founders, advisors, or execution teams.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Launch & Scale</h3>
              <p className="text-slate-600">Execute with confidence knowing you have the right team and ongoing support.</p>
            </div>
          </div>
        </div>


        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to CoLaunch Your Startup?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of founders who've accelerated their journey with expert support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-4">
                <Link href="/auth/signup" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
                <Link href="/founder-matching">
                  Find Co-Founders
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}