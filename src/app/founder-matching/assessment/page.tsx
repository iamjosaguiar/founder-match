"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, CheckCircle, RefreshCw, Target, TrendingUp } from "lucide-react";

type UserProfile = {
  quizCompleted: boolean;
  assessmentCompleted: boolean;
  quizScores?: any;
  personalityProfile?: any;
};

export default function AssessmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/founder-matching/assessment"));
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
            <p className="mt-4 text-slate-600">Loading assessment status...</p>
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
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/founder-matching" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Co-Founder Matching
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Founder Assessment</h1>
          <p className="text-slate-600">Complete your comprehensive founder profile for better co-founder matching</p>
        </div>

        {userProfile?.assessmentCompleted || userProfile?.quizCompleted ? (
          // Assessment Completed State
          <div className="space-y-6">
            <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">Assessment Completed!</h2>
                <p className="text-green-700 mb-6">
                  You've successfully completed your founder assessment. Your profile is active and ready for matching.
                </p>
                <Badge className="bg-green-100 text-green-800 border-green-200 mb-6">
                  ✅ Profile Active
                </Badge>
              </CardContent>
            </Card>

            {/* Assessment Results Preview */}
            {userProfile.personalityProfile && (
              <Card className="border-0 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Your Founder Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Founder Type</h3>
                      <p className="text-slate-600 text-sm mb-2">
                        {userProfile.personalityProfile.founderType || "Visionary Leader"}
                      </p>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Profile Match Ready
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Compatibility Score</h3>
                      <p className="text-slate-600 text-sm mb-2">
                        Ready for matching with complementary founders
                      </p>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Algorithm Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link href="/founder-matching/discover">
                  Discover Co-Founders
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile">
                  View Full Profile
                </Link>
              </Button>
            </div>

            {/* Retake Option */}
            <Card className="border-0 bg-slate-50 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Want to Update Your Assessment?</h3>
                <p className="text-slate-600 text-sm mb-4">
                  You can retake the assessment if your preferences or personality have changed.
                </p>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <Link href="/founder-assessment">
                    <RefreshCw className="w-4 h-4" />
                    Update Assessment
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Assessment Not Completed State
          <div className="space-y-6">
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-purple-900 mb-2">Complete Your Assessment</h2>
                <p className="text-purple-700 mb-6">
                  Complete our comprehensive founder assessment to unlock precise co-founder matching.
                </p>
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/founder-assessment">
                    Start Assessment
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl mb-2">How the Assessment Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">8 Sections</h4>
                    <p className="text-slate-600 text-sm">Complete comprehensive assessment covering all founder dimensions</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">AI Analysis</h4>
                    <p className="text-slate-600 text-sm">Our algorithm analyzes your founder profile and compatibility factors</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">Smart Matching</h4>
                    <p className="text-slate-600 text-sm">Get matched with complementary co-founders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}