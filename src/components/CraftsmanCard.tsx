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
      className="anim-fade-up rounded-2xl card-modern p-4 border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl"
      style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
    >
      <div className="flex gap-3">
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          <a
            href={tel}
            aria-label={`اتصال ${c.name}`}
            className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700 transition-all hover:scale-110 active:scale-95 icon-3d"
            title="اتصال"
          >
            📞
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`واتساب ${c.name}`}
            className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all hover:scale-110 active:scale-95 icon-3d"
            title="واتساب"
          >
            💬
          </a>
          {onToggleFav && (
            <button
              onClick={() => onToggleFav(c.id)}
              aria-label="أضف للمفضلة"
              className={`grid h-11 w-11 place-items-center rounded-xl transition-all text-lg hover:scale-110 active:scale-95 ${
                isFav
                  ? "bg-rose-500 text-white shadow-lg"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
              }`}
              title={isFav ? "مزالة من المفضلة" : "إضافة للمفضلة"}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          <Link href={`/craftsman/${c.id}`} className="block group">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-[15px] font-black text-slate-900 dark:text-white group-hover:text-green-600 transition-colors">
                  {c.name}
                </h3>
                {c.verified && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-green-600 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full">
                    ✔ موثّق
                  </span>
                )}
              </div>
              {c.featured && (
                <span className="text-xl">⭐</span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-400">
              <span>💼</span>
              <span className="font-semibold">{c.profession}</span>
            </div>

            <div className="mt-1.5 flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-400">
              <a
                href={mapsLink(c.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-green-600 transition-colors"
                title="فتح على الخريطة"
              >
                <span>🗺️</span>
                {c.location}
              </a>
            </div>

            {c.experienceYears && (
              <div className="mt-1 text-[12px] text-slate-600 dark:text-slate-400">
                🕒 {c.experienceYears} سنوات خبرة
              </div>
            )}

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-amber-400 text-sm font-semibold">
                {"★".repeat(Math.round(rating))}
                <span className="text-slate-300 dark:text-slate-600">
                  {"★".repeat(5 - Math.round(rating))}
                </span>
              </span>
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                {Number(rating).toFixed(1)}
              </span>
              {c.ratingsCount && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  ({c.ratingsCount})
                </span>
              )}
            </div>

            {c.description && (
              <p className="mt-2 line-clamp-2 text-[12px] text-slate-600 dark:text-slate-400">
                {c.description}
              </p>
            )}
          </Link>
        </div>

        {/* Avatar */}
        <Link
          href={`/craftsman/${c.id}`}
          className="relative shrink-0 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-2xl hover:scale-110 transition-transform icon-3d"
        >
          {c.avatarEmoji || "👷"}
        </Link>
      </div>

      {/* Action Buttons - Bottom */}
      <div className="mt-3 flex gap-2">
        <Link
          href={`/craftsman/${c.id}`}
          className="flex-1 px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-center text-[13px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          التفاصيل
        </Link>
        <a
          href={`tel:${c.phone.replace(/[\s-]/g, "")}`}
          className="flex-1 px-3 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white text-center text-[13px] font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-md"
        >
          📞 {c.phone}
        </a>
      </div>
    </article>
  );
}
