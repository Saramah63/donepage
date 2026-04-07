import { SecondaryPageShell } from "@/app/components/secondary-page-shell";

export const metadata = {
  title: "Donepage Terms of Service",
  description: "Basic service terms for Donepage projects and deliverables.",
};

export default function TermsOfServicePage() {
  return (
    <SecondaryPageShell
      eyebrow="Terms of Service"
      title="Simple terms for a focused service"
      description="Donepage is built to deliver clear landing pages quickly, with scope and revisions aligned to the package you choose."
    >
      <div className="space-y-6 text-base leading-8 text-[#CFCFCF]">
        <p>
          Project scope, delivery speed, and revision limits depend on the package selected at checkout. Custom
          projects are scoped separately.
        </p>
        <p>
          Donepage delivers digital work based on the information you provide. Clear inputs help us produce stronger
          outcomes and cleaner delivery.
        </p>
        <p>
          If a project needs work beyond the selected package, we’ll clarify the next step before moving forward.
        </p>
      </div>
    </SecondaryPageShell>
  );
}
