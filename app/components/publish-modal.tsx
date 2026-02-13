"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { CheckCircle, Globe, Zap, CreditCard, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import type { QuestionnaireAnswers } from "./questionnaire";
import { getLang, pickLang } from "@/app/components/content";

/* ---------------------------------------------
   Types
---------------------------------------------- */

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  answers: QuestionnaireAnswers;
  onOpenPricing?: () => void;
}

type AvailabilityState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available" }
  | { status: "taken" }
  | { status: "error"; message: string };

type DomainState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved" }
  | { status: "error"; message: string };

type DomainVerify = {
  status: "idle" | "checking" | "ready" | "pending" | "error";
  message?: string;
};

/* ---------------------------------------------
   Constants & helpers
---------------------------------------------- */

const RESERVED_SLUGS = new Set([
  "api",
  "pricing",
  "generator",
  "publish",
  "plan",
  "login",
  "logout",
  "signup",
  "auth",
  "account",
  "dashboard",
  "admin",
  "settings",
  "support",
  "help",
  "www",
  "app",
  "static",
  "assets",
  "favicon",
  "favicon.ico",
]);

function sanitizeSlug(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function makeSuggestedSlug(answers: QuestionnaireAnswers) {
  const base =
    answers.businessName?.trim() ||
    answers.primaryOffer?.trim() ||
    answers.serviceType ||
    "your-page";
  return sanitizeSlug(base) || "yourpage";
}

function validateSlug(slug: string) {
  if (!slug) return { ok: false, reason: "Slug is required" };
  if (slug.length < 3) return { ok: false, reason: "Minimum 3 characters" };
  if (slug.length > 50) return { ok: false, reason: "Maximum 50 characters" };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    return { ok: false, reason: "Only letters, numbers, and hyphens allowed" };
  if (RESERVED_SLUGS.has(slug))
    return { ok: false, reason: "This slug is reserved" };
  return { ok: true as const, reason: "" };
}

async function copyToClipboard(value: string, label = "Copied", errorLabel = "Copy failed") {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(label);
  } catch {
    toast.error(errorLabel);
  }
}

/* ---------------------------------------------
   Component
---------------------------------------------- */

export function PublishModal({ open, onClose, answers, onOpenPricing }: PublishModalProps) {
  const lang = getLang(answers);
  const t = <T,>(map: Record<"en" | "fa" | "ar" | "fi", T>) => pickLang(lang, map);
  const [slug, setSlug] = React.useState("yourpage");
  const [publishing, setPublishing] = React.useState(false);
  const [publishedUrl, setPublishedUrl] = React.useState<string | null>(null);

  // Secure edit flow (token returned by server in editUrl)
  const [editUrl, setEditUrl] = React.useState<string | null>(null);

  // Slug availability
  const [availability, setAvailability] = React.useState<AvailabilityState>({
    status: "idle",
  });

  // Domain setup
  const [domain, setDomain] = React.useState("");
  const [domainState, setDomainState] = React.useState<DomainState>({ status: "idle" });
  const [domainVerify, setDomainVerify] = React.useState<DomainVerify>({ status: "idle" });
  const [verifyEmail, setVerifyEmail] = React.useState("");
  const [verifyEmailStatus, setVerifyEmailStatus] = React.useState<DomainVerify>({ status: "idle" });

  // Reset state each open
  React.useEffect(() => {
    if (!open) return;
    setSlug(makeSuggestedSlug(answers));
    setPublishedUrl(null);
    setEditUrl(null);
    setAvailability({ status: "idle" });
    setDomain("");
    setDomainState({ status: "idle" });
    setDomainVerify({ status: "idle" });
    setVerifyEmail("");
    setVerifyEmailStatus({ status: "idle" });
  }, [open, answers]);

  const safeSlug = React.useMemo(() => sanitizeSlug(slug), [slug]);
  const validation = React.useMemo(() => validateSlug(safeSlug), [safeSlug]);
  const translatedValidationReason = React.useMemo(() => {
    const reason = validation.reason;
    return (
      {
        "Slug is required": t({
          en: "Slug is required",
          fa: "اسلاگ الزامی است",
          ar: "السلاج مطلوب",
          fi: "Slug on pakollinen",
        }),
        "Minimum 3 characters": t({
          en: "Minimum 3 characters",
          fa: "حداقل ۳ کاراکتر",
          ar: "الحد الأدنى 3 أحرف",
          fi: "Vähintään 3 merkkiä",
        }),
        "Maximum 50 characters": t({
          en: "Maximum 50 characters",
          fa: "حداکثر ۵۰ کاراکتر",
          ar: "الحد الأقصى 50 حرفًا",
          fi: "Enintään 50 merkkiä",
        }),
        "Only letters, numbers, and hyphens allowed": t({
          en: "Only letters, numbers, and hyphens allowed",
          fa: "فقط حروف، اعداد و خط تیره مجاز است",
          ar: "يُسمح بالأحرف والأرقام والشرطات فقط",
          fi: "Vain kirjaimet, numerot ja väliviivat",
        }),
        "This slug is reserved": t({
          en: "This slug is reserved",
          fa: "این اسلاگ رزرو شده است",
          ar: "هذا السلاج محجوز",
          fi: "Tämä slug on varattu",
        }),
      } as Record<string, string>
    )[reason] ?? reason;
  }, [t, validation.reason]);

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  const liveUrl = `${base.replace(/\/$/, "")}/${safeSlug || "yourpage"}`;
  const suggestedSubdomain = `https://${safeSlug || "yourpage"}.donepage.co`;

  // Debounced availability check (only when slug is valid)
  React.useEffect(() => {
    if (!open) return;

    if (!validation.ok) {
      setAvailability({ status: "idle" });
      return;
    }

    let cancelled = false;
    setAvailability({ status: "checking" });

    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/slug/check?slug=${encodeURIComponent(safeSlug)}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setAvailability({
            status: "error",
            message: data?.error ?? "Check failed",
          });
          return;
        }

        setAvailability(data?.available ? { status: "available" } : { status: "taken" });
      } catch (e: any) {
        if (cancelled) return;
        setAvailability({ status: "error", message: e?.message ?? "Check failed" });
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [open, safeSlug, validation.ok]);

  const canPublish =
    validation.ok &&
    availability.status === "available" &&
    !publishing;

  const ensurePaid = async () => {
    try {
      const pr = await fetch("/api/plan", { cache: "no-store" });
      const data = await pr.json();
      if (!data?.paid) {
        toast.message(
          t({
            en: "Choose a plan to publish",
            fa: "برای انتشار یک پلن انتخاب کنید",
            ar: "اختر خطة للنشر",
            fi: "Valitse paketti julkaisuun",
          })
        );
        onOpenPricing?.();
        return false;
      }
      return true;
    } catch {
      toast.error(
        t({
          en: "Could not verify plan status",
          fa: "وضعیت پلن قابل بررسی نیست",
          ar: "تعذّر التحقق من خطة الدفع",
          fi: "Suunnitelman tarkistus epäonnistui",
        })
      );
      return false;
    }
  };

  const ensureDomainPlan = async () => {
    try {
      const pr = await fetch("/api/plan", { cache: "no-store" });
      const data = await pr.json();
      if (data?.plan !== "business" && data?.plan !== "pro") {
        toast.message(
          t({
            en: "Custom domains require Business or Pro",
            fa: "دامنه اختصاصی نیاز به پلن Business یا Pro دارد",
            ar: "النطاقات المخصصة تتطلب Business أو Pro",
            fi: "Oma domain vaatii Business- tai Pro‑paketin",
          })
        );
        onOpenPricing?.();
        return false;
      }
      return true;
    } catch {
      toast.error(
        t({
          en: "Could not verify plan status",
          fa: "وضعیت پلن قابل بررسی نیست",
          ar: "تعذّر التحقق من خطة الدفع",
          fi: "Suunnitelman tarkistus epäonnistui",
        })
      );
      return false;
    }
  };

  const handlePublish = async () => {
    if (!validation.ok) {
      toast.error(validation.reason);
      return;
    }

    if (availability.status === "checking") {
      toast.message(
        t({
          en: "Checking slug availability…",
          fa: "در حال بررسی دسترسی اسلاگ…",
          ar: "جارٍ التحقق من توفر السلاج…",
          fi: "Tarkistetaan slugia…",
        })
      );
      return;
    }

    if (availability.status !== "available") {
      toast.error(
        availability.status === "taken"
          ? t({
              en: "Slug is already taken. Try another one.",
              fa: "این اسلاگ قبلاً گرفته شده. یکی دیگر انتخاب کنید.",
              ar: "السلاج مستخدم بالفعل. جرّب غيره.",
              fi: "Slug on varattu. Kokeile toista.",
            })
          : t({
              en: "Slug availability check failed.",
              fa: "بررسی در دسترس بودن اسلاگ ناموفق بود.",
              ar: "فشل التحقق من توفر السلاج.",
              fi: "Slug‑tarkistus epäonnistui.",
            })
      );
      return;
    }

    const paid = await ensurePaid();
    if (!paid) return;

    try {
      setPublishing(true);

      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: safeSlug, answers }),
      });

      const data = await res.json();

      if (res.status === 409 && data?.code === "SLUG_TAKEN") {
        setAvailability({ status: "taken" });
        toast.error(
          t({
            en: "This slug is already taken. Try another one.",
            fa: "این اسلاگ قبلاً گرفته شده. یکی دیگر انتخاب کنید.",
            ar: "هذا السلاج مستخدم بالفعل. جرّب غيره.",
            fi: "Slug on varattu. Kokeile toista.",
          })
        );
        return;
      }

      if (!res.ok)
        throw new Error(
          data?.error ??
            t({
              en: "Publish failed",
              fa: "انتشار ناموفق بود",
              ar: "فشل النشر",
              fi: "Julkaisu epäonnistui",
            })
        );

      setPublishedUrl(data.url);
      setEditUrl(data.editUrl ?? null);

      toast.success(
        t({
          en: "Published successfully. Your page is live.",
          fa: "انتشار با موفقیت انجام شد. صفحه شما آنلاین است.",
          ar: "تم النشر بنجاح. صفحتك الآن مباشرة.",
          fi: "Julkaistu onnistuneesti. Sivu on nyt live.",
        })
      );

      // Auto-provision subdomain for clients
      try {
        const autoDomain = `${safeSlug || "yourpage"}.donepage.co`;
        await fetch("/api/domains/assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: autoDomain, slug: safeSlug }),
        });
      } catch {
        // non-blocking: subdomain can be connected manually if needed
      }
    } catch (e: any) {
      toast.error(
        e?.message ??
          t({
            en: "Publish failed",
            fa: "انتشار ناموفق بود",
            ar: "فشل النشر",
            fi: "Julkaisu epäonnistui",
          })
      );
    } finally {
      setPublishing(false);
    }
  };

  const checkDomainStatus = async (domainValue: string) => {
    if (!domainValue) return;
    if (domainValue.endsWith(".donepage.co")) {
      setDomainVerify({
        status: "ready",
        message: t({
          en: "Subdomain active (Donepage DNS)",
          fa: "زیردامنه فعال است (DNS Donepage)",
          ar: "النطاق الفرعي نشط (DNS Donepage)",
          fi: "Alidomain aktiivinen (Donepage DNS)",
        }),
      });
      return;
    }
    setDomainVerify({ status: "checking" });
    try {
      const res = await fetch(
        `/api/domains/verify?domain=${encodeURIComponent(domainValue)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.error ??
            t({
              en: "Verify failed",
              fa: "تأیید ناموفق بود",
              ar: "فشل التحقق",
              fi: "Varmennus epäonnistui",
            })
        );

      if (!data?.mapped) {
        setDomainVerify({
          status: "pending",
          message: t({
            en: "Domain not connected yet.",
            fa: "دامنه هنوز متصل نشده است.",
            ar: "النطاق غير متصل بعد.",
            fi: "Domainia ei ole vielä yhdistetty.",
          }),
        });
        return;
      }

      if (data?.dns?.verified) {
        setDomainVerify({
          status: "ready",
          message: t({
            en: "DNS verified. Domain is live.",
            fa: "DNS تأیید شد. دامنه فعال است.",
            ar: "تم التحقق من DNS. النطاق نشط.",
            fi: "DNS varmistettu. Domain on live.",
          }),
        });
      } else {
        setDomainVerify({
          status: "pending",
          message: t({
            en: "DNS not verified yet.",
            fa: "DNS هنوز تأیید نشده است.",
            ar: "DNS لم يتم التحقق منه بعد.",
            fi: "DNS ei ole vielä varmistettu.",
          }),
        });
      }

      if (data?.verified) {
        setVerifyEmailStatus({
          status: "ready",
          message: t({
            en: "Ownership verified by email.",
            fa: "مالکیت از طریق ایمیل تأیید شد.",
            ar: "تم تأكيد الملكية عبر البريد.",
            fi: "Omistajuus vahvistettu sähköpostilla.",
          }),
        });
      }
    } catch (e: any) {
      setDomainVerify({
        status: "error",
        message:
          e?.message ??
          t({
            en: "Verify failed",
            fa: "تأیید ناموفق بود",
            ar: "فشل التحقق",
            fi: "Varmennus epäonnistui",
          }),
      });
    }
  };

  const assignDomain = async (domainValue: string) => {
    if (!domainValue) {
      toast.error(
        t({
          en: "Please enter a domain",
          fa: "لطفاً یک دامنه وارد کنید",
          ar: "يرجى إدخال نطاق",
          fi: "Syötä domain",
        })
      );
      return;
    }

    const paid = await ensurePaid();
    if (!paid) return;
    const isCustom = !domainValue.endsWith(".donepage.co");
    if (isCustom) {
      const ok = await ensureDomainPlan();
      if (!ok) return;
    }

    setDomainState({ status: "saving" });
    try {
      const res = await fetch("/api/domains/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainValue, slug: safeSlug }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.error ??
            t({
              en: "Domain setup failed",
              fa: "تنظیم دامنه ناموفق بود",
              ar: "فشل إعداد النطاق",
              fi: "Domainin määritys epäonnistui",
            })
        );
      setDomainState({ status: "saved" });
      toast.success(
        t({
          en: "Domain connected. Update DNS to finish setup.",
          fa: "دامنه متصل شد. برای تکمیل، DNS را به‌روزرسانی کنید.",
          ar: "تم ربط النطاق. حدّث DNS لإكمال الإعداد.",
          fi: "Domain yhdistetty. Päivitä DNS viimeistelläksesi.",
        })
      );
      checkDomainStatus(domainValue);
    } catch (e: any) {
      setDomainState({
        status: "error",
        message:
          e?.message ??
          t({
            en: "Domain setup failed",
            fa: "تنظیم دامنه ناموفق بود",
            ar: "فشل إعداد النطاق",
            fi: "Domainin määritys epäonnistui",
          }),
      });
    }
  };

  const requestEmailVerification = async (domainValue: string, emailValue: string) => {
    if (!domainValue) {
      toast.error(
        t({
          en: "Enter a domain first",
          fa: "ابتدا دامنه را وارد کنید",
          ar: "أدخل نطاقًا أولاً",
          fi: "Syötä domain ensin",
        })
      );
      return;
    }
    if (!emailValue) {
      toast.error(
        t({
          en: "Enter an email for verification",
          fa: "ایمیل برای تأیید را وارد کنید",
          ar: "أدخل بريدًا للتحقق",
          fi: "Syötä vahvistus‑sähköposti",
        })
      );
      return;
    }

    const paid = await ensurePaid();
    if (!paid) return;
    const isCustom = !domainValue.endsWith(".donepage.co");
    if (isCustom) {
      const ok = await ensureDomainPlan();
      if (!ok) return;
    }

    setVerifyEmailStatus({
      status: "checking",
      message: t({
        en: "Sending verification email…",
        fa: "در حال ارسال ایمیل تأیید…",
        ar: "جارٍ إرسال بريد التحقق…",
        fi: "Lähetetään vahvistusviestiä…",
      }),
    });
    try {
      const res = await fetch("/api/domains/request-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainValue, email: emailValue }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.error ??
            t({
              en: "Request failed",
              fa: "درخواست ناموفق بود",
              ar: "فشل الطلب",
              fi: "Pyyntö epäonnistui",
            })
        );
      setVerifyEmailStatus({
        status: "pending",
        message: t({
          en: "Verification email sent.",
          fa: "ایمیل تأیید ارسال شد.",
          ar: "تم إرسال بريد التحقق.",
          fi: "Vahvistusviesti lähetetty.",
        }),
      });
    } catch (e: any) {
      setVerifyEmailStatus({
        status: "error",
        message:
          e?.message ??
          t({
            en: "Request failed",
            fa: "درخواست ناموفق بود",
            ar: "فشل الطلب",
            fi: "Pyyntö epäonnistui",
          }),
      });
    }
  };

  const renderAvailabilityLine = () => {
    if (!validation.ok) return null;

    if (availability.status === "checking") {
      return (
        <div className="mt-2 text-xs text-gray-500">
          {t({
            en: "Checking availability…",
            fa: "در حال بررسی دسترسی…",
            ar: "جارٍ التحقق من التوفر…",
            fi: "Tarkistetaan saatavuutta…",
          })}
        </div>
      );
    }
    if (availability.status === "available") {
      return (
        <div className="mt-2 text-xs text-green-700">
          ✅{" "}
          {t({
            en: "Available",
            fa: "در دسترس",
            ar: "متاح",
            fi: "Saatavilla",
          })}
        </div>
      );
    }
    if (availability.status === "taken") {
      return (
        <div className="mt-2 text-xs text-red-600">
          ❌{" "}
          {t({
            en: "Taken",
            fa: "گرفته شده",
            ar: "محجوز",
            fi: "Varattu",
          })}
        </div>
      );
    }
    if (availability.status === "error") {
      return (
        <div className="mt-2 text-xs text-red-600">
          {t({
            en: "Availability check failed:",
            fa: "بررسی دسترسی ناموفق بود:",
            ar: "فشل التحقق من التوفر:",
            fi: "Saatavuuden tarkistus epäonnistui:",
          })}{" "}
          {availability.message}
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">
            {t({
              en: "Publish Your Landing Page",
              fa: "انتشار لندینگ پیج",
              ar: "نشر صفحة الهبوط",
              fi: "Julkaise laskeutumissivu",
            })}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {t({
              en: "Review your page, choose a plan, then publish.",
              fa: "صفحه را بررسی کنید، پلن را انتخاب کنید، سپس منتشر کنید.",
              ar: "راجع صفحتك، اختر خطة، ثم انشر.",
              fi: "Tarkista sivu, valitse paketti ja julkaise.",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Quick Publish */}
          <Card className="border-gray-200 transition-all hover:shadow-lg">
            <CardContent className="space-y-5 pt-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                <Zap className="h-6 w-6 text-white" />
              </div>

              <div>
                <div className="text-xl font-semibold text-gray-900">
                  {t({
                    en: "Publish to Donepage",
                    fa: "انتشار روی Donepage",
                    ar: "النشر على Donepage",
                    fi: "Julkaise Donepageen",
                  })}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {t({
                    en: "Choose your slug and publish after payment.",
                    fa: "اسلاگ را انتخاب کنید و بعد از پرداخت منتشر کنید.",
                    ar: "اختر السلاج وانشر بعد الدفع.",
                    fi: "Valitse slug ja julkaise maksun jälkeen.",
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="mb-2 text-sm text-gray-600">
                  {t({
                    en: "Choose your page slug",
                    fa: "اسلاگ صفحه را انتخاب کنید",
                    ar: "اختر سلاج الصفحة",
                    fi: "Valitse sivun slug",
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder={t({
                      en: "yourpage",
                      fa: "صفحه‌شما",
                      ar: "صفحتك",
                      fi: "sivusi",
                    })}
                    spellCheck={false}
                  />
                  <div className="whitespace-nowrap text-sm text-gray-700">
                    /{safeSlug || "yourpage"}
                  </div>
                </div>

                {!validation.ok ? (
                  <div className="mt-2 text-xs text-red-600">
                    {translatedValidationReason}
                  </div>
                ) : null}

                {renderAvailabilityLine()}

                <div className="mt-3 text-xs text-gray-500">
                  {t({
                    en: "Live URL:",
                    fa: "آدرس آنلاین:",
                    ar: "الرابط المباشر:",
                    fi: "Live‑osoite:",
                  })}
                  <div className="mt-1 font-medium text-gray-700 break-all">
                    {publishedUrl || liveUrl}
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-gray-400">
                  {t({
                    en: "Subdomain option:",
                    fa: "گزینه زیردامنه:",
                    ar: "خيار النطاق الفرعي:",
                    fi: "Alidomain‑vaihtoehto:",
                  })}{" "}
                  {suggestedSubdomain}
                </div>
              </div>

              {editUrl ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="text-xs text-gray-600">
                    {t({
                      en: "Private edit link (keep secure):",
                      fa: "لینک ویرایش خصوصی (محرمانه نگه دارید):",
                      ar: "رابط تعديل خاص (احتفظ به آمنًا):",
                      fi: "Yksityinen muokkauslinkki (pidä turvassa):",
                    })}
                  </div>
                  <div className="mt-1 break-all text-sm font-medium text-gray-800">
                    {editUrl}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() =>
                      copyToClipboard(
                        editUrl,
                        t({
                          en: "Edit link copied",
                          fa: "لینک ویرایش کپی شد",
                          ar: "تم نسخ رابط التعديل",
                          fi: "Muokkauslinkki kopioitu",
                        }),
                        t({
                          en: "Copy failed",
                          fa: "کپی ناموفق بود",
                          ar: "فشل النسخ",
                          fi: "Kopiointi epäonnistui",
                        })
                      )
                    }
                  >
                    {t({
                      en: "Copy Edit Link",
                      fa: "کپی لینک ویرایش",
                      ar: "نسخ رابط التعديل",
                      fi: "Kopioi muokkauslinkki",
                    })}
                  </Button>
                </div>
              ) : null}

              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  t({
                    en: "Instant live link (KV-backed)",
                    fa: "لینک فوری (KV-backed)",
                    ar: "رابط مباشر فوري (KV)",
                    fi: "Välitön live‑linkki (KV)",
                  }),
                  t({
                    en: "Secure private edit link (token-based)",
                    fa: "لینک ویرایش امن (توکنی)",
                    ar: "رابط تعديل آمن (token)",
                    fi: "Turvallinen muokkauslinkki (token)",
                  }),
                  t({
                    en: "Works with /slug routing",
                    fa: "کار با مسیر /slug",
                    ar: "يعمل مع /slug",
                    fi: "Toimii /slug‑polulla",
                  }),
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <Button
                  onClick={handlePublish}
                  disabled={!canPublish}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                >
                  {publishing
                    ? t({
                        en: "Publishing…",
                        fa: "در حال انتشار…",
                        ar: "جارٍ النشر…",
                        fi: "Julkaistaan…",
                      })
                    : t({
                        en: "Publish Now",
                        fa: "انتشار",
                        ar: "انشر الآن",
                        fi: "Julkaise",
                      })}
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(
                      publishedUrl || liveUrl,
                      t({
                        en: "URL copied",
                        fa: "لینک کپی شد",
                        ar: "تم نسخ الرابط",
                        fi: "Linkki kopioitu",
                      }),
                      t({
                        en: "Copy failed",
                        fa: "کپی ناموفق بود",
                        ar: "فشل النسخ",
                        fi: "Kopiointi epäonnistui",
                      })
                    )
                  }
                >
                  {t({
                    en: "Copy URL",
                    fa: "کپی لینک",
                    ar: "نسخ الرابط",
                    fi: "Kopioi linkki",
                  })}
                </Button>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs text-gray-600">
                <div className="font-semibold text-gray-900">
                  {t({
                    en: "Pricing",
                    fa: "قیمت‌گذاری",
                    ar: "الأسعار",
                    fi: "Hinnoittelu",
                  })}
                </div>
                <div className="mt-1">
                  {t({
                    en: "Choose a plan before publishing. You can review your page first.",
                    fa: "قبل از انتشار پلن را انتخاب کنید. اول می‌توانید صفحه را ببینید.",
                    ar: "اختر خطة قبل النشر. يمكنك مراجعة الصفحة أولاً.",
                    fi: "Valitse paketti ennen julkaisua. Voit katsoa sivun ensin.",
                  })}
                </div>
                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-600">
                  {t({
                    en: "This payment covers publishing on Donepage. Client service fees are billed separately.",
                    fa: "این پرداخت مربوط به انتشار در Donepage است. هزینه خدمات مشتری جداگانه است.",
                    ar: "هذا الدفع لتغطية النشر على Donepage. رسوم الخدمة منفصلة.",
                    fi: "Tämä maksu kattaa Donepage‑julkaisun. Palvelumaksut erikseen.",
                  })}
                </div>
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => onOpenPricing?.()}
                >
                  <CreditCard className="mr-2 h-4 w-4" />{" "}
                  {t({
                    en: "Choose Plan",
                    fa: "انتخاب پلن",
                    ar: "اختر الخطة",
                    fi: "Valitse paketti",
                  })}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Domain */}
          <Card className="border-gray-200 transition-all hover:shadow-lg">
            <CardContent className="space-y-5 pt-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                <Globe className="h-6 w-6 text-white" />
              </div>

              <div>
                <div className="text-xl font-semibold text-gray-900">
                  {t({
                    en: "Custom Domain",
                    fa: "دامنه اختصاصی",
                    ar: "نطاق مخصص",
                    fi: "Oma domain",
                  })}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {t({
                    en: "Connect your own domain or use a Donepage subdomain.",
                    fa: "دامنه خود را وصل کنید یا از زیردامنه Donepage استفاده کنید.",
                    ar: "اربط نطاقك أو استخدم نطاق Donepage الفرعي.",
                    fi: "Yhdistä oma domain tai käytä Donepage‑alidomainia.",
                  })}
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  t({
                    en: "Works with client domains",
                    fa: "سازگار با دامنه مشتری",
                    ar: "يعمل مع نطاقات العملاء",
                    fi: "Toimii asiakasdomainien kanssa",
                  }),
                  t({
                    en: "Full SEO control",
                    fa: "کنترل کامل سئو",
                    ar: "تحكم كامل في السيو",
                    fi: "Täysi SEO‑kontrolli",
                  }),
                  t({
                    en: "Automatic SSL",
                    fa: "SSL خودکار",
                    ar: "SSL تلقائي",
                    fi: "Automaattinen SSL",
                  }),
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-xs text-gray-500">
                  {t({
                    en: "Free subdomain",
                    fa: "زیردامنه رایگان",
                    ar: "نطاق فرعي مجاني",
                    fi: "Ilmainen alidomain",
                  })}
                </div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  {suggestedSubdomain}
                </div>
                <Button
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                  onClick={() => assignDomain(`${safeSlug || "yourpage"}.donepage.co`)}
                >
                  {t({
                    en: "Use This Subdomain",
                    fa: "استفاده از این زیردامنه",
                    ar: "استخدم هذا النطاق الفرعي",
                    fi: "Käytä tätä alidomainia",
                  })}
                </Button>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="text-sm font-semibold text-gray-900">
                  {t({
                    en: "Connect your own domain",
                    fa: "اتصال دامنه اختصاصی",
                    ar: "اربط نطاقك الخاص",
                    fi: "Yhdistä oma domain",
                  })}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder={t({
                      en: "client.com",
                      fa: "client.com",
                      ar: "client.com",
                      fi: "client.com",
                    })}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <Button
                  onClick={() => assignDomain(domain)}
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                  disabled={domainState.status === "saving"}
                >
                  {domainState.status === "saving"
                    ? t({
                        en: "Connecting…",
                        fa: "در حال اتصال…",
                        ar: "جارٍ الاتصال…",
                        fi: "Yhdistetään…",
                      })
                    : t({
                        en: "Connect Domain",
                        fa: "اتصال دامنه",
                        ar: "ربط النطاق",
                        fi: "Yhdistä domain",
                      })}
                </Button>

                {domainState.status === "saved" ? (
                  <div className="mt-2 text-xs text-green-700">
                    ✅{" "}
                    {t({
                      en: "Domain connected",
                      fa: "دامنه متصل شد",
                      ar: "تم ربط النطاق",
                      fi: "Domain yhdistetty",
                    })}
                  </div>
                ) : null}
                {domainState.status === "error" ? (
                  <div className="mt-2 text-xs text-red-600">
                    {domainState.message}
                  </div>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-xs text-gray-500">
                    {t({
                      en: "Check DNS status after you update records.",
                      fa: "پس از به‌روزرسانی DNS وضعیت را بررسی کنید.",
                      ar: "تحقق من DNS بعد تحديث السجلات.",
                      fi: "Tarkista DNS‑tila päivityksen jälkeen.",
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => checkDomainStatus(domain || `${safeSlug}.donepage.co`)}
                  >
                    <RefreshCcw className="mr-2 h-3 w-3" />{" "}
                    {t({
                      en: "Check status",
                      fa: "بررسی وضعیت",
                      ar: "تحقق من الحالة",
                      fi: "Tarkista tila",
                    })}
                  </Button>
                </div>

                {domainVerify.status === "ready" ? (
                  <div className="mt-2 text-xs text-green-700">✅ {domainVerify.message}</div>
                ) : null}
                {domainVerify.status === "pending" ? (
                  <div className="mt-2 text-xs text-amber-700">⏳ {domainVerify.message}</div>
                ) : null}
                {domainVerify.status === "error" ? (
                  <div className="mt-2 text-xs text-red-600">{domainVerify.message}</div>
                ) : null}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="text-sm font-semibold text-gray-900">
                  {t({
                    en: "Verify ownership (email)",
                    fa: "تأیید مالکیت (ایمیل)",
                    ar: "تحقق من الملكية (بريد)",
                    fi: "Vahvista omistajuus (sähköposti)",
                  })}
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {t({
                    en: "We’ll send a verification link to confirm you control the domain. It goes to admin@domain and your email.",
                    fa: "برای تأیید مالکیت، لینک تأیید ارسال می‌کنیم (به admin@domain و ایمیل شما).",
                    ar: "سنرسل رابط تحقق للتأكد من ملكيتك للنطاق (إلى admin@domain وبريدك).",
                    fi: "Lähetämme varmennuslinkin (admin@domain ja sähköpostisi).",
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={verifyEmail}
                    onChange={(e) => setVerifyEmail(e.target.value)}
                    placeholder={t({
                      en: "you@yourdomain.com",
                      fa: "you@yourdomain.com",
                      ar: "you@yourdomain.com",
                      fi: "you@yourdomain.com",
                    })}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() =>
                    requestEmailVerification(domain || `${safeSlug}.donepage.co`, verifyEmail)
                  }
                >
                  {t({
                    en: "Send verification email",
                    fa: "ارسال ایمیل تأیید",
                    ar: "إرسال بريد التحقق",
                    fi: "Lähetä varmennusviesti",
                  })}
                </Button>

                {verifyEmailStatus.status === "ready" ? (
                  <div className="mt-2 text-xs text-green-700">✅ {verifyEmailStatus.message}</div>
                ) : null}
                {verifyEmailStatus.status === "pending" ? (
                  <div className="mt-2 text-xs text-amber-700">⏳ {verifyEmailStatus.message}</div>
                ) : null}
                {verifyEmailStatus.status === "error" ? (
                  <div className="mt-2 text-xs text-red-600">{verifyEmailStatus.message}</div>
                ) : null}
              </div>

              <div className="text-xs text-gray-500">
                {t({
                  en: "After connecting, add a CNAME or A record at your DNS provider to point your domain to this Donepage project.",
                  fa: "بعد از اتصال، رکورد CNAME یا A را در DNS تنظیم کنید.",
                  ar: "بعد الربط، أضف سجل CNAME أو A لدى مزود DNS.",
                  fi: "Yhdistämisen jälkeen lisää CNAME- tai A‑tietue DNS‑palveluun.",
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          {t({
            en: "SEO-ready by default · Clean HTML · Fast load · Shareable instantly",
            fa: "سئوی آماده · HTML تمیز · سرعت بالا · اشتراک سریع",
            ar: "جاهزة للسيو · HTML نظيف · تحميل سريع · مشاركة فورية",
            fi: "SEO‑valmis · Siisti HTML · Nopea · Helppo jakaa",
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
