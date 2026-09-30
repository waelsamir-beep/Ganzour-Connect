"use client";

import { useState } from "react";

export default function ShareButton({
  className = "",
  label = "شارك التطبيق",
  title = "دليل المهن - جنزور",
  text = "لقيت تطبيق فيه أرقام كل الحرفيين في جنزور (كهربائي، سباك، نجار...) موثوقة ومجاناً 👇",
  url,
}: {
  className?: string;
  label?: string;
  title?: string;
  text?: string;
  url?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.origin : "");
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        return;
      }
    } catch {
      /* user cancelled */
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  }

  return (
    <button onClick={share} className={className}>
      {copied ? "✅ تم نسخ الرابط" : `🔗 ${label}`}
    </button>
  );
}
