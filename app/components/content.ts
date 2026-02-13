// app/components/content.ts
import * as React from "react";
import type { QuestionnaireAnswers } from "./questionnaire";

import {
  Award,
  Briefcase,
  CheckCircle,
  Clock,
  Globe,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export type LandingContent = ReturnType<typeof generateContent>;
export type Answers = QuestionnaireAnswers;

export type Lang = "en" | "fa" | "ar" | "fi";

export function getLang(answers: QuestionnaireAnswers): Lang {
  const raw = (answers.language || "").toLowerCase();
  if (raw.includes("persian") || raw.includes("farsi")) return "fa";
  if (raw.includes("arabic")) return "ar";
  if (raw.includes("finnish") || raw.includes("suomi")) return "fi";
  return "en";
}

export function pickLang<T>(lang: Lang, map: Record<Lang, T>): T {
  return map[lang] ?? map.en;
}

export function format(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

/**
 * These label helpers were previously imported from "@/app/lib/seo",
 * but seo.ts only exports generateSEO. Keeping labels here avoids
 * broken imports and keeps UI/content unchanged.
 */
function serviceTypeLabel(
  serviceType: QuestionnaireAnswers["serviceType"],
  lang: Lang,
  serviceTypeOther?: string
) {
  const otherLabel = serviceTypeOther?.trim()
    ? serviceTypeOther.trim()
    : pickLang(lang, {
        en: "Custom Services",
        fa: "خدمات سفارشی",
        ar: "خدمات مخصصة",
        fi: "Räätälöidyt palvelut",
      });
  const map: Record<Lang, Record<string, string>> = {
    en: {
      consulting: "Business Consulting",
      coaching: "Coaching & Training",
      design: "Design Services",
      development: "Web Development",
      marketing: "Marketing Services",
      creative: "Creative Services",
      legal: "Legal Services",
      accounting: "Accounting & Finance",
      other: otherLabel,
    },
    fa: {
      "Tailored scope and deliverables": "دامنه و تحویل‌های متناسب",
      "Clear timeline and ownership": "زمان‌بندی شفاف و مسئولیت مشخص",
      "Premium execution standards": "استانداردهای اجرای پریمیوم",
      "Tailored service scoped to your exact needs and goals.":
        "خدمت سفارشی مطابق نیازها و اهداف دقیق شما.",
      consulting: "مشاوره کسب‌وکار",
      coaching: "کوچینگ و آموزش",
      design: "خدمات طراحی",
      development: "توسعه وب",
      marketing: "خدمات بازاریابی",
      creative: "خدمات خلاق",
      legal: "خدمات حقوقی",
      accounting: "حسابداری و مالی",
      other: otherLabel,
    },
    ar: {
      "Tailored scope and deliverables": "نطاق وتسليمات مخصصة",
      "Clear timeline and ownership": "جدول زمني واضح ومسؤولية محددة",
      "Premium execution standards": "معايير تنفيذ متميزة",
      "Tailored service scoped to your exact needs and goals.":
        "خدمة مخصصة وفق احتياجاتك وأهدافك بدقة.",
      consulting: "استشارات الأعمال",
      coaching: "التدريب والإرشاد",
      design: "خدمات التصميم",
      development: "تطوير الويب",
      marketing: "خدمات التسويق",
      creative: "خدمات إبداعية",
      legal: "الخدمات القانونية",
      accounting: "المحاسبة والمالية",
      other: otherLabel,
    },
    fi: {
      "Tailored scope and deliverables": "Räätälöity laajuus ja toimitukset",
      "Clear timeline and ownership": "Selkeä aikataulu ja omistajuus",
      "Premium execution standards": "Premium‑toteutusstandardit",
      "Tailored service scoped to your exact needs and goals.":
        "Räätälöity palvelu tarpeidesi ja tavoitteidesi mukaan.",
      consulting: "Liiketoimintakonsultointi",
      coaching: "Valmennus ja koulutus",
      design: "Suunnittelupalvelut",
      development: "Web-kehitys",
      marketing: "Markkinointipalvelut",
      creative: "Luovat palvelut",
      legal: "Lakipalvelut",
      accounting: "Talous- ja kirjanpitopalvelut",
      other: otherLabel,
    },
  };
  return (map[lang][serviceType as string] ?? map.en[serviceType as string]) || "Professional Services";
}

function audienceLabelShort(audience: QuestionnaireAnswers["targetAudience"], lang: Lang) {
  const map: Record<Lang, Record<string, string>> = {
    en: {
      individuals: "Individuals",
      freelancers: "Freelancers",
      "small-business": "Small Businesses",
      "medium-business": "Mid-Market Businesses",
      enterprise: "Enterprises",
    },
    fa: {
      individuals: "افراد",
      freelancers: "فریلنسرها",
      "small-business": "کسب‌وکارهای کوچک",
      "medium-business": "کسب‌وکارهای متوسط",
      enterprise: "سازمان‌های بزرگ",
    },
    ar: {
      individuals: "الأفراد",
      freelancers: "المستقلون",
      "small-business": "الشركات الصغيرة",
      "medium-business": "الشركات المتوسطة",
      enterprise: "الشركات الكبرى",
    },
    fi: {
      individuals: "Yksityishenkilöt",
      freelancers: "Freelancerit",
      "small-business": "Pienyritykset",
      "medium-business": "Kasvuyritykset",
      enterprise: "Suuret yritykset",
    },
  };
  return (map[lang][audience as string] ?? map.en[audience as string]) || String(audience ?? "Clients");
}

function diffLabel(diff: QuestionnaireAnswers["keyDifferentiator"], lang: Lang) {
  const map: Record<Lang, Record<string, string>> = {
    en: {
      speed: "Fast, Reliable",
      quality: "Premium Quality",
      expertise: "Expert-Led",
      personal: "Personalized",
      results: "Results-Driven",
    },
    fa: {
      speed: "سریع و قابل‌اعتماد",
      quality: "کیفیت ممتاز",
      expertise: "هدایت‌شده توسط متخصص",
      personal: "شخصی‌سازی‌شده",
      results: "نتیجه‌محور",
    },
    ar: {
      speed: "سريع وموثوق",
      quality: "جودة ممتازة",
      expertise: "بقيادة خبراء",
      personal: "مخصص",
      results: "مدفوع بالنتائج",
    },
    fi: {
      speed: "Nopea ja luotettava",
      quality: "Premium‑laatu",
      expertise: "Asiantuntijavetoinen",
      personal: "Henkilökohtainen",
      results: "Tuloskeskeinen",
    },
  };
  return (map[lang][diff as string] ?? map.en[diff as string]) || String(diff ?? "Results-Driven");
}

export function generateContent(answers: QuestionnaireAnswers) {
  const lang = getLang(answers);
  const service = serviceTypeLabel(answers.serviceType, lang, answers.serviceTypeOther);
  const audience = audienceLabelShort(answers.targetAudience, lang);
  const diff = diffLabel(answers.keyDifferentiator, lang);

  const experienceLine =
    answers.experienceLevel === "new"
      ? pickLang(lang, {
          en: "Fresh perspective and modern approaches",
          fa: "نگاه تازه و رویکردهای مدرن",
          ar: "منظور حديث ونهج عصري",
          fi: "Raikas näkökulma ja modernit lähestymistavat",
        })
      : answers.experienceLevel === "intermediate"
      ? pickLang(lang, {
          en: "Proven track record with real results",
          fa: "سابقه اثبات‌شده با نتایج واقعی",
          ar: "سجل مثبت مع نتائج حقيقية",
          fi: "Todistettu kokemus ja mitattavat tulokset",
        })
      : answers.experienceLevel === "expert"
      ? pickLang(lang, {
          en: "Deep expertise and industry knowledge",
          fa: "تخصص عمیق و دانش صنعتی",
          ar: "خبرة عميقة ومعرفة بالصناعة",
          fi: "Syvällinen osaaminen ja toimialatuntemus",
        })
      : pickLang(lang, {
          en: "Industry veteran with extensive experience",
          fa: "خبره‌ی باسابقه در صنعت",
          ar: "خبير مخضرم بخبرة واسعة",
          fi: "Alan veteraani laajalla kokemuksella",
        });

  const headline =
    answers.targetAudience === "enterprise"
      ? format(
          pickLang(lang, {
            en: "Expert {service} to Drive Enterprise Outcomes",
            fa: "خدمات تخصصی {service} برای بهبود نتایج سازمانی",
            ar: "خبرة {service} لتحقيق نتائج مؤسسية",
            fi: "Asiantuntevaa {service} yritystulosten parantamiseen",
          }),
          { service }
        )
      : answers.targetAudience === "medium-business"
      ? format(
          pickLang(lang, {
            en: "Expert {service} to Scale Your Operations",
            fa: "خدمات تخصصی {service} برای مقیاس‌دادن عملیات شما",
            ar: "خبرة {service} لتوسيع عملياتك",
            fi: "Asiantuntevaa {service} toimintojen skaalaamiseen",
          }),
          { service }
        )
      : answers.targetAudience === "small-business"
      ? format(
          pickLang(lang, {
            en: "Practical {service} to Grow Your Business",
            fa: "خدمات کاربردی {service} برای رشد کسب‌وکار",
            ar: "{service} عملية لتنمية أعمالك",
            fi: "Käytännöllistä {service} liiketoiminnan kasvuun",
          }),
          { service }
        )
      : answers.targetAudience === "freelancers"
      ? format(
          pickLang(lang, {
            en: "{service} Built for Solopreneurs",
            fa: "{service} مخصوص سولـوپرنرها",
            ar: "{service} مخصص للمستقلين",
            fi: "{service} soloyrittäjille",
          }),
          { service }
        )
      : format(
          pickLang(lang, {
            en: "{service} That Gets Results",
            fa: "{service} که نتیجه می‌دهد",
            ar: "{service} تحقق نتائج",
            fi: "{service} joka tuottaa tuloksia",
          }),
          { service }
        );

  const primaryCTA =
    answers.primaryGoal === "leads"
      ? pickLang(lang, {
          en: "Get Your Free Consultation",
          fa: "مشاوره رایگان دریافت کنید",
          ar: "احصل على استشارة مجانية",
          fi: "Varaa ilmainen konsultaatio",
        })
      : answers.primaryGoal === "calls"
      ? pickLang(lang, {
          en: "Book Your Discovery Call",
          fa: "تماس آشنایی را رزرو کنید",
          ar: "احجز مكالمة استكشافية",
          fi: "Varaa kartoituspuhelu",
        })
      : answers.primaryGoal === "packages"
      ? pickLang(lang, {
          en: "View Service Packages",
          fa: "پکیج‌های خدمات را ببینید",
          ar: "اطّلع على باقات الخدمات",
          fi: "Katso palvelupaketit",
        })
      : pickLang(lang, {
          en: "Learn More",
          fa: "بیشتر بدانید",
          ar: "اعرف المزيد",
          fi: "Lue lisää",
        });

  const secondaryCTA =
    answers.primaryGoal === "calls"
      ? pickLang(lang, {
          en: "View Our Work",
          fa: "نمونه‌کارها",
          ar: "شاهد أعمالنا",
          fi: "Katso työmme",
        })
      : pickLang(lang, {
          en: "Learn More",
          fa: "بیشتر بدانید",
          ar: "اعرف المزيد",
          fi: "Lue lisää",
        });

  const trustBadges = [
    answers.trustFactor === "guarantee"
      ? pickLang(lang, {
          en: "Satisfaction Guarantee",
          fa: "گارانتی رضایت",
          ar: "ضمان الرضا",
          fi: "Tyytyväisyystakuu",
        })
      : answers.trustFactor === "certifications"
      ? pickLang(lang, {
          en: "Certified Professionals",
          fa: "متخصصان دارای گواهی",
          ar: "محترفون معتمدون",
          fi: "Sertifioidut ammattilaiset",
        })
      : answers.trustFactor === "portfolio"
      ? pickLang(lang, {
          en: "Proven Portfolio",
          fa: "پورتفولیوی اثبات‌شده",
          ar: "معرض أعمال مثبت",
          fi: "Todistettu portfolio",
        })
      : answers.trustFactor === "results"
      ? pickLang(lang, {
          en: "Client Results & ROI",
          fa: "نتایج و بازگشت سرمایه",
          ar: "نتائج العملاء والعائد",
          fi: "Asiakastulokset ja ROI",
        })
      : pickLang(lang, {
          en: "Years of Experience",
          fa: "سال‌ها تجربه",
          ar: "سنوات من الخبرة",
          fi: "Vuosien kokemus",
        }),
    diff,
    pickLang(lang, {
      en: "Fast Response Time",
      fa: "پاسخ‌گویی سریع",
      ar: "استجابة سريعة",
      fi: "Nopea vasteaika",
    }),
  ];

  const valueDesc =
    answers.businessStage === "starting"
      ? pickLang(lang, {
          en: "We help you launch with clarity, credibility, and a conversion-first message.",
          fa: "کمک می‌کنیم با وضوح، اعتبار و پیام متمرکز بر تبدیل شروعی قدرتمند داشته باشید.",
          ar: "نساعدك على الانطلاق بوضوح ومصداقية ورسالة تركز على التحويل.",
          fi: "Autamme sinua käynnistämään selkeydellä, uskottavuudella ja konversiokeskeisellä viestillä.",
        })
      : answers.businessStage === "established"
      ? pickLang(lang, {
          en: "We refine your positioning and optimize the funnel to increase qualified demand.",
          fa: "جایگاه‌یابی شما را اصلاح می‌کنیم و قیف را بهینه می‌کنیم تا تقاضای باکیفیت افزایش یابد.",
          ar: "نحسّن تموضعك ونُحسّن القمع لزيادة الطلب المؤهل.",
          fi: "Hiomme positiointisi ja optimoimme suppilon lisätäksemme laadukasta kysyntää.",
        })
      : pickLang(lang, {
          en: "We systemize acquisition with scalable messaging and trust-building assets.",
          fa: "کسب مشتری را با پیام‌های مقیاس‌پذیر و ابزارهای اعتمادساز سیستم‌سازی می‌کنیم.",
          ar: "نُنظم اكتساب العملاء برسائل قابلة للتوسع وأصول تعزز الثقة.",
          fi: "Systematisoimme asiakashankinnan skaalautuvalla viestinnällä ja luottamusta rakentavilla elementeillä.",
        });

  const benefits = [
    answers.keyDifferentiator === "speed"
      ? {
          title: pickLang(lang, {
            en: "Fast Turnaround",
            fa: "تحویل سریع",
            ar: "تنفيذ سريع",
            fi: "Nopea toimitus",
          }),
          description:
            pickLang(lang, {
              en: "Quick delivery without compromising quality—ship results on time.",
              fa: "تحویل سریع بدون افت کیفیت—نتیجه را به‌موقع تحویل می‌دهیم.",
              ar: "تسليم سريع دون المساس بالجودة—نتائج في الوقت المحدد.",
              fi: "Nopea toimitus tinkimättä laadusta — tulokset ajallaan.",
            }),
          tone: "blue",
        }
      : answers.keyDifferentiator === "quality"
      ? {
          title: pickLang(lang, {
            en: "Exceptional Quality",
            fa: "کیفیت استثنایی",
            ar: "جودة استثنائية",
            fi: "Poikkeuksellinen laatu",
          }),
          description:
            pickLang(lang, {
              en: "Meticulous attention to detail and high standards in every deliverable.",
              fa: "دقت بالا و استانداردهای عالی در هر تحویل.",
              ar: "اهتمام دقيق بالتفاصيل ومعايير عالية في كل تسليم.",
              fi: "Huolellinen viimeistely ja korkeat standardit jokaisessa toimituksessa.",
            }),
          tone: "blue",
        }
      : answers.keyDifferentiator === "expertise"
      ? {
          title: pickLang(lang, {
            en: "Specialized Expertise",
            fa: "تخصص متمرکز",
            ar: "خبرة متخصصة",
            fi: "Erikoistunut osaaminen",
          }),
          description:
            pickLang(lang, {
              en: "Deep knowledge in a focused niche—clarity, confidence, and precision.",
              fa: "دانش عمیق در یک حوزه—شفافیت، اعتماد و دقت.",
              ar: "معرفة عميقة بمجال محدد — وضوح وثقة ودقة.",
              fi: "Syvä osaaminen kapeassa niche‑alueessa — selkeys, varmuus ja tarkkuus.",
            }),
          tone: "blue",
        }
      : answers.keyDifferentiator === "personal"
      ? {
          title: pickLang(lang, {
            en: "Personalized Service",
            fa: "خدمت شخصی‌سازی‌شده",
            ar: "خدمة مخصصة",
            fi: "Henkilökohtainen palvelu",
          }),
          description:
            pickLang(lang, {
              en: "Tailored strategy and execution based on your business context.",
              fa: "استراتژی و اجرا متناسب با شرایط کسب‌وکار شما.",
              ar: "استراتيجية وتنفيذ مصممان وفق سياق عملك.",
              fi: "Räätälöity strategia ja toteutus yrityksesi tilanteen mukaan.",
            }),
          tone: "blue",
        }
      : {
          title: pickLang(lang, {
            en: "Proven Results",
            fa: "نتایج اثبات‌شده",
            ar: "نتائج مثبتة",
            fi: "Todistetut tulokset",
          }),
          description:
            pickLang(lang, {
              en: "Track record of measurable success and client outcomes you can trust.",
              fa: "سابقه نتایج قابل اندازه‌گیری و قابل اعتماد.",
              ar: "سجل من النجاحات القابلة للقياس ونتائج موثوقة.",
              fi: "Mitattava menestyshistoria ja luotettavat asiakastulokset.",
            }),
          tone: "blue",
        },
    {
      title: pickLang(lang, {
        en: "Strategic Solutions",
        fa: "راهکارهای استراتژیک",
        ar: "حلول استراتيجية",
        fi: "Strategiset ratkaisut",
      }),
      description:
        pickLang(lang, {
          en: "Data-informed decisions aligned to your primary business objective.",
          fa: "تصمیم‌های مبتنی بر داده همسو با هدف اصلی کسب‌وکار شما.",
          ar: "قرارات مبنية على البيانات ومتوافقة مع هدفك الأساسي.",
          fi: "Dataan perustuvat päätökset, jotka tukevat ydintavoitettasi.",
        }),
      tone: "cyan",
    },
    answers.trustFactor === "guarantee"
      ? {
          title: pickLang(lang, {
            en: "Risk-Free Guarantee",
            fa: "گارانتی بدون ریسک",
            ar: "ضمان بلا مخاطر",
            fi: "Riskitön takuu",
          }),
          description:
            pickLang(lang, {
              en: "If you’re not satisfied, we’ll make it right—clear and fair terms.",
              fa: "اگر راضی نباشید، اصلاح می‌کنیم—شرایط شفاف و منصفانه.",
              ar: "إن لم تكن راضيًا سنصحح الأمر — شروط واضحة وعادلة.",
              fi: "Jos et ole tyytyväinen, korjaamme — selkein ja reiluin ehdoin.",
            }),
          tone: "cyan",
        }
      : answers.trustFactor === "certifications"
      ? {
          title: pickLang(lang, {
            en: "Certified Credentials",
            fa: "گواهی‌های معتبر",
            ar: "اعتمادات موثوقة",
            fi: "Sertifioidut pätevyydet",
          }),
          description:
            pickLang(lang, {
              en: "Professional training and standards that reduce decision risk.",
              fa: "آموزش و استانداردهای حرفه‌ای برای کاهش ریسک تصمیم.",
              ar: "تدريب ومعايير مهنية تقلل مخاطر القرار.",
              fi: "Ammatillinen koulutus ja standardit, jotka vähentävät riskiä.",
            }),
          tone: "cyan",
        }
      : answers.trustFactor === "portfolio"
      ? {
          title: pickLang(lang, {
            en: "Work You Can Verify",
            fa: "نمونه‌کار قابل‌بررسی",
            ar: "عمل يمكنك التحقق منه",
            fi: "Varmennettavat työt",
          }),
          description:
            pickLang(lang, {
              en: "Real projects and proof—what we say is backed by execution.",
              fa: "پروژه‌های واقعی و قابل اثبات—گفته‌های ما پشتوانه اجرایی دارد.",
              ar: "مشاريع حقيقية ودليل واضح — ما نقوله مدعوم بالتنفيذ.",
              fi: "Aitoja projekteja ja todisteita — lupaukset tukevat toteutusta.",
            }),
          tone: "cyan",
        }
      : answers.trustFactor === "results"
      ? {
          title: pickLang(lang, {
            en: "Client Results & ROI",
            fa: "نتایج مشتری و بازگشت سرمایه",
            ar: "نتائج العملاء والعائد",
            fi: "Asiakastulokset ja ROI",
          }),
          description:
            pickLang(lang, {
              en: "Outcomes-first positioning—what changes, improves, and scales.",
              fa: "تمرکز بر نتیجه—آنچه تغییر می‌کند، بهبود می‌یابد و مقیاس می‌گیرد.",
              ar: "تموضع يركز على النتائج — ما يتغير ويتحسن ويتوسع.",
              fi: "Tuloksiin perustuva positiointi — se mikä muuttuu, paranee ja skaalautuu.",
            }),
          tone: "cyan",
        }
      : {
          title: pickLang(lang, {
            en: "Credibility Built-In",
            fa: "اعتبار ذاتی",
            ar: "مصداقية مدمجة",
            fi: "Sisäänrakennettu uskottavuus",
          }),
          description:
            pickLang(lang, {
              en: "Experience and process that make collaboration smooth and predictable.",
              fa: "تجربه و فرآیندی که همکاری را روان و قابل پیش‌بینی می‌کند.",
              ar: "خبرة ومنهجية تجعل التعاون سلسًا ومتوقعًا.",
              fi: "Kokemus ja prosessi, jotka tekevät yhteistyöstä sujuvaa.",
            }),
          tone: "cyan",
        },
  ];

  const offerings = [
    ...serviceOfferings(answers.serviceType, lang),
    ...parseCustomServices(answers.customServices, lang),
  ];

  const stats = [
    {
      label: pickLang(lang, {
        en: "Years of Experience",
        fa: "سال تجربه",
        ar: "سنوات الخبرة",
        fi: "Vuosien kokemus",
      }),
      value:
        answers.experienceLevel === "veteran"
          ? "10+"
          : answers.experienceLevel === "expert"
          ? "7+"
          : answers.experienceLevel === "intermediate"
          ? "3+"
          : "1+",
    },
    {
      label: pickLang(lang, {
        en: "Happy Clients",
        fa: "مشتریان راضی",
        ar: "عملاء راضون",
        fi: "Tyytyväiset asiakkaat",
      }),
      value: "100+",
    },
    {
      label:
        answers.trustFactor === "results"
          ? pickLang(lang, {
              en: "Client Success Rate",
              fa: "نرخ موفقیت مشتری",
              ar: "معدل نجاح العملاء",
              fi: "Asiakasonnistumisaste",
            })
          : pickLang(lang, {
              en: "Average Rating",
              fa: "میانگین امتیاز",
              ar: "متوسط التقييم",
              fi: "Keskimääräinen arvio",
            }),
      value: answers.trustFactor === "results" ? "95%" : "5.0",
    },
  ];

  const portfolioTitle =
    answers.trustFactor === "portfolio"
      ? pickLang(lang, {
          en: "Our Recent Work",
          fa: "نمونه‌کارهای اخیر",
          ar: "أعمالنا الأخيرة",
          fi: "Viimeisimmät työmme",
        })
      : answers.trustFactor === "results"
      ? pickLang(lang, {
          en: "Client Success Stories",
          fa: "داستان‌های موفقیت مشتریان",
          ar: "قصص نجاح العملاء",
          fi: "Asiakkaiden menestystarinat",
        })
      : pickLang(lang, {
          en: "Featured Projects",
          fa: "پروژه‌های منتخب",
          ar: "مشاريع مميزة",
          fi: "Valikoidut projektit",
        });

  const portfolioItems = portfolioByService(answers.serviceType, lang);

  const includeAbout = answers.includeAbout === "yes";

  const about = {
    badge: pickLang(lang, {
      en: "About Us",
      fa: "درباره ما",
      ar: "من نحن",
      fi: "Meistä",
    }),
    title: pickLang(lang, {
      en: "Who We Are",
      fa: "ما که هستیم",
      ar: "من نحن",
      fi: "Keitä olemme",
    }),
    story: format(
      pickLang(lang, {
        en: "At {service}, we deliver outcomes with a clear process and high accountability. We focus on the work that moves metrics—not busywork.",
        fa: "در {service}، با فرآیندی روشن و پاسخگویی بالا نتیجه می‌سازیم. تمرکز ما روی کارهای اثرگذار است، نه کارهای زائد.",
        ar: "في {service} نحقق النتائج عبر عملية واضحة ومسؤولية عالية. نركز على العمل الذي يحرّك المؤشرات، لا الأعمال الشكلية.",
        fi: "Palvelussa {service} tuotamme tuloksia selkeällä prosessilla ja korkealla vastuullisuudella. Keskitymme työhön, joka vaikuttaa.",
      }),
      { service }
    ),
    mission: format(
      pickLang(lang, {
        en: "Deliver {serviceLower} that creates measurable progress for {audienceLower}.",
        fa: "ارائه {serviceLower} که پیشرفت قابل اندازه‌گیری برای {audienceLower} ایجاد کند.",
        ar: "تقديم {serviceLower} يحقق تقدماً قابلاً للقياس لـ {audienceLower}.",
        fi: "Toimitamme {serviceLower}, joka luo mitattavaa kehitystä {audienceLower}.",
      }),
      { serviceLower: service.toLowerCase(), audienceLower: audience.toLowerCase() }
    ),
    team: format(
      pickLang(lang, {
        en: "A focused team built around {diffLower} and consistent execution.",
        fa: "تیمی متمرکز بر {diffLower} و اجرای منسجم.",
        ar: "فريق مركز مبني على {diffLower} وتنفيذ ثابت.",
        fi: "Fokusoitunut tiimi, jonka ytimessä on {diffLower} ja johdonmukainen toteutus.",
      }),
      { diffLower: diff.toLowerCase() }
    ),
    experience:
      answers.experienceLevel === "veteran"
        ? "10+"
        : answers.experienceLevel === "expert"
        ? "7+"
        : "3+",
  };

  const ctaHeadline =
    answers.primaryGoal === "calls"
      ? pickLang(lang, {
          en: "Let’s Talk About Your Goals",
          fa: "بیایید درباره هدف‌هایتان صحبت کنیم",
          ar: "لنتحدث عن أهدافك",
          fi: "Puhutaan tavoitteistasi",
        })
      : answers.primaryGoal === "packages"
      ? pickLang(lang, {
          en: "Choose Your Perfect Package",
          fa: "پکیج مناسب خود را انتخاب کنید",
          ar: "اختر الباقة المناسبة لك",
          fi: "Valitse sinulle sopiva paketti",
        })
      : pickLang(lang, {
          en: "Ready to Get Started?",
          fa: "آماده شروع هستید؟",
          ar: "جاهز للبدء؟",
          fi: "Valmiina aloittamaan?",
        });

  const ctaSubheadline =
    answers.keyDifferentiator === "expertise"
      ? pickLang(lang, {
          en: "Tap into specialized expertise—schedule your free consultation",
          fa: "از تخصص متمرکز بهره بگیرید—مشاوره رایگان خود را رزرو کنید",
          ar: "استفد من الخبرة المتخصصة — احجز استشارتك المجانية",
          fi: "Hyödynnä erikoisosaamista — varaa ilmainen konsultaatio",
        })
      : answers.keyDifferentiator === "quality"
      ? pickLang(lang, {
          en: "Upgrade quality and outcomes—let’s discuss the best path forward",
          fa: "کیفیت و نتایج را ارتقا دهید—بهترین مسیر را بررسی کنیم",
          ar: "ارفع الجودة والنتائج — لنتحدث عن أفضل مسار",
          fi: "Nosta laatua ja tuloksia — löydetään paras etenemistapa",
        })
      : answers.keyDifferentiator === "speed"
      ? pickLang(lang, {
          en: "Move fast with confidence—get results quickly without chaos",
          fa: "با اطمینان سریع حرکت کنید—بدون آشفتگی نتیجه بگیرید",
          ar: "تحرك بسرعة بثقة — نتائج سريعة بلا فوضى",
          fi: "Etene nopeasti luottavaisesti — tuloksia ilman kaaosta",
        })
      : answers.keyDifferentiator === "personal"
      ? pickLang(lang, {
          en: "Get a tailored plan—built around your goals and constraints",
          fa: "برنامه‌ای متناسب با اهداف و محدودیت‌های شما دریافت کنید",
          ar: "احصل على خطة مخصصة — مبنية على أهدافك وقيودك",
          fi: "Saat räätälöidyn suunnitelman tavoitteidesi mukaan",
        })
      : pickLang(lang, {
          en: "Join clients who trust results—book your next step",
          fa: "به مشتریانی بپیوندید که به نتیجه اعتماد دارند—گام بعد را رزرو کنید",
          ar: "انضم إلى عملاء يثقون بالنتائج — احجز خطوتك التالية",
          fi: "Liity tuloksiin luottaviin asiakkaisiin — varaa seuraava askel",
        });

  const ctaSubtext =
    answers.primaryGoal === "calls"
      ? pickLang(lang, {
          en: "No obligation • Free 30-minute consultation • Quick response",
          fa: "بدون تعهد • مشاوره ۳۰ دقیقه‌ای رایگان • پاسخ سریع",
          ar: "بدون التزام • استشارة مجانية 30 دقيقة • رد سريع",
          fi: "Ei sitoumusta • 30 min ilmainen konsultaatio • Nopea vastaus",
        })
      : answers.pricingApproach === "custom"
      ? pickLang(lang, {
          en: "Free quote • Transparent scope • No hidden fees",
          fa: "پیشنهاد رایگان • محدوده شفاف • بدون هزینه پنهان",
          ar: "عرض مجاني • نطاق شفاف • بدون رسوم مخفية",
          fi: "Ilmainen tarjous • Selkeä laajuus • Ei piilokuluja",
        })
      : pickLang(lang, {
          en: "Quick setup • No commitment • Get started in minutes",
          fa: "راه‌اندازی سریع • بدون تعهد • شروع در چند دقیقه",
          ar: "إعداد سريع • بدون التزام • ابدأ خلال دقائق",
          fi: "Nopea aloitus • Ei sitoumusta • Alku minuuteissa",
        });

  const contact = {
    title: pickLang(lang, {
      en: "Get in Touch",
      fa: "در تماس باشید",
      ar: "تواصل معنا",
      fi: "Ota yhteyttä",
    }),
    subtitle: pickLang(lang, {
      en: "Ready to get started? Choose the best way to connect.",
      fa: "برای شروع آماده‌اید؟ بهترین روش ارتباط را انتخاب کنید.",
      ar: "جاهز للبدء؟ اختر أفضل طريقة للتواصل.",
      fi: "Valmiina aloittamaan? Valitse sopivin yhteystapa.",
    }),
    call: {
      title: pickLang(lang, {
        en: "Book a Call",
        fa: "رزرو تماس",
        ar: "احجز مكالمة",
        fi: "Varaa puhelu",
      }),
      desc: pickLang(lang, {
        en: "Schedule a free consultation",
        fa: "مشاوره رایگان را زمان‌بندی کنید",
        ar: "جدول استشارة مجانية",
        fi: "Varaa ilmainen konsultaatio",
      }),
      cta: pickLang(lang, {
        en: "Schedule Now",
        fa: "همین حالا رزرو کنید",
        ar: "احجز الآن",
        fi: "Varaa nyt",
      }),
    },
    email: {
      title: pickLang(lang, {
        en: "Send an Email",
        fa: "ارسال ایمیل",
        ar: "أرسل بريدًا",
        fi: "Lähetä sähköposti",
      }),
      desc: pickLang(lang, {
        en: "Prefer email? Drop a message anytime",
        fa: "اگر ایمیل را ترجیح می‌دهید، هر زمان پیام دهید",
        ar: "تفضّل البريد؟ أرسل رسالة في أي وقت",
        fi: "Sähköposti sopii? Lähetä viesti milloin tahansa",
      }),
      cta: pickLang(lang, {
        en: "Email Us",
        fa: "ایمیل بزنید",
        ar: "راسلنا",
        fi: "Lähetä viesti",
      }),
    },
    chat: {
      title: pickLang(lang, {
        en: "Live Chat",
        fa: "چت آنلاین",
        ar: "دردشة مباشرة",
        fi: "Live‑chat",
      }),
      desc: pickLang(lang, {
        en: "Get instant answers to your questions",
        fa: "پاسخ فوری به سوال‌ها",
        ar: "احصل على إجابات فورية",
        fi: "Saat vastaukset heti",
      }),
      cta: pickLang(lang, {
        en: "Start Chat",
        fa: "شروع چت",
        ar: "ابدأ الدردشة",
        fi: "Aloita chat",
      }),
    },
  };

  const pricing = defaultPricing(lang);

  return {
    meta: {
      businessName: service,
      headline,
      subheadline: experienceLine,
      primaryCTA,
      secondaryCTA,
      trustBadges,
    },
    value: {
      title: pickLang(lang, {
        en: "Why Choose Us?",
        fa: "چرا ما را انتخاب کنید؟",
        ar: "لماذا تختارنا؟",
        fi: "Miksi valita meidät?",
      }),
      description: valueDesc,
      benefits,
    },
    services: {
      title: format(
        pickLang(lang, {
          en: "Our {service} Solutions",
          fa: "راهکارهای {service} ما",
          ar: "حلول {service} لدينا",
          fi: "{service}‑ratkaisumme",
        }),
        { service }
      ),
      subtitle: pickLang(lang, {
        en: "Comprehensive services tailored to your unique needs",
        fa: "خدمات جامع متناسب با نیازهای شما",
        ar: "خدمات شاملة مصممة لاحتياجاتك",
        fi: "Kattavat palvelut yksilöllisiin tarpeisiisi",
      }),
      offerings,
    },
    trust: {
      title: pickLang(lang, {
        en: "Trusted by Clients Like You",
        fa: "مورد اعتماد مشتریانی مثل شما",
        ar: "موثوق به من عملاء مثلك",
        fi: "Luotettu asiakkaiden keskuudessa",
      }),
      subtitle: pickLang(lang, {
        en: "See why businesses choose us for their success",
        fa: "ببینید چرا کسب‌وکارها ما را انتخاب می‌کنند",
        ar: "تعرّف لماذا تختارنا الشركات لنجاحها",
        fi: "Katso miksi yritykset valitsevat meidät",
      }),
      stats,
      guarantee:
        answers.trustFactor === "guarantee"
          ? {
              title: pickLang(lang, {
                en: "Our Satisfaction Guarantee",
                fa: "گارانتی رضایت ما",
                ar: "ضمان الرضا لدينا",
                fi: "Tyytyväisyystakuumme",
              }),
              description: pickLang(lang, {
                en: "We stand behind our work. If you’re not satisfied with the outcome, we’ll iterate until it meets expectations—or provide a fair refund per written scope.",
                fa: "پشت کارمان می‌ایستیم. اگر راضی نباشید، تا رسیدن به انتظار شما اصلاح می‌کنیم یا بازپرداخت منصفانه ارائه می‌دهیم.",
                ar: "نقف خلف عملنا. إذا لم تكن راضيًا، سنراجع حتى يحقق التوقعات أو نقدم استردادًا منصفًا وفق النطاق.",
                fi: "Seisomme työmme takana. Jos et ole tyytyväinen, iteramme kunnes odotukset täyttyvät.",
              }),
            }
          : null,
    },
    portfolio: {
      title: portfolioTitle,
      subtitle: pickLang(lang, {
        en: "See how we’ve helped clients achieve their goals",
        fa: "ببینید چگونه به مشتریان در رسیدن به اهدافشان کمک کرده‌ایم",
        ar: "شاهد كيف ساعدنا العملاء على تحقيق أهدافهم",
        fi: "Katso, miten olemme auttaneet asiakkaita saavuttamaan tavoitteensa",
      }),
      items: portfolioItems,
    },
    about: includeAbout ? about : null,
    cta: {
      headline: ctaHeadline,
      subheadline: ctaSubheadline,
      buttonText: primaryCTA,
      subtext: ctaSubtext,
    },
    contact,
    pricing,
  };
}

function translateText(lang: Lang, text: string) {
  const map: Record<Lang, Record<string, string>> = {
    en: {},
    fa: {
      "Custom Services": "خدمات سفارشی",
      "Custom Engagement": "همکاری سفارشی",
      "Tailored scope aligned to your exact goals and requirements":
        "دامنه سفارشی مطابق اهداف و نیازهای دقیق شما",
      "Specialized Support": "پشتیبانی تخصصی",
      "Expert help for unique or niche needs": "کمک تخصصی برای نیازهای خاص یا نیچ",
      "Discovery and audit": "کشف و ارزیابی",
      "Custom roadmap": "نقشه راه سفارشی",
      "Hands-on execution": "اجرای عملی",
      "Ongoing optimization": "بهینه‌سازی مداوم",
      "Flexible service design": "طراحی خدمات انعطاف‌پذیر",
      "Dedicated ownership": "مسئولیت مشخص",
      "Milestone-based delivery": "تحویل مرحله‌ای",
      "Clear reporting": "گزارش‌دهی شفاف",
      "Specialized Solution": "راهکار تخصصی",
      "Built a niche-specific workflow": "ساخت فرایند مخصوص یک نیچ",
      "Premium Support": "پشتیبانی پریمیوم",
      "Ongoing optimization and reporting": "بهینه‌سازی و گزارش‌دهی مداوم",
      "90‑day delivery": "تحویل ۹۰ روزه",
      "40% faster execution": "۴۰٪ اجرای سریع‌تر",
      "3x ROI": "۳ برابر بازگشت سرمایه",
      "Business Strategy": "استراتژی کسب‌وکار",
      "Process Improvement": "بهبود فرآیند",
      "1:1 Coaching": "کوچینگ ۱ به ۱",
      "Group Programs": "برنامه‌های گروهی",
      "Brand Identity": "هویت برند",
      "Digital Design": "طراحی دیجیتال",
      "Website Development": "توسعه وب‌سایت",
      "Web Applications": "وب‌اپلیکیشن‌ها",
      "Digital Marketing": "بازاریابی دیجیتال",
      "Content Strategy": "استراتژی محتوا",
      "Photography": "عکاسی",
      "Video Production": "تولید ویدئو",
      "Legal Consulting": "مشاوره حقوقی",
      "Document Services": "خدمات اسناد",
      "Bookkeeping": "حسابداری",
      "Tax Services": "خدمات مالیاتی",
      "Comprehensive strategic planning to drive growth and efficiency":
        "برنامه‌ریزی استراتژیک برای رشد و بهره‌وری",
      "Streamline operations and maximize productivity":
        "بهینه‌سازی عملیات و افزایش بهره‌وری",
      "Personalized coaching sessions tailored to your goals":
        "جلسات کوچینگ شخصی‌سازی‌شده بر اساس اهداف شما",
      "Collaborative learning with like-minded professionals":
        "یادگیری گروهی با افراد هم‌فکر",
      "Create a memorable brand that stands out":
        "خلق برندی ماندگار که متمایز باشد",
      "Modern, user-focused digital experiences":
        "تجربه‌های دیجیتال مدرن و کاربرمحور",
      "High-performance websites built for growth":
        "وب‌سایت‌های پرسرعت و آماده رشد",
      "Scalable solutions for complex business needs":
        "راهکارهای مقیاس‌پذیر برای نیازهای پیچیده",
      "Drive traffic and conversions with data-driven campaigns":
        "افزایش ترافیک و تبدیل با کمپین‌های داده‌محور",
      "Content that connects and converts":
        "محتوایی که ارتباط می‌سازد و تبدیل می‌کند",
      "Professional visuals for your brand":
        "تصاویر حرفه‌ای برای برند شما",
      "Compelling video content that tells your story":
        "محتوای ویدئویی اثرگذار برای روایت داستان شما",
      "Practical legal guidance for your business":
        "راهنمایی حقوقی کاربردی برای کسب‌وکار شما",
      "Professional legal documentation":
        "مستندسازی حقوقی حرفه‌ای",
      "Accurate financial records you can trust":
        "سوابق مالی دقیق و قابل اعتماد",
      "Maximize deductions and stay compliant":
        "حداکثرسازی معافیت‌ها و رعایت قوانین",
      "Market analysis and competitive positioning":
        "تحلیل بازار و جایگاه رقابتی",
      "Growth strategy development":
        "توسعه استراتژی رشد",
      "Operational optimization":
        "بهینه‌سازی عملیات",
      "Performance metrics and KPIs":
        "شاخص‌های عملکرد و KPI",
      "Workflow analysis and optimization":
        "تحلیل و بهینه‌سازی جریان کار",
      "Systems implementation": "پیاده‌سازی سیستم‌ها",
      "Change management support": "پشتیبانی مدیریت تغییر",
      "Ongoing performance monitoring": "پایش مستمر عملکرد",
      "Goal setting and planning": "تعیین هدف و برنامه‌ریزی",
      "Weekly accountability": "پیگیری هفتگی",
      "Custom action plans": "برنامه‌های اجرایی اختصاصی",
      "Email support": "پشتیبانی ایمیلی",
      "Live group sessions": "جلسات گروهی زنده",
      "Peer networking": "شبکه‌سازی با همتایان",
      "Resource library": "کتابخانه منابع",
      "Community support": "پشتیبانی جامعه",
      "Logo + brand system": "لوگو و سیستم برند",
      "Typography + colors": "تایپوگرافی و رنگ‌ها",
      "Brand positioning": "جایگاه‌سازی برند",
      "Marketing assets": "دارایی‌های بازاریابی",
      "Web/app UI": "UI وب/اپ",
      "UX optimization": "بهینه‌سازی UX",
      "Responsive design": "طراحی ریسپانسیو",
      "Prototyping": "پروتوتایپ",
      "Mobile-first": "موبایل‌محور",
      "SEO-ready": "آماده برای سئو",
      "Analytics integration": "اتصال آنالیتیکس",
      "CMS options": "گزینه‌های CMS",
      "Custom features": "ویژگی‌های سفارشی",
      "Database + API": "دیتابیس و API",
      "Auth + roles": "احراز هویت و نقش‌ها",
      "Maintenance": "نگه‌داری",
      "SEO strategy": "استراتژی سئو",
      "PPC management": "مدیریت PPC",
      "Social growth": "رشد شبکه‌های اجتماعی",
      "Email funnels": "فانل ایمیل",
      "Messaging": "پیام‌پردازی",
      "Editorial calendar": "تقویم محتوایی",
      "Creative direction": "هدایت خلاق",
      "Performance analytics": "تحلیل عملکرد",
      "Product shoots": "عکاسی محصول",
      "Headshots": "عکس پرتره",
      "Event coverage": "پوشش رویداد",
      "Retouching": "رتوش",
      "Promo videos": "ویدئوی تبلیغاتی",
      "Social clips": "کلیپ شبکه‌های اجتماعی",
      "Editing": "تدوین",
      "Distribution-ready exports": "خروجی آماده انتشار",
      "Contracts": "قراردادها",
      "Compliance": "انطباق",
      "Risk review": "بازبینی ریسک",
      "Ongoing support": "پشتیبانی مستمر",
      "Terms & conditions": "شرایط و ضوابط",
      "Privacy policy": "سیاست حریم خصوصی",
      "Agreements": "توافق‌نامه‌ها",
      "Employment docs": "اسناد استخدامی",
      "Monthly reconciliation": "تطبیق ماهانه",
      "Reporting": "گزارش‌دهی",
      "Expense tracking": "پیگیری هزینه‌ها",
      "Payroll support": "پشتیبانی حقوق و دستمزد",
      "Tax preparation": "تهیه مالیات",
      "Tax planning": "برنامه‌ریزی مالیاتی",
      "Audit support": "پشتیبانی حسابرسی",
      "Year-round advice": "مشاوره سالانه",
      "Manufacturing Optimization": "بهینه‌سازی تولید",
      "Streamlined operations for a mid-size manufacturer":
        "بهینه‌سازی عملیات برای یک تولیدکننده متوسط",
      "35% efficiency increase": "۳۵٪ افزایش بهره‌وری",
      "Growth Strategy": "استراتژی رشد",
      "Strategic planning for tech startup expansion":
        "برنامه‌ریزی استراتژیک برای توسعه استارتاپ فناوری",
      "3x revenue growth": "۳ برابر رشد درآمد",
      "Change Management": "مدیریت تغییر",
      "Successful organizational transformation": "تحول سازمانی موفق",
      "90% adoption rate": "۹۰٪ نرخ پذیرش",
      "Career Transition": "تغییر مسیر شغلی",
      "Guided professional to a better role": "راهنمایی برای نقش بهتر",
      "40% salary increase": "۴۰٪ افزایش حقوق",
      "Leadership Growth": "رشد رهبری",
      "Improved executive communication and clarity": "بهبود ارتباطات مدیریتی",
      "Promoted in 8 months": "ارتقا در ۸ ماه",
      "Team Performance": "عملکرد تیم",
      "Boosted team delivery and accountability": "افزایش تحویل و مسئولیت‌پذیری",
      "60% performance lift": "۶۰٪ رشد عملکرد",
      "Brand Refresh": "بازطراحی برند",
      "Rebrand for a growing SaaS company": "برندسازی مجدد برای یک SaaS در حال رشد",
      "200% recognition increase": "۲۰۰٪ افزایش شناخت",
      "E-commerce UX": "تجربه کاربری فروشگاه",
      "Conversion-focused redesign": "بازطراحی با تمرکز بر تبدیل",
      "45% conversion increase": "۴۵٪ افزایش تبدیل",
      "Mobile App UI": "رابط کاربری اپ موبایل",
      "Fintech interface redesign": "بازطراحی رابط فین‌تک",
      "4.8 star rating": "امتیاز ۴.۸ ستاره",
      "Custom Web Platform": "پلتفرم وب سفارشی",
      "Built scalable SaaS platform": "ساخت پلتفرم SaaS مقیاس‌پذیر",
      "10k+ active users": "بیش از ۱۰هزار کاربر فعال",
      "E-commerce Site": "سایت فروشگاهی",
      "Performance optimization for storefront": "بهینه‌سازی عملکرد فروشگاه",
      "50% faster load": "۵۰٪ بارگذاری سریع‌تر",
      "Business App": "اپلیکیشن کسب‌وکار",
      "Internal tools for enterprise ops": "ابزارهای داخلی برای عملیات سازمانی",
      "70% time saved": "۷۰٪ صرفه‌جویی زمانی",
      "SEO Campaign": "کمپین سئو",
      "Ranked #1 for competitive keywords": "رتبه ۱ برای کلمات رقابتی",
      "300% organic growth": "۳۰۰٪ رشد ارگانیک",
      "PPC Optimization": "بهینه‌سازی PPC",
      "Improved efficiency and ROAS": "افزایش کارایی و ROAS",
      "5x ROAS": "۵ برابر ROAS",
      "Social Growth": "رشد شبکه‌های اجتماعی",
      "Built an engaged audience": "ایجاد مخاطب درگیر",
      "50k in 6 months": "۵۰هزار در ۶ ماه",
      "Product Photography": "عکاسی محصول",
      "E-commerce visuals upgrade": "ارتقای تصاویر فروشگاهی",
      "65% higher CTR": "۶۵٪ CTR بیشتر",
      "Brand Video": "ویدئوی برند",
      "Story-driven promotional video": "ویدئوی تبلیغاتی داستان‌محور",
      "1M+ views": "بیش از ۱میلیون بازدید",
      "Event Coverage": "پوشش رویداد",
      "Conference coverage + edits": "پوشش کنفرانس + تدوین",
      "500+ deliverables": "بیش از ۵۰۰ خروجی",
      "Contract Review": "بازبینی قرارداد",
      "Reduced risk and clarified terms": "کاهش ریسک و شفاف‌سازی شروط",
      "$2M deal protected": "محافظت از قرارداد ۲میلیون دلاری",
      "Compliance Audit": "ممیزی انطباق",
      "Ensured regulatory alignment": "اطمینان از انطباق مقرراتی",
      "Zero issues": "بدون مشکل",
      "Dispute Resolution": "حل اختلاف",
      "Resolved business conflict quickly": "حل سریع اختلاف تجاری",
      "30 days": "۳۰ روز",
      "Tax Strategy": "استراتژی مالیاتی",
      "Optimized tax position": "بهینه‌سازی وضعیت مالیاتی",
      "$50k saved": "۵۰هزار دلار صرفه‌جویی",
      "Financial Cleanup": "پاک‌سازی مالی",
      "Organized 3 years of records": "سازماندهی ۳ سال سوابق",
      "Audit-ready in 2 weeks": "آماده حسابرسی در ۲ هفته",
      "CFO Support": "پشتیبانی CFO",
      "Part-time CFO for startup": "مدیر مالی پاره‌وقت برای استارتاپ",
      "$2M funding secured": "۲میلیون دلار جذب سرمایه",
    },
    ar: {
      "Custom Services": "خدمات مخصصة",
      "Custom Engagement": "تعاون مخصص",
      "Tailored scope aligned to your exact goals and requirements":
        "نطاق مخصص وفق أهدافك ومتطلباتك بدقة",
      "Specialized Support": "دعم متخصص",
      "Expert help for unique or niche needs": "مساعدة خبيرة لاحتياجات فريدة أو متخصصة",
      "Discovery and audit": "اكتشاف وتدقيق",
      "Custom roadmap": "خارطة طريق مخصصة",
      "Hands-on execution": "تنفيذ عملي",
      "Ongoing optimization": "تحسين مستمر",
      "Flexible service design": "تصميم خدمة مرن",
      "Dedicated ownership": "مسؤولية واضحة",
      "Milestone-based delivery": "تسليم حسب المراحل",
      "Clear reporting": "تقارير واضحة",
      "Specialized Solution": "حل متخصص",
      "Built a niche-specific workflow": "بناء سير عمل متخصص",
      "Premium Support": "دعم فاخر",
      "Ongoing optimization and reporting": "تحسين مستمر وتقارير",
      "90‑day delivery": "تسليم خلال 90 يومًا",
      "40% faster execution": "تنفيذ أسرع بنسبة 40%",
      "3x ROI": "عائد 3x",
      "Business Strategy": "استراتيجية الأعمال",
      "Process Improvement": "تحسين العمليات",
      "1:1 Coaching": "إرشاد فردي",
      "Group Programs": "برامج جماعية",
      "Brand Identity": "هوية العلامة",
      "Digital Design": "تصميم رقمي",
      "Website Development": "تطوير المواقع",
      "Web Applications": "تطبيقات الويب",
      "Digital Marketing": "التسويق الرقمي",
      "Content Strategy": "استراتيجية المحتوى",
      "Photography": "تصوير",
      "Video Production": "إنتاج فيديو",
      "Legal Consulting": "استشارات قانونية",
      "Document Services": "خدمات الوثائق",
      "Bookkeeping": "مسك الدفاتر",
      "Tax Services": "خدمات ضريبية",
      "Comprehensive strategic planning to drive growth and efficiency":
        "تخطيط استراتيجي شامل لدفع النمو والكفاءة",
      "Streamline operations and maximize productivity":
        "تبسيط العمليات وتعظيم الإنتاجية",
      "Personalized coaching sessions tailored to your goals":
        "جلسات إرشاد مخصصة وفق أهدافك",
      "Collaborative learning with like-minded professionals":
        "تعلم تعاوني مع محترفين متشابهين في التوجه",
      "Create a memorable brand that stands out":
        "إنشاء علامة مميزة ولافتة",
      "Modern, user-focused digital experiences":
        "تجارب رقمية حديثة متمحورة حول المستخدم",
      "High-performance websites built for growth":
        "مواقع عالية الأداء مصممة للنمو",
      "Scalable solutions for complex business needs":
        "حلول قابلة للتوسع لاحتياجات معقدة",
      "Drive traffic and conversions with data-driven campaigns":
        "زيادة الزيارات والتحويلات بحملات مبنية على البيانات",
      "Content that connects and converts":
        "محتوى يربط ويحوّل",
      "Professional visuals for your brand":
        "مرئيات احترافية لعلامتك",
      "Compelling video content that tells your story":
        "محتوى فيديو جذاب يروي قصتك",
      "Practical legal guidance for your business":
        "إرشاد قانوني عملي لأعمالك",
      "Professional legal documentation":
        "توثيق قانوني احترافي",
      "Accurate financial records you can trust":
        "سجلات مالية دقيقة موثوقة",
      "Maximize deductions and stay compliant":
        "تعظيم الخصومات والالتزام بالقوانين",
      "Market analysis and competitive positioning":
        "تحليل السوق والتموضع التنافسي",
      "Growth strategy development": "تطوير استراتيجية النمو",
      "Operational optimization": "تحسين التشغيل",
      "Performance metrics and KPIs": "مؤشرات الأداء الرئيسية",
      "Workflow analysis and optimization": "تحليل وتحسين سير العمل",
      "Systems implementation": "تنفيذ الأنظمة",
      "Change management support": "دعم إدارة التغيير",
      "Ongoing performance monitoring": "مراقبة الأداء المستمرة",
      "Goal setting and planning": "تحديد الأهداف والتخطيط",
      "Weekly accountability": "متابعة أسبوعية",
      "Custom action plans": "خطط عمل مخصصة",
      "Email support": "دعم عبر البريد",
      "Live group sessions": "جلسات جماعية مباشرة",
      "Peer networking": "شبكات الأقران",
      "Resource library": "مكتبة موارد",
      "Community support": "دعم المجتمع",
      "Logo + brand system": "الشعار ونظام العلامة",
      "Typography + colors": "الطباعة والألوان",
      "Brand positioning": "تموضع العلامة",
      "Marketing assets": "أصول تسويقية",
      "Web/app UI": "واجهة ويب/تطبيق",
      "UX optimization": "تحسين تجربة المستخدم",
      "Responsive design": "تصميم متجاوب",
      "Prototyping": "نمذجة أولية",
      "Mobile-first": "أولوية للجوال",
      "SEO-ready": "جاهز للسيو",
      "Analytics integration": "تكامل التحليلات",
      "CMS options": "خيارات نظام إدارة المحتوى",
      "Custom features": "ميزات مخصصة",
      "Database + API": "قاعدة بيانات وواجهة API",
      "Auth + roles": "مصادقة وأدوار",
      "Maintenance": "صيانة",
      "SEO strategy": "استراتيجية سيو",
      "PPC management": "إدارة PPC",
      "Social growth": "نمو اجتماعي",
      "Email funnels": "قنوات البريد",
      "Messaging": "الرسائل",
      "Editorial calendar": "تقويم تحريري",
      "Creative direction": "إدارة إبداعية",
      "Performance analytics": "تحليلات الأداء",
      "Product shoots": "تصوير المنتجات",
      "Headshots": "صور شخصية",
      "Event coverage": "تغطية الفعاليات",
      "Retouching": "تنقيح",
      "Promo videos": "فيديوهات ترويجية",
      "Social clips": "مقاطع اجتماعية",
      "Editing": "مونتاج",
      "Distribution-ready exports": "تصدير جاهز للنشر",
      "Contracts": "العقود",
      "Compliance": "الامتثال",
      "Risk review": "مراجعة المخاطر",
      "Ongoing support": "دعم مستمر",
      "Terms & conditions": "الشروط والأحكام",
      "Privacy policy": "سياسة الخصوصية",
      "Agreements": "الاتفاقيات",
      "Employment docs": "وثائق التوظيف",
      "Monthly reconciliation": "تسوية شهرية",
      "Reporting": "تقارير",
      "Expense tracking": "تتبع المصروفات",
      "Payroll support": "دعم الرواتب",
      "Tax preparation": "إعداد الضرائب",
      "Tax planning": "تخطيط ضريبي",
      "Audit support": "دعم التدقيق",
      "Year-round advice": "استشارات سنوية",
      "Manufacturing Optimization": "تحسين التصنيع",
      "Streamlined operations for a mid-size manufacturer":
        "تبسيط العمليات لمصنع متوسط",
      "35% efficiency increase": "زيادة كفاءة 35%",
      "Growth Strategy": "استراتيجية نمو",
      "Strategic planning for tech startup expansion":
        "تخطيط استراتيجي لتوسع شركة تقنية ناشئة",
      "3x revenue growth": "نمو الإيرادات 3 أضعاف",
      "Change Management": "إدارة التغيير",
      "Successful organizational transformation": "تحول تنظيمي ناجح",
      "90% adoption rate": "نسبة اعتماد 90%",
      "Career Transition": "انتقال وظيفي",
      "Guided professional to a better role": "توجيه مهني لدور أفضل",
      "40% salary increase": "زيادة راتب 40%",
      "Leadership Growth": "نمو القيادة",
      "Improved executive communication and clarity": "تحسين التواصل التنفيذي",
      "Promoted in 8 months": "ترقية خلال 8 أشهر",
      "Team Performance": "أداء الفريق",
      "Boosted team delivery and accountability": "رفع الإنجاز والمسؤولية",
      "60% performance lift": "تحسن الأداء 60%",
      "Brand Refresh": "تجديد العلامة",
      "Rebrand for a growing SaaS company": "إعادة بناء علامة لشركة SaaS نامية",
      "200% recognition increase": "زيادة التعرف 200%",
      "E-commerce UX": "تجربة متجر إلكتروني",
      "Conversion-focused redesign": "إعادة تصميم تركز على التحويل",
      "45% conversion increase": "زيادة التحويل 45%",
      "Mobile App UI": "واجهة تطبيق جوال",
      "Fintech interface redesign": "إعادة تصميم واجهة تقنية مالية",
      "4.8 star rating": "تقييم 4.8 نجمة",
      "Custom Web Platform": "منصة ويب مخصصة",
      "Built scalable SaaS platform": "بناء منصة SaaS قابلة للتوسع",
      "10k+ active users": "أكثر من 10 آلاف مستخدم نشط",
      "E-commerce Site": "موقع تجارة إلكترونية",
      "Performance optimization for storefront": "تحسين أداء المتجر",
      "50% faster load": "تحميل أسرع 50%",
      "Business App": "تطبيق أعمال",
      "Internal tools for enterprise ops": "أدوات داخلية لعمليات المؤسسات",
      "70% time saved": "توفير وقت 70%",
      "SEO Campaign": "حملة سيو",
      "Ranked #1 for competitive keywords": "المرتبة الأولى لكلمات تنافسية",
      "300% organic growth": "نمو عضوي 300%",
      "PPC Optimization": "تحسين PPC",
      "Improved efficiency and ROAS": "تحسين الكفاءة والعائد",
      "5x ROAS": "عائد 5x",
      "Social Growth": "نمو اجتماعي",
      "Built an engaged audience": "بناء جمهور متفاعل",
      "50k in 6 months": "50 ألف خلال 6 أشهر",
      "Product Photography": "تصوير المنتجات",
      "E-commerce visuals upgrade": "ترقية الصور للمتجر",
      "65% higher CTR": "CTR أعلى 65%",
      "Brand Video": "فيديو العلامة",
      "Story-driven promotional video": "فيديو ترويجي قائم على القصة",
      "1M+ views": "أكثر من مليون مشاهدة",
      "Event Coverage": "تغطية الفعاليات",
      "Conference coverage + edits": "تغطية مؤتمر + مونتاج",
      "500+ deliverables": "أكثر من 500 تسليم",
      "Contract Review": "مراجعة العقود",
      "Reduced risk and clarified terms": "تقليل المخاطر وتوضيح الشروط",
      "$2M deal protected": "حماية صفقة 2 مليون",
      "Compliance Audit": "تدقيق الامتثال",
      "Ensured regulatory alignment": "ضمان التوافق التنظيمي",
      "Zero issues": "صفر مشاكل",
      "Dispute Resolution": "حل النزاعات",
      "Resolved business conflict quickly": "حل نزاع بسرعة",
      "30 days": "30 يومًا",
      "Tax Strategy": "استراتيجية ضريبية",
      "Optimized tax position": "تحسين الوضع الضريبي",
      "$50k saved": "توفير 50 ألف",
      "Financial Cleanup": "تنظيف مالي",
      "Organized 3 years of records": "تنظيم سجلات 3 سنوات",
      "Audit-ready in 2 weeks": "جاهز للتدقيق خلال أسبوعين",
      "CFO Support": "دعم المدير المالي",
      "Part-time CFO for startup": "مدير مالي جزئي للشركات الناشئة",
      "$2M funding secured": "تأمين تمويل 2 مليون",
    },
    fi: {
      "Custom Services": "Räätälöidyt palvelut",
      "Custom Engagement": "Räätälöity yhteistyö",
      "Tailored scope aligned to your exact goals and requirements":
        "Räätälöity laajuus tavoitteidesi ja tarpeidesi mukaan",
      "Specialized Support": "Erikoistunut tuki",
      "Expert help for unique or niche needs": "Asiantuntija-apu erityistarpeisiin",
      "Discovery and audit": "Kartoitus ja auditointi",
      "Custom roadmap": "Räätälöity tiekartta",
      "Hands-on execution": "Käytännön toteutus",
      "Ongoing optimization": "Jatkuva optimointi",
      "Flexible service design": "Joustava palvelumuotoilu",
      "Dedicated ownership": "Selkeä omistajuus",
      "Milestone-based delivery": "Välitavoitteisiin perustuva toimitus",
      "Clear reporting": "Selkeä raportointi",
      "Specialized Solution": "Erikoistunut ratkaisu",
      "Built a niche-specific workflow": "Rakennettu niche-työnkulku",
      "Premium Support": "Premium-tuki",
      "Ongoing optimization and reporting": "Jatkuva optimointi ja raportointi",
      "90‑day delivery": "90 päivän toimitus",
      "40% faster execution": "40% nopeampi toteutus",
      "3x ROI": "3x ROI",
      "Business Strategy": "Liiketoimintastrategia",
      "Process Improvement": "Prosessien parantaminen",
      "1:1 Coaching": "1:1‑valmennus",
      "Group Programs": "Ryhmäohjelmat",
      "Brand Identity": "Brändi‑identiteetti",
      "Digital Design": "Digitaalinen suunnittelu",
      "Website Development": "Verkkosivujen kehitys",
      "Web Applications": "Web‑sovellukset",
      "Digital Marketing": "Digimarkkinointi",
      "Content Strategy": "Sisältöstrategia",
      "Photography": "Valokuvaus",
      "Video Production": "Videotuotanto",
      "Legal Consulting": "Lakikonsultointi",
      "Document Services": "Dokumenttipalvelut",
      "Bookkeeping": "Kirjanpito",
      "Tax Services": "Vero­palvelut",
      "Comprehensive strategic planning to drive growth and efficiency":
        "Kattava strateginen suunnittelu kasvun ja tehokkuuden tueksi",
      "Streamline operations and maximize productivity":
        "Prosessien sujuvoittaminen ja tuottavuuden maksimointi",
      "Personalized coaching sessions tailored to your goals":
        "Tavoitteisiisi räätälöidyt valmennukset",
      "Collaborative learning with like-minded professionals":
        "Yhteisöllinen oppiminen samanhenkisten kanssa",
      "Create a memorable brand that stands out":
        "Luo erottuva ja muistettava brändi",
      "Modern, user-focused digital experiences":
        "Modernit ja käyttäjälähtöiset digikokemukset",
      "High-performance websites built for growth":
        "Kasvuun suunnitellut suorituskykyiset sivut",
      "Scalable solutions for complex business needs":
        "Skaalautuvat ratkaisut monimutkaisiin tarpeisiin",
      "Drive traffic and conversions with data-driven campaigns":
        "Lisää liikennettä ja konversioita dataohjatuilla kampanjoilla",
      "Content that connects and converts":
        "Sisältö, joka sitouttaa ja konvertoi",
      "Professional visuals for your brand":
        "Ammattimaiset visuaalit brändillesi",
      "Compelling video content that tells your story":
        "Vakuuttavaa videota tarinasi kertomiseen",
      "Practical legal guidance for your business":
        "Käytännön lakiohjeet yrityksellesi",
      "Professional legal documentation":
        "Ammattimainen oikeudellinen dokumentaatio",
      "Accurate financial records you can trust":
        "Luotettavat ja tarkat talouskirjaukset",
      "Maximize deductions and stay compliant":
        "Maksimoi vähennykset ja pysy vaatimustenmukaisena",
      "Market analysis and competitive positioning":
        "Markkina‑analyysi ja kilpailuasemointi",
      "Growth strategy development": "Kasvustrategian kehitys",
      "Operational optimization": "Operatiivinen optimointi",
      "Performance metrics and KPIs": "Suorituskykymittarit ja KPI:t",
      "Workflow analysis and optimization": "Työnkulun analyysi ja optimointi",
      "Systems implementation": "Järjestelmäimplementointi",
      "Change management support": "Muutoksenhallinnan tuki",
      "Ongoing performance monitoring": "Jatkuva suorituskyvyn seuranta",
      "Goal setting and planning": "Tavoitteiden asettaminen ja suunnittelu",
      "Weekly accountability": "Viikoittainen seuranta",
      "Custom action plans": "Räätälöidyt toimenpidesuunnitelmat",
      "Email support": "Sähköpostituki",
      "Live group sessions": "Live‑ryhmäsessiot",
      "Peer networking": "Verkostoituminen",
      "Resource library": "Resurssikirjasto",
      "Community support": "Yhteisön tuki",
      "Logo + brand system": "Logo ja brändijärjestelmä",
      "Typography + colors": "Typografia ja värit",
      "Brand positioning": "Brändin positiointi",
      "Marketing assets": "Markkinointimateriaalit",
      "Web/app UI": "Web-/sovellus‑UI",
      "UX optimization": "UX‑optimointi",
      "Responsive design": "Responsiivinen design",
      "Prototyping": "Prototypointi",
      "Mobile-first": "Mobile‑first",
      "SEO-ready": "SEO‑valmis",
      "Analytics integration": "Analytiikan integrointi",
      "CMS options": "CMS‑vaihtoehdot",
      "Custom features": "Räätälöidyt ominaisuudet",
      "Database + API": "Tietokanta ja API",
      "Auth + roles": "Autentikointi ja roolit",
      "Maintenance": "Ylläpito",
      "SEO strategy": "SEO‑strategia",
      "PPC management": "PPC‑hallinta",
      "Social growth": "Sosiaalisen median kasvu",
      "Email funnels": "Sähköpostifunnelit",
      "Messaging": "Viestintä",
      "Editorial calendar": "Sisältökalenteri",
      "Creative direction": "Luova ohjaus",
      "Performance analytics": "Suorituskykyanalytiikka",
      "Product shoots": "Tuotekuvaukset",
      "Headshots": "Henkilökuvat",
      "Event coverage": "Tapahtumakuvaus",
      "Retouching": "Kuvankäsittely",
      "Promo videos": "Promo‑videot",
      "Social clips": "Some‑klipit",
      "Editing": "Editointi",
      "Distribution-ready exports": "Julkaisuvalmiit exportit",
      "Contracts": "Sopimukset",
      "Compliance": "Vaatimustenmukaisuus",
      "Risk review": "Riskien arviointi",
      "Ongoing support": "Jatkuva tuki",
      "Terms & conditions": "Käyttöehdot",
      "Privacy policy": "Tietosuojakäytäntö",
      "Agreements": "Sopimukset",
      "Employment docs": "Työsuhdeasiakirjat",
      "Monthly reconciliation": "Kuukausitäsmäytys",
      "Reporting": "Raportointi",
      "Expense tracking": "Kuluseuranta",
      "Payroll support": "Palkkahallinnon tuki",
      "Tax preparation": "Veroilmoitus",
      "Tax planning": "Verosuunnittelu",
      "Audit support": "Tilintarkastuksen tuki",
      "Year-round advice": "Neuvonta ympäri vuoden",
      "Manufacturing Optimization": "Tuotannon optimointi",
      "Streamlined operations for a mid-size manufacturer":
        "Toimintojen sujuvoittaminen keskikokoiselle valmistajalle",
      "35% efficiency increase": "35% tehokkuuden kasvu",
      "Growth Strategy": "Kasvustrategia",
      "Strategic planning for tech startup expansion":
        "Strateginen suunnittelu tech‑startupin laajentumiseen",
      "3x revenue growth": "3x liikevaihdon kasvu",
      "Change Management": "Muutoksenhallinta",
      "Successful organizational transformation": "Onnistunut organisaatiomuutos",
      "90% adoption rate": "90% käyttöönottoprosentti",
      "Career Transition": "Urasuunnan muutos",
      "Guided professional to a better role": "Ohjattu parempaan rooliin",
      "40% salary increase": "40% palkankorotus",
      "Leadership Growth": "Johtajuuden kasvu",
      "Improved executive communication and clarity": "Johtoviestinnän parantaminen",
      "Promoted in 8 months": "Ylennys 8 kuukaudessa",
      "Team Performance": "Tiimin suorituskyky",
      "Boosted team delivery and accountability": "Tiimin toimituskyvyn parannus",
      "60% performance lift": "60% suorituskyvyn nousu",
      "Brand Refresh": "Brändin uudistus",
      "Rebrand for a growing SaaS company": "Uudelleenbrändäys kasvavalle SaaS‑yritykselle",
      "200% recognition increase": "200% tunnettuuden kasvu",
      "E-commerce UX": "Verkkokaupan UX",
      "Conversion-focused redesign": "Konversiokeskeinen uudistus",
      "45% conversion increase": "45% konversiokasvu",
      "Mobile App UI": "Mobiilisovelluksen UI",
      "Fintech interface redesign": "Fintech‑käyttöliittymän uudistus",
      "4.8 star rating": "4,8 tähden arvio",
      "Custom Web Platform": "Räätälöity web‑alusta",
      "Built scalable SaaS platform": "Rakennettu skaalautuva SaaS‑alusta",
      "10k+ active users": "10k+ aktiivista käyttäjää",
      "E-commerce Site": "Verkkokauppasivusto",
      "Performance optimization for storefront": "Kaupan suorituskyvyn optimointi",
      "50% faster load": "50% nopeampi lataus",
      "Business App": "Liiketoimintasovellus",
      "Internal tools for enterprise ops": "Sisäiset työkalut yritysprosesseihin",
      "70% time saved": "70% ajansäästö",
      "SEO Campaign": "SEO‑kampanja",
      "Ranked #1 for competitive keywords": "Sijoitus #1 kilpailuissa avainsanoissa",
      "300% organic growth": "300% orgaaninen kasvu",
      "PPC Optimization": "PPC‑optimointi",
      "Improved efficiency and ROAS": "Parempi tehokkuus ja ROAS",
      "5x ROAS": "5x ROAS",
      "Social Growth": "Sosiaalinen kasvu",
      "Built an engaged audience": "Rakennettu sitoutunut yleisö",
      "50k in 6 months": "50k kuudessa kuukaudessa",
      "Product Photography": "Tuotekuvaus",
      "E-commerce visuals upgrade": "Verkkokaupan visuaalien päivitys",
      "65% higher CTR": "65% korkeampi CTR",
      "Brand Video": "Brändivideo",
      "Story-driven promotional video": "Tarinalähtöinen promovideo",
      "1M+ views": "Yli 1M katselua",
      "Event Coverage": "Tapahtumakuvaus",
      "Conference coverage + edits": "Konferenssikuvaus + editointi",
      "500+ deliverables": "500+ toimitusta",
      "Contract Review": "Sopimusten tarkistus",
      "Reduced risk and clarified terms": "Riskin pienennys ja ehtojen selkeytys",
      "$2M deal protected": "2M diilin suojaus",
      "Compliance Audit": "Compliance‑audit",
      "Ensured regulatory alignment": "Varmistettu sääntelyn noudattaminen",
      "Zero issues": "Ei ongelmia",
      "Dispute Resolution": "Riitojen ratkaisu",
      "Resolved business conflict quickly": "Konflikti ratkaistu nopeasti",
      "30 days": "30 päivää",
      "Tax Strategy": "Vero­strategia",
      "Optimized tax position": "Verotuksen optimointi",
      "$50k saved": "50k säästö",
      "Financial Cleanup": "Taloussiivous",
      "Organized 3 years of records": "3 vuoden kirjanpito järjestetty",
      "Audit-ready in 2 weeks": "Audit‑valmis 2 viikossa",
      "CFO Support": "CFO‑tuki",
      "Part-time CFO for startup": "Osa‑aikainen CFO startupille",
      "$2M funding secured": "2M rahoitus varmistettu",
    },
  };

  return map[lang]?.[text] ?? text;
}

function serviceOfferings(serviceType: QuestionnaireAnswers["serviceType"], lang: Lang) {
  const base = {
    consulting: [
      {
        name: "Business Strategy",
        description:
          "Comprehensive strategic planning to drive growth and efficiency",
        features: [
          "Market analysis and competitive positioning",
          "Growth strategy development",
          "Operational optimization",
          "Performance metrics and KPIs",
        ],
        icon: "target",
      },
      {
        name: "Process Improvement",
        description: "Streamline operations and maximize productivity",
        features: [
          "Workflow analysis and optimization",
          "Systems implementation",
          "Change management support",
          "Ongoing performance monitoring",
        ],
        icon: "trending",
      },
    ],
    coaching: [
      {
        name: "1:1 Coaching",
        description: "Personalized coaching sessions tailored to your goals",
        features: [
          "Goal setting and planning",
          "Weekly accountability",
          "Custom action plans",
          "Email support",
        ],
        icon: "users",
      },
      {
        name: "Group Programs",
        description: "Collaborative learning with like-minded professionals",
        features: [
          "Live group sessions",
          "Peer networking",
          "Resource library",
          "Community support",
        ],
        icon: "sparkles",
      },
    ],
    design: [
      {
        name: "Brand Identity",
        description: "Create a memorable brand that stands out",
        features: [
          "Logo + brand system",
          "Typography + colors",
          "Brand positioning",
          "Marketing assets",
        ],
        icon: "sparkles",
      },
      {
        name: "Digital Design",
        description: "Modern, user-focused digital experiences",
        features: [
          "Web/app UI",
          "UX optimization",
          "Responsive design",
          "Prototyping",
        ],
        icon: "target",
      },
    ],
    development: [
      {
        name: "Website Development",
        description: "High-performance websites built for growth",
        features: ["Mobile-first", "SEO-ready", "Analytics integration", "CMS options"],
        icon: "zap",
      },
      {
        name: "Web Applications",
        description: "Scalable solutions for complex business needs",
        features: ["Custom features", "Database + API", "Auth + roles", "Maintenance"],
        icon: "target",
      },
    ],
    marketing: [
      {
        name: "Digital Marketing",
        description: "Drive traffic and conversions with data-driven campaigns",
        features: ["SEO strategy", "PPC management", "Social growth", "Email funnels"],
        icon: "trending",
      },
      {
        name: "Content Strategy",
        description: "Content that connects and converts",
        features: ["Messaging", "Editorial calendar", "Creative direction", "Performance analytics"],
        icon: "sparkles",
      },
    ],
    creative: [
      {
        name: "Photography",
        description: "Professional visuals for your brand",
        features: ["Product shoots", "Headshots", "Event coverage", "Retouching"],
        icon: "sparkles",
      },
      {
        name: "Video Production",
        description: "Compelling video content that tells your story",
        features: ["Promo videos", "Social clips", "Editing", "Distribution-ready exports"],
        icon: "zap",
      },
    ],
    legal: [
      {
        name: "Legal Consulting",
        description: "Practical legal guidance for your business",
        features: ["Contracts", "Compliance", "Risk review", "Ongoing support"],
        icon: "shield",
      },
      {
        name: "Document Services",
        description: "Professional legal documentation",
        features: ["Terms & conditions", "Privacy policy", "Agreements", "Employment docs"],
        icon: "award",
      },
    ],
    accounting: [
      {
        name: "Bookkeeping",
        description: "Accurate financial records you can trust",
        features: ["Monthly reconciliation", "Reporting", "Expense tracking", "Payroll support"],
        icon: "trending",
      },
      {
        name: "Tax Services",
        description: "Maximize deductions and stay compliant",
        features: ["Tax preparation", "Tax planning", "Audit support", "Year-round advice"],
        icon: "target",
      },
    ],
    other: [
      {
        name: "Custom Engagement",
        description: "Tailored scope aligned to your exact goals and requirements",
        features: [
          "Discovery and audit",
          "Custom roadmap",
          "Hands-on execution",
          "Ongoing optimization",
        ],
        icon: "sparkles",
      },
      {
        name: "Specialized Support",
        description: "Expert help for unique or niche needs",
        features: [
          "Flexible service design",
          "Dedicated ownership",
          "Milestone-based delivery",
          "Clear reporting",
        ],
        icon: "target",
      },
    ],
  } as const;

  const list = ((base as any)[serviceType] ?? base.consulting) as Array<{
    name: string;
    description: string;
    features: string[];
    icon: string;
  }>;

  if (lang === "en") return list;
  return list.map((item) => ({
    ...item,
    name: translateText(lang, item.name),
    description: translateText(lang, item.description),
    features: item.features.map((f) => translateText(lang, f)),
  }));
}

function portfolioByService(serviceType: QuestionnaireAnswers["serviceType"], lang: Lang) {
  const base = {
    consulting: [
      {
        title: "Manufacturing Optimization",
        description: "Streamlined operations for a mid-size manufacturer",
        metric: "35% efficiency increase",
      },
      {
        title: "Growth Strategy",
        description: "Strategic planning for tech startup expansion",
        metric: "3x revenue growth",
      },
      {
        title: "Change Management",
        description: "Successful organizational transformation",
        metric: "90% adoption rate",
      },
    ],
    coaching: [
      { title: "Career Transition", description: "Guided professional to a better role", metric: "40% salary increase" },
      { title: "Leadership Growth", description: "Improved executive communication and clarity", metric: "Promoted in 8 months" },
      { title: "Team Performance", description: "Boosted team delivery and accountability", metric: "60% performance lift" },
    ],
    design: [
      { title: "Brand Refresh", description: "Rebrand for a growing SaaS company", metric: "200% recognition increase" },
      { title: "E-commerce UX", description: "Conversion-focused redesign", metric: "45% conversion increase" },
      { title: "Mobile App UI", description: "Fintech interface redesign", metric: "4.8 star rating" },
    ],
    development: [
      { title: "Custom Web Platform", description: "Built scalable SaaS platform", metric: "10k+ active users" },
      { title: "E-commerce Site", description: "Performance optimization for storefront", metric: "50% faster load" },
      { title: "Business App", description: "Internal tools for enterprise ops", metric: "70% time saved" },
    ],
    marketing: [
      { title: "SEO Campaign", description: "Ranked #1 for competitive keywords", metric: "300% organic growth" },
      { title: "PPC Optimization", description: "Improved efficiency and ROAS", metric: "5x ROAS" },
      { title: "Social Growth", description: "Built an engaged audience", metric: "50k in 6 months" },
    ],
    creative: [
      { title: "Product Photography", description: "E-commerce visuals upgrade", metric: "65% higher CTR" },
      { title: "Brand Video", description: "Story-driven promotional video", metric: "1M+ views" },
      { title: "Event Coverage", description: "Conference coverage + edits", metric: "500+ deliverables" },
    ],
    legal: [
      { title: "Contract Review", description: "Reduced risk and clarified terms", metric: "$2M deal protected" },
      { title: "Compliance Audit", description: "Ensured regulatory alignment", metric: "Zero issues" },
      { title: "Dispute Resolution", description: "Resolved business conflict quickly", metric: "30 days" },
    ],
    accounting: [
      { title: "Tax Strategy", description: "Optimized tax position", metric: "$50k saved" },
      { title: "Financial Cleanup", description: "Organized 3 years of records", metric: "Audit-ready in 2 weeks" },
      { title: "CFO Support", description: "Part-time CFO for startup", metric: "$2M funding secured" },
    ],
    other: [
      {
        title: "Custom Engagement",
        description: "Tailored scope aligned to unique goals",
        metric: "90‑day delivery",
      },
      {
        title: "Specialized Solution",
        description: "Built a niche-specific workflow",
        metric: "40% faster execution",
      },
      {
        title: "Premium Support",
        description: "Ongoing optimization and reporting",
        metric: "3x ROI",
      },
    ],
  } as const;

  const list = ((base as any)[serviceType] ?? base.consulting) as Array<{
    title: string;
    description: string;
    metric: string;
  }>;

  if (lang === "en") return list;
  return list.map((item) => ({
    ...item,
    title: translateText(lang, item.title),
    description: translateText(lang, item.description),
    metric: translateText(lang, item.metric),
  }));
}

function parseCustomServices(raw?: string, lang: Lang = "en") {
  const lines = (raw ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  return lines.map((line) => {
    const parts = line.split("|").map((p) => p.trim());
    const name = parts[0] || "Custom Service";
    const description =
      parts[1] ||
      translateText(
        lang,
        "Tailored service scoped to your exact needs and goals."
      );
    return {
      name: lang === "en" ? name : translateText(lang, name),
      description,
      features: [
        translateText(lang, "Tailored scope and deliverables"),
        translateText(lang, "Clear timeline and ownership"),
        translateText(lang, "Premium execution standards"),
      ],
      icon: "sparkles",
    };
  });
}

export function defaultPricing(lang: Lang = "en") {
  return {
    title: pickLang(lang, {
      en: "Choose Your Plan",
      fa: "پلن مناسب خود را انتخاب کنید",
      ar: "اختر خطتك",
      fi: "Valitse suunnitelmasi",
    }),
    subtitle: pickLang(lang, {
      en: "Select the perfect plan for your business needs",
      fa: "پلن مناسب نیازهای کسب‌وکار خود را انتخاب کنید",
      ar: "اختر الخطة الأنسب لاحتياجات عملك",
      fi: "Valitse tarpeisiisi sopiva paketti",
    }),
    plans: [
      {
        name: pickLang(lang, {
          en: "Starter",
          fa: "استارتر",
          ar: "الأساسي",
          fi: "Starter",
        }),
        price: 49,
        badge: null as string | null,
        desc: pickLang(lang, {
          en: "Perfect for getting started",
          fa: "ایده‌آل برای شروع",
          ar: "مثالي للانطلاق",
          fi: "Täydellinen aloitukseen",
        }),
        highlights: [
          pickLang(lang, {
            en: "1 landing page",
            fa: "۱ لندینگ پیج",
            ar: "صفحة هبوط واحدة",
            fi: "1 laskeutumissivu",
          }),
          pickLang(lang, {
            en: "Free subdomain (.donepage.co)",
            fa: "زیر دامنه رایگان (.donepage.co)",
            ar: "نطاق فرعي مجاني (.donepage.co)",
            fi: "Ilmainen aliverkkotunnus (.donepage.co)",
          }),
          pickLang(lang, {
            en: "Basic SEO optimization",
            fa: "بهینه‌سازی سئوی پایه",
            ar: "تحسين SEO أساسي",
            fi: "Perus SEO‑optimointi",
          }),
          pickLang(lang, {
            en: "SSL certificate included",
            fa: "گواهی SSL شامل",
            ar: "شهادة SSL متضمنة",
            fi: "SSL‑sertifikaatti mukana",
          }),
          pickLang(lang, {
            en: "Mobile responsive design",
            fa: "طراحی ریسپانسیو موبایل",
            ar: "تصميم متجاوب للجوال",
            fi: "Responsiivinen mobiilille",
          }),
          pickLang(lang, {
            en: "Email support",
            fa: "پشتیبانی ایمیلی",
            ar: "دعم عبر البريد",
            fi: "Sähköpostituki",
          }),
        ],
        cta: pickLang(lang, {
          en: "Get Started",
          fa: "شروع کنید",
          ar: "ابدأ الآن",
          fi: "Aloita",
        }),
        tone: "starter" as const,
      },
      {
        name: pickLang(lang, {
          en: "Business",
          fa: "بیزینس",
          ar: "الأعمال",
          fi: "Business",
        }),
        price: 149,
        badge: pickLang(lang, {
          en: "Most Popular",
          fa: "محبوب‌ترین",
          ar: "الأكثر شيوعًا",
          fi: "Suosituin",
        }),
        desc: pickLang(lang, {
          en: "For growing businesses",
          fa: "برای کسب‌وکارهای در حال رشد",
          ar: "للشركات النامية",
          fi: "Kasvaville yrityksille",
        }),
        highlights: [
          pickLang(lang, {
            en: "5 landing pages",
            fa: "۵ لندینگ پیج",
            ar: "5 صفحات هبوط",
            fi: "5 laskeutumissivua",
          }),
          pickLang(lang, {
            en: "Custom domain support",
            fa: "پشتیبانی دامنه اختصاصی",
            ar: "دعم نطاق مخصص",
            fi: "Oman domainin tuki",
          }),
          pickLang(lang, {
            en: "Advanced SEO tools",
            fa: "ابزارهای پیشرفته سئو",
            ar: "أدوات SEO متقدمة",
            fi: "Edistyneet SEO‑työkalut",
          }),
          pickLang(lang, {
            en: "Analytics dashboard",
            fa: "داشبورد تحلیل",
            ar: "لوحة تحليلات",
            fi: "Analytiikkapaneeli",
          }),
          pickLang(lang, {
            en: 'Remove "Powered by" branding',
            fa: 'حذف برندینگ "Powered by"',
            ar: 'إزالة شعار "Powered by"',
            fi: 'Poista "Powered by" ‑brändäys',
          }),
          pickLang(lang, {
            en: "Priority support",
            fa: "پشتیبانی اولویت‌دار",
            ar: "دعم أولوية",
            fi: "Prioriteettituki",
          }),
          pickLang(lang, {
            en: "A/B testing features",
            fa: "قابلیت تست A/B",
            ar: "ميزات اختبار A/B",
            fi: "A/B‑testaus",
          }),
        ],
        cta: pickLang(lang, {
          en: "Get Business",
          fa: "دریافت بیزینس",
          ar: "اشترك بالأعمال",
          fi: "Valitse Business",
        }),
        tone: "business" as const,
      },
      {
        name: pickLang(lang, {
          en: "Pro",
          fa: "پرو",
          ar: "برو",
          fi: "Pro",
        }),
        price: 399,
        badge: null,
        desc: pickLang(lang, {
          en: "For professionals & agencies",
          fa: "برای حرفه‌ای‌ها و آژانس‌ها",
          ar: "للمحترفين والوكالات",
          fi: "Ammattilaisille ja toimistoille",
        }),
        highlights: [
          pickLang(lang, {
            en: "Unlimited landing pages",
            fa: "لندینگ پیج نامحدود",
            ar: "صفحات هبوط غير محدودة",
            fi: "Rajattomasti laskeutumissivuja",
          }),
          pickLang(lang, {
            en: "Unlimited custom domains",
            fa: "دامنه اختصاصی نامحدود",
            ar: "نطاقات مخصصة غير محدودة",
            fi: "Rajattomasti omia domaineja",
          }),
          pickLang(lang, {
            en: "Premium SEO features",
            fa: "امکانات سئوی پریمیوم",
            ar: "ميزات SEO مميزة",
            fi: "Premium SEO‑ominaisuudet",
          }),
          pickLang(lang, {
            en: "Advanced analytics & reporting",
            fa: "تحلیل و گزارش‌گیری پیشرفته",
            ar: "تحليلات وتقارير متقدمة",
            fi: "Edistynyt analytiikka ja raportointi",
          }),
          pickLang(lang, {
            en: "White-label option",
            fa: "گزینه وایت‌لیبل",
            ar: "خيار العلامة البيضاء",
            fi: "White‑label‑vaihtoehto",
          }),
          pickLang(lang, {
            en: "24/7 priority support",
            fa: "پشتیبانی اولویت‌دار ۲۴/۷",
            ar: "دعم أولوية 24/7",
            fi: "24/7 prioriteettituki",
          }),
          pickLang(lang, {
            en: "Custom integrations",
            fa: "یکپارچه‌سازی‌های سفارشی",
            ar: "تكاملات مخصصة",
            fi: "Räätälöidyt integraatiot",
          }),
          pickLang(lang, {
            en: "API access",
            fa: "دسترسی API",
            ar: "الوصول إلى API",
            fi: "API‑pääsy",
          }),
        ],
        cta: pickLang(lang, {
          en: "Get Pro",
          fa: "دریافت پرو",
          ar: "اشترك برو",
          fi: "Valitse Pro",
        }),
        tone: "pro" as const,
      },
    ],
    footer: pickLang(lang, {
      en: "All plans include lifetime access. 30-day money-back guarantee.",
      fa: "تمام پلن‌ها شامل دسترسی مادام‌العمر هستند. ضمانت بازگشت ۳۰ روزه.",
      ar: "جميع الخطط تشمل وصولاً مدى الحياة. ضمان استرجاع 30 يومًا.",
      fi: "Kaikkiin paketteihin sisältyy elinikäinen käyttö. 30 päivän rahat takaisin.",
    }),
  };
}
