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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import { CheckCircle, Sparkles, Zap, Crown } from "lucide-react";
import { toast } from "sonner";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  lang?: "en" | "fa" | "ar" | "fi";
}

type Plan = "starter" | "business" | "pro";

export function PricingModal({ open, onClose, lang = "en" }: PricingModalProps) {
  const t = <T,>(map: Record<"en" | "fa" | "ar" | "fi", T>) =>
    map[lang] ?? map.en;
  const handleSelect = async (plan: Plan) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.error ??
            t({
              en: "Checkout failed",
              fa: "پرداخت ناموفق بود",
              ar: "فشل الدفع",
              fi: "Maksu epäonnistui",
            })
        );
      if (!data?.url)
        throw new Error(
          t({
            en: "Missing checkout URL",
            fa: "لینک پرداخت یافت نشد",
            ar: "رابط الدفع غير موجود",
            fi: "Maksulinkki puuttuu",
          })
        );

      window.location.href = data.url;
    } catch (e: any) {
      toast.error(
        e?.message ??
          t({
            en: "Payment could not start",
            fa: "پرداخت شروع نشد",
            ar: "تعذر بدء الدفع",
            fi: "Maksu ei käynnistynyt",
          })
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">
            {t({
              en: "Choose Your Plan",
              fa: "پلن خود را انتخاب کنید",
              ar: "اختر خطتك",
              fi: "Valitse paketti",
            })}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {t({
              en: "Select the perfect plan for your business needs",
              fa: "پلن مناسب برای نیاز کسب‌وکارتان را انتخاب کنید",
              ar: "اختر الخطة الأنسب لعملك",
              fi: "Valitse yrityksellesi sopivin paketti",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 mt-8 md:grid-cols-3">
          {/* Starter */}
          <Card className="border-gray-200 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">
                {t({ en: "Starter", fa: "شروع", ar: "أساسي", fi: "Starter" })}
              </CardTitle>
              <CardDescription>
                {t({
                  en: "Perfect for getting started",
                  fa: "مناسب برای شروع",
                  ar: "مثالي للبداية",
                  fi: "Sopii aloitukseen",
                })}
              </CardDescription>
              <div className="pt-4">
                <div className="text-4xl font-bold">$49</div>
                <div className="text-sm text-muted-foreground">
                  {t({
                    en: "one-time payment",
                    fa: "پرداخت یک‌باره",
                    ar: "دفعة واحدة",
                    fi: "kertamaksu",
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                t({ en: "1 landing page", fa: "۱ لندینگ پیج", ar: "صفحة واحدة", fi: "1 laskeutumissivu" }),
                t({
                  en: "Free subdomain (.donepage.co)",
                  fa: "زیردامنه رایگان (.donepage.co)",
                  ar: "نطاق فرعي مجاني (.donepage.co)",
                  fi: "Ilmainen alidomain (.donepage.co)",
                }),
                t({ en: "Basic SEO optimization", fa: "سئوی پایه", ar: "تحسين سيو أساسي", fi: "Perus‑SEO" }),
                t({ en: "SSL certificate included", fa: "گواهی SSL", ar: "شهادة SSL", fi: "SSL‑sertifikaatti" }),
                t({ en: "Mobile responsive design", fa: "ریسپانسیو موبایل", ar: "تصميم متجاوب", fi: "Mobiiliystävällinen" }),
                t({ en: "Email support", fa: "پشتیبانی ایمیل", ar: "دعم عبر البريد", fi: "Sähköpostituki" }),
              ].map((item) => (
                <div key={item} className="flex gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  {item}
                </div>
              ))}
              <Button
                onClick={() => handleSelect("starter")}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                {t({ en: "Get Starter", fa: "خرید پلن شروع", ar: "اختر الأساسي", fi: "Valitse Starter" })}
              </Button>
            </CardContent>
          </Card>

          {/* Business */}
          <Card className="border-2 border-blue-600 shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm">
                {t({
                  en: "Most Popular",
                  fa: "محبوب‌ترین",
                  ar: "الأكثر شيوعًا",
                  fi: "Suosituin",
                })}
              </span>
            </div>
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">
                {t({ en: "Business", fa: "بیزنس", ar: "أعمال", fi: "Business" })}
              </CardTitle>
              <CardDescription>
                {t({
                  en: "For growing businesses",
                  fa: "برای کسب‌وکارهای در حال رشد",
                  ar: "للأعمال المتنامية",
                  fi: "Kasvaville yrityksille",
                })}
              </CardDescription>
              <div className="pt-4">
                <div className="text-4xl font-bold">$149</div>
                <div className="text-sm text-muted-foreground">
                  {t({
                    en: "one-time payment",
                    fa: "پرداخت یک‌باره",
                    ar: "دفعة واحدة",
                    fi: "kertamaksu",
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                t({ en: "5 landing pages", fa: "۵ لندینگ پیج", ar: "5 صفحات", fi: "5 laskeutumissivua" }),
                t({ en: "Custom domain support", fa: "دامنه اختصاصی", ar: "دعم نطاق مخصص", fi: "Oma domain" }),
                t({ en: "Advanced SEO tools", fa: "ابزار سئو پیشرفته", ar: "أدوات سيو متقدمة", fi: "Edistyneet SEO‑työkalut" }),
                t({ en: "Analytics dashboard", fa: "داشبورد آنالیتیکس", ar: "لوحة تحليلات", fi: "Analytiikka‑näkymä" }),
                t({ en: 'Remove "Powered by" branding', fa: "حذف برندینگ", ar: "إزالة العلامة", fi: "Poista brändäys" }),
                t({ en: "Priority support", fa: "پشتیبانی ویژه", ar: "دعم أولوية", fi: "Prioriteettituki" }),
                t({ en: "A/B testing", fa: "تست A/B", ar: "اختبار A/B", fi: "A/B‑testaus" }),
              ].map((item) => (
                <div key={item} className="flex gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  {item}
                </div>
              ))}
              <Button
                onClick={() => handleSelect("business")}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                {t({ en: "Get Business", fa: "خرید پلن بیزنس", ar: "اختر الأعمال", fi: "Valitse Business" })}
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="border-gray-200 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-4">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">
                {t({ en: "Pro", fa: "پرو", ar: "احترافي", fi: "Pro" })}
              </CardTitle>
              <CardDescription>
                {t({
                  en: "For professionals & agencies",
                  fa: "برای حرفه‌ای‌ها و آژانس‌ها",
                  ar: "للمحترفين والوكالات",
                  fi: "Ammattilaisille ja toimistoille",
                })}
              </CardDescription>
              <div className="pt-4">
                <div className="text-4xl font-bold">$299</div>
                <div className="text-sm text-muted-foreground">
                  {t({
                    en: "one-time payment",
                    fa: "پرداخت یک‌باره",
                    ar: "دفعة واحدة",
                    fi: "kertamaksu",
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                t({ en: "Unlimited landing pages", fa: "لندینگ نامحدود", ar: "صفحات غير محدودة", fi: "Rajattomat sivut" }),
                t({ en: "Unlimited custom domains", fa: "دامنه اختصاصی نامحدود", ar: "نطاقات غير محدودة", fi: "Rajattomat domainit" }),
                t({ en: "Premium SEO features", fa: "سئوی پریمیوم", ar: "ميزات سيو متقدمة", fi: "Premium‑SEO" }),
                t({ en: "Advanced analytics & reporting", fa: "آنالیتیکس و گزارش پیشرفته", ar: "تحليلات وتقارير متقدمة", fi: "Edistynyt analytiikka" }),
                t({ en: "White-label option", fa: "وایت‌لیبل", ar: "خيار العلامة البيضاء", fi: "White‑label" }),
                t({ en: "24/7 priority support", fa: "پشتیبانی ۲۴/۷", ar: "دعم 24/7", fi: "24/7‑tuki" }),
                t({ en: "API access", fa: "دسترسی API", ar: "وصول API", fi: "API‑pääsy" }),
              ].map((item) => (
                <div key={item} className="flex gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  {item}
                </div>
              ))}
              <Button
                onClick={() => handleSelect("pro")}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
              >
                {t({ en: "Get Pro", fa: "خرید پلن پرو", ar: "اختر برو", fi: "Valitse Pro" })}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {t({
            en: "All plans include lifetime access. 30-day money-back guarantee.",
            fa: "همه پلن‌ها دسترسی دائمی دارند. ضمانت بازگشت وجه ۳۰ روزه.",
            ar: "كل الخطط تتضمن وصولًا مدى الحياة. ضمان استرجاع خلال 30 يومًا.",
            fi: "Kaikki paketit sisältävät elinikäisen käytön. 30 päivän rahat takaisin.",
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
