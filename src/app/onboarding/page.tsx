"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
// Using regular select elements instead of custom Select component

type CompleteOnboardingData = {
  // User Role Selection
  userRoles: string[];
  
  // Founder Journey & Agreements
  founderJourney: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeBusiness: boolean;
  agreeAccurate: boolean;
  agreeAge: boolean;
  
  // Profile Information
  title: string;
  bio: string;
  skills: string[];
  experience: string;
  lookingFor: string;
  
  // Business Information
  industry: string;
  stage: string;
  location: string;
  remoteOk: boolean;
  timeCommitment: string;
  fundingStatus: string;
  companyGoals: string;
  workStyle: string;
  isTechnical: string;
  
};

// Business options
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

// User Role options
const userRoleOptions = [
  { value: "founder", label: "👤 Founder", description: "I'm building or want to build a startup" },
  { value: "investor", label: "💰 Investor/Mentor", description: "I invest in or mentor startups" },
  { value: "service_provider", label: "🛠️ Service Provider", description: "I provide services to startups (dev, design, marketing, etc.)" },
  { value: "general", label: "🌐 Community Member", description: "I want to connect with the startup ecosystem" },
];

// Founder Journey options
const founderJourneyOptions = [
  { value: "idea-cofounder", label: "I have an idea and want to find a co-founder" },
  { value: "company-cofounder", label: "I have a company and need a co-founder" },
  { value: "exploring", label: "I'm exploring startup opportunities" },
  { value: "join-startup", label: "I want to join someone else's startup" },
];


export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<CompleteOnboardingData>({
    defaultValues: {
      userRoles: [],
      skills: []
    }
  });

  const watchedValues = watch();
  const skills = watchedValues.skills || [];
  const userRoles = watchedValues.userRoles || [];

  // Helper functions for role-based logic
  const isFounder = userRoles.includes('founder');
  const isInvestor = userRoles.includes('investor');
  const isServiceProvider = userRoles.includes('service_provider');
  const isGeneral = userRoles.includes('general');

  // Role selection helpers
  const toggleRole = (role: string) => {
    const currentRoles = userRoles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    setValue("userRoles", newRoles);
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      const newSkills = [...skills, currentSkill.trim()];
      setValue("skills", newSkills);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter(s => s !== skill);
    setValue("skills", newSkills);
  };


  // Step 0: Role Selection
  const isStep0Complete = userRoles.length > 0;
  
  // Step 1: Founder Journey & Agreements (only for founders)
  const isStep1Complete = !isFounder || !!(
    watchedValues.founderJourney &&
    watchedValues.agreeTerms &&
    watchedValues.agreePrivacy &&
    watchedValues.agreeBusiness &&
    watchedValues.agreeAccurate &&
    watchedValues.agreeAge
  );
  
  // Step 2: Basic Profile Information
  const isStep2Complete = !!(watchedValues.title && watchedValues.bio);
  
  // Step 3: Skills & Experience (mainly for founders and service providers)
  const isStep3Complete = (!isFounder && !isServiceProvider) || !!(skills.length > 0 && watchedValues.experience);
  
  // Step 4: What You're Looking For (only for founders seeking co-founders)
  const isStep4Complete = !isFounder || !!watchedValues.lookingFor;
  
  // Step 5: Business Information (only for founders)
  const isStep5Complete = !isFounder || !!(
    watchedValues.industry && 
    watchedValues.stage && 
    watchedValues.location && 
    watchedValues.timeCommitment && 
    watchedValues.fundingStatus && 
    watchedValues.companyGoals && 
    watchedValues.workStyle &&
    watchedValues.isTechnical !== undefined
  );

  // Calculate total steps based on user roles
  const getStepCount = () => {
    let stepCount = 3; // Role selection + Basic profile + Skills (if needed)
    if (isFounder) {
      stepCount += 3; // Founder journey + What you're looking for + Business info
    }
    return stepCount;
  };

  const totalSteps = getStepCount();

  // Dynamic step completion logic
  let isCurrentStepComplete = false;
  if (step === 0) isCurrentStepComplete = isStep0Complete;
  else if (step === 1) isCurrentStepComplete = isStep1Complete;
  else if (step === 2) isCurrentStepComplete = isStep2Complete;
  else if (step === 3) isCurrentStepComplete = isStep3Complete;
  else if (step === 4) isCurrentStepComplete = isStep4Complete;
  else if (step === 5) isCurrentStepComplete = isStep5Complete;

  const onSubmit = async (data: CompleteOnboardingData) => {
    setIsSubmitting(true);
    try {
      // First submit profile data
      const profileData: any = {
        roles: data.userRoles, // Save user roles
        title: data.title,
        bio: data.bio,
        skills: data.skills?.join(',') || '',
        experience: data.experience,
      };

      // Add founder-specific data if user is a founder
      if (data.userRoles.includes('founder')) {
        profileData.founderJourney = data.founderJourney;
        profileData.lookingFor = data.lookingFor;
        profileData.industry = data.industry;
        profileData.stage = data.stage;
        profileData.location = data.location;
        profileData.remoteOk = data.remoteOk;
        profileData.timeCommitment = data.timeCommitment;
        profileData.fundingStatus = data.fundingStatus;
        profileData.companyGoals = data.companyGoals;
        profileData.workStyle = data.workStyle;
        profileData.isTechnical = data.isTechnical === 'true';
      }

      const profileResponse = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // For founders, redirect to comprehensive assessment
      if (data.userRoles.includes('founder')) {
        router.push('/founder-assessment');
        return;
      }
      
      // For non-founders (service providers), go to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveCurrentStep = async () => {
    const currentData = getValues();
    let dataToSave: any = {};
    
    if (step === 0) {
      dataToSave = {
        roles: currentData.userRoles
      };
    } else if (step === 1 && currentData.userRoles?.includes('founder')) {
      dataToSave = {
        founderJourney: currentData.founderJourney
      };
    } else if (step === 2) {
      dataToSave = {
        title: currentData.title,
        bio: currentData.bio
      };
    } else if (step === 3 && (currentData.userRoles?.includes('founder') || currentData.userRoles?.includes('service_provider'))) {
      dataToSave = {
        skills: currentData.skills?.join(',') || '',
        experience: currentData.experience
      };
    } else if (step === 4 && currentData.userRoles?.includes('founder')) {
      dataToSave = {
        lookingFor: currentData.lookingFor
      };
    } else if (step === 5 && currentData.userRoles?.includes('founder')) {
      dataToSave = {
        industry: currentData.industry,
        stage: currentData.stage,
        location: currentData.location,
        remoteOk: currentData.remoteOk,
        timeCommitment: currentData.timeCommitment,
        fundingStatus: currentData.fundingStatus,
        companyGoals: currentData.companyGoals,
        workStyle: currentData.workStyle,
        isTechnical: currentData.isTechnical === 'true'
      };
    }
    
    // Only save if there's data to save
    if (Object.keys(dataToSave).length > 0) {
      try {
        const response = await fetch('/api/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to save step data:', errorText);
          throw new Error(`API error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error saving step:', error);
        throw error;
      }
    }
  };

  const nextStep = async () => {
    console.log('nextStep clicked, current step:', step, 'isCurrentStepComplete:', isCurrentStepComplete);
    console.log('totalSteps:', totalSteps);
    if (step < totalSteps) {
      try {
        console.log('About to save current step...');
        await saveCurrentStep();
        console.log('Step saved successfully, moving to next step');
        setStep(step + 1);
      } catch (error) {
        console.error('Error in nextStep:', error);
        // Still proceed to next step even if save fails
        setStep(step + 1);
      }
    } else {
      console.log('Cannot proceed - at max steps');
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Complete Your Founder Profile
            </CardTitle>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Step {step} of {totalSteps}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i + 1 <= step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 0: Role Selection */}
              {step === 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-center">Choose Your Role(s)</h3>
                  <p className="text-center text-gray-600">Select all that apply to you:</p>
                  
                  <div className="grid gap-4">
                    {userRoleOptions.map((role) => (
                      <div
                        key={role.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          userRoles.includes(role.value)
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleRole(role.value)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={userRoles.includes(role.value)}
                            onChange={() => toggleRole(role.value)}
                            className="w-5 h-5 text-blue-600 mt-1"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{role.label}</h4>
                            <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Founder Journey & Agreements (only for founders) */}
              {step === 1 && isFounder && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-center">Welcome to CoFoundr</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-4">Where are you in your founder journey?</label>
                      <div className="space-y-3">
                        {founderJourneyOptions.map((option) => (
                          <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              value={option.value}
                              {...register("founderJourney", { required: "Please select your founder journey stage" })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                      {errors.founderJourney && (
                        <p className="text-red-500 text-sm mt-2">{errors.founderJourney.message}</p>
                      )}
                    </div>

                    <div className="border-t pt-6">
                      <p className="text-sm font-medium mb-4">Please review and agree to the following:</p>
                      <div className="space-y-3">
                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            {...register("agreeTerms", { required: true })}
                            className="w-4 h-4 text-blue-600 mt-0.5"
                          />
                          <span className="text-sm">
                            I agree to CoFoundr&apos;s{" "}
                            <a href="/terms" target="_blank" className="text-blue-600 underline">
                              Terms of Service
                            </a>
                          </span>
                        </label>

                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            {...register("agreePrivacy", { required: true })}
                            className="w-4 h-4 text-blue-600 mt-0.5"
                          />
                          <span className="text-sm">
                            I agree to CoFoundr&apos;s{" "}
                            <a href="/privacy" target="_blank" className="text-blue-600 underline">
                              Privacy Policy
                            </a>
                          </span>
                        </label>

                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            {...register("agreeBusiness", { required: true })}
                            className="w-4 h-4 text-blue-600 mt-0.5"
                          />
                          <span className="text-sm">
                            I understand this platform is for finding business co-founders
                          </span>
                        </label>

                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            {...register("agreeAccurate", { required: true })}
                            className="w-4 h-4 text-blue-600 mt-0.5"
                          />
                          <span className="text-sm">
                            I will provide accurate information about myself and my experience
                          </span>
                        </label>

                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            {...register("agreeAge", { required: true })}
                            className="w-4 h-4 text-blue-600 mt-0.5"
                          />
                          <span className="text-sm">
                            I am at least 18 years old
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Basic Information */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Basic Information</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Professional Title</label>
                    <Input
                      {...register("title", { required: "Title is required" })}
                      placeholder="e.g., Serial Entrepreneur, Tech Founder, Product Manager"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <Textarea
                      {...register("bio", { required: "Bio is required" })}
                      placeholder="Tell us about yourself, your experience, and what drives you..."
                      rows={4}
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Skills & Experience */}
              {(step === 3 && (isFounder || isServiceProvider)) && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Skills & Experience</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Add Skills</label>
                    <div className="flex gap-2">
                      <Input
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        placeholder="e.g., React, Marketing, Finance"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level</label>
                    <select
                      {...register("experience", { required: "Experience level is required" })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select experience level</option>
                      <option value="first-time">First-time Founder</option>
                      <option value="experienced">Experienced Entrepreneur</option>
                      <option value="serial">Serial Entrepreneur</option>
                      <option value="corporate">Corporate Executive</option>
                    </select>
                    {errors.experience && (
                      <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: What You're Looking For (only for founders) */}
              {step === 4 && isFounder && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">What You&apos;re Looking For</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ideal Co-Founder</label>
                    <Textarea
                      {...register("lookingFor", { required: "Please describe your ideal co-founder" })}
                      placeholder="Describe your ideal co-founder: skills, experience, personality traits..."
                      rows={4}
                    />
                    {errors.lookingFor && (
                      <p className="text-red-500 text-sm mt-1">{errors.lookingFor.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Business Information (only for founders) */}
              {step === 5 && isFounder && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Business Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Industry</label>
                      <select
                        {...register("industry", { required: "Industry is required" })}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                      >
                        <option value="">Select industry</option>
                        {industryOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Current Stage</label>
                      <select
                        {...register("stage", { required: "Stage is required" })}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                      >
                        <option value="">Select stage</option>
                        {stageOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <Input
                        {...register("location", { required: "Location is required" })}
                        placeholder="e.g., San Francisco, Remote"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Time Commitment</label>
                      <select {...register("timeCommitment", { required: "timeCommitment is required" })} className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
                        <option value="">Select commitment</option>
                        {timeCommitmentOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Funding Status</label>
                      <select {...register("fundingStatus", { required: "fundingStatus is required" })} className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
                        <option value="">Select funding status</option>
                        {fundingStatusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Company Goals</label>
                      <select {...register("companyGoals", { required: "companyGoals is required" })} className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
                        <option value="">Select goals</option>
                        {companyGoalsOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Work Style</label>
                    <select {...register("workStyle", { required: "workStyle is required" })} className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
                      <option value="">Select work style</option>
                      {workStyleOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <label className="block text-sm font-medium mb-3">Are you technical? *</label>
                    <p className="text-xs text-slate-600 mb-4">You are a programmer, scientist or engineer who can build the product without outside assistance.</p>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="true"
                          {...register("isTechnical", { required: "Please select if you are technical" })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="false"
                          {...register("isTechnical", { required: "Please select if you are technical" })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remoteOk"
                      {...register("remoteOk")}
                      className="w-4 h-4"
                    />
                    <label htmlFor="remoteOk" className="text-sm">Open to remote collaboration</label>
                  </div>
                </div>
              )}



              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 0}
                >
                  Previous
                </Button>
                
                <div className="flex-1" />
                
                {step < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isCurrentStepComplete}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !isCurrentStepComplete}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? "Completing Setup..." : "Complete Profile"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}