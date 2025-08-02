"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ChevronDown,
  Plus,
  Settings,
  Check
} from "lucide-react";

interface Business {
  id: string;
  name: string;
  businessType: string;
  industry: string;
  location?: string;
  stage: string;
}

interface BusinessSelectorProps {
  onBusinessChange?: (businessId: string | null) => void;
  onCreateNew?: () => void;
  onManage?: () => void;
  currentBusinessId?: string | null;
}

export default function BusinessSelector({ 
  onBusinessChange, 
  onCreateNew, 
  onManage,
  currentBusinessId 
}: BusinessSelectorProps) {
  const { data: session } = useSession();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadBusinesses();
    }
  }, [session]);

  useEffect(() => {
    if (currentBusinessId && businesses.length > 0) {
      const business = businesses.find(b => b.id === currentBusinessId);
      setCurrentBusiness(business || null);
    }
  }, [currentBusinessId, businesses]);

  const loadBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses');
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses || []);
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessSelect = async (businessId: string) => {
    try {
      const response = await fetch('/api/businesses/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
      });

      if (response.ok) {
        const selectedBusiness = businesses.find(b => b.id === businessId);
        setCurrentBusiness(selectedBusiness || null);
        onBusinessChange?.(businessId);
      }
    } catch (error) {
      console.error('Error setting current business:', error);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'idea': return 'bg-gray-100 text-gray-800';
      case 'validation': return 'bg-yellow-100 text-yellow-800';
      case 'mvp': return 'bg-blue-100 text-blue-800';
      case 'early-revenue': return 'bg-green-100 text-green-800';
      case 'growth': return 'bg-purple-100 text-purple-800';
      case 'established': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <Building2 className="w-4 h-4" />
        <span className="text-sm">Loading businesses...</span>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onCreateNew}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Business
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between min-w-[200px]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <div className="text-left">
              {currentBusiness ? (
                <>
                  <div className="font-medium">{currentBusiness.name}</div>
                  <div className="text-xs text-slate-500">
                    {currentBusiness.businessType} • {currentBusiness.location || 'No location'}
                  </div>
                </>
              ) : (
                <span>Select Business</span>
              )}
            </div>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-80">
        <div className="p-2">
          <div className="text-xs font-medium text-slate-500 mb-2">
            YOUR BUSINESSES ({businesses.length})
          </div>
          
          {businesses.map((business) => (
            <DropdownMenuItem
              key={business.id}
              onClick={() => handleBusinessSelect(business.id)}
              className="p-3 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{business.name}</div>
                    {currentBusiness?.id === business.id && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {business.industry} • {business.businessType}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStageColor(business.stage)}`}
                    >
                      {business.stage}
                    </Badge>
                    {business.location && (
                      <span className="text-xs text-slate-400">
                        {business.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-1">
          <DropdownMenuItem onClick={onCreateNew} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Add New Business
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onManage} className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Manage Businesses
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}