"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ShareButton from "@/components/ShareButton";
import { usePwa } from "@/components/PwaProvider";

export default function InstallPage() {
  const { canInstall, isInstalled, isIOS, install } = usePwa();
  const [origin, setOrigin] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className="min-h-screen pb-2">
      <header className="relative overflow-hidden bg-gradient-to-b from-[#1a73e8] to-[#6c3ce0] pb-14 pt-6 rounded-b-[28px]">
        <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="mx-auto max-w-xl px-4">
          <Link href="/" className="text-sm font-bold text-blue-100">→ رجوع</Link>
          <div className="mt-4 flex items-center gap-4">
            <img src="/icons/icon-192.png" alt="أيقونة التطبيق" className="h-20 w-20 rounded-3xl shadow-xl" />
            <div>
              <h1 className="text-[20px] font-black text-white">دليل المهن - جنزور</h1>
              <p className="text-[13px] text-blue-100">تطبيق مجاني • بدون إعلانات • يشتغل بدون نت</p>
              <div className="mt-1 flex gap-1 text-[11px] text-blue-100">
                <span className="rounded-full bg-white/20 px-2 py-0.5">📱 أندرويد</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5">🍏 آيفون</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5">💻 كمبيوتر</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-8 max-w-xl px-4 space-y-3">
        {/* install CTA */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-lg border border-slate-100 dark:border-slate-700 text-center">
          {isInstalled ? (
            <>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 dark:bg-green-900/40 text-3xl">✅</div>
              <h2 className="mt-3 font-black">التطبيق مثبّت على جهازك</h2>
              <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400 dark:text-slate-500">تلقاه في قائمة تطبيقاتك باسم &quot;مهن جنزور&quot;</p>
            </>
          ) : (
            <>
              <h2 className="text-[17px] font-black">ثبّت التطبيق على جوالك 📲</h2>
              <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400 dark:text-slate-500">
                زر واحد وبيتثبّت زي أي تطبيق — بدون متجر وبدون مساحة تذكر
              </p>
              <button
                onClick={async () => {
                  const r = await install();
                  if (r === "unavailable")
                    setStatus("افتح القائمة ⋮ في المتصفح واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»");
                  if (r === "accepted") setStatus("تم التثبيت بنجاح ✅");
                }}
                disabled={!canInstall}
                className="mt-4 w-full rounded-2xl bg-gradient-to-l from-[#1a73e8] to-[#6c3ce0] py-3.5 text-[15px] font-black text-white shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {canInstall ? "⬇️ تثبيت التطبيق الآن" : "التثبيت من قائمة المتصفح ⋮"}
              </button>
              {status && (
                <p className="mt-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 px-3 py-2 text-[12px] font-bold text-blue-700 dark:text-blue-300">{status}</p>
              )}
            </>
          )}
        </div>

        {/* QR */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <h3 className="font-black text-[15px]">📷 امسح الكود من جوال ثاني</h3>
          <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400 dark:text-slate-500">وجّه كاميرا الجوال على الكود لفتح التطبيق</p>
          <div className="mx-auto mt-3 w-48 rounded-2xl border-4 border-blue-50 bg-white p-2">
            {origin && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/api/qr?url=${encodeURIComponent(origin)}`} alt="QR" className="w-full" />
            )}
          </div>
          <p className="mt-2 break-all rounded-xl bg-slate-50 dark:bg-slate-700/60 px-3 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500" dir="ltr">
            {origin}
          </p>
          <ShareButton className="mt-3 w-full rounded-2xl bg-green-500 py-3 text-[14px] font-black text-white" label="شارك التطبيق مع أهل جنزور" />
        </div>

        {/* instructions */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-black text-[15px]">📖 طريقة التثبيت خطوة بخطوة</h3>

          <div className="mt-3 rounded-2xl border border-green-100 dark:border-slate-700 bg-green-50/60 dark:bg-slate-800 p-3">
            <p className="text-[13px] font-black text-green-900">🤖 أندرويد (كروم)</p>
            <ol className="mt-2 space-y-1.5 text-[12px] font-semibold text-green-900/80">
              <li>1️⃣ اضغط زر ⋮ فوق يمين المتصفح</li>
              <li>2️⃣ اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»</li>
              <li>3️⃣ اضغط «تثبيت» ✅</li>
            </ol>
          </div>

          <div className="mt-2 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 p-3">
            <p className="text-[13px] font-black text-slate-800 dark:text-slate-100">🍏 آيفون (سفاري)</p>
            <ol className="mt-2 space-y-1.5 text-[12px] font-semibold text-slate-600 dark:text-slate-300">
              <li>1️⃣ افتح الموقع في متصفح Safari</li>
              <li>2️⃣ اضغط زر المشاركة ⬆️ تحت</li>
              <li>3️⃣ اختر «إضافة إلى الشاشة الرئيسية» ➕ ثم «إضافة»</li>
            </ol>
          </div>

          <div className="mt-2 rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50/60 dark:bg-slate-800 p-3">
            <p className="text-[13px] font-black text-blue-900 dark:text-blue-200">💻 كمبيوتر</p>
            <p className="mt-1 text-[12px] font-semibold text-blue-900/80">
              اضغط أيقونة التثبيت ⊕ في شريط العنوان بجانب الرابط
            </p>
          </div>
          {isIOS && (
            <p className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 px-3 py-2 text-[12px] font-bold text-amber-800 dark:text-amber-200">
              💡 جهازك آيفون — لازم تستخدم متصفح Safari للتثبيت
            </p>
          )}
        </div>

        {/* features */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { i: "📵", t: "يشتغل بدون نت", d: "تصفح الأرقام أوفلاين" },
            { i: "⚡", t: "سريع وخفيف", d: "أقل من 1 ميجا" },
            { i: "🆓", t: "مجاني تماماً", d: "بدون اشتراكات" },
            { i: "🔔", t: "تحديث تلقائي", d: "دايماً آخر نسخة" },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl bg-white dark:bg-slate-800 p-3 text-center shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="text-2xl">{f.i}</div>
              <p className="mt-1 text-[13px] font-black">{f.t}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500">{f.d}</p>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
