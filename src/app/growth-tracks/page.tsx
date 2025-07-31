"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar, 
  CheckCircle,
  Star,
  Rocket,
  Brain,
  Shield,
  Globe,
  Award,
  Zap,
  Clock,
  BarChart3,
  UserCheck,
  MessageCircle,
  BookOpen,
  Lightbulb,
  Building2,
  DollarSign,
  Video,
  FileText,
  Coffee
} from "lucide-react";

const tracks = [
  {
    name: "MVP to Market",
    duration: "12 weeks",
    description: "Take your MVP from concept to paying customers with proven frameworks",
    stage: "Early Stage",
    outcomes: ["Product-Market Fit", "First 100 Users", "Revenue Strategy", "Growth Metrics"],
    curriculum: [
      "Week 1-3: Market Validation & User Research",
      "Week 4-6: Product Optimization & Feedback Loops", 
      "Week 7-9: Go-to-Market Strategy & Launch",
      "Week 10-12: Growth & Scaling Fundamentals"
    ],
    price: "$2,500",
    color: "from-blue-500 to-blue-600",
    icon: Rocket
  },
  {
    name: "Scale & Systems",
    duration: "16 weeks", 
    description: "Build scalable operations, team structures, and growth systems",
    stage: "Growth Stage",
    outcomes: ["Operational Excellence", "Team Scaling", "Process Automation", "Revenue Growth"],
    curriculum: [
      "Week 1-4: Operations & Process Design",
      "Week 5-8: Team Building & Leadership",
      "Week 9-12: Growth Marketing & Sales Systems", 
      "Week 13-16: Financial Management & Fundraising"
    ],
    price: "$4,500",
    color: "from-green-500 to-green-600",
    icon: TrendingUp
  },
  {
    name: "Fundraising Mastery",
    duration: "8 weeks",
    description: "Complete fundraising program from pitch to close",
    stage: "Any Stage",
    outcomes: ["Pitch Deck Mastery", "Investor Network", "Term Sheet Skills", "Due Diligence Ready"],
    curriculum: [
      "Week 1-2: Fundraising Strategy & Story",
      "Week 3-4: Pitch Deck & Financial Models",
      "Week 5-6: Investor Outreach & Meetings",
      "Week 7-8: Negotiations & Closing"
    ],
    price: "$3,500",
    color: "from-purple-500 to-purple-600", 
    icon: DollarSign
  },
  {
    name: "Technical Leadership",
    duration: "10 weeks",
    description: "For non-technical founders building technical products",
    stage: "Any Stage",
    outcomes: ["Technical Fluency", "Team Management", "Architecture Decisions", "Tech Strategy"],
    curriculum: [
      "Week 1-2: Technical Fundamentals & Vocabulary",
      "Week 3-4: Managing Technical Teams",
      "Week 5-6: Product Architecture & Decisions",
      "Week 7-8: Security, Scaling & Infrastructure",
      "Week 9-10: Tech Strategy & Roadmapping"
    ],
    price: "$3,000",
    color: "from-orange-500 to-orange-600",
    icon: Brain
  }
];

const features = [
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "1:1 coaching with successful founders and industry experts"
  },
  {
    icon: Calendar,
    title: "Structured Curriculum", 
    description: "Proven frameworks and step-by-step guidance for each stage"
  },
  {
    icon: MessageCircle,
    title: "Peer Cohorts",
    description: "Learn alongside other founders in similar stages and challenges"
  },
  {
    icon: Video,
    title: "Live Sessions",
    description: "Weekly group calls, workshops, and expert guest speakers"
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description: "Templates, tools, and frameworks used by successful startups"
  },
  {
    icon: Award,
    title: "Accountability",
    description: "Regular check-ins, milestones, and progress tracking"
  }
];

const benefits = [
  {
    title: "Faster Progress",
    description: "Avoid common mistakes and accelerate your growth with proven frameworks",
    stat: "3x faster",
    icon: Zap
  },
  {
    title: "Expert Guidance", 
    description: "Learn from founders who've built and scaled successful companies",
    stat: "50+ mentors",
    icon: Star
  },
  {
    title: "Network Access",
    description: "Connect with fellow founders, investors, and industry experts",
    stat: "500+ network",
    icon: Globe
  },
  {
    title: "Higher Success Rate",
    description: "Founders in our tracks are 4x more likely to reach their next milestone",
    stat: "4x success",
    icon: Target
  }
];

const testimonials = [
  {
    quote: "The MVP to Market track helped us find product-market fit and reach $50K MRR in just 3 months.",
    author: "Sarah Chen",
    role: "CEO, DataFlow",
    company: "Y Combinator W23",
    track: "MVP to Market"
  },
  {
    quote: "Scale & Systems transformed our chaotic startup into a well-oiled machine. We went from 5 to 25 employees seamlessly.",
    author: "Mike Rodriguez", 
    role: "Founder, TechCorp",
    company: "Series A",
    track: "Scale & Systems"
  },
  {
    quote: "The Fundraising Mastery track was instrumental in our $3M seed round. The pitch coaching was game-changing.",
    author: "Lisa Thompson",
    role: "CEO, HealthTech Pro", 
    company: "Techstars '23",
    track: "Fundraising Mastery"
  }
];

export default function GrowthTracksLanding() {
  const { data: session } = useSession();
  
  const getStartedUrl = session ? "/growth-tracks/apply" : "/auth/signup?callbackUrl=" + encodeURIComponent("/waitlist");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-white">
            <TrendingUp className="w-4 h-4" />
            <span>
              <strong>Coming Q3 2025:</strong> Join the waitlist for early access to our structured growth programs.
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-32">
          <Badge variant="secondary" className="mb-6 bg-orange-100 text-orange-700 border-orange-200">
            <TrendingUp className="w-3 h-3 mr-1" />
            Structured Growth Programs
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-12 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              From Idea to
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Scale Success
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-16 leading-relaxed max-w-3xl mx-auto">
            Structured programs designed to take you from MVP to market, early stage to scale, 
            with expert mentorship, proven frameworks, and a supportive founder community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href={getStartedUrl} className="flex items-center gap-2">
                Join Waitlist
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
              <Link href="#tracks">Explore Tracks</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-12 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>50+ Expert Mentors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Launching Q3 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>4 Specialized Tracks</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <IconComponent className="w-8 h-8 text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-2xl font-bold text-slate-900 mb-1">{benefit.stat}</div>
                  <div className="text-sm font-semibold text-slate-700 mb-2">{benefit.title}</div>
                  <div className="text-xs text-slate-600">{benefit.description}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Growth Tracks */}
      <div id="tracks" className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Target className="w-3 h-3 mr-1" />
              Growth Track Programs
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Choose Your Growth Journey
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Each track is designed for specific stages and challenges, with proven curricula and expert mentorship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {tracks.map((track, index) => {
              const IconComponent = track.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-10">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${track.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-xl">{track.name}</h3>
                          <div className="text-right">
                            <div className="text-lg font-bold text-orange-600">{track.price}</div>
                            <div className="text-xs text-slate-500">{track.duration}</div>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">{track.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {track.stage}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm font-semibold text-slate-700 mb-3">Key Outcomes:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {track.outcomes.map((outcome, outcomeIndex) => (
                          <div key={outcomeIndex} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm font-semibold text-slate-700 mb-3">Curriculum Overview:</div>
                      <div className="space-y-1">
                        {track.curriculum.map((week, weekIndex) => (
                          <div key={weekIndex} className="text-xs text-slate-600 pl-3 border-l-2 border-slate-100">
                            {week}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                      Join Waitlist
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-slate-50 to-orange-50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white text-slate-700 border-slate-200">
              <Rocket className="w-3 h-3 mr-1" />
              The Growth Track Experience
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              How Growth Tracks Work
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              A comprehensive approach combining structured learning, expert mentorship, and peer collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">1. Assessment & Matching</h3>
                <p className="text-slate-600 leading-relaxed">
                  Complete our founder assessment to get matched with the right track and mentor based on your stage and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">2. Structured Learning</h3>
                <p className="text-slate-600 leading-relaxed">
                  Follow a proven curriculum with weekly milestones, group sessions, and 1:1 mentor meetings.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">3. Achieve Milestones</h3>
                <p className="text-slate-600 leading-relaxed">
                  Graduate with concrete achievements, ongoing mentor relationships, and a strong founder network.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Star className="w-3 h-3 mr-1" />
              Program Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Everything You Need to Succeed
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Our growth tracks combine the best of education, mentorship, and community support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-orange-50 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-orange-600" />
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

      {/* Testimonials */}
      <div className="bg-gradient-to-br from-slate-50 to-red-50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white text-slate-700 border-slate-200">
              <MessageCircle className="w-3 h-3 mr-1" />
              Success Stories
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Founders Who've Accelerated Their Growth
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              See how other founders have transformed their startups through our structured growth programs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white shadow-lg">
                <CardContent className="p-10">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
                      <div>
                        <div className="font-semibold text-sm">{testimonial.author}</div>
                        <div className="text-xs text-slate-600">{testimonial.role}</div>
                        <div className="text-xs text-slate-500">{testimonial.company}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {testimonial.track}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-32">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">Ready to Accelerate Your Growth?</h3>
          <p className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto">
            Join the waitlist to be among the first founders in our structured growth programs. 
            Expert mentorship and proven frameworks await.
          </p>
          
          <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-8 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-orange-100 mb-3">
              <Rocket className="w-5 h-5" />
              <span className="font-semibold">Early Access Benefits</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-orange-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>20% early bird discount</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Priority mentor matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Exclusive founder community access</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-semibold px-8 py-4">
              <Link href={getStartedUrl} className="flex items-center gap-2">
                Join Waitlist - Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
              <Link href="#tracks">
                Explore Tracks
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
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Flexible Schedule</h3>
              <p className="text-slate-600 text-sm">Programs designed for busy founders with flexible timing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Measurable Results</h3>
              <p className="text-slate-600 text-sm">Clear milestones and progress tracking throughout your journey</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Global Community</h3>
              <p className="text-slate-600 text-sm">Connect with founders from around the world in your cohort</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}