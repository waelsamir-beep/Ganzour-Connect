"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Dropdown from "@/components/Dropdown";
import Link from "next/link";
import { isValidEgyptPhone } from "@/lib/constants";

type Category = { id: number; name: string; icon: string };

export default function JoinRequestPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    profession: "",
    categoryId: "",
    location: "",
    note: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCats(d.categories ?? []))
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.profession.trim()) {
      setError("من فضلك اكتب الاسم ورقم الموبايل والمهنة");
      return;
    }
    if (!isValidEgyptPhone(form.phone)) {
      setError("رقم الموبايل غير صحيح — اكتبه بالشكل 01xxxxxxxxx");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "حدث خطأ");
      else setSuccess(true);
    } catch {
      setError("تعذر الإرسال، تأكد من الاتصال بالإنترنت");
    } finally {
      setSending(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen grid place-items-center px-4 pb-2 bg-[#eef2f7] dark:bg-slate-950">
        <div className="anim-pop w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-8 text-center shadow-xl">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 dark:bg-green-900/40 text-4xl">
            📨
          </div>
          <h2 className="mt-4 text-xl font-black">تم إرسال طلبك للإدارة ✅</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 dark:text-slate-500">
            هيتم مراجعة بياناتك من إدارة الدليل، وبعد الموافقة هيظهر اسمك ورقمك
            في دليل مهن جنزور.
          </p>
          <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-900/30 px-4 py-3 text-[13px] font-bold text-amber-800 dark:text-amber-200">
            ⏳ المراجعة عادةً خلال 24 ساعة
          </div>
          <Link
            href="/"
            className="mt-5 inline-block rounded-2xl bg-[#1a73e8] px-8 py-3 text-sm font-black text-white"
          >
            العودة للرئيسية
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-2">
      <header className="bg-gradient-to-b from-[#1a73e8] to-[#1a5fd0] pb-7 pt-3.5 rounded-b-[28px]">
        <div className="mx-auto max-w-xl px-4">
          <Link href="/" className="text-[12.5px] font-bold text-blue-100">
            → رجوع
          </Link>
          <h1 className="mt-1 flex items-center gap-2 text-[19px] font-black text-white">
            📝 طلب انضمام للدليل
          </h1>
          <p className="text-[12px] text-blue-100">
            اكتب بياناتك والطلب هيوصل للإدارة للمراجعة والموافقة
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-4 max-w-xl px-4">
        <div className="mb-3 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-900/30 p-3 text-[12.5px] font-bold leading-relaxed text-amber-900 dark:text-amber-100">
          ℹ️ الإضافة في الدليل تتم عن طريق الإدارة فقط. بعد إرسال الطلب سيتم
          التواصل معك للتأكد من البيانات قبل النشر.
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4"
        >
          {error && (
            <div className="rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-slate-700 px-4 py-3 text-[13px] font-bold text-red-600 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[13px] font-black text-slate-700 dark:text-slate-200">
              👤 الاسم بالكامل *
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="مثال: محمد أحمد الجمال"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-black text-slate-700 dark:text-slate-200">
              📱 رقم الموبايل *
            </label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="01xxxxxxxxx"
              inputMode="tel"
              dir="ltr"
              maxLength={14}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-left text-[15px] font-bold tracking-wider focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-black text-slate-700 dark:text-slate-200">
              💼 المهنة *
            </label>
            <input
              value={form.profession}
              onChange={(e) => set("profession", e.target.value)}
              placeholder="مثال: كهربائي منازل / نقاش / مصمم دعاية"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-black text-slate-700 dark:text-slate-200">
              📂 التصنيف (اختياري)
            </label>
            <Dropdown
              value={form.categoryId}
              onChange={(v) => set("categoryId", v)}
              options={cats.map((c) => ({
                value: String(c.id),
                label: `${c.icon} ${c.name}`,
              }))}
              placeholder="— اختر التصنيف —"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-black text-slate-700 dark:text-slate-200">
              📍 العنوان (اختياري)
            </label>
            <input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="اكتب عنوانك يدوياً... مثال: أمام السوق الكبير، جنب محطة القطار"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-black text-slate-700 dark:text-slate-200">
              📝 نبذة عن شغلك (اختياري)
            </label>
            <textarea
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="اكتب الخدمات اللي بتقدمها ومواعيد العمل..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-medium leading-relaxed focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-2xl bg-gradient-to-l from-[#1a73e8] to-[#6c3ce0] py-3.5 text-[15px] font-black text-white shadow-lg shadow-blue-200 disabled:opacity-60"
          >
            {sending ? "⏳ جاري الإرسال..." : "📨 إرسال الطلب للإدارة"}
          </button>
          <p className="text-center text-[12px] text-slate-400 dark:text-slate-500">
            بإرسال الطلب أنت توافق على عرض اسمك ورقمك في الدليل بعد الموافقة
          </p>
        </form>
      </main>
      <BottomNav />
    </div>
  );
}
