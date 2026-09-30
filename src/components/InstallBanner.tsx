"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePwa } from "./PwaProvider";

export default function InstallBanner() {
  const { canInstall, isInstalled, isIOS, install } = usePwa();
  const [dismissed, setDismissed] = useState(true);
  const [showIosSheet, setShowIosSheet] = useState(false);

  useEffect(() => {
    try {
      const d = localStorage.getItem("janzour_install_dismissed");
      const until = d ? parseInt(d) : 0;
      setDismissed(Date.now() < until);
    } catch {
      setDismissed(false);
    }
  }, []);

  function close() {
    setDismissed(true);
    try {
      // snooze 3 days
      localStorage.setItem(
        "janzour_install_dismissed",
        String(Date.now() + 3 * 24 * 60 * 60 * 1000)
      );
    } catch {}
  }

  if (isInstalled || dismissed) return null;
  if (!canInstall && !isIOS) return null;

  return (
    <>
      <div className="fixed bottom-[72px] inset-x-0 z-40 px-3 anim-fade-up">
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-3xl border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-[0_12px_40px_rgba(16,24,40,0.18)]">
          <img
            src="/icons/icon-192.png"
            alt="أيقونة التطبيق"
            className="h-12 w-12 shrink-0 rounded-2xl shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black text-slate-900 dark:text-slate-100">
              ثبّت تطبيق دليل مهن جنزور 📲
            </p>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500">
              افتحه من شاشة جوالك بدون متصفح ويشتغل بدون نت
            </p>
          </div>
          <button
            onClick={async () => {
              if (isIOS && !canInstall) setShowIosSheet(true);
              else {
                const r = await install();
                if (r === "unavailable") setShowIosSheet(true);
              }
            }}
            className="shrink-0 rounded-2xl bg-[#1a73e8] px-4 py-2.5 text-[12px] font-black text-white shadow-lg shadow-blue-200"
          >
            تثبيت
          </button>
          <button
            onClick={close}
            aria-label="إغلاق"
            className="shrink-0 px-1 text-lg text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 dark:"
          >
            ✕
          </button>
        </div>
      </div>

      {showIosSheet && (
        <div
          className="fixed inset-0 z-[90] grid place-items-end bg-black/50 p-3"
          onClick={() => setShowIosSheet(false)}
        >
          <div
            className="anim-fade-up w-full rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-600" />
            <h3 className="text-center text-[16px] font-black">
              طريقة تثبيت التطبيق 📲
            </h3>
            <ol className="mt-4 space-y-3 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
              <li className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-700/60 p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1a73e8] text-white font-black">1</span>
                <span>اضغط زر المشاركة <span className="text-lg">􀈂</span> أو ⋮ في المتصفح</span>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-700/60 p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1a73e8] text-white font-black">2</span>
                <span>اختر &quot;إضافة إلى الشاشة الرئيسية&quot; ➕</span>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-700/60 p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1a73e8] text-white font-black">3</span>
                <span>اضغط &quot;إضافة&quot; وبيطلع التطبيق على جوالك ✅</span>
              </li>
            </ol>
            <div className="mt-4 flex gap-2">
              <Link
                href="/install"
                className="flex-1 rounded-2xl bg-slate-100 dark:bg-slate-700 py-3 text-center text-[13px] font-black text-slate-700 dark:text-slate-200"
              >
                شرح مفصّل
              </Link>
              <button
                onClick={() => setShowIosSheet(false)}
                className="flex-1 rounded-2xl bg-[#1a73e8] py-3 text-[13px] font-black text-white"
              >
                فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
