"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface BusinessFormData {
  name: string;
  description?: string;
  industry: string;
  businessType: string;
  subType?: string;
  location?: string;
  country?: string;
  targetMarket?: string;
  targetAudience?: string;
  stage: string;
  foundedYear?: number;
  teamSize?: number;
  revenueRange?: string;
  businessModel?: string;
  revenueModel?: string;
  pricePoint?: string;
  website?: string;
  primaryServices?: string[];
  specialties?: string[];
  shortTermGoals?: string;
  longTermVision?: string;
}

interface BusinessFormProps {
  business?: BusinessFormData & { id?: string };
  onSave: (data: BusinessFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Beauty & Wellness', 'Food & Beverage', 
  'Retail', 'Education', 'Finance', 'Real Estate', 'Manufacturing',
  'Professional Services', 'Entertainment', 'Travel & Tourism', 'Other'
];

const BUSINESS_TYPES = [
  'SaaS', 'E-commerce', 'Marketplace', 'Mobile App', 'Web App',
  'Salon', 'Spa', 'Clinic', 'Restaurant', 'Cafe', 'Retail Store',
  'Consulting', 'Agency', 'Freelance', 'Other'
];

const STAGES = [
  'idea', 'validation', 'mvp', 'early-revenue', 'growth', 'established'
];

const BUSINESS_MODELS = [
  'B2B', 'B2C', 'B2B2C', 'Marketplace', 'Platform', 'Service-based', 'Product-based'
];

const REVENUE_MODELS = [
  'subscription', 'one-time', 'commission', 'freemium', 'advertising', 'licensing'
];

const PRICE_POINTS = [
  'budget', 'mid-market', 'premium', 'luxury'
];

const REVENUE_RANGES = [
  '0-10k', '10k-100k', '100k-500k', '500k-1M', '1M-10M', '10M+'
];

export default function BusinessForm({ 
  business, 
  onSave, 
  onCancel, 
  isLoading = false 
}: BusinessFormProps) {
  const [primaryServices, setPrimaryServices] = useState<string[]>(
    business?.primaryServices || []
  );
  const [specialties, setSpecialties] = useState<string[]>(
    business?.specialties || []
  );
  const [newService, setNewService] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BusinessFormData>({
    defaultValues: business || {}
  });

  const watchedIndustry = watch('industry');
  const watchedBusinessType = watch('businessType');

  // Update form values when business prop changes
  useEffect(() => {
    if (business) {
      Object.keys(business).forEach(key => {
        if (key !== 'primaryServices' && key !== 'specialties') {
          setValue(key as keyof BusinessFormData, business[key as keyof BusinessFormData]);
        }
      });
      setPrimaryServices(business.primaryServices || []);
      setSpecialties(business.specialties || []);
    }
  }, [business, setValue]);

  const addService = () => {
    if (newService.trim() && !primaryServices.includes(newService.trim())) {
      setPrimaryServices([...primaryServices, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setPrimaryServices(primaryServices.filter(s => s !== service));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const onSubmit = async (data: BusinessFormData) => {
    await onSave({
      ...data,
      primaryServices,
      specialties
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {business ? 'Edit Business' : 'Create New Business'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Name *
                </label>
                <Input
                  {...register('name', { required: 'Business name is required' })}
                  placeholder="e.g. Bella Hair Salon"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry *
                </label>
                <Select onValueChange={(value) => setValue('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Type *
                </label>
                <Select onValueChange={(value) => setValue('businessType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sub-type (Optional)
                </label>
                <Input
                  {...register('subType')}
                  placeholder="e.g. Hair Salon, Pizza Restaurant"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                {...register('description')}
                placeholder="Brief description of your business..."
                rows={3}
              />
            </div>
          </div>

          {/* Location & Market */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location & Market</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <Input
                  {...register('location')}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Country
                </label>
                <Input
                  {...register('country')}
                  placeholder="e.g. United States"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Market
                </label>
                <Select onValueChange={(value) => setValue('targetMarket', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target market" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Target Audience
              </label>
              <Input
                {...register('targetAudience')}
                placeholder="e.g. Women aged 25-45, working professionals"
              />
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Stage *
                </label>
                <Select onValueChange={(value) => setValue('stage', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Founded Year
                </label>
                <Input
                  type="number"
                  {...register('foundedYear')}
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Size
                </label>
                <Input
                  type="number"
                  {...register('teamSize')}
                  placeholder="5"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Revenue Range
                </label>
                <Select onValueChange={(value) => setValue('revenueRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue range" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVENUE_RANGES.map(range => (
                      <SelectItem key={range} value={range}>
                        ${range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Business Model */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Model</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Model
                </label>
                <Select onValueChange={(value) => setValue('businessModel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business model" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_MODELS.map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Revenue Model
                </label>
                <Select onValueChange={(value) => setValue('revenueModel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue model" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVENUE_MODELS.map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price Point
                </label>
                <Select onValueChange={(value) => setValue('pricePoint', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price point" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_POINTS.map(point => (
                      <SelectItem key={point} value={point}>
                        {point.charAt(0).toUpperCase() + point.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Website
              </label>
              <Input
                {...register('website')}
                placeholder="https://yourbusiness.com"
                type="url"
              />
            </div>
          </div>

          {/* Services & Specialties */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services & Specialties</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Primary Services
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Add a service..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                />
                <Button type="button" onClick={addService} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {primaryServices.map(service => (
                  <Badge key={service} variant="secondary" className="flex items-center gap-1">
                    {service}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeService(service)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Specialties
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Add a specialty..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                />
                <Button type="button" onClick={addSpecialty} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {specialties.map(specialty => (
                  <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                    {specialty}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeSpecialty(specialty)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Goals & Vision</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Short-term Goals (Next 6 months)
              </label>
              <Textarea
                {...register('shortTermGoals')}
                placeholder="What do you want to achieve in the next 6 months?"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Long-term Vision (2-5 years)
              </label>
              <Textarea
                {...register('longTermVision')}
                placeholder="What's your long-term vision for this business?"
                rows={2}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {isLoading ? 'Saving...' : business ? 'Update Business' : 'Create Business'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}