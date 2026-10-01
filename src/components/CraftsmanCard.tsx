"use client";

import Link from "next/link";
import { mapsLink, telLink, whatsappLink } from "@/lib/constants";

export type CraftsmanRow = {
  id: number;
  name: string;
  profession: string;
  categoryName?: string | null;
  categoryIcon?: string | null;
  section?: string | null;
  phone: string;
  whatsapp?: string | null;
  location: string;
  description?: string | null;
  rating?: number | null;
  ratingsCount?: number | null;
  views?: number | null;
  verified?: boolean | null;
  featured?: boolean | null;
  avatarEmoji?: string | null;
  experienceYears?: number | null;
};

export default function CraftsmanCard({
  c,
  index = 0,
  isFav = false,
  onToggleFav,
}: {
  c: CraftsmanRow;
  index?: number;
  isFav?: boolean;
  onToggleFav?: (id: number) => void;
}) {
  const wa = whatsappLink(c.whatsapp || c.phone, c.name);
  const tel = telLink(c.phone);
  const rating = c.rating ?? 4.5;

  return (
    <article
      className="anim-fade-up rounded-3xl bg-white dark:bg-slate-800 p-4 shadow-[0_8px_24px_rgba(16,24,40,0.06)] border border-slate-100 dark:border-slate-700 hover:shadow-[0_12px_32px_rgba(22,163,74,0.12)] transition-shadow"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* actions left (in RTL appears left) */}
        <div className="flex flex-col gap-2 shrink-0">
          <a
            href={tel}
            aria-label={`اتصال ${c.name}`}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-[#16a34a] text-xl text-white shadow-lg shadow-green-200 transition-transform hover:scale-105 active:scale-95"
          >
            📞
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`واتساب ${c.name}`}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-[#22c55e] text-xl text-white shadow-lg shadow-green-200 transition-transform hover:scale-105 active:scale-95"
          >
            💬
          </a>
          {onToggleFav && (
            <button
              onClick={() => onToggleFav(c.id)}
              aria-label="أضف للمفضلة"
              className={`grid h-10 w-12 place-items-center rounded-2xl text-lg transition-all active:scale-90 ${
                isFav
                  ? "bg-rose-100 dark:bg-rose-900/40 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-700 opacity-70 hover:opacity-100"
              }`}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          )}
        </div>

        {/* info */}
        <div className="min-w-0 flex-1">
          <Link href={`/craftsman/${c.id}`} className="block">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-[17px] font-extrabold text-slate-900 dark:text-slate-100 leading-tight hover:text-[#16a34a] transition-colors">
                {c.name}
              </h3>
              {c.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-[11px] font-bold text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                  ✔ موثّق
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 dark:text-slate-500 flex-wrap">
              <span className="inline-flex items-center gap-1 font-semibold">
                <span>💼</span> {c.profession}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 dark:text-slate-500 flex-wrap">
              <a
                href={mapsLink(c.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#16a34a] transition-colors"
                title="إظهار على الخريطة"
              >
                <span>🗺️</span> {c.location}
              </a>
              {c.experienceYears ? (
                <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
                  • 🕒 {c.experienceYears} سنوات خبرة
                </span>
              ) : null}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-amber-400 text-sm tracking-tight" dir="ltr">
                {"★".repeat(Math.round(rating))}
                <span className="text-slate-200">
                  {"★".repeat(5 - Math.round(rating))}
                </span>
              </span>
              <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500">
                {Number(rating).toFixed(1)}
              </span>
              {c.ratingsCount ? (
                <span className="text-[12px] text-slate-400 dark:text-slate-500">
                  ({c.ratingsCount} تقييم)
                </span>
              ) : null}
            </div>
          </Link>
        </div>

        {/* avatar */}
        <Link
          href={`/craftsman/${c.id}`}
          className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-3xl border-2 border-green-50"
        >
          {c.avatarEmoji || "👷"}
          {c.featured && (
            <span className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-[12px] shadow">
              ⭐
            </span>
          )}
        </Link>
      </div>

      {c.description && (
        <p className="mt-3 line-clamp-2 rounded-2xl bg-slate-50 dark:bg-slate-700/60 px-3 py-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
          {c.description}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/craftsman/${c.id}`}
          className="flex-1 rounded-2xl bg-slate-100 dark:bg-slate-700 px-3 py-2 text-center text-[13px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          عرض التفاصيل
        </Link>
        <a
          href={`tel:${c.phone.replace(/[\s-]/g, "")}`}
          className="flex-1 rounded-2xl bg-[#16a34a] px-3 py-2 text-center text-[13px] font-bold text-white hover:bg-[#15803d] transition-colors"
        >
          📞 {c.phone}
        </a>
      </div>
    </article>
  );
}
