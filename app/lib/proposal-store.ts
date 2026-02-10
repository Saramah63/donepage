// app/lib/proposal-store.ts
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

export type ProposalData = {
  title: string;
  context: string;
  scope: string[];
  deliverables: string[];
  timeline: string;
  investment: string;
  investmentOptions: string[];
  ctaLabel: string;
  paymentLink: string;
  messagePreview: string;
  messageProposal: string;
  updatedAt: number;
};

const KEY_PREFIX = "proposal:";
const keyProposal = (slug: string) => `${KEY_PREFIX}${slug}`;

/** Local dev fallback if KV env is missing */
declare global {
  // eslint-disable-next-line no-var
  var __donepageProposalStore: Map<string, any> | undefined;
}

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function memStore() {
  if (!global.__donepageProposalStore) global.__donepageProposalStore = new Map();
  return global.__donepageProposalStore;
}

type KvModule = typeof import("@vercel/kv");
let kvClient: KvModule["kv"] | null = null;
let warnedNoKV = false;

async function getKvClient() {
  if (!hasKV()) {
    if (!warnedNoKV) {
      console.warn(
        "KV is not configured. Falling back to in-memory store. Set KV_REST_API_URL and KV_REST_API_TOKEN."
      );
      warnedNoKV = true;
    }
    return null;
  }
  if (!kvClient) {
    const mod = await import("@vercel/kv");
    kvClient = mod.kv;
  }
  return kvClient;
}

async function getKV<T>(key: string): Promise<T | null> {
  const client = await getKvClient();
  if (client) return (await client.get<T>(key)) ?? null;
  const store = memStore();
  return (store.get(key) as T) ?? null;
}

async function setKV<T>(key: string, value: T) {
  const client = await getKvClient();
  if (client) {
    await (client.set as any)(key, value);
    return;
  }
  const store = memStore();
  store.set(key, value);
}

function safeTrim(v?: string) {
  return (v ?? "").trim();
}

export function defaultProposal(answers: QuestionnaireAnswers, previewLink: string, proposalLink: string): ProposalData {
  const goal =
    answers.primaryGoal === "calls"
      ? "book qualified calls"
      : answers.primaryGoal === "packages"
      ? "sell service packages"
      : answers.primaryGoal === "credibility"
      ? "build credibility"
      : "generate qualified leads";

  const title = "B2B Landing Page Optimization Proposal";

  const context = `Based on your inputs and the generated draft, the primary goal of this landing page is: → ${goal}.`;

  const scope = [
    "Refine the value proposition",
    "Optimize page structure for clarity",
    "Improve CTA and conversion flow",
    "Prepare a launch‑ready landing page",
  ];

  const deliverables = [
    "Final landing page copy (conversion‑focused)",
    "Optimized layout & section order",
    "Mobile‑optimized version",
  ];

  const timeline = "10–14 business days";
  const investmentOptions = ["$3,000 (one‑time)", "$5,000 (one‑time)", "$7,000 (one‑time)"];
  const investment = investmentOptions[2];
  const ctaLabel = "Accept & Start Project";
  const paymentLink = "";

  const messagePreview = `I generated a landing page draft based on your inputs.\nYou can review it here:\n${previewLink}`;

  const messageProposal = `Thanks for reviewing the draft.\n\nBased on your inputs, I’ve outlined the optimization plan and next steps here:\n${proposalLink}\n\nEverything is async — no calls needed.`;

  return {
    title,
    context,
    scope,
    deliverables,
    timeline,
    investment,
    investmentOptions,
    ctaLabel,
    paymentLink,
    messagePreview,
    messageProposal,
    updatedAt: Date.now(),
  };
}

export async function getProposal(slug: string) {
  return await getKV<ProposalData>(keyProposal(slug));
}

export async function saveProposal(slug: string, proposal: ProposalData) {
  const next = { ...proposal, updatedAt: Date.now() };
  await setKV(keyProposal(slug), next);
  return next;
}
