"use client";

import { useCallback, useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Dropdown from "@/components/Dropdown";
import Link from "next/link";
import { isValidEgyptPhone } from "@/lib/constants";

type Row = {
  id: number;
  name: string;
  profession: string;
  categoryName?: string | null;
  phone: string;
  location: string;
  rating?: number | null;
  ratingsCount?: number | null;
  views?: number | null;
  verified?: boolean | null;
  available?: boolean | null;
  featured?: boolean | null;
};

type Req = {
  id: number;
  name: string;
  phone: string;
  profession: string;
  categoryId?: number | null;
  categoryName?: string | null;
  location?: string | null;
  note?: string | null;
  status: string;
  createdAt?: string | null;
};

type Cat = {
  id: number;
  name: string;
  icon: string;
  count?: number;
  section?: string;
};

const SECTIONS_LIST = [
  { name: "الحرفيين", icon: "🛠️" },
  { name: "الدكاترة", icon: "🩺" },
  { name: "معامل", icon: "🔬" },
  { name: "محلات", icon: "🏪" },
  { name: "مستشفيات", icon: "🏥" },
  { name: "دعاية واعلان", icon: "📢" },
];

const ICON_CHOICES = [
  "🛠️", "⚡", "🚰", "🪚", "🎨", "🧱", "🔧", "🚗",
  "📱", "💻", "❄️", "📡", "🎥", "☀️", "🏠", "🧹",
  "💈", "💄", "🧵", "📢", "🖨️", "🖌️", "📸", "📚",
  "⚖️", "🧾", "🏘️", "🐄", "🚜", "🍲", "🍰", "🚚",
  "🛵", "🎯", "🪞", "💉", "🌳", "🕌", "🏗️", "🚿",
];

type Ann = {
  id: number;
  title: string;
  message: string;
  active: boolean;
  createdAt?: string | null;
};

const emptyForm = {
  name: "",
  profession: "",
  categoryId: "",
  phone: "",
  whatsapp: "",
  location: "",
  address: "",
  description: "",
  experienceYears: "5",
  verified: true,
  featured: false,
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [reqs, setReqs] = useState<Req[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");
  const [tab, setTab] = useState<
    "requests" | "announce" | "cats" | "add" | "all" | "messages"
  >("requests");
  const [anns, setAnns] = useState<Ann[]>([]);
  const [aTitle, setATitle] = useState("");
  const [aMsg, setAMsg] = useState("");
  const [aMsgOut, setAMsgOut] = useState("");
  const [cName, setCName] = useState("");
  const [cIcon, setCIcon] = useState(ICON_CHOICES[0]);
  const [cSection, setCSection] = useState("الحرفيين");
  const [cDesc, setCDesc] = useState("");
  const [cMsgOut, setCMsgOut] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [search, setSearch] = useState("");
  const [connErr, setConnErr] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const refreshCats = useCallback(async () => {
    const c = await fetch("/api/categories");
    if (c.ok) {
      const cd = await c.json();
      setCats(cd.categories ?? []);
    }
  }, []);

  async function addCat(e: React.FormEvent) {
    e.preventDefault();
    setCMsgOut("");
    if (!cName.trim()) {
      setCMsgOut("⚠️ اكتب اسم التصنيف");
      return;
    }
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pw,
          name: cName,
          icon: cIcon,
          description: cDesc,
          section: cSection,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setCMsgOut(`⚠️ ${d.error || "تعذر حفظ التصنيف"}`);
        return;
      }
      setCMsgOut("✅ تم حفظ التصنيف وإضافته للدليل");
      setCName("");
      setCDesc("");
      setCIcon(ICON_CHOICES[0]);
      setCSection("الحرفيين");
      await refreshCats();
    } catch {
      setCMsgOut("⚠️ تعذر الاتصال بالخادم، لم يتم تأكيد الحفظ");
    }
  }

  async function delCat(id: number, name: string) {
    if (!confirm(`حذف تصنيف «${name}»؟ المهنيين اللي فيه هيتحولوا لغير مصنّف`)) return;
    try {
      const res = await fetch(`/api/categories/${id}?pw=${encodeURIComponent(pw)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setAdminMsg(`⚠️ ${data.error || "تعذر حذف التصنيف"}`);
        return;
      }
      setAdminMsg(`✅ تم حذف التصنيف «${name}»`);
      await refreshCats();
    } catch {
      setAdminMsg("⚠️ تعذر الاتصال بالخادم، لم يتم تأكيد الحذف");
    }
  }

  function startEdit(c: Cat) {
    setEditId(c.id);
    setEditName(c.name);
    setEditIcon(c.icon);
  }

  async function saveCat(id: number) {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pw, name: editName, icon: editIcon }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAdminMsg(`⚠️ ${data.error || "تعذر حفظ التصنيف"}`);
        return;
      }
      setEditId(null);
      setAdminMsg("✅ تم حفظ تعديل التصنيف");
      await refreshCats();
    } catch {
      setAdminMsg("⚠️ تعذر الاتصال بالخادم، لم يتم تأكيد الحفظ");
    }
  }
  const [form, setForm] = useState({ ...emptyForm });
  const [formMsg, setFormMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (password: string): Promise<boolean> => {
    setLoading(true);
    setConnErr(false);
    try {
      const res = await fetch(`/api/admin?pw=${encodeURIComponent(password)}`);
      if (res.status === 401) {
        setAuthed(false);
        localStorage.removeItem("janzour_admin_pw");
        return false;
      }
      if (!res.ok) throw new Error("server " + res.status);
      const d = await res.json();
      setRows(d.craftsmen ?? []);
      setMsgs(d.messages ?? []);
      setAuthed(true);
      const r = await fetch(`/api/requests?pw=${encodeURIComponent(password)}`).catch(
        () => null
      );
      if (r && r.ok) {
        const rd = await r.json();
        setReqs(rd.requests ?? []);
      }
      const a = await fetch(`/api/announcements?pw=${encodeURIComponent(password)}`).catch(
        () => null
      );
      if (a && a.ok) {
        const ad = await a.json();
        setAnns(ad.announcements ?? []);
      }
      const c = await fetch("/api/categories").catch(() => null);
      if (c && c.ok) {
        const cd = await c.json();
        setCats(cd.categories ?? []);
      }
      return true;
    } catch {
      setConnErr(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // دخول تلقائي مع إعادة محاولة لو الخادم لسه بيشتغل
  useEffect(() => {
    const saved = localStorage.getItem("janzour_admin_pw");
    if (!saved) return;
    setPw(saved);
    let cancelled = false;
    let tries = 0;
    const attempt = async () => {
      const ok = await load(saved);
      if (cancelled) return;
      if (!ok && tries < 4) {
        tries++;
        setTimeout(attempt, 1500 * tries);
      }
    };
    attempt();
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function login(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setConnErr(false);
    const clean = pw.trim();
    if (!clean) {
      setError("اكتب كلمة المرور أولاً");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: clean }),
      });
      if (res.ok) {
        localStorage.setItem("janzour_admin_pw", clean);
        setAuthed(true);
        load(clean);
        return;
      }
      setError("كلمة المرور غير صحيحة");
    } catch {
      setConnErr(true);
    } finally {
      setLoading(false);
    }
  }



  async function toggle(id: number, field: string, value: any) {
    setAdminMsg("");
    try {
      const res = await fetch(`/api/craftsmen/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pw, [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAdminMsg(`⚠️ ${data.error || "تعذر حفظ التعديل"}`);
        return;
      }
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
      setAdminMsg("✅ تم حفظ التعديل");
    } catch {
      setAdminMsg("⚠️ تعذر الاتصال بالخادم، لم يتم تأكيد الحفظ");
    }
  }

  async function del(id: number) {
    if (!confirm("حذف هذا المهني نهائياً؟")) return;
    setAdminMsg("");
    try {
      const res = await fetch(`/api/craftsmen/${id}?pw=${encodeURIComponent(pw)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setAdminMsg(`⚠️ ${data.error || "تعذر حذف المهني"}`);
        return;
      }
      setRows((rs) => rs.filter((r) => r.id !== id));
      setAdminMsg("✅ تم حذف المهني من الدليل");
    } catch {
      setAdminMsg("⚠️ تعذر الاتصال بالخادم، لم يتم تأكيد الحذف");
    }
  }

  async function handleRequest(id: number, action: "approve" | "reject") {
    const res = await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pw, action }),
    });
    if (res.ok) {
      setReqs((rs) =>
        rs.map((r) =>
          r.id === id
            ? { ...r, status: action === "approve" ? "approved" : "rejected" }
            : r
        )
      );
      if (action === "approve") load(pw);
    }
  }

  async function delRequest(id: number) {
    if (!confirm("حذف الطلب؟")) return;
    await fetch(`/api/requests/${id}?pw=${encodeURIComponent(pw)}`, {
      method: "DELETE",
    });
    setReqs((rs) => rs.filter((r) => r.id !== id));
  }

  async function addCraftsman(e: React.FormEvent) {
    e.preventDefault();
    setFormMsg("");
    if (!form.name.trim() || !form.profession.trim() || !form.phone.trim()) {
      setFormMsg("⚠️ الاسم والمهنة ورقم الموبايل مطلوبين");
      return;
    }
    if (!isValidEgyptPhone(form.phone)) {
      setFormMsg("⚠️ رقم الموبايل غير صحيح (01xxxxxxxxx)");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/craftsmen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pw }),
      });
      const d = await res.json();
      if (res.ok) {
        setFormMsg("✅ تم حفظ المهني وإضافته للدليل مباشرة");
        setForm({ ...emptyForm });
        await load(pw.trim());
      } else setFormMsg(`⚠️ ${d.error || "خطأ"}`);
    } catch {
      setFormMsg("⚠️ تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function postAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    setAMsgOut("");
    if (!aTitle.trim() || !aMsg.trim()) {
      setAMsgOut("⚠️ اكتب عنوان الإعلان ونصه");
      return;
    }
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pw, title: aTitle, message: aMsg }),
    });
    if (res.ok) {
      setAMsgOut("✅ تم نشر الإعلان في أعلى الموقع");
      setATitle("");
      setAMsg("");
      load(pw);
    } else setAMsgOut("⚠️ حدث خطأ");
  }

  async function toggleAnn(id: number, active: boolean) {
    await fetch(`/api/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pw, active }),
    });
    setAnns((as) => as.map((a) => (a.id === id ? { ...a, active } : a)));
  }

  async function delAnn(id: number) {
    if (!confirm("حذف الإعلان؟")) return;
    await fetch(`/api/announcements/${id}?pw=${encodeURIComponent(pw)}`, {
      method: "DELETE",
    });
    setAnns((as) => as.filter((a) => a.id !== id));
  }

  const pending = reqs.filter((r) => r.status === "pending");

  const filtered = rows.filter((r) =>
    search
      ? `${r.name} ${r.profession} ${r.phone} ${r.location}`.includes(search)
      : true
  );

  if (!authed) {
    return (
      <div className="min-h-screen pb-2 bg-[#eef2f7] dark:bg-slate-950">
        <header className="bg-gradient-to-b from-slate-800 to-slate-900 pb-7 pt-3.5 rounded-b-[28px]">
          <div className="mx-auto max-w-xl px-4">
            <Link href="/" className="text-[12.5px] font-bold text-slate-300">
              → رجوع
            </Link>
            <h1 className="mt-1 text-[19px] font-black text-white">🔑 لوحة الإدارة</h1>
          </div>
        </header>
        <main className="mx-auto -mt-4 max-w-md px-4">
          <form
            onSubmit={login}
            className="rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-100 dark:border-slate-700"
          >
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-3xl shadow-lg">
                🔐
              </div>
              <h2 className="mt-3 text-[17px] font-black text-slate-900 dark:text-slate-100">
                دخول لوحة الإدارة
              </h2>
              <p className="mt-0.5 text-[12.5px] font-semibold text-slate-500 dark:text-slate-400">
                مخصصة لإدارة الدليل ومراجعة الطلبات
              </p>
            </div>

            {error && (
              <p className="mt-3 rounded-xl bg-red-50 dark:bg-red-900/30 px-3 py-2.5 text-center text-[13px] font-bold text-red-600 dark:text-red-400">
                ⚠️ {error}
              </p>
            )}
            {connErr && !error && (
              <p className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 px-3 py-2.5 text-center text-[12.5px] font-bold leading-relaxed text-amber-800 dark:text-amber-200">
                📡 تعذر الاتصال بالخادم — تأكد من النت واضغط الزرار تاني
              </p>
            )}

            <div className="relative mt-4">
              <input
                autoFocus
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="كلمة المرور"
                inputMode="numeric"
                dir="ltr"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3.5 text-center text-lg font-bold tracking-[0.4em] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:tracking-normal placeholder:text-sm focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-transform active:scale-90"
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              disabled={loading}
              className="mt-3 w-full rounded-2xl bg-[#1a73e8] py-3.5 text-[15px] font-black text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "⏳ جاري التحقق..." : connErr ? "🔄 إعادة المحاولة" : "🔓 دخول"}
            </button>

            <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              🔒 الدخول للإدارة فقط — لو مش داخل امسح الكاش (Ctrl+Shift+R)
            </p>
          </form>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-2 bg-[#eef2f7] dark:bg-slate-950">
      <header className="bg-gradient-to-b from-slate-800 to-slate-900 pb-8 pt-6 rounded-b-[28px]">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[20px] font-black text-white">🔑 لوحة الإدارة</h1>
              <p className="text-[12px] text-slate-400 dark:text-slate-500">
                {rows.length} مهني • {pending.length} طلب جديد
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("janzour_admin_pw");
                setAuthed(false);
                setPw("");
              }}
              className="rounded-xl bg-white/10 px-4 py-2 text-[12px] font-bold text-white"
            >
              خروج
            </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { v: "requests", l: `📨 الطلبات (${pending.length})` },
              { v: "announce", l: "📣 إعلانات" },
              { v: "cats", l: `🏷️ التصنيفات (${cats.length})` },
              { v: "add", l: "➕ إضافة مهني" },
              { v: "all", l: `📋 المهنيين (${rows.length})` },
              { v: "messages", l: `✉️ الرسائل (${msgs.length})` },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => setTab(t.v as any)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold ${
                  tab === t.v ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "bg-white/10 text-slate-300"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-3 max-w-2xl px-4">
        {adminMsg && (
          <p role="status" className="mb-3 rounded-2xl bg-white dark:bg-slate-800 px-4 py-3 text-[13px] font-bold text-slate-700 dark:text-slate-200 shadow-sm">
            {adminMsg}
          </p>
        )}
        {connErr && (
          <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-900/30 px-4 py-3">
            <p className="text-[12.5px] font-bold text-amber-800 dark:text-amber-200">
              ⚠️ تعذر تحديث البيانات — تأكد من اتصالك بالإنترنت
            </p>
            <button
              onClick={() => load(pw.trim())}
              className="shrink-0 rounded-xl bg-amber-500 px-3 py-1.5 text-[12px] font-black text-white"
            >
              🔄 تحديث
            </button>
          </div>
        )}

        {/* طلبات الانضمام */}
        {tab === "requests" && (
          <div className="space-y-2">
            {reqs.length === 0 && (
              <div className="rounded-3xl bg-white dark:bg-slate-800 p-8 text-center text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                لا توجد طلبات انضمام حتى الآن
              </div>
            )}
            {reqs.map((r) => (
              <div
                key={r.id}
                className={`rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm border ${
                  r.status === "pending" ? "border-amber-200 dark:border-amber-800/60" : "border-slate-100 dark:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-1.5 text-[14px] font-black">
                      👤 {r.name}
                      {r.status === "pending" && (
                        <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-300">⏳ جديد</span>
                      )}
                      {r.status === "approved" && (
                        <span className="rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-[10px] text-green-700 dark:text-green-300">✅ تمت الموافقة</span>
                      )}
                      {r.status === "rejected" && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-700 dark:text-red-300">✖ مرفوض</span>
                      )}
                    </p>
                    <p className="mt-1 text-[13px] font-bold text-slate-600 dark:text-slate-300">💼 {r.profession}</p>
                    <a href={`tel:${r.phone}`} className="text-[13px] font-black text-[#1a73e8]" dir="ltr">
                      📱 {r.phone}
                    </a>
                    {r.location && <p className="text-[12px] text-slate-500 dark:text-slate-400 dark:text-slate-500">📍 {r.location}</p>}
                    {r.note && (
                      <p className="mt-1 rounded-xl bg-slate-50 dark:bg-slate-700/60 px-3 py-2 text-[12px] text-slate-600 dark:text-slate-300">{r.note}</p>
                    )}
                  </div>
                  <a
                    href={`https://wa.me/2${r.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-green-500 text-white"
                  >
                    💬
                  </a>
                </div>
                {r.status === "pending" ? (
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleRequest(r.id, "approve")}
                      className="col-span-2 rounded-xl bg-green-600 py-2.5 text-[12px] font-black text-white"
                    >
                      ✅ موافقة وإضافة للدليل
                    </button>
                    <button
                      onClick={() => handleRequest(r.id, "reject")}
                      className="rounded-xl bg-red-50 dark:bg-red-900/30 py-2.5 text-[12px] font-black text-red-600 dark:text-red-400"
                    >
                      ✖ رفض
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => delRequest(r.id)}
                    className="mt-2 w-full rounded-xl bg-slate-100 dark:bg-slate-700 py-2 text-[12px] font-black text-slate-600 dark:text-slate-300"
                  >
                    🗑️ حذف الطلب
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* الإعلانات */}
        {tab === "announce" && (
          <div className="space-y-3">
            <form
              onSubmit={postAnnouncement}
              className="rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3"
            >
              <h2 className="font-black text-[15px]">📣 نشر إعلان في أعلى الموقع</h2>
              {aMsgOut && (
                <p className="rounded-xl bg-slate-50 dark:bg-slate-700/60 px-3 py-2 text-[13px] font-bold text-slate-700 dark:text-slate-200">
                  {aMsgOut}
                </p>
              )}
              <input
                value={aTitle}
                onChange={(e) => setATitle(e.target.value)}
                placeholder="عنوان الإعلان (مثال: تهنئة عيد الفطر)"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              />
              <textarea
                value={aMsg}
                onChange={(e) => setAMsg(e.target.value)}
                placeholder="نص الإعلان (مثال: كل سنة وأنتم طيبين من إدارة دليل مهن جنزور)"
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              />
              <button className="w-full rounded-2xl bg-[#1a73e8] py-3 text-[14px] font-black text-white">
                📤 نشر الإعلان
              </button>
            </form>

            <div className="space-y-2">
              {anns.length === 0 && (
                <p className="rounded-3xl bg-white dark:bg-slate-800 p-6 text-center text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  لا توجد إعلانات منشورة
                </p>
              )}
              {anns.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-1.5 text-[14px] font-black">
                        📣 {a.title}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${
                            a.active
                              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {a.active ? "نشط ✅" : "مخفي"}
                        </span>
                      </p>
                      <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-300">{a.message}</p>
                      {a.createdAt && (
                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                          {new Date(a.createdAt).toLocaleString("ar-EG")}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <button
                        onClick={() => toggleAnn(a.id, !a.active)}
                        className={`rounded-xl px-3 py-1.5 text-[11px] font-black ${
                          a.active
                            ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {a.active ? "🙈 إخفاء" : "👁️ تفعيل"}
                      </button>
                      <button
                        onClick={() => delAnn(a.id)}
                        className="rounded-xl bg-red-50 dark:bg-red-900/30 px-3 py-1.5 text-[11px] font-black text-red-600 dark:text-red-400"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* التصنيفات */}
        {tab === "cats" && (
          <div className="space-y-3">
            <form
              onSubmit={addCat}
              className="rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3"
            >
              <h2 className="font-black text-[15px]">➕ إضافة تصنيف جديد</h2>
              {cMsgOut && (
                <p className="rounded-xl bg-slate-50 dark:bg-slate-700/60 px-3 py-2 text-[13px] font-bold text-slate-700 dark:text-slate-200">
                  {cMsgOut}
                </p>
              )}
              <div className="flex gap-2">
                <div className="relative shrink-0">
                  <span
                    className="pointer-events-none absolute -top-2 -left-2 grid h-7 w-7 place-items-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-base"
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCIcon(
                        ICON_CHOICES[
                          Math.floor(Math.random() * ICON_CHOICES.length)
                        ]
                      )
                    }
                    className="grid h-[52px] w-[52px] place-items-center rounded-2xl border-2 border-[#1a73e8] bg-blue-50 dark:bg-blue-900/30 text-2xl"
                    title="تغيير الأيقونة"
                  >
                    {cIcon}
                  </button>
                </div>
                <input
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="اسم التصنيف * (مثال: صيانة مكيفات)"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <p className="mb-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                  القسم الرئيسي (الزر اللي هيظهر تحته):
                </p>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {SECTIONS_LIST.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setCSection(s.name)}
                      className={`shrink-0 rounded-xl border-2 px-3 py-2 text-[12px] font-black transition-all ${
                        cSection === s.name
                          ? "border-[#1a73e8] bg-blue-50 dark:bg-blue-900/30 text-[#1a73e8] dark:text-blue-300"
                          : "border-slate-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {s.icon} {s.name}
                    </button>
                  ))}
                </div>
              </div>
              <input
                value={cDesc}
                onChange={(e) => setCDesc(e.target.value)}
                placeholder="وصف مختصر (اختياري)"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              />
              <div>
                <p className="mb-1.5 text-[12px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  اختار الأيقونة:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ICON_CHOICES.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setCIcon(ic)}
                      className={`grid h-9 w-9 place-items-center rounded-xl border-2 text-lg transition-all ${
                        cIcon === ic
                          ? "border-[#1a73e8] bg-blue-50 dark:bg-blue-900/30"
                          : "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60"
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full rounded-2xl bg-[#1a73e8] py-3 text-[14px] font-black text-white">
                💾 إضافة التصنيف
              </button>
            </form>

            <div className="space-y-2">
              {cats.length === 0 && (
                <p className="rounded-3xl bg-white dark:bg-slate-800 p-6 text-center text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  لا توجد تصنيفات
                </p>
              )}
              {cats.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-slate-100 dark:border-slate-700"
                >
                  {editId === c.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 rounded-xl border border-[#1a73e8] bg-blue-50/40 px-3 py-2 text-[14px] font-bold focus:outline-none"
                        />
                        <button
                          onClick={() => saveCat(c.id)}
                          className="rounded-xl bg-green-600 px-3 py-2 text-[12px] font-black text-white"
                        >
                          💾 حفظ
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-2 text-[12px] font-black text-slate-600 dark:text-slate-300"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {ICON_CHOICES.map((ic) => (
                          <button
                            key={ic}
                            type="button"
                            onClick={() => setEditIcon(ic)}
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 text-lg ${
                              editIcon === ic
                                ? "border-[#1a73e8] bg-blue-50 dark:bg-blue-900/30"
                                : "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60"
                            }`}
                          >
                            {ic}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-xl">
                        {c.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-black">{c.name}</p>
                        <p className="text-[11.5px] font-bold text-slate-400 dark:text-slate-500">
                          {c.section ?? "الحرفيين"} • {c.count ?? 0} مهني
                        </p>
                      </div>
                      <button
                        onClick={() => startEdit(c)}
                        className="rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-2 text-[12px] font-black text-slate-700 dark:text-slate-200"
                      >
                        ✏️ تعديل
                      </button>
                      <button
                        onClick={() => delCat(c.id, c.name)}
                        className="rounded-xl bg-red-50 dark:bg-red-900/30 px-3 py-2 text-[12px] font-black text-red-600 dark:text-red-400"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* إضافة مهني */}
        {tab === "add" && (
          <form onSubmit={addCraftsman} className="rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
            <h2 className="font-black text-[15px]">➕ إضافة مهني جديد للدليل</h2>
            {formMsg && (
              <p className="rounded-xl bg-slate-50 dark:bg-slate-700/60 px-3 py-2 text-[13px] font-bold text-slate-700 dark:text-slate-200">{formMsg}</p>
            )}
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="الاسم بالكامل *"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
            <input
              value={form.profession}
              onChange={(e) => setForm({ ...form, profession: e.target.value })}
              placeholder="المهنة * (مثال: كهربائي منازل)"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="01xxxxxxxxx *"
                dir="ltr"
                inputMode="tel"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-left text-[14px] font-bold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              />
              <input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="واتساب (اختياري)"
                dir="ltr"
                inputMode="tel"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-left text-[14px] font-bold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              />
            </div>
            <Dropdown
              value={form.categoryId}
              onChange={(v) => setForm({ ...form, categoryId: v })}
              options={cats.map((c) => ({
                value: String(c.id),
                label: `${c.icon} ${c.name}`,
              }))}
              placeholder="— التصنيف —"
            />
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="📍 العنوان يدوياً... مثال: جنزور - أمام السوق"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="علامة مميزة (اختياري)"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] font-semibold focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="نبذة عن الخدمات..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 px-4 py-3 text-[14px] focus:border-[#1a73e8] focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <Dropdown
                value={form.experienceYears}
                onChange={(v) => setForm({ ...form, experienceYears: v })}
                options={Array.from({ length: 40 }, (_, i) => i + 1).map((n) => ({
                  value: String(n),
                  label: `${n} سنة خبرة`,
                }))}
                placeholder="سنوات الخبرة"
                icon="🕒"
              />
              <div className="flex items-center justify-around rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 px-2">
                <label className="flex items-center gap-1 text-[12px] font-bold">
                  <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} />
                  موثّق
                </label>
                <label className="flex items-center gap-1 text-[12px] font-bold">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  مميز
                </label>
              </div>
            </div>
            <button disabled={saving} className="w-full rounded-2xl bg-[#1a73e8] py-3.5 text-[15px] font-black text-white disabled:opacity-60">
              {saving ? "جاري الحفظ..." : "💾 حفظ وإضافة للدليل"}
            </button>
          </form>
        )}

        {/* كل المهنيين */}
        {tab === "all" && (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 بحث بالاسم أو المهنة أو الرقم..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-[14px] font-semibold shadow-sm focus:outline-none"
            />
            <div className="mt-3 space-y-2">
              {filtered.map((r) => (
                <div key={r.id} className="rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-1.5 text-[14px] font-black">
                        {r.name}
                        {r.verified ? (
                          <span className="rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-[10px] text-green-700 dark:text-green-300">✔ موثّق</span>
                        ) : (
                          <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-300">غير موثّق</span>
                        )}
                        {r.featured && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px]">⭐</span>}
                        {!r.available && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-700 dark:text-red-300">مخفي</span>}
                      </p>
                      <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400 dark:text-slate-500">
                        {r.profession} • {r.location} • <span dir="ltr">{r.phone}</span>
                      </p>
                    </div>
                    <Link href={`/craftsman/${r.id}`} className="shrink-0 rounded-lg bg-slate-100 dark:bg-slate-700 px-2.5 py-1.5 text-[11px] font-bold">عرض</Link>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    <button onClick={() => toggle(r.id, "verified", !r.verified)} className={`rounded-xl py-2 text-[11px] font-black ${r.verified ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-green-600 text-white"}`}>
                      {r.verified ? "إلغاء التوثيق" : "✔ توثيق"}
                    </button>
                    <button onClick={() => toggle(r.id, "featured", !r.featured)} className={`rounded-xl py-2 text-[11px] font-black ${r.featured ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-amber-400 text-amber-950"}`}>
                      {r.featured ? "إلغاء التمييز" : "⭐ تمييز"}
                    </button>
                    <button onClick={() => toggle(r.id, "available", !r.available)} className={`rounded-xl py-2 text-[11px] font-black ${r.available ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-blue-600 text-white"}`}>
                      {r.available ? "🙈 إخفاء" : "👁️ إظهار"}
                    </button>
                    <button onClick={() => del(r.id)} className="rounded-xl bg-red-50 dark:bg-red-900/30 py-2 text-[11px] font-black text-red-600 dark:text-red-400">🗑️ حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* الرسائل */}
        {tab === "messages" && (
          <div className="space-y-2">
            {msgs.length === 0 && (
              <div className="rounded-3xl bg-white dark:bg-slate-800 p-8 text-center text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">لا توجد رسائل</div>
            )}
            {msgs.map((m) => (
              <div key={m.id} className="rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-black">👤 {m.name}</span>
                  <a href={`tel:${m.phone}`} className="text-[13px] font-bold text-[#1a73e8]" dir="ltr">{m.phone}</a>
                </div>
                <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-300">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
