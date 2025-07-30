"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { FinancingDisclaimer } from "@/components/financing-disclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  MapPin,
  Briefcase,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Mail,
  MessageCircle,
  Plus,
  TrendingUp,
  Building2,
  Globe,
  Linkedin
} from "lucide-react";

// Sample data - would come from API in real implementation
const sampleInvestors = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Angel Investor & Former Stripe Executive",
    organization: "Independent",
    profileType: "investor",
    bio: "Former VP of Engineering at Stripe. Angel investor focusing on B2B SaaS and fintech startups. Invested in 25+ companies with 3 successful exits.",
    expertise: ["B2B SaaS", "FinTech", "Product Strategy", "Engineering Leadership"],
    interestedIn: ["SaaS", "FinTech", "B2B"],
    stageInterest: ["Seed", "Series A"],
    geographic: ["US", "Remote"],
    linkedin: "https://linkedin.com/in/sarahchen",
    website: "https://sarahchen.com", 
    openToContact: true,
    publicProfile: true
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    title: "Partner",
    organization: "TechVentures Capital",
    profileType: "investor",
    bio: "Partner at TechVentures Capital with focus on early-stage technology companies. 10 years experience in venture capital with portfolio valued at $500M+.",
    expertise: ["Venture Capital", "Due Diligence", "Growth Strategy", "B2B Sales"],
    interestedIn: ["AI/ML", "SaaS", "HealthTech"],
    stageInterest: ["Seed", "Series A", "Series B"],
    geographic: ["Silicon Valley", "US"],
    linkedin: "https://linkedin.com/in/mrodriguez",
    website: "https://techventures.com",
    openToContact: true,
    publicProfile: true
  },
  {
    id: "3",
    name: "Dr. Lisa Thompson",
    title: "Industry Mentor & Advisor",
    organization: "HealthTech Advisors",
    profileType: "mentor",
    bio: "Former Chief Medical Officer at major health systems. Now mentoring healthcare startups and serving on advisory boards. Expertise in regulatory compliance and clinical workflows.",
    expertise: ["Healthcare", "Regulatory", "Clinical Operations", "Medical Devices"],
    interestedIn: ["HealthTech", "MedTech", "Digital Health"],
    stageInterest: ["MVP", "Seed", "Growth"],
    geographic: ["Boston", "NYC", "Remote"],
    linkedin: "https://linkedin.com/in/lisathompson",
    website: null,
    openToContact: true,
    publicProfile: true
  },
  {
    id: "4",
    name: "James Park",
    title: "Strategic Advisor",
    organization: "Former Uber Executive",
    profileType: "advisor",
    bio: "Former Director of Business Development at Uber. Currently advising marketplace and mobility startups. Deep expertise in scaling operations and partnerships.",
    expertise: ["Marketplaces", "Operations", "Partnerships", "Scaling"],
    interestedIn: ["Marketplaces", "Mobility", "Logistics"],
    stageInterest: ["Growth", "Scale"],
    geographic: ["SF Bay Area", "Remote"],
    linkedin: "https://linkedin.com/in/jamespark",
    website: "https://jamespark.io",
    openToContact: false, // Not currently accepting new contacts
    publicProfile: true
  }
];

const typeOptions = ["All Types", "Investor", "Mentor", "Advisor"];
const industryOptions = ["All Industries", "SaaS", "FinTech", "HealthTech", "AI/ML", "Marketplaces", "B2B"];
const stageOptions = ["All Stages", "MVP", "Seed", "Series A", "Series B", "Growth", "Scale"];

export default function InvestorNetworkPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [investors, setInvestors] = useState(sampleInvestors);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/financing/investors"));
      return;
    }
  }, [session, status, router]);

  // Filter investors based on search and filters
  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "All Types" || investor.profileType === selectedType.toLowerCase();
    const matchesIndustry = selectedIndustry === "All Industries" || 
                           investor.interestedIn.includes(selectedIndustry);
    const matchesStage = selectedStage === "All Stages" || 
                        investor.stageInterest.includes(selectedStage);
    
    return matchesSearch && matchesType && matchesIndustry && matchesStage;
  });

  const handleConnect = (investorId: string, investorName: string) => {
    // This would open a modal or navigate to a connection form
    alert(`Connection request to ${investorName}. This would open a professional introduction form.`);
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading investor network...</p>
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
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/financing" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Financing Hub
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Investor Network</h1>
              <p className="text-slate-600">Connect with investors, mentors, and advisors</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link href="/financing/investors/join" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Join as Investor/Mentor
              </Link>
            </Button>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <FinancingDisclaimer className="mb-6" />

        {/* Search and Filters */}
        <Card className="border-0 bg-white shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, expertise, or organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Type Filter */}
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                {typeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Industry Filter */}
              <select 
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                {industryOptions.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>

              {/* Stage Filter */}
              <select 
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                {stageOptions.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                {filteredInvestors.length} profiles found
              </p>
              <p className="text-sm text-slate-500">
                {filteredInvestors.filter(i => i.openToContact).length} accepting new connections
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Network Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-900">89</div>
              <div className="text-sm text-blue-700">Total Network</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-900">34</div>
              <div className="text-sm text-green-700">Active Investors</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-900">28</div>
              <div className="text-sm text-purple-700">Mentors</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-900">156</div>
              <div className="text-sm text-orange-700">Connections Made</div>
            </CardContent>
          </Card>
        </div>

        {/* Investor Profiles */}
        <div className="space-y-6">
          {filteredInvestors.map((investor) => (
            <Card key={investor.id} className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {/* Profile Picture Placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Profile Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{investor.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            investor.profileType === 'investor' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            investor.profileType === 'mentor' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-purple-50 text-purple-700 border-purple-200'
                          }`}
                        >
                          {investor.profileType.charAt(0).toUpperCase() + investor.profileType.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-700">{investor.title}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600">{investor.organization}</span>
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{investor.bio}</p>
                      
                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {investor.expertise.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-slate-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Status */}
                  <div className="text-right">
                    {investor.openToContact ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ Open to Contact
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-50 text-slate-600">
                        Currently Full
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Interest Areas */}
                <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Industries</h4>
                    <div className="flex flex-wrap gap-1">
                      {investor.interestedIn.map((industry) => (
                        <Badge key={industry} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Stages</h4>
                    <div className="flex flex-wrap gap-1">
                      {investor.stageInterest.map((stage) => (
                        <Badge key={stage} variant="outline" className="text-xs">
                          {stage}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Geographic</h4>
                    <div className="flex flex-wrap gap-1">
                      {investor.geographic.map((geo) => (
                        <Badge key={geo} variant="outline" className="text-xs">
                          {geo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {investor.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={investor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      </Button>
                    )}
                    {investor.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={investor.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {investor.openToContact ? (
                      <Button 
                        size="sm"
                        onClick={() => handleConnect(investor.id, investor.name)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Request Introduction
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Not Available
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredInvestors.length === 0 && (
          <Card className="border-0 bg-white shadow-lg">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No profiles found</h3>
              <p className="text-slate-500 mb-6">
                Try adjusting your search terms or filters to find more investors and mentors.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedType("All Types");
                setSelectedIndustry("All Industries");
                setSelectedStage("All Stages");
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}