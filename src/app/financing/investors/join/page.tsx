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
  Users, 
  Save,
  Plus,
  X,
  Globe,
  Linkedin,
  Calendar,
  CheckCircle
} from "lucide-react";

type InvestorProfileData = {
  profileType: string;
  organization: string;
  title: string;
  bio: string;
  expertise: string[];
  interestedIn: string[];
  stageInterest: string[];
  geographic: string[];
  website: string;
  linkedin: string;
  calendlyUrl: string;
  publicProfile: boolean;
  openToContact: boolean;
};

const profileTypeOptions = [
  { value: "investor", label: "Angel Investor" },
  { value: "investor", label: "VC Partner/Associate" },
  { value: "mentor", label: "Industry Mentor" },
  { value: "advisor", label: "Strategic Advisor" },
  { value: "mentor", label: "Former Founder" }
];

const expertiseOptions = [
  "Product Strategy", "Engineering", "Sales", "Marketing", "Operations", 
  "Finance", "Legal", "HR", "Business Development", "International Expansion",
  "Fundraising", "Due Diligence", "Board Management", "Exit Strategy"
];

const industryOptions = [
  "SaaS", "FinTech", "HealthTech", "CleanTech", "E-commerce", "EdTech", 
  "AI/ML", "Blockchain", "IoT", "Cybersecurity", "Gaming", "Marketplaces",
  "B2B", "B2C", "Hardware", "Enterprise Software"
];

const stageOptions = [
  "Idea", "MVP", "Pre-seed", "Seed", "Series A", "Series B", "Series C+", 
  "Growth", "Scale", "Exit Prep"
];

const geographicOptions = [
  "Silicon Valley", "San Francisco", "Los Angeles", "Seattle", "Austin", 
  "Denver", "Chicago", "NYC", "Boston", "Miami", "Toronto", "London", 
  "Berlin", "Singapore", "Remote", "US Only", "North America", "Global"
];

export default function JoinInvestorNetworkPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<InvestorProfileData>({
    defaultValues: {
      expertise: [],
      interestedIn: [],
      stageInterest: [],
      geographic: [],
      publicProfile: true,
      openToContact: true
    }
  });

  const selectedExpertise = watch("expertise") || [];
  const selectedIndustries = watch("interestedIn") || [];
  const selectedStages = watch("stageInterest") || [];
  const selectedGeographic = watch("geographic") || [];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/financing/investors/join"));
      return;
    }
  }, [session, status, router]);

  const onSubmit = async (data: InvestorProfileData) => {
    setIsSubmitting(true);
    try {
      // Here you would make an API call to create the investor profile
      console.log("Creating investor profile:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Investor profile created successfully! Welcome to the network.");
      router.push("/financing/investors");
    } catch (error) {
      console.error("Error creating investor profile:", error);
      alert("Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayValue = (value: string, currentArray: string[], fieldName: keyof InvestorProfileData) => {
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
              <Link href="/financing/investors" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Investor Network
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join Investor Network</h1>
          <p className="text-slate-600">Create your profile to connect with innovative startups seeking support</p>
        </div>

        {/* Legal Disclaimer */}
        <FinancingDisclaimer className="mb-6" />

        {/* Network Benefits */}
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Benefits of Joining Our Network</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Curated Deal Flow</h4>
                  <p className="text-sm text-blue-700">Access vetted startup opportunities matched to your interests</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Quality Founders</h4>
                  <p className="text-sm text-blue-700">Connect with serious entrepreneurs building innovative companies</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Efficient Networking</h4>
                  <p className="text-sm text-blue-700">Smart matching based on your expertise and investment criteria</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">No Commitment</h4>
                  <p className="text-sm text-blue-700">Explore opportunities at your own pace with no obligations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card className="border-0 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Profile Type *</label>
                <select
                  {...register("profileType", { required: "Profile type is required" })}
                  className="w-full p-3 border border-slate-200 rounded-lg"
                >
                  <option value="">Select your role</option>
                  {profileTypeOptions.map(option => (
                    <option key={option.label} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.profileType && (
                  <p className="text-red-500 text-sm mt-1">{errors.profileType.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization</label>
                  <Input
                    {...register("organization")}
                    placeholder="Your company, fund, or 'Independent'"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Partner, Angel Investor, Former CEO, etc."
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Professional Bio *</label>
                <Textarea
                  {...register("bio", { required: "Bio is required" })}
                  placeholder="Describe your background, investment experience, and what you bring to founders..."
                  rows={5}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expertise */}
          <Card className="border-0 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
              <p className="text-sm text-slate-600">Select your key areas of expertise (max 6)</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                {expertiseOptions.map((skill) => (
                  <div
                    key={skill}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedExpertise.includes(skill)
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => {
                      if (selectedExpertise.length < 6 || selectedExpertise.includes(skill)) {
                        toggleArrayValue(skill, selectedExpertise, "expertise");
                      }
                    }}
                  >
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
              {selectedExpertise.length >= 6 && (
                <p className="text-sm text-slate-500 mt-2">Maximum 6 expertise areas selected</p>
              )}
            </CardContent>
          </Card>

          {/* Interest Areas */}
          <Card className="border-0 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Investment/Mentoring Interests</CardTitle>
              <p className="text-sm text-slate-600">What types of companies are you interested in supporting?</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Industries</label>
                <div className="grid md:grid-cols-4 gap-3">
                  {industryOptions.map((industry) => (
                    <div
                      key={industry}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedIndustries.includes(industry)
                          ? 'border-green-300 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => toggleArrayValue(industry, selectedIndustries, "interestedIn")}
                    >
                      <span className="text-sm font-medium">{industry}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Stages</label>
                <div className="grid md:grid-cols-5 gap-3">
                  {stageOptions.map((stage) => (
                    <div
                      key={stage}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedStages.includes(stage)
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => toggleArrayValue(stage, selectedStages, "stageInterest")}
                    >
                      <span className="text-sm font-medium">{stage}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Geographic Preferences</label>
                <div className="grid md:grid-cols-4 gap-3">
                  {geographicOptions.map((geo) => (
                    <div
                      key={geo}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedGeographic.includes(geo)
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => toggleArrayValue(geo, selectedGeographic, "geographic")}
                    >
                      <span className="text-sm font-medium">{geo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-0 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Contact & Social</CardTitle>
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
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn Profile
                  </label>
                  <Input
                    {...register("linkedin")}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Calendly URL (Optional)
                </label>
                <Input
                  {...register("calendlyUrl")}
                  placeholder="https://calendly.com/yourname"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Allow founders to easily schedule meetings with you
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="border-0 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Privacy & Contact Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium">Public Profile</h4>
                  <p className="text-sm text-slate-600">Show your profile in the investor directory</p>
                </div>
                <input
                  type="checkbox"
                  {...register("publicProfile")}
                  className="rounded"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium">Open to Contact</h4>
                  <p className="text-sm text-slate-600">Allow founders to send you introduction requests</p>
                </div>
                <input
                  type="checkbox"
                  {...register("openToContact")}
                  className="rounded"
                />
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
                  Creating Profile...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Join Network
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}