import Link from "next/link";
import { MessageCircle, Users, Code, Brain, TrendingUp, DollarSign, Mail, MapPin, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-8">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CoFoundr
                </span>
              </h3>
              <p className="text-slate-500 leading-relaxed max-w-md">
                Your startup's ultimate sidekick. From co-founder matching to execution teams, 
                we connect you with the expertise you need to build, launch, and scale.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-sm">hello@cofoundr.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/co-founder-matching" className="text-sm hover:text-blue-600 transition-colors flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  Co-Founder Matching
                </Link>
              </li>
              <li>
                <Link href="/colaunch-pods" className="text-sm hover:text-blue-600 transition-colors flex items-center gap-2">
                  <Brain className="w-3 h-3" />
                  CoLaunch Pods
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">Soon</span>
                </Link>
              </li>
              <li>
                <Link href="/execution-network" className="text-sm hover:text-blue-600 transition-colors flex items-center gap-2">
                  <Code className="w-3 h-3" />
                  Execution Network
                </Link>
              </li>
              <li>
                <Link href="/growth-tracks" className="text-sm hover:text-blue-600 transition-colors flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  Growth Tracks
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">Soon</span>
                </Link>
              </li>
              <li>
                <Link href="/community-hub" className="text-sm hover:text-blue-600 transition-colors flex items-center gap-2">
                  <MessageCircle className="w-3 h-3" />
                  Community
                </Link>
              </li>
              <li>
                <Link href="/financing-hub" className="text-sm hover:text-blue-600 transition-colors flex items-center gap-2">
                  <DollarSign className="w-3 h-3" />
                  Financing Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm hover:text-blue-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-sm hover:text-blue-600 transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm hover:text-blue-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm hover:text-blue-600 transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              © {currentYear} CoFoundr. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>Made with ❤️ for founders</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}