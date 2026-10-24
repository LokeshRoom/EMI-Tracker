#!/usr/bin/env node
/**
 * One-time security migration — admin variant (for the live project).
 *
 * Copies each card's `userIds` onto its cardholders and EMIs so the tightened
 * Firestore rules can protect those subcollections (rules check a denormalized
 * `userIds` field on every subcollection document).
 *
 * Unlike scripts/backfill-card-membership.mjs, this runs with a Firebase service
 * account via the Admin SDK, which bypasses security rules. It backfills ALL
 * cards in one run — no per-owner credentials needed. Use it for production;
 * keep the user-credential script for local/emulator testing.
 *
 * Setup:
 * 1. Create a dedicated service account (Firebase Console → Project settings →
 *    Service accounts → Create service account). Grant it only the "Editor"
 *    role on this project's Firestore database — not full admin.
 * 2. Download the JSON key and save it as `service-account.json` in the repo
 *    root (git-ignored). Do NOT commit or share it.
 * 3. Dry-run first to see how many documents would be updated:
 *      FIREBASE_SERVICE_ACCOUNT_KEY_FILE=service-account.json \
 *        FIREBASE_BACKFILL_DRY_RUN=1 node scripts/backfill-card-membership-admin.mjs
 * 4. Run for real (same env vars, without FIREBASE_BACKFILL_DRY_RUN), then run
 *     `firebase deploy` to publish the tightened rules.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

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

const keyFile = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_FILE;
if (!keyFile) {
  console.error("Set FIREBASE_SERVICE_ACCOUNT_KEY_FILE to a service account JSON key file.");
  process.exit(1);
}

loadEnv();

let app;
try {
  const resolvedKeyFile = path.resolve(process.cwd(), keyFile);
  // Read the key only for projectId; admin.cert() reads it again internally.
  const project_id = JSON.parse(readFileSync(resolvedKeyFile, "utf8")).project_id;
  app = admin.initializeApp({
    credential: admin.cert(resolvedKeyFile),
    projectId: process.env.FIREBASE_PROJECT_ID || project_id,
  });
} catch (err) {
  console.error(`Could not initialize Firebase Admin SDK: ${getErrMessage(err)}`);
  process.exit(1);
}

function getErrMessage(err) {
  return err instanceof Error ? err.message : String(err);
}

const db = getFirestore(app);
const dryRun = process.env.FIREBASE_BACKFILL_DRY_RUN === "1";

let cardsChecked = 0;
let docsUpdated = 0;
let docsSkipped = 0;
let cardsWarned = 0;

try {
  const cardsSnapshot = await db.collection("cards").get();

  for (const cardDoc of cardsSnapshot.docs) {
    // Note: in the Firestore client used here, doc data is read via doc.data()
    // (a method), not a .data property.
    const cardData = cardDoc.data();
    // Legacy cards may predate the ownerUid field; skip them so we never
    // write an empty/undefined membership list that would lock everyone out.
    const ownerUid = cardData.ownerUid;
    if (!ownerUid) {
      console.warn(`Skipping card "${cardDoc.id}": missing ownerUid.`);
      cardsWarned += 1;
      continue;
    }
    // Fall back to the owner if a card somehow has no userIds, so the owner
    // never loses access after the rules tighten.
    const existingUserIds = Array.isArray(cardData.userIds) ? cardData.userIds : [];
    const userIds = existingUserIds.length > 0 ? existingUserIds : [ownerUid];
    for (const subcollection of ["cardholders", "emis"]) {
      const snapshot = await db.collection(`cards/${cardDoc.id}/${subcollection}`).get();
      for (const docRef of snapshot.docs) {
        if (!docRef.data().userIds) {
          if (dryRun) {
            docsUpdated += 1;
          } else {
            await docRef.ref.set({ userIds }, { merge: true });
            docsUpdated += 1;
          }
        } else {
          docsSkipped += 1;
        }
      }
    }
    cardsChecked += 1;
  }

  const warning = cardsWarned > 0 ? `, ${cardsWarned} card(s) skipped due to missing ownerUid` : "";
  console.log(
    dryRun
      ? `Dry run complete: ${cardsChecked} card(s) checked, ${docsUpdated} document(s) would be updated${warning}.`
      : `Backfilled ${cardsChecked} card(s); updated ${docsUpdated} document(s), skipped ${docsSkipped}${warning}.`
  );
} catch (err) {
  console.error(`Backfill failed: ${getErrMessage(err)}`);
  process.exit(1);
}

await app.delete();
