import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Briefcase } from "lucide-react";

export default function CareersPage() {
  const openings = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Join our engineering team to build the future of founder matching. Work with React, Next.js, and cutting-edge AI technologies.",
      requirements: ["5+ years React/Next.js experience", "Experience with AI/ML integration", "Strong backend development skills"],
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Shape the user experience for thousands of entrepreneurs. Design intuitive interfaces that help founders connect and build businesses together.",
      requirements: ["3+ years product design experience", "Experience with B2B SaaS", "Strong portfolio in user research"],
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Developer Relations Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Bridge the gap between our platform and the developer community. Create content, tools, and resources that help founders build better businesses.",
      requirements: ["Strong technical writing skills", "Experience with developer tools", "Community building experience"],
      posted: "3 days ago"
    }
  ];

  const benefits = [
    "Competitive salary and equity package",
    "Comprehensive health, dental, and vision insurance",
    "Flexible work arrangements (remote-first)",
    "Unlimited PTO policy",
    "Professional development budget",
    "Latest tech equipment and tools",
    "Team retreats and company events",
    "Opportunity to work with cutting-edge AI technology"
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join Our Team</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Help us build the future of entrepreneurship. We&apos;re looking for passionate individuals 
            who want to empower founders worldwide.
          </p>
        </div>

        <div className="mb-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Work at CoFoundr?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">🚀 Mission-Driven</h3>
                  <p className="text-slate-600">
                    We&apos;re building tools that help entrepreneurs find their perfect co-founder and build successful businesses.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">🌱 Growth Opportunity</h3>
                  <p className="text-slate-600">
                    Join an early-stage startup where your contributions directly impact thousands of founders.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">🤝 Collaborative Culture</h3>
                  <p className="text-slate-600">
                    Work with a team of experienced entrepreneurs and technologists who support each other&apos;s growth.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">🔧 Cutting-Edge Tech</h3>
                  <p className="text-slate-600">
                    Work with the latest technologies including AI, machine learning, and modern web frameworks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions</h2>
          <div className="space-y-6">
            {openings.map((job) => (
              <Card key={job.id} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 text-slate-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Posted {job.posted}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">{job.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Benefits & Perks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-slate-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Don&apos;t See a Perfect Fit?
              </h2>
              <p className="text-slate-600 mb-6">
                We&apos;re always looking for exceptional talent. Send us your resume and let us know 
                how you&apos;d like to contribute to our mission.
              </p>
              <a 
                href="mailto:careers@cofoundr.online" 
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                Get in Touch
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}