import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => value.trim() !== ""
);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

export function getFirebase() {
  if (!isFirebaseConfigured) return null;

  if (!app) {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    firestoreInstance = getFirestore(app);
  }

  if (!authInstance || !firestoreInstance) return null;

  return {
    auth: authInstance,
    firestore: firestoreInstance,
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code;
    // Map well-known Firebase errors to friendly, non-leaky messages.
    if (code === "permission-denied") return "You don't have access to this data.";
    if (code === "unauthenticated") return "Please sign in again.";
    if (code === "invalid-api-key" || code === "missing-api-key") {
      return "Firebase is not configured. Check your environment variables.";
    }
    return error.message || "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
