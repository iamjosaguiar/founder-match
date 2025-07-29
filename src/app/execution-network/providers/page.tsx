"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Search, MapPin, DollarSign, Clock, Star, CheckCircle, Code, Palette, Megaphone, Scale, FileText, Camera, Monitor, ExternalLink, User } from "lucide-react";
import Link from "next/link";

type ServiceProvider = {
  id: string;
  name: string;
  title: string;
  bio: string;
  location?: string;
  profileImage?: string;
  serviceTypes: string[];
  skills: string[];
  experience: string;
  hourlyRate?: number;
  availability: string;
  remoteOk: boolean;
  portfolio: Array<{
    title: string;
    description: string;
    url?: string;
  }>;
  completedProjects: number;
  totalProjects: number;
  createdAt: string;
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

const experienceOptions = [
  { label: "All Experience Levels", value: "all" },
  { label: "Entry Level", value: "entry-level" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Senior", value: "senior" },
  { label: "Expert", value: "expert" }
];

const availabilityOptions = [
  { label: "All Availability", value: "all" },
  { label: "Available immediately", value: "immediate" },
  { label: "Available within a week", value: "within_week" },
  { label: "Available within a month", value: "within_month" },
  { label: "Flexible scheduling", value: "flexible" }
];

export default function ServiceProvidersPage() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");

  useEffect(() => {
    fetchProviders();
  }, [selectedServiceType, selectedExperience, selectedAvailability, remoteOnly, minRate, maxRate]);

  const fetchProviders = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedServiceType !== 'all') params.append('serviceType', selectedServiceType);
      if (selectedExperience !== 'all') params.append('experience', selectedExperience);
      if (selectedAvailability !== 'all') params.append('availability', selectedAvailability);
      if (remoteOnly) params.append('remoteOk', 'true');
      if (minRate) params.append('minRate', minRate);
      if (maxRate) params.append('maxRate', maxRate);
      
      const response = await fetch(`/api/service-providers?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProviders(data);
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatRate = (rate?: number) => {
    if (!rate) return "Rate not specified";
    return `$${rate}/hour`;
  };

  const formatAvailability = (availability: string) => {
    const map: Record<string, string> = {
      immediate: "Available immediately",
      within_week: "Available within a week",
      within_month: "Available within a month",
      flexible: "Flexible scheduling"
    };
    return map[availability] || availability;
  };

  const formatExperience = (experience: string) => {
    const map: Record<string, string> = {
      "entry-level": "Entry Level",
      "intermediate": "Intermediate",
      "senior": "Senior",
      "expert": "Expert"
    };
    return map[experience] || experience;
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case "entry-level": return "bg-green-100 text-green-700 border-green-200";
      case "intermediate": return "bg-blue-100 text-blue-700 border-blue-200";
      case "senior": return "bg-purple-100 text-purple-700 border-purple-200";
      case "expert": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading service providers...</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Service Provider Directory
                </h1>
                <p className="text-slate-600">Find expert service providers for your projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Filters */}
        <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, skills, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Row 1 */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Service Type Filter */}
                <select
                  value={selectedServiceType}
                  onChange={(e) => setSelectedServiceType(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500"
                >
                  <option value="all">All Service Types</option>
                  {Object.entries(serviceTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                {/* Experience Filter */}
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500"
                >
                  {experienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>

                {/* Availability Filter */}
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Filter Row 2 */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Rate Range */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min rate"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max rate"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                  />
                </div>

                {/* Remote Work Filter */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remoteOnly"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="remoteOnly" className="text-sm font-medium">
                    Remote work only
                  </label>
                </div>

                {/* Results count */}
                <div className="flex items-center justify-end">
                  <span className="text-sm text-slate-600">
                    {filteredProviders.length} providers found
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Providers Grid */}
        {filteredProviders.length === 0 ? (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold mb-4">No service providers found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search criteria or check back later for new providers.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      {provider.profileImage ? (
                        <img src={provider.profileImage} alt={provider.name} className="w-full h-full object-cover" />
                      ) : (
                        <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                          {provider.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{provider.name}</CardTitle>
                          <p className="text-slate-600 font-medium">{provider.title}</p>
                          {provider.location && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                              <MapPin className="w-3 h-3" />
                              {provider.location}
                            </div>
                          )}
                        </div>
                        <Badge className={getExperienceColor(provider.experience)}>
                          {formatExperience(provider.experience)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Bio */}
                  <p className="text-slate-600 mb-4 line-clamp-3">{provider.bio}</p>
                  
                  {/* Service Types */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {provider.serviceTypes.map((serviceType) => {
                        const ServiceIcon = serviceTypeIcons[serviceType as keyof typeof serviceTypeIcons] || Code;
                        return (
                          <Badge key={serviceType} className="bg-purple-100 text-purple-700 border-purple-200 flex items-center gap-1">
                            <ServiceIcon className="w-3 h-3" />
                            {serviceTypeLabels[serviceType as keyof typeof serviceTypeLabels]}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Skills */}
                  {provider.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {provider.skills.slice(0, 6).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {provider.skills.length > 6 && (
                          <Badge variant="secondary" className="text-xs">
                            +{provider.skills.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Stats and Pricing */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {formatRate(provider.hourlyRate)}
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {provider.completedProjects} completed
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatAvailability(provider.availability)}
                    </div>
                    <div className="flex items-center gap-2">
                      {provider.remoteOk ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600">Remote OK</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4" />
                          <span>In-person preferred</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Portfolio Preview */}
                  {provider.portfolio.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Recent Work:</h4>
                      <div className="space-y-2">
                        {provider.portfolio.slice(0, 2).map((item, index) => (
                          <div key={index} className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{item.title}</h5>
                                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                              </div>
                              {item.url && (
                                <Button size="sm" variant="ghost" asChild>
                                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <div className="text-sm text-slate-500">
                      Joined {new Date(provider.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm">
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}