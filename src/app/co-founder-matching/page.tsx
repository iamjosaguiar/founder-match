"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Brain, 
  Users, 
  Zap, 
  Target, 
  TrendingUp, 
  CheckCircle,
  Star,
  Heart,
  Lightbulb,
  Shield,
  Rocket,
  BarChart3,
  UserCheck,
  MessageCircle,
  Clock
} from "lucide-react";

const founderTypes = [
  {
    name: "The Visionary Leader",
    traits: ["High Openness", "High Extraversion", "Strategic Thinking"],
    description: "Natural leaders who see the big picture and inspire others to follow their vision.",
    complementary: "The Systematic Builder",
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "The Systematic Builder",
    traits: ["High Conscientiousness", "Detail-Oriented", "Process-Driven"],
    description: "Methodical executors who turn ideas into reality through structured planning.",
    complementary: "The Visionary Leader",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "The People Connector",
    traits: ["High Agreeableness", "High Extraversion", "Relationship-Focused"],
    description: "Natural networkers who excel at building relationships and team cohesion.",
    complementary: "The Technical Innovator",
    color: "from-green-500 to-green-600"
  },
  {
    name: "The Technical Innovator",
    traits: ["High Openness", "Problem-Solving", "Deep Technical Skills"],
    description: "Technical experts who love solving complex problems and building products.",
    complementary: "The People Connector",
    color: "from-orange-500 to-orange-600"
  },
  {
    name: "The Resilient Optimizer",
    traits: ["Low Neuroticism", "High Adaptability", "Stress Management"],
    description: "Calm under pressure, great at navigating uncertainty and optimizing operations.",
    complementary: "The Creative Disruptor",
    color: "from-teal-500 to-teal-600"
  },
  {
    name: "The Creative Disruptor",
    traits: ["High Openness", "Risk-Tolerant", "Innovation-Focused"],
    description: "Creative thinkers who challenge status quo and drive breakthrough innovations.",
    complementary: "The Resilient Optimizer",
    color: "from-pink-500 to-pink-600"
  },
  {
    name: "The Balanced Integrator",
    traits: ["Moderate All Traits", "Adaptive", "Versatile"],
    description: "Well-rounded founders who can wear multiple hats and bridge different perspectives.",
    complementary: "Any specialized type",
    color: "from-indigo-500 to-indigo-600"
  }
];

const personalityTraits = [
  {
    name: "Openness",
    description: "Creativity, curiosity, and willingness to try new approaches",
    icon: Lightbulb,
    color: "text-yellow-600"
  },
  {
    name: "Conscientiousness", 
    description: "Organization, discipline, and attention to detail",
    icon: CheckCircle,
    color: "text-green-600"
  },
  {
    name: "Extraversion",
    description: "Energy from social interaction and comfort with leadership",
    icon: Users,
    color: "text-blue-600"
  },
  {
    name: "Agreeableness",
    description: "Cooperation, trust, and consideration for others",
    icon: Heart,
    color: "text-red-600"
  },
  {
    name: "Emotional Stability",
    description: "Resilience under pressure and emotional regulation",
    icon: Shield,
    color: "text-purple-600"
  },
  {
    name: "Risk Tolerance",
    description: "Comfort with uncertainty and calculated risk-taking",
    icon: TrendingUp,
    color: "text-orange-600"
  }
];

export default function CoFounderMatchingLanding() {
  const { data: session } = useSession();
  
  const getStartedUrl = session ? "/founder-matching/discover" : "/auth/signup?callbackUrl=" + encodeURIComponent("/founder-matching/discover");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-32">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
            <Brain className="w-3 h-3 mr-1" />
            AI-Powered Personality Matching
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-12 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Find Your Perfect
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Co-Founder Match
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-16 leading-relaxed max-w-3xl mx-auto">
            Don&apos;t leave your most important business decision to chance. Our science-backed personality 
            matching system finds co-founders who truly complement your strengths and working style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href={getStartedUrl} className="flex items-center gap-2">
                Get Matched Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
              <Link href="#how-it-works">Learn How It Works</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-12 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>2,500+ Successful Matches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Science-Backed Algorithm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>7 Founder Types</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-24">
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">94%</div>
              <div className="text-sm text-slate-600">Match Success Rate</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-1">12</div>
              <div className="text-sm text-slate-600">Question Assessment</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-1">7</div>
              <div className="text-sm text-slate-600">Founder Types</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-1">3min</div>
              <div className="text-sm text-slate-600">Average Assessment</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Rocket className="w-3 h-3 mr-1" />
              The Science Behind Matching
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              How Our Personality Matching Works
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Our algorithm combines the Big Five personality model with startup-specific traits to create the most accurate co-founder matching system available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-24">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">1. Complete Assessment</h3>
                <p className="text-slate-600 leading-relaxed">
                  Take our 3-minute, 12-question personality assessment based on validated psychological research and startup-specific scenarios.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/30">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">2. Get Your Type</h3>
                <p className="text-slate-600 leading-relaxed">
                  Receive your detailed founder personality type from our 7 scientifically-backed classifications with strengths and working style analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/30">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">3. Find Matches</h3>
                <p className="text-slate-600 leading-relaxed">
                  Browse curated matches based on complementary skills, shared values, and compatible working styles for maximum startup success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white text-slate-700 border-slate-200">
              <BarChart3 className="w-3 h-3 mr-1" />
              Big Five + Startup Traits
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              The 6 Key Personality Dimensions
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              We measure these scientifically-validated traits to understand your unique founder profile and find your perfect complement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {personalityTraits.map((trait, index) => {
              const IconComponent = trait.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-6 h-6 ${trait.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{trait.name}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{trait.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Founder Types */}
      <div className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Star className="w-3 h-3 mr-1" />
              7 Founder Personality Types
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Which Founder Type Are You?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Based on your personality assessment, you&apos;ll be classified as one of these seven distinct founder types, each with unique strengths and ideal co-founder matches.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {founderTypes.map((type, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{type.name}</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{type.description}</p>
                  <div className="space-y-2 mb-4">
                    {type.traits.map((trait, traitIndex) => (
                      <Badge key={traitIndex} variant="outline" className="text-xs mr-1">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Best match:</strong> {type.complementary}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-32">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Ready to Find Your Co-Founder?</h3>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join thousands of founders who&apos;ve found their perfect business partner through our science-backed matching system.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-4">
              <Link href={getStartedUrl} className="flex items-center gap-2">
                Start Free Assessment
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
              <Link href="#how-it-works">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-slate-50 py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Quick & Easy</h3>
              <p className="text-slate-600 text-sm">Complete assessment in under 3 minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Science-Backed</h3>
              <p className="text-slate-600 text-sm">Based on validated psychological research</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Direct Connect</h3>
              <p className="text-slate-600 text-sm">Message matches directly through our platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}