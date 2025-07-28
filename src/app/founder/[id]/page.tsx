"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, ExternalLink, Heart, X, Award, MessageCircle } from "lucide-react";
import Link from "next/link";

// Mock founder data - in real app this would come from API
const mockFounders = {
  "1": {
    id: "1",
    name: "Sarah Chen",
    title: "Tech Entrepreneur & Former Google PM",
    bio: "I'm a former Google Product Manager with 6 years of experience building AI-powered tools that have been used by millions. I'm passionate about using technology to solve real-world problems and make people's lives more productive. Currently working on a revolutionary AI productivity platform that automates repetitive business tasks using advanced LLMs. I've successfully launched 3 products at Google and am now ready to build my own company with the right technical co-founder.",
    skills: ["Product Management", "AI/ML Strategy", "User Research", "Go-to-Market", "Team Leadership", "Fundraising"],
    experience: "experienced",
    lookingFor: "I'm looking for a technical co-founder with deep ML/AI expertise, preferably someone who has worked with large language models, has experience building scalable backend systems, and shares my passion for creating products that genuinely improve people's workflows. Ideally someone who can lead the technical vision while I handle product, business development, and go-to-market strategy.",
    avatar: "SC",
    projectLinks: [
      {
        id: "1",
        title: "AI Task Automation Platform",
        url: "https://example.com/ai-platform",
        description: "MVP of an AI-powered platform that automates repetitive business workflows using natural language processing."
      },
      {
        id: "2", 
        title: "Product Strategy Framework",
        url: "https://example.com/framework",
        description: "Open-source framework for product discovery that I developed at Google, now used by 50+ startups."
      }
    ],
    personalityProfile: {
      leadershipStyle: "directive",
      innovationPreference: "high", 
      riskProfile: "risk-seeking",
      communicationStyle: "expressive",
      workStyle: "structured",
      stressHandling: "resilient",
      founderType: "visionary-leader"
    },
    quizScores: {
      openness: 4.5,
      conscientiousness: 4.2,
      extraversion: 3.8,
      agreeableness: 4.0,
      neuroticism: 2.1,
      emotionalStability: 3.9,
      riskTolerance: 4.3
    }
  },
  "2": {
    id: "2",
    name: "Marcus Rodriguez", 
    title: "Senior Full-Stack Developer",
    bio: "Passionate full-stack developer with 8 years of experience building and scaling web applications. I've worked at 3 different startups, taking them from MVP to 1M+ users. My expertise lies in React, Node.js, and cloud infrastructure. I'm particularly interested in fintech and have built several trading and payment processing systems. Now looking to transition from employee to founder and build something impactful with the right business-minded co-founder.",
    skills: ["React", "Node.js", "Python", "AWS", "PostgreSQL", "Docker", "System Architecture"],
    experience: "first-time",
    lookingFor: "Seeking a business-minded co-founder with domain expertise in fintech, healthcare, or B2B SaaS. Someone who can handle sales, marketing, and business development while I focus on building the technical product. Ideally someone with industry connections and experience raising funding.",
    avatar: "MR",
    projectLinks: [
      {
        id: "1",
        title: "Crypto Trading Bot",
        url: "https://github.com/marcus/trading-bot",
        description: "Algorithmic trading bot that uses machine learning to analyze market trends and execute trades automatically."
      },
      {
        id: "2",
        title: "Payment Processing API",
        url: "https://example.com/payments-api", 
        description: "Secure payment processing API handling $2M+ in monthly transactions for multiple e-commerce platforms."
      }
    ],
    personalityProfile: {
      leadershipStyle: "supportive",
      innovationPreference: "medium",
      riskProfile: "balanced", 
      communicationStyle: "diplomatic",
      workStyle: "structured",
      stressHandling: "resilient",
      founderType: "executor"
    },
    quizScores: {
      openness: 3.8,
      conscientiousness: 4.5,
      extraversion: 2.9,
      agreeableness: 3.7,
      neuroticism: 2.3,
      emotionalStability: 3.7,
      riskTolerance: 3.2
    }
  }
};

export default function FounderProfile() {
  const params = useParams();
  const router = useRouter();
  const [founder, setFounder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const founderId = params.id as string;
    
    const fetchFounder = async () => {
      try {
        // First try to fetch from the API
        const response = await fetch('/api/users');
        if (response.ok) {
          const users = await response.json();
          const founderData = users.find((user: any) => user.id === founderId);
          
          if (founderData) {
            setFounder(founderData);
          } else {
            // Fallback to mock data if not found in API
            const mockFounder = mockFounders[founderId as keyof typeof mockFounders];
            if (mockFounder) {
              setFounder(mockFounder);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching founder:', error);
        // Fallback to mock data on error
        const mockFounder = mockFounders[founderId as keyof typeof mockFounders];
        if (mockFounder) {
          setFounder(mockFounder);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchFounder();
  }, [params.id]);

  const handleInteraction = (liked: boolean) => {
    const action = liked ? "liked" : "passed on";
    alert(`You ${action} ${founder.name}! In a real app, this would update your matches.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading profile...</h2>
        </Card>
      </div>
    );
  }

  if (!founder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Founder not found</h2>
          <Button asChild>
            <Link href="/matches">Back to Matches</Link>
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
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-slate-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-slate-50 text-slate-700">
                <Award className="w-3 h-3 mr-1" />
                {founder.personalityProfile.founderType?.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link href="/matches" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header Card */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-1">
                  <Avatar className="w-full h-full rounded-3xl">
                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-3xl">
                      {founder.avatar}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                    {founder.name}
                  </h1>
                  <p className="text-xl text-slate-600 mb-4">{founder.title}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <Award className="w-4 h-4 mr-2" />
                      {founder.personalityProfile.founderType?.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                    <Badge variant="outline" className="border-slate-300">
                      {founder.experience?.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed text-lg">{founder.bio}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {founder.skills.map((skill: string) => (
                  <Badge 
                    key={skill} 
                    className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200 hover:from-purple-200 hover:to-violet-200 px-3 py-1.5 font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Looking For */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Looking For</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">{founder.lookingFor}</p>
            </CardContent>
          </Card>

          {/* Projects */}
          {founder.projectLinks && founder.projectLinks.length > 0 && (
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Projects & Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {founder.projectLinks.map((project: any) => (
                    <div key={project.id} className="bg-gradient-to-r from-slate-50 to-blue-50/30 border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-slate-800">{project.title}</h4>
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 hover:scale-110 transition-all duration-200"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{project.description}</p>
                          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Live Project</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personality Profile */}
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-indigo-50/30 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Personality Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                    <div className="font-bold text-slate-700 mb-1">Leadership Style</div>
                    <div className="text-slate-600 capitalize">{founder.personalityProfile.leadershipStyle}</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                    <div className="font-bold text-slate-700 mb-1">Work Style</div>
                    <div className="text-slate-600 capitalize">{founder.personalityProfile.workStyle}</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                    <div className="font-bold text-slate-700 mb-1">Innovation</div>
                    <div className="text-slate-600 capitalize">{founder.personalityProfile.innovationPreference}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                    <div className="font-bold text-slate-700 mb-1">Risk Profile</div>
                    <div className="text-slate-600 capitalize">{founder.personalityProfile.riskProfile}</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                    <div className="font-bold text-slate-700 mb-1">Communication</div>
                    <div className="text-slate-600 capitalize">{founder.personalityProfile.communicationStyle}</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                    <div className="font-bold text-slate-700 mb-1">Stress Handling</div>
                    <div className="text-slate-600 capitalize">{founder.personalityProfile.stressHandling}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleInteraction(false)}
              className="flex-1 max-w-xs text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="w-5 h-5 mr-2" />
              Pass
            </Button>
            <Button
              size="lg"
              onClick={() => handleInteraction(true)}
              className="flex-1 max-w-xs bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Heart className="w-5 h-5 mr-2" />
              Interested
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}