"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Users, Zap, Target, TrendingUp, Rocket, Search, Heart, CheckCircle } from "lucide-react";

type UserProfile = {
  quizCompleted: boolean;
  quizScores?: any;
  personalityProfile?: any;
};

export default function FounderMatchingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/founder-matching"));
      return;
    }
    fetchUserProfile();
  }, [session, status, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
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
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Co-Founder Matching</h1>
          <p className="text-slate-600">Find your perfect founding partner through AI-powered personality matching</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Discover Founders</h3>
              <p className="text-blue-700 text-sm mb-4">Browse and connect with potential co-founders</p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/founder-matching/discover">
                  Start Discovering
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">My Matches</h3>
              <p className="text-green-700 text-sm mb-4">View your mutual connections and matches</p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/founder-matching/matches">
                  View Matches
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {userProfile?.quizCompleted ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <Brain className="w-8 h-8 text-white" />
                )}
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">Assessment</h3>
              <p className="text-purple-700 text-sm mb-4">
                {userProfile?.quizCompleted ? 
                  "View your completed personality assessment" : 
                  "Complete your personality assessment"
                }
              </p>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/founder-matching/assessment">
                  {userProfile?.quizCompleted ? "View Assessment" : "Take Assessment"}
                </Link>
              </Button>
              {userProfile?.quizCompleted && (
                <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                  ✅ Completed
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <Card className="border-0 bg-white shadow-lg mb-8">
          <CardHeader className="text-center">
            <Badge variant="outline" className="w-fit mx-auto mb-4 bg-slate-50 text-slate-700 border-slate-200">
              <Brain className="w-3 h-3 mr-1" />
              Science-Backed Matching
            </Badge>
            <CardTitle className="text-2xl mb-2">How Our Personality Matching Works</CardTitle>
            <p className="text-slate-600">
              Our algorithm uses validated psychological research to find your ideal co-founder match
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Big Five Assessment</h3>
                <p className="text-slate-600 text-sm">Complete our 12-question personality assessment</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Founder Classification</h3>
                <p className="text-slate-600 text-sm">Get matched as one of 7 distinct founder types</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Smart Matching</h3>
                <p className="text-slate-600 text-sm">Find founders with complementary skills and vision</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}