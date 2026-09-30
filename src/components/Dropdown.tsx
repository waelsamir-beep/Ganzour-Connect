"use client";

import { useEffect, useRef, useState } from "react";

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "اختر...",
  icon,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  icon?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQ("");
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.value === value);
  const filtered = q
    ? options.filter((o) => o.label.includes(q))
    : options;
  const showSearch = options.length > 8;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center gap-2 rounded-2xl border px-4 py-3 text-right text-[14px] font-bold shadow-sm transition-all ${
          open
            ? "border-[#1a73e8] bg-blue-50/40 ring-2 ring-blue-100 dark:ring-blue-900"
            : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-300"
        }`}
      >
        {icon && <span className="text-base">{icon}</span>}
        <span
          className={`flex-1 truncate ${
            selected ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className={`shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="anim-pop absolute inset-x-0 top-full z-50 mt-1.5 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_20px_50px_rgba(16,24,40,0.18)]">
          {showSearch && (
            <div className="border-b border-slate-100 dark:border-slate-700 p-2">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="🔍 ابحث في القائمة..."
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-700/60 px-3 py-2 text-[13px] font-semibold focus:outline-none"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-center text-[13px] font-bold text-slate-400 dark:text-slate-500">
                لا توجد نتائج
              </p>
            )}
            {filtered.map((o) => {
              const isSel = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setQ("");
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-right text-[14px] font-bold transition-colors ${
                    isSel
                      ? "bg-blue-50 dark:bg-blue-900/30 text-[#1a73e8]"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="truncate">{o.label}</span>
                  {isSel && <span className="shrink-0 text-[13px]">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
