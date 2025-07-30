"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/user-avatar";

export function Navigation() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Pages that should have navigation visible for authenticated users
  const publicPages = [
    '/',
    '/founder-matching', // old marketing page
    '/discover', // landing page
    '/matches' // landing page
  ];

  // Don't show navigation on dashboard pages for authenticated users
  const isDashboardPage = session && !publicPages.includes(pathname) && !pathname.startsWith('/auth');

  // Hide navigation completely on dashboard pages
  if (isDashboardPage) {
    return null;
  }

  return (
    <nav className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CoLaunchr
            </span>
          </Link>

          {/* Navigation Links - only show on homepage and landing pages */}
          {(pathname === '/' || pathname.includes('co-founder-matching') || pathname.includes('execution-network') || pathname.includes('community-hub') || pathname.includes('financing-hub') || pathname.includes('colaunch-pods')) && !session && (
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <Link href="/co-founder-matching" className="text-slate-600 hover:text-blue-600 transition-colors">
                Co-Founder Matching
              </Link>
              <Link href="/execution-network" className="text-slate-600 hover:text-purple-600 transition-colors">
                Execution Network
              </Link>
              <Link href="/community-hub" className="text-slate-600 hover:text-green-600 transition-colors">
                Community
              </Link>
              <Link href="/financing-hub" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Financing
              </Link>
              <Link href="/colaunch-pods" className="text-slate-600 hover:text-orange-600 transition-colors">
                Advisory Pods
              </Link>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
            ) : session ? (
              // Authenticated Navigation (only on public pages)
              <>
                <div className="hidden md:flex items-center gap-3">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link href="/dashboard">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>

                {/* User Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-slate-100">
                      <UserAvatar size="sm" />
                      <span className="font-medium text-slate-700">
                        {session.user?.name || "Profile"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-slate-900">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {session.user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        Go to Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Unauthenticated Navigation
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}