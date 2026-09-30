"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "الرئيسية", icon: "🏠" },
  { href: "/add", label: "طلب انضمام", icon: "📝" },
  { href: "/admin", label: "الإدارة", icon: "🔑" },
  { href: "/contact", label: "تواصل", icon: "📞" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-xl grid-cols-4">
        {items.map((it) => {
          const active =
            it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-bold transition-colors ${
                active ? "text-[#1a73e8]" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <span className={`text-2xl leading-none ${active ? "scale-110" : ""} transition-transform`}>
                {it.icon}
              </span>
              <span>{it.label}</span>
              {active && (
                <span className="mt-0.5 h-1 w-8 rounded-full bg-[#1a73e8]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
