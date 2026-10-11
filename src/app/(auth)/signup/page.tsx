"use client";

import Link from "next/link";
import { SignupForm } from "@/components/auth-forms";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Create account</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Set up a Firebase account to start tracking EMIs.
        </p>
      </div>
      <SignupForm />
      <p className="text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
