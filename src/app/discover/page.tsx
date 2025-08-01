"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, X, User, Filter, MapPin, Building, DollarSign, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Founder = {
  id: string;
  name: string;
  email?: string;
  title: string;
  bio: string;
  skills: string[];
  experience: string;
  lookingFor: string;
  avatar: string;
  profileImage?: string;
  industry?: string;
  stage?: string;
  location?: string;
  remoteOk?: boolean;
  timeCommitment?: string;
  fundingStatus?: string;
  companyGoals?: string;
  workStyle?: string;
  isTechnical?: boolean;
  projectLinks?: Array<{
    id: string;
    title: string;
    url: string;
    description: string;
  }>;
  quizScores?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    emotionalStability: number;
    riskTolerance: number;
  };
  
  // New founder assessment fields
  assessmentCompleted?: boolean;
  motivation?: string;
  founderPersonality?: string;
  pressureResponse?: string;
  conflictHandling?: string;
  communicationStyleAssessment?: string;
  longTermVision?: string;
  idealExit?: string;
  weeklyCommitment?: number;
  fullTimeReady?: boolean;
  noPayCommitment?: boolean;
  locationFlexible?: boolean;
  riskAppetite?: number;
  topSkills?: string;
  weakAreas?: string;
  preferredRoles?: string;
  technicalLevel?: string;
  portfolioLinks?: string;
  biggestAchievement?: string;
  currentStage?: string;
  lookingToJoin?: string;
  passionateIndustries?: string;
  domainExperience?: boolean;
  previousStartupExp?: boolean;
  workingStyleAssessment?: string;
  workPreference?: string;
  timezoneFlexibility?: string;
  meetingRhythm?: string;
  collaborationScale?: number;
  scenarioResponse?: string;
  equityExpectation?: string;
  dealbreakers?: string;
  previousCofounderExp?: string;
  psychometricData?: any;
  
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

type FilterCriteria = {
  industry: string[];
  stage: string[];
  location: string[];
  remoteOk: boolean | null;
  timeCommitment: string[];
  fundingStatus: string[];
  companyGoals: string[];
  workStyle: string[];
  isTechnical: boolean | null;
};

export default function Discover() {
  const { data: session } = useSession();
  const router = useRouter();
  const [allFounders, setAllFounders] = useState<Founder[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    industry: [],
    stage: [],
    location: [],
    remoteOk: null,
    timeCommitment: [],
    fundingStatus: [],
    companyGoals: [],
    workStyle: [],
    isTechnical: null,
  });
  const [currentUserProfile, setCurrentUserProfile] = useState<Founder | null>(null);

  const filterOptions = {
    industry: ['Tech', 'Fintech', 'Healthcare', 'E-commerce', 'SaaS', 'AI/ML', 'Biotech', 'EdTech', 'CleanTech', 'Other'],
    stage: ['Idea', 'MVP', 'Early Revenue', 'Scaling', 'Growth'],
    timeCommitment: ['Full-time', 'Part-time', 'Flexible'],
    fundingStatus: ['Bootstrapped', 'Seeking', 'Funded'],
    companyGoals: ['Lifestyle', 'Scale', 'Unicorn'],
    workStyle: ['Structured', 'Flexible', 'Fast-paced', 'Methodical']
  };

  const applyFilters = useCallback((foundersList: Founder[]) => {
    return foundersList.filter(founder => {
      if (filters.industry.length > 0 && !filters.industry.includes(founder.industry || '')) return false;
      if (filters.stage.length > 0 && !filters.stage.includes(founder.stage || '')) return false;
      if (filters.timeCommitment.length > 0 && !filters.timeCommitment.includes(founder.timeCommitment || '')) return false;
      if (filters.fundingStatus.length > 0 && !filters.fundingStatus.includes(founder.fundingStatus || '')) return false;
      if (filters.companyGoals.length > 0 && !filters.companyGoals.includes(founder.companyGoals || '')) return false;
      if (filters.workStyle.length > 0 && !filters.workStyle.includes(founder.workStyle || '')) return false;
      if (filters.remoteOk !== null && founder.remoteOk !== filters.remoteOk) return false;
      if (filters.location.length > 0 && !filters.location.includes(founder.location || '')) return false;
      if (filters.isTechnical !== null && founder.isTechnical !== filters.isTechnical) return false;
      
      return true;
    });
  }, [filters]);

  const fetchFounders = useCallback(async () => {
    try {
      // Fetch all users
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          // Only seed if no users exist
          await fetch('/api/seed', { method: 'POST' });
          // Fetch again after seeding
          const secondResponse = await fetch('/api/users');
          if (secondResponse.ok) {
            const seededData = await secondResponse.json();
            setFounders(seededData);
          }
        } else {
          // Filter out current user and people already swiped on
          const currentUserEmail = session?.user?.email;
          const filteredData = data.filter((user: Founder) => 
            user.email !== currentUserEmail
          );
          setAllFounders(filteredData);
          setFounders(applyFilters(filteredData));
        }
      }
    } catch (error) {
      console.error('Error fetching founders:', error);
    } finally {
      setLoading(false);
    }
  }, [session, applyFilters]);

  const fetchCurrentUserProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profile = await response.json();
        
        // Debug profile data
        console.log('Discover page - profile check:', {
          email: profile.email,
          title: profile.title,
          bio: profile.bio,
          experience: profile.experience,
          lookingFor: profile.lookingFor,
          assessmentCompleted: profile.assessmentCompleted,
          assessmentCompletedType: typeof profile.assessmentCompleted,
          quizCompleted: profile.quizCompleted,
          hasBasicProfile: !!(profile.title && profile.bio && profile.experience && profile.lookingFor),
          hasAssessmentCompleted: profile.assessmentCompleted === true
        });
        
        // Check if user has completed onboarding
        const hasBasicProfile = profile.title && profile.bio && profile.experience && profile.lookingFor;
        const hasAssessmentCompleted = profile.assessmentCompleted === true; // New founder assessment (must be explicitly true)
        const hasLegacyQuiz = profile.quizCompleted === true; // Legacy Big Five support
        
        // Prioritize new comprehensive assessment, only allow legacy quiz temporarily
        const hasMatchingData = hasAssessmentCompleted; // Require new assessment
        
        if (!hasBasicProfile || !hasMatchingData) {
          console.log('Redirecting due to missing data:', {
            hasBasicProfile,
            hasAssessmentCompleted,
            hasLegacyQuiz,
            hasMatchingData,
            assessmentValue: profile.assessmentCompleted,
            quizValue: profile.quizCompleted
          });
          // Set redirecting state and redirect to founder assessment
          setRedirecting(true);
          // Always redirect to founder assessment - it handles both basic profile and assessment
          router.replace('/founder-assessment');
          return;
        }
        
        setCurrentUserProfile(profile);
      } else {
        // If profile fetch fails (user doesn't exist or has no profile), redirect to onboarding
        console.log('Profile fetch failed, redirecting to onboarding');
        setRedirecting(true);
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      // On error, also redirect to onboarding
      setRedirecting(true);
      router.replace('/onboarding');
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchFounders();
        await fetchCurrentUserProfile();
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [session, fetchFounders, fetchCurrentUserProfile]);

  useEffect(() => {
    if (allFounders.length > 0) {
      const filtered = applyFilters(allFounders);
      setFounders(filtered);
      setCurrentIndex(0);
    }
  }, [filters, allFounders, applyFilters]);
  
  const currentFounder = founders[currentIndex];

  // New founder assessment compatibility calculation
  const calculateFounderAssessmentCompatibility = (currentUser: any, founder: any) => {
    let compatibilityScore = 0;
    let totalWeight = 0;

    // 1. Vision & Ambition Alignment (High Weight: 25%)
    if (currentUser.longTermVision && founder.longTermVision) {
      const visionMatch = currentUser.longTermVision === founder.longTermVision ? 100 : 
                         (currentUser.longTermVision === 'Lifestyle' && founder.longTermVision === 'Niche problem') ? 80 : 60;
      compatibilityScore += visionMatch * 0.25;
      totalWeight += 0.25;
    }

    // 2. Commitment Level Match (High Weight: 20%)
    if (currentUser.fullTimeReady !== undefined && founder.fullTimeReady !== undefined) {
      const commitmentMatch = currentUser.fullTimeReady === founder.fullTimeReady ? 100 : 40;
      compatibilityScore += commitmentMatch * 0.20;
      totalWeight += 0.20;
    }

    // 3. Role Complementarity (High Weight: 20%)
    if (currentUser.preferredRoles && founder.preferredRoles) {
      try {
        const userRoles = JSON.parse(currentUser.preferredRoles || '[]');
        const founderRoles = JSON.parse(founder.preferredRoles || '[]');
        const overlap = userRoles.filter((role: string) => founderRoles.includes(role)).length;
        const roleMatch = overlap === 0 ? 100 : Math.max(30, 100 - (overlap * 20)); // Less overlap = better
        compatibilityScore += roleMatch * 0.20;
        totalWeight += 0.20;
      } catch (e) {
        // Fallback if JSON parsing fails
        compatibilityScore += 70 * 0.20;
        totalWeight += 0.20;
      }
    }

    // 4. Work Style & Communication (Medium Weight: 15%)
    if (currentUser.communicationStyleAssessment && founder.communicationStyleAssessment) {
      const styleMatch = currentUser.communicationStyleAssessment === founder.communicationStyleAssessment ? 90 : 
                        (currentUser.communicationStyleAssessment === 'Direct' && founder.communicationStyleAssessment === 'Detailed') ? 75 : 60;
      compatibilityScore += styleMatch * 0.15;
      totalWeight += 0.15;
    }

    // 5. Risk Appetite Balance (Medium Weight: 10%)
    if (currentUser.riskAppetite && founder.riskAppetite) {
      const riskDiff = Math.abs(currentUser.riskAppetite - founder.riskAppetite);
      const riskMatch = Math.max(50, 100 - (riskDiff * 8)); // Small differences are good
      compatibilityScore += riskMatch * 0.10;
      totalWeight += 0.10;
    }

    // 6. Stage & Experience Match (Medium Weight: 10%)
    if (currentUser.currentStage && founder.currentStage) {
      const stageMatch = currentUser.currentStage === founder.currentStage ? 95 : 70;
      compatibilityScore += stageMatch * 0.10;
      totalWeight += 0.10;
    }

    // Normalize score based on available data
    const finalScore = totalWeight > 0 ? compatibilityScore / totalWeight : 70;
    return Math.max(60, Math.min(98, Math.round(finalScore)));
  };

  // Legacy Big Five compatibility (kept for backward compatibility)
  const calculateLegacyBigFiveCompatibility = (currentUser: any, founder: any) => {
    const currentUserScores = currentUser.quizScores;
    const founderScores = founder.quizScores;

    // Calculate compatibility based on complementary traits
    const opennessDiff = Math.abs(currentUserScores.openness - founderScores.openness);
    const conscientiousnessDiff = Math.abs(currentUserScores.conscientiousness - founderScores.conscientiousness);
    const extraversionDiff = Math.abs(currentUserScores.extraversion - founderScores.extraversion);
    const agreeablenessDiff = Math.abs(currentUserScores.agreeableness - founderScores.agreeableness);
    const riskDiff = Math.abs(currentUserScores.riskTolerance - founderScores.riskTolerance);

    // Higher compatibility for moderate differences (complementary traits)
    const avgDifference = (opennessDiff + conscientiousnessDiff + extraversionDiff + agreeablenessDiff + riskDiff) / 5;
    
    // Convert to percentage (lower difference = higher compatibility)
    const compatibility = Math.max(60, Math.min(98, 95 - (avgDifference * 12)));
    
    return Math.round(compatibility);
  };

  // Enhanced compatibility calculation using founder assessment data
  const calculateCompatibility = (founder: Founder) => {
    // Check for new assessment data first, fallback to legacy Big Five
    const currentUserHasAssessment = currentUserProfile?.assessmentCompleted;
    const founderHasAssessment = founder.assessmentCompleted;
    const currentUserHasLegacy = currentUserProfile?.quizScores;
    const founderHasLegacy = founder.quizScores;
    
    // Require matching data type for comparison
    if (!((currentUserHasAssessment && founderHasAssessment) || 
          (currentUserHasLegacy && founderHasLegacy))) {
      console.warn('Missing or mismatched assessment data for compatibility:', {
        currentUserHasAssessment: !!currentUserHasAssessment,
        founderHasAssessment: !!founderHasAssessment,
        currentUserHasLegacy: !!currentUserHasLegacy,
        founderHasLegacy: !!founderHasLegacy,
        founderId: founder.id
      });
      return 0; // Return 0 to indicate incomplete data
    }
    
    // Check if this is the same person (self-match)
    if (session?.user?.email === founder.email || 
        (currentUserProfile.id && founder.id === currentUserProfile.id)) {
      return 100; // Perfect match with yourself!
    }

    // Use new founder assessment for compatibility if available
    if (currentUserHasAssessment && founderHasAssessment) {
      return calculateFounderAssessmentCompatibility(currentUserProfile, founder);
    }
    
    // Fallback to legacy Big Five compatibility
    if (currentUserHasLegacy && founderHasLegacy) {
      return calculateLegacyBigFiveCompatibility(currentUserProfile, founder);
    }
    
    return 0; // This shouldn't happen due to earlier checks
  };

  const handleSwipe = async (direction: "left" | "right") => {
    const liked = direction === "right";
    
    if (!currentFounder) return;
    
    // Check if user is authenticated
    if (!session) {
      console.error('User not authenticated');
      return;
    }
    
    setExitDirection(direction);
    
    try {
      // Record the match in the database
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: currentFounder.id,
          liked
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.matched) {
        // Show mutual match notification
        alert(`🎉 It's a mutual match with ${currentFounder.name}! Check your Connections.`);
        setMatches([...matches, currentFounder.id]);
      }
      
    } catch (error) {
      console.error('Error recording match:', error);
      // Show user-friendly error message
      alert('Unable to record your choice. Please try again.');
      return; // Don't proceed to next card if there was an error
    }
    
    // Wait for animation to complete before moving to next card
    setTimeout(() => {
      if (currentIndex < founders.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Reset or show completion message
        setCurrentIndex(0);
      }
      setExitDirection(null);
    }, 300);
  };


  if (loading || redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {redirecting ? 'Redirecting to complete profile...' : 'Loading founders...'}
          </h2>
        </Card>
      </div>
    );
  }

  if (!currentFounder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No more founders to show!</h2>
          <p className="text-gray-600 mb-4">Check back later for more potential matches.</p>
          <Button asChild>
            <Link href="/matches">View Your Matches ({matches.length})</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Discover Founders
            </h1>
            <Badge variant="outline" className="text-slate-600">
              {currentIndex + 1} of {founders.length}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button variant="outline" asChild>
              <Link href="/matches" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Connections ({matches.length})
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="mb-8 p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Industry Filter */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Industry
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.industry.map(option => (
                    <Button
                      key={option}
                      variant={filters.industry.includes(option) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          industry: prev.industry.includes(option)
                            ? prev.industry.filter(i => i !== option)
                            : [...prev.industry, option]
                        }));
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Stage Filter */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Stage
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.stage.map(option => (
                    <Button
                      key={option}
                      variant={filters.stage.includes(option) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          stage: prev.stage.includes(option)
                            ? prev.stage.filter(s => s !== option)
                            : [...prev.stage, option]
                        }));
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Commitment Filter */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Commitment
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.timeCommitment.map(option => (
                    <Button
                      key={option}
                      variant={filters.timeCommitment.includes(option) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          timeCommitment: prev.timeCommitment.includes(option)
                            ? prev.timeCommitment.filter(t => t !== option)
                            : [...prev.timeCommitment, option]
                        }));
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Remote OK Filter */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Remote Work
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.remoteOk === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, remoteOk: prev.remoteOk === true ? null : true }))}
                  >
                    Remote OK
                  </Button>
                  <Button
                    variant={filters.remoteOk === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, remoteOk: prev.remoteOk === false ? null : false }))}
                  >
                    In-Person Only
                  </Button>
                </div>
              </div>

              {/* Technical Filter */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Technical Background
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.isTechnical === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, isTechnical: prev.isTechnical === true ? null : true }))}
                  >
                    Technical
                  </Button>
                  <Button
                    variant={filters.isTechnical === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, isTechnical: prev.isTechnical === false ? null : false }))}
                  >
                    Non-Technical
                  </Button>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="md:col-span-2 lg:col-span-1 flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    industry: [],
                    stage: [],
                    location: [],
                    remoteOk: null,
                    timeCommitment: [],
                    fundingStatus: [],
                    companyGoals: [],
                    workStyle: [],
                    isTechnical: null,
                  })}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Sidebar - Pass Action */}
          <div className="hidden lg:flex flex-col items-center justify-center h-[700px]">
            <Button
              size="lg"
              variant="outline"
              className="w-20 h-20 rounded-full border-2 border-red-200 bg-white hover:bg-red-50 hover:border-red-300 shadow-lg transition-all group"
              onClick={() => handleSwipe("left")}
            >
              <X className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
            </Button>
            <p className="mt-4 text-sm text-gray-600 font-medium">Skip</p>
            <p className="text-xs text-gray-400 max-w-24 text-center mt-1">
              Not the right fit
            </p>
          </div>

          {/* Center - Card */}
          <div className="relative h-[700px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentFounder && (
                <motion.div
                  key={currentFounder.id}
                  className="relative w-full max-w-md h-full group cursor-pointer"
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    x: exitDirection === "right" ? 300 : exitDirection === "left" ? -300 : 0,
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.3 }
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => window.open(`/founder/${currentFounder.id}`, '_blank')}
                >
                  {/* Main Card */}
                  <Card className="relative w-full h-full overflow-hidden border-0 shadow-2xl bg-white group-hover:shadow-3xl transition-shadow duration-300">
                    {/* Header with Photo and Basic Info */}
                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {currentFounder.profileImage ? (
                            <img 
                              src={currentFounder.profileImage} 
                              alt={currentFounder.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-white/20"
                            />
                          ) : (
                            <Avatar className="w-24 h-24 border-4 border-white shadow-xl ring-4 ring-white/20">
                              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {currentFounder.avatar}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold mb-1">{currentFounder.name}</h2>
                          <p className="text-lg opacity-90">{currentFounder.title}</p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        Online
                      </div>

                      {/* Compatibility Score */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-bold border border-gray-200">
                        {(() => {
                          const compatibility = calculateCompatibility(currentFounder);
                          return compatibility > 0 ? `${compatibility}% Match` : 'Complete Assessment';
                        })()}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 space-y-4 flex-1">
                      {/* About */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">About</h3>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                          {currentFounder.bio}
                        </p>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {currentFounder.skills.slice(0, 6).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Experience Level & Technical Status */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">Experience & Background</h3>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="capitalize">
                            {currentFounder.experience?.replace("-", " ")}
                          </Badge>
                          <Badge 
                            variant={currentFounder.isTechnical ? "default" : "secondary"}
                            className={currentFounder.isTechnical ? "bg-blue-600 text-white" : ""}
                          >
                            {currentFounder.isTechnical ? "Technical" : "Non-Technical"}
                          </Badge>
                        </div>
                      </div>

                      {/* Looking For */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">Looking For</h3>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-1">
                          {currentFounder.lookingFor}
                        </p>
                      </div>

                      {/* Compatibility & Founder Type */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200/50">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-gray-900">Compatibility</h3>
                          <Badge className="bg-blue-600 text-white">
                            {(() => {
                              const compatibility = calculateCompatibility(currentFounder);
                              return compatibility > 0 ? `${compatibility}% Match` : 'Complete Assessment';
                            })()}
                          </Badge>
                        </div>
                        {currentFounder.personalityProfile && (
                          <div>
                            <Badge className="mb-2 bg-blue-100 text-blue-800">
                              {currentFounder.personalityProfile.founderType?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div><strong>Leadership:</strong> {currentFounder.personalityProfile.leadershipStyle}</div>
                              <div><strong>Risk Profile:</strong> {currentFounder.personalityProfile.riskProfile}</div>
                              <div><strong>Work Style:</strong> {currentFounder.personalityProfile.workStyle}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Profile Hint */}
                    <div className="absolute top-2 right-16 bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view full profile
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar - Like Action */}
          <div className="hidden lg:flex flex-col items-center justify-center h-[700px]">
            <Button
              size="lg"
              className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg transition-all group"
              onClick={() => handleSwipe("right")}
            >
              <Heart className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            </Button>
            <p className="mt-4 text-sm text-gray-600 font-medium">Connect</p>
            <p className="text-xs text-gray-400 max-w-24 text-center mt-1">
              Great potential partner
            </p>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="lg:hidden flex justify-center items-center gap-8 mt-8">
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-red-200 bg-white hover:bg-red-50 shadow-lg"
            onClick={() => handleSwipe("left")}
          >
            <X className="w-6 h-6 text-red-500" />
          </Button>
          
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
            onClick={() => handleSwipe("right")}
          >
            <Heart className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Click the buttons to skip or connect • Click card to view full profile
          </p>
        </div>
      </div>
    </div>
  );
}