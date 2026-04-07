import { SecondaryPageShell } from "@/app/components/secondary-page-shell";

export const metadata = {
  title: "Donepage Privacy Policy",
  description: "How Donepage handles personal data and communications.",
};

export default function PrivacyPolicyPage() {
  return (
    <SecondaryPageShell
      eyebrow="Privacy Policy"
      title="Privacy, kept straightforward"
      description="Donepage collects only the information needed to generate your page, communicate with you, and deliver the service clearly."
    >
      <div className="space-y-6 text-base leading-8 text-[#CFCFCF]">
        <p>
          We use the information you provide to create drafts, respond to requests, send verification codes, and
          deliver updates about your page.
        </p>
        <p>
          We do not use your submission data for unrelated marketing, and we keep the process focused on the service
          you asked for.
        </p>
        <p>
          If you need your information updated or removed, contact Donepage directly and we’ll help you take care of
          it.
        </p>
      </div>
    </SecondaryPageShell>
  );
}
