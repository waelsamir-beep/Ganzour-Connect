"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { DESIGNER_PHONE, FULL_ADDRESS } from "@/lib/constants";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError("يرجى تعبئة جميع الحقول");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDone(true);
        setForm({ name: "", phone: "", message: "" });
        setTimeout(() => setDone(false), 4000);
      } else setError("حدث خطأ");
    } catch {
      setError("تعذر الإرسال");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen pb-2">
      <header className="bg-gradient-to-b from-[#1a73e8] to-[#1a5fd0] pb-8 pt-6 rounded-b-[28px]">
        <div className="mx-auto max-w-xl px-4">
          <Link href="/" className="text-sm font-bold text-blue-100">→ رجوع</Link>
          <h1 className="mt-2 text-[22px] font-black text-white">📞 تواصل معنا</h1>
          <p className="text-[13px] text-blue-100">نسعد بخدمتك والرد على استفساراتك</p>
        </div>
      </header>

      <main className="mx-auto -mt-4 max-w-xl px-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <a href={`tel:${DESIGNER_PHONE}`} className="rounded-3xl bg-white dark:bg-slate-800 p-4 text-center shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-2xl">📞</div>
            <p className="mt-2 text-[13px] font-black">اتصال</p>
            <p className="text-[12px] font-bold text-[#1a73e8]" dir="ltr">{DESIGNER_PHONE}</p>
          </a>
          <a href={`https://wa.me/2${DESIGNER_PHONE}`} target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-white dark:bg-slate-800 p-4 text-center shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-green-100 dark:bg-green-900/40 text-2xl">💬</div>
            <p className="mt-2 text-[13px] font-black">واتساب</p>
            <p className="text-[12px] font-bold text-green-600 dark:text-green-300">راسلنا مباشرة</p>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-white dark:bg-slate-800 p-4 text-center shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-2xl">📘</div>
            <p className="mt-2 text-[13px] font-black">فيسبوك</p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 dark:text-slate-500">دليل مهن جنزور</p>
          </a>
          <div className="rounded-3xl bg-white dark:bg-slate-800 p-4 text-center shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-2xl">📍</div>
            <p className="mt-2 text-[13px] font-black">الموقع</p>
            <p className="text-[11px] leading-tight text-slate-500 dark:text-slate-400 dark:text-slate-500">{FULL_ADDRESS} 🇪🇬</p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
          <h2 className="font-black text-[15px]">✉️ أرسل رسالة</h2>
          {error && <p className="rounded-xl bg-red-50 dark:bg-red-900/30 px-3 py-2 text-[13px] font-bold text-red-600 dark:text-red-400">{error}</p>}
          {done && <p className="rounded-xl bg-green-50 dark:bg-green-900/30 px-3 py-2 text-[13px] font-bold text-green-700 dark:text-green-300">✅ تم إرسال رسالتك بنجاح، سنرد عليك قريباً</p>}
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="اسمك الكريم"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:outline-none focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="رقم هاتفك"
            inputMode="tel"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:outline-none focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800"
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="اكتب رسالتك أو استفسارك أو بلاغ عن رقم..."
            rows={4}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] focus:outline-none focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 resize-none"
          />
          <button disabled={sending} className="w-full rounded-2xl bg-[#1a73e8] py-3 text-[14px] font-black text-white disabled:opacity-60">
            {sending ? "جاري الإرسال..." : "📨 إرسال الرسالة"}
          </button>
        </form>

        <div className="rounded-3xl bg-gradient-to-l from-slate-800 to-slate-900 p-5 text-white">
          <h3 className="font-black text-[14px]">❓ أسئلة شائعة</h3>
          <div className="mt-3 space-y-2 text-[13px]">
            <details className="rounded-2xl bg-white/10 p-3">
              <summary className="font-bold cursor-pointer">إزاي أنضم للدليل؟</summary>
              <p className="mt-1 text-slate-300">
                من صفحة &quot;طلب انضمام&quot; اكتب اسمك ورقمك ومهنتك، والطلب هيوصل
                للإدارة وبعد الموافقة هتتضاف للدليل. الإضافة تتم عن طريق الإدارة فقط.
              </p>
            </details>
            <details className="rounded-2xl bg-white/10 p-3">
              <summary className="font-bold cursor-pointer">كيف يتم التوثيق؟</summary>
              <p className="mt-1 text-slate-300">نتحقق من الرقم والهوية ثم نمنح شارة &quot;موثّق ✔&quot;.</p>
            </details>
            <details className="rounded-2xl bg-white/10 p-3">
              <summary className="font-bold cursor-pointer">هل التسجيل مجاني؟</summary>
              <p className="mt-1 text-slate-300">نعم، التسجيل والعرض مجاني بالكامل لأهل جنزور.</p>
            </details>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
