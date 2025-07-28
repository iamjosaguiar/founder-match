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
  
  // Psychological Assessment
  openness1: number;
  openness2: number;
  conscientiousness1: number;
  conscientiousness2: number;
  extraversion1: number;
  extraversion2: number;
  agreeableness1: number;
  agreeableness2: number;
  neuroticism1: number;
  neuroticism2: number;
  riskTolerance1: number;
  riskTolerance2: number;
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

const psychQuestions = [
  { key: "openness1", trait: "Openness", question: "I enjoy trying new approaches to problems", reverse: false },
  { key: "openness2", trait: "Openness", question: "I am interested in abstract ideas and concepts", reverse: false },
  { key: "conscientiousness1", trait: "Conscientiousness", question: "I pay attention to details in my work", reverse: false },
  { key: "conscientiousness2", trait: "Conscientiousness", question: "I like to have a clear plan before starting projects", reverse: false },
  { key: "extraversion1", trait: "Extraversion", question: "I enjoy being the center of attention", reverse: false },
  { key: "extraversion2", trait: "Extraversion", question: "I feel comfortable around people I don't know", reverse: false },
  { key: "agreeableness1", trait: "Agreeableness", question: "I generally trust others until proven otherwise", reverse: false },
  { key: "agreeableness2", trait: "Agreeableness", question: "I am genuinely interested in other people's well-being", reverse: false },
  { key: "neuroticism1", trait: "Emotional Stability", question: "I remain calm under pressure", reverse: true },
  { key: "neuroticism2", trait: "Emotional Stability", question: "I rarely worry about things I cannot control", reverse: true },
  { key: "riskTolerance1", trait: "Risk Tolerance", question: "I am comfortable with uncertainty in business decisions", reverse: false },
  { key: "riskTolerance2", trait: "Risk Tolerance", question: "I enjoy taking calculated risks for potential rewards", reverse: false },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<CompleteOnboardingData>({
    defaultValues: {
      skills: []
    }
  });

  const watchedValues = watch();
  const skills = watchedValues.skills || [];

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

  const questionsPerPage = 4;
  const totalPsychPages = Math.ceil(psychQuestions.length / questionsPerPage);
  const currentPsychQuestions = psychQuestions.slice(
    (step - 5) * questionsPerPage,
    (step - 4) * questionsPerPage
  );

  const isStep1Complete = !!(watchedValues.title && watchedValues.bio);
  const isStep2Complete = !!(skills.length > 0 && watchedValues.experience);
  const isStep3Complete = !!watchedValues.lookingFor;
  
  // Step validation for business information
  const isStep3BusinessComplete = !!(
    watchedValues.industry && 
    watchedValues.stage && 
    watchedValues.location && 
    watchedValues.timeCommitment && 
    watchedValues.fundingStatus && 
    watchedValues.companyGoals && 
    watchedValues.workStyle
  );

  let isCurrentStepComplete = false;
  if (step === 1) isCurrentStepComplete = isStep1Complete;
  else if (step === 2) isCurrentStepComplete = isStep2Complete;
  else if (step === 3) isCurrentStepComplete = isStep3BusinessComplete;
  else if (step === 4) isCurrentStepComplete = isStep3Complete;
  else if (step >= 5) {
    // For psychology questions (steps 5+)
    isCurrentStepComplete = currentPsychQuestions.every(q => 
      watchedValues[q.key as keyof CompleteOnboardingData]
    );
    
    // Debug psychology questions
    if (step === 6) {
      console.log('Step 6 Psychology Debug:', {
        step,
        currentPsychQuestions: currentPsychQuestions.map(q => q.key),
        questionValues: currentPsychQuestions.map(q => ({
          key: q.key,
          value: watchedValues[q.key as keyof CompleteOnboardingData],
          hasValue: !!watchedValues[q.key as keyof CompleteOnboardingData]
        })),
        isCurrentStepComplete,
        watchedValues: JSON.stringify(watchedValues)
      });
    }
  }

  const onSubmit = async (data: CompleteOnboardingData) => {
    setIsSubmitting(true);
    try {
      // First submit profile data
      const profileResponse = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          bio: data.bio,
          skills: data.skills.join(','),
          experience: data.experience,
          lookingFor: data.lookingFor,
          industry: data.industry,
          stage: data.stage,
          location: data.location,
          remoteOk: data.remoteOk,
          timeCommitment: data.timeCommitment,
          fundingStatus: data.fundingStatus,
          companyGoals: data.companyGoals,
          workStyle: data.workStyle,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // Then submit psychology quiz - ensure all values are numbers
      const quizData = {
        openness1: Number(data.openness1),
        openness2: Number(data.openness2),
        conscientiousness1: Number(data.conscientiousness1),
        conscientiousness2: Number(data.conscientiousness2),
        extraversion1: Number(data.extraversion1),
        extraversion2: Number(data.extraversion2),
        agreeableness1: Number(data.agreeableness1),
        agreeableness2: Number(data.agreeableness2),
        neuroticism1: Number(data.neuroticism1),
        neuroticism2: Number(data.neuroticism2),
        riskTolerance1: Number(data.riskTolerance1),
        riskTolerance2: Number(data.riskTolerance2),
      };

      const quizResponse = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),
      });
      
      if (quizResponse.ok) {
        router.push('/discover');
      } else {
        const error = await quizResponse.json();
        alert(`Error: ${error.message || 'Failed to submit assessment'}`);
      }
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
    
    if (step === 1) {
      dataToSave = {
        title: currentData.title,
        bio: currentData.bio
      };
    } else if (step === 2) {
      dataToSave = {
        skills: currentData.skills?.join(',') || '',
        experience: currentData.experience
      };
    } else if (step === 3) {
      dataToSave = {
        industry: currentData.industry,
        stage: currentData.stage,
        location: currentData.location,
        remoteOk: currentData.remoteOk,
        timeCommitment: currentData.timeCommitment,
        fundingStatus: currentData.fundingStatus,
        companyGoals: currentData.companyGoals,
        workStyle: currentData.workStyle
      };
    } else if (step === 4) {
      dataToSave = {
        lookingFor: currentData.lookingFor
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
    if (step < 3 + totalPsychPages) {
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
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const totalSteps = 4 + totalPsychPages; // Profile + Business + Psychology + Summary

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
              
              {/* Step 1: Basic Information */}
              {step === 1 && (
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

              {/* Step 2: Skills & Experience */}
              {step === 2 && (
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

              {/* Step 3: Business Information */}
              {step === 3 && (
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

              {/* Step 4: What You're Looking For */}
              {step === 4 && (
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

              {/* Steps 5+: Psychology Questions */}
              {step >= 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">
                    Personality Assessment - Part {step - 4} of {totalPsychPages}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree)
                  </p>
                  
                  {currentPsychQuestions.map((q, index) => (
                    <div key={q.key} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-blue-600 font-semibold text-lg min-w-[24px]">
                          {index + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium mb-3">{q.question}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Strongly Disagree</span>
                            <div className="flex gap-4">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <label key={value} className="flex flex-col items-center gap-1 cursor-pointer">
                                  <input
                                    type="radio"
                                    value={value}
                                    {...register(q.key as keyof CompleteOnboardingData, { required: true })}
                                    className="w-4 h-4 text-blue-600"
                                  />
                                  <span className="text-xs text-gray-600">{value}</span>
                                </label>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">Strongly Agree</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
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