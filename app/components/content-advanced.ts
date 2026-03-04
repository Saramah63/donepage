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

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function titleCaseEn(value: string) {
  const stop = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to", "vs", "via"]);
  return value
    .split(" ")
    .map((w, i) => {
      const raw = w.trim();
      if (!raw) return raw;
      const lower = raw.toLowerCase();
      if (i > 0 && stop.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function sentenceCaseEn(value: string) {
  const parts = value.split(/([.!?]+\s*)/);
  let out = "";
  for (let i = 0; i < parts.length; i += 2) {
    const sentence = (parts[i] || "").trim();
    const delimiter = parts[i + 1] || "";
    if (!sentence) continue;
    out += sentence.charAt(0).toUpperCase() + sentence.slice(1) + delimiter;
  }
  return out.trim();
}

function fixCommonTyposEn(value: string) {
  const replacements: Array<[RegExp, string]> = [
    [/\bteh\b/gi, "the"],
    [/\badn\b/gi, "and"],
    [/\bseperate\b/gi, "separate"],
    [/\brecieve\b/gi, "receive"],
    [/\bproffesional\b/gi, "professional"],
    [/\bdefinately\b/gi, "definitely"],
    [/\bcant\b/gi, "can't"],
    [/\bdont\b/gi, "don't"],
    [/\bwont\b/gi, "won't"],
    [/\bim\b/gi, "I'm"],
  ];
  return replacements.reduce((acc, [pattern, next]) => acc.replace(pattern, next), value);
}

function ensureEndPunctuation(value: string) {
  if (!value) return value;
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function polishText(value: string, lang: ReturnType<typeof getLang>, mode: "title" | "sentence" = "sentence") {
  let out = normalizeSpaces(value);
  if (!out) return out;
  if (lang === "en") {
    out = fixCommonTyposEn(out);
    out = mode === "title" ? titleCaseEn(out) : sentenceCaseEn(out);
  }
  if (mode === "sentence") out = ensureEndPunctuation(out);
  return out;
}

function parseJsonMap(value?: string): Record<string, string> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      out[k] = String(v ?? "").trim();
    }
    return out;
  } catch {
    return {};
  }
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
      ? pickLang(lang, {
          en: "10+ years",
          fa: "۱۰+ سال",
          ar: "10+ سنوات",
          fi: "10+ vuotta",
        })
      : answers.experienceLevel === "expert"
      ? pickLang(lang, {
          en: "7+ years",
          fa: "۷+ سال",
          ar: "7+ سنوات",
          fi: "7+ vuotta",
        })
      : answers.experienceLevel === "intermediate"
      ? pickLang(lang, {
          en: "3+ years",
          fa: "۳+ سال",
          ar: "3+ سنوات",
          fi: "3+ vuotta",
        })
      : pickLang(lang, {
          en: "Modern approach",
          fa: "رویکرد مدرن",
          ar: "نهج حديث",
          fi: "Moderni lähestymistapa",
        });
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
  const customStep1 = safeTrim(answers.processStep1);
  const customStep2 = safeTrim(answers.processStep2);
  const customStep3 = safeTrim(answers.processStep3);
  const customProblem = safeTrim(answers.problemStatement);
  const customOutcome = safeTrim(answers.outcomeStatement);
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
        title:
          customStep1 ||
          pickLang(lang, {
            en: "Share the essentials",
            fa: "اطلاعات کلیدی را بدهید",
            ar: "شارك الأساسيات",
            fi: "Jaa olennaiset tiedot",
          }),
        desc: pickLang(lang, {
          en: customProblem || "Clarify the key client pain and align your positioning to it.",
          fa: customProblem || "مسئله اصلی مشتری را شفاف کنید و جایگاه خود را با آن همسو کنید.",
          ar: customProblem || "وضّح ألم العميل الرئيسي ونسّق تموضعك معه.",
          fi: customProblem || "Selkeytä asiakkaan ydinongelma ja kohdenna positiointi sen mukaan.",
        }),
      },
      {
        no: 2,
        title:
          customStep2 ||
          pickLang(lang, {
            en: "Review and personalize",
            fa: "بازبینی و شخصی‌سازی",
            ar: "راجع وخصص",
            fi: "Tarkista ja personoi",
          }),
        desc:
          pickLang(lang, {
            en: customOutcome || "Refine the offer and proof so the page communicates a concrete outcome.",
            fa: customOutcome || "پیشنهاد و شواهد را طوری تنظیم کنید که نتیجه مشخص را منتقل کند.",
            ar: customOutcome || "حسّن العرض والإثبات لعرض نتيجة واضحة.",
            fi: customOutcome || "Tarkenna tarjous ja todisteet, jotta lopputulos on selkeä.",
          }),
      },
      {
        no: 3,
        title:
          customStep3 ||
          format(
            pickLang(lang, {
              en: "Publish and {goal}",
              fa: "منتشر کنید و {goal}",
              ar: "انشر و{goal}",
              fi: "Julkaise ja {goal}",
            }),
            { goal }
          ),
        desc:
          customStep3
            ? customStep3
            : pickLang(lang, {
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
  const lang = getLang(answers);
  // About override already handled in your UI using answers.aboutText,
  // but we also make base.about.story consistent for export/publish.
  if (base.about && safeTrim(answers.aboutText)) {
    base.about.story = polishText(safeTrim(answers.aboutText), lang, "sentence");
  }
  // Business name override if provided
  if (safeTrim(answers.businessName)) {
    base.meta.businessName = polishText(safeTrim(answers.businessName), lang, "title");
  }
  if (base.about) {
    const serviceTypeRaw =
      safeTrim(answers.serviceTypeOther) || safeTrim((answers.serviceType as string) || "");
    const audienceRaw = safeTrim((answers.targetAudience as string) || "");
    const yearsRaw = safeTrim(answers.yearsExp);
    const outcomeRaw = safeTrim(answers.outcomeStatement);

    const humanize = (value: string) =>
      value
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (m) => m.toUpperCase());

    const serviceType = serviceTypeRaw ? humanize(serviceTypeRaw) : "";
    const audience = audienceRaw ? humanize(audienceRaw) : "";

    if (serviceType || audience) {
      base.about.team = polishText([serviceType, audience].filter(Boolean).join(" specialists for "), lang, "sentence");
    }
    if (yearsRaw) {
      base.about.experience = yearsRaw;
    }
    if (outcomeRaw) {
      base.about.mission = polishText(outcomeRaw, lang, "sentence");
    }
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
      if (!title) return null;
      return {
        title,
        description: description || "Project delivery tailored to client goals.",
        metric: metric || "Delivered",
      };
    })
    .filter(Boolean) as { title: string; description: string; metric: string }[];

  return items;
}

function parseServicePackages(raw?: string) {
  const lines = (raw ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return lines
    .map((line) => {
      const byPipe = line.split("|").map((p) => p.trim());
      if (byPipe.length >= 2 && byPipe[0]) {
        return {
          title: byPipe[0],
          description: byPipe[1] || "Tailored delivery for your goals.",
          metric: byPipe[2] || "Included",
        };
      }

      const byDash = line.split(" - ").map((p) => p.trim());
      if (byDash.length >= 2 && byDash[0]) {
        return {
          title: byDash[0],
          description: byDash[1],
          metric: "Included",
        };
      }

      return {
        title: line,
        description: "Tailored delivery for your goals.",
        metric: "Included",
      };
    })
    .filter((x) => x.title);
}

function expandTierListLine(input: string) {
  const line = safeTrim(input);
  if (!line || !line.includes(":")) return [];
  const [left, right] = line.split(":");
  const base = safeTrim(left);
  const tiersRaw = safeTrim(right);
  if (!base || !tiersRaw) return [];

  const tierNames = tiersRaw
    .replace(/\band\b/gi, ",")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tierNames.length < 2) return [];

  return tierNames.map((tier) => ({
    title: `${base} - ${tier}`,
    description: "Tailored delivery for your goals.",
    metric: "Included",
  }));
}

function detectPackageCount(raw: string) {
  const text = (raw || "").toLowerCase();
  const m = text.match(/(\d+)\s*(different\s*)?packages?/);
  const count = m ? Number(m[1]) : 0;
  return Number.isFinite(count) && count > 0 ? count : 0;
}

function buildNamedTiers(count: number, offer: string, lang: ReturnType<typeof getLang>) {
  const names = ["Starter", "Growth", "Premium", "Elite", "Enterprise"];
  const desc = pickLang(lang, {
    en: `${offer} package tailored to your goals.`,
    fa: `پکیج ${offer} متناسب با اهداف شما.`,
    ar: `باقة ${offer} مخصصة لأهدافك.`,
    fi: `${offer}-paketti tavoitteidesi mukaan.`,
  });
  const metrics = [
    pickLang(lang, { en: "Best for first results", fa: "مناسب شروع", ar: "مناسب للبداية", fi: "Paras aloitukseen" }),
    pickLang(lang, { en: "Most popular", fa: "محبوب‌ترین", ar: "الأكثر شيوعًا", fi: "Suosituin" }),
    pickLang(lang, { en: "Advanced support", fa: "پشتیبانی پیشرفته", ar: "دعم متقدم", fi: "Edistynyt tuki" }),
    pickLang(lang, { en: "Priority execution", fa: "اجرای اولویت‌دار", ar: "تنفيذ بأولوية", fi: "Priorisoitu toteutus" }),
    pickLang(lang, { en: "Custom scope", fa: "دامنه سفارشی", ar: "نطاق مخصص", fi: "Mukautettu laajuus" }),
  ];
  const out: Array<{ title: string; description: string; metric: string }> = [];
  for (let i = 0; i < count; i += 1) {
    out.push({
      title: names[i] ?? `Package ${i + 1}`,
      description: desc,
      metric: metrics[Math.min(i, metrics.length - 1)],
    });
  }
  return out;
}

function parsePortfolioJson(raw?: string) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((p) => ({
        title: String(p.title ?? "").trim(),
        description: String(p.description ?? "").trim() || "Project delivery tailored to client goals.",
        metric: String(p.metric ?? "").trim() || "Delivered",
        imageUrl: p.imageUrl ? String(p.imageUrl).trim() : undefined,
      }))
      .filter((p) => p.title || p.imageUrl)
      .map((p, i) => ({
        ...p,
        title: p.title || `Project ${i + 1}`,
      }));
  } catch {
    return [];
  }
}

function extractMetricsFromProof(
  proof: string,
  fallback: { rating: string; clients: string; years: string }
) {
  const ratingMatch = proof.match(/(\d(?:\.\d)?)\s*\/\s*5|(\d(?:\.\d)?)\s*stars?/i);
  const clientsMatch = proof.match(/(\d+\+?)\s*(clients?|customers?|projects?)/i);
  const yearsMatch = proof.match(/(\d+\+?)\s*(years?|yrs?)/i);

  const rating = safeTrim(fallback.rating) || (ratingMatch ? `${ratingMatch[1] || ratingMatch[2]}/5` : "");
  const clients = safeTrim(fallback.clients) || (clientsMatch ? clientsMatch[1] : "");
  const years = safeTrim(fallback.years) || (yearsMatch ? yearsMatch[1] : "");

  return { rating, clients, years };
}

function trustFactorLabel(
  key: string,
  lang: ReturnType<typeof getLang>
) {
  const map: Record<string, Record<string, string>> = {
    certifications: { en: "Certified Expertise", fa: "تخصص تأییدشده", ar: "خبرة معتمدة", fi: "Sertifioitu osaaminen" },
    experience: { en: "Deep Experience", fa: "تجربه عمیق", ar: "خبرة عميقة", fi: "Vahva kokemus" },
    results: { en: "Proven Results", fa: "نتایج اثبات‌شده", ar: "نتائج مثبتة", fi: "Todistetut tulokset" },
    guarantee: { en: "Low-Risk Delivery", fa: "تحویل کم‌ریسک", ar: "تنفيذ منخفض المخاطر", fi: "Matalan riskin toimitus" },
    portfolio: { en: "Validated Portfolio", fa: "پورتفولیوی معتبر", ar: "ملف أعمال موثّق", fi: "Validi portfolio" },
  };
  return (map[key]?.[lang] ?? map[key]?.en ?? key);
}

/**
 * Advanced content generator:
 * - keeps the same shape as generateBaseContent (content.ts)
 * - injects smarter copy and adds steps + contact hrefs (wiring only)
 */
export function generateContentAdvanced(answers: QuestionnaireAnswers) {
  const lang = getLang(answers);
  const base = applyAnswerOverrides(generateBaseContent(answers), answers);

  const customProblem = polishText(safeTrim(answers.problemStatement), lang, "sentence");
  const customOutcome = polishText(safeTrim(answers.outcomeStatement), lang, "sentence");
  const customProof = polishText(safeTrim(answers.proofLine), lang, "sentence");
  const trustNotes = parseJsonMap(answers.trustFactorNotesJson);
  const offer = polishText(safeTrim(answers.primaryOffer), lang, "title");
  const audience = safeTrim(String(answers.targetAudience || "")).replace(/-/g, " ");

  if (offer) {
    const smartHeadline = pickLang(lang, {
      en: audience ? `${offer} for ${polishText(audience, lang, "title")}` : offer,
      fa: offer,
      ar: offer,
      fi: offer,
    });
    base.meta.headline = smartHeadline;
  }

  // Prefer user-written strategic text when provided.
  const subheadlineParts = [
    customProblem || painPoint(answers),
    customOutcome || "",
    customProof ? `(${customProof})` : "",
  ].filter(Boolean);
  base.meta.subheadline = subheadlineParts.join(" ").slice(0, 300);

  // CTA refinement (same fields, no UI change)
  const refined = ctaRefinement(answers);
  base.cta.headline = customOutcome || refined.headline;
  base.cta.subheadline = customProblem || refined.subheadline;

  // Reflect custom proof into trust section subtitle when available
  if (customProof) {
    base.trust.subtitle = customProof;
  }

  const trustNoteValues = Object.values(trustNotes).filter(Boolean);
  if (trustNoteValues.length > 0) {
    const notePreview = trustNoteValues.slice(0, 2).join(" • ");
    base.trust.subtitle = customProof ? `${customProof} • ${notePreview}` : notePreview;
    const selectedFactors =
      (Array.isArray(answers.trustFactors) && answers.trustFactors.length > 0
        ? answers.trustFactors
        : answers.trustFactor
        ? [answers.trustFactor]
        : []) as string[];
    const noteBenefits = selectedFactors.slice(0, 3).map((factor) => ({
      title: trustFactorLabel(factor, lang),
      description: trustNotes[factor] || notePreview,
    }));
    base.value.benefits = noteBenefits as any;
  }

  // Make the "Why choose us" paragraph answer-driven.
  const niche = polishText(safeTrim(answers.niche), lang, "title");
  if (customProblem || customOutcome || niche) {
    const sentence = [customProblem, customOutcome].filter(Boolean).join(" ");
    base.value.description = niche
      ? `${sentence} ${niche ? `Focused on ${niche}.` : ""}`.trim()
      : sentence || base.value.description;
  }

  const metrics = extractMetricsFromProof(customProof, {
    rating: answers.ratingValue || "",
    clients: answers.clientsCount || "",
    years: answers.yearsExp || "",
  });
  if (Array.isArray(base.trust.stats) && base.trust.stats.length >= 3) {
    base.trust.stats = base.trust.stats.map((s, idx) => {
      if (idx === 0 && metrics.rating) return { ...s, value: metrics.rating };
      if (idx === 1 && metrics.clients) return { ...s, value: metrics.clients };
      if (idx === 2 && metrics.years) return { ...s, value: metrics.years };
      return s;
    }) as any;
  }

  // Force service/packages section to include clear package cards when provided.
  if (safeTrim(answers.customServices)) {
    const packageLines = (answers.customServices || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const expanded = packageLines.flatMap((line) => expandTierListLine(line));
    let parsedPackages = expanded.length > 0 ? expanded : parseServicePackages(answers.customServices);
    const explicitCount = detectPackageCount(answers.customServices || "");
    if (parsedPackages.length < 2 && explicitCount >= 2) {
      parsedPackages = buildNamedTiers(
        explicitCount,
        safeTrim(answers.primaryOffer) || "Service",
        lang
      );
    }

    const packageOfferings = parsedPackages.map((item) => ({
      name: item.title,
      description: item.description,
      features: [item.metric],
    }));
    if (packageOfferings.length > 0) {
      base.services.offerings = packageOfferings as any;
    }
  }
  const hasPackageGoal =
    answers.primaryGoal === "packages" ||
    (Array.isArray(answers.primaryGoals) && answers.primaryGoals.includes("packages"));
  if (hasPackageGoal) {
    base.services.title = pickLang(lang, {
      en: "Service Packages",
      fa: "پکیج‌های خدمات",
      ar: "باقات الخدمات",
      fi: "Palvelupaketit",
    });
    base.services.subtitle = pickLang(lang, {
      en: "Choose the package that matches your scope, budget, and growth stage.",
      fa: "پکیجی را انتخاب کنید که با دامنه، بودجه و مرحله رشد شما هم‌خوان است.",
      ar: "اختر الباقة المناسبة لنطاقك وميزانيتك ومرحلة نموك.",
      fi: "Valitse paketti, joka sopii laajuuteesi, budjettiisi ja kasvuvaiheeseesi.",
    });
  }

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
