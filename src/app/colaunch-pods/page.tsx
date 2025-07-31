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
  Target, 
  TrendingUp, 
  CheckCircle,
  Star,
  Rocket,
  Shield,
  Globe,
  Award,
  Zap,
  Clock,
  Calendar,
  MessageCircle,
  BookOpen,
  Lightbulb,
  Building2,
  DollarSign,
  BarChart3,
  UserCheck,
  Coffee,
  Video
} from "lucide-react";

const podTypes = [
  {
    name: "Technical Advisory Pod",
    icon: Brain,
    description: "CTO-level guidance for architecture, security, and scaling decisions",
    experts: ["Former CTOs", "Tech Leads", "Security Experts", "DevOps Specialists"],
    duration: "3-6 months",
    commitment: "2-4 hours/week",
    price: "$2,500/month",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Go-to-Market Pod",
    icon: Target,
    description: "Strategic guidance for product positioning, pricing, and market entry",
    experts: ["Marketing VPs", "Growth Experts", "Sales Leaders", "Brand Strategists"],
    duration: "2-4 months",
    commitment: "3-5 hours/week",
    price: "$2,200/month",
    color: "from-green-500 to-green-600"
  },
  {
    name: "Fundraising Pod",
    icon: TrendingUp,
    description: "End-to-end support for raising capital from pitch to close",
    experts: ["Former VCs", "Investment Bankers", "Serial Founders", "Legal Advisors"],
    duration: "4-8 months",
    commitment: "4-6 hours/week",
    price: "$3,500/month",
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Operations Pod",
    icon: Building2,
    description: "Operational excellence for scaling teams, processes, and systems",
    experts: ["COOs", "HR Leaders", "Process Experts", "Finance Leaders"],
    duration: "3-12 months",
    commitment: "2-4 hours/week",
    price: "$2,000/month",
    color: "from-orange-500 to-orange-600"
  }
];

const features = [
  {
    icon: Users,
    title: "Curated Expert Teams",
    description: "Hand-picked advisors with proven track records in their domains"
  },
  {
    icon: Calendar,
    title: "Structured Programs",
    description: "Goal-oriented sprints with clear milestones and deliverables"
  },
  {
    icon: Video,
    title: "Weekly Sessions",
    description: "Regular video calls, workshops, and one-on-one mentoring"
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description: "Access to templates, frameworks, and tools used by experts"
  },
  {
    icon: MessageCircle,
    title: "Slack Community",
    description: "Private channels for ongoing communication and peer learning"
  },
  {
    icon: Award,
    title: "Success Tracking",
    description: "Clear metrics and progress tracking for accountability"
  }
];

const benefits = [
  {
    title: "Faster Decision Making",
    description: "Get expert validation on critical decisions in days, not months",
    stat: "70% faster",
    icon: Clock
  },
  {
    title: "Higher Success Rate",
    description: "Startups with advisory pods are 3x more likely to reach next milestone",
    stat: "3x success",
    icon: TrendingUp
  },
  {
    title: "Cost Effective",
    description: "Access C-level expertise at a fraction of full-time hire cost",
    stat: "90% savings",
    icon: DollarSign
  },
  {
    title: "Network Access",
    description: "Tap into advisors' networks for partnerships, hiring, and funding",
    stat: "500+ connections",
    icon: Globe
  }
];

const testimonials = [
  {
    quote: "The Technical Advisory Pod helped us avoid costly architecture mistakes and scale to 10M users.",
    author: "Sarah Chen",
    role: "CEO, TechFlow",
    company: "Y Combinator S22"
  },
  {
    quote: "Our Go-to-Market Pod guided us from $0 to $1M ARR in 8 months with the right positioning strategy.", 
    author: "Mike Rodriguez",
    role: "Founder, GrowthLabs",
    company: "Techstars '23"
  },
  {
    quote: "The Fundraising Pod was instrumental in our $5M Series A. They know exactly what investors want.",
    author: "Lisa Thompson",
    role: "CEO, HealthTech Pro",
    company: "500 Startups"
  }
];

export default function CoLaunchPodsLanding() {
  const { data: session } = useSession();
  
  const getStartedUrl = session ? "/colaunch-pods/apply" : "/auth/signup?callbackUrl=" + encodeURIComponent("/waitlist");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-white">
            <Rocket className="w-4 h-4" />
            <span>
              <strong>Coming Q2 2025:</strong> Join the waitlist to be among the first founders in our advisory pods.
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-32">
          <Badge variant="secondary" className="mb-6 bg-green-100 text-green-700 border-green-200">
            <Brain className="w-3 h-3 mr-1" />
            Expert Advisory Pods
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-12 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Your Startup's
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Dream Advisory Team
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-16 leading-relaxed max-w-3xl mx-auto">
            Get C-level expertise without C-level costs. Our curated advisory pods provide structured, 
            goal-oriented guidance from proven experts in exactly the areas you need most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href={getStartedUrl} className="flex items-center gap-2">
                Join Waitlist
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
              <Link href="#pods">Explore Pod Types</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-12 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>150+ Expert Advisors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Launching Q2 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>4 Specialized Pods</span>
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
                  <IconComponent className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-2xl font-bold text-slate-900 mb-1">{benefit.stat}</div>
                  <div className="text-sm font-semibold text-slate-700 mb-2">{benefit.title}</div>
                  <div className="text-xs text-slate-600">{benefit.description}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Pod Types */}
      <div id="pods" className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Target className="w-3 h-3 mr-1" />
              Advisory Pod Types
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Specialized Expertise for Every Challenge
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Each pod is carefully designed around specific startup challenges with expert advisors who've solved these problems before.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {podTypes.map((pod, index) => {
              const IconComponent = pod.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-10">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${pod.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2">{pod.name}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{pod.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{pod.price}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <span className="text-slate-500">Duration:</span>
                        <div className="font-semibold">{pod.duration}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Commitment:</span>
                        <div className="font-semibold">{pod.commitment}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-semibold text-slate-700 mb-2">Expert Advisors:</div>
                      <div className="flex flex-wrap gap-1">
                        {pod.experts.map((expert, expertIndex) => (
                          <Badge key={expertIndex} variant="outline" className="text-xs">
                            {expert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
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
      <div className="bg-gradient-to-br from-slate-50 to-green-50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white text-slate-700 border-slate-200">
              <Rocket className="w-3 h-3 mr-1" />
              The Pod Experience
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              How CoLaunch Pods Work
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              A structured, goal-oriented approach to advisory that delivers real results in weeks, not months.
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
                  Complete our startup assessment and get matched with the perfect pod based on your specific challenges and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">2. Structured Sprint Program</h3>
                <p className="text-slate-600 leading-relaxed">
                  Work through a proven curriculum with weekly sessions, workshops, and deliverables designed to achieve your goals.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">3. Results & Next Steps</h3>
                <p className="text-slate-600 leading-relaxed">
                  Graduate with concrete deliverables, ongoing advisor relationships, and clear next steps for continued growth.
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
              Pod Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              More Than Traditional Advisory
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Our pods combine the best of mentorship, consulting, and peer learning in a structured, results-driven format.
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

      {/* Testimonials */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white text-slate-700 border-slate-200">
              <MessageCircle className="w-3 h-3 mr-1" />
              Success Stories
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Real Results from Real Founders
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              See how other founders have accelerated their growth with CoLaunch Pods.
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.author}</div>
                      <div className="text-xs text-slate-600">{testimonial.role}</div>
                      <div className="text-xs text-slate-500">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-32">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">Get Expert Guidance for Your Startup</h3>
          <p className="text-xl text-green-100 mb-12 max-w-3xl mx-auto">
            Don't struggle alone. Join the waitlist for CoLaunch Pods and get access to the expert guidance 
            that can accelerate your startup's success.
          </p>
          
          <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-8 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-green-100 mb-3">
              <Rocket className="w-5 h-5" />
              <span className="font-semibold">Early Bird Benefits</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-green-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>25% discount on first pod</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Priority pod selection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Exclusive founding member benefits</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50 hover:text-green-700 font-semibold px-8 py-4">
              <Link href={getStartedUrl} className="flex items-center gap-2">
                Join Waitlist - Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
              <Link href="#pods">
                Learn More
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
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Flexible Format</h3>
              <p className="text-slate-600 text-sm">Virtual sessions that fit your schedule and timezone</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Measurable Results</h3>
              <p className="text-slate-600 text-sm">Clear KPIs and progress tracking throughout your pod experience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Global Experts</h3>
              <p className="text-slate-600 text-sm">Access world-class advisors regardless of your location</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}