export type Plan = "starter" | "business" | "pro";

export const PLAN_LIMITS: Record<Plan, { export: boolean; domain: boolean }> = {
  starter: { export: false, domain: false },
  business: { export: true, domain: true },
  pro: { export: true, domain: true },
};

const STORAGE_KEY = "donepage:plan";

let currentPlan: Plan = "starter";

export function setPlan(plan: Plan) {
  currentPlan = plan;

  // ✅ Client-side persistence (safe no-op on server)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, plan);
    } catch {}
  }
}

export function hydratePlanFromStorage() {
  // ✅ call this in a client component on mount
  if (typeof window === "undefined") return;

  try {
    const v = localStorage.getItem(STORAGE_KEY) as Plan | null;
    if (v && (v === "starter" || v === "business" || v === "pro")) {
      currentPlan = v;
    }
  } catch {}
}

export function getPlan() {
  return currentPlan;
}

export function canExport() {
  return PLAN_LIMITS[currentPlan].export;
}

export function canUseDomain() {
  return PLAN_LIMITS[currentPlan].domain;
}
