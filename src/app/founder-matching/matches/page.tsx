"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Heart, 
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Sparkles
} from "lucide-react";

type Match = {
  id: string;
  matchedAt: string;
  user: {
    id: string;
    name: string;
    title: string;
    bio: string;
    skills: string[];
    image?: string;
    profileImage?: string;
    location?: string;
    industry?: string;
    stage?: string;
    avatar: string;
  };
};

export default function MatchesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/founder-matching/matches"));
      return;
    }
    fetchMatches();
  }, [session, status, router]);

  const fetchMatches = async () => {
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/matches');
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches);
      } else if (response.status === 401) {
        router.push("/auth/signup?callbackUrl=" + encodeURIComponent("/founder-matching/matches"));
        return;
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading your matches...</p>
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Matches</h1>
          <p className="text-slate-600">Connect with founders who also liked your profile</p>
        </div>

        {/* Matches */}
        {matches.length === 0 ? (
          <Card className="text-center p-12 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-6xl mb-4">💫</div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">No matches yet</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Start discovering other founders to find your perfect co-founder match. 
              When someone likes you back, you'll see them here!
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <a href="/founder-matching/discover">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Discovering
              </a>
            </Button>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-900">{matches.length}</div>
                  <div className="text-sm text-blue-700">Total Matches</div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-900">0</div>
                  <div className="text-sm text-green-700">Active Chats</div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-900">
                    {matches.filter(m => new Date(m.matchedAt) > new Date(Date.now() - 7*24*60*60*1000)).length}
                  </div>
                  <div className="text-sm text-purple-700">This Week</div>
                </CardContent>
              </Card>
            </div>

            {/* Matches Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {matches.map((match) => (
                <Card key={match.id} className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <UserAvatar 
                        size="lg" 
                        user={{
                          name: match.user.name,
                          email: null,
                          image: match.user.image,
                          profileImage: match.user.profileImage
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl text-slate-900">{match.user.name}</CardTitle>
                            <p className="text-slate-600 font-medium">{match.user.title}</p>
                            {match.user.location && (
                              <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                                <MapPin className="w-3 h-3" />
                                {match.user.location}
                              </div>
                            )}
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Heart className="w-3 h-3 mr-1" />
                            Mutual Match
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Bio */}
                    <p className="text-slate-600 mb-4 line-clamp-3">{match.user.bio}</p>
                    
                    {/* Industry & Stage */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                      {match.user.industry && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {match.user.industry}
                        </div>
                      )}
                      {match.user.stage && (
                        <Badge variant="secondary" className="text-xs">
                          {match.user.stage}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Skills */}
                    {match.user.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {match.user.skills.slice(0, 4).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {match.user.skills.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{match.user.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Match Date & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Calendar className="w-3 h-3" />
                        Matched {formatDate(match.matchedAt)}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}