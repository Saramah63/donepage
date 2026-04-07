import { SecondaryPageShell } from "@/app/components/secondary-page-shell";

const faqItems = [
  {
    question: "How fast can my page be ready?",
    answer:
      "Your instant draft is generated right away. Human refinement for the paid version is delivered within 72 hours.",
  },
  {
    question: "What do I get after filling out the questionnaire?",
    answer:
      "You get a premium draft preview based on your offer, audience, and goal. From there, you can move into Launch or Growth for refinement and delivery.",
  },
  {
    question: "Can I request something more custom than one landing page?",
    answer:
      "Yes. Donepage also handles custom projects for businesses that need a broader structure, extra pages, or specific workflows.",
  },
];

export const metadata = {
  title: "Donepage FAQ",
  description: "Answers to common questions about Donepage.",
};

export default function FaqPage() {
  return (
    <SecondaryPageShell
      eyebrow="FAQ"
      title="Answers, without the noise"
      description="A few clear answers about how Donepage works, what you get, and what happens next."
    >
      <div className="space-y-4">
        {faqItems.map((item) => (
          <div key={item.question} className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
            <h2
              className="text-2xl tracking-tight text-white"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              {item.question}
            </h2>
            <p className="mt-4 text-base leading-8 text-[#CFCFCF]">{item.answer}</p>
          </div>
        ))}
      </div>
    </SecondaryPageShell>
  );
}
