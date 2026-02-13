"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function ChatWidget() {
  const [lang, setLang] = React.useState<"en" | "fa" | "ar" | "fi">("en");
  const t = <T,>(map: Record<"en" | "fa" | "ar" | "fi", T>) =>
    map[lang] ?? map.en;
  const refreshLang = React.useCallback(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("dp_lang") || "en";
    const normalized =
      stored.startsWith("fa") || stored.includes("persian") || stored.includes("farsi")
        ? "fa"
        : stored.startsWith("ar") || stored.includes("arabic")
        ? "ar"
        : stored.startsWith("fi") || stored.includes("finnish") || stored.includes("suomi")
        ? "fi"
        : "en";
    setLang(normalized);
  }, []);
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [messages, setMessages] = React.useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  React.useEffect(() => {
    refreshLang();
    if (typeof window === "undefined") return;
    const onLang = (e: Event) => {
      refreshLang();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "dp_lang") refreshLang();
    };
    window.addEventListener("dp:lang", onLang as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("dp:lang", onLang as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [refreshLang]);

  React.useEffect(() => {
    if (open) refreshLang();
  }, [open, refreshLang]);

  React.useEffect(() => {
    setMessages([
      {
        role: "assistant" as const,
        content: t({
          en: "Hi! Ask me about proposals, enterprise pricing, publishing, domains, uploads, or sign‑in.",
          fa: "سلام! درباره پروپوزال، قیمت‌گذاری، انتشار، دامنه، آپلود یا ورود بپرس.",
          ar: "مرحبًا! اسأل عن المقترحات أو التسعير أو النشر أو النطاقات أو الرفع أو تسجيل الدخول.",
          fi: "Hei! Kysy tarjouksista, hinnoista, julkaisusta, domaineista, latauksista tai kirjautumisesta.",
        }),
      },
    ]);
  }, [lang]);

  const faqs = t({
    en: [
      {
        q: "How do I create a proposal for my client?",
        a: "Open your landing preview and click Proposal. Select a tier, enable Stripe checkout, and share a premium proposal link your client can approve instantly.",
      },
      {
        q: "How do payments work for proposals vs Donepage?",
        a: "Proposal payments cover your client engagement. Donepage plans are separate and only cover publishing the landing page.",
      },
      {
        q: "What is the full process from start to publish?",
        a: "1) Answer questions, 2) Preview and refine, 3) Save draft, 4) Select a plan, 5) Publish and share a luxury‑grade link.",
      },
      {
        q: "How do I add Stripe price IDs for proposal checkout?",
        a: "Add STRIPE_PRICE_PROPOSAL_3K/5K/7K in your env, then the proposal CTA routes clients directly to Stripe Checkout.",
      },
      {
        q: "Can I edit after publishing?",
        a: "Yes. Use your private edit link to refine, then republish when it’s final.",
      },
      {
        q: "How do custom domains work?",
        a: "Connect your domain in Publish, then add a CNAME or A record at your DNS provider. Use the domain status check after updating DNS.",
      },
      {
        q: "Do I get a free Donepage subdomain?",
        a: "Yes. You can publish to yourslug.donepage.co instantly, then upgrade to a custom domain any time.",
      },
      {
        q: "How do I add images or videos?",
        a: "Use the upload button in the About or Portfolio steps. It supports images and short videos (max 25MB).",
      },
      {
        q: "Why don’t I see my preview or proposal in production?",
        a: "Local drafts are not visible on donepage.co. Generate in production to get live preview and proposal links.",
      },
    ],
    fa: [
      {
        q: "چطور برای مشتری پروپوزال بسازم؟",
        a: "پیش‌نمایش لندینگ را باز کن و Proposal را بزن. یک پلن انتخاب کن، Stripe را فعال کن و لینک را برای تایید مشتری بفرست.",
      },
      {
        q: "پرداخت پروپوزال با Donepage چه فرقی دارد؟",
        a: "پرداخت پروپوزال مربوط به خدمات شماست. پلن Donepage فقط برای انتشار لندینگ است.",
      },
      {
        q: "فرآیند کامل از شروع تا انتشار چیست؟",
        a: "۱) پاسخ به سوالات، ۲) پیش‌نمایش و اصلاح، ۳) ذخیره پیش‌نویس، ۴) انتخاب پلن، ۵) انتشار.",
      },
      {
        q: "چطور Price ID های Stripe را اضافه کنم؟",
        a: "متغیرهای STRIPE_PRICE_PROPOSAL_3K/5K/7K را در env ست کن، بعد دکمه Start مستقیم به Stripe می‌رود.",
      },
      {
        q: "بعد از انتشار می‌توانم ویرایش کنم؟",
        a: "بله. از لینک ویرایش خصوصی استفاده کن و دوباره منتشر کن.",
      },
      {
        q: "دامنه اختصاصی چطور کار می‌کند؟",
        a: "در Publish دامنه را وصل کن و رکورد CNAME یا A را در DNS تنظیم کن.",
      },
      {
        q: "زیردامنه رایگان هم داریم؟",
        a: "بله. می‌توانی روی yourslug.donepage.co منتشر کنی.",
      },
      {
        q: "چطور عکس یا ویدیو اضافه کنم؟",
        a: "در مراحل About یا Portfolio آپلود کن. تا ۲۵MB پشتیبانی می‌شود.",
      },
      {
        q: "چرا پیش‌نمایش یا پروپوزال در production نمی‌بینم؟",
        a: "پیش‌نویس‌های لوکال روی donepage.co نمایش داده نمی‌شوند.",
      },
    ],
    ar: [
      {
        q: "كيف أنشئ مقترحًا للعميل؟",
        a: "افتح المعاينة واضغط Proposal. اختر باقة وفعّل Stripe وشارك رابط المقترح.",
      },
      {
        q: "ما الفرق بين دفع المقترح وخطط Donepage؟",
        a: "دفع المقترح يخص خدمتك. خطة Donepage فقط للنشر.",
      },
      {
        q: "ما العملية من البداية للنشر؟",
        a: "1) الإجابة على الأسئلة، 2) معاينة وتعديل، 3) حفظ، 4) اختيار خطة، 5) نشر.",
      },
      {
        q: "كيف أضيف Stripe Price ID؟",
        a: "أضف STRIPE_PRICE_PROPOSAL_3K/5K/7K في env ثم زر Start يفتح Stripe.",
      },
      {
        q: "هل يمكن التعديل بعد النشر؟",
        a: "نعم، استخدم رابط التعديل الخاص ثم أعد النشر.",
      },
      {
        q: "كيف يعمل النطاق المخصص؟",
        a: "اربط النطاق في Publish ثم أضف CNAME أو A في DNS.",
      },
      {
        q: "هل هناك نطاق فرعي مجاني؟",
        a: "نعم. يمكنك النشر على yourslug.donepage.co.",
      },
      {
        q: "كيف أضيف صورة أو فيديو؟",
        a: "استخدم زر الرفع في About أو Portfolio. الحد 25MB.",
      },
      {
        q: "لماذا لا أرى المعاينة في الإنتاج؟",
        a: "المسودات المحلية لا تظهر على donepage.co.",
      },
    ],
    fi: [
      {
        q: "Miten teen tarjouksen asiakkaalle?",
        a: "Avaa esikatselu ja paina Proposal. Valitse taso, ota Stripe käyttöön ja jaa linkki.",
      },
      {
        q: "Miten tarjousmaksu eroaa Donepage‑maksusta?",
        a: "Tarjousmaksu koskee palveluasi. Donepage‑paketti vain julkaisuun.",
      },
      {
        q: "Mikä on koko prosessi alusta julkaisuun?",
        a: "1) Vastaa kysymyksiin, 2) esikatsele ja muokkaa, 3) tallenna, 4) valitse paketti, 5) julkaise.",
      },
      {
        q: "Miten lisään Stripe Price ID:t?",
        a: "Aseta STRIPE_PRICE_PROPOSAL_3K/5K/7K env‑muuttujiin, CTA vie Stripeen.",
      },
      {
        q: "Voinko muokata julkaisun jälkeen?",
        a: "Kyllä. Käytä yksityistä muokkauslinkkiä ja julkaise uudelleen.",
      },
      {
        q: "Miten oma domain toimii?",
        a: "Yhdistä domain Publish‑näkymässä ja lisää CNAME/A DNS:ään.",
      },
      {
        q: "Saanko ilmaisen alidomainin?",
        a: "Kyllä. Voit julkaista yourslug.donepage.co.",
      },
      {
        q: "Miten lisään kuvan tai videon?",
        a: "Käytä upload‑painiketta About/Portfolio‑kohdassa. Max 25MB.",
      },
      {
        q: "Miksi en näe esikatselua tuotannossa?",
        a: "Paikalliset luonnokset eivät näy donepage.co‑sivulla.",
      },
    ],
  });

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error(
        t({
          en: "Please enter a message first.",
          fa: "لطفاً ابتدا پیام را وارد کنید.",
          ar: "يرجى إدخال رسالة أولاً.",
          fi: "Kirjoita ensin viesti.",
        })
      );
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.error ??
            t({
              en: "Failed to send",
              fa: "ارسال ناموفق بود",
              ar: "فشل الإرسال",
              fi: "Lähetys epäonnistui",
            })
        );
      toast.success(
        t({
          en: "Message sent to inbox.",
          fa: "پیام به اینباکس ارسال شد.",
          ar: "تم إرسال الرسالة إلى البريد الوارد.",
          fi: "Viesti lähetettiin inboxiin.",
        })
      );
    } catch (e: any) {
      toast.error(
        e?.message ??
          t({
            en: "Email send failed.",
            fa: "ارسال ایمیل ناموفق بود.",
            ar: "فشل إرسال البريد.",
            fi: "Sähköpostin lähetys epäonnistui.",
          })
      );
    } finally {
      setSending(false);
    }
  };

  const autoReply = (text: string) => {
    const query = text.toLowerCase();
    if (query.includes("proposal") || query.includes("client")) {
      return t({
        en: "Open your landing preview and click Proposal. Add tiers and Stripe checkout to get paid instantly.",
        fa: "پیش‌نمایش را باز کن و Proposal را بزن. پلن‌ها و Stripe را فعال کن تا سریع پرداخت شود.",
        ar: "افتح المعاينة واضغط Proposal ثم فعّل Stripe لتحصيل الدفع فورًا.",
        fi: "Avaa esikatselu ja paina Proposal. Ota Stripe käyttöön saadaksesi maksun.",
      });
    }
    if (query.includes("stripe") || query.includes("price id") || query.includes("checkout")) {
      return t({
        en: "Set STRIPE_PRICE_PROPOSAL_3K/5K/7K and STRIPE_SECRET_KEY. The Start Project button opens Stripe Checkout.",
        fa: "STRIPE_PRICE_PROPOSAL_3K/5K/7K و STRIPE_SECRET_KEY را ست کن. دکمه Start پروژه به Stripe می‌رود.",
        ar: "اضبط STRIPE_PRICE_PROPOSAL_3K/5K/7K و STRIPE_SECRET_KEY. زر Start يفتح Stripe.",
        fi: "Aseta STRIPE_PRICE_PROPOSAL_3K/5K/7K ja STRIPE_SECRET_KEY. Start avaa Stripen.",
      });
    }
    if (query.includes("price") || query.includes("pricing") || query.includes("plan")) {
      return t({
        en: "Pricing appears in the Publish flow. Choose a plan, then publish. Business/Pro unlock custom domains.",
        fa: "قیمت‌گذاری در Publish است. پلن را انتخاب کن و منتشر کن. Business/Pro دامنه اختصاصی را فعال می‌کند.",
        ar: "التسعير في Publish. اختر خطة ثم انشر. Business/Pro يفتح النطاقات المخصصة.",
        fi: "Hinnoittelu on Publish‑kohdassa. Valitse paketti ja julkaise. Business/Pro avaa omat domainit.",
      });
    }
    if (query.includes("domain") || query.includes("custom domain")) {
      return t({
        en: "Connect your domain in Publish, then add a CNAME or A record at your DNS provider. Use the domain status check after updating DNS.",
        fa: "در Publish دامنه را وصل کن و رکورد CNAME یا A را در DNS اضافه کن.",
        ar: "اربط نطاقك في Publish ثم أضف CNAME أو A في DNS.",
        fi: "Yhdistä domain Publish‑kohdassa ja lisää CNAME/A DNS:ään.",
      });
    }
    if (query.includes("publish") || query.includes("live") || query.includes("deploy")) {
      return t({
        en: "Click Publish, pick a slug, choose a plan, then publish. Review first, pay only when you’re ready.",
        fa: "Publish را بزن، اسلاگ را انتخاب کن، پلن را بگیر و منتشر کن.",
        ar: "اضغط Publish واختر السلاج ثم الخطة ثم انشر.",
        fi: "Paina Publish, valitse slug, paketti ja julkaise.",
      });
    }
    if (query.includes("email") || query.includes("login") || query.includes("sign in")) {
      return t({
        en: "Email sign‑in requires DATABASE_URL, RESEND_API_KEY, and EMAIL_FROM. Google/GitHub need correct OAuth callback URLs.",
        fa: "ورود با ایمیل نیاز به DATABASE_URL و RESEND_API_KEY و EMAIL_FROM دارد.",
        ar: "تسجيل الدخول بالبريد يحتاج DATABASE_URL و RESEND_API_KEY و EMAIL_FROM.",
        fi: "Sähköpostikirjautuminen vaatii DATABASE_URL, RESEND_API_KEY ja EMAIL_FROM.",
      });
    }
    if (query.includes("upload") || query.includes("image") || query.includes("video")) {
      return t({
        en: "Use the upload button in the About or Portfolio steps. It supports images and short videos (max 25MB).",
        fa: "در مراحل About یا Portfolio آپلود کن. تصاویر و ویدیو تا ۲۵MB.",
        ar: "استخدم زر الرفع في About أو Portfolio. حتى 25MB.",
        fi: "Käytä upload‑painiketta About/Portfolio‑kohdassa. Max 25MB.",
      });
    }
    if (query.includes("edit") || query.includes("update")) {
      return t({
        en: "Use your private edit link to refine and republish anytime.",
        fa: "با لینک ویرایش خصوصی، اصلاح و دوباره منتشر کن.",
        ar: "استخدم رابط التعديل الخاص وأعد النشر.",
        fi: "Käytä muokkauslinkkiä ja julkaise uudelleen.",
      });
    }
    if (query.includes("preview") || query.includes("draft")) {
      return t({
        en: "Draft preview: /preview/{slug}?mode=draft. Published preview: /preview/{slug}?mode=published.",
        fa: "پیش‌نمایش پیش‌نویس: /preview/{slug}?mode=draft و منتشرشده: /preview/{slug}?mode=published",
        ar: "المعاينة: /preview/{slug}?mode=draft والمنشورة: /preview/{slug}?mode=published",
        fi: "Luonnos: /preview/{slug}?mode=draft, julkaistu: /preview/{slug}?mode=published",
      });
    }
    return t({
      en: "I can help with proposals, enterprise pricing, domains, publishing, uploads, or login. For anything else, use live chat.",
      fa: "می‌توانم درباره پروپوزال، قیمت‌گذاری، دامنه، انتشار، آپلود و ورود کمک کنم.",
      ar: "يمكنني المساعدة في المقترحات أو التسعير أو النشر أو الدومينات أو الرفع.",
      fi: "Autan tarjouksissa, hinnoissa, domaineissa, julkaisussa ja latauksissa.",
    });
  };

  const sendToAI = async () => {
    if (!message.trim() || sending) return;
    const userMsg = message.trim();
    setMessage("");
    setSending(true);

    const nextHistory = [
      ...messages,
      { role: "user" as const, content: userMsg },
    ];
    setMessages(nextHistory);

    try {
      const reply = autoReply(userMsg);
      const shouldOfferLive =
        reply.toLowerCase().includes("use live chat") ||
        reply.toLowerCase().includes("i can help");
      const data = { text: reply, offerLive: shouldOfferLive };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text || "Sorry — I couldn’t answer that." },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: e?.message ?? "Chat failed." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const openCrisp = () => {
    const crisp = (window as any).$crisp;
    if (crisp && Array.isArray(crisp)) {
      crisp.push(["do", "chat:open"]);
      return true;
    }
    return false;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30"
      >
        <MessageSquare className="h-4 w-4" />
        {t({ en: "Chat with us", fa: "چت با ما", ar: "تحدث معنا", fi: "Chattaa" })}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {t({ en: "Donepage Assistant", fa: "دستیار Donepage", ar: "مساعد Donepage", fi: "Donepage‑avustaja" })}
            </DialogTitle>
          </DialogHeader>

          <div className="flex max-h-[calc(85vh-120px)] flex-col space-y-4 overflow-auto pr-1 text-sm text-gray-700">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              {t({
                en: "Ask anything — I’ll answer automatically.",
                fa: "هر سوالی دارید بپرسید — خودکار جواب می‌دهم.",
                ar: "اسأل أي شيء — سأجيب تلقائيًا.",
                fi: "Kysy mitä tahansa — vastaan automaattisesti.",
              })}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="mb-2 text-xs font-semibold text-gray-600">
                {t({ en: "Common questions", fa: "سوالات رایج", ar: "أسئلة شائعة", fi: "Usein kysytyt" })}
              </div>
              <div className="space-y-3 text-sm">
                {faqs.map((f) => (
                  <div key={f.q} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="font-semibold text-gray-800">{f.q}</div>
                    <div className="mt-1 text-gray-600">{f.a}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-h-64 space-y-3 overflow-auto rounded-xl border border-gray-200 bg-white p-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={[
                    "rounded-lg px-3 py-2 text-sm",
                    m.role === "assistant"
                      ? "bg-blue-50 text-blue-900"
                      : "bg-gray-100 text-gray-800",
                  ].join(" ")}
                >
                  {m.content}
                </div>
              ))}
              {sending ? (
                <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
                  {t({ en: "Thinking…", fa: "در حال فکر…", ar: "جارٍ التفكير…", fi: "Ajattelen…" })}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">
                {t({ en: "Your email (optional)", fa: "ایمیل (اختیاری)", ar: "البريد (اختياري)", fi: "Sähköposti (valinnainen)" })}
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t({ en: "you@example.com", fa: "you@example.com", ar: "you@example.com", fi: "you@example.com" })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">
                {t({ en: "Message", fa: "پیام", ar: "الرسالة", fi: "Viesti" })}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t({ en: "How can we help?", fa: "چطور می‌توانیم کمک کنیم؟", ar: "كيف يمكننا المساعدة؟", fi: "Miten voimme auttaa?" })}
                className="w-full min-h-[120px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <Button onClick={handleSend} className="w-full">
              {t({ en: "Send to inbox", fa: "ارسال به اینباکس", ar: "إرسال إلى البريد", fi: "Lähetä inboxiin" })}
            </Button>

            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t({ en: "Ask a question…", fa: "سوال بپرس…", ar: "اسأل سؤالاً…", fi: "Kysy…" })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendToAI();
                }}
              />
              <Button onClick={sendToAI} disabled={sending}>
                {t({ en: "Ask", fa: "بپرس", ar: "اسأل", fi: "Kysy" })}
              </Button>
            </div>

            <div className="text-xs text-gray-500">
              {t({
                en: "Need the inbox? Open Crisp in a new tab.",
                fa: "اینباکس می‌خواهید؟ Crisp را در تب جدید باز کنید.",
                ar: "تحتاج إلى البريد؟ افتح Crisp في تب جديد.",
                fi: "Tarvitset inboxin? Avaa Crisp uuteen välilehteen.",
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => window.open("https://app.crisp.chat", "_blank")}
              className="w-full"
            >
              {t({ en: "Open Crisp Inbox", fa: "باز کردن Crisp Inbox", ar: "افتح Crisp Inbox", fi: "Avaa Crisp Inbox" })}
            </Button>

            {messages.length > 1 &&
            messages[messages.length - 1]?.role === "assistant" &&
            messages[messages.length - 1]?.content.includes("live chat") ? (
              <Button
                variant="outline"
                onClick={() => openCrisp()}
                className="w-full"
              >
                {t({ en: "Chat live", fa: "چت زنده", ar: "دردشة مباشرة", fi: "Live‑chat" })}
              </Button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
