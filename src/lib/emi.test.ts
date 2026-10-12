import { describe, expect, it } from "vitest";
import { calculateEmi, getEmiCardholderSplits } from "./emi";
import { currentStartMonth, isValidStartMonth, monthLabelFromStartMonth, parseCents } from "./money";
import type { EmiCalculationInput } from "./emi";

const baseInput: EmiCalculationInput = {
  principalCents: 120000,
  annualInterestRatePercent: 0,
  tenureMonths: 12,
  startMonth: "2026-11",
  downPaymentCents: 0,
  processingChargeCents: 0,
  additionalCostCents: 0,
  additionalCostFrequency: "one_time",
};

describe("parseCents", () => {
  it("parses empty input as zero", () => {
    expect(parseCents("")).toBe(0);
  });

  it("parses whole rupees and paise", () => {
    expect(parseCents("1,234.50")).toBe(123450);
    expect(parseCents("12.1")).toBe(1210);
  });

  it("rejects invalid amount input", () => {
    expect(() => parseCents("12.123")).toThrow();
    expect(() => parseCents("abc")).toThrow();
  });
});

describe("start month helpers", () => {
  it("validates start month format", () => {
    expect(isValidStartMonth("2026-11")).toBe(true);
    expect(isValidStartMonth("2026-13")).toBe(false);
    expect(isValidStartMonth("2026-1")).toBe(false);
  });

  it("returns a valid current start month", () => {
    expect(isValidStartMonth(currentStartMonth())).toBe(true);
  });

  it("formats month label with accurate calendar year and offset", () => {
    expect(monthLabelFromStartMonth("2026-11", 0)).toBe("Nov 2026");
    expect(monthLabelFromStartMonth("2026-11", 2)).toBe("Jan 2027");
  });
});

describe("calculateEmi", () => {
  it("calculates zero-interest EMI over the tenure", () => {
    const result = calculateEmi(baseInput);

    expect(result.emiCents).toBe(10000);
    expect(result.totalEmiPaidCents).toBe(120000);
    expect(result.totalInterestCents).toBe(0);
    expect(result.schedule).toHaveLength(12);
    expect(result.schedule[11].closingBalanceCents).toBe(0);
  });

  it("uses standard reducing-balance amortization", () => {
    const result = calculateEmi({
      ...baseInput,
      principalCents: 1000000,
      annualInterestRatePercent: 12,
    });

    expect(result.schedule).toHaveLength(12);
    expect(result.schedule[0].emiCents).toBe(88849);
    expect(result.schedule[11].closingBalanceCents).toBe(0);
    expect(result.totalInterestCents).toBe(result.totalEmiPaidCents - 1000000);
  });

  it("tracks down payment separately and includes it in total outlay", () => {
    const result = calculateEmi({
      ...baseInput,
      principalCents: 1000000,
      downPaymentCents: 200000,
    });

    expect(result.emiCents).toBe(83333);
    expect(result.totalEmiPaidCents).toBe(1000000);
    expect(result.totalOutlayCents).toBe(1200000);
  });

  it("applies GST to processing charge and monthly additional cost", () => {
    const result = calculateEmi({
      ...baseInput,
      processingChargeCents: 10000,
      additionalCostCents: 5000,
      additionalCostFrequency: "monthly",
    });

    expect(result.gstOnProcessingChargeCents).toBe(1800);
    expect(result.totalAdditionalCostCents).toBe(60000);
    expect(result.gstOnAdditionalCostCents).toBe(10800);
    expect(result.totalOutlayCents).toBe(202600);
  });

  it("applies GST to one-time additional cost", () => {
    const result = calculateEmi({
      ...baseInput,
      processingChargeCents: 10000,
      additionalCostCents: 5000,
      additionalCostFrequency: "one_time",
    });

    expect(result.totalAdditionalCostCents).toBe(5000);
    expect(result.gstOnAdditionalCostCents).toBe(900);
    expect(result.totalOutlayCents).toBe(137700);
  });

  it("applies GST to total interest", () => {
    const result = calculateEmi({
      ...baseInput,
      principalCents: 1000000,
      annualInterestRatePercent: 12,
    });

    expect(result.gstOnInterestCents).toBe(
      Math.round((result.totalInterestCents * 18) / 100)
    );
    expect(result.totalGstCents).toBe(
      result.gstOnInterestCents +
        result.gstOnProcessingChargeCents +
        result.gstOnAdditionalCostCents
    );
  });

  it("handles running EMIs with paid installments count", () => {
    const result = calculateEmi({
      ...baseInput,
      principalCents: 120000,
      tenureMonths: 12,
      paidInstallmentsCount: 4,
    });

    expect(result.paidInstallmentsCount).toBe(4);
    expect(result.remainingInstallmentsCount).toBe(8);
    expect(result.schedule[0].isPaid).toBe(true);
    expect(result.schedule[3].isPaid).toBe(true);
    expect(result.schedule[4].isPaid).toBe(false);
    expect(result.remainingPrincipalBalanceCents).toBe(80000);
    expect(result.remainingOutlayCents).toBe(80000);
  });

  it("calculates proportional splits across cardholders including upfront fee", () => {
    const result = calculateEmi({
      ...baseInput,
      principalCents: 120000,
      processingChargeCents: 10000,
      tenureMonths: 12,
      splits: [
        { cardholderId: "user-1", percentage: 60 },
        { cardholderId: "user-2", percentage: 40 },
      ],
    });

    expect(result.splits).toHaveLength(2);
    expect(result.splits[0].percentage).toBe(60);
    expect(result.splits[0].monthlyEmiCents).toBe(6000);
    expect(result.splits[0].upfrontFeeCents).toBe(7080); // 60% of (10000 + 1800)
    expect(result.splits[0].firstMonthPaymentCents).toBe(13080); // 6000 + 7080
    expect(result.splits[1].percentage).toBe(40);
    expect(result.splits[1].monthlyEmiCents).toBe(4000);
    expect(result.splits[1].upfrontFeeCents).toBe(4720); // 40% of (10000 + 1800)
    expect(result.splits[1].firstMonthPaymentCents).toBe(8720); // 4000 + 4720
  });

  it("calculates 18% GST on interest and upfront fee in month 1 schedule and firstMonthPaymentCents", () => {
    const result = calculateEmi({
      ...baseInput,
      principalCents: 1000000,
      annualInterestRatePercent: 12,
      processingChargeCents: 20000,
      tenureMonths: 12,
    });

    // Upfront fee is PF + 18% GST on PF = 20000 + 3600 = 23600
    expect(result.totalUpfrontFeeCents).toBe(23600);

    // Month 1 schedule has interest = 10000 cents (1% of 1000000)
    // 18% GST on 10000 is 1800 cents
    expect(result.schedule[0].interestCents).toBe(10000);
    expect(result.schedule[0].gstOnInterestCents).toBe(1800);
    expect(result.schedule[0].upfrontFeeCents).toBe(23600);
    expect(result.schedule[0].totalMonthlyPaymentCents).toBe(
      result.schedule[0].emiCents + 1800 + 23600
    );
    expect(result.firstMonthPaymentCents).toBe(result.schedule[0].totalMonthlyPaymentCents);
    expect(result.monthlyPaymentWithGstCents).toBe(result.schedule[0].emiCents + 1800);

    // Month 2 schedule has no upfront fee
    expect(result.schedule[1].upfrontFeeCents).toBe(0);
    expect(result.schedule[1].totalMonthlyPaymentCents).toBe(
      result.schedule[1].emiCents + result.schedule[1].gstOnInterestCents
    );
  });

  it("handles getEmiCardholderSplits correctly for multi-split and single cardholder fallback", () => {
    const multi = getEmiCardholderSplits(
      {
        cardholderId: "primary",
        splits: [
          { cardholderId: "user-1", percentage: 50 },
          { cardholderId: "user-2", percentage: 50 },
        ],
      },
      10000,
      2000
    );
    expect(multi).toHaveLength(2);
    expect(multi[0]).toEqual({ cardholderId: "user-1", percentage: 50, firstMonthPaymentCents: 6000, monthlyEmiCents: 5000, upfrontFeeCents: 1000 });
    expect(multi[1]).toEqual({ cardholderId: "user-2", percentage: 50, firstMonthPaymentCents: 6000, monthlyEmiCents: 5000, upfrontFeeCents: 1000 });

    const single = getEmiCardholderSplits({ cardholderId: "user-1" }, 10000, 2000);
    expect(single).toHaveLength(1);
    expect(single[0]).toEqual({ cardholderId: "user-1", percentage: 100, firstMonthPaymentCents: 12000, monthlyEmiCents: 10000, upfrontFeeCents: 2000 });

    const empty = getEmiCardholderSplits({}, 10000, 2000);
    expect(empty).toHaveLength(0);
  });
});
