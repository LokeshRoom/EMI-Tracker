import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import { getErrorMessage, getFirebase } from "@/lib/firebase";
import type { AccessLogEntry, Card, Cardholder, CardInput, Emi, EmiInput } from "@/types";

function requireFirestore() {
  const firebase = getFirebase();
  if (!firebase) throw new Error("Firebase is not configured.");
  return firebase.firestore;
}

function timestampMillis(value?: Timestamp | null): number {
  return value ? value.toMillis() : 0;
}

function sortByTimestampDescending<T extends { updatedAt?: Timestamp | null; createdAt?: Timestamp | null }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => timestampMillis(b.updatedAt ?? b.createdAt) - timestampMillis(a.updatedAt ?? a.createdAt)
  );
}

function currentUid() {
  return getFirebase()?.auth.currentUser?.uid ?? undefined;
}

export function isCardMember(card: Card, uid?: string): boolean {
  if (!uid) return false;
  return card.userIds?.includes(uid) ?? false;
}

function requireMembership(card: Card, uid?: string): void {
  if (!isCardMember(card, uid)) throw new Error("You don't have access to this card.");
}

function requireOwnership(card: Card, uid?: string): void {
  if (card.ownerUid !== uid) throw new Error("Only the card owner can do this.");
}

export function computeAccessChanges(
  previous: string[],
  next: string[],
  ownerUid: string
): { added: string[]; removed: string[] } {
  const prev = new Set(previous);
  const nextSet = new Set(next);
  const added = [...nextSet].filter((uid) => uid !== ownerUid && !prev.has(uid));
  const removed = [...prev].filter((uid) => uid !== ownerUid && !nextSet.has(uid));
  return { added, removed };
}

export async function getCardsForUser(uid: string): Promise<Card[]> {
  const db = requireFirestore();
  const q = query(collection(db, "cards"), where("userIds", "array-contains", uid));
  const snapshot = await getDocs(q);
  const cards = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Card);
  return sortByTimestampDescending(cards);
}

export async function getCard(cardId: string): Promise<Card | null> {
  const db = requireFirestore();
  const snapshot = await getDoc(doc(db, "cards", cardId));
  if (!snapshot.exists()) return null;
  const card = { id: snapshot.id, ...snapshot.data() } as Card;
  // Defense in depth: Firestore rules already deny non-members server-side.
  requireMembership(card, currentUid());
  return card;
}

export async function createCard(ownerUid: string, input: CardInput): Promise<Card> {
  const db = requireFirestore();
  const now = serverTimestamp();
  const userIds = [...new Set([ownerUid, ...input.authorizedUserIds])];
  const data: Record<string, unknown> = {
    bankName: input.bankName,
    cardLabel: input.cardLabel,
    last4: input.last4,
    currency: input.currency,
    outstandingBalanceCents: input.outstandingBalanceCents,
    ownerUid,
    userIds,
    createdAt: now,
    updatedAt: now,
  };
  if (input.cardOwner) {
    data.cardOwner = input.cardOwner.trim();
  }
  if (input.creditLimitCents !== undefined) {
    data.creditLimitCents = input.creditLimitCents;
  }
  if (input.paymentDueDay !== undefined) {
    data.paymentDueDay = input.paymentDueDay;
  }
  const ref = doc(collection(db, "cards"));
  // Write the card and its access-log entries in one batch so the audit
  // trail is created atomically with the grant.
  const batch = writeBatch(db);
  batch.set(ref, data);
  for (const grantedUid of input.authorizedUserIds) {
    if (grantedUid === ownerUid) continue;
    const entryRef = doc(collection(db, "cards", ref.id, "accessLog"));
    batch.set(entryRef, {
      action: "added",
      grantedUid,
      byUid: ownerUid,
      userIds,
      ownerUid,
      at: now,
    });
  }
  await batch.commit();
  return { id: ref.id, ...data } as Card;
}

export async function updateCard(cardId: string, input: Partial<CardInput>): Promise<Card> {
  const db = requireFirestore();
  const card = await getCard(cardId);
  if (!card) throw new Error("Card not found.");
  // Defense in depth: Firestore rules already deny non-owners server-side.
  requireOwnership(card, currentUid());

  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };

  if (input.bankName !== undefined) data.bankName = input.bankName;
  if (input.cardLabel !== undefined) data.cardLabel = input.cardLabel;
  if (input.last4 !== undefined) data.last4 = input.last4;
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.cardOwner !== undefined) {
    data.cardOwner = input.cardOwner ? input.cardOwner.trim() : deleteField();
  }
  data.creditLimitCents = input.creditLimitCents ?? deleteField();
  if (input.outstandingBalanceCents !== undefined) data.outstandingBalanceCents = input.outstandingBalanceCents;
  if (input.paymentDueDay !== undefined) {
    data.paymentDueDay = input.paymentDueDay;
  }
  let logEntries: Array<{ action: "added" | "removed"; grantedUid: string }> = [];
  if (input.authorizedUserIds !== undefined) {
    const nextUserIds = [...new Set([card.ownerUid, ...input.authorizedUserIds])];
    data.userIds = nextUserIds;
    const changes = computeAccessChanges(card.userIds ?? [], nextUserIds, card.ownerUid);
    logEntries = [
      ...changes.added.map((uid) => ({ action: "added" as const, grantedUid: uid })),
      ...changes.removed.map((uid) => ({ action: "removed" as const, grantedUid: uid })),
    ];
  }

  const ref = doc(db, "cards", cardId);
  // Batch the card update with its access-log entries so the audit trail is
  // written atomically with the membership change.
  const batch = writeBatch(db);
  batch.update(ref, data);
  for (const entry of logEntries) {
    batch.set(doc(collection(db, "cards", cardId, "accessLog")), {
      action: entry.action,
      grantedUid: entry.grantedUid,
      byUid: currentUid() ?? "",
      userIds: data.userIds as string[],
      ownerUid: card.ownerUid,
      at: serverTimestamp(),
    });
  }
  await batch.commit();
  const updated = await getCard(cardId);
  if (!updated) throw new Error("Card not found.");
  return updated;
}

export async function deleteCard(cardId: string): Promise<void> {
  const db = requireFirestore();
  const card = await getCard(cardId);
  if (!card) throw new Error("Card not found.");
  // Defense in depth: Firestore rules already deny non-owners server-side.
  requireOwnership(card, currentUid());

  const emiSnapshot = await getDocs(collection(db, "cards", cardId, "emis"));
  const cardholderSnapshot = await getDocs(collection(db, "cards", cardId, "cardholders"));
  const batch = writeBatch(db);

  emiSnapshot.docs.forEach((item) => batch.delete(item.ref));
  cardholderSnapshot.docs.forEach((item) => batch.delete(item.ref));
  batch.delete(doc(db, "cards", cardId));

  await batch.commit();
}

export async function getCardholders(cardId?: string, uid?: string): Promise<Cardholder[]> {
  const db = requireFirestore();
  const currentUid = uid ?? getFirebase()?.auth.currentUser?.uid;
  const list: Cardholder[] = [];
  const seenIds = new Set<string>();

  // 1. Fetch from global user cardholders
  if (currentUid) {
    try {
      const qGlobal = query(collection(db, "users", currentUid, "cardholders"));
      const snapGlobal = await getDocs(qGlobal);
      snapGlobal.docs.forEach((item) => {
        seenIds.add(item.id);
        list.push({ id: item.id, ...item.data() } as Cardholder);
      });
    } catch (err) {
      console.warn(`Could not fetch global cardholders: ${getErrorMessage(err)}`);
    }
  }

  // 2. Backward compatibility: if cardId is given, fetch from card subcollection too
  if (cardId) {
    try {
      const qCard = query(collection(db, "cards", cardId, "cardholders"));
      const snapCard = await getDocs(qCard);
      snapCard.docs.forEach((item) => {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          list.push({ id: item.id, ...item.data() } as Cardholder);
        }
      });
    } catch (err) {
      console.warn(`Could not fetch card cardholders: ${getErrorMessage(err)}`);
    }
  }

  return sortByTimestampDescending(list);
}

export async function createCardholder(
  input: { name: string; phone?: string; email: string },
  cardId?: string,
  uid?: string
): Promise<Cardholder> {
  const db = requireFirestore();
  const now = serverTimestamp();
  const currentUid = uid ?? getFirebase()?.auth.currentUser?.uid;

  const data: Record<string, unknown> = {
    name: input.name,
    email: input.email.trim(),
    createdAt: now,
    updatedAt: now,
  };
  if (input.phone) {
    data.phone = input.phone;
  }

  // Card-scoped cardholders are shared with the card's members and protected
  // by the denormalized userIds field that Firestore rules check.
  if (cardId && currentUid) {
    const card = await getCard(cardId);
    if (!card) throw new Error("Card not found.");
    data.userIds = card.userIds ?? [];
    const ref = doc(collection(db, "cards", cardId, "cardholders"));
    await setDoc(ref, data);
    return { id: ref.id, ...data } as Cardholder;
  }

  // Personal (per-user) cardholder list, private to the owner.
  if (currentUid) {
    const globalRef = doc(collection(db, "users", currentUid, "cardholders"));
    await setDoc(globalRef, data);
    return { id: globalRef.id, ...data } as Cardholder;
  }

  throw new Error("Authentication required to create a cardholder.");
}

export async function deleteCardholder(cardholderId: string, cardId?: string, uid?: string): Promise<void> {
  const db = requireFirestore();
  const currentUid = uid ?? getFirebase()?.auth.currentUser?.uid;

  if (currentUid) {
    try {
      await deleteDoc(doc(db, "users", currentUid, "cardholders", cardholderId));
    } catch {
      // not in global collection
    }
  }

  if (cardId) {
    try {
      await deleteDoc(doc(db, "cards", cardId, "cardholders", cardholderId));
    } catch {
      // not in card subcollection
    }
  }
}

export async function getEmisForCard(cardId: string): Promise<Emi[]> {
  const db = requireFirestore();
  const q = query(collection(db, "cards", cardId, "emis"));
  const snapshot = await getDocs(q);
  const emis = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Emi);
  return sortByTimestampDescending(emis);
}

export async function getEmi(cardId: string, emiId: string): Promise<Emi | null> {
  const db = requireFirestore();
  const snapshot = await getDoc(doc(db, "cards", cardId, "emis", emiId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Emi;
}

export async function createEmi(cardId: string, input: EmiInput): Promise<Emi> {
  const db = requireFirestore();
  const now = serverTimestamp();
  const card = await getCard(cardId);
  if (!card) throw new Error("Card not found.");
  const ref = doc(collection(db, "cards", cardId, "emis"));
  // Denormalize membership so Firestore rules can protect the subcollection.
  const data = {
    cardholderId: input.cardholderId,
    merchantName: input.merchantName,
    purchaseDate: input.purchaseDate,
    principalCents: input.principalCents,
    downPaymentCents: input.downPaymentCents,
    interestRateAnnualPercent: input.interestRateAnnualPercent,
    tenureMonths: input.tenureMonths,
    startMonth: input.startMonth,
    processingChargeCents: input.processingChargeCents,
    additionalCostCents: input.additionalCostCents,
    additionalCostFrequency: input.additionalCostFrequency,
    status: input.status,
    splits: input.splits ?? [],
    paidInstallmentsCount: input.paidInstallmentsCount ?? 0,
    userIds: card.userIds ?? [],
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(ref, data);
  return { id: ref.id, ...data } as Emi;
}

export async function updateEmi(cardId: string, emiId: string, input: Partial<EmiInput>): Promise<Emi> {
  const db = requireFirestore();
  // Defense in depth: Firestore rules already deny non-members server-side.
  const card = await getCard(cardId);
  if (!card) throw new Error("Card not found.");

  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };

  if (input.cardholderId !== undefined) data.cardholderId = input.cardholderId;
  if (input.merchantName !== undefined) data.merchantName = input.merchantName;
  if (input.purchaseDate !== undefined) data.purchaseDate = input.purchaseDate;
  if (input.principalCents !== undefined) data.principalCents = input.principalCents;
  if (input.downPaymentCents !== undefined) data.downPaymentCents = input.downPaymentCents;
  if (input.interestRateAnnualPercent !== undefined) data.interestRateAnnualPercent = input.interestRateAnnualPercent;
  if (input.tenureMonths !== undefined) data.tenureMonths = input.tenureMonths;
  if (input.startMonth !== undefined) data.startMonth = input.startMonth;
  if (input.processingChargeCents !== undefined) data.processingChargeCents = input.processingChargeCents;
  if (input.additionalCostCents !== undefined) data.additionalCostCents = input.additionalCostCents;
  if (input.additionalCostFrequency !== undefined) data.additionalCostFrequency = input.additionalCostFrequency;
  if (input.status !== undefined) data.status = input.status;
  if (input.splits !== undefined) data.splits = input.splits;
  if (input.paidInstallmentsCount !== undefined) data.paidInstallmentsCount = input.paidInstallmentsCount;

  const ref = doc(db, "cards", cardId, "emis", emiId);
  await updateDoc(ref, data);
  const updated = await getEmi(cardId, emiId);
  if (!updated) throw new Error("EMI not found.");
  return updated;
}

export async function deleteEmi(cardId: string, emiId: string): Promise<void> {
  const db = requireFirestore();
  // Defense in depth: Firestore rules already deny non-members server-side.
  const card = await getCard(cardId);
  if (!card) throw new Error("Card not found.");
  await deleteDoc(doc(db, "cards", cardId, "emis", emiId));
}

export async function getAccessLog(cardId: string): Promise<AccessLogEntry[]> {
  const db = requireFirestore();
  const q = query(collection(db, "cards", cardId, "accessLog"));
  const snapshot = await getDocs(q);
  // Sort by the entry's own `at` timestamp. The shared sortByTimestampDescending helper
  // requires updatedAt/createdAt fields on T, which AccessLogEntry does not have.
  const entries = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as AccessLogEntry);
  return [...entries].sort(
    (a, b) => timestampMillis(b.at ?? null) - timestampMillis(a.at ?? null)
  );
}
