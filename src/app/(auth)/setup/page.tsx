"use client";

import { isFirebaseConfigured } from "@/lib/firebase";
import { ErrorNotice } from "@/components/ui";

const requiredVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

export default function SetupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-50">Firebase setup</h2>
        <p className="mt-1 text-sm text-slate-400">
          Add your Firebase web app environment variables to start using EMI Tracker.
        </p>
      </div>
      {!isFirebaseConfigured ? (
        <ErrorNotice message="Firebase is not configured yet." />
      ) : null}
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-300">
        <li>Copy the Firebase web app config from the Firebase console.</li>
        <li>Add the values below to your local environment file.</li>
        <li>Restart the development server and reload the app.</li>
      </ol>
      <div className="rounded-xl border border-white/15 bg-slate-900/80 p-3 font-mono text-xs text-slate-300 backdrop-blur-md">
        {requiredVars.map((name) => (
          <div key={name}>{`${name}=""`}</div>
        ))}
      </div>
    </div>
  );
}
