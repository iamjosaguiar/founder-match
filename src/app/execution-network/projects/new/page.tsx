"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Code, Palette, Megaphone, Scale, FileText, Camera, Monitor } from "lucide-react";
import Link from "next/link";

type ProjectData = {
  title: string;
  description: string;
  serviceType: string;
  budget?: number;
  timeline: string;
  complexity: string;
  requirements?: string;
  techStack: string[];
  deliverables?: string;
};

const serviceTypeOptions = [
  { 
    value: "development", 
    label: "Development", 
    icon: Code, 
    description: "Web/mobile apps, APIs, databases",
    techOptions: ["React", "Node.js", "Python", "iOS", "Android", "DevOps", "Vue.js", "Django", "Ruby on Rails"]
  },
  { 
    value: "design", 
    label: "Design", 
    icon: Palette, 
    description: "UI/UX, branding, graphics",
    techOptions: ["Figma", "Adobe Creative", "Sketch", "InVision", "Principle", "Framer"]
  },
  { 
    value: "marketing", 
    label: "Marketing", 
    icon: Megaphone, 
    description: "Growth, content, paid ads, SEO",
    techOptions: ["Google Ads", "Facebook Ads", "SEO", "Content Marketing", "Email Marketing", "Analytics"]
  },
  { 
    value: "legal", 
    label: "Legal", 
    icon: Scale, 
    description: "Contracts, compliance, IP",
    techOptions: ["Business Law", "Contracts", "IP Law", "Compliance", "Corporate Law"]
  },
  { 
    value: "copywriting", 
    label: "Copywriting", 
    icon: FileText, 
    description: "Website copy, marketing content",
    techOptions: ["Website Copy", "Email Marketing", "Sales Copy", "Content Strategy", "SEO Writing"]
  },
  { 
    value: "video", 
    label: "Video Production", 
    icon: Camera, 
    description: "Video editing, motion graphics",
    techOptions: ["Video Editing", "Motion Graphics", "Animation", "After Effects", "Premiere Pro"]
  },
  { 
    value: "consulting", 
    label: "Business Consulting", 
    icon: Monitor, 
    description: "Strategy, operations, finance",
    techOptions: ["Business Strategy", "Operations", "Financial Modeling", "Process Optimization"]
  }
];

const timelineOptions = [
  { value: "asap", label: "ASAP (Rush job)" },
  { value: "within_week", label: "Within a week" },
  { value: "within_month", label: "Within a month" },
  { value: "flexible", label: "Flexible timeline" }
];

const complexityOptions = [
  { value: "simple", label: "Simple", description: "Straightforward task, clear requirements" },
  { value: "medium", label: "Medium", description: "Some complexity, may need discussion" },
  { value: "complex", label: "Complex", description: "Multi-faceted project, custom solution needed" }
];

export default function PostProject() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/execution-network/projects/new"));
      return;
    }
  }, [session, status, router]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTech, setCurrentTech] = useState("");

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProjectData>({
    defaultValues: {
      techStack: [],
      timeline: "flexible",
      complexity: "medium"
    }
  });

  const watchedValues = watch();
  const selectedServiceType = watchedValues.serviceType;
  const techStack = watchedValues.techStack || [];

  const getServiceTypeOption = () => {
    return serviceTypeOptions.find(option => option.value === selectedServiceType);
  };

  const addTech = (tech?: string) => {
    const techToAdd = tech || currentTech.trim();
    if (techToAdd && !techStack.includes(techToAdd)) {
      setValue("techStack", [...techStack, techToAdd]);
      setCurrentTech("");
    }
  };

  const removeTech = (tech: string) => {
    setValue("techStack", techStack.filter(t => t !== tech));
  };

  const onSubmit = async (data: ProjectData) => {
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/execution-network/projects/new"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/execution-network/projects');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Project creation error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (status === "loading") {
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

  // Don't render the form if not authenticated (redirect will happen)
  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/execution-network/projects" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Post a New Project
            </h1>
            <p className="text-slate-600">Get expert help from our execution network</p>
          </div>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Project Details</CardTitle>
            <p className="text-center text-slate-600">
              Tell us about your project to find the perfect service provider
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Project Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</div>
                  Project Overview
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project Title *</label>
                  <Input
                    {...register("title", { required: "Project title is required" })}
                    placeholder="e.g., Build MVP for fitness tracking app"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Description *</label>
                  <Textarea
                    {...register("description", { required: "Project description is required" })}
                    placeholder="Describe your project, what you're building, and what success looks like..."
                    rows={4}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>
              </div>

              {/* Service Type */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">2</div>
                  Service Type
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {serviceTypeOptions.map((service) => {
                    const Icon = service.icon;
                    const isSelected = selectedServiceType === service.value;
                    
                    return (
                      <div
                        key={service.value}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-purple-300 bg-purple-50' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setValue("serviceType", service.value)}
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

              {/* Tech Stack / Requirements */}
              {selectedServiceType && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">3</div>
                    Technical Requirements
                  </h3>

                  {/* Suggested tech based on service type */}
                  {getServiceTypeOption() && (
                    <div>
                      <p className="text-sm font-medium mb-2">Suggested technologies/skills:</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getServiceTypeOption()!.techOptions.filter(tech => !techStack.includes(tech)).map((tech) => (
                          <Button
                            key={tech}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addTech(tech)}
                            className="text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {tech}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom tech input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Add Technologies/Skills</label>
                    <div className="flex gap-2">
                      <Input
                        value={currentTech}
                        onChange={(e) => setCurrentTech(e.target.value)}
                        placeholder="Add a technology or skill..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                      />
                      <Button type="button" onClick={() => addTech()}>Add</Button>
                    </div>
                  </div>

                  {/* Selected tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTech(tech)}>
                        {tech} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Scope */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">4</div>
                  Project Scope
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget (USD)</label>
                    <Input
                      type="number"
                      {...register("budget", { min: { value: 100, message: "Minimum budget is $100" } })}
                      placeholder="e.g., 5000"
                    />
                    {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Timeline</label>
                    <select
                      {...register("timeline")}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500"
                    >
                      {timelineOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Complexity</label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {complexityOptions.map((option) => {
                      const isSelected = watchedValues.complexity === option.value;
                      return (
                        <div
                          key={option.value}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-300 bg-blue-50' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          onClick={() => setValue("complexity", option.value)}
                        >
                          <h4 className="font-semibold text-slate-900">{option.label}</h4>
                          <p className="text-sm text-slate-600">{option.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">5</div>
                  Additional Details
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-2">Detailed Requirements</label>
                  <Textarea
                    {...register("requirements")}
                    placeholder="Provide any specific requirements, constraints, or additional context..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Deliverables</label>
                  <Textarea
                    {...register("deliverables")}
                    placeholder="What do you expect to receive? (e.g., source code, designs, documentation, etc.)"
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-center pt-6 border-t">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting || !selectedServiceType}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8"
                >
                  {isSubmitting ? "Posting Project..." : "Post Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}