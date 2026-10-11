"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirebase, isFirebaseConfigured } from "@/lib/firebase";

export type AuthState =
  | { status: "loading" }
  | { status: "unconfigured" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: User };

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(() =>
    isFirebaseConfigured ? { status: "loading" } : { status: "unconfigured" }
  );

  useEffect(() => {
    const firebase = getFirebase();
    if (!firebase) return;

    const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
      setState(user ? { status: "authenticated", user } : { status: "unauthenticated" });
    });

    return unsubscribe;
  }, []);

  return state;
}
