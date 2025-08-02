"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { FinancingDisclaimer } from "@/components/financing-disclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Building2, 
  Save,
  Eye,
  Plus,
  X,
  Globe,
  Linkedin,
  Twitter
} from "lucide-react";

type ShowcaseFormData = {
  companyName: string;
  tagline: string;
  description: string;
  industry: string;
  stage: string;
  location: string;
  teamSize: number;
  founded: string;
  website: string;
  linkedinUrl: string;
  twitterUrl: string;
  seekingTypes: string[];
  fundingStage: string;
  useOfFunds: string;
  contactMethods: string[];
  preferredContact: string;
};

const industryOptions = [
  "SaaS", "FinTech", "HealthTech", "CleanTech", "E-commerce", "EdTech", 
  "AI/ML", "Blockchain", "IoT", "Cybersecurity", "Gaming", "Other"
];

const stageOptions = [
  "Idea", "MVP", "Seed", "Growth", "Scale"
];

const seekingOptions = [
  "Funding", "Mentorship", "Strategic Partners", "Technical Partners", 
  "Advisors", "Customers", "Team Members"
];

const contactMethodOptions = [
  "Email", "LinkedIn", "Website Form", "Phone", "Calendar Booking"
];

export default function CreateShowcasePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ShowcaseFormData>({
    defaultValues: {
      seekingTypes: [],
      contactMethods: []
    }
  });

  const selectedSeeking = watch("seekingTypes") || [];
  const selectedContactMethods = watch("contactMethods") || [];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/financing/showcase/create"));
      return;
    }
  }, [session, status, router]);

  const onSubmit = async (data: ShowcaseFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would make an API call to create the showcase
      console.log("Creating showcase:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Company showcase created successfully!");
      router.push("/financing/browse");
    } catch (error) {
      console.error("Error creating showcase:", error);
      alert("Failed to create showcase. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayValue = (value: string, currentArray: string[], fieldName: keyof ShowcaseFormData) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    setValue(fieldName, newArray);
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
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
      <div className="p-6 max-w-4xl mx-auto">
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Company Showcase</h1>
          <p className="text-slate-600">Share your company story and connect with potential supporters</p>
        </div>

        {/* Legal Disclaimer */}
        <FinancingDisclaimer className="mb-6" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card className="border-0 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <Input
                    {...register("companyName", { required: "Company name is required" })}
                    placeholder="Your company name"
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tagline *</label>
                  <Input
                    {...register("tagline", { required: "Tagline is required" })}
                    placeholder="One-line description of what you do"
                  />
                  {errors.tagline && (
                    <p className="text-red-500 text-sm mt-1">{errors.tagline.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Description *</label>
                <Textarea
                  {...register("description", { required: "Description is required" })}
                  placeholder="Detailed description of your company, what problem you solve, and your unique approach..."
                  rows={5}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Industry *</label>
                  <select
                    {...register("industry", { required: "Industry is required" })}
                    className="w-full p-3 border border-slate-200 rounded-lg"
                  >
                    <option value="">Select industry</option>
                    {industryOptions.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stage *</label>
                  <select
                    {...register("stage", { required: "Stage is required" })}
                    className="w-full p-3 border border-slate-200 rounded-lg"
                  >
                    <option value="">Select stage</option>
                    {stageOptions.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                  {errors.stage && (
                    <p className="text-red-500 text-sm mt-1">{errors.stage.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Team Size</label>
                  <Input
                    type="number"
                    {...register("teamSize", { valueAsNumber: true })}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    {...register("location")}
                    placeholder="San Francisco, CA or Remote"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Founded</label>
                  <Input
                    {...register("founded")}
                    placeholder="2024"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What You're Seeking */}
          <Card className="border-0 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>What You&apos;re Seeking</CardTitle>
              <p className="text-sm text-slate-600">Select all that apply</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Types of Support Needed *</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {seekingOptions.map((option) => (
                    <div
                      key={option}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedSeeking.includes(option)
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => toggleArrayValue(option, selectedSeeking, "seekingTypes")}
                    >
                      <span className="text-sm font-medium">{option}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Funding Stage (if applicable)</label>
                  <Input
                    {...register("fundingStage")}
                    placeholder="Pre-seed, Seed, Series A, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Use of Funds (if applicable)</label>
                  <Input
                    {...register("useOfFunds")}
                    placeholder="Product development, hiring, marketing..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Social */}
          <Card className="border-0 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Contact & Social Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Website
                  </label>
                  <Input
                    type="url"
                    {...register("website")}
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn
                  </label>
                  <Input
                    {...register("linkedinUrl")}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Contact Methods *</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {contactMethodOptions.map((method) => (
                    <div
                      key={method}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedContactMethods.includes(method)
                          ? 'border-green-300 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => toggleArrayValue(method, selectedContactMethods, "contactMethods")}
                    >
                      <span className="text-sm font-medium">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Contact Method</label>
                <Input
                  {...register("preferredContact")}
                  placeholder="How would you prefer to be contacted initially?"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-0 bg-slate-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview
              </CardTitle>
              <p className="text-sm text-slate-600">This is how your showcase will appear to others</p>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {watch("companyName") || "Your Company Name"}
                    </h3>
                    <p className="text-slate-600 font-medium mb-2">
                      {watch("tagline") || "Your compelling tagline"}
                    </p>
                    <p className="text-slate-600 text-sm">
                      {watch("description") || "Your detailed company description will appear here..."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSeeking.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-center pt-6">
            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Showcase...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Showcase
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}