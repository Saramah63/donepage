module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

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
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/Donepage/app/api/checkout/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/stripe/esm/stripe.esm.node.js [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
function getPriceId(plan) {
    if (plan === "starter") return process.env.STRIPE_PRICE_STARTER;
    if (plan === "business") return process.env.STRIPE_PRICE_BUSINESS;
    if (plan === "pro") return process.env.STRIPE_PRICE_PRO;
    return undefined;
}
async function POST(req) {
    try {
        const secret = process.env.STRIPE_SECRET_KEY;
        const bodyText = await req.text();
        let body = null;
        try {
            body = bodyText ? JSON.parse(bodyText) : null;
        } catch  {}
        const plan = body?.plan;
        console.log("CHECKOUT_DEBUG", {
            hasSecret: !!secret,
            plan,
            priceStarter: process.env.STRIPE_PRICE_STARTER,
            priceBusiness: process.env.STRIPE_PRICE_BUSINESS,
            pricePro: process.env.STRIPE_PRICE_PRO,
            appUrl: ("TURBOPACK compile-time value", "http://localhost:3000"),
            nodeEnv: ("TURBOPACK compile-time value", "development")
        });
        if (!secret) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing STRIPE_SECRET_KEY"
            }, {
                status: 500
            });
        }
        if (!plan || ![
            "starter",
            "business",
            "pro"
        ].includes(plan)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid plan"
            }, {
                status: 400
            });
        }
        const priceId = getPriceId(plan);
        if (!priceId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Missing Stripe price id for plan: ${plan}`
            }, {
                status: 500
            });
        }
        const stripe = new __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](secret);
        const appUrl = ("TURBOPACK compile-time value", "http://localhost:3000") || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            metadata: {
                plan
            },
            success_url: `${appUrl}/generator?paid=1&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/generator?canceled=1`
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url: session.url
        });
    } catch (err) {
        console.error("CHECKOUT_ERROR_RAW", err);
        console.error("CHECKOUT_ERROR_MESSAGE", err?.message);
        console.error("CHECKOUT_ERROR_TYPE", err?.type);
        console.error("CHECKOUT_ERROR_CODE", err?.code);
        console.error("CHECKOUT_ERROR_STATUS", err?.statusCode);
        console.error("CHECKOUT_ERROR_PARAM", err?.param);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err?.message ?? "Checkout failed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4c259703._.js.map