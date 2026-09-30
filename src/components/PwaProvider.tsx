"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Ctx = {
  canInstall: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  install: () => Promise<"accepted" | "dismissed" | "unavailable">;
};

const PwaCtx = createContext<Ctx>({
  canInstall: false,
  isInstalled: false,
  isIOS: false,
  install: async () => "unavailable",
});

export const usePwa = () => useContext(PwaCtx);

export default function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // register service worker
    if ("serviceWorker" in navigator) {
      const onLoad = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      };
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua);
    setIsIOS(ios);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    setIsInstalled(standalone);

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setDeferred(null);
      try {
        localStorage.setItem("janzour_installed", "1");
      } catch {}
    };
    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return "unavailable" as const;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferred(null);
    return outcome;
  }, [deferred]);

  return (
    <PwaCtx.Provider
      value={{ canInstall: !!deferred, isInstalled, isIOS, install }}
    >
      {children}
    </PwaCtx.Provider>
  );
}
