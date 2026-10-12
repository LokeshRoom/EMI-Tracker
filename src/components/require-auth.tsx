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
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
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

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/70 text-zinc-900">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3.5">
          <div className="flex items-center gap-7">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-xs transition-transform group-hover:scale-105">
                ₹
              </span>
              <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
                EMI Tracker
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm">
              <Link
                href="/"
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  isDashboardActive
                    ? "bg-zinc-100 text-zinc-950 font-semibold"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/cards"
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  isCardsActive
                    ? "bg-zinc-100 text-zinc-950 font-semibold"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                Cards & EMIs
              </Link>
              <Link
                href="/cards/new"
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  isNewCardActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                + Add Card
              </Link>
            </nav>
          </div>

          {auth.status === "authenticated" ? (
            <div className="flex items-center gap-2 sm:gap-3.5">
              <NotificationBell />
              <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-zinc-200/80 bg-zinc-50/80 py-1 pl-1.5 pr-3 shadow-2xs">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                  {initial}
                </span>
                <span className="max-w-32 truncate text-xs font-medium text-zinc-700">
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs sm:hidden p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-zinc-200 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {initial}
              </span>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-zinc-900 truncate">{displayName}</p>
                <p className="text-xs text-zinc-500 truncate">{auth.status === "authenticated" ? auth.user.email : ""}</p>
              </div>
            </div>
            <div className="py-3 flex flex-col gap-2">
              <Link
                href="/cards/new"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add new card
              </Link>
              <Link
                href="/cards"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Manage all cards
              </Link>
            </div>
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowProfileMenu(false)}
                className="text-xs font-medium text-zinc-500 px-3 py-2"
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
        className="fixed bottom-0 inset-x-0 z-40 border-t border-zinc-200/90 bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:hidden"
      >
        <div className="flex items-center justify-between relative max-w-md mx-auto">
          {/* Tab 1: Home */}
          <Link
            href="/"
            className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium transition-colors ${
              isDashboardActive
                ? "text-indigo-600 font-semibold"
                : "text-zinc-500 hover:text-zinc-900"
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
            className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium transition-colors ${
              isCardsActive
                ? "text-indigo-600 font-semibold"
                : "text-zinc-500 hover:text-zinc-900"
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
              className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/35 ring-4 ring-white transition-all hover:bg-indigo-700 active:scale-90"
              aria-label="Add Card"
            >
              <svg className="h-6 w-6 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>

          {/* Tab 3: EMIs */}
          <Link
            href="/cards"
            className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span>EMIs</span>
          </Link>

          {/* Tab 4: Profile / Menu */}
          <button
            type="button"
            onClick={() => setShowProfileMenu(true)}
            className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-700">
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <Spinner />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
