"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Users, MessageCircle, Code, Bot, TrendingUp } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for solo founders getting started",
      price: "Free",
      period: "forever",
      features: [
        "Basic co-founder matching",
        "Community access",
        "5 CoFoundr AI conversations/month",
        "Basic business profile",
        "Email support"
      ],
      cta: "Get Started",
      href: "/auth/signup",
      popular: false
    },
    {
      name: "Growth",
      description: "For serious founders ready to scale",
      price: "$29",
      period: "per month",
      features: [
        "Advanced co-founder matching with filters",
        "Unlimited CoFoundr AI conversations",
        "Multiple business profiles",
        "Priority community access",
        "Execution network access",
        "Project collaboration tools",
        "Priority support"
      ],
      cta: "Start Free Trial",
      href: "/auth/signup?plan=growth",
      popular: true
    },
    {
      name: "Scale",
      description: "For established startups and teams",
      price: "$99",
      period: "per month",
      features: [
        "Everything in Growth",
        "Financing hub access",
        "Investor network connections",
        "Advanced analytics & insights",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options"
      ],
      cta: "Contact Sales",
      href: "/contact?plan=scale",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CoFoundr Journey
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From solo founder to scaling startup - we have the tools and community 
            to support you at every stage of your entrepreneurial journey.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-0 shadow-xl ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 scale-105' 
                  : 'hover:shadow-2xl transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <p className="text-slate-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-slate-600 ml-2">/{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Co-Founder Matching</h3>
            <p className="text-sm text-slate-600">Find your perfect co-founder with our AI-powered matching</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bot className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">CoFoundr AI</h3>
            <p className="text-sm text-slate-600">Your personal business sidekick for strategic guidance</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Code className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Execution Network</h3>
            <p className="text-sm text-slate-600">Connect with developers, designers, and specialists</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-2">Financing Hub</h3>
            <p className="text-sm text-slate-600">Access investors and funding opportunities</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-slate-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-slate-600">Yes, all paid plans include a 14-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens to my data if I cancel?</h3>
              <p className="text-slate-600">Your account and data remain accessible. You can reactivate anytime within 30 days.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-slate-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Co-Founder?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of founders who&apos;ve found their perfect co-founder and built successful startups together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}