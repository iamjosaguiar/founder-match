import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Mail, FileText, Users } from "lucide-react";

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Help & Support</h1>
          <p className="text-slate-600">Get help with CoFoundr and find answers to common questions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Get instant help using our AI-powered chat assistant built right into the platform.
              </p>
              <a href="/chat" className="text-blue-600 hover:underline">
                Start Chat →
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Need personalized help? Send us an email and we'll get back to you within 24 hours.
              </p>
              <a href="mailto:support@cofoundr.online" className="text-blue-600 hover:underline">
                support@cofoundr.online
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Learn how to make the most of CoFoundr with our comprehensive guides and tutorials.
              </p>
              <div className="space-y-2">
                <a href="/pricing" className="block text-blue-600 hover:underline">Getting Started Guide</a>
                <a href="/founder-assessment" className="block text-blue-600 hover:underline">Founder Assessment</a>
                <a href="/settings" className="block text-blue-600 hover:underline">Account Settings</a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Connect with other founders and get advice from the community.
              </p>
              <a href="/community" className="text-blue-600 hover:underline">
                Join Community →
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How do I add my OpenAI API key?</h3>
                <p className="text-slate-600">
                  Go to Settings and scroll to the OpenAI API Key section. Click "Add API Key" and paste your key from the OpenAI platform.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How does co-founder matching work?</h3>
                <p className="text-slate-600">
                  Complete your founder assessment, then browse potential co-founders based on complementary skills, experience, and goals.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Is my data secure?</h3>
                <p className="text-slate-600">
                  Yes, we use industry-standard encryption and security measures to protect your data. Your OpenAI API key is encrypted and never shared.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}