import Link from "next/link";

export function SecondaryPageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-white sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.22em] text-white/88 transition-opacity duration-200 hover:opacity-100"
          >
            Donepage
          </Link>
        </div>

        <section className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#bfa76a]">
            {eyebrow}
          </p>
          <h1
            className="mt-4 text-4xl tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
          >
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#CFCFCF]">
            {description}
          </p>
        </section>

        <section className="mt-12 rounded-[32px] border border-[#222222] bg-[#0F0F0F] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
