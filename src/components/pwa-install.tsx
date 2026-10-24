"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        Boolean((window.navigator as unknown as { standalone: boolean }).standalone))
    );
  });

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check for service worker updates
          reg.onupdatefound = () => {
            const installing = reg.installing;
            if (installing) {
              installing.onstatechange = () => {
                if (installing.state === "installed" && navigator.serviceWorker.controller) {
                  // New content available
                }
              };
            }
          };
        })
        .catch(() => {
          // SW registration ignored in dev/unsupported
        });
    }

    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }

  if (isStandalone || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-sm rounded-xl border border-white/15 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 font-bold shadow-sm">
          ₹
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Install EMI Tracker
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Add to your home screen for instant offline access and notifications.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-md bg-gradient-to-br from-violet-600 to-purple-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:from-violet-500 hover:to-purple-600 active:scale-[0.98] cursor-pointer"
            >
              Install App
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="rounded-md border border-white/15 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors duration-200 hover:bg-white/10 cursor-pointer"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
