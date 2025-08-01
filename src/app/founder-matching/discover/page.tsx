"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  X, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Search,
  Filter,
  TrendingUp,
  Users,
  Zap,
  Brain
} from "lucide-react";

type Founder = {
  id: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  experience: string;
  lookingFor: string;
  image?: string;
  profileImage?: string;
  industry?: string;
  stage?: string;
  location?: string;
  remoteOk: boolean;
  timeCommitment?: string;
  fundingStatus?: string;
  personalityProfile?: any;
  compatibilityScore: number;
  avatar: string;
};

export default function DiscoverFoundersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [founders, setFounders] = useState<Founder[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    stage: '',
    remoteOk: false
  });

  // Assessment check function
  const checkAssessmentCompleted = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profile = await response.json();
        
        console.log('Founder-matching discover - profile check:', {
          email: profile.email,
          assessmentCompleted: profile.assessmentCompleted,
          assessmentCompletedType: typeof profile.assessmentCompleted,
          hasAssessmentCompleted: profile.assessmentCompleted === true
        });
        
        const hasBasicProfile = profile.title && profile.bio && profile.experience && profile.lookingFor;
        const hasAssessmentCompleted = profile.assessmentCompleted === true;
        
        if (!hasBasicProfile || !hasAssessmentCompleted) {
          console.log('Redirecting from founder-matching/discover due to missing data:', {
            hasBasicProfile,
            hasAssessmentCompleted,
            assessmentValue: profile.assessmentCompleted
          });
          
          setRedirecting(true);
          
          if (!hasBasicProfile) {
            router.replace('/onboarding');
          } else {
            router.replace('/founder-assessment');
          }
          return false;
        }
        return true;
      } else {
        console.log('Profile fetch failed from founder-matching/discover, redirecting to onboarding');
        setRedirecting(true);
        router.replace('/onboarding');
        return false;
      }
    } catch (error) {
      console.error('Error checking assessment from founder-matching/discover:', error);
      setRedirecting(true);
      router.replace('/onboarding');
      return false;
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/founder-matching/discover"));
      return;
    }
    
    // Check assessment before fetching founders
    checkAssessmentCompleted().then(canProceed => {
      if (canProceed) {
        fetchFounders();
      }
    });
  }, [session, status, router, filters]);

  const fetchFounders = async () => {
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      if (filters.industry) params.append('industry', filters.industry);
      if (filters.stage) params.append('stage', filters.stage);
      if (filters.remoteOk) params.append('remoteOk', 'true');
      
      const response = await fetch(`/api/founders/discover?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setFounders(data.founders);
        setCurrentIndex(0);
      } else if (response.status === 401) {
        router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/founder-matching/discover"));
        return;
      }
    } catch (error) {
      console.error('Error fetching founders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async (liked: boolean) => {
    if (!founders[currentIndex] || matching) return;

    setMatching(true);
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: founders[currentIndex].id,
          liked
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.matched) {
          // Show match notification - could be a toast/modal
          alert("🎉 It's a match! You can now connect with this founder.");
        }
        
        // Move to next founder
        setCurrentIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error recording match:', error);
    } finally {
      setMatching(false);
    }
  };

  const currentFounder = founders[currentIndex];

  if (status === "loading" || loading || redirecting) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">
              {redirecting ? "Checking assessment..." : "Finding potential co-founders..."}
            </p>
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Discover Co-Founders</h1>
              <p className="text-slate-600">Find your perfect founding partner through personality-based matching</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="mb-6 bg-slate-50 border-slate-200">
              <CardContent className="p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <select
                    value={filters.industry}
                    onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full p-3 border border-slate-200 rounded-xl"
                  >
                    <option value="">All Industries</option>
                    <option value="fintech">Fintech</option>
                    <option value="healthtech">HealthTech</option>
                    <option value="edtech">EdTech</option>
                    <option value="saas">SaaS</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="other">Other</option>
                  </select>
                  
                  <select
                    value={filters.stage}
                    onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                    className="w-full p-3 border border-slate-200 rounded-xl"
                  >
                    <option value="">All Stages</option>
                    <option value="idea">Idea</option>
                    <option value="mvp">MVP</option>
                    <option value="early-revenue">Early Revenue</option>
                    <option value="scaling">Scaling</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remoteOk"
                      checked={filters.remoteOk}
                      onChange={(e) => setFilters(prev => ({ ...prev, remoteOk: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="remoteOk" className="text-sm font-medium">
                      Remote-friendly only
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        {!currentFounder || currentIndex >= founders.length ? (
          <Card className="text-center p-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-4">You've seen all available founders!</h3>
            <p className="text-slate-600 mb-6">
              Check back later for new members, or adjust your filters to see more profiles.
            </p>
            <Button onClick={fetchFounders} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Search className="w-4 h-4 mr-2" />
              Search Again
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Founder Card */}
            <div className="lg:col-span-3">
              <Card className="border-0 bg-white shadow-xl overflow-hidden">
                <div className="relative">
                  {/* Compatibility Score */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-sm font-bold px-3 py-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {currentFounder.compatibilityScore}% Match
                    </Badge>
                  </div>

                  {/* Header */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center">
                    <UserAvatar 
                      size="xl" 
                      user={{
                        name: currentFounder.name,
                        email: null,
                        image: currentFounder.image,
                        profileImage: currentFounder.profileImage
                      }}
                      className="mx-auto mb-4"
                    />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentFounder.name}</h2>
                    <p className="text-lg text-slate-600 mb-4">{currentFounder.title}</p>
                    
                    {/* Quick Info */}
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                      {currentFounder.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {currentFounder.location}
                        </div>
                      )}
                      {currentFounder.industry && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {currentFounder.industry}
                        </div>
                      )}
                      {currentFounder.stage && (
                        <Badge variant="secondary" className="text-xs">
                          {currentFounder.stage}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-8">
                    {/* Bio */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-slate-900 mb-3">About</h3>
                      <p className="text-slate-600 leading-relaxed">{currentFounder.bio}</p>
                    </div>

                    {/* Skills */}
                    {currentFounder.skills.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 mb-3">Skills & Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {currentFounder.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Looking For */}
                    {currentFounder.lookingFor && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 mb-3">Looking For</h3>
                        <p className="text-slate-600">{currentFounder.lookingFor}</p>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {currentFounder.experience && (
                        <div>
                          <span className="font-medium text-slate-900">Experience:</span>
                          <p className="text-slate-600">{currentFounder.experience}</p>
                        </div>
                      )}
                      {currentFounder.timeCommitment && (
                        <div>
                          <span className="font-medium text-slate-900">Commitment:</span>
                          <p className="text-slate-600">{currentFounder.timeCommitment}</p>
                        </div>
                      )}
                      {currentFounder.fundingStatus && (
                        <div>
                          <span className="font-medium text-slate-900">Funding:</span>
                          <p className="text-slate-600">{currentFounder.fundingStatus}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-slate-900">Remote:</span>
                        <p className="text-slate-600">{currentFounder.remoteOk ? 'Open to remote' : 'Prefers in-person'}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* Action Panel */}
            <div className="lg:col-span-2">
              <div className="sticky top-6">
                <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-50 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="mb-6">
                      <Brain className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                      <h3 className="font-bold text-lg mb-2">Make Your Choice</h3>
                      <p className="text-sm text-slate-600">
                        Like this founder to potentially match, or pass to see the next profile.
                      </p>
                    </div>

                    <div className="flex gap-4 mb-6">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleMatch(false)}
                        disabled={matching}
                        className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        <X className="w-5 h-5 mr-2 text-red-500" />
                        Pass
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => handleMatch(true)}
                        disabled={matching}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        Like
                      </Button>
                    </div>

                    <div className="text-xs text-slate-500">
                      {currentIndex + 1} of {founders.length} founders
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="mt-4 border-0 bg-white shadow-lg">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-3">Your Discovery Stats</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Profiles viewed:</span>
                        <span className="font-medium">{currentIndex}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Remaining:</span>
                        <span className="font-medium">{founders.length - currentIndex}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}