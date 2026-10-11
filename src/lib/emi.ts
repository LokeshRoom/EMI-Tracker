import Decimal from "decimal.js";
import { monthLabelFromStartMonth } from "./money";
import type { AdditionalCostFrequency, EmiSplit } from "@/types";

export interface EmiCalculationInput {
  principalCents: number;
  annualInterestRatePercent: number;
  tenureMonths: number;
  startMonth: string;
  downPaymentCents: number;
  processingChargeCents: number;
  additionalCostCents: number;
  additionalCostFrequency: AdditionalCostFrequency;
  paidInstallmentsCount?: number;
  splits?: EmiSplit[];
}

export interface EmiScheduleItem {
  month: number;
  startMonthLabel: string;
  openingBalanceCents: number;
  emiCents: number;
  interestCents: number;
  principalCents: number;
  closingBalanceCents: number;
  isPaid: boolean;
}

export interface EmiSplitCalculation {
  cardholderId: string;
  percentage: number;
  monthlyEmiCents: number;
  totalOutlayCents: number;
  totalInterestCents: number;
}

export interface EmiCalculation {
  emiCents: number;
  totalEmiPaidCents: number;
  totalInterestCents: number;
  totalAdditionalCostCents: number;
  gstOnInterestCents: number;
  gstOnProcessingChargeCents: number;
  gstOnAdditionalCostCents: number;
  totalGstCents: number;
  totalOutlayCents: number;
  paidInstallmentsCount: number;
  remainingInstallmentsCount: number;
  remainingPrincipalBalanceCents: number;
  remainingOutlayCents: number;
  splits: EmiSplitCalculation[];
  schedule: EmiScheduleItem[];
}

const GST_RATE_PERCENT = 18;

function roundCents(value: Decimal): number {
  return value.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
}

function applyGst(cents: number): number {
  return roundCents(new Decimal(cents).mul(GST_RATE_PERCENT).div(100));
}

export function calculateEmi(input: EmiCalculationInput): EmiCalculation {
  const principal = new Decimal(input.principalCents);
  const rate = new Decimal(input.annualInterestRatePercent).div(100).div(12);
  const tenureMonths = Math.max(0, Math.trunc(input.tenureMonths));
  const rawPaid = Math.max(0, Math.trunc(input.paidInstallmentsCount ?? 0));
  const paidInstallmentsCount = Math.min(tenureMonths, rawPaid);

  if (tenureMonths === 0) {
    const totalAdditionalCostCents =
      input.additionalCostFrequency === "monthly" ? 0 : input.additionalCostCents;
    const gstOnInterestCents = 0;
    const gstOnProcessingChargeCents = applyGst(input.processingChargeCents);
    const gstOnAdditionalCostCents = applyGst(totalAdditionalCostCents);
    const totalGstCents =
      gstOnInterestCents + gstOnProcessingChargeCents + gstOnAdditionalCostCents;
    const totalOutlayCents =
      input.downPaymentCents + input.processingChargeCents + totalAdditionalCostCents + totalGstCents;

    return {
      emiCents: 0,
      totalEmiPaidCents: 0,
      totalInterestCents: 0,
      totalAdditionalCostCents,
      gstOnInterestCents,
      gstOnProcessingChargeCents,
      gstOnAdditionalCostCents,
      totalGstCents,
      totalOutlayCents,
      paidInstallmentsCount: 0,
      remainingInstallmentsCount: 0,
      remainingPrincipalBalanceCents: 0,
      remainingOutlayCents: 0,
      splits: [],
      schedule: [],
    };
  }

  let emiExact: Decimal;
  if (principal.isZero() || rate.isZero()) {
    emiExact = principal.div(tenureMonths);
  } else {
    const onePlusRate = new Decimal(1).plus(rate);
    const power = onePlusRate.pow(tenureMonths);
    emiExact = principal.mul(rate).mul(power).div(power.minus(1));
  }

  const emiRounded = emiExact.toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  let balance = principal;
  const schedule: EmiScheduleItem[] = [];

  for (let month = 1; month <= tenureMonths; month += 1) {
    const openingBalance = balance;
    const interest = balance.mul(rate).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
    const isPaid = month <= paidInstallmentsCount;

    if (month === tenureMonths) {
      const principalPayment = balance;
      const emiPayment = balance.plus(interest);
      balance = new Decimal(0);
      schedule.push({
        month,
        startMonthLabel: monthLabelFromStartMonth(input.startMonth, month - 1),
        openingBalanceCents: roundCents(openingBalance),
        emiCents: roundCents(emiPayment),
        interestCents: roundCents(interest),
        principalCents: roundCents(principalPayment),
        closingBalanceCents: 0,
        isPaid,
      });
      continue;
    }

    let principalPayment = emiRounded.minus(interest);
    if (principalPayment.lessThan(0)) principalPayment = new Decimal(0);
    if (principalPayment.greaterThan(balance)) principalPayment = balance;

    const emiPayment = principalPayment.plus(interest);
    balance = balance.minus(principalPayment);

    schedule.push({
      month,
      startMonthLabel: monthLabelFromStartMonth(input.startMonth, month - 1),
      openingBalanceCents: roundCents(openingBalance),
      emiCents: roundCents(emiPayment),
      interestCents: roundCents(interest),
      principalCents: roundCents(principalPayment),
      closingBalanceCents: roundCents(balance),
      isPaid,
    });
  }

  const totalEmiPaidCents = schedule.reduce((sum, item) => sum + item.emiCents, 0);
  const totalInterestCents = schedule.reduce((sum, item) => sum + item.interestCents, 0);
  const totalAdditionalCostCents =
    input.additionalCostFrequency === "monthly"
      ? input.additionalCostCents * tenureMonths
      : input.additionalCostCents;

  const gstOnInterestCents = applyGst(totalInterestCents);
  const gstOnProcessingChargeCents = applyGst(input.processingChargeCents);
  const gstOnAdditionalCostCents = applyGst(totalAdditionalCostCents);
  const totalGstCents =
    gstOnInterestCents + gstOnProcessingChargeCents + gstOnAdditionalCostCents;

  const totalOutlayCents =
    input.downPaymentCents +
    totalEmiPaidCents +
    input.processingChargeCents +
    totalAdditionalCostCents +
    totalGstCents;

  const emiCents = schedule[0]?.emiCents ?? 0;
  const remainingInstallmentsCount = tenureMonths - paidInstallmentsCount;
  const remainingPrincipalBalanceCents =
    paidInstallmentsCount === 0
      ? input.principalCents
      : paidInstallmentsCount < tenureMonths
      ? schedule[paidInstallmentsCount - 1]?.closingBalanceCents ?? 0
      : 0;

  const remainingSchedule = schedule.slice(paidInstallmentsCount);
  const remainingEmiPaidCents = remainingSchedule.reduce((sum, item) => sum + item.emiCents, 0);
  const remainingInterestCents = remainingSchedule.reduce((sum, item) => sum + item.interestCents, 0);
  const remainingAdditionalCostCents =
    input.additionalCostFrequency === "monthly"
      ? input.additionalCostCents * remainingInstallmentsCount
      : 0;
  const gstOnRemainingInterestCents = applyGst(remainingInterestCents);
  const gstOnRemainingAdditionalCostCents = applyGst(remainingAdditionalCostCents);
  const remainingOutlayCents =
    remainingEmiPaidCents +
    remainingAdditionalCostCents +
    gstOnRemainingInterestCents +
    gstOnRemainingAdditionalCostCents;

  const splits: EmiSplitCalculation[] = (input.splits ?? []).map((split) => {
    const pct = new Decimal(split.percentage).div(100);
    return {
      cardholderId: split.cardholderId,
      percentage: split.percentage,
      monthlyEmiCents: roundCents(new Decimal(emiCents).mul(pct)),
      totalOutlayCents: roundCents(new Decimal(totalOutlayCents).mul(pct)),
      totalInterestCents: roundCents(new Decimal(totalInterestCents).mul(pct)),
    };
  });

  return {
    emiCents,
    totalEmiPaidCents,
    totalInterestCents,
    totalAdditionalCostCents,
    gstOnInterestCents,
    gstOnProcessingChargeCents,
    gstOnAdditionalCostCents,
    totalGstCents,
    totalOutlayCents,
    paidInstallmentsCount,
    remainingInstallmentsCount,
    remainingPrincipalBalanceCents,
    remainingOutlayCents,
    splits,
    schedule,
  };
}
