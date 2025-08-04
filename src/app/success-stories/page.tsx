import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, TrendingUp } from "lucide-react";

export default function SuccessStoriesPage() {
  const stories = [
    {
      id: 1,
      title: "From Idea to $1M ARR",
      founders: "Sarah Chen & Marcus Rodriguez",
      company: "DataFlow Analytics",
      industry: "B2B SaaS",
      story: "Met on CoFoundr in March 2024. Sarah brought deep technical expertise in data engineering, while Marcus had extensive B2B sales experience. Together they built a real-time analytics platform that now serves 200+ enterprise clients.",
      metrics: ["$1M ARR", "200+ Clients", "15 Employees"],
      timeframe: "8 months"
    },
    {
      id: 2,
      title: "Healthcare Innovation Partnership",
      founders: "Dr. Emily Johnson & Alex Kim",
      company: "MedConnect",
      industry: "HealthTech",
      story: "Connected through our healthcare founder matching. Emily's medical expertise combined with Alex's mobile development skills created a telemedicine platform now used by 50+ clinics across the country.",
      metrics: ["50+ Clinics", "$500K Funding", "10,000+ Patients"],
      timeframe: "6 months"
    },
    {
      id: 3,
      title: "E-commerce Platform Success",
      founders: "Mike Thompson & Lisa Park",
      company: "LocalMart",
      industry: "E-commerce",
      story: "Used CoFoundr's assessment to find the perfect co-founder match. Mike's logistics background and Lisa's design expertise helped them create a platform connecting local businesses with customers.",
      metrics: ["100+ Merchants", "$250K Revenue", "5,000+ Users"],
      timeframe: "10 months"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Success Stories</h1>
          <p className="text-slate-600 text-lg">
            Real founders who found their perfect co-founder match on CoFoundr
          </p>
        </div>

        <div className="grid gap-8">
          {stories.map((story) => (
            <Card key={story.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Users className="w-4 h-4" />
                      <span>{story.founders}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{story.company}</Badge>
                      <Badge variant="outline">{story.industry}</Badge>
                      <span className="text-sm text-slate-500">Matched in {story.timeframe}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  {story.story}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {story.metrics.map((metric, index) => (
                    <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-blue-900">{metric}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Join thousands of founders who have found their perfect co-founder match. 
                Complete your assessment and start connecting with compatible entrepreneurs today.
              </p>
              <div className="space-x-4">
                <a 
                  href="/founder-assessment" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Take Assessment
                </a>
                <a 
                  href="/discover" 
                  className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Browse Founders
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}