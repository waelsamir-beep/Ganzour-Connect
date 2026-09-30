"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import CraftsmanCard, { type CraftsmanRow } from "@/components/CraftsmanCard";
import Dropdown from "@/components/Dropdown";
import ShareButton from "@/components/ShareButton";
import { usePwa } from "@/components/PwaProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  icon: string;
  count: number;
  section?: string | null;
};

type Stats = { total: number; verified: number; categories: number };

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [craftsmen, setCraftsmen] = useState<CraftsmanRow[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, verified: 0, categories: 0 });
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeCat, setActiveCat] = useState<number | "all">("all");
  const [showAllCats, setShowAllCats] = useState(false);
  const [section, setSection] = useState("الحرفيين");
  const [sections, setSections] = useState<{ name: string; icon: string; count: number }[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [area, setArea] = useState("all");
  const [locations, setLocations] = useState<string[]>([]);
  const [favs, setFavs] = useState<number[]>([]);
  const [favsOnly, setFavsOnly] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [ann, setAnn] = useState<{ id: number; title: string; message: string } | null>(null);
  const [annDismissed, setAnnDismissed] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [allList, setAllList] = useState<CraftsmanRow[]>([]);
  const [pickId, setPickId] = useState("");
  const router = useRouter();
  const { isInstalled, canInstall, install } = usePwa();

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(t);
  }, []);

  // استرجاع المفضلة والبحث الأخير من التخزين المحلي
  useEffect(() => {
    try {
      const f = localStorage.getItem("janzour_favs");
      setFavs(f ? JSON.parse(f) : []);
      const rc = localStorage.getItem("janzour_recent");
      setRecent(rc ? JSON.parse(rc) : []);
      const ad = localStorage.getItem("janzour_ann_dismissed");
      setAnnDismissed(ad ? JSON.parse(ad) : []);
    } catch {}
  }, []);

  // العناوين الفعلية الموجودة
  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then((d) => setLocations(d.locations ?? []))
      .catch(() => {});
  }, []);

  // قائمة كل الحرفيين للقائمة المنسدلة
  useEffect(() => {
    fetch("/api/craftsmen?limit=200")
      .then((r) => r.json())
      .then((d) => setAllList(d.craftsmen ?? []))
      .catch(() => {});
  }, []);

  // إعلانات الإدارة
  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((d) => {
        const list = d.announcements ?? [];
        if (list.length > 0) setAnn(list[0]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      const q = search.trim();
      if (q.length >= 2) {
        setRecent((r) => {
          const next = [q, ...r.filter((x) => x !== q)].slice(0, 5);
          try {
            localStorage.setItem("janzour_recent", JSON.stringify(next));
          } catch {}
          return next;
        });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
    fetch("/api/sections")
      .then((r) => r.json())
      .then((d) => setSections(d.sections ?? []))
      .catch(() => {});
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (debounced) p.set("search", debounced);
    if (activeCat !== "all") p.set("categoryId", String(activeCat));
    else p.set("section", section);
    if (area !== "all") p.set("location", area);
    if (verifiedOnly) p.set("verified", "1");
    p.set("sort", sort);
    fetch(`/api/craftsmen?${p.toString()}`)
      .then((r) => r.json())
      .then((d) => setCraftsmen(d.craftsmen ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debounced, activeCat, section, area, verifiedOnly, sort]);

  function toggleFav(id: number) {
    setFavs((f) => {
      const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
      try {
        localStorage.setItem("janzour_favs", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function dismissAnn() {
    if (!ann) return;
    setAnnDismissed((d) => {
      const next = [...d, ann.id];
      try {
        localStorage.setItem("janzour_ann_dismissed", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  const displayList = favsOnly
    ? craftsmen.filter((c) => favs.includes(c.id))
    : craftsmen;
  const showAnn = !!ann && !annDismissed.includes(ann.id);

  const activeCatName = useMemo(() => {
    if (activeCat === "all") return "الكل";
    return categories.find((c) => c.id === activeCat)?.name ?? "";
  }, [activeCat, categories]);

  // تصنيفات القسم الحالي
  const subCats = categories.filter(
    (c) => (c.section ?? "الحرفيين") === section
  );
  const visibleSubCats = showAllCats ? subCats : subCats.slice(0, 8);
  const sectionIcon = sections.find((s) => s.name === section)?.icon ?? "🛠️";
  const sectionList = allList.filter(
    (c) => (c.section ?? "الحرفيين") === section
  );

  function selectSection(name: string) {
    setSection(name);
    setActiveCat("all");
    setShowAllCats(false);
  }

  return (
    <div className="min-h-screen pb-2">
      {showSplash && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#1a73e8]">
          <div className="text-center text-white anim-pop">
            <div className="text-6xl mb-3">🛠️</div>
            <h1 className="text-2xl font-black">دليل المهن - جنزور</h1>
            <p className="mt-1 text-blue-100 text-sm">أرقام موثوقة للحرفيين...</p>
            <div className="mx-auto mt-4 h-1.5 w-32 overflow-hidden rounded-full bg-white/30">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-white dark:bg-slate-800" />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#1a73e8] to-[#1a5fd0] pb-20 pt-6 rounded-b-[28px]">
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-10 top-16 h-24 w-24 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute left-1/3 bottom-0 h-16 w-64 rounded-full bg-black/5 blur-xl" />

        <div className="mx-auto max-w-xl px-4">
          <div>
            <h1 className="flex items-center gap-2 text-[22px] font-black text-white leading-tight">
              <span className="text-2xl">🛠️</span>
              دليل المهن - جنزور
            </h1>
            <p className="mt-1 text-[13px] font-medium text-blue-100">
              أرقام موثوقة للحرفيين والمهنيين في منطقة جنزور
            </p>
          </div>

          {/* stats strip */}
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <div className="rounded-2xl bg-white/15 backdrop-blur px-1 py-2">
              <div className="text-white font-black text-[15px]">👷 {stats.total}</div>
              <div className="text-[10.5px] text-blue-100">حرفي</div>
            </div>
            <div className="rounded-2xl bg-white/15 backdrop-blur px-1 py-2">
              <div className="text-white font-black text-[15px]">✅ {stats.verified}</div>
              <div className="text-[10.5px] text-blue-100">موثّق</div>
            </div>
            <div className="rounded-2xl bg-white/15 backdrop-blur px-1 py-2">
              <div className="text-white font-black text-[15px]">📂 {stats.categories}</div>
              <div className="text-[10.5px] text-blue-100">تصنيف</div>
            </div>
            <Link href="/add" className="rounded-2xl bg-amber-400 px-1 py-2 font-black text-amber-950 hover:bg-amber-300 transition-colors">
              <div className="text-[15px]">📝 انضم</div>
              <div className="text-[10.5px] font-bold">مجاناً</div>
            </Link>
          </div>
        </div>
      </header>

      {/* Search - overlapping */}
      <div className="mx-auto -mt-12 max-w-xl px-4 relative z-10">
        <div className="flex overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-[0_12px_32px_rgba(16,24,40,0.12)] border border-slate-100 dark:border-slate-700">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن مهنة أو اسم..."
            className="flex-1 bg-transparent px-4 py-3.5 text-[15px] font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-medium focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="px-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            >
              ✕
            </button>
          )}
          <button
            aria-label="بحث"
            className="grid w-16 place-items-center bg-[#1a73e8] text-xl text-white hover:bg-[#1558b0] transition-colors"
          >
            🔍
          </button>
        </div>

        {/* quick filters */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold border transition-colors ${
              verifiedOnly
                ? "bg-green-600 text-white border-green-600"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
            }`}
          >
            {verifiedOnly ? "✔ " : ""}موثّق فقط
          </button>
          <button
            onClick={() => {
              setFavsOnly(!favsOnly);
              if (!favsOnly && favs.length === 0) return;
            }}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold border transition-colors ${
              favsOnly
                ? "bg-rose-500 text-white border-rose-500"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
            }`}
          >
            ❤️ دفتر المفضلة{favs.length > 0 ? ` (${favs.length})` : ""}
          </button>
          {[
            { v: "featured", l: "⭐ المميز" },
            { v: "rating", l: "🏆 الأعلى تقييماً" },
            { v: "newest", l: "🆕 الأحدث" },
            { v: "views", l: "👁️ الأكثر مشاهدة" },
          ].map((s) => (
            <button
              key={s.v}
              onClick={() => setSort(s.v)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold border transition-colors ${
                sort === s.v
                  ? "bg-[#1a73e8] text-white border-[#1a73e8]"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
              }`}
            >
              {s.l}
            </button>
          ))}
        </div>

        {/* area filter */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1">
            <Dropdown
              value={area}
              onChange={setArea}
              options={locations.map((l) => ({ value: l, label: l }))}
              placeholder="فلتر بالعنوان - اختر منطقة..."
              icon="🗺️"
            />
          </div>
          {area !== "all" && (
            <button
              onClick={() => setArea("all")}
              className="shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-600 px-3 py-2.5 text-[12px] font-bold text-slate-600 dark:text-slate-300"
            >
              ✕ مسح
            </button>
          )}
        </div>

        {/* recent searches */}
        {!debounced && recent.length > 0 && (
          <div className="mt-2 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="shrink-0 text-[12px] font-bold text-slate-400 dark:text-slate-500">
              🕐 بحثت أخيراً:
            </span>
            {recent.map((r) => (
              <button
                key={r}
                onClick={() => setSearch(r)}
                className="shrink-0 rounded-full bg-white dark:bg-slate-800 px-3 py-1.5 text-[12px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-[#1a73e8] hover:text-[#1a73e8] transition-colors"
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {!isInstalled && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 shadow-sm">
            <img src="/icons/icon-192.png" alt="" className="h-9 w-9 rounded-xl" />
            <p className="flex-1 text-[12px] font-bold text-slate-600 dark:text-slate-300 leading-tight">
              حمّل التطبيق على جوالك ويشتغل بدون نت 📲
            </p>
            {canInstall ? (
              <button
                onClick={() => install()}
                className="rounded-xl bg-[#1a73e8] px-3 py-2 text-[12px] font-black text-white"
              >
                تثبيت
              </button>
            ) : (
              <Link
                href="/install"
                className="rounded-xl bg-[#1a73e8] px-3 py-2 text-[12px] font-black text-white"
              >
                تثبيت
              </Link>
            )}
          </div>
        )}
      </div>

      <main className="mx-auto max-w-xl px-4">
        {/* admin announcement */}
        {showAnn && (
          <div className="anim-fade-up mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-gradient-to-l from-amber-50 dark:from-amber-900/40 to-orange-50 dark:to-orange-900/40 p-3.5 shadow-sm">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400 text-xl shadow-sm">
              📣
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-black text-amber-900 dark:text-amber-100">{ann!.title}</p>
              <p className="mt-0.5 text-[12.5px] font-semibold leading-relaxed text-amber-800/90 dark:text-amber-200/90">
                {ann!.message}
              </p>
            </div>
            <button
              onClick={dismissAnn}
              aria-label="إخفاء الإعلان"
              className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            >
              ✕
            </button>
          </div>
        )}

        {/* الأقسام الرئيسية */}
        <h2 className="mt-5 text-[17px] font-black text-slate-900 dark:text-slate-100">
          الأقسام
        </h2>
        <div className="mt-2.5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {sections.map((s) => (
            <button
              key={s.name}
              onClick={() => selectSection(s.name)}
              className={`flex shrink-0 items-center gap-1.5 rounded-2xl border-2 px-3.5 py-2.5 text-[13px] font-black transition-all ${
                section === s.name
                  ? "border-[#1a73e8] bg-blue-50 dark:bg-blue-900/30 text-[#1a73e8] dark:text-blue-300 shadow-[0_8px_20px_rgba(26,115,232,0.18)]"
                  : "border-transparent bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm"
              }`}
            >
              <span className="text-lg leading-none">{s.icon}</span>
              {s.name}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                  section === s.name
                    ? "bg-[#1a73e8] text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                }`}
              >
                {s.count}
              </span>
            </button>
          ))}
        </div>

        {/* تصنيفات القسم الحالي */}
        <div className="mt-3 flex items-center justify-between">
          <h3 className="text-[14px] font-black text-slate-700 dark:text-slate-200">
            التصنيفات
          </h3>
          <button
            onClick={() => setShowAllCats(!showAllCats)}
            className="text-[12.5px] font-bold text-[#1a73e8] hover:underline"
          >
            {showAllCats ? "إخفاء" : "عرض الكل"}
          </button>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2.5">
          {visibleSubCats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(activeCat === c.id ? "all" : c.id)}
              className={`relative flex flex-col items-center gap-1.5 rounded-2xl bg-white dark:bg-slate-800 px-1 py-4 shadow-sm border-2 transition-all hover:shadow-md ${
                activeCat === c.id
                  ? "border-[#1a73e8] shadow-[0_8px_20px_rgba(26,115,232,0.15)]"
                  : "border-transparent"
              }`}
            >
              <span className="text-[28px] leading-none">{c.icon}</span>
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 leading-tight text-center">
                {c.name}
              </span>
              {c.count > 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-black text-slate-500 dark:text-slate-300">
                  {c.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* emergency banner */}
        <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-l from-red-500 to-orange-500 p-3 text-white shadow-lg shadow-red-100">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20 text-2xl">
            🚨
          </span>
          <div className="flex-1">
            <p className="text-[13px] font-black">طوارئ؟ سباك أو كهربائي 24 ساعة</p>
            <p className="text-[12px] text-white/80">متاحون الآن في جنزور</p>
          </div>
          <button
            onClick={() => {
              setSearch("طوارئ");
              setActiveCat("all");
            }}
            className="shrink-0 rounded-xl bg-white dark:bg-slate-800 px-3 py-2 text-[12px] font-black text-red-600 dark:text-red-400"
          >
            عرض
          </button>
        </div>

        {/* أدوات القسم: بحث + قائمة الحرفيين */}
        {activeCat === "all" && !favsOnly && (
          <div className="anim-fade-up mt-4 space-y-3 rounded-3xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-[15px] font-black text-slate-900 dark:text-slate-100">
                {sectionIcon} {section}
              </h2>
              <span className="rounded-full bg-slate-200/70 dark:bg-slate-700/70 px-2.5 py-1 text-[11px] font-black text-slate-600 dark:text-slate-300">
                {sectionList.length}
              </span>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 ابحث عن مهنة معينة أو مجال..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
            <div>
              <p className="mb-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                👥 الانتقال المباشر لأي واحد في {section}:
              </p>
              <Dropdown
                value={pickId}
                onChange={(v) => {
                  if (v) {
                    setPickId("");
                    router.push(`/craftsman/${v}`);
                  }
                }}
                options={sectionList.map((c) => ({
                  value: String(c.id),
                  label: `${c.name} — ${c.profession}`,
                }))}
                placeholder={`كل ${section}...`}
                icon="👥"
              />
            </div>
          </div>
        )}

        {/* List header */}
        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-[17px] font-black text-slate-900 dark:text-slate-100">
            {favsOnly
              ? "دفتر المفضلة ❤️"
              : debounced
              ? `نتائج البحث عن "${debounced}"`
              : activeCat === "all"
              ? `${sectionIcon} ${section}`
              : `حرفيو ${activeCatName}`}
          </h2>
          <span className="rounded-full bg-slate-200/70 dark:bg-slate-700/70 px-2.5 py-1 text-[11px] font-black text-slate-600 dark:text-slate-300">
            {displayList.length} نتيجة
          </span>
        </div>

        {/* List */}
        <div className="mt-3 space-y-3">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-3xl bg-white dark:bg-slate-800 p-4 shadow-sm"
                >
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-2">
                      <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-600" />
                      <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-600" />
                      <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-slate-700" />
                      <div className="h-3 w-1/3 rounded bg-slate-100 dark:bg-slate-700" />
                    </div>
                    <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-600" />
                  </div>
                </div>
              ))}
            </>
          ) : displayList.length === 0 ? (
            <div className="rounded-3xl bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
              <div className="text-5xl">{favsOnly ? "🤍" : "🔍"}</div>
              <h3 className="mt-3 font-black text-slate-800 dark:text-slate-100">
                {favsOnly ? "دفتر المفضلة فاضي" : "لا توجد نتائج"}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                {favsOnly
                  ? "اضغط القلب 🤍 على أي حرفي عشان تحفظ رقمه هنا"
                  : "جرّب كلمة بحث مختلفة أو تصفح تصنيف آخر"}
              </p>
              <button
                onClick={() => {
                  if (favsOnly) setFavsOnly(false);
                  else {
                    setSearch("");
                    setActiveCat("all");
                    setVerifiedOnly(false);
                  }
                }}
                className="mt-4 rounded-2xl bg-[#1a73e8] px-6 py-2.5 text-sm font-bold text-white"
              >
                {favsOnly ? "عرض كل الحرفيين" : "عرض الكل"}
              </button>
            </div>
          ) : (
            displayList.map((c, i) => (
              <CraftsmanCard
                key={c.id}
                c={c}
                index={i}
                isFav={favs.includes(c.id)}
                onToggleFav={toggleFav}
              />
            ))
          )}
        </div>

        {/* CTA add */}
        <div className="mt-5 rounded-3xl bg-gradient-to-br from-[#1a73e8] to-[#6c3ce0] p-5 text-center text-white shadow-xl shadow-blue-100">
          <div className="text-4xl">👷‍♂️</div>
          <h3 className="mt-2 text-lg font-black">عندك مهنة في جنزور؟</h3>
          <p className="mt-1 text-[13px] text-blue-100">
            ابعت طلب انضمام والإدارة هتراجعه وتضيفك للدليل مجاناً
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/add"
              className="rounded-2xl bg-white px-8 py-2.5 text-sm font-black text-[#1a73e8] hover:bg-blue-50 transition-colors"
            >
              📝 اطلب الانضمام
            </Link>
            <ShareButton className="rounded-2xl bg-white/20 px-8 py-2.5 text-sm font-black text-white backdrop-blur hover:bg-white/30 transition-colors" />
          </div>
        </div>

        <Link
          href="/install"
          className="mt-3 flex items-center gap-3 rounded-3xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
        >
          <img src="/icons/icon-192.png" alt="" className="h-12 w-12 rounded-2xl" />
          <div className="flex-1">
            <p className="text-[14px] font-black text-slate-900 dark:text-slate-100">📲 حمّل التطبيق</p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 dark:text-slate-500">أندرويد • آيفون • كمبيوتر — مجاناً وبدون متجر</p>
          </div>
          <span className="text-slate-300 text-xl">‹</span>
        </Link>

        <p className="mt-6 text-center text-[12px] text-slate-400 dark:text-slate-500">
          جنزور - مركز بركة السبع - محافظة المنوفية 🇪🇬
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
