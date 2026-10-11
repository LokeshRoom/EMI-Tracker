"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Sign in</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Use your Firebase account to access your dashboard.
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-zinc-500">
        New to EMI Tracker?{" "}
        <Link href="/signup" className="font-medium text-zinc-900 underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
