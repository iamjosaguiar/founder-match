"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";
import NotificationBell from "@/components/notification-bell";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Code, 
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  FolderOpen,
  UserCheck,
  Briefcase,
  Brain,
  LogOut,
  TrendingUp,
  Building2
} from "lucide-react";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Co-Founder Matching",
    icon: Users,
    children: [
      {
        name: "Discover Founders",
        href: "/founder-matching/discover",
        icon: Search
      },
      {
        name: "My Matches", 
        href: "/founder-matching/matches",
        icon: Users
      },
      {
        name: "Complete Assessment",
        href: "/founder-matching/assessment",
        icon: Brain
      }
    ]
  },
  {
    name: "Execution Network",
    icon: Code,
    children: [
      {
        name: "Find Providers",
        href: "/execution-network/providers",
        icon: Search
      },
      {
        name: "Post Project",
        href: "/execution-network/projects/new",
        icon: Plus
      },
      {
        name: "Browse Projects",
        href: "/execution-network/projects",
        icon: FolderOpen
      },
      {
        name: "Join Network",
        href: "/execution-network/join",
        icon: UserCheck
      },
      {
        name: "My Dashboard",
        href: "/execution-network/dashboard",
        icon: Briefcase
      }
    ]
  },
  {
    name: "Financing Hub",
    icon: TrendingUp,
    children: [
      {
        name: "Browse Companies",
        href: "/financing/browse",
        icon: Search
      },
      {
        name: "Create Showcase", 
        href: "/financing/showcase/create",
        icon: Building2
      },
      {
        name: "Investor Network",
        href: "/financing/investors",
        icon: Users
      }
    ]
  },
  {
    name: "Community",
    href: "/community",
    icon: MessageCircle
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings
  }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Persist sidebar state in localStorage
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem('dashboard-sidebar-collapsed');
      const savedExpanded = localStorage.getItem('dashboard-expanded-sections');
      
      if (savedCollapsed !== null) {
        setSidebarCollapsed(JSON.parse(savedCollapsed));
      }
      
      if (savedExpanded) {
        setExpandedSections(JSON.parse(savedExpanded));
      } else {
        // Default expanded sections
        setExpandedSections(['Execution Network']);
      }
    } catch (error) {
      console.warn('Failed to load dashboard state from localStorage:', error);
      // Set defaults if localStorage fails
      setExpandedSections(['Execution Network']);
    }
  }, []);

  // Save sidebar state when it changes
  useEffect(() => {
    try {
      localStorage.setItem('dashboard-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
    } catch (error) {
      console.warn('Failed to save sidebar state to localStorage:', error);
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    try {
      localStorage.setItem('dashboard-expanded-sections', JSON.stringify(expandedSections));
    } catch (error) {
      console.warn('Failed to save expanded sections to localStorage:', error);  
    }
  }, [expandedSections]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CoLaunchr
                </span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 h-auto"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <UserAvatar size="md" />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedSections.includes(item.name);
              const hasActiveChild = item.children.some(child => isActive(child.href));
              
              return (
                <div key={item.name}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-10 ${
                      hasActiveChild ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => !sidebarCollapsed && toggleSection(item.name)}
                  >
                    <item.icon className="w-4 h-4" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.name}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </>
                    )}
                  </Button>
                  
                  {!sidebarCollapsed && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start h-9 text-sm ${
                              isActive(child.href) 
                                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <child.icon className="w-3.5 h-3.5" />
                            <span className="ml-3">{child.name}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-10 ${
                    isActive(item.href) 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-200 space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link href="/community/new">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-slate-900">
              {pathname === "/dashboard" && "Dashboard"}
              {pathname.startsWith("/founder-matching") && "Co-Founder Matching"}
              {pathname.startsWith("/execution-network") && "Execution Network"}
              {pathname.startsWith("/community") && "Community"}
              {pathname.startsWith("/settings") && "Settings"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                View Public Site
              </Link>
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}