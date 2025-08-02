"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

// Routes where the footer should be hidden (SaaS/dashboard pages)
const DASHBOARD_ROUTES = [
  '/dashboard',
  '/chat',
  '/settings',
  '/founder-matching',
  '/community',
  '/execution-network',
  '/financing'
];

// Simple footer for dashboard pages
function SimpleDashboardFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-slate-200 py-4">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-slate-500">
          <div>© {currentYear} CoLaunchr. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Check if current route is a dashboard/SaaS page
  const isDashboardPage = DASHBOARD_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  // Show simplified footer for dashboard pages, full footer for marketing pages
  return isDashboardPage ? <SimpleDashboardFooter /> : <Footer />;
}