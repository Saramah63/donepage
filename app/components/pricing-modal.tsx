"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import { CheckCircle, Sparkles, Zap, Crown } from "lucide-react";
import { toast } from "sonner";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
}

type Plan = "starter" | "business" | "pro";

export function PricingModal({ open, onClose }: PricingModalProps) {
  const handleSelect = async (plan: Plan) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Checkout failed");
      if (!data?.url) throw new Error("Missing checkout URL");

      window.location.href = data.url;
    } catch (e: any) {
      toast.error(e?.message ?? "Payment could not start");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center text-base">
            Select the perfect plan for your business needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {/* Starter */}
          <Card className="border-gray-200 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Starter</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="pt-4">
                <div className="text-4xl font-bold">$49</div>
                <div className="text-sm text-muted-foreground">one-time payment</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "1 landing page",
                "Free subdomain (.donepage.co)",
                "Basic SEO optimization",
                "SSL certificate included",
                "Mobile responsive design",
                "Email support",
              ].map((item) => (
                <div key={item} className="flex gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  {item}
                </div>
              ))}
              <Button
                onClick={() => handleSelect("starter")}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                Get Starter
              </Button>
            </CardContent>
          </Card>

          {/* Business */}
          <Card className="border-2 border-blue-600 shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Business</CardTitle>
              <CardDescription>For growing businesses</CardDescription>
              <div className="pt-4">
                <div className="text-4xl font-bold">$149</div>
                <div className="text-sm text-muted-foreground">one-time payment</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "5 landing pages",
                "Custom domain support",
                "Advanced SEO tools",
                "Analytics dashboard",
                'Remove "Powered by" branding',
                "Priority support",
                "A/B testing",
              ].map((item) => (
                <div key={item} className="flex gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  {item}
                </div>
              ))}
              <Button
                onClick={() => handleSelect("business")}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                Get Business
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="border-gray-200 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-4">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For professionals & agencies</CardDescription>
              <div className="pt-4">
                <div className="text-4xl font-bold">$299</div>
                <div className="text-sm text-muted-foreground">one-time payment</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Unlimited landing pages",
                "Unlimited custom domains",
                "Premium SEO features",
                "Advanced analytics & reporting",
                "White-label option",
                "24/7 priority support",
                "API access",
              ].map((item) => (
                <div key={item} className="flex gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  {item}
                </div>
              ))}
              <Button
                onClick={() => handleSelect("pro")}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
              >
                Get Pro
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          All plans include lifetime access. 30-day money-back guarantee.
        </div>
      </DialogContent>
    </Dialog>
  );
}
