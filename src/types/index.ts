import type { Timestamp } from "firebase/firestore";

export type AdditionalCostFrequency = "one_time" | "monthly";
export type EmiStatus = "active" | "closed";

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface EmiSplit {
  cardholderId: string;
  percentage: number;
}

export interface Card {
  id: string;
  bankName: string;
  cardLabel: string;
  last4: string;
  currency: string;
  creditLimitCents?: number;
  outstandingBalanceCents: number;
  paymentDueDay?: number;
  ownerUid: string;
  userIds: string[];
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface Cardholder {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface Emi {
  id: string;
  cardId: string;
  cardholderId: string;
  splits?: EmiSplit[];
  paidInstallmentsCount?: number;
  merchantName: string;
  purchaseDate: string;
  principalCents: number;
  downPaymentCents: number;
  interestRateAnnualPercent: number;
  tenureMonths: number;
  startMonth: string;
  processingChargeCents: number;
  additionalCostCents: number;
  additionalCostFrequency: AdditionalCostFrequency;
  status: EmiStatus;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface CardInput {
  bankName: string;
  cardLabel: string;
  last4: string;
  currency: string;
  creditLimitCents?: number;
  outstandingBalanceCents: number;
  paymentDueDay?: number;
  authorizedUserIds: string[];
}

export interface CardFormValues {
  bankName: string;
  cardLabel: string;
  last4: string;
  currency: string;
  creditLimit: string;
  outstandingBalance: string;
  paymentDueDay: string;
  authorizedUserIds: string;
}

export interface CardholderInput {
  name: string;
  phone?: string;
  email?: string;
}

export interface CardholderFormValues {
  name: string;
  phone: string;
  email: string;
}

export interface EmiInput {
  cardholderId: string;
  splits?: EmiSplit[];
  paidInstallmentsCount?: number;
  merchantName: string;
  purchaseDate: string;
  principalCents: number;
  downPaymentCents: number;
  interestRateAnnualPercent: number;
  tenureMonths: number;
  startMonth: string;
  processingChargeCents: number;
  additionalCostCents: number;
  additionalCostFrequency: AdditionalCostFrequency;
  status: EmiStatus;
}

export interface EmiFormValues {
  cardholderId: string;
  splits?: EmiSplit[];
  paidInstallmentsCount: string;
  merchantName: string;
  purchaseDate: string;
  principalAmount: string;
  downPayment: string;
  interestRateAnnualPercent: string;
  tenureMonths: string;
  startMonth: string;
  processingCharge: string;
  additionalCost: string;
  additionalCostFrequency: AdditionalCostFrequency;
  status: EmiStatus;
}
