#!/usr/bin/env node
/**
 * Read-only diagnostic for the live cards collection.
 * Prints each card's full document and its subcollection documents so we can
 * determine which Firebase UID owns each legacy card (missing ownerUid).
 *
 *   FIREBASE_SERVICE_ACCOUNT_KEY_FILE=service-account.json \
 *     node scripts/diagnose-cards.mjs
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

try {
  const cardsSnapshot = await db.collection("cards").get();
  for (const cardDoc of cardsSnapshot.docs) {
    console.log(`\n=== CARD ${cardDoc.id} ===`);
    console.log(JSON.stringify(cardDoc.data(), null, 2));

    for (const subcollection of ["cardholders", "emis"]) {
      const snapshot = await db.collection(`cards/${cardDoc.id}/${subcollection}`).get();
      console.log(`--- ${subcollection}: ${snapshot.size} doc(s) ---`);
      for (const docRef of snapshot.docs) {
        console.log(`${docRef.id}:`, JSON.stringify(docRef.data(), null, 2));
      }
    }
  }
} catch (err) {
  console.error(`Diagnosis failed: ${getErrMessage(err)}`);
  process.exit(1);
}

await app.delete();
