#!/usr/bin/env node
/**
 * Read-only: prints the currently deployed Firestore rules so we can compare
 * them with firestore.rules in the repo.
 *   FIREBASE_SERVICE_ACCOUNT_KEY_FILE=service-account.json node scripts/check-deployed-rules.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import admin from "firebase-admin";

const keyFile = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_FILE;
if (!keyFile) { console.error("Set FIREBASE_SERVICE_ACCOUNT_KEY_FILE"); process.exit(1); }
const resolved = path.resolve(process.cwd(), keyFile);
const project_id = JSON.parse(readFileSync(resolved, "utf8")).project_id;
const app = admin.initializeApp({ credential: admin.cert(resolved), projectId: project_id });
try {
  const rules = await app.firestore().getSecurityRules();
  console.log("=== DEPLOYED RULES ===");
  console.log(rules.rules);
} catch (err) {
  console.error(`Failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
await app.delete();
