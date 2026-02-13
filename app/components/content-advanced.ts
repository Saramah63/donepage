// app/components/content-advanced.ts
import type { QuestionnaireAnswers } from "./questionnaire";
import {
  generateContent as generateBaseContent,
  defaultPricing,
  getLang,
  pickLang,
  format,
} from "./content";

type PlanKey = "starter" | "business" | "pro";
type BaseContent = ReturnType<typeof generateBaseContent>;
type ContactLink = { href?: string; disabledText?: string };
type AdvancedContent = BaseContent & {
  contact: BaseContent["contact"] & {
    call: BaseContent["contact"]["call"] & ContactLink;
    email: BaseContent["contact"]["email"] & ContactLink;
    chat: BaseContent["contact"]["chat"] & ContactLink;
  };
  steps: ReturnType<typeof buildSteps>;
};

function safeTrim(v?: string) {
  return (v ?? "").trim();
}

function normalizeUrl(url?: string) {
  const v = safeTrim(url);
  if (!v) return "";
  // allow mailto/tel too
  if (v.startsWith("mailto:") || v.startsWith("tel:")) return v;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  return `https://${v}`;
}

function normalizePhoneDigits(v?: string) {
  return safeTrim(v).replace(/[^\d+]/g, "");
}

function buildWhatsAppHref(answers: QuestionnaireAnswers) {
  // Prefer answers.whatsApp, fallback to contactPhone
  const raw = safeTrim(answers.whatsApp) || safeTrim(answers.contactPhone);
  const digits = normalizePhoneDigits(raw);
  if (!digits) return "";
  // wa.me expects country code, user responsibility
  return `https://wa.me/${digits.replace(/^\+/, "")}`;
}

function buildEmailHref(answers: QuestionnaireAnswers) {
  const email = safeTrim(answers.contactEmail);
  if (!email) return "";
  return `mailto:${email}`;
}

function buildBookingHref(answers: QuestionnaireAnswers) {
  return normalizeUrl(answers.bookingLink);
}

function painPoint(answers: QuestionnaireAnswers) {
  const lang = getLang(answers);
  if (answers.primaryGoal === "credibility") {
    return pickLang(lang, {
      en: "Most prospects don’t doubt your skills — they doubt clarity. We remove ambiguity and build trust fast.",
      fa: "بیشتر مخاطبان به مهارت شما شک ندارند—به شفافیت شک دارند. ابهام را حذف و سریع اعتماد می‌سازیم.",
      ar: "معظم العملاء لا يشكون في مهارتك، بل في الوضوح. نزيل الغموض ونبني الثقة بسرعة.",
      fi: "Useimmat eivät epäile osaamistasi — he epäilevät selkeyttä. Poistamme epävarmuuden ja rakennamme luottamuksen nopeasti.",
    });
  }
  if (answers.businessStage === "starting") {
    return pickLang(lang, {
      en: "If your offer feels unclear, prospects hesitate. We clarify your message and turn attention into action.",
      fa: "اگر پیشنهاد شما مبهم باشد، مخاطب مردد می‌شود. پیام شما را شفاف می‌کنیم تا توجه به اقدام تبدیل شود.",
      ar: "إذا بدا عرضك غير واضح، يتردد العملاء. نوضح رسالتك ونحوّل الانتباه إلى إجراء.",
      fi: "Jos tarjouksesi tuntuu epäselvältä, asiakkaat epäröivät. Selkeytämme viestin ja muutamme huomion toiminnaksi.",
    });
  }
  if (answers.businessStage === "established") {
    return pickLang(lang, {
      en: "If growth has stalled, it’s usually positioning + funnel friction. We fix both — with a clean execution plan.",
      fa: "اگر رشد متوقف شده، معمولاً مشکل از جایگاه‌یابی و اصطکاک قیف است. هر دو را با اجرای دقیق اصلاح می‌کنیم.",
      ar: "إذا تباطأ النمو فغالباً السبب هو التموضع واحتكاك القمع. نعالج الأمرين بخطة تنفيذ واضحة.",
      fi: "Jos kasvu pysähtyy, syy on usein positiointi ja suppilon kitka. Korjaamme molemmat selkeällä toteutuksella.",
    });
  }
  return pickLang(lang, {
    en: "When acquisition is manual, scale slows down. We systemize demand and reduce decision friction.",
    fa: "وقتی جذب مشتری دستی است، مقیاس کند می‌شود. تقاضا را سیستم‌سازی و اصطکاک تصمیم را کاهش می‌دهیم.",
    ar: "عندما يكون الاكتساب يدويًا، يتباطأ التوسع. ننظم الطلب ونقلل احتكاك القرار.",
    fi: "Kun hankinta on manuaalista, skaala hidastuu. Järjestelmöimme kysynnän ja vähennämme päätöksenteon kitkaa.",
  });
}

function proofLine(answers: QuestionnaireAnswers) {
  const lang = getLang(answers);
  const exp =
    answers.experienceLevel === "veteran"
      ? "10+ years"
      : answers.experienceLevel === "expert"
      ? "7+ years"
      : answers.experienceLevel === "intermediate"
      ? "3+ years"
      : "Modern approach";
  const trust =
    answers.trustFactor === "results"
      ? pickLang(lang, {
          en: "measurable outcomes",
          fa: "نتایج قابل اندازه‌گیری",
          ar: "نتائج قابلة للقياس",
          fi: "mitattavat tulokset",
        })
      : answers.trustFactor === "portfolio"
      ? pickLang(lang, {
          en: "verifiable work",
          fa: "کار قابل‌اثبات",
          ar: "عمل قابل للتحقق",
          fi: "todennettavissa oleva työ",
        })
      : answers.trustFactor === "certifications"
      ? pickLang(lang, {
          en: "credible standards",
          fa: "استانداردهای معتبر",
          ar: "معايير موثوقة",
          fi: "luotettavat standardit",
        })
      : answers.trustFactor === "guarantee"
      ? pickLang(lang, {
          en: "risk-reduction",
          fa: "کاهش ریسک",
          ar: "تقليل المخاطر",
          fi: "riskin pienennys",
        })
      : pickLang(lang, {
          en: "reliable delivery",
          fa: "تحویل قابل اعتماد",
          ar: "تسليم موثوق",
          fi: "luotettava toimitus",
        });
  return format(
    pickLang(lang, {
      en: "{exp} • Built on {trust} • Fast response time",
      fa: "{exp} • مبتنی بر {trust} • پاسخ‌گویی سریع",
      ar: "{exp} • مبني على {trust} • استجابة سريعة",
      fi: "{exp} • Perustuu {trust} • Nopea vaste",
    }),
    { exp, trust }
  );
}

function ctaRefinement(answers: QuestionnaireAnswers) {
  const lang = getLang(answers);
  // smarter CTA variant without changing layout
  if (answers.primaryGoal === "calls") {
    return {
      headline: pickLang(lang, {
        en: "Let’s Align on the Fastest Path to Results",
        fa: "بیایید سریع‌ترین مسیر به نتیجه را همسو کنیم",
        ar: "لنحدّد أسرع مسار للنتائج",
        fi: "Sovitaan nopein reitti tuloksiin",
      }),
      subheadline:
        answers.experienceLevel === "new"
          ? pickLang(lang, {
              en: "Short call, clear plan, zero pressure. We’ll map your next steps and remove guesswork.",
              fa: "تماس کوتاه، برنامه روشن، بدون فشار. گام‌های بعدی را مشخص می‌کنیم.",
              ar: "مكالمة قصيرة وخطة واضحة دون ضغط. نحدد الخطوات التالية.",
              fi: "Lyhyt puhelu, selkeä suunnitelma, ei painetta. Kartoitamme seuraavat askeleet.",
            })
          : pickLang(lang, {
              en: "Short call, clear plan, high signal. We’ll identify leverage points and confirm the best next move.",
              fa: "تماس کوتاه، برنامه روشن و دقیق. نقاط اهرمی و گام بعدی را مشخص می‌کنیم.",
              ar: "مكالمة قصيرة وخطة واضحة. نحدد نقاط الرافعة ونؤكد الخطوة التالية.",
              fi: "Lyhyt puhelu, selkeä suunnitelma. Tunnistamme vipupisteet ja seuraavan askeleen.",
            }),
    };
  }
  if (answers.primaryGoal === "packages") {
    return {
      headline: pickLang(lang, {
        en: "Choose a Package That Matches Your Goal",
        fa: "پکیجی را انتخاب کنید که با هدف شما هماهنگ است",
        ar: "اختر باقة تناسب هدفك",
        fi: "Valitse tavoitteeseesi sopiva paketti",
      }),
      subheadline:
        answers.pricingApproach === "custom"
          ? pickLang(lang, {
              en: "Tell us what you need — we’ll scope it cleanly and price it transparently.",
              fa: "نیازتان را بگویید—شفاف محدوده و قیمت‌گذاری می‌کنیم.",
              ar: "أخبرنا بما تحتاج — نحدد النطاق ونسعّر بوضوح.",
              fi: "Kerro tarpeesi — määrittelemme laajuuden selkeästi ja hinnoittelemme avoimesti.",
            })
          : pickLang(lang, {
              en: "Pick the plan, move forward fast, and keep execution predictable.",
              fa: "پلن را انتخاب کنید، سریع جلو بروید و اجرای قابل پیش‌بینی داشته باشید.",
              ar: "اختر الخطة وتقدّم بسرعة مع تنفيذ واضح.",
              fi: "Valitse paketti, etene nopeasti ja pidä toteutus ennakoitavana.",
            }),
    };
  }
  if (answers.primaryGoal === "leads") {
    return {
      headline: pickLang(lang, {
        en: "Get a Clear Plan — Before You Spend More Time or Money",
        fa: "برنامه روشن بگیرید—قبل از اتلاف زمان یا هزینه",
        ar: "احصل على خطة واضحة قبل إنفاق المزيد من الوقت أو المال",
        fi: "Saat selkeän suunnitelman ennen lisäaikaa tai ‑kustannuksia",
      }),
      subheadline: pickLang(lang, {
        en: "We’ll review your situation and give you the best next step. If it’s not a fit, we’ll tell you upfront.",
        fa: "وضعیت شما را بررسی می‌کنیم و بهترین گام بعدی را می‌دهیم. اگر مناسب نباشد، صریح می‌گوییم.",
        ar: "نراجع وضعك ونقترح أفضل خطوة تالية. وإن لم يكن مناسبًا سنخبرك بصراحة.",
        fi: "Arvioimme tilanteesi ja annamme parhaan seuraavan askeleen. Jos se ei sovi, kerromme suoraan.",
      }),
    };
  }
  return {
    headline: pickLang(lang, {
      en: "Build Trust. Remove Friction. Convert Better.",
      fa: "اعتماد بسازید. اصطکاک را حذف کنید. بهتر تبدیل کنید.",
      ar: "ابنِ الثقة. أزل الاحتكاك. حوّل بشكل أفضل.",
      fi: "Rakenna luottamus. Poista kitka. Konvertoi paremmin.",
    }),
    subheadline: pickLang(lang, {
      en: "Clean message, clear proof, and a CTA that moves the right people.",
      fa: "پیام شفاف، اثبات روشن و CTA اثرگذار.",
      ar: "رسالة واضحة، دليل واضح، ونداء يحرك الجمهور المناسب.",
      fi: "Selkeä viesti, selkeä todiste ja CTA, joka liikuttaa oikeat ihmiset.",
    }),
  };
}

function buildSteps(answers: QuestionnaireAnswers) {
  const lang = getLang(answers);
  // numbered steps for “How it works” section — content only
  const goal =
    answers.primaryGoal === "calls"
      ? pickLang(lang, {
          en: "book calls",
          fa: "رزرو تماس",
          ar: "حجز مكالمات",
          fi: "varaa puheluja",
        })
      : answers.primaryGoal === "packages"
      ? pickLang(lang, {
          en: "sell packages",
          fa: "فروش پکیج‌ها",
          ar: "بيع الباقات",
          fi: "myydä paketteja",
        })
      : answers.primaryGoal === "credibility"
      ? pickLang(lang, {
          en: "build trust",
          fa: "ساخت اعتماد",
          ar: "بناء الثقة",
          fi: "rakenna luottamus",
        })
      : pickLang(lang, {
          en: "capture leads",
          fa: "جذب سرنخ‌ها",
          ar: "جمع العملاء المحتملين",
          fi: "kerää liidejä",
        });

  return {
    title: pickLang(lang, {
      en: "How It Works",
      fa: "چگونه کار می‌کند",
      ar: "كيف يعمل",
      fi: "Miten se toimii",
    }),
    subtitle: pickLang(lang, {
      en: "A simple, predictable process — designed to ship fast and convert cleanly.",
      fa: "فرآیندی ساده و قابل پیش‌بینی — برای تحویل سریع و تبدیل بهتر.",
      ar: "عملية بسيطة ومتوقعة — للتسليم السريع والتحويل الأفضل.",
      fi: "Yksinkertainen ja ennakoitava prosessi — nopeaan toimitukseen ja konversioon.",
    }),
    steps: [
      {
        no: 1,
        title: pickLang(lang, {
          en: "Share the essentials",
          fa: "اطلاعات کلیدی را بدهید",
          ar: "شارك الأساسيات",
          fi: "Jaa olennaiset tiedot",
        }),
        desc: pickLang(lang, {
          en: "Answer the questions (offer, audience, positioning). We use it to generate a high-converting structure.",
          fa: "به سوال‌ها پاسخ دهید (پیشنهاد، مخاطب، جایگاه). بر این اساس ساختار پر‌تبدیل می‌سازیم.",
          ar: "أجب عن الأسئلة (العرض، الجمهور، التموضع). نبني هيكلًا عالي التحويل.",
          fi: "Vastaa kysymyksiin (tarjous, yleisö, positiointi). Rakennamme korkean konversion rakenteen.",
        }),
      },
      {
        no: 2,
        title: pickLang(lang, {
          en: "Review and personalize",
          fa: "بازبینی و شخصی‌سازی",
          ar: "راجع وخصص",
          fi: "Tarkista ja personoi",
        }),
        desc:
          pickLang(lang, {
            en: 'Edit your “About”, links (email/WhatsApp/booking), and credibility signals. Keep it minimal or go deep.',
            fa: "بخش «درباره»، لینک‌ها و سیگنال‌های اعتبار را ویرایش کنید. ساده یا عمیق، انتخاب با شماست.",
            ar: "حرر قسم «نبذة»، الروابط (البريد/واتساب/الحجز) وعوامل الثقة.",
            fi: "Muokkaa “Tietoja”, linkit (sähköposti/WhatsApp/varaus) ja uskottavuus.",
          }),
      },
      {
        no: 3,
        title: format(
          pickLang(lang, {
            en: "Publish and {goal}",
            fa: "منتشر کنید و {goal}",
            ar: "انشر و{goal}",
            fi: "Julkaise ja {goal}",
          }),
          { goal }
        ),
        desc:
          pickLang(lang, {
            en: "Publish with your preferred slug. Your page goes live and stays SEO-ready, mobile-first, and shareable.",
            fa: "با اسلاگ دلخواه منتشر کنید. صفحه شما آنلاین و آماده سئو و اشتراک‌گذاری می‌شود.",
            ar: "انشر بالمسار المفضل. تصبح صفحتك مباشرة وجاهزة للسيو والمشاركة.",
            fi: "Julkaise haluamallasi slugilla. Sivusi on live, SEO‑valmis ja jaettavissa.",
          }),
      },
    ],
  };
}

function applyAnswerOverrides(base: ReturnType<typeof generateBaseContent>, answers: QuestionnaireAnswers) {
  // About override already handled in your UI using answers.aboutText,
  // but we also make base.about.story consistent for export/publish.
  if (base.about && safeTrim(answers.aboutText)) {
    base.about.story = safeTrim(answers.aboutText);
  }
  // Business name override if provided
  if (safeTrim(answers.businessName)) {
    base.meta.businessName = safeTrim(answers.businessName);
  }
  return base;
}

function parsePortfolioRaw(raw?: string) {
  const lines = (raw ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const items = lines
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const [title, description, metric] = parts;
      if (!title || !description || !metric) return null;
      return { title, description, metric };
    })
    .filter(Boolean) as { title: string; description: string; metric: string }[];

  return items;
}

function parsePortfolioJson(raw?: string) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((p) => ({
        title: String(p.title ?? "").trim(),
        description: String(p.description ?? "").trim(),
        metric: String(p.metric ?? "").trim(),
        imageUrl: p.imageUrl ? String(p.imageUrl).trim() : undefined,
      }))
      .filter((p) => p.title && p.description && p.metric);
  } catch {
    return [];
  }
}

/**
 * Advanced content generator:
 * - keeps the same shape as generateBaseContent (content.ts)
 * - injects smarter copy and adds steps + contact hrefs (wiring only)
 */
export function generateContentAdvanced(answers: QuestionnaireAnswers) {
  const lang = getLang(answers);
  const base = applyAnswerOverrides(generateBaseContent(answers), answers);

  // Upgrade hero/subheadline with pain point + proof line (still short)
  base.meta.subheadline = `${painPoint(answers)} ${proofLine(answers)}`;

  // CTA refinement (same fields, no UI change)
  const refined = ctaRefinement(answers);
  base.cta.headline = refined.headline;
  base.cta.subheadline = refined.subheadline;

  // Contact: wire actual editable destinations (fallbacks are empty)
  const bookingHref = buildBookingHref(answers);
  const emailHref = buildEmailHref(answers);
  const waHref = buildWhatsAppHref(answers);

  const disabledText = {
    booking: pickLang(lang, {
      en: "Booking link not set",
      fa: "لینک رزرو تنظیم نشده",
      ar: "رابط الحجز غير مضبوط",
      fi: "Varauslinkkiä ei ole asetettu",
    }),
    email: pickLang(lang, {
      en: "Email not set",
      fa: "ایمیل تنظیم نشده",
      ar: "البريد غير مضبوط",
      fi: "Sähköpostia ei ole asetettu",
    }),
    whatsapp: pickLang(lang, {
      en: "WhatsApp not set",
      fa: "واتساپ تنظیم نشده",
      ar: "واتساب غير مضبوط",
      fi: "WhatsApp ei ole asetettu",
    }),
  };

  base.contact = {
    ...base.contact,
    call: {
      ...base.contact.call,
      href: bookingHref,
      disabledText: disabledText.booking,
    },
    email: {
      ...base.contact.email,
      href: emailHref,
      disabledText: disabledText.email,
    },
    chat: {
      ...base.contact.chat,
      href: waHref,
      disabledText: disabledText.whatsapp,
    },
  } as any;

  // Pricing: keep your default (no UI change)
  base.pricing = base.pricing ?? defaultPricing(lang);

  // Portfolio overrides (optional)
  const customPortfolioJson = parsePortfolioJson(answers.portfolioItemsJson);
  const customPortfolioRaw = parsePortfolioRaw(answers.portfolioItemsRaw);
  const customPortfolio = customPortfolioJson.length > 0 ? customPortfolioJson : customPortfolioRaw;
  if (customPortfolio.length > 0) {
    base.portfolio.items = customPortfolio as any;
  }

  // Steps (optional section; add now so you can render later without changing generator again)
  const steps = buildSteps(answers);

  const result: AdvancedContent = {
    ...base,
    steps,
  };

  return result;
}
