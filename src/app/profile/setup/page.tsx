"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    skills: [] as string[],
    experience: "",
    lookingFor: "",
  });

  const [currentSkill, setCurrentSkill] = useState("");

  const addSkill = () => {
    if (currentSkill.trim() && !profile.skills.includes(currentSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, currentSkill.trim()] });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Create Your Founder Profile
            </CardTitle>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">Step {step} of 3</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i <= step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Basic Information</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Professional Title</label>
                  <Input
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    placeholder="e.g., Serial Entrepreneur, Tech Founder, Product Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell us about yourself, your experience, and what drives you..."
                    rows={4}
                  />
                </div>
              </div>
            )}

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
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button onClick={addSkill} type="button">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <select
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select experience level</option>
                    <option value="first-time">First-time Founder</option>
                    <option value="experienced">Experienced Entrepreneur</option>
                    <option value="serial">Serial Entrepreneur</option>
                    <option value="corporate">Corporate Executive</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">What You&apos;re Looking For</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Ideal Co-Founder</label>
                  <Textarea
                    value={profile.lookingFor}
                    onChange={(e) => setProfile({ ...profile, lookingFor: e.target.value })}
                    placeholder="Describe your ideal co-founder: skills, experience, personality traits..."
                    rows={4}
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Profile Preview</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Title:</strong> {profile.title}</p>
                    <p><strong>Bio:</strong> {profile.bio.slice(0, 100)}...</p>
                    <p><strong>Skills:</strong> {profile.skills.join(", ")}</p>
                    <p><strong>Experience:</strong> {profile.experience}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Next
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/discover">Complete Profile</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}