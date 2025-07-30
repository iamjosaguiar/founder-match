"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search, Filter, MapPin, DollarSign, Clock, Code, Palette, Megaphone, Scale, FileText, Camera, Monitor, User } from "lucide-react";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  budget?: number;
  timeline?: string;
  complexity?: string;
  techStack: string[];
  status: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    title?: string;
    location?: string;
  };
  matches: Array<{
    id: string;
    status: string;
  }>;
};

type UserProfile = {
  id: string;
  roles: string[];
};

const serviceTypeIcons = {
  development: Code,
  design: Palette,
  marketing: Megaphone,
  legal: Scale,
  copywriting: FileText,
  video: Camera,
  consulting: Monitor
};

const serviceTypeLabels = {
  development: "Development",
  design: "Design",
  marketing: "Marketing",
  legal: "Legal",
  copywriting: "Copywriting",
  video: "Video Production",
  consulting: "Business Consulting"
};

const budgetRanges = [
  { label: "All Budgets", value: "" },
  { label: "$100 - $1,000", value: "100-1000" },
  { label: "$1,000 - $5,000", value: "1000-5000" },
  { label: "$5,000 - $10,000", value: "5000-10000" },
  { label: "$10,000+", value: "10000-999999" }
];

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Still checking session
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/execution-network/projects"));
      return;
    }
    fetchUserProfile();
    fetchProjects();
  }, [session, status, router]);

  useEffect(() => {
    fetchProjects();
  }, [selectedServiceType, selectedBudget]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchProjects = async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    
    try {
      const params = new URLSearchParams();
      if (selectedServiceType) params.append('serviceType', selectedServiceType);
      if (selectedBudget) params.append('budget', selectedBudget);
      
      const response = await fetch(`/api/projects?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else if (response.status === 401) {
        // Authentication required - redirect to sign in
        router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/execution-network/projects"));
        return;
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatBudget = (budget?: number) => {
    if (!budget) return "Budget not specified";
    return `$${budget.toLocaleString()}`;
  };

  const formatTimeline = (timeline?: string) => {
    const timelineMap: Record<string, string> = {
      asap: "ASAP",
      within_week: "Within a week",
      within_month: "Within a month",
      flexible: "Flexible"
    };
    return timeline ? timelineMap[timeline] || timeline : "Flexible";
  };

  const formatComplexity = (complexity?: string) => {
    const complexityMap: Record<string, string> = {
      simple: "Simple",
      medium: "Medium",
      complex: "Complex"
    };
    return complexity ? complexityMap[complexity] || complexity : "Medium";
  };

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case "simple": return "bg-green-100 text-green-700 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "complex": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const isServiceProvider = userProfile?.roles?.includes('service_provider');
  const isFounder = userProfile?.roles?.includes('founder');

  // Show loading state while checking authentication or loading data
  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md mb-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/execution-network/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Execution Network Projects
                </h1>
                <p className="text-slate-600">
                  {isServiceProvider ? "Find projects that match your expertise" : "Browse available projects"}
                </p>
              </div>
            </div>
            {isFounder && (
              <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600">
                <Link href="/execution-network/projects/new" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Post Project
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Filters */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Service Type Filter */}
              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500"
              >
                <option value="">All Service Types</option>
                {Object.entries(serviceTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              {/* Budget Filter */}
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500"
              >
                {budgetRanges.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold mb-4">No projects found</h3>
              <p className="text-slate-600 mb-6">
                {projects.length === 0 
                  ? "There are no projects posted yet." 
                  : "Try adjusting your search criteria."}
              </p>
              {isFounder && (
                <Button asChild>
                  <Link href="/execution-network/projects/new">
                    Post the First Project
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const ServiceIcon = serviceTypeIcons[project.serviceType as keyof typeof serviceTypeIcons] || Code;
              const matchCount = project.matches.length;
              
              return (
                <Card key={project.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                          <ServiceIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {serviceTypeLabels[project.serviceType as keyof typeof serviceTypeLabels]}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={getComplexityColor(project.complexity)}>
                        {formatComplexity(project.complexity)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-slate-600 mb-4 line-clamp-3">{project.description}</p>
                    
                    {/* Tech Stack */}
                    {project.techStack.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.techStack.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.techStack.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {formatBudget(project.budget)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatTimeline(project.timeline)}
                      </div>
                    </div>
                    
                    {/* Owner Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium">{project.owner.name}</span>
                        {project.owner.title && (
                          <span className="text-sm text-slate-500">• {project.owner.title}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {matchCount > 0 && (
                          <span className="text-sm text-slate-500">{matchCount} proposals</span>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}