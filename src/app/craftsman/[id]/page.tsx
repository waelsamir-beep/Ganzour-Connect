"use client";

import { useEffect, useState, use } from "react";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { mapsLink, telLink, whatsappLink } from "@/lib/constants";

type Detail = {
  id: number;
  name: string;
  profession: string;
  categoryName?: string | null;
  categoryIcon?: string | null;
  phone: string;
  whatsapp?: string | null;
  location: string;
  address?: string | null;
  description?: string | null;
  experienceYears?: number | null;
  rating?: number | null;
  ratingsCount?: number | null;
  views?: number | null;
  verified?: boolean | null;
  featured?: boolean | null;
  avatarEmoji?: string | null;
};

type Review = {
  id: number;
  reviewerName: string;
  rating: number;
  comment?: string | null;
  createdAt?: string | null;
};

export default function CraftsmanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<Detail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rName, setRName] = useState("");
  const [rRating, setRRating] = useState(5);
  const [rComment, setRComment] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/craftsmen/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.craftsman) setData(d.craftsman);
        setReviews(d.reviews ?? []);
        setRelated(d.related ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function sendReview(e: React.FormEvent) {
    e.preventDefault();
    if (!rName.trim()) {
      setMsg("اكتب اسمك");
      return;
    }
    setSending(true);
    setMsg("");
    try {
      const res = await fetch(`/api/craftsmen/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerName: rName, rating: rRating, comment: rComment }),
      });
      if (res.ok) {
        setMsg("شكراً! تم إضافة تقييمك ✅");
        setRName("");
        setRComment("");
        setRRating(5);
        const r = await fetch(`/api/craftsmen/${id}/reviews`).then((x) => x.json());
        setReviews(r.reviews ?? []);
      } else setMsg("حدث خطأ");
    } catch {
      setMsg("تعذر الإرسال");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pb-2">
        <div className="h-52 animate-pulse bg-[#1a73e8] rounded-b-[28px]" />
        <div className="mx-auto max-w-xl px-4 -mt-10">
          <div className="h-40 animate-pulse rounded-3xl bg-white dark:bg-slate-800 shadow" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="text-center">
          <div className="text-5xl">😕</div>
          <p className="mt-2 font-black">الحرفي غير موجود</p>
          <Link href="/" className="mt-3 inline-block rounded-xl bg-[#1a73e8] px-6 py-2 text-white text-sm font-bold">الرئيسية</Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const wa = whatsappLink(data.whatsapp || data.phone, data.name);
  const rating = data.rating ?? 4.5;

  return (
    <div className="min-h-screen pb-2">
      <header className="relative overflow-hidden bg-gradient-to-b from-[#1a73e8] to-[#1a5fd0] pb-16 pt-6 rounded-b-[28px]">
        <div className="mx-auto max-w-xl px-4">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-bold text-blue-100">→ رجوع للدليل</Link>
          <div className="mt-4 flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white dark:bg-slate-800 text-4xl shadow-lg">
              {data.avatarEmoji || "👷"}
            </div>
            <div className="flex-1">
              <h1 className="flex items-center gap-2 text-xl font-black text-white flex-wrap">
                {data.name}
                {data.verified && (
                  <span className="rounded-full bg-green-400/90 px-2 py-0.5 text-[11px] font-black text-green-950">✔ موثّق</span>
                )}
              </h1>
              <p className="mt-0.5 text-[14px] font-bold text-blue-100">💼 {data.profession}</p>
              <p className="text-[13px] text-blue-200">📍 {data.location}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-8 max-w-xl px-4 space-y-3">
        {/* rating card */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-4 shadow-lg border border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/30 p-3">
              <div className="text-lg font-black text-amber-600">⭐ {Number(rating).toFixed(1)}</div>
              <div className="text-[11px] font-bold text-amber-700/70">{data.ratingsCount ?? 0} تقييم</div>
            </div>
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/30 p-3">
              <div className="text-lg font-black text-blue-700 dark:text-blue-300">👁️ {data.views ?? 0}</div>
              <div className="text-[11px] font-bold text-blue-700/70">مشاهدة</div>
            </div>
            <div className="rounded-2xl bg-green-50 dark:bg-green-900/30 p-3">
              <div className="text-lg font-black text-green-700 dark:text-green-300">🕒 {data.experienceYears ?? 1}</div>
              <div className="text-[11px] font-bold text-green-700/70">سنوات خبرة</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={telLink(data.phone)} className="rounded-2xl bg-[#1a73e8] py-3 text-center text-[14px] font-black text-white hover:bg-[#1558b0]">
              📞 اتصال الآن
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#22c55e] py-3 text-center text-[14px] font-black text-white hover:bg-green-600">
              💬 واتساب
            </a>
          </div>
          <a href={telLink(data.phone)} className="mt-2 block rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 py-2.5 text-center text-lg font-black tracking-wider text-slate-800 dark:text-slate-100" dir="ltr">
            {data.phone}
          </a>
          <a
            href={mapsLink(data.location)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 py-2.5 text-center text-[13px] font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            🗺️ إظهار على الخريطة
          </a>
          {data.address && (
            <p className="mt-2 rounded-2xl bg-slate-50 dark:bg-slate-700/60 px-3 py-2 text-[13px] font-semibold text-slate-600 dark:text-slate-300">
              🏠 {data.address}
            </p>
          )}
        </div>

        {/* about */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-[15px] font-black">📝 عن {data.name}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-slate-600 dark:text-slate-300">
            {data.description || "حرفي محترف في جنزور، التزام بالمواعيد وجودة في الشغل."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.categoryName && (
              <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-[12px] font-bold text-blue-700 dark:text-blue-300">
                {data.categoryIcon} {data.categoryName}
              </span>
            )}
            {data.featured && (
              <span className="rounded-full bg-amber-50 dark:bg-amber-900/30 px-3 py-1 text-[12px] font-bold text-amber-700 dark:text-amber-300">⭐ مميز</span>
            )}
          </div>
        </div>

        {/* share */}
        <div className="flex gap-2">
          <button
            onClick={async () => {
              const url = `${window.location.origin}/craftsman/${data.id}`;
              const text = `${data.name} — ${data.profession} | ${data.location}`;
              try {
                if (navigator.share) {
                  await navigator.share({ title: `${data.name} - ${data.profession}`, text, url });
                  return;
                }
              } catch {
                return; // المستخدم أغلق المشاركة
              }
              try {
                await navigator.clipboard.writeText(`${text}\n${url}`);
                alert("تم نسخ بيانات الحرفي ✅");
              } catch {}
            }}
            className="flex-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 py-2.5 text-[13px] font-bold text-slate-700 dark:text-slate-200"
          >
            🔗 مشاركة
          </button>
          <a
            href={`sms:${data.phone.replace(/[\s-]/g, "")}`}
            className="flex-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 py-2.5 text-center text-[13px] font-bold text-slate-700 dark:text-slate-200"
          >
            ✉️ رسالة نصية
          </a>
        </div>

        {/* reviews */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-[15px] font-black">⭐ التقييمات ({reviews.length})</h2>
          <div className="mt-3 space-y-2">
            {reviews.length === 0 && (
              <p className="rounded-2xl bg-slate-50 dark:bg-slate-700/60 p-3 text-center text-[13px] text-slate-500 dark:text-slate-400 dark:text-slate-500">
                لا توجد تقييمات بعد — كن أول من يقيّم 👍
              </p>
            )}
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl bg-slate-50 dark:bg-slate-700/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-black text-slate-800 dark:text-slate-100">👤 {r.reviewerName}</span>
                  <span className="text-amber-400 text-sm" dir="ltr">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-300">{r.comment}</p>}
              </div>
            ))}
          </div>

          <form onSubmit={sendReview} className="mt-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 p-3 space-y-2">
            <h3 className="text-[13px] font-black text-blue-900 dark:text-blue-200">✍️ أضف تقييمك</h3>
            <input
              value={rName}
              onChange={(e) => setRName(e.target.value)}
              placeholder="اسمك"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-[13px] font-semibold focus:outline-none focus:border-[#1a73e8]"
            />
            <div className="flex items-center gap-1" dir="ltr">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setRRating(n)} className={`text-2xl ${n <= rRating ? "text-amber-400" : "text-slate-300"}`}>
                  ★
                </button>
              ))}
              <span className="mr-2 text-[12px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500">({rRating}/5)</span>
            </div>
            <textarea
              value={rComment}
              onChange={(e) => setRComment(e.target.value)}
              placeholder="رأيك في الشغل..."
              rows={2}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-[13px] focus:outline-none focus:border-[#1a73e8] resize-none"
            />
            {msg && <p className="text-[12px] font-bold text-green-700 dark:text-green-300">{msg}</p>}
            <button disabled={sending} className="w-full rounded-xl bg-[#1a73e8] py-2.5 text-[13px] font-black text-white disabled:opacity-60">
              {sending ? "جاري الإرسال..." : "إرسال التقييم"}
            </button>
          </form>
        </div>

        {/* related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-[15px] font-black px-1">🔗 حرفيون مشابهون</h2>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {related.map((r: any) => (
                <Link key={r.id} href={`/craftsman/${r.id}`} className="rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-xl">{r.avatarEmoji || "👷"}</span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-black">{r.name}</p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500">{r.profession}</p>
                    </div>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500">⭐ {Number(r.rating ?? 4).toFixed(1)} • {r.location}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
