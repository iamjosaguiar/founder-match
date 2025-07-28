import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Users, Zap, Target, TrendingUp, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FounderMatch
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-20">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Founder Matching
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Find Your Perfect
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Co-Founder
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Connect with like-minded entrepreneurs through science-backed personality matching. 
            Build the next big thing with founders who complement your strengths and share your vision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="/auth/signup" className="flex items-center gap-2">
                Start Matching
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>500+ Active Founders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>12-Question Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>7 Founder Types</span>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-10 mb-20 border border-slate-200/50 shadow-xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Brain className="w-3 h-3 mr-1" />
              Science-Backed Matching
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              How Our Personality Matching Works
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Our proprietary algorithm uses validated psychological research to find your ideal co-founder match
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="group">
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-3 flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-slate-800">Big Five Personality Assessment</h3>
                    <p className="text-slate-600 leading-relaxed">Complete our scientifically-validated 12-question assessment covering Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability - plus founder-specific Risk Tolerance.</p>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-3 flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-slate-800">Founder Type Classification</h3>
                    <p className="text-slate-600 leading-relaxed">Get classified as one of 7 distinct founder types: Visionary Leader, Strategic Builder, People Leader, Innovator, Executor, Operational Leader, or Balanced Founder.</p>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-3 flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-slate-800">Smart Compatibility Matching</h3>
                    <p className="text-slate-600 leading-relaxed">Our algorithm matches you based on complementary leadership styles, communication preferences, work styles, and risk profiles for optimal co-founder synergy.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200/50">
              <h4 className="font-bold text-xl mb-6 text-center text-slate-800">7 Founder Types</h4>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200/50 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-blue-800 group-hover:text-blue-900 transition-colors">Visionary Leader</div>
                      <div className="text-xs text-blue-600 mt-0.5">High vision + risk tolerance</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200/50 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-green-800 group-hover:text-green-900 transition-colors">Strategic Builder</div>
                      <div className="text-xs text-green-600 mt-0.5">Innovation + execution</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200/50 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-purple-800 group-hover:text-purple-900 transition-colors">People Leader</div>
                      <div className="text-xs text-purple-600 mt-0.5">Team + collaboration</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200/50 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-orange-800 group-hover:text-orange-900 transition-colors">Executor</div>
                      <div className="text-xs text-orange-600 mt-0.5">Discipline + stability</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200/50 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-red-800 group-hover:text-red-900 transition-colors">Innovator</div>
                      <div className="text-xs text-red-600 mt-0.5">Creative + experimental</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200/50 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-indigo-800 group-hover:text-indigo-900 transition-colors">Operational Leader</div>
                      <div className="text-xs text-indigo-600 mt-0.5">Process + efficiency</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200/50 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-teal-800 group-hover:text-teal-900 transition-colors">Balanced Founder</div>
                      <div className="text-xs text-teal-600 mt-0.5">Versatile + adaptable</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Science-Based Matching
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 leading-relaxed">
                Our algorithm uses validated Big Five personality assessment to match complementary founder personalities and working styles.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/30 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-green-600 transition-colors">
                Complete Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 leading-relaxed">
                Showcase your skills, experience, projects, and what you&apos;re looking for in a co-founder with rich profile pages.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                Smart Discovery
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 leading-relaxed">
                Swipe through potential co-founders, see compatibility scores, and start conversations with mutual matches.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Find Your Co-Founder?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of entrepreneurs who&apos;ve found their perfect founding partner through our platform
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-4">
              <Link href="/auth/signup" className="flex items-center gap-2">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
