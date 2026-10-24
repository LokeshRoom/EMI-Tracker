"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage, getFirebase } from "@/lib/firebase";
import { SecondaryButton, Spinner } from "./ui";
import { NotificationBell } from "./notifications";

function SignOutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setPending(true);
    setError(null);
    try {
      const firebase = getFirebase();
      if (!firebase) return;
      await signOut(firebase.auth);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
      <SecondaryButton
        type="button"
        onClick={handleSignOut}
        disabled={pending}
      >
        {pending ? "Signing out..." : "Sign out"}
      </SecondaryButton>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName =
    auth.status === "authenticated"
      ? auth.user.displayName ?? auth.user.email ?? "Account"
      : "";
  const initial = displayName.charAt(0).toUpperCase() || "U";

  const isDashboardActive = pathname === "/";
  const isCardsActive = pathname.startsWith("/cards") && pathname !== "/cards/new";
  const isNewCardActive = pathname === "/cards/new";
  const isCardholdersActive = pathname === "/cardholders";

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3.5">
          <div className="flex items-center gap-7">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-slate-900 shadow-lg shadow-amber-900/30 transition-transform duration-200 group-hover:scale-105">
                ₹
              </span>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-50">
                EMI Tracker
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm">
              <Link
                href="/"
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors duration-200 ${
                  isDashboardActive
                    ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/cards"
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors duration-200 ${
                  isCardsActive
                    ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                Cards & EMIs
              </Link>
              <Link
                href="/cardholders"
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors duration-200 ${
                  isCardholdersActive
                    ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                Cardholders
              </Link>
              <Link
                href="/cards/new"
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors duration-200 ${
                  isNewCardActive
                    ? "bg-violet-500/10 text-violet-300 border border-violet-400/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                + Add Card
              </Link>
            </nav>
          </div>

          {auth.status === "authenticated" ? (
            <div className="flex items-center gap-2 sm:gap-3.5">
              <NotificationBell />
              <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 py-1 pl-1.5 pr-3 backdrop-blur-md shadow-xs">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-[11px] font-bold text-white">
                  {initial}
                </span>
                <span className="max-w-32 truncate text-xs font-medium text-slate-200">
                  {displayName}
                </span>
              </div>
              <div className="hidden sm:block">
                <SignOutButton />
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-3.5 py-4 pb-28 sm:px-6 sm:py-8 sm:pb-12">
        {children}
      </main>

      {/* Mobile Profile Dialog / Drawer if triggered */}
      {showProfileMenu ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md sm:hidden p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                {initial}
              </span>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-100 truncate">{displayName}</p>
                <p className="text-xs text-slate-400 truncate">{auth.status === "authenticated" ? auth.user.email : ""}</p>
              </div>
            </div>
            <div className="py-3 flex flex-col gap-2">
              <Link
                href="/cards/new"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition-colors duration-200 hover:bg-white/10 cursor-pointer"
              >
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add new card
              </Link>
              <Link
                href="/cards"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition-colors duration-200 hover:bg-white/10 cursor-pointer"
              >
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Manage cards
              </Link>
              <Link
                href="/cardholders"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition-colors duration-200 hover:bg-white/10 cursor-pointer"
              >
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Global Cardholders
              </Link>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowProfileMenu(false)}
                className="text-xs font-medium text-slate-400 px-3 py-2 transition-colors duration-200 hover:text-slate-200 cursor-pointer"
              >
                Close
              </button>
              <SignOutButton />
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile Bottom Navigation Bar (Elevated 4-Item + Center Quick Action) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-slate-950/80 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:hidden"
      >
        <div className="flex items-center justify-between relative max-w-md mx-auto">
          {/* Tab 1: Home */}
          <Link
            href="/"
            className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium transition-colors duration-200 ${
              isDashboardActive
                ? "text-amber-300 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isDashboardActive ? 2.3 : 1.8}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </Link>

          {/* Tab 2: Cards */}
          <Link
            href="/cards"
            className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium transition-colors duration-200 ${
              isCardsActive
                ? "text-amber-300 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isCardsActive ? 2.3 : 1.8}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span>Cards</span>
          </Link>

          {/* Center Elevated Action: Add Card */}
          <div className="flex flex-1 items-center justify-center -translate-y-5">
            <Link
              href="/cards/new"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 shadow-lg shadow-amber-900/40 ring-4 ring-slate-950 transition-all duration-200 hover:from-amber-300 hover:to-orange-400 active:scale-90"
              aria-label="Add Card"
            >
              <svg className="h-6 w-6 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>

          {/* Tab 3: Cardholders (Global) */}
          <Link
            href="/cardholders"
            className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium transition-colors duration-200 ${
              isCardholdersActive
                ? "text-amber-300 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isCardholdersActive ? 2.3 : 1.8}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Holders</span>
          </Link>

          {/* Tab 4: Profile / Menu */}
          <button
            type="button"
            onClick={() => setShowProfileMenu(true)}
            className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-slate-300">
              {initial}
            </span>
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.status === "unauthenticated") router.replace("/login");
    if (auth.status === "unconfigured") router.replace("/setup");
  }, [auth.status, router]);

  if (
    auth.status === "loading" ||
    auth.status === "unauthenticated" ||
    auth.status === "unconfigured"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Spinner />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
