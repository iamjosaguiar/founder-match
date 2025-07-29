import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Target, Rocket } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              About CoLaunchr
            </h1>
            <p className="text-slate-600 mt-2">Your startup's ultimate sidekick</p>
          </div>
        </div>

        {/* Mission */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-700 leading-relaxed">
              We believe no founder should go it alone. CoLaunchr exists to democratize access to 
              the expertise, connections, and support that traditionally only well-connected founders 
              in Silicon Valley could access. Whether you're looking for a co-founder, need expert 
              guidance, or want to execute fast with professional teams—we're here to help you succeed.
            </p>
          </CardContent>
        </Card>

        {/* Story */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed mb-4">
              CoLaunchr was born from the frustration of seeing brilliant founders struggle alone. 
              Too many great ideas never see the light of day because founders lack the right 
              partnerships, guidance, or execution support.
            </p>
            <p className="text-slate-700 leading-relaxed">
              We've built a comprehensive ecosystem that connects founders with everything they need: 
              compatible co-founders through AI-powered matching, expert advisors for strategic guidance, 
              vetted execution teams for rapid development, and a supportive community of fellow entrepreneurs.
            </p>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Our Values</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Founders First</h4>
                <p className="text-slate-600 text-sm">
                  Every decision we make prioritizes the success and experience of founders using our platform.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Quality Over Quantity</h4>
                <p className="text-slate-600 text-sm">
                  We carefully vet all service providers and advisors to ensure high-quality experiences.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Accessibility</h4>
                <p className="text-slate-600 text-sm">
                  World-class expertise shouldn't be limited to well-connected founders in major tech hubs.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Community</h4>
                <p className="text-slate-600 text-sm">
                  We believe in the power of founder-to-founder support and learning from shared experiences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}