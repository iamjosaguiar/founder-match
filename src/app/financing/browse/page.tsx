"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { FinancingDisclaimer } from "@/components/financing-disclaimer";
import IntroductionRequestModal from "@/components/introduction-request-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Search, 
  MapPin,
  Eye,
  Heart,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  ArrowLeft,
  ExternalLink,
  Mail,
  MessageCircle
} from "lucide-react";

type SelectedCompany = {
  id: string;
  name: string;
  companyName: string;
  tagline: string;
};

// Sample data - would come from API in real implementation
const sampleCompanies = [
  {
    id: "1",
    companyName: "TechFlow Analytics",
    tagline: "AI-powered business intelligence for SMBs",
    description: "We're building the next generation of business analytics tools that make data insights accessible to small and medium businesses without requiring a data science team.",
    industry: "SaaS",
    stage: "Seed",
    location: "San Francisco, CA",
    teamSize: 8,
    founded: "2023",
    seekingTypes: ["Funding", "Mentorship", "Strategic Partners"],
    fundingStage: "Seed Round",
    useOfFunds: "Product development and market expansion",
    views: 1240,
    interests: 23,
    website: "https://techflow.ai",
    logoUrl: null,
    contactMethods: ["Email", "LinkedIn"],
    featured: true
  },
  {
    id: "2", 
    companyName: "GreenEnergy Solutions",
    tagline: "Solar installation marketplace",
    description: "Connecting homeowners with vetted solar installers through our innovative marketplace platform, making renewable energy adoption simple and affordable.",
    industry: "CleanTech",
    stage: "Growth",
    location: "Austin, TX",
    teamSize: 15,
    founded: "2022",
    seekingTypes: ["Funding", "Strategic Partners"],
    fundingStage: "Series A",
    useOfFunds: "Geographic expansion and technology enhancement",
    views: 892,
    interests: 18,
    website: "https://greenenergy.com",
    logoUrl: null,
    contactMethods: ["Website", "Email"],
    featured: false
  },
  {
    id: "3",
    companyName: "HealthTrack Pro",
    tagline: "Wearable health monitoring for seniors",
    description: "Advanced wearable technology specifically designed for senior citizens, providing real-time health monitoring and emergency response capabilities.",
    industry: "HealthTech",
    stage: "MVP",
    location: "Remote",
    teamSize: 5,
    founded: "2024",
    seekingTypes: ["Funding", "Mentorship", "Technical Partners"],
    fundingStage: "Pre-seed",
    useOfFunds: "Product development and regulatory compliance",
    views: 567,
    interests: 12,
    website: null,
    logoUrl: null,
    contactMethods: ["Email", "LinkedIn"],
    featured: false
  }
];

const industryOptions = ["All Industries", "SaaS", "FinTech", "HealthTech", "CleanTech", "E-commerce", "EdTech"];
const stageOptions = ["All Stages", "Idea", "MVP", "Seed", "Growth", "Scale"];

export default function BrowseCompaniesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [companies, setCompanies] = useState(sampleCompanies);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/financing/browse"));
      return;
    }
  }, [session, status, router]);

  // Filter companies based on search and filters
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = selectedIndustry === "All Industries" || company.industry === selectedIndustry;
    const matchesStage = selectedStage === "All Stages" || company.stage === selectedStage;
    
    return matchesSearch && matchesIndustry && matchesStage;
  });

  const handleExpressInterest = (company: any) => {
    // Set selected company for modal
    setSelectedCompany({
      id: company.id,
      name: company.companyName,
      companyName: company.companyName,
      tagline: company.tagline
    });
    setModalOpen(true);
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading companies...</p>
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Companies</h1>
          <p className="text-slate-600">Discover innovative startups seeking support and partnerships</p>
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
                  placeholder="Search companies, descriptions, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
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
                {filteredCompanies.length} companies found
              </p>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Sort by: Most Recent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies Grid */}
        <div className="space-y-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
              company.featured ? 'ring-2 ring-blue-200 bg-gradient-to-r from-blue-50 to-white' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {/* Company Logo/Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Company Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{company.companyName}</h3>
                        {company.featured && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            ⭐ Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 font-medium mb-2">{company.tagline}</p>
                      <p className="text-slate-600 text-sm mb-3 leading-relaxed">{company.description}</p>
                      
                      {/* Seeking Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {company.seekingTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stage Badge */}
                  <Badge 
                    variant="outline" 
                    className={`${
                      company.stage === 'Seed' ? 'bg-green-50 text-green-700 border-green-200' :
                      company.stage === 'Growth' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    {company.stage} Stage
                  </Badge>
                </div>

                {/* Company Details */}
                <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    {company.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    Team of {company.teamSize}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    Founded {company.founded}
                  </div>
                </div>

                {/* Funding Information */}
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Seeking Support</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Stage:</strong> {company.fundingStage}
                  </p>
                  <p className="text-sm text-blue-700">
                    <strong>Use of Funds:</strong> {company.useOfFunds}
                  </p>
                </div>

                {/* Stats and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {company.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {company.interests} interested
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {company.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Website
                        </a>
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      onClick={() => handleExpressInterest(company)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Express Interest
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <Card className="border-0 bg-white shadow-lg">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No companies found</h3>
              <p className="text-slate-500 mb-6">
                Try adjusting your search terms or filters to find more companies.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedIndustry("All Industries");
                setSelectedStage("All Stages");
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Introduction Request Modal */}
        {selectedCompany && (
          <IntroductionRequestModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedCompany(null);
            }}
            recipient={selectedCompany}
            context="company"
          />
        )}
      </div>
    </DashboardLayout>
  );
}