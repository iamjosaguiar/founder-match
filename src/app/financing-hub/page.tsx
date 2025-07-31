"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Building2, 
  Target, 
  CheckCircle,
  Star,
  Rocket,
  Brain,
  Shield,
  Globe,
  Award,
  Zap,
  Search,
  UserPlus,
  BarChart3,
  FileText,
  Calendar,
  MessageCircle,
  Eye,
  AlertTriangle
} from "lucide-react";

const investmentStages = [
  {
    name: "Pre-Seed",
    range: "$50K - $500K",
    description: "Early validation stage with product development and initial traction",
    typical: "Friends, family, angels, micro-VCs",
    color: "from-green-500 to-green-600"
  },
  {
    name: "Seed",
    range: "$500K - $3M",
    description: "Product-market fit development with initial revenue streams",
    typical: "Angel investors, seed funds, accelerators",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Series A",
    range: "$2M - $15M",
    description: "Proven business model scaling across markets",
    typical: "VCs, institutional investors",
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Series B+",
    range: "$10M+",
    description: "Established companies expanding rapidly",
    typical: "Growth equity, late-stage VCs",
    color: "from-orange-500 to-orange-600"
  }
];

const investorTypes = [
  {
    name: "Angel Investors",
    icon: Users,
    description: "Individual investors providing capital and mentorship to early-stage startups",
    checkSize: "$25K - $100K",
    focus: "Pre-seed to Seed",
    benefits: ["Industry expertise", "Mentorship", "Network access", "Quick decisions"]
  },
  {
    name: "Venture Capital",
    icon: Building2,
    description: "Professional investment firms focused on high-growth potential startups",
    checkSize: "$1M - $50M+",
    focus: "Seed to Growth",
    benefits: ["Large capital", "Due diligence", "Board support", "Portfolio resources"]
  },
  {
    name: "Strategic Investors",
    icon: Target,
    description: "Corporate investors seeking strategic partnerships and innovation",
    checkSize: "$500K - $10M+",
    focus: "All stages",
    benefits: ["Industry connections", "Customer access", "Technical resources", "Market validation"]
  }
];

const showcaseCompanies = [
  {
    name: "TechFlow Analytics",
    stage: "Seed",
    seeking: "$2M",
    industry: "SaaS",
    description: "AI-powered business intelligence for SMBs",
    traction: "50+ customers, $15K MRR"
  },
  {
    name: "GreenEnergy Solutions", 
    stage: "Series A",
    seeking: "$8M",
    industry: "CleanTech",
    description: "Solar installation marketplace",
    traction: "200+ installations, $2M ARR"
  },
  {
    name: "HealthTrack Pro",
    stage: "Pre-seed",
    seeking: "$500K",
    industry: "HealthTech",
    description: "Wearable health monitoring for seniors",
    traction: "MVP ready, pilot customers"
  }
];

const resources = [
  {
    title: "Pitch Deck Templates",
    description: "Professional templates used by successful startups",
    type: "Template",
    downloads: "2.3k"
  },
  {
    title: "Financial Model Builder",
    description: "Interactive tool for creating investor-ready financial projections",
    type: "Tool",
    downloads: "1.8k"
  },
  {
    title: "Term Sheet Guide",
    description: "Complete guide to understanding and negotiating term sheets",
    type: "Guide",
    downloads: "3.1k"
  },
  {
    title: "Due Diligence Checklist",
    description: "Comprehensive checklist to prepare for investor due diligence",
    type: "Checklist",
    downloads: "1.5k"
  }
];

export default function FinancingHubLanding() {
  const { data: session } = useSession();
  
  const getStartedUrl = session ? "/financing" : "/auth/signup?callbackUrl=" + encodeURIComponent("/financing");
  const showcaseUrl = session ? "/financing/showcase" : "/auth/signup?callbackUrl=" + encodeURIComponent("/financing/showcase");
  const investorsUrl = session ? "/financing/investors" : "/auth/signup?callbackUrl=" + encodeURIComponent("/financing/investors");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Legal Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <span>
              <strong>Important:</strong> This platform provides information only. 
              We do not provide investment advice or facilitate securities transactions.
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-32">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
            <DollarSign className="w-3 h-3 mr-1" />
            Startup Financing Hub
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-12 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Connect With
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Startup Capital
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-16 leading-relaxed max-w-3xl mx-auto">
            Discover funding opportunities, connect with investors, and access the resources you need 
            to fuel your startup's growth. From pre-seed to Series A and beyond.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href={showcaseUrl} className="flex items-center gap-2">
                Showcase Your Startup
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
              <Link href={investorsUrl}>Find Investors</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>150+ Showcased Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>89+ Active Investors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>$45M+ Funding Information</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-24">
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">150+</div>
              <div className="text-sm text-slate-600">Showcased Companies</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-1">89</div>
              <div className="text-sm text-slate-600">Investor Profiles</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-1">156</div>
              <div className="text-sm text-slate-600">Connections Made</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-1">4.2k</div>
              <div className="text-sm text-slate-600">Resource Downloads</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Funding Stages */}
      <div className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              Funding Journey
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Understanding Startup Investment Stages
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Each funding stage serves different business needs. Understanding where you fit helps target the right investors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {investmentStages.map((stage, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stage.color} rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{stage.name}</h3>
                  <div className="text-sm font-semibold text-green-600 mb-3">{stage.range}</div>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{stage.description}</p>
                  <div className="text-xs text-slate-500">
                    <strong>Typical investors:</strong> {stage.typical}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Investor Types */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white text-slate-700 border-slate-200">
              <Users className="w-3 h-3 mr-1" />
              Investor Ecosystem
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Types of Startup Investors
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Different investor types bring unique value beyond capital. Choose the right fit for your startup's stage and needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {investorTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-center">{type.name}</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed text-center">{type.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Typical check size:</span>
                        <span className="font-semibold">{type.checkSize}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Stage focus:</span>
                        <span className="font-semibold">{type.focus}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-slate-700 mb-2">Key Benefits:</div>
                      {type.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {benefit}
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

      {/* Featured Companies */}
      <div className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Rocket className="w-3 h-3 mr-1" />
              Company Showcase
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Featured Funding Opportunities
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Discover innovative startups actively seeking investment across various stages and industries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {showcaseCompanies.map((company, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{company.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">{company.description}</p>
                      <Badge variant="outline" className="text-xs">{company.industry}</Badge>
                    </div>
                    <Badge className={`text-xs ${
                      company.stage === 'Pre-seed' ? 'bg-green-100 text-green-800' :
                      company.stage === 'Seed' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {company.stage}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Seeking:</span>
                      <span className="font-semibold text-green-600">{company.seeking}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Traction:</span>
                      <span className="font-semibold">{company.traction}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>1.2k views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>23 interested</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href={showcaseUrl}>View All Companies</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white text-slate-700 border-slate-200">
              <FileText className="w-3 h-3 mr-1" />
              Fundraising Resources
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Everything You Need to Raise Capital
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Professional templates, guides, and tools used by successful startups to raise funding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{resource.downloads} downloads</span>
                    <Button size="sm" variant="outline" className="group-hover:bg-blue-50">
                      Download
                    </Button>
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
          <h3 className="text-4xl font-bold text-white mb-4">Ready to Fuel Your Growth?</h3>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join hundreds of startups who've connected with investors and raised capital through our platform.
          </p>
          
          {/* Legal Notice */}
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-6 mb-12 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 text-sm text-blue-100">
              <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold mb-1">Information Platform Only</p>
                <p>
                  CoLaunchr provides information and networking opportunities only. We do not provide investment advice, 
                  facilitate securities transactions, or guarantee investment outcomes. All investment decisions are made 
                  independently by users. Please consult with qualified professionals before making investment decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-8 py-4">
              <Link href={showcaseUrl} className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
              <Link href="#resources">
                Download Resources
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
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Smart Matching</h3>
              <p className="text-slate-600 text-sm">Find investors aligned with your industry and stage</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Network</h3>
              <p className="text-slate-600 text-sm">All investor profiles are verified and actively investing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Direct Connection</h3>
              <p className="text-slate-600 text-sm">Connect directly with investors through our platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}