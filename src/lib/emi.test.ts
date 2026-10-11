import { describe, expect, it } from "vitest";
import { calculateEmi } from "./emi";
import { currentStartMonth, isValidStartMonth, parseCents } from "./money";
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
});
