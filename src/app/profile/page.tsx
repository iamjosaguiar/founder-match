"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// Using regular select elements instead of custom Select component
import { Pencil, Plus, X, ExternalLink, Save, ArrowLeft, Camera, Upload, User, Award, Briefcase, Target, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

type ProjectLink = {
  id: string;
  title: string;
  url: string;
  description: string;
};

type ProfileData = {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  experience: string;
  lookingFor: string;
  projectLinks: ProjectLink[];
  avatar?: string;
  // Business Information
  industry?: string;
  stage?: string;
  location?: string;
  remoteOk?: boolean;
  timeCommitment?: string;
  fundingStatus?: string;
  companyGoals?: string;
  workStyle?: string;
  quizScores?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    emotionalStability: number;
    riskTolerance: number;
  };
  personalityProfile?: {
    leadershipStyle: string;
    innovationPreference: string;
    riskProfile: string;
    communicationStyle: string;
    workStyle: string;
    stressHandling: string;
    founderType: string;
  };
};

// Business options (same as onboarding)
const industryOptions = [
  "Technology", "Fintech", "Healthcare", "E-commerce", "AI/ML", "SaaS", 
  "Consumer Products", "B2B Services", "Education", "Real Estate", 
  "Energy", "Food & Beverage", "Media", "Other"
];

const stageOptions = [
  "Idea Stage", "Building MVP", "Early Revenue", "Scaling", "Established"
];

const timeCommitmentOptions = [
  "Full-time", "Part-time", "Evenings/Weekends", "Flexible"
];

const fundingStatusOptions = [
  "Bootstrapped", "Seeking Pre-seed", "Seeking Seed", "Series A+", "Already Funded"
];

const companyGoalsOptions = [
  "Lifestyle Business", "Regional Success", "Scale Nationally", "Global Unicorn"
];

const workStyleOptions = [
  "Highly Structured", "Somewhat Structured", "Flexible", "Very Flexible"
];

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [currentSkill, setCurrentSkill] = useState("");
  const [newProject, setNewProject] = useState({ title: "", url: "", description: "" });
  const [showAddProject, setShowAddProject] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ProfileData>();
  const watchedValues = watch();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchProfile();
  }, [session, status, router, fetchProfile]);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        
        // Set form values
        reset({
          name: data.name || "",
          title: data.title || "",
          bio: data.bio || "",
          skills: data.skills || [],
          experience: data.experience || "",
          lookingFor: data.lookingFor || "",
          projectLinks: data.projectLinks || [],
          avatar: data.avatar || "",
        });
        
        // Set avatar preview
        if (data.avatar) {
          setAvatarPreview(data.avatar);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  const addSkill = () => {
    if (currentSkill.trim() && !watchedValues.skills?.includes(currentSkill.trim())) {
      const newSkills = [...(watchedValues.skills || []), currentSkill.trim()];
      setValue("skills", newSkills);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = (watchedValues.skills || []).filter(s => s !== skill);
    setValue("skills", newSkills);
  };

  const addProject = () => {
    if (newProject.title && newProject.url) {
      const project: ProjectLink = {
        id: Date.now().toString(),
        ...newProject
      };
      const currentProjects = watchedValues.projectLinks || [];
      setValue("projectLinks", [...currentProjects, project]);
      setNewProject({ title: "", url: "", description: "" });
      setShowAddProject(false);
    }
  };

  const removeProject = (projectId: string) => {
    const updatedProjects = (watchedValues.projectLinks || []).filter(p => p.id !== projectId);
    setValue("projectLinks", updatedProjects);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload avatar");
    }

    const data = await response.json();
    return data.avatarUrl;
  };

  const onSubmit = async (data: ProfileData) => {
    try {
      console.log('Form data being submitted:', data);
      
      let avatarUrl = data.avatar;

      // Upload avatar if a new file was selected
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const requestBody = {
        name: data.name,
        title: data.title,
        bio: data.bio,
        skills: Array.isArray(data.skills) ? data.skills.join(",") : (data.skills || ""),
        experience: data.experience,
        lookingFor: data.lookingFor,
        projectLinks: JSON.stringify(data.projectLinks || []),
        avatar: avatarUrl,
        industry: data.industry || "",
        stage: data.stage || "",
        location: data.location || "",
        remoteOk: data.remoteOk || false,
        timeCommitment: data.timeCommitment || "",
        fundingStatus: data.fundingStatus || "",
        companyGoals: data.companyGoals || "",
        workStyle: data.workStyle || "",
      };

      console.log('Request body:', requestBody);

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfileData(updatedData);
        setIsEditing(false);
        setAvatarFile(null);
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(`Error updating profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading profile...</h2>
        </Card>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <Button asChild>
            <Link href="/onboarding">Complete Onboarding</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild className="hover:bg-slate-100">
              <Link href="/discover" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Discover
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-slate-50 text-slate-700">
                <User className="w-3 h-3 mr-1" />
                Profile
              </Badge>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={isEditing ? "border-slate-300" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Header Card */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-1">
                    <Avatar className="w-full h-full rounded-3xl">
                      {avatarPreview || profileData.avatar ? (
                        <img 
                          src={avatarPreview || profileData.avatar} 
                          alt="Profile" 
                          className="w-full h-full object-cover rounded-3xl"
                        />
                      ) : (
                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-3xl">
                          {profileData.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-200">
                          <Camera className="w-5 h-5" />
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        {...register("name", { required: "Name is required" })}
                        placeholder="Your name"
                        className="text-xl font-bold border-slate-200 focus:border-blue-500"
                      />
                      <Input
                        {...register("title", { required: "Title is required" })}
                        placeholder="Professional title"
                        className="text-slate-600 border-slate-200 focus:border-blue-500"
                      />
                      {avatarFile && (
                        <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 p-3 rounded-xl border border-green-200">
                          <Upload className="w-4 h-4" />
                          New photo selected: {avatarFile.name}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        {profileData.name}
                      </h1>
                      <p className="text-xl text-slate-600 mb-4">{profileData.title}</p>
                      {profileData.personalityProfile && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 px-4 py-2 text-sm font-medium">
                          <Award className="w-4 h-4 mr-2" />
                          {profileData.personalityProfile.founderType?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  {...register("bio", { required: "Bio is required" })}
                  placeholder="Tell others about yourself, your background, and your entrepreneurial journey..."
                  rows={4}
                  className="border-slate-200 focus:border-green-500 resize-none"
                />
              ) : (
                <p className="text-slate-600 leading-relaxed text-lg">{profileData.bio}</p>
              )}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                Skills & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="Add a skill (e.g., React, Marketing, Finance)"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      className="border-slate-200 focus:border-purple-500"
                    />
                    <Button 
                      type="button" 
                      onClick={addSkill}
                      className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(watchedValues.skills || []).map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors px-3 py-1" 
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {profileData.skills?.map((skill) => (
                    <Badge 
                      key={skill} 
                      className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200 hover:from-purple-200 hover:to-violet-200 px-3 py-1.5 font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Industry</label>
                    <select
                      {...register("industry")}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    >
                      <option value="">Select industry</option>
                      {industryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Current Stage</label>
                    <select
                      {...register("stage")}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    >
                      <option value="">Select stage</option>
                      {stageOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Location</label>
                    <Input
                      {...register("location")}
                      placeholder="e.g., San Francisco, Remote"
                      className="border-slate-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Time Commitment</label>
                    <select
                      {...register("timeCommitment")}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    >
                      <option value="">Select commitment</option>
                      {timeCommitmentOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Funding Status</label>
                    <select
                      {...register("fundingStatus")}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    >
                      <option value="">Select funding status</option>
                      {fundingStatusOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Company Goals</label>
                    <select
                      {...register("companyGoals")}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    >
                      <option value="">Select goals</option>
                      {companyGoalsOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-slate-700">Work Style</label>
                    <select
                      {...register("workStyle")}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    >
                      <option value="">Select work style</option>
                      {workStyleOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remoteOk"
                        {...register("remoteOk")}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="remoteOk" className="text-sm text-slate-700">Open to remote collaboration</label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.industry && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Industry</span>
                      <p className="text-slate-700">{profileData.industry}</p>
                    </div>
                  )}
                  {profileData.stage && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Stage</span>
                      <p className="text-slate-700">{profileData.stage}</p>
                    </div>
                  )}
                  {profileData.location && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Location</span>
                      <p className="text-slate-700">{profileData.location}</p>
                    </div>
                  )}
                  {profileData.timeCommitment && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Time Commitment</span>
                      <p className="text-slate-700">{profileData.timeCommitment}</p>
                    </div>
                  )}
                  {profileData.fundingStatus && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Funding Status</span>
                      <p className="text-slate-700">{profileData.fundingStatus}</p>
                    </div>
                  )}
                  {profileData.companyGoals && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Company Goals</span>
                      <p className="text-slate-700">{profileData.companyGoals}</p>
                    </div>
                  )}
                  {profileData.workStyle && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-slate-500">Work Style</span>
                      <p className="text-slate-700">{profileData.workStyle}</p>
                    </div>
                  )}
                  {profileData.remoteOk && (
                    <div className="md:col-span-2">
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Remote Friendly
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience & Looking For */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  Experience Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <select
                    {...register("experience", { required: "Experience is required" })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                  >
                    <option value="">Select experience level</option>
                    <option value="first-time">First-time Founder</option>
                    <option value="experienced">Experienced Entrepreneur</option>
                    <option value="serial">Serial Entrepreneur</option>
                    <option value="corporate">Corporate Executive</option>
                  </select>
                ) : (
                  <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200 px-4 py-2 text-sm font-medium">
                    {profileData.experience?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  Looking For
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    {...register("lookingFor", { required: "This field is required" })}
                    placeholder="Describe your ideal co-founder: their skills, experience, personality traits..."
                    rows={3}
                    className="border-slate-200 focus:border-indigo-500 resize-none"
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed">{profileData.lookingFor}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Projects Section */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                  Projects & Links
                </CardTitle>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddProject(true)}
                    className="border-slate-300 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {showAddProject && (
                <div className="mb-6 p-6 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                  <h4 className="font-semibold text-slate-800 mb-3">Add New Project</h4>
                  <Input
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Project title (e.g., E-commerce Platform)"
                    className="border-slate-200 focus:border-blue-500"
                  />
                  <Input
                    value={newProject.url}
                    onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                    placeholder="Project URL (https://...)"
                    className="border-slate-200 focus:border-blue-500"
                  />
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Brief description of the project (optional)"
                    rows={2}
                    className="border-slate-200 focus:border-blue-500 resize-none"
                  />
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      onClick={addProject} 
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Project
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddProject(false)} 
                      size="sm"
                      className="border-slate-300 hover:bg-slate-100"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {(isEditing ? watchedValues.projectLinks : profileData.projectLinks)?.map((project) => (
                  <div key={project.id} className="group bg-gradient-to-r from-slate-50 to-blue-50/30 border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{project.title}</h4>
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 hover:scale-110 transition-all duration-200"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                        {project.description && (
                          <p className="text-slate-600 leading-relaxed">{project.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Live Project</span>
                        </div>
                      </div>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(project.id)}
                          className="opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {(!profileData.projectLinks || profileData.projectLinks.length === 0) && !isEditing && (
                  <div className="text-center py-8 text-slate-500">
                    <LinkIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No projects added yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personality Profile */}
          {profileData.personalityProfile && (
            <Card className="border-0 bg-gradient-to-br from-slate-50 to-indigo-50/30 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  Personality Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                      <div className="font-bold text-slate-700 mb-1">Leadership Style</div>
                      <div className="text-slate-600 capitalize">{profileData.personalityProfile.leadershipStyle}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                      <div className="font-bold text-slate-700 mb-1">Work Style</div>
                      <div className="text-slate-600 capitalize">{profileData.personalityProfile.workStyle}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                      <div className="font-bold text-slate-700 mb-1">Innovation Preference</div>
                      <div className="text-slate-600 capitalize">{profileData.personalityProfile.innovationPreference}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                      <div className="font-bold text-slate-700 mb-1">Risk Profile</div>
                      <div className="text-slate-600 capitalize">{profileData.personalityProfile.riskProfile}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                      <div className="font-bold text-slate-700 mb-1">Communication Style</div>
                      <div className="text-slate-600 capitalize">{profileData.personalityProfile.communicationStyle}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                      <div className="font-bold text-slate-700 mb-1">Stress Handling</div>
                      <div className="text-slate-600 capitalize">{profileData.personalityProfile.stressHandling}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isEditing && (
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}