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
      <div className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-6xl mx-auto mb-32">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            Your Startup's Ultimate Sidekick
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-12 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Don't Go It Alone.
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CoLaunch It.
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-16 leading-relaxed max-w-4xl mx-auto">
            Find your perfect co-founder, access vetted execution talent, and connect with a thriving founder community. 
            Everything you need to turn your idea into reality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="/auth/signup" className="flex items-center gap-2">
                Start Your CoLaunch
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
              <Link href="/co-founder-matching">Find Co-Founders</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-12 text-sm text-slate-500 mb-24">
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
        <div className="mb-32">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Rocket className="w-3 h-3 mr-1" />
              Core Founder Platforms
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Your Complete Founder Toolkit
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Three essential platforms to accelerate your startup journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Co-Founder Matching */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm lg:scale-105">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  Co-Founder Matching
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-8 pb-8">
                <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                  AI-powered personality matching to find your perfect co-founder based on skills, values, and working style.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Personality assessment & matching
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Skills & experience verification
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Compatibility scoring
                  </div>
                </div>
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                  <Link href="/co-founder-matching">
                    Find Co-Founders
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Execution Network */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm lg:scale-105">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Code className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                  Execution Network
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-8 pb-8">
                <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                  Connect with vetted developers, designers, and marketers. Get your MVP built fast and affordably.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Pre-vetted service providers
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Transparent pricing & timelines
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Project management support
                  </div>
                </div>
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600">
                  <Link href="/execution-network">
                    Find Providers
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-sm lg:scale-105">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  Community Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-8 pb-8">
                <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                  Connect with fellow founders, share insights, get feedback, and learn from the community's collective wisdom.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Founder networking events
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Peer feedback & support
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Knowledge sharing
                  </div>
                </div>
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  <Link href="/community-hub">
                    Join Community
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 mb-32 border border-slate-200/50 shadow-xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Target className="w-3 h-3 mr-1" />
              Built For Founders Like You
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Who We Serve
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
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
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Your Path to Success
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Three simple steps to build your dream team and accelerate your startup
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mx-auto mb-8 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform shadow-xl">
                1
              </div>
              <h3 className="text-xl font-bold mb-6 group-hover:text-blue-600 transition-colors">Find Your Co-Founder</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">Take our personality assessment and get matched with co-founders who complement your skills and share your vision.</p>
              <Button asChild variant="outline" size="sm" className="group-hover:border-blue-300">
                <Link href="/co-founder-matching">Start Matching</Link>
              </Button>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full mx-auto mb-8 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform shadow-xl">
                2
              </div>
              <h3 className="text-xl font-bold mb-6 group-hover:text-purple-600 transition-colors">Build Your MVP</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">Post your project and connect with pre-vetted developers, designers, and marketers ready to bring your idea to life.</p>
              <Button asChild variant="outline" size="sm" className="group-hover:border-purple-300">
                <Link href="/execution-network">Find Talent</Link>
              </Button>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mx-auto mb-8 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform shadow-xl">
                3
              </div>
              <h3 className="text-xl font-bold mb-6 group-hover:text-emerald-600 transition-colors">Join the Community</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">Connect with fellow founders, share progress, get feedback, and learn from others on the same journey.</p>
              <Button asChild variant="outline" size="sm" className="group-hover:border-emerald-300">
                <Link href="/community-hub">Join Now</Link>
              </Button>
            </div>
          </div>
        </div>


        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-16 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to CoLaunch Your Startup?</h3>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join hundreds of founders who've accelerated their journey with expert support
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-4">
                <Link href="/auth/signup" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
                <Link href="/co-founder-matching">
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