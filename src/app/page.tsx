"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Users, Brain, Rocket, Target, TrendingUp, Code, Briefcase, Lightbulb, Shield, Star, CheckCircle, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

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
          <Badge variant="secondary" className="mb-6 bg-blue-50 text-blue-700 border-blue-200">
            <Target className="w-3 h-3 mr-1" />
            For Founders Building Alone
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-12 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
              Stop Building Your Startup
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent">
              In Isolation.
            </span>
          </h1>
          
          <div className="text-xl text-slate-700 mb-16 leading-relaxed max-w-4xl mx-auto space-y-4">
            <p className="font-medium">Most founders burn out not from building<br />but from building everything alone.</p>
            
            <div className="text-lg text-slate-600 space-y-2">
              <p>The wrong co-founder wastes 18 months.</p>
              <p>Unreliable freelancers kill momentum.</p>
              <p>No peer network means no perspective.</p>
            </div>
            
            <p className="font-semibold text-slate-800 pt-4">Elite founders solve this systematically.<br />They build networks before they need them.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="/auth/signup" className="flex items-center gap-2">
                Build Your Network
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-400 hover:bg-slate-50 text-slate-700">
              <Link href="#how-it-works">See How</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-12 text-sm text-slate-600 mb-24">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>500+ Connected Founders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Pre-Vetted Network</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Systematic Matching</span>
            </div>
          </div>
        </div>

        {/* Core Services */}
        <motion.div 
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUpVariants}
        >
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Rocket className="w-3 h-3 mr-1" />
              Core Founder Platforms
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Build Your Founder Network
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Three systematic approaches to end startup isolation
            </p>
          </div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Co-Founder Matching */}
            <motion.div variants={fadeInUpVariants}>
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
                  Skip 18 months of wrong partnerships. Get systematically matched with co-founders who complement your gaps.
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
            </motion.div>

            {/* Execution Network */}
            <motion.div variants={fadeInUpVariants}>
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
                  Stop wasting time on unreliable freelancers. Access pre-vetted talent that understands startup urgency.
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
            </motion.div>

            {/* Community */}
            <motion.div variants={fadeInUpVariants}>
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
                  Get perspective from founders who&apos;ve solved your exact problems. No more building in a feedback vacuum.
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
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Target Audience */}
        <motion.div 
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 mb-32 border border-slate-200/50 shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUpVariants}
        >
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
        </motion.div>

        {/* How It Works */}
        <motion.div 
          className="mb-32" 
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUpVariants}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              How Elite Founders Build Networks
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              The systematic approach to ending startup isolation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mx-auto mb-8 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform shadow-xl">
                1
              </div>
              <h3 className="text-xl font-bold mb-6 group-hover:text-blue-600 transition-colors">Identify Your Gaps</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">Map what you&apos;re missing—technical skills, business expertise, or industry connections. Get matched accordingly.</p>
              <Button asChild variant="outline" size="sm" className="border-blue-300 !text-blue-600 hover:bg-blue-50 hover:!text-blue-700">
                <Link href="/co-founder-matching">Start Matching</Link>
              </Button>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full mx-auto mb-8 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform shadow-xl">
                2
              </div>
              <h3 className="text-xl font-bold mb-6 group-hover:text-purple-600 transition-colors">Access Execution Talent</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">Connect with developers and designers who understand startup timelines. No more project delays from unreliable freelancers.</p>
              <Button asChild variant="outline" size="sm" className="border-purple-300 !text-purple-600 hover:bg-purple-50 hover:!text-purple-700">
                <Link href="/execution-network">Find Talent</Link>
              </Button>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mx-auto mb-8 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform shadow-xl">
                3
              </div>
              <h3 className="text-xl font-bold mb-6 group-hover:text-emerald-600 transition-colors">Build Peer Network</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">Get strategic perspective from founders solving similar problems. End the isolation of building alone.</p>
              <Button asChild variant="outline" size="sm" className="border-emerald-300 !text-emerald-600 hover:bg-emerald-50 hover:!text-emerald-700">
                <Link href="/community-hub">Join Now</Link>
              </Button>
            </div>
          </div>
        </motion.div>


        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUpVariants}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-16 text-white">
            <h3 className="text-3xl font-bold mb-4">Stop Building in Isolation</h3>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join the founders who solved startup loneliness systematically
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-4">
                <Link href="/auth/signup" className="flex items-center gap-2">
                  Build Your Network
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white !text-white bg-white/10 hover:bg-white hover:!text-blue-600 hover:border-white px-8 py-4">
                <Link href="/co-founder-matching">
                  Find Co-Founders
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}