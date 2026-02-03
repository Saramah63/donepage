// app/components/content.ts
import * as React from "react";
import type { QuestionnaireAnswers } from "./questionnaire";

import {
  Award,
  Briefcase,
  CheckCircle,
  Clock,
  Globe,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export type LandingContent = ReturnType<typeof generateContent>;
export type Answers = QuestionnaireAnswers;

/**
 * These label helpers were previously imported from "@/app/lib/seo",
 * but seo.ts only exports generateSEO. Keeping labels here avoids
 * broken imports and keeps UI/content unchanged.
 */
function serviceTypeLabel(serviceType: QuestionnaireAnswers["serviceType"]) {
  const map: Record<string, string> = {
    consulting: "Business Consulting",
    coaching: "Coaching & Training",
    design: "Design Services",
    development: "Web Development",
    marketing: "Marketing Services",
    creative: "Creative Services",
    legal: "Legal Services",
    accounting: "Accounting & Finance",
  };
  return map[serviceType as string] ?? "Professional Services";
}

function audienceLabelShort(audience: QuestionnaireAnswers["targetAudience"]) {
  const map: Record<string, string> = {
    individuals: "Individuals",
    freelancers: "Freelancers",
    "small-business": "Small Businesses",
    "medium-business": "Mid-Market Businesses",
    enterprise: "Enterprises",
  };
  return map[audience as string] ?? String(audience ?? "Clients");
}

function diffLabel(diff: QuestionnaireAnswers["keyDifferentiator"]) {
  const map: Record<string, string> = {
    speed: "Fast, Reliable",
    quality: "Premium Quality",
    expertise: "Expert-Led",
    personal: "Personalized",
    results: "Results-Driven",
  };
  return map[diff as string] ?? String(diff ?? "Results-Driven");
}

export function generateContent(answers: QuestionnaireAnswers) {
  const service = serviceTypeLabel(answers.serviceType);
  const audience = audienceLabelShort(answers.targetAudience);
  const diff = diffLabel(answers.keyDifferentiator);

  const experienceLine =
    answers.experienceLevel === "new"
      ? "Fresh perspective and modern approaches"
      : answers.experienceLevel === "intermediate"
      ? "Proven track record with real results"
      : answers.experienceLevel === "expert"
      ? "Deep expertise and industry knowledge"
      : "Industry veteran with extensive experience";

  const headline =
    answers.targetAudience === "enterprise"
      ? `Expert ${service} to Drive Enterprise Outcomes`
      : answers.targetAudience === "medium-business"
      ? `Expert ${service} to Scale Your Operations`
      : answers.targetAudience === "small-business"
      ? `Practical ${service} to Grow Your Business`
      : answers.targetAudience === "freelancers"
      ? `${service} Built for Solopreneurs`
      : `${service} That Gets Results`;

  const primaryCTA =
    answers.primaryGoal === "leads"
      ? "Get Your Free Consultation"
      : answers.primaryGoal === "calls"
      ? "Book Your Discovery Call"
      : answers.primaryGoal === "packages"
      ? "View Service Packages"
      : "Learn More";

  const secondaryCTA =
    answers.primaryGoal === "calls" ? "View Our Work" : "Learn More";

  const trustBadges = [
    answers.trustFactor === "guarantee"
      ? "Satisfaction Guarantee"
      : answers.trustFactor === "certifications"
      ? "Certified Professionals"
      : answers.trustFactor === "portfolio"
      ? "Proven Portfolio"
      : answers.trustFactor === "results"
      ? "Client Results & ROI"
      : "Years of Experience",
    diff,
    "Fast Response Time",
  ];

  const valueDesc =
    answers.businessStage === "starting"
      ? "We help you launch with clarity, credibility, and a conversion-first message."
      : answers.businessStage === "established"
      ? "We refine your positioning and optimize the funnel to increase qualified demand."
      : "We systemize acquisition with scalable messaging and trust-building assets.";

  const benefits = [
    answers.keyDifferentiator === "speed"
      ? {
          title: "Fast Turnaround",
          description:
            "Quick delivery without compromising quality—ship results on time.",
          tone: "blue",
        }
      : answers.keyDifferentiator === "quality"
      ? {
          title: "Exceptional Quality",
          description:
            "Meticulous attention to detail and high standards in every deliverable.",
          tone: "blue",
        }
      : answers.keyDifferentiator === "expertise"
      ? {
          title: "Specialized Expertise",
          description:
            "Deep knowledge in a focused niche—clarity, confidence, and precision.",
          tone: "blue",
        }
      : answers.keyDifferentiator === "personal"
      ? {
          title: "Personalized Service",
          description:
            "Tailored strategy and execution based on your business context.",
          tone: "blue",
        }
      : {
          title: "Proven Results",
          description:
            "Track record of measurable success and client outcomes you can trust.",
          tone: "blue",
        },
    {
      title: "Strategic Solutions",
      description:
        "Data-informed decisions aligned to your primary business objective.",
      tone: "cyan",
    },
    answers.trustFactor === "guarantee"
      ? {
          title: "Risk-Free Guarantee",
          description:
            "If you’re not satisfied, we’ll make it right—clear and fair terms.",
          tone: "cyan",
        }
      : answers.trustFactor === "certifications"
      ? {
          title: "Certified Credentials",
          description:
            "Professional training and standards that reduce decision risk.",
          tone: "cyan",
        }
      : answers.trustFactor === "portfolio"
      ? {
          title: "Work You Can Verify",
          description:
            "Real projects and proof—what we say is backed by execution.",
          tone: "cyan",
        }
      : answers.trustFactor === "results"
      ? {
          title: "Client Results & ROI",
          description:
            "Outcomes-first positioning—what changes, improves, and scales.",
          tone: "cyan",
        }
      : {
          title: "Credibility Built-In",
          description:
            "Experience and process that make collaboration smooth and predictable.",
          tone: "cyan",
        },
  ];

  const offerings = serviceOfferings(answers.serviceType);

  const stats = [
    {
      label: "Years of Experience",
      value:
        answers.experienceLevel === "veteran"
          ? "10+"
          : answers.experienceLevel === "expert"
          ? "7+"
          : answers.experienceLevel === "intermediate"
          ? "3+"
          : "1+",
    },
    { label: "Happy Clients", value: "100+" },
    {
      label:
        answers.trustFactor === "results"
          ? "Client Success Rate"
          : "Average Rating",
      value: answers.trustFactor === "results" ? "95%" : "5.0",
    },
  ];

  const portfolioTitle =
    answers.trustFactor === "portfolio"
      ? "Our Recent Work"
      : answers.trustFactor === "results"
      ? "Client Success Stories"
      : "Featured Projects";

  const portfolioItems = portfolioByService(answers.serviceType);

  const includeAbout = answers.includeAbout === "yes";

  const about = {
    badge: "About Us",
    title: "Who We Are",
    story: `At ${service}, we deliver outcomes with a clear process and high accountability. We focus on the work that moves metrics—not busywork.`,
    mission: `Deliver ${service.toLowerCase()} that creates measurable progress for ${audience.toLowerCase()}.`,
    team: `A focused team built around ${diff.toLowerCase()} and consistent execution.`,
    experience:
      answers.experienceLevel === "veteran"
        ? "10+"
        : answers.experienceLevel === "expert"
        ? "7+"
        : "3+",
  };

  const ctaHeadline =
    answers.primaryGoal === "calls"
      ? "Let’s Talk About Your Goals"
      : answers.primaryGoal === "packages"
      ? "Choose Your Perfect Package"
      : "Ready to Get Started?";

  const ctaSubheadline =
    answers.keyDifferentiator === "expertise"
      ? "Tap into specialized expertise—schedule your free consultation"
      : answers.keyDifferentiator === "quality"
      ? "Upgrade quality and outcomes—let’s discuss the best path forward"
      : answers.keyDifferentiator === "speed"
      ? "Move fast with confidence—get results quickly without chaos"
      : answers.keyDifferentiator === "personal"
      ? "Get a tailored plan—built around your goals and constraints"
      : "Join clients who trust results—book your next step";

  const ctaSubtext =
    answers.primaryGoal === "calls"
      ? "No obligation • Free 30-minute consultation • Quick response"
      : answers.pricingApproach === "custom"
      ? "Free quote • Transparent scope • No hidden fees"
      : "Quick setup • No commitment • Get started in minutes";

  const contact = {
    title: "Get in Touch",
    subtitle: "Ready to get started? Choose the best way to connect.",
    call: {
      title: "Book a Call",
      desc: "Schedule a free consultation",
      cta: "Schedule Now",
    },
    email: {
      title: "Send an Email",
      desc: "Prefer email? Drop a message anytime",
      cta: "Email Us",
    },
    chat: {
      title: "Live Chat",
      desc: "Get instant answers to your questions",
      cta: "Start Chat",
    },
  };

  const pricing = defaultPricing();

  return {
    meta: {
      businessName: service,
      headline,
      subheadline: experienceLine,
      primaryCTA,
      secondaryCTA,
      trustBadges,
    },
    value: {
      title: "Why Choose Us?",
      description: valueDesc,
      benefits,
    },
    services: {
      title: `Our ${service} Solutions`,
      subtitle: "Comprehensive services tailored to your unique needs",
      offerings,
    },
    trust: {
      title: "Trusted by Clients Like You",
      subtitle: "See why businesses choose us for their success",
      stats,
      guarantee:
        answers.trustFactor === "guarantee"
          ? {
              title: "Our Satisfaction Guarantee",
              description:
                "We stand behind our work. If you’re not satisfied with the outcome, we’ll iterate until it meets expectations—or provide a fair refund per written scope.",
            }
          : null,
    },
    portfolio: {
      title: portfolioTitle,
      subtitle: "See how we’ve helped clients achieve their goals",
      items: portfolioItems,
    },
    about: includeAbout ? about : null,
    cta: {
      headline: ctaHeadline,
      subheadline: ctaSubheadline,
      buttonText: primaryCTA,
      subtext: ctaSubtext,
    },
    contact,
    pricing,
  };
}

function serviceOfferings(serviceType: QuestionnaireAnswers["serviceType"]) {
  const base = {
    consulting: [
      {
        name: "Business Strategy",
        description:
          "Comprehensive strategic planning to drive growth and efficiency",
        features: [
          "Market analysis and competitive positioning",
          "Growth strategy development",
          "Operational optimization",
          "Performance metrics and KPIs",
        ],
        icon: "target",
      },
      {
        name: "Process Improvement",
        description: "Streamline operations and maximize productivity",
        features: [
          "Workflow analysis and optimization",
          "Systems implementation",
          "Change management support",
          "Ongoing performance monitoring",
        ],
        icon: "trending",
      },
    ],
    coaching: [
      {
        name: "1:1 Coaching",
        description: "Personalized coaching sessions tailored to your goals",
        features: [
          "Goal setting and planning",
          "Weekly accountability",
          "Custom action plans",
          "Email support",
        ],
        icon: "users",
      },
      {
        name: "Group Programs",
        description: "Collaborative learning with like-minded professionals",
        features: [
          "Live group sessions",
          "Peer networking",
          "Resource library",
          "Community support",
        ],
        icon: "sparkles",
      },
    ],
    design: [
      {
        name: "Brand Identity",
        description: "Create a memorable brand that stands out",
        features: [
          "Logo + brand system",
          "Typography + colors",
          "Brand positioning",
          "Marketing assets",
        ],
        icon: "sparkles",
      },
      {
        name: "Digital Design",
        description: "Modern, user-focused digital experiences",
        features: [
          "Web/app UI",
          "UX optimization",
          "Responsive design",
          "Prototyping",
        ],
        icon: "target",
      },
    ],
    development: [
      {
        name: "Website Development",
        description: "High-performance websites built for growth",
        features: ["Mobile-first", "SEO-ready", "Analytics integration", "CMS options"],
        icon: "zap",
      },
      {
        name: "Web Applications",
        description: "Scalable solutions for complex business needs",
        features: ["Custom features", "Database + API", "Auth + roles", "Maintenance"],
        icon: "target",
      },
    ],
    marketing: [
      {
        name: "Digital Marketing",
        description: "Drive traffic and conversions with data-driven campaigns",
        features: ["SEO strategy", "PPC management", "Social growth", "Email funnels"],
        icon: "trending",
      },
      {
        name: "Content Strategy",
        description: "Content that connects and converts",
        features: ["Messaging", "Editorial calendar", "Creative direction", "Performance analytics"],
        icon: "sparkles",
      },
    ],
    creative: [
      {
        name: "Photography",
        description: "Professional visuals for your brand",
        features: ["Product shoots", "Headshots", "Event coverage", "Retouching"],
        icon: "sparkles",
      },
      {
        name: "Video Production",
        description: "Compelling video content that tells your story",
        features: ["Promo videos", "Social clips", "Editing", "Distribution-ready exports"],
        icon: "zap",
      },
    ],
    legal: [
      {
        name: "Legal Consulting",
        description: "Practical legal guidance for your business",
        features: ["Contracts", "Compliance", "Risk review", "Ongoing support"],
        icon: "shield",
      },
      {
        name: "Document Services",
        description: "Professional legal documentation",
        features: ["Terms & conditions", "Privacy policy", "Agreements", "Employment docs"],
        icon: "award",
      },
    ],
    accounting: [
      {
        name: "Bookkeeping",
        description: "Accurate financial records you can trust",
        features: ["Monthly reconciliation", "Reporting", "Expense tracking", "Payroll support"],
        icon: "trending",
      },
      {
        name: "Tax Services",
        description: "Maximize deductions and stay compliant",
        features: ["Tax preparation", "Tax planning", "Audit support", "Year-round advice"],
        icon: "target",
      },
    ],
  } as const;

  return (base as any)[serviceType] ?? base.consulting;
}

function portfolioByService(serviceType: QuestionnaireAnswers["serviceType"]) {
  const base = {
    consulting: [
      {
        title: "Manufacturing Optimization",
        description: "Streamlined operations for a mid-size manufacturer",
        metric: "35% efficiency increase",
      },
      {
        title: "Growth Strategy",
        description: "Strategic planning for tech startup expansion",
        metric: "3x revenue growth",
      },
      {
        title: "Change Management",
        description: "Successful organizational transformation",
        metric: "90% adoption rate",
      },
    ],
    coaching: [
      { title: "Career Transition", description: "Guided professional to a better role", metric: "40% salary increase" },
      { title: "Leadership Growth", description: "Improved executive communication and clarity", metric: "Promoted in 8 months" },
      { title: "Team Performance", description: "Boosted team delivery and accountability", metric: "60% performance lift" },
    ],
    design: [
      { title: "Brand Refresh", description: "Rebrand for a growing SaaS company", metric: "200% recognition increase" },
      { title: "E-commerce UX", description: "Conversion-focused redesign", metric: "45% conversion increase" },
      { title: "Mobile App UI", description: "Fintech interface redesign", metric: "4.8 star rating" },
    ],
    development: [
      { title: "Custom Web Platform", description: "Built scalable SaaS platform", metric: "10k+ active users" },
      { title: "E-commerce Site", description: "Performance optimization for storefront", metric: "50% faster load" },
      { title: "Business App", description: "Internal tools for enterprise ops", metric: "70% time saved" },
    ],
    marketing: [
      { title: "SEO Campaign", description: "Ranked #1 for competitive keywords", metric: "300% organic growth" },
      { title: "PPC Optimization", description: "Improved efficiency and ROAS", metric: "5x ROAS" },
      { title: "Social Growth", description: "Built an engaged audience", metric: "50k in 6 months" },
    ],
    creative: [
      { title: "Product Photography", description: "E-commerce visuals upgrade", metric: "65% higher CTR" },
      { title: "Brand Video", description: "Story-driven promotional video", metric: "1M+ views" },
      { title: "Event Coverage", description: "Conference coverage + edits", metric: "500+ deliverables" },
    ],
    legal: [
      { title: "Contract Review", description: "Reduced risk and clarified terms", metric: "$2M deal protected" },
      { title: "Compliance Audit", description: "Ensured regulatory alignment", metric: "Zero issues" },
      { title: "Dispute Resolution", description: "Resolved business conflict quickly", metric: "30 days" },
    ],
    accounting: [
      { title: "Tax Strategy", description: "Optimized tax position", metric: "$50k saved" },
      { title: "Financial Cleanup", description: "Organized 3 years of records", metric: "Audit-ready in 2 weeks" },
      { title: "CFO Support", description: "Part-time CFO for startup", metric: "$2M funding secured" },
    ],
  } as const;

  return (base as any)[serviceType] ?? base.consulting;
}

export function defaultPricing() {
  return {
    title: "Choose Your Plan",
    subtitle: "Select the perfect plan for your business needs",
    plans: [
      {
        name: "Starter",
        price: 49,
        badge: null as string | null,
        desc: "Perfect for getting started",
        highlights: [
          "1 landing page",
          "Free subdomain (.donepage.co)",
          "Basic SEO optimization",
          "SSL certificate included",
          "Mobile responsive design",
          "Email support",
        ],
        cta: "Get Started",
        tone: "starter" as const,
      },
      {
        name: "Business",
        price: 149,
        badge: "Most Popular",
        desc: "For growing businesses",
        highlights: [
          "5 landing pages",
          "Custom domain support",
          "Advanced SEO tools",
          "Analytics dashboard",
          'Remove "Powered by" branding',
          "Priority support",
          "A/B testing features",
        ],
        cta: "Get Business",
        tone: "business" as const,
      },
      {
        name: "Pro",
        price: 399,
        badge: null,
        desc: "For professionals & agencies",
        highlights: [
          "Unlimited landing pages",
          "Unlimited custom domains",
          "Premium SEO features",
          "Advanced analytics & reporting",
          "White-label option",
          "24/7 priority support",
          "Custom integrations",
          "API access",
        ],
        cta: "Get Pro",
        tone: "pro" as const,
      },
    ],
    footer: "All plans include lifetime access. 30-day money-back guarantee.",
  };
}
