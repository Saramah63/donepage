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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/Donepage/app/lib/answers-store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/lib/answers-store.ts
__turbopack_context__.s([
    "getAnswersBySlug",
    ()=>getAnswersBySlug,
    "saveAnswersBySlug",
    ()=>saveAnswersBySlug
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/@vercel/kv/dist/index.js [app-route] (ecmascript)");
;
const KEY_PREFIX = "landing:";
function hasKV() {
    return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}
function memStore() {
    if (!global.__donepageMemoryStore) global.__donepageMemoryStore = new Map();
    return global.__donepageMemoryStore;
}
async function saveAnswersBySlug(slug, answers) {
    const now = Date.now();
    const key = `${KEY_PREFIX}${slug}`;
    if (hasKV()) {
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kv"].get(key) ?? null;
        const payload = {
            answers,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kv"].set(key, payload);
        return;
    }
    // fallback
    const store = memStore();
    const existing = store.get(key);
    store.set(key, {
        answers,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now
    });
}
async function getAnswersBySlug(slug) {
    const key = `${KEY_PREFIX}${slug}`;
    if (hasKV()) {
        const data = await __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f40$vercel$2f$kv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kv"].get(key);
        return data ?? null;
    }
    const store = memStore();
    return store.get(key) ?? null;
}
}),
"[project]/Donepage/app/api/publish/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$lib$2f$answers$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Donepage/app/lib/answers-store.ts [app-route] (ecmascript)");
;
;
function sanitizeSlug(input) {
    return (input || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
}
async function POST(req) {
    try {
        const body = await req.json();
        const slug = sanitizeSlug(body.slug ?? "");
        const answers = body.answers;
        if (!slug) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing slug"
            }, {
                status: 400
            });
        }
        if (!answers || !answers.serviceType || !answers.targetAudience) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing answers"
            }, {
                status: 400
            });
        }
        // Persist
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$app$2f$lib$2f$answers$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveAnswersBySlug"])(slug, answers);
        const base = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        return __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            slug,
            url: `${base}/${slug}`
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Donepage$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e?.message ?? "Publish failed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2f0008d8._.js.map