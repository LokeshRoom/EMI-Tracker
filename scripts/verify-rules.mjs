#!/usr/bin/env node
/**
 * End-to-end Firestore security rules test using local emulators.
 * Requires Java 11+ (the Firestore emulator is a Java app).
 *
 *   node scripts/verify-rules.mjs
 *
 * Spawns `firebase emulators:start` (config from .firebaserc), creates two users,
 * seeds a card plus subcollection documents carrying the denormalized userIds
 * field, then asserts:
 *   - members can read/write their own card data;
 *   - outsiders cannot read or write any of it;
 *   - unauthenticated clients are denied.
 */
import { spawn } from "node:child_process";
import path from "node:path";

const PROJECT_ID = "emi-tracker-local-test";
const AUTH_PORT = 9099;
const FIRESTORE_PORT = 8080;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createUser(email, password) {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      const res = await fetch(
        `http://127.0.0.1:${AUTH_PORT}/auth/v1/projects/${PROJECT_ID}/accounts:signUp`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }
      );
      if (!res.ok) throw new Error(`signUp failed: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      if (attempt === 30) throw err;
      await sleep(2000);
    }
  }
}

async function makeClient(idToken) {
  const { initializeApp } = await import("firebase/app");
  const { getAuth, signInWithToken } = await import("firebase/auth");
  const { getFirestore } = await import("firebase/firestore");

  const app = initializeApp({ apiKey: "test", projectId: PROJECT_ID });
  const auth = getAuth(app);
  auth.useEmulator({ host: "localhost", port: AUTH_PORT });
  if (idToken) await signInWithToken(auth, idToken);
  return getFirestore(app).useEmulator({ host: "localhost", port: FIRESTORE_PORT });
}

async function retry(fn) {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === 30) throw err;
      await sleep(2000);
    }
  }
}

async function seed(db, uidA) {
  const cardRef = await retry(() =>
    import("firebase/firestore").then(async ({ collection, setDoc }) =>
      setDoc(collection(db, "cards"), {
        bankName: "Test Bank",
        cardLabel: "Test Card",
        last4: "0000",
        currency: "INR",
        outstandingBalanceCents: 0,
        ownerUid: uidA,
        userIds: [uidA],
      })
    )
  );
  const emiRef = await retry(() =>
    import("firebase/firestore").then(async ({ collection, setDoc }) =>
      setDoc(collection(db, "cards", cardRef.id, "emis"), {
        merchantName: "Test Merchant",
        principalCents: 100000,
        downPaymentCents: 0,
        interestRateAnnualPercent: 12,
        tenureMonths: 12,
        startMonth: "2026-11",
        processingChargeCents: 0,
        additionalCostCents: 0,
        additionalCostFrequency: "one_time",
        status: "active",
        userIds: [uidA],
      })
    )
  );
  await retry(() =>
    import("firebase/firestore").then(async ({ collection, setDoc }) =>
      setDoc(collection(db, "cards", cardRef.id, "cardholders"), {
        name: "Test Holder",
        email: "holder@example.com",
        userIds: [uidA],
      })
    )
  );
  return { cardId: cardRef.id, emiId: emiRef.id };
}

async function main() {
  const cli = path.resolve(process.cwd(), "node_modules/firebase-tools/bin/firebase");
  let emulatorProcess;
  try {
    emulatorProcess = spawn(process.execPath, [cli, "emulators", "start"], { cwd: process.cwd() });
    emulatorProcess.on("error", (err) => console.error(`emulator start failed: ${err.message}`));
  } catch (err) {
    console.error(`Could not start emulators automatically (${err.message}).`);
    console.error("Start them manually first, then re-run this script:");
    console.error("  npx firebase emulators:start");
    process.exit(1);
  }

  try {
    const userA = await createUser("user-a@example.com", "password-A-1234567890");
    const userB = await createUser("user-b@example.com", "password-B-1234567890");

    const dbA = await makeClient(userA.idToken);
    const dbB = await makeClient(userB.idToken);
    const dbU = await makeClient(null); // unauthenticated client

    const { cardId, emiId } = await seed(dbA, userA.uid);

    const results = [];
    async function expectOk(label, fn) {
      try {
        await fn();
        results.push({ label, pass: true });
      } catch (err) {
        results.push({ label, pass: false, detail: err.message });
      }
    }
    async function expectDenied(label, fn) {
      try {
        await fn();
        results.push({ label, pass: false, detail: "expected denial but the operation succeeded" });
      } catch (err) {
        results.push({ label, pass: true, detail: `denied (${err.code ?? err.message})` });
      }
    }

    const { doc, getDoc, setDoc, collection } = await import("firebase/firestore");

    await expectOk("member reads own card", () =>
      getDoc(dbA, doc(collection(dbA, "cards"), cardId))
    );
    await expectOk("member reads own EMI", () =>
      getDoc(dbA, doc(collection(dbA, "cards", cardId, "emis", emiId)))
    );
    await expectDenied("outsider reads card", () =>
      getDoc(dbB, doc(collection(dbB, "cards"), cardId))
    );
    await expectDenied("outsider reads EMI", () =>
      getDoc(dbB, doc(collection(dbB, "cards", cardId, "emis", emiId)))
    );
    await expectDenied("outsider writes EMI", () =>
      setDoc(
        dbB,
        doc(collection(dbB, "cards", cardId, "emis", emiId)),
        { merchantName: "Tampered" },
        { merge: true }
      )
    );
    await expectDenied("unauthenticated reads card", () =>
      getDoc(dbU, doc(collection(dbU, "cards"), cardId))
    );

    console.log("\nFirestore rules verification results:\n");
    for (const result of results) {
      const status = result.pass ? "PASS" : "FAIL";
      console.log(`  [${status}] ${result.label}${result.detail ? ` — ${result.detail}` : ""}`);
    }

    process.exitCode = results.every((r) => r.pass) ? 0 : 1;
  } finally {
    if (emulatorProcess) emulatorProcess.kill();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
