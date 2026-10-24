#!/usr/bin/env node
/**
 * One-time security migration.
 *
 * Copies each card's `userIds` onto its cardholders and EMIs so the tightened
 * Firestore rules can protect those subcollections (rules check a denormalized
 * `userIds` field on every subcollection document).
 *
 * Run as a CARD OWNER, before deploying the new firestore.rules:
 *   EMI_BACKFILL_EMAIL=you@example.com EMI_BACKFILL_PASSWORD=... node scripts/backfill-card-membership.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { initializeApp, getAuth, getFirestore } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, setDoc, where } from "firebase/firestore";

function loadEnv() {
  try {
    const raw = readFileSync(path.resolve(process.cwd(), ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
      if (match) process.env[match[1]] = match[2].trim();
    }
  } catch {
    // .env not present; rely on the environment instead.
  }
}

const email = process.env.EMI_BACKFILL_EMAIL;
const password = process.env.EMI_BACKFILL_PASSWORD;
if (!email || !password) {
  console.error("Set EMI_BACKFILL_EMAIL and EMI_BACKFILL_PASSWORD to run the backfill.");
  process.exit(1);
}

loadEnv();

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
});

const auth = getAuth(app);
await signInWithEmailAndPassword(auth, email, password);
const uid = auth.currentUser.uid;

const db = getFirestore(app);
const cardsSnapshot = await getDocs(
  query(collection(db, "cards"), where("ownerUid", "==", uid))
);

let cardsChecked = 0;
let docsUpdated = 0;

for (const cardDoc of cardsSnapshot.docs) {
  const userIds = cardDoc.data().userIds ?? [];
  for (const subcollection of ["cardholders", "emis"]) {
    const snapshot = await getDocs(collection(db, "cards", cardDoc.id, subcollection));
    for (const docRef of snapshot.docs) {
      if (!docRef.data().userIds) {
        await setDoc(docRef, { userIds }, { merge: true });
        docsUpdated += 1;
      }
    }
  }
  cardsChecked += 1;
}

console.log(`Backfilled ${cardsChecked} card(s); updated ${docsUpdated} document(s).`);
