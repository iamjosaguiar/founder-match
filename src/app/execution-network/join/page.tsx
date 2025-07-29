"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, X, Code, Palette, Megaphone, Scale, FileText, Camera, Monitor } from "lucide-react";
import Link from "next/link";

type ServiceProviderData = {
  // Basic info
  name: string;
  title: string;
  bio: string;
  location: string;
  
  // Services & expertise
  serviceTypes: string[];
  skills: string[];
  experience: string;
  
  // Business details
  hourlyRate: number;
  availability: string;
  remoteOk: boolean;
  
  // Portfolio
  portfolioItems: PortfolioItem[];
};

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  techStack?: string[];
};

const serviceTypeOptions = [
  { 
    value: "development", 
    label: "Development", 
    icon: Code, 
    description: "Web/mobile apps, APIs, databases",
    skills: ["React", "Node.js", "Python", "iOS", "Android", "DevOps"]
  },
  { 
    value: "design", 
    label: "Design", 
    icon: Palette, 
    description: "UI/UX, branding, graphics",
    skills: ["Figma", "Adobe Creative", "UI/UX", "Branding", "Web Design"]
  },
  { 
    value: "marketing", 
    label: "Marketing", 
    icon: Megaphone, 
    description: "Growth, content, paid ads, SEO",
    skills: ["Google Ads", "Facebook Ads", "SEO", "Content Marketing", "Analytics"]
  },
  { 
    value: "legal", 
    label: "Legal", 
    icon: Scale, 
    description: "Contracts, compliance, IP",
    skills: ["Business Law", "Contracts", "IP Law", "Compliance", "Corporate"]
  },
  { 
    value: "copywriting", 
    label: "Copywriting", 
    icon: FileText, 
    description: "Website copy, marketing content",
    skills: ["Website Copy", "Email Marketing", "Sales Copy", "Content Strategy"]
  },
  { 
    value: "video", 
    label: "Video Production", 
    icon: Camera, 
    description: "Video editing, motion graphics",
    skills: ["Video Editing", "Motion Graphics", "Animation", "After Effects"]
  },
  { 
    value: "consulting", 
    label: "Business Consulting", 
    icon: Monitor, 
    description: "Strategy, operations, finance",
    skills: ["Business Strategy", "Operations", "Financial Modeling", "Process Optimization"]
  }
];

const experienceOptions = [
  "entry-level", "intermediate", "senior", "expert"
];

const availabilityOptions = [
  "immediate", "within_week", "within_month", "flexible"
];

export default function JoinExecutionNetwork() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/execution-network/join"));
      return;
    }
  }, [session, status, router]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: "",
    description: "",
    url: "",
    techStack: [] as string[]
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ServiceProviderData>({
    defaultValues: {
      serviceTypes: [],
      skills: [],
      portfolioItems: [],
      remoteOk: true
    }
  });

  const watchedValues = watch();
  const selectedServices = watchedValues.serviceTypes || [];
  const skills = watchedValues.skills || [];
  const portfolioItems = watchedValues.portfolioItems || [];

  // Get suggested skills based on selected services
  const getSuggestedSkills = () => {
    const suggested = new Set<string>();
    selectedServices.forEach(serviceType => {
      const service = serviceTypeOptions.find(s => s.value === serviceType);
      if (service) {
        service.skills.forEach(skill => suggested.add(skill));
      }
    });
    return Array.from(suggested);
  };

  const toggleServiceType = (serviceType: string) => {
    const current = selectedServices;
    const updated = current.includes(serviceType)
      ? current.filter(s => s !== serviceType)
      : [...current, serviceType];
    setValue("serviceTypes", updated);
  };

  const addSkill = (skill?: string) => {
    const skillToAdd = skill || currentSkill.trim();
    if (skillToAdd && !skills.includes(skillToAdd)) {
      setValue("skills", [...skills, skillToAdd]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setValue("skills", skills.filter(s => s !== skill));
  };

  const addPortfolioItem = () => {
    if (newPortfolioItem.title && newPortfolioItem.description) {
      const item: PortfolioItem = {
        id: Date.now().toString(),
        ...newPortfolioItem
      };
      setValue("portfolioItems", [...portfolioItems, item]);
      setNewPortfolioItem({ title: "", description: "", url: "", techStack: [] });
      setShowAddPortfolio(false);
    }
  };

  const removePortfolioItem = (id: string) => {
    setValue("portfolioItems", portfolioItems.filter(p => p.id !== id));
  };

  const onSubmit = async (data: ServiceProviderData) => {
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/execution-network/join"));
      return;
    }

    setIsSubmitting(true);
    try {
      // Update user to add service provider role and data
      const response = await fetch('/api/service-provider/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          skills: data.skills.join(','),
          portfolio: JSON.stringify(data.portfolioItems)
        }),
      });

      if (response.ok) {
        router.push('/execution-network/dashboard');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </Card>
      </div>
    );
  }

  // Don't render the form if not authenticated (redirect will happen)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Join the Execution Network
            </h1>
            <p className="text-slate-600">Offer your expertise to ambitious founders</p>
          </div>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Service Provider Application</CardTitle>
            <p className="text-center text-slate-600">
              Join our network of vetted experts helping founders build and scale
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</div>
                  Basic Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      {...register("name", { required: "Name is required" })}
                      placeholder="Your professional name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Professional Title *</label>
                    <Input
                      {...register("title", { required: "Title is required" })}
                      placeholder="e.g., Senior Full-Stack Developer"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Professional Bio *</label>
                  <Textarea
                    {...register("bio", { required: "Bio is required" })}
                    placeholder="Describe your experience, expertise, and what makes you great to work with..."
                    rows={4}
                  />
                  {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    {...register("location")}
                    placeholder="e.g., San Francisco, Remote"
                  />
                </div>
              </div>

              {/* Services Offered */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">2</div>
                  Services You Offer
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {serviceTypeOptions.map((service) => {
                    const Icon = service.icon;
                    const isSelected = selectedServices.includes(service.value);
                    
                    return (
                      <div
                        key={service.value}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-purple-300 bg-purple-50' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => toggleServiceType(service.value)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500' : 'bg-slate-100'}`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{service.label}</h4>
                            <p className="text-sm text-slate-600">{service.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills & Expertise */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">3</div>
                  Skills & Expertise
                </h3>

                {/* Suggested skills */}
                {selectedServices.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Suggested skills for your services:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getSuggestedSkills().filter(skill => !skills.includes(skill)).map((skill) => (
                        <Button
                          key={skill}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSkill(skill)}
                          className="text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {skill}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom skill input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Add Skills</label>
                  <div className="flex gap-2">
                    <Input
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={() => addSkill()}>Add</Button>
                  </div>
                </div>

                {/* Selected skills */}
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <select
                    {...register("experience", { required: "Experience level is required" })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500"
                  >
                    <option value="">Select experience level</option>
                    <option value="entry-level">Entry Level (0-2 years)</option>
                    <option value="intermediate">Intermediate (2-5 years)</option>
                    <option value="senior">Senior (5-10 years)</option>
                    <option value="expert">Expert (10+ years)</option>
                  </select>
                  {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
                </div>
              </div>

              {/* Rates & Availability */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">4</div>
                  Rates & Availability
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Hourly Rate (USD) *</label>
                    <Input
                      type="number"
                      {...register("hourlyRate", { 
                        required: "Hourly rate is required",
                        min: { value: 25, message: "Minimum rate is $25/hour" }
                      })}
                      placeholder="75"
                    />
                    {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Availability *</label>
                    <select
                      {...register("availability", { required: "Availability is required" })}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500"
                    >
                      <option value="">Select availability</option>
                      <option value="immediate">Available immediately</option>
                      <option value="within_week">Available within a week</option>
                      <option value="within_month">Available within a month</option>
                      <option value="flexible">Flexible scheduling</option>
                    </select>
                    {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remoteOk"
                    {...register("remoteOk")}
                  />
                  <label htmlFor="remoteOk" className="text-sm">Open to remote work</label>
                </div>
              </div>

              {/* Portfolio */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">5</div>
                  Portfolio & Examples
                </h3>

                {/* Add portfolio item */}
                {showAddPortfolio && (
                  <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                    <h4 className="font-semibold mb-4">Add Portfolio Item</h4>
                    <div className="space-y-4">
                      <Input
                        value={newPortfolioItem.title}
                        onChange={(e) => setNewPortfolioItem({...newPortfolioItem, title: e.target.value})}
                        placeholder="Project title"
                      />
                      <Textarea
                        value={newPortfolioItem.description}
                        onChange={(e) => setNewPortfolioItem({...newPortfolioItem, description: e.target.value})}
                        placeholder="Project description and your role..."
                        rows={3}
                      />
                      <Input
                        value={newPortfolioItem.url}
                        onChange={(e) => setNewPortfolioItem({...newPortfolioItem, url: e.target.value})}
                        placeholder="Project URL (optional)"
                      />
                      <div className="flex gap-2">
                        <Button type="button" onClick={addPortfolioItem}>Add Item</Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddPortfolio(false)}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Portfolio items */}
                <div className="space-y-4">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-slate-600 text-sm">{item.description}</p>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 text-sm underline">
                            View Project
                          </a>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePortfolioItem(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddPortfolio(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Portfolio Item
                </Button>
              </div>

              {/* Submit */}
              <div className="flex justify-center pt-6 border-t">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting || selectedServices.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8"
                >
                  {isSubmitting ? "Submitting Application..." : "Join Execution Network"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}