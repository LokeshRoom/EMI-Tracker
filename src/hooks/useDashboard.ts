"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getCardsForUser, getEmisForCard } from "@/lib/firebase-data";
import { calculateEmi, type EmiCalculation } from "@/lib/emi";
import type { Card, Emi } from "@/types";

export interface DashboardData {
  cards: Card[];
  activeEmis: { emi: Emi; card: Card }[];
  calculations: { emi: Emi; calculation: EmiCalculation }[];
  totalOutstandingCents: number;
  monthlyCommitmentCents: number;
  totalInterestCents: number;
  totalGstCents: number;
  recentEmis: { emi: Emi; card: Card }[];
}

async function getDashboardData(uid: string): Promise<DashboardData> {
  const cards = await getCardsForUser(uid);
  const cardsWithEmis = await Promise.all(
    cards.map(async (card) => ({
      card,
      emis: await getEmisForCard(card.id),
    }))
  );

  const activeEmis = cardsWithEmis.flatMap(({ card, emis }) =>
    emis
      .filter((emi) => emi.status === "active")
      .map((emi) => ({ emi, card }))
  );

  const calculations = activeEmis.map(({ emi }) => ({
    emi,
    calculation: calculateEmi({
      principalCents: emi.principalCents,
      annualInterestRatePercent: emi.interestRateAnnualPercent,
      tenureMonths: emi.tenureMonths,
      startMonth: emi.startMonth,
      downPaymentCents: emi.downPaymentCents,
      processingChargeCents: emi.processingChargeCents,
      additionalCostCents: emi.additionalCostCents,
      additionalCostFrequency: emi.additionalCostFrequency,
    }),
  }));

  const totalOutstandingCents = cards.reduce(
    (sum, card) => sum + card.outstandingBalanceCents,
    0
  );
  const monthlyCommitmentCents = calculations.reduce(
    (sum, item) => sum + item.calculation.emiCents,
    0
  );
  const totalInterestCents = calculations.reduce(
    (sum, item) => sum + item.calculation.totalInterestCents,
    0
  );
  const totalGstCents = calculations.reduce(
    (sum, item) => sum + item.calculation.totalGstCents,
    0
  );
  const recentEmis = activeEmis
    .sort(
      (a, b) =>
        (b.emi.updatedAt ? b.emi.updatedAt.toMillis() : 0) -
        (a.emi.updatedAt ? a.emi.updatedAt.toMillis() : 0)
    )
    .slice(0, 5);

  return {
    cards,
    activeEmis,
    calculations,
    totalOutstandingCents,
    monthlyCommitmentCents,
    totalInterestCents,
    totalGstCents,
    recentEmis,
  };
}

export function useDashboard() {
  const auth = useAuth();
  const uid = auth.status === "authenticated" ? auth.user.uid : undefined;

  return useQuery({
    queryKey: ["dashboard", uid],
    enabled: Boolean(uid),
    queryFn: () => getDashboardData(uid as string),
  });
}
