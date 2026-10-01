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
    const t = setTimeout(() => setShowSplash(false), 800);
    return () => clearTimeout(t);
  }, []);

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

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then((d) => setLocations(d.locations ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/craftsmen?limit=200")
      .then((r) => r.json())
      .then((d) => setAllList(d.craftsmen ?? []))
      .catch(() => {});
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      {showSplash && (
        <div className="fixed inset-0 z-[100] grid place-items-center header-gradient">
          <div className="text-center text-white anim-pop">
            <div className="text-6xl mb-3">🛠️</div>
            <h1 className="text-3xl font-black tracking-tight">جنزور برو</h1>
            <p className="mt-2 text-green-100 text-sm font-medium">دليل المهن الموثوق</p>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-green-300/40 overflow-hidden">
              <div className="h-full bg-white/80 animate-pulse rounded-full" style={{width: '60%'}} />
            </div>
          </div>
        </div>
      )}

      {/* Modern Header */}
      <header className="header-gradient relative pt-6 pb-12 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
              🛠️ جنزور برو
            </h1>
            <p className="mt-2 text-green-50 text-sm font-medium">
              كل الخدمات والحرفيين الموثوقين في مكان واحد
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-3 border border-white/20">
              <div className="text-white font-black text-lg">{stats.total}</div>
              <div className="text-xs text-green-50 mt-1">محترف</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-3 border border-white/20">
              <div className="text-white font-black text-lg">{stats.verified}</div>
              <div className="text-xs text-green-50 mt-1">موثّق</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-3 border border-white/20">
              <div className="text-white font-black text-lg">{stats.categories}</div>
              <div className="text-xs text-green-50 mt-1">تصنيف</div>
            </div>
          </div>
        </div>
      </header>

      {/* Search - Overlapping */}
      <div className="mx-auto max-w-4xl px-4 -mt-6 relative z-20 mb-6">
        <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن مهنة أو اسم..."
            className="flex-1 bg-transparent px-4 py-3.5 text-base font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              ✕
            </button>
          )}
          <button
            aria-label="بحث"
            className="px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-600 hover:to-green-700 transition-all"
          >
            🔍
          </button>
        </div>

        {/* Quick Filters */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              verifiedOnly
                ? "bg-green-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            ✔ موثّق
          </button>
          <button
            onClick={() => {
              setFavsOnly(!favsOnly);
              if (!favsOnly && favs.length === 0) return;
            }}
            className={`shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              favsOnly
                ? "bg-rose-500 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            ❤️ ({favs.length})
          </button>
          {[
            { v: "featured", l: "⭐ المميز" },
            { v: "rating", l: "🏆 الأفضل" },
            { v: "newest", l: "🆕 جديد" },
          ].map((s) => (
            <button
              key={s.v}
              onClick={() => setSort(s.v)}
              className={`shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                sort === s.v
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {s.l}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 pb-6">
        {/* Admin Announcement */}
        {showAnn && (
          <div className="anim-fade-up mb-6 flex gap-3 card-modern rounded-2xl p-4 border-l-4 border-amber-500">
            <span className="text-2xl shrink-0">📣</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 dark:text-white">{ann!.title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{ann!.message}</p>
            </div>
            <button
              onClick={dismissAnn}
              aria-label="إخفاء الإعلان"
              className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Sections */}
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3">
          الأقسام
        </h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {sections.map((s) => (
            <button
              key={s.name}
              onClick={() => selectSection(s.name)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                section === s.name
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "card-modern"
              }`}
            >
              <span className="text-lg">{s.icon}</span> {s.name}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-black text-slate-900 dark:text-white">التصنيفات</h3>
          <button
            onClick={() => setShowAllCats(!showAllCats)}
            className="text-sm font-bold text-green-600 hover:text-green-700 dark:text-green-400 transition-colors"
          >
            {showAllCats ? "إخفاء" : "عرض الكل"}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {visibleSubCats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(activeCat === c.id ? "all" : c.id)}
              className={`relative flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all font-semibold text-xs text-center ${
                activeCat === c.id
                  ? "bg-green-600 text-white shadow-lg"
                  : "card-modern"
              }`}
            >
              <span className="text-2xl icon-3d">{c.icon}</span>
              <span className="line-clamp-2">{c.name}</span>
              {c.count > 0 && (
                <span className="absolute top-1 left-1 bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-full w-5 h-5 grid place-items-center">
                  {c.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Emergency Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg flex items-center justify-between gap-3">
          <div>
            <p className="font-black text-sm">🚨 حالة طوارئ؟</p>
            <p className="text-xs text-red-100 mt-1">سباك أو كهربائي الآن</p>
          </div>
          <button
            onClick={() => {
              setSearch("طوارئ");
              setActiveCat("all");
            }}
            className="bg-white text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-red-50 transition-colors"
          >
            عرض
          </button>
        </div>

        {/* List */}
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3">
          {favsOnly
            ? "❤️ المفضلة"
            : debounced
            ? `نتائج "${debounced}"`
            : `${sectionIcon} ${section}`}
        </h2>

        <div className="space-y-3">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card-modern rounded-2xl p-4 animate-pulse"
                >
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-2">
                      <div className="h-10 w-10 rounded-lg bg-slate-300 dark:bg-slate-600" />
                      <div className="h-10 w-10 rounded-lg bg-slate-300 dark:bg-slate-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/2 rounded bg-slate-300 dark:bg-slate-600" />
                      <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="h-14 w-14 rounded-full bg-slate-300 dark:bg-slate-600" />
                  </div>
                </div>
              ))}
            </>
          ) : displayList.length === 0 ? (
            <div className="card-modern rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">{favsOnly ? "🤍" : "🔍"}</div>
              <h3 className="font-black text-slate-900 dark:text-white">
                {favsOnly ? "لا توجد مفضلة" : "لا توجد نتائج"}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {favsOnly
                  ? "ابدأ بإضافة الخدمات المفضلة"
                  : "جرّب بحثاً آخر"}
              </p>
              <button
                onClick={() => {
                  if (favsOnly) setFavsOnly(false);
                  else {
                    setSearch("");
                    setActiveCat("all");
                  }
                }}
                className="mt-4 px-6 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
              >
                {favsOnly ? "عرض الكل" : "العودة"}
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

        {/* CTA Section */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-green-600 to-green-700 text-white shadow-xl text-center">
          <div className="text-5xl mb-3">👷</div>
          <h3 className="text-xl font-black">حرفي أو مقاول؟</h3>
          <p className="mt-2 text-green-100 text-sm">انضم للدليل مجاناً وصل لآلاف العملاء</p>
          <Link
            href="/add"
            className="mt-4 inline-block px-6 py-3 bg-white text-green-600 rounded-xl font-black hover:bg-green-50 transition-colors"
          >
            📝 اطلب الانضمام
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          جنزور • محافظة المنوفية 🇪🇬
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
