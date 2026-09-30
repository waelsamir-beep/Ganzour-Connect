import { DESIGNER_NAME, DESIGNER_PHONE, FULL_ADDRESS } from "@/lib/constants";

export default function SiteFooter() {
  return (
    <footer className="mt-4 pb-28">
      <div className="mx-auto max-w-xl px-4">
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-3 text-center text-white shadow-md">
          <p className="text-[10.5px] font-semibold text-slate-400">
            🛠️ دليل المهن جنزور • {FULL_ADDRESS}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="text-[11.5px] font-bold text-slate-300">
              تصميم وتنفيذ
            </span>
            <span className="text-[13px] font-black text-white">
              {DESIGNER_NAME}
            </span>
            <a
              href={`tel:${DESIGNER_PHONE}`}
              className="rounded-lg bg-[#1a73e8] px-2.5 py-1 text-[11px] font-black text-white"
              dir="ltr"
            >
              📞 {DESIGNER_PHONE}
            </a>
            <a
              href={`https://wa.me/2${DESIGNER_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="واتساب المصمم"
              className="grid h-6 w-6 place-items-center rounded-lg bg-[#22c55e] text-[12px]"
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
