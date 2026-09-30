"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("janzour_theme", next ? "dark" : "light");
    } catch {}
  }

  if (!mounted) {
    return <div className="fixed top-2.5 left-2.5 z-[60] h-11 w-11" aria-hidden />;
  }

  return (
    <button
      onClick={toggle}
      title={dark ? "تفعيل الوضع النهاري ☀️" : "تفعيل الوضع الليلي 🌙"}
      aria-label={dark ? "الوضع النهاري" : "الوضع الليلي"}
      className="fixed top-2.5 left-2.5 z-[60] grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/25 text-xl shadow-lg backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
