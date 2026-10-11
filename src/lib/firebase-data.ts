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
import { getFirebase } from "@/lib/firebase";
import type { Card, Cardholder, CardInput, Emi, EmiInput } from "@/types";

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
  return { id: snapshot.id, ...snapshot.data() } as Card;
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
  if (input.creditLimitCents !== undefined) {
    data.creditLimitCents = input.creditLimitCents;
  }
  if (input.paymentDueDay !== undefined) {
    data.paymentDueDay = input.paymentDueDay;
  }
  const ref = doc(collection(db, "cards"));
  await setDoc(ref, data);
  return { id: ref.id, ...data } as Card;
}

export async function updateCard(cardId: string, input: Partial<CardInput>): Promise<Card> {
  const db = requireFirestore();
  const card = await getCard(cardId);
  if (!card) throw new Error("Card not found.");

  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };

  if (input.bankName !== undefined) data.bankName = input.bankName;
  if (input.cardLabel !== undefined) data.cardLabel = input.cardLabel;
  if (input.last4 !== undefined) data.last4 = input.last4;
  if (input.currency !== undefined) data.currency = input.currency;
  data.creditLimitCents = input.creditLimitCents ?? deleteField();
  if (input.outstandingBalanceCents !== undefined) data.outstandingBalanceCents = input.outstandingBalanceCents;
  if (input.paymentDueDay !== undefined) {
    data.paymentDueDay = input.paymentDueDay;
  }
  if (input.authorizedUserIds !== undefined) {
    data.userIds = [...new Set([card.ownerUid, ...input.authorizedUserIds])];
  }

  const ref = doc(db, "cards", cardId);
  await updateDoc(ref, data);
  const updated = await getCard(cardId);
  if (!updated) throw new Error("Card not found.");
  return updated;
}

export async function deleteCard(cardId: string): Promise<void> {
  const db = requireFirestore();
  const emiSnapshot = await getDocs(collection(db, "cards", cardId, "emis"));
  const cardholderSnapshot = await getDocs(collection(db, "cards", cardId, "cardholders"));
  const batch = writeBatch(db);

  emiSnapshot.docs.forEach((item) => batch.delete(item.ref));
  cardholderSnapshot.docs.forEach((item) => batch.delete(item.ref));
  batch.delete(doc(db, "cards", cardId));

  await batch.commit();
}

export async function getCardholders(cardId: string): Promise<Cardholder[]> {
  const db = requireFirestore();
  const q = query(collection(db, "cards", cardId, "cardholders"));
  const snapshot = await getDocs(q);
  const cardholders = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }) as Cardholder);
  return sortByTimestampDescending(cardholders);
}

export async function createCardholder(cardId: string, input: { name: string; phone?: string; email?: string }): Promise<Cardholder> {
  const db = requireFirestore();
  const now = serverTimestamp();
  const ref = doc(collection(db, "cards", cardId, "cardholders"));
  const data: Record<string, unknown> = {
    name: input.name,
    createdAt: now,
    updatedAt: now,
  };
  if (input.phone) {
    data.phone = input.phone;
  }
  if (input.email) {
    data.email = input.email;
  }
  await setDoc(ref, data);
  return { id: ref.id, ...data } as Cardholder;
}

export async function deleteCardholder(cardId: string, cardholderId: string): Promise<void> {
  const db = requireFirestore();
  await deleteDoc(doc(db, "cards", cardId, "cardholders", cardholderId));
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
  const ref = doc(collection(db, "cards", cardId, "emis"));
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
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(ref, data);
  return { id: ref.id, ...data } as Emi;
}

export async function updateEmi(cardId: string, emiId: string, input: Partial<EmiInput>): Promise<Emi> {
  const db = requireFirestore();
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
  await deleteDoc(doc(db, "cards", cardId, "emis", emiId));
}
