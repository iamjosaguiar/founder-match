"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Code, 
  Palette, 
  Megaphone, 
  Scale, 
  Users, 
  CheckCircle,
  Star,
  Clock,
  Shield,
  TrendingUp,
  Rocket,
  Building2,
  Briefcase,
  Globe,
  Target,
  Zap,
  Award,
  MessageCircle,
  DollarSign
} from "lucide-react";

const serviceCategories = [
  {
    name: "Development",
    icon: Code,
    description: "Full-stack developers, mobile app specialists, and technical architects",
    services: ["Web Development", "Mobile Apps", "Backend Systems", "DevOps", "QA Testing"],
    startingPrice: "$75/hr",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Design",
    icon: Palette,
    description: "UI/UX designers, brand specialists, and creative professionals",
    services: ["UI/UX Design", "Brand Identity", "Product Design", "Web Design", "Illustrations"],
    startingPrice: "$65/hr",
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Marketing",
    icon: Megaphone,
    description: "Digital marketers, content creators, and growth specialists",
    services: ["Digital Marketing", "Content Strategy", "SEO/SEM", "Social Media", "Email Marketing"],
    startingPrice: "$55/hr",
    color: "from-green-500 to-green-600"
  },
  {
    name: "Operations",
    icon: Scale,
    description: "Business analysts, project managers, and operational experts",
    services: ["Project Management", "Business Analysis", "Process Optimization", "Data Analysis", "HR Support"],
    startingPrice: "$50/hr",
    color: "from-orange-500 to-orange-600"
  },
  {
    name: "Legal & Finance",
    icon: Building2,
    description: "Startup lawyers, accountants, and financial consultants",
    services: ["Legal Counsel", "Accounting", "Financial Planning", "Compliance", "Contract Review"],
    startingPrice: "$125/hr",
    color: "from-red-500 to-red-600"
  },
  {
    name: "Strategy",
    icon: Target,
    description: "Business strategists, market researchers, and consultants",
    services: ["Business Strategy", "Market Research", "Competitive Analysis", "Go-to-Market", "Fundraising Support"],
    startingPrice: "$85/hr",
    color: "from-teal-500 to-teal-600"
  }
];

const features = [
  {
    icon: Shield,
    title: "Vetted Professionals",
    description: "All providers are thoroughly screened for skills, experience, and reliability"
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Get matched with qualified providers within 24 hours of posting your project"
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden fees. Clear hourly rates and project-based pricing upfront"
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    description: "Work directly with providers through our integrated messaging system"
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "All work is backed by our satisfaction guarantee and dispute resolution"
  },
  {
    icon: TrendingUp,
    title: "Scalable Teams",
    description: "Start with one expert and scale to full teams as your startup grows"
  }
];

const howItWorks = [
  {
    step: "1",
    title: "Post Your Project",
    description: "Describe your project needs, timeline, and budget in our simple project posting form",
    icon: Briefcase
  },
  {
    step: "2", 
    title: "Get Matched",
    description: "Our algorithm matches you with 3-5 qualified providers based on your specific requirements",
    icon: Users
  },
  {
    step: "3",
    title: "Choose & Work",
    description: "Review proposals, interview candidates, and start working with your chosen provider",
    icon: Rocket
  }
];

export default function ExecutionNetworkLanding() {
  const { data: session } = useSession();
  
  const getStartedUrl = session ? "/execution-network/projects/new" : "/auth/signup?callbackUrl=" + encodeURIComponent("/execution-network/projects/new");
  const browseProvidersUrl = session ? "/execution-network/providers" : "/auth/signup?callbackUrl=" + encodeURIComponent("/execution-network/providers");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
            <Code className="w-3 h-3 mr-1" />
            Vetted Professional Network
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Your Startup's
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Execution Network
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Access world-class developers, designers, marketers, and experts without the overhead. 
            Build faster, launch sooner, and scale smarter with our curated network of startup specialists.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href={getStartedUrl} className="flex items-center gap-2">
                Post a Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
              <Link href={browseProvidersUrl}>Browse Providers</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>850+ Vetted Experts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>24hr Response Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>95% Satisfaction Rate</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-purple-600 mb-1">850+</div>
              <div className="text-sm text-slate-600">Expert Providers</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-green-600 mb-1">2.4k</div>
              <div className="text-sm text-slate-600">Projects Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">24hr</div>
              <div className="text-sm text-slate-600">Avg Match Time</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-orange-600 mb-1">95%</div>
              <div className="text-sm text-slate-600">Satisfaction Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Categories */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Briefcase className="w-3 h-3 mr-1" />
              Expert Service Categories
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Every Skill Your Startup Needs
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              From technical development to strategic consulting, find specialized experts who understand startups and deliver results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      <Badge variant="outline" className="text-xs text-green-700 bg-green-50">
                        From {category.startingPrice}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{category.description}</p>
                    <div className="space-y-1">
                      {category.services.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-center gap-2 text-xs text-slate-500">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {service}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-slate-50 to-purple-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-white text-slate-700 border-slate-200">
              <Rocket className="w-3 h-3 mr-1" />
              Simple Process
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              How the Execution Network Works
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Get started in minutes. Our streamlined process connects you with the right experts for your project needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-sm font-bold text-purple-600 mb-2">STEP {step.step}</div>
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Star className="w-3 h-3 mr-1" />
              Why Choose Our Network
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Built for Startup Success
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Unlike traditional freelance platforms, our network is specifically designed for startups with features that matter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-purple-50 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-purple-600" />
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

      {/* Pricing Transparency */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Transparent, Startup-Friendly Pricing
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
              No hidden fees or platform charges. Pay providers directly at rates that work for startups.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 bg-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">For Startups</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Free to post projects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">No platform fees</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Pay providers directly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Flexible payment terms</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href={getStartedUrl}>Post Your First Project</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Typical Rates</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Junior Developer</span>
                    <span className="font-semibold">$45-65/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Senior Developer</span>
                    <span className="font-semibold">$75-120/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">UI/UX Designer</span>
                    <span className="font-semibold">$65-95/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Marketing Specialist</span>
                    <span className="font-semibold">$55-85/hr</span>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href={browseProvidersUrl}>Browse All Providers</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-24">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">Ready to Build Your Dream Team?</h3>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of startups who've accelerated their growth with our expert execution network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700 font-semibold px-8 py-4">
              <Link href={getStartedUrl} className="flex items-center gap-2">
                Post Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
              <Link href={browseProvidersUrl}>
                Find Providers
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Features */}
      <div className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Global Talent</h3>
              <p className="text-slate-600 text-sm">Access experts from around the world in all time zones</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Quick Start</h3>
              <p className="text-slate-600 text-sm">Begin working with providers within 24-48 hours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Startup Focus</h3>
              <p className="text-slate-600 text-sm">All providers understand startup pace and constraints</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}