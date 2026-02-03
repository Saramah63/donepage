module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Donepage/app/components/ui/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/Donepage/app/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/app/components/ui/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700",
            destructive: "bg-red-600 text-white hover:bg-red-700",
            outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            ghost: "hover:bg-gray-100 text-gray-900",
            link: "text-blue-600 underline-offset-4 hover:underline"
        },
        size: {
            default: "h-11 px-5",
            sm: "h-9 rounded-lg px-3",
            lg: "h-12 rounded-2xl px-8 text-base",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Donepage/app/components/ui/button.tsx",
        lineNumber: 46,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
;
}),
"[project]/Donepage/app/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/app/components/ui/utils.ts [app-ssr] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-white text-gray-900 flex flex-col gap-6 rounded-2xl border border-gray-200 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Donepage/app/components/ui/card.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("px-6 pt-6 space-y-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Donepage/app/components/ui/card.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xl font-semibold leading-none", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Donepage/app/components/ui/card.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm text-gray-600", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Donepage/app/components/ui/card.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("px-6 pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Donepage/app/components/ui/card.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/Donepage/app/components/questionnaire.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Questionnaire",
    ()=>Questionnaire
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/app/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/app/components/ui/card.tsx [app-ssr] (ecmascript)");
// app/components/questionnaire.tsx
"use client";
;
;
;
;
const STEPS = [
    {
        key: "businessName",
        title: "What is your business name?",
        subtitle: "This will appear on your landing page and in Google",
        options: []
    },
    {
        key: "country",
        title: "Which country are you based in?",
        subtitle: "Used for localized trust + SEO context",
        options: [
            {
                value: "Finland",
                title: "Finland",
                desc: "Suomi"
            },
            {
                value: "Sweden",
                title: "Sweden",
                desc: "Sverige"
            },
            {
                value: "Norway",
                title: "Norway",
                desc: "Norge"
            },
            {
                value: "Denmark",
                title: "Denmark",
                desc: "Danmark"
            },
            {
                value: "Germany",
                title: "Germany",
                desc: "Deutschland"
            },
            {
                value: "Netherlands",
                title: "Netherlands",
                desc: "Nederland"
            },
            {
                value: "UK",
                title: "United Kingdom",
                desc: "UK"
            },
            {
                value: "USA",
                title: "United States",
                desc: "USA"
            },
            {
                value: "Canada",
                title: "Canada",
                desc: "CA"
            },
            {
                value: "Australia",
                title: "Australia",
                desc: "AU"
            },
            {
                value: "Other",
                title: "Other",
                desc: "Select this if not listed"
            }
        ]
    },
    {
        key: "serviceType",
        title: "What type of service do you provide?",
        subtitle: "Select the category that best matches your business",
        options: [
            {
                value: "consulting",
                title: "Business Consulting",
                desc: "Strategy, operations, or management advice"
            },
            {
                value: "coaching",
                title: "Coaching & Training",
                desc: "Life coaching, career coaching, or skills training"
            },
            {
                value: "design",
                title: "Design Services",
                desc: "Graphic design, branding, or UX/UI design"
            },
            {
                value: "development",
                title: "Web/Software Development",
                desc: "Websites, apps, or custom software"
            },
            {
                value: "marketing",
                title: "Marketing & Advertising",
                desc: "Digital marketing, SEO, or social media management"
            },
            {
                value: "creative",
                title: "Creative Services",
                desc: "Photography, videography, or content creation"
            },
            {
                value: "legal",
                title: "Legal Services",
                desc: "Legal consulting or specialized legal services"
            },
            {
                value: "accounting",
                title: "Accounting & Finance",
                desc: "Bookkeeping, tax prep, or financial planning"
            }
        ]
    },
    {
        key: "targetAudience",
        title: "Who are your ideal clients?",
        subtitle: "Choose the audience you serve best",
        options: [
            {
                value: "individuals",
                title: "Individuals & Consumers",
                desc: "Personal clients with individual needs"
            },
            {
                value: "freelancers",
                title: "Freelancers & Solopreneurs",
                desc: "Self-employed professionals"
            },
            {
                value: "small-business",
                title: "Small Businesses",
                desc: "Local businesses and startups (1-50 employees)"
            },
            {
                value: "medium-business",
                title: "Growing Companies",
                desc: "Established businesses (50-250 employees)"
            },
            {
                value: "enterprise",
                title: "Enterprise & Corporations",
                desc: "Large organizations with complex needs"
            }
        ]
    },
    {
        key: "businessStage",
        title: "What stage is your business at?",
        subtitle: "This helps us position your expertise appropriately",
        options: [
            {
                value: "starting",
                title: "Just Starting Out",
                desc: "New to the market, building your first clients"
            },
            {
                value: "established",
                title: "Established & Growing",
                desc: "Steady client base, looking to expand"
            },
            {
                value: "scaling",
                title: "Scaling & Systemizing",
                desc: "Strong reputation, ready to scale operations"
            }
        ]
    },
    {
        key: "primaryGoal",
        title: "What's your main goal with this landing page?",
        subtitle: "We'll optimize your page for this outcome",
        options: [
            {
                value: "leads",
                title: "Generate Qualified Leads",
                desc: "Collect contact info from interested prospects"
            },
            {
                value: "calls",
                title: "Book Discovery Calls",
                desc: "Get prospects to schedule a consultation"
            },
            {
                value: "packages",
                title: "Sell Service Packages",
                desc: "Directly sell or showcase your offerings"
            },
            {
                value: "credibility",
                title: "Build Credibility & Trust",
                desc: "Establish authority and showcase expertise"
            }
        ]
    },
    {
        key: "experienceLevel",
        title: "How much experience do you have?",
        subtitle: "We'll highlight your background appropriately",
        options: [
            {
                value: "new",
                title: "Less than 2 years",
                desc: "Fresh perspective and modern approaches"
            },
            {
                value: "intermediate",
                title: "2-5 years",
                desc: "Proven track record with real results"
            },
            {
                value: "expert",
                title: "5-10 years",
                desc: "Deep expertise and industry knowledge"
            },
            {
                value: "veteran",
                title: "10+ years",
                desc: "Industry veteran with extensive experience"
            }
        ]
    },
    {
        key: "pricingApproach",
        title: "How do you position your pricing?",
        subtitle: "This affects how we communicate value",
        options: [
            {
                value: "budget",
                title: "Affordable & Accessible",
                desc: "Great value for budget-conscious clients"
            },
            {
                value: "competitive",
                title: "Competitive & Fair",
                desc: "Balanced pricing for quality service"
            },
            {
                value: "premium",
                title: "Premium & High-End",
                desc: "Top-tier service at premium rates"
            },
            {
                value: "custom",
                title: "Custom Quotes Only",
                desc: "Every project is uniquely priced"
            }
        ]
    },
    {
        key: "keyDifferentiator",
        title: "What makes you stand out?",
        subtitle: "Choose your strongest competitive advantage",
        options: [
            {
                value: "speed",
                title: "Fast Turnaround",
                desc: "Quick delivery without compromising quality"
            },
            {
                value: "quality",
                title: "Exceptional Quality",
                desc: "Meticulous attention to detail and excellence"
            },
            {
                value: "expertise",
                title: "Specialized Expertise",
                desc: "Deep knowledge in a specific niche"
            },
            {
                value: "personal",
                title: "Personalized Service",
                desc: "Tailored approach for each client"
            },
            {
                value: "results",
                title: "Proven Results",
                desc: "Track record of measurable success"
            }
        ]
    },
    {
        key: "trustFactor",
        title: "What builds trust with your clients?",
        subtitle: "Select your strongest credibility indicator",
        options: [
            {
                value: "certifications",
                title: "Certifications & Credentials",
                desc: "Professional certifications and licenses"
            },
            {
                value: "experience",
                title: "Years of Experience",
                desc: "Extensive time in the industry"
            },
            {
                value: "results",
                title: "Client Results & ROI",
                desc: "Proven outcomes and success stories"
            },
            {
                value: "guarantee",
                title: "Satisfaction Guarantee",
                desc: "Risk-free promise or money-back guarantee"
            },
            {
                value: "portfolio",
                title: "Portfolio & Past Work",
                desc: "Showcase of completed projects"
            }
        ]
    },
    {
        key: "includeAbout",
        title: `Do you want to add an "About" section?`,
        subtitle: "Tell your story and connect with potential clients",
        options: [
            {
                value: "yes",
                title: "Yes, Add About Section",
                desc: "Share your background and mission"
            },
            {
                value: "no",
                title: "No, Skip About Section",
                desc: "Keep the page focused on services only"
            }
        ]
    }
];
function Questionnaire({ initialAnswers, onChange, onGenerate, onComplete }) {
    const total = STEPS.length;
    const [stepIndex, setStepIndex] = __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](0);
    const [answers, setAnswers] = __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](initialAnswers ?? {});
    const step = STEPS[stepIndex];
    const currentValue = answers[step.key];
    const progress = Math.round((stepIndex + 1) / total * 100);
    const isInputStep = step.options.length === 0;
    const canGoNext = isInputStep ? Boolean((currentValue ?? "").toString().trim()) : Boolean(currentValue);
    const update = (patch)=>{
        setAnswers((prev)=>{
            const next = {
                ...prev,
                ...patch
            };
            onChange?.(next);
            return next;
        });
    };
    const setValue = (value)=>{
        update({
            [step.key]: value
        });
    };
    const goBack = ()=>{
        setStepIndex((s)=>Math.max(0, s - 1));
    };
    const goNext = async ()=>{
        if (!canGoNext) return;
        // مراحل میانی
        if (stepIndex < total - 1) {
            setStepIndex((s)=>Math.min(total - 1, s + 1));
            return;
        }
        // ✅ مرحله آخر: فقط خروجی بده، routing/save را parent انجام می‌دهد
        const final = answers;
        onGenerate?.(final);
        onComplete?.(final);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0.45),rgba(255,255,255,0.85))]",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                lineNumber: 259,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
            }, void 0, false, {
                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                lineNumber: 263,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"
            }, void 0, false, {
                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mx-auto flex max-w-4xl flex-col px-4 pb-14 pt-12 sm:pt-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto w-full max-w-3xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block h-2 w-2 animate-pulse rounded-full bg-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                        lineNumber: 269,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-semibold text-gray-900",
                                        children: "Landing Page Generator"
                                    }, void 0, false, {
                                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "mt-5 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl",
                                children: "Answer 9 quick questions to get your personalized landing page"
                            }, void 0, false, {
                                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex items-center justify-between text-sm text-gray-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium",
                                        children: [
                                            "Question ",
                                            stepIndex + 1,
                                            " of ",
                                            total
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-semibold text-gray-700",
                                        children: [
                                            progress,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                        lineNumber: 281,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 h-2 w-full rounded-full bg-white/80 ring-1 ring-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-[width] duration-500 ease-out",
                                    style: {
                                        width: `${progress}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                    lineNumber: 285,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                lineNumber: 284,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "mx-auto mt-8 w-full max-w-3xl border border-gray-200 bg-white/85 shadow-xl shadow-blue-500/5 backdrop-blur-xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-6 sm:p-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl",
                                            children: step.title
                                        }, void 0, false, {
                                            fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                            lineNumber: 295,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-gray-600 sm:text-base",
                                            children: step.subtitle
                                        }, void 0, false, {
                                            fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                            lineNumber: 298,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                    lineNumber: 294,
                                    columnNumber: 13
                                }, this),
                                isInputStep ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 space-y-3",
                                    children: step.key === "aboutText" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        placeholder: "Write a short About section...",
                                        value: answers.aboutText ?? "",
                                        onChange: (e)=>setValue(e.target.value),
                                        className: "w-full min-h-[140px] rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                                    }, void 0, false, {
                                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                        lineNumber: 305,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        placeholder: step.key === "businessName" ? "Business name" : step.key === "city" ? "City (optional)" : step.key === "primaryOffer" ? "Primary offer (e.g. 1:1 Coaching for Women)" : step.key === "contactEmail" ? "Contact email" : step.key === "contactPhone" ? "Phone (optional)" : step.key === "bookingLink" ? "Booking link (Calendly / TidyCal / Google Calendar URL)" : "",
                                        value: currentValue ?? "",
                                        onChange: (e)=>setValue(e.target.value),
                                        className: "w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                                    }, void 0, false, {
                                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                        lineNumber: 312,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                    lineNumber: 303,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 space-y-3",
                                    children: step.options.map((opt)=>{
                                        const selected = currentValue === opt.value;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setValue(opt.value),
                                            className: [
                                                "group w-full rounded-2xl border p-4 text-left transition-all duration-200",
                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                                                selected ? "border-blue-300 bg-blue-50/70 shadow-sm" : "border-gray-200 bg-white hover:-translate-y-[1px] hover:border-blue-200 hover:shadow-md"
                                            ].join(" "),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: [
                                                            "mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all",
                                                            selected ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white group-hover:border-blue-400"
                                                        ].join(" "),
                                                        "aria-hidden": "true",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: [
                                                                "h-2.5 w-2.5 rounded-full transition-all",
                                                                selected ? "bg-white" : "bg-transparent"
                                                            ].join(" ")
                                                        }, void 0, false, {
                                                            fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                                            lineNumber: 361,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "min-w-0 flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-base font-semibold text-gray-900",
                                                                        children: opt.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                                                        lineNumber: 371,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    selected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "inline-flex items-center rounded-full bg-blue-600/10 px-2 py-1 text-xs font-semibold text-blue-700",
                                                                        children: "Selected"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                                                        lineNumber: 373,
                                                                        columnNumber: 31
                                                                    }, this) : null
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                                                lineNumber: 370,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-1 text-sm leading-relaxed text-gray-600",
                                                                children: opt.desc
                                                            }, void 0, false, {
                                                                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                                                lineNumber: 378,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                                        lineNumber: 369,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                                lineNumber: 351,
                                                columnNumber: 23
                                            }, this)
                                        }, opt.value, false, {
                                            fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                            lineNumber: 339,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                    lineNumber: 335,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-8 flex items-center justify-between gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            onClick: goBack,
                                            disabled: stepIndex === 0,
                                            className: "h-11 rounded-xl border-gray-300 bg-white px-5 text-gray-900 hover:bg-gray-50 disabled:opacity-50",
                                            children: "Back"
                                        }, void 0, false, {
                                            fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                            lineNumber: 388,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: goNext,
                                            disabled: !canGoNext,
                                            className: "h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50",
                                            children: stepIndex === total - 1 ? "Generate Page" : "Next"
                                        }, void 0, false, {
                                            fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                            lineNumber: 397,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                                    lineNumber: 387,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                            lineNumber: 293,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Donepage/app/components/questionnaire.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Donepage/app/components/questionnaire.tsx",
        lineNumber: 258,
        columnNumber: 5
    }, this);
}
}),
"[project]/Donepage/app/generator/generator-client.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GeneratorClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$questionnaire$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/app/components/questionnaire.tsx [app-ssr] (ecmascript)");
// app/generator/generator-client.tsx
"use client";
;
;
;
;
function slugify(input) {
    return input.toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^a-z0-9\-]/g, "").replace(/\-+/g, "-").replace(/^\-+|\-+$/g, "");
}
function makeSlug(answers) {
    const base = answers?.businessName || answers?.brandName || answers?.name || "landing";
    const s = slugify(String(base));
    const suffix = Math.random().toString(36).slice(2, 7);
    return s ? `${s}-${suffix}` : `landing-${suffix}`;
}
function GeneratorClient({ onSave }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [answers, setAnswers] = __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [loading, setLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    async function handleGenerate(finalAnswers) {
        setLoading(true);
        setError(null);
        try {
            const slug = makeSlug(finalAnswers);
            // 1) Save server-side (KV/memory)
            await onSave(slug, finalAnswers);
            // 2) Client fallback cache (same key prefix as server)
            const now = Date.now();
            localStorage.setItem(`landing:${slug}`, JSON.stringify({
                answers: finalAnswers,
                createdAt: now,
                updatedAt: now
            }));
            // 3) Navigate to generated page
            router.push(`/${slug}`);
        } catch (e) {
            setError(e?.message ?? "Generate failed");
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$components$2f$questionnaire$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Questionnaire"], {
                initialAnswers: answers ?? undefined,
                onChange: (a)=>setAnswers(a),
                onGenerate: (a)=>handleGenerate(a)
            }, void 0, false, {
                fileName: "[project]/Donepage/app/generator/generator-client.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sr-only",
                children: error
            }, void 0, false, {
                fileName: "[project]/Donepage/app/generator/generator-client.tsx",
                lineNumber: 76,
                columnNumber: 16
            }, this) : null,
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sr-only",
                children: "Loading"
            }, void 0, false, {
                fileName: "[project]/Donepage/app/generator/generator-client.tsx",
                lineNumber: 77,
                columnNumber: 18
            }, this) : null
        ]
    }, void 0, true);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__169f0229._.js.map