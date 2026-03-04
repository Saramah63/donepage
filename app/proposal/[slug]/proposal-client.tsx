"use client";

import * as React from "react";
import { toast } from "sonner";

type ProposalData = {
  title: string;
  context: string;
  scope: string[];
  deliverables: string[];
  timeline: string;
  investment: string;
  investmentOptions: string[];
  paymentLinks: Record<string, string>;
  template: string;
  clientLogos: string[];
  guarantee: string;
  ctaLabel: string;
  paymentLink: string;
  tierDetails?: Record<
    string,
    {
      scope: string[];
      deliverables: string[];
      timeline: string;
    }
  >;
  language?: string;
};

export default function ProposalClient({
  proposal,
  previewLink,
  slug,
  lang = "en",
}: {
  proposal: ProposalData;
  previewLink: string;
  slug: string;
  lang?: "en" | "fa" | "ar" | "fi";
}) {
  const pickLang = <T,>(map: Record<"en" | "fa" | "ar" | "fi", T>) =>
    map[lang] ?? map.en;
  const preparedForByTemplate: Record<string, string> = {
    B2B: pickLang({
      en: "B2B Lead Generation",
      fa: "جذب لید B2B",
      ar: "توليد عملاء B2B",
      fi: "B2B‑liidit",
    }),
    Consulting: pickLang({
      en: "Consulting Services",
      fa: "خدمات مشاوره",
      ar: "خدمات استشارية",
      fi: "Konsultointipalvelut",
    }),
    Coaching: pickLang({
      en: "Coaching Programs",
      fa: "برنامه‌های کوچینگ",
      ar: "برامج الكوتشينغ",
      fi: "Coaching-ohjelmat",
    }),
    Agency: pickLang({
      en: "Agency Client Acquisition",
      fa: "جذب مشتری آژانس",
      ar: "اكتساب عملاء الوكالة",
      fi: "Toimistoasiakashankinta",
    }),
    SaaS: pickLang({
      en: "SaaS Demo & Trial Growth",
      fa: "رشد دمو و تریال SaaS",
      ar: "نمو ديمو وتجارب SaaS",
      fi: "SaaS-demon ja trialin kasvu",
    }),
    "E‑commerce": pickLang({
      en: "Offer Package Sales",
      fa: "فروش پکیج خدمات",
      ar: "بيع باقات الخدمات",
      fi: "Palvelupakettien myynti",
    }),
    Legal: pickLang({
      en: "Professional Services Lead Intake",
      fa: "ورودی لید خدمات حرفه‌ای",
      ar: "استقبال عملاء للخدمات المهنية",
      fi: "Ammatillisten palvelujen liidit",
    }),
  };
  const preparedFor = preparedForByTemplate[proposal.template] ?? proposal.template;
  const [selectedTier, setSelectedTier] = React.useState<string | null>(null);
  const [checkingOut, setCheckingOut] = React.useState(false);
  const [selectedDeliverableIndex, setSelectedDeliverableIndex] = React.useState<number | null>(null);

  const resolvedTier =
    selectedTier ?? proposal.investment ?? proposal.investmentOptions?.[0] ?? null;

  const normalizeTier = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, " ");

  const normalizedTier = resolvedTier ? normalizeTier(resolvedTier) : null;
  const normalizedLinks = Object.fromEntries(
    Object.entries(proposal.paymentLinks ?? {}).map(([tier, link]) => [
      normalizeTier(tier),
      link,
    ])
  );
  const normalizedTierDetails = Object.fromEntries(
    Object.entries(proposal.tierDetails ?? {}).map(([tier, details]) => [
      normalizeTier(tier),
      details,
    ])
  );
  const activeTierDetails =
    (normalizedTier && normalizedTierDetails[normalizedTier]) || null;
  const activeScope = activeTierDetails?.scope ?? proposal.scope;
  const activeDeliverables = activeTierDetails?.deliverables ?? proposal.deliverables;
  const activeTimeline = activeTierDetails?.timeline ?? proposal.timeline;

  React.useEffect(() => {
    setSelectedDeliverableIndex(null);
  }, [resolvedTier]);

  const effectiveLink =
    (normalizedTier && normalizedLinks[normalizedTier]) ||
    proposal.paymentLink ||
    (Object.values(proposal.paymentLinks ?? {})[0] ?? "");

  const handleCheckout = async () => {
    if (checkingOut) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/proposal/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          tier: resolvedTier,
        }),
      });
      const data = await res.json();
      if (res.ok && data?.url) {
        window.location.href = data.url as string;
        return;
      }
      // Fallback to manual payment link if Stripe checkout is not configured
      if (effectiveLink) {
        window.open(effectiveLink, "_blank");
        return;
      }
      toast.error(
        data?.error ??
          pickLang({
            en: "Checkout is not configured yet.",
            fa: "پرداخت هنوز تنظیم نشده است.",
            ar: "الدفع غير مُفعّل بعد.",
            fi: "Maksu ei ole vielä määritetty.",
          })
      );
    } catch {
      if (effectiveLink) {
        window.open(effectiveLink, "_blank");
        return;
      }
      toast.error(
        pickLang({
          en: "Checkout is not configured yet.",
          fa: "پرداخت هنوز تنظیم نشده است.",
          ar: "الدفع غير مُفعّل بعد.",
          fi: "Maksu ei ole vielä määritetty.",
        })
      );
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-16"
      dir={lang === "fa" || lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-gray-200 bg-white/90 p-10 shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wide text-blue-700">
              {pickLang({
                en: "Donepage Proposal",
                fa: "پروپوزال Donepage",
                ar: "عرض Donepage",
                fi: "Donepage‑tarjous",
              })}
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">{proposal.title}</h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              {pickLang({
                en: "A clear, conversion‑focused plan to turn your draft into a revenue‑ready landing page.",
                fa: "برنامه‌ای شفاف و متمرکز بر تبدیل برای تبدیل پیش‌نویس به لندینگ درآمدزا.",
                ar: "خطة واضحة ومركزة على التحويل لتحويل المسودة إلى صفحة جاهزة للإيرادات.",
                fi: "Selkeä, konversiokeskeinen suunnitelma luonnoksen muuttamiseksi tuottavaksi sivuksi.",
              })}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              {pickLang({
                en: "Featured",
                fa: "ویژه",
                ar: "مميز",
                fi: "Suositeltu",
              })}{" "}
              · {proposal.template}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-600">
            {pickLang({
              en: "Prepared for:",
              fa: "آماده‌شده برای:",
              ar: "مُعدّ من أجل:",
              fi: "Valmisteltu:",
            })}{" "}
            <span className="font-semibold text-gray-900">
              {preparedFor}
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs font-semibold text-gray-600">
            {pickLang({
              en: "Client logo",
              fa: "لوگوی مشتری",
              ar: "شعارات العملاء",
              fi: "Asiakaslogot",
            })}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {(proposal.clientLogos?.length ? proposal.clientLogos : ["AURORA", "NOVA", "ATLAS", "LUMEN", "VANTA", "ORBIT"]).map(
              (name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-[10px] font-semibold tracking-wide text-gray-500"
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-gray-900">
                {pickLang({ en: "Context", fa: "زمینه", ar: "السياق", fi: "Tausta" })}
              </h2>
              <p className="mt-2 text-gray-700">{proposal.context}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">
                {pickLang({
                  en: "Scope of Work",
                  fa: "دامنه کار",
                  ar: "نطاق العمل",
                  fi: "Työn laajuus",
                })}
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
                {activeScope.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">
                {pickLang({
                  en: "Deliverables",
                  fa: "خروجی‌ها",
                  ar: "المخرجات",
                  fi: "Toimitukset",
                })}
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
                {activeDeliverables.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                {pickLang({
                  en: "Expected Business Impact",
                  fa: "اثر مورد انتظار کسب‌وکار",
                  ar: "الأثر التجاري المتوقع",
                  fi: "Odotettu liiketoimintavaikutus",
                })}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  pickLang({
                    en: "Higher lead quality",
                    fa: "کیفیت لید بالاتر",
                    ar: "جودة عملاء محتملين أعلى",
                    fi: "Parempi liidien laatu",
                  }),
                  pickLang({
                    en: "Stronger buyer trust",
                    fa: "اعتماد بیشتر خریدار",
                    ar: "ثقة مشترٍ أقوى",
                    fi: "Vahvempi ostajaluottamus",
                  }),
                  pickLang({
                    en: "Faster sales conversations",
                    fa: "گفت‌وگوی فروش سریع‌تر",
                    ar: "محادثات بيع أسرع",
                    fi: "Nopeammat myyntikeskustelut",
                  }),
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-600">
                  {pickLang({
                    en: "Timeline",
                    fa: "زمان‌بندی",
                    ar: "الجدول الزمني",
                    fi: "Aikataulu",
                  })}
                </h3>
                <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900">
                  {activeTimeline}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600">
                  {pickLang({
                    en: "Investment",
                    fa: "سرمایه‌گذاری",
                    ar: "الاستثمار",
                    fi: "Investointi",
                  })}
                </h3>
                <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900">
                  {selectedTier ?? proposal.investment}
                </div>
                {proposal.investmentOptions?.length ? (
                  <div className="mt-4 grid gap-2">
                    {proposal.investmentOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedTier(opt)}
                        className={[
                          "rounded-xl border px-3 py-2 text-left text-xs",
                          selectedTier === opt
                            ? "border-blue-300 bg-blue-50/60 text-blue-900"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/60",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    ))}
                    <div className="text-[11px] text-gray-500">
                      {pickLang({
                        en: "Pick a tier to update the payment button.",
                        fa: "یک پلن انتخاب کنید تا دکمه پرداخت به‌روزرسانی شود.",
                        ar: "اختر باقة لتحديث زر الدفع.",
                        fi: "Valitse taso päivittääksesi maksupainikkeen.",
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6">
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                {pickLang({
                  en: "Limited onboarding slots this week",
                  fa: "ظرفیت پذیرش محدود در این هفته",
                  ar: "أماكن بدء محدودة هذا الأسبوع",
                  fi: "Rajoitettu määrä aloituspaikkoja tällä viikolla",
                })}
              </div>
              <div className="text-sm font-semibold text-blue-900">
                {pickLang({
                  en: "Start Project",
                  fa: "شروع پروژه",
                  ar: "ابدأ المشروع",
                  fi: "Aloita projekti",
                })}
              </div>
              <p className="mt-2 text-sm text-blue-900/80">
                {pickLang({
                  en: "Accept the proposal and start immediately. First update within 3 business days.",
                  fa: "پروپوزال را تأیید کنید و بلافاصله شروع کنیم. اولین به‌روزرسانی طی ۳ روز کاری.",
                  ar: "وافق وابدأ فورًا. أول تحديث خلال 3 أيام عمل.",
                  fi: "Hyväksy ja aloitetaan heti. Ensimmäinen päivitys 3 arkipäivässä.",
                })}
              </p>
              <div className="mt-3 rounded-xl border border-blue-200 bg-white/70 px-3 py-2 text-xs text-blue-900">
                {pickLang({
                  en: "Selected tier:",
                  fa: "پلن انتخاب‌شده:",
                  ar: "الباقة المختارة:",
                  fi: "Valittu taso:",
                })}{" "}
                <span className="font-semibold">{resolvedTier ?? proposal.investment}</span>
              </div>
              {activeTierDetails ? (
                <div className="mt-3 rounded-xl border border-blue-200 bg-white/85 px-3 py-3 text-xs text-blue-900">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                    {pickLang({
                      en: "Included in this tier",
                      fa: "موارد شامل این پلن",
                      ar: "المتضمن في هذه الباقة",
                      fi: "Sisaltyy tahan tasoon",
                    })}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(activeTierDetails.deliverables ?? []).slice(0, 4).map((item, i) => (
                      <button
                        key={`${item}-${i}`}
                        type="button"
                        onClick={() =>
                          setSelectedDeliverableIndex((prev) => (prev === i ? null : i))
                        }
                        className="rounded-full border border-blue-200 bg-blue-50/70 px-2.5 py-1 text-[11px] font-medium text-blue-900"
                        title={item}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  {selectedDeliverableIndex !== null &&
                  (activeTierDetails.deliverables ?? [])[selectedDeliverableIndex] ? (
                    <div className="mt-2 rounded-lg border border-blue-200 bg-white px-2.5 py-2 text-[11px] text-blue-900/90">
                      {(activeTierDetails.deliverables ?? [])[selectedDeliverableIndex]}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-3 rounded-xl border border-blue-200 bg-white/80 px-3 py-2 text-[12px] text-blue-900/80">
                {pickLang({
                  en: "This payment is for premium delivery of your project — separate from any Donepage subscription.",
                  fa: "این پرداخت مربوط به تحویل پریمیوم پروژه شماست و جدا از اشتراک Donepage است.",
                  ar: "هذا الدفع لتسليم مشروعك بشكل مميز — منفصل عن اشتراك Donepage.",
                  fi: "Tämä maksu kattaa projektin premium-toimituksen — erillään Donepage-tilauksesta.",
                })}
              </div>
              <button
                onClick={handleCheckout}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white"
                disabled={checkingOut}
              >
                {checkingOut
                  ? pickLang({
                      en: "Redirecting…",
                      fa: "در حال انتقال…",
                      ar: "جارٍ التحويل…",
                      fi: "Ohjataan…",
                    })
                  : proposal.ctaLabel}
              </button>
              <div className="mt-3 text-[11px] text-blue-900/70">
                {pickLang({
                  en: "No call required. Approval and payment happen in one step.",
                  fa: "بدون تماس. تایید و پرداخت در یک مرحله انجام می‌شود.",
                  ar: "بدون مكالمة. الموافقة والدفع بخطوة واحدة.",
                  fi: "Ei puhelua. Hyväksyntä ja maksu yhdellä askeleella.",
                })}
              </div>
            </div>

            {proposal.guarantee ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs text-amber-900">
                <div className="text-xs font-semibold">
                  {pickLang({
                    en: "Guarantee",
                    fa: "گارانتی",
                    ar: "ضمان",
                    fi: "Takuu",
                  })}
                </div>
                <div className="mt-2">{proposal.guarantee}</div>
              </div>
            ) : null}

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="text-xs font-semibold text-gray-600">
                {pickLang({
                  en: "Preview link",
                  fa: "لینک پیش‌نمایش",
                  ar: "رابط المعاينة",
                  fi: "Esikatselulinkki",
                })}
              </div>
              <a
                href={previewLink}
                className="mt-2 block text-sm text-blue-700 underline"
                target="_blank"
                rel="noreferrer"
              >
                {previewLink}
              </a>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 text-xs text-gray-600">
              {pickLang({
                en: "Fully async. No calls required. All updates are documented.",
                fa: "کاملاً غیرهمزمان. بدون تماس. همه به‌روزرسانی‌ها مستند است.",
                ar: "كل شيء غير متزامن. بدون مكالمات. كل التحديثات موثقة.",
                fi: "Täysin asynkroninen. Ei puheluita. Kaikki päivitykset dokumentoidaan.",
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
