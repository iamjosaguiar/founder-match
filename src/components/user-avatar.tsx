"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type UserAvatarProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    profileImage?: string | null;
  };
};

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10", 
  lg: "w-16 h-16",
  xl: "w-24 h-24"
};

const fallbackSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg", 
  xl: "text-2xl"
};

export default function UserAvatar({ className = "", size = "md", user }: UserAvatarProps) {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<any>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use passed user data or session data
  const userData = user || session?.user;

  useEffect(() => {
    // Only fetch profile data if we don't have user data passed in and don't already have profile data
    if (session?.user?.email && !user && !profileData) {
      fetchProfileData();
    }
  }, [session?.user?.email, user, profileData]);

  const fetchProfileData = async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Don't retry on error to prevent endless requests
    } finally {
      setIsLoading(false);
    }
  };

  // Priority order for avatar image:
  // 1. Updated profileImage from database
  // 2. Original profileImage field
  // 3. Social login image from session
  const getAvatarImage = () => {
    if (imageError) return null;
    
    const candidates = [
      profileData?.profileImage,
      (userData as any)?.profileImage,
      userData?.image
    ];
    
    // Find the first valid image URL
    for (const candidate of candidates) {
      if (candidate && typeof candidate === 'string' && candidate.trim()) {
        // Check if it's a valid URL or base64 data URL
        if (candidate.startsWith('http') || candidate.startsWith('data:image/')) {
          return candidate;
        }
      }
    }
    
    return null;
  };

  const getInitials = () => {
    const name = profileData?.name || userData?.name;
    const email = userData?.email;
    
    if (name) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    
    if (email) {
      return email[0].toUpperCase();
    }
    
    return 'U';
  };

  const avatarImage = getAvatarImage();

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {avatarImage && !imageError ? (
        <img 
          src={avatarImage} 
          alt={profileData?.name || userData?.name || 'User'} 
          className="w-full h-full object-cover"
          onError={() => {
            console.warn('Avatar image failed to load:', avatarImage);
            setImageError(true);
          }}
          onLoad={() => {
            // Reset error state if image loads successfully
            if (imageError) setImageError(false);
          }}
        />
      ) : (
        <AvatarFallback className={`bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-medium ${fallbackSizeClasses[size]}`}>
          {getInitials()}
        </AvatarFallback>
      )}
    </Avatar>
  );
}