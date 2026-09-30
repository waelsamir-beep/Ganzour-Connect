"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="grid min-h-screen place-items-center px-6 bg-[#eef2f7] dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-8 text-center shadow-xl">
        <div className="text-6xl">📵</div>
        <h1 className="mt-4 text-xl font-black">ما فيش اتصال بالإنترنت</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 dark:text-slate-500">
          تقدر تتصفح الأرقام اللي فتحتها من قبل، أو تعيد المحاولة بعد رجوع الشبكة.
        </p>
        <button
          onClick={() => location.reload()}
          className="mt-5 w-full rounded-2xl bg-[#1a73e8] py-3 text-sm font-black text-white"
        >
          🔄 إعادة المحاولة
        </button>
        <Link
          href="/"
          className="mt-2 block w-full rounded-2xl bg-slate-100 dark:bg-slate-700 py-3 text-sm font-black text-slate-700 dark:text-slate-200"
        >
          🏠 الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
