import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Server, Key, UserCheck } from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description: "All sensitive data including API keys and personal information is encrypted using industry-standard AES-256 encryption both in transit and at rest."
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "Secure API Key Management",
      description: "Your OpenAI API keys are encrypted with your own unique encryption key and stored securely. We never have access to your unencrypted keys."
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Identity Verification",
      description: "Multi-factor authentication and email verification ensure that only you can access your account and sensitive information."
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "SOC 2 Compliant Infrastructure",
      description: "Our infrastructure is hosted on SOC 2 compliant platforms with regular security audits and monitoring."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Privacy by Design",
      description: "We collect only the minimum data necessary and give you full control over your information sharing preferences."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Regular Security Updates",
      description: "Our platform receives regular security updates and patches to protect against the latest threats and vulnerabilities."
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Security & Privacy</h1>
          <p className="text-slate-600 text-lg">
            Your data security and privacy are our top priorities
          </p>
        </div>

        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Enterprise-Grade Security
              </h2>
              <p className="text-slate-700 max-w-2xl mx-auto">
                CoFoundr implements the same security standards used by Fortune 500 companies 
                to protect your sensitive information, business data, and API credentials.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {feature.icon}
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Data Handling & Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">What Data We Collect</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Profile information you provide (name, email, professional background)</li>
                  <li>Founder assessment responses to improve matching</li>
                  <li>Usage analytics to improve platform performance</li>
                  <li>Encrypted API keys for third-party integrations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">What We Don&apos;t Do</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Sell your personal information to third parties</li>
                  <li>Share your data without explicit consent</li>
                  <li>Store unencrypted sensitive information</li>
                  <li>Access your API keys or private conversations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Security Measures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Infrastructure Security</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• TLS 1.3 encryption for all connections</li>
                    <li>• Regular automated security scans</li>
                    <li>• Isolated database environments</li>
                    <li>• 24/7 security monitoring</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Application Security</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• OWASP security guidelines compliance</li>
                    <li>• Input validation and sanitization</li>
                    <li>• SQL injection prevention</li>
                    <li>• Cross-site scripting (XSS) protection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance & Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">GDPR Compliant</h3>
                  <p className="text-sm text-slate-600">Full compliance with European data protection regulations</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">SOC 2 Type II</h3>
                  <p className="text-sm text-slate-600">Audited security controls and procedures</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserCheck className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">CCPA Compliant</h3>
                  <p className="text-sm text-slate-600">California Consumer Privacy Act compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-50">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Questions About Security?
              </h2>
              <p className="text-slate-600 mb-6">
                Our security team is available to answer any questions about our security practices 
                and help you understand how we protect your data.
              </p>
              <div className="space-x-4">
                <a 
                  href="mailto:security@cofoundr.online" 
                  className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Contact Security Team
                </a>
                <a 
                  href="/privacy" 
                  className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}