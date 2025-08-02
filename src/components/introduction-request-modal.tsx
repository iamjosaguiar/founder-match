"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Send, 
  User, 
  Mail, 
  MessageCircle,
  Briefcase,
  Building2,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";

type IntroductionRequestData = {
  subject: string;
  message: string;
  contactEmail: string;
  requestType: string;
};

type IntroductionRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    id: string;
    name: string;
    title?: string;
    organization?: string;
    profileType?: string;
    companyName?: string;
    tagline?: string;
  };
  context: "investor" | "company";
};

const requestTypeOptions = {
  investor: [
    { value: "investment", label: "Investment Discussion", icon: "💰" },
    { value: "mentorship", label: "Mentorship Request", icon: "🎯" },
    { value: "advisory", label: "Advisory Opportunity", icon: "💡" },
    { value: "partnership", label: "Strategic Partnership", icon: "🤝" },
    { value: "networking", label: "Professional Networking", icon: "👥" }
  ],
  company: [
    { value: "investment", label: "Investment Interest", icon: "💰" },
    { value: "partnership", label: "Strategic Partnership", icon: "🤝" },
    { value: "customer", label: "Potential Customer", icon: "🛒" },
    { value: "talent", label: "Talent/Hiring", icon: "👨‍💼" },
    { value: "networking", label: "Professional Networking", icon: "👥" }
  ]
};

export default function IntroductionRequestModal({ 
  isOpen, 
  onClose, 
  recipient, 
  context 
}: IntroductionRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<IntroductionRequestData>({
    defaultValues: {
      requestType: "",
      subject: "",
      message: "",
      contactEmail: ""
    }
  });

  const selectedRequestType = watch("requestType");
  const currentOptions = requestTypeOptions[context];

  const generateSubject = (type: string) => {
    const typeLabel = currentOptions.find(opt => opt.value === type)?.label || "Introduction";
    if (context === "investor") {
      return `${typeLabel} - Introduction Request`;
    } else {
      return `${typeLabel} - Interest in ${recipient.companyName || recipient.name}`;
    }
  };

  const generateMessage = (type: string) => {
    const templates = {
      investment: context === "investor" 
        ? `Hi ${recipient.name},\n\nI'm interested in discussing potential investment opportunities. I'd love to learn more about your investment focus and see if there might be synergies with companies in my network.\n\nLooking forward to connecting!\n\nBest regards,`
        : `Hi ${recipient.name},\n\nI'm reaching out regarding ${recipient.companyName}. Your company caught my attention and I'd be interested in learning more about your current funding situation and growth plans.\n\nWould you be open to a brief conversation?\n\nBest regards,`,
      mentorship: `Hi ${recipient.name},\n\nI'm seeking mentorship and guidance from experienced ${context === "investor" ? "investors" : "founders"} like yourself. I'd be honored to learn from your expertise and experience.\n\nWould you be open to a brief introductory call?\n\nBest regards,`,
      partnership: context === "investor"
        ? `Hi ${recipient.name},\n\nI believe there could be strategic partnership opportunities between us. I'd love to explore how we might collaborate or support each other's portfolio companies.\n\nWould you be interested in connecting?\n\nBest regards,`
        : `Hi ${recipient.name},\n\nI'm interested in exploring potential strategic partnerships with ${recipient.companyName}. I believe there could be synergies worth discussing.\n\nWould you be open to a conversation?\n\nBest regards,`,
      advisory: `Hi ${recipient.name},\n\nI'm impressed by your background and experience. I'd be interested in discussing potential advisory opportunities that might be mutually beneficial.\n\nWould you be open to a brief call?\n\nBest regards,`,
      networking: `Hi ${recipient.name},\n\nI'd love to connect and learn more about your work. I believe there could be value in building a professional relationship.\n\nWould you be interested in connecting?\n\nBest regards,`,
      customer: `Hi ${recipient.name},\n\nI'm interested in ${recipient.companyName} as a potential solution for my needs. I'd love to learn more about your product/service and discuss how it might fit our requirements.\n\nWould you be available for a brief conversation?\n\nBest regards,`,
      talent: `Hi ${recipient.name},\n\nI'm interested in the talent and expertise at ${recipient.companyName}. I'd love to discuss potential opportunities for collaboration or talent partnerships.\n\nWould you be open to connecting?\n\nBest regards,`
    };
    return templates[type as keyof typeof templates] || "";
  };

  const handleRequestTypeChange = (type: string) => {
    setValue("requestType", type);
    setValue("subject", generateSubject(type));
    setValue("message", generateMessage(type));
  };

  const onSubmit = async (data: IntroductionRequestData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Here you would make an API call to send the introduction request
      console.log("Sending introduction request:", {
        ...data,
        recipientId: recipient.id,
        context
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitStatus("success");
      
      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
        reset();
        setSubmitStatus("idle");
      }, 2000);

    } catch (error) {
      console.error("Error sending introduction request:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Request Introduction</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {submitStatus === "success" ? (
            // Success State
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">Introduction Request Sent!</h3>
              <p className="text-green-700">
                Your message has been sent to {recipient.name}. They&apos;ll receive an email notification 
                and can respond directly to you.
              </p>
            </div>
          ) : submitStatus === "error" ? (
            // Error State
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-900 mb-2">Failed to Send Request</h3>
              <p className="text-red-700 mb-4">
                There was an error sending your introduction request. Please try again.
              </p>
              <Button onClick={() => setSubmitStatus("idle")} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            // Form State
            <>
              {/* Recipient Info */}
              <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    {context === "investor" ? (
                      <Users className="w-6 h-6 text-white" />
                    ) : (
                      <Building2 className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{recipient.name}</h3>
                    {recipient.title && (
                      <p className="text-sm text-slate-600">{recipient.title}</p>
                    )}
                    {recipient.organization && (
                      <p className="text-sm text-slate-500">{recipient.organization}</p>
                    )}
                    {recipient.companyName && (
                      <p className="text-sm font-medium text-slate-700">{recipient.companyName}</p>
                    )}
                    {recipient.tagline && (
                      <p className="text-sm text-slate-500">{recipient.tagline}</p>
                    )}
                    {recipient.profileType && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {recipient.profileType.charAt(0).toUpperCase() + recipient.profileType.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Request Type */}
                <div>
                  <label className="block text-sm font-medium mb-3">Purpose of Introduction *</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {currentOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedRequestType === option.value
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => handleRequestTypeChange(option.value)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {!selectedRequestType && (
                    <p className="text-red-500 text-sm mt-1">Please select a purpose for your introduction</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <Input
                    {...register("subject", { required: "Subject is required" })}
                    placeholder="Brief subject line for your introduction request"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea
                    {...register("message", { required: "Message is required" })}
                    placeholder="Introduce yourself and explain why you'd like to connect..."
                    rows={8}
                    className="resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Be specific about your background and what you&apos;re hoping to achieve from this connection.
                  </p>
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Your Contact Email *</label>
                  <Input
                    type="email"
                    {...register("contactEmail", { 
                      required: "Contact email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    placeholder="your.email@company.com"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    They&apos;ll be able to respond directly to this email address.
                  </p>
                </div>

                {/* Legal Disclaimer */}
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-800">
                    <strong>Note:</strong> This platform facilitates introductions only. All business discussions, 
                    negotiations, and agreements are between you and the recipient directly. We do not provide 
                    investment advice or guarantee any outcomes.
                  </p>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !selectedRequestType}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Introduction Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}