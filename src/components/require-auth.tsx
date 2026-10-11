"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage, getFirebase } from "@/lib/firebase";
import { Button, Spinner } from "./ui";

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
      <Button
        type="button"
        onClick={handleSignOut}
        disabled={pending}
        className="bg-white text-zinc-900 hover:bg-zinc-100"
      >
        {pending ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const displayName =
    auth.status === "authenticated"
      ? auth.user.displayName ?? auth.user.email ?? "Account"
      : "";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-lg font-semibold text-zinc-900">EMI Tracker</span>
            <nav className="flex flex-wrap gap-2 text-sm">
              <Link
                href="/"
                className="rounded-md px-3 py-1.5 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                Dashboard
              </Link>
              <Link
                href="/cards"
                className="rounded-md px-3 py-1.5 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                Cards
              </Link>
            </nav>
          </div>
          {auth.status === "authenticated" ? (
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <span className="max-w-40 truncate">{displayName}</span>
              <SignOutButton />
            </div>
          ) : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
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
