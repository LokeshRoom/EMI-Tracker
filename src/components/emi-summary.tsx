"use client";

import { useMemo } from "react";
import { calculateEmi } from "@/lib/emi";
import { formatCents } from "@/lib/money";
import type { Emi } from "@/types";
import { Card, EmptyState, StatCard } from "./ui";

export function EmiSummary({ emi, currency }: { emi: Emi; currency: string }) {
  const calculation = useMemo(
    () =>
      calculateEmi({
        principalCents: emi.principalCents,
        annualInterestRatePercent: emi.interestRateAnnualPercent,
        tenureMonths: emi.tenureMonths,
        startMonth: emi.startMonth,
        downPaymentCents: emi.downPaymentCents,
        processingChargeCents: emi.processingChargeCents,
        additionalCostCents: emi.additionalCostCents,
        additionalCostFrequency: emi.additionalCostFrequency,
      }),
    [
      emi.principalCents,
      emi.interestRateAnnualPercent,
      emi.tenureMonths,
      emi.startMonth,
      emi.downPaymentCents,
      emi.processingChargeCents,
      emi.additionalCostCents,
      emi.additionalCostFrequency,
    ]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Monthly EMI"
          value={formatCents(calculation.emiCents, currency)}
          hint={emi.tenureMonths > 0 ? `${emi.tenureMonths} months` : "No tenure"}
        />
        <StatCard
          label="Total EMI paid"
          value={formatCents(calculation.totalEmiPaidCents, currency)}
        />
        <StatCard
          label="Total interest"
          value={formatCents(calculation.totalInterestCents, currency)}
        />
        <StatCard
          label="Total outlay"
          value={formatCents(calculation.totalOutlayCents, currency)}
          hint="Includes down payment, EMI, charges, and GST"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Processing charge"
          value={formatCents(emi.processingChargeCents, currency)}
        />
        <StatCard
          label="GST on processing"
          value={formatCents(calculation.gstOnProcessingChargeCents, currency)}
        />
        <StatCard
          label="Additional cost"
          value={formatCents(calculation.totalAdditionalCostCents, currency)}
          hint={emi.additionalCostFrequency === "monthly" ? "Monthly" : "One-time"}
        />
        <StatCard
          label="Total GST"
          value={formatCents(calculation.totalGstCents, currency)}
        />
      </div>
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Monthly schedule</h2>
        {calculation.schedule.length === 0 ? (
          <EmptyState title="No schedule" description="This EMI has no tenure." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-3 py-2">Month</th>
                  <th className="px-3 py-2">Start month</th>
                  <th className="px-3 py-2">Opening balance</th>
                  <th className="px-3 py-2">EMI</th>
                  <th className="px-3 py-2">Interest</th>
                  <th className="px-3 py-2">Principal</th>
                  <th className="px-3 py-2">Closing balance</th>
                </tr>
              </thead>
              <tbody>
                {calculation.schedule.map((item) => (
                  <tr key={item.month} className="border-b border-zinc-100 last:border-0">
                    <td className="px-3 py-2 text-zinc-700">{item.month}</td>
                    <td className="px-3 py-2 text-zinc-700">{item.startMonthLabel}</td>
                    <td className="px-3 py-2 text-zinc-700">{formatCents(item.openingBalanceCents, currency)}</td>
                    <td className="px-3 py-2 font-medium text-zinc-900">{formatCents(item.emiCents, currency)}</td>
                    <td className="px-3 py-2 text-zinc-700">{formatCents(item.interestCents, currency)}</td>
                    <td className="px-3 py-2 text-zinc-700">{formatCents(item.principalCents, currency)}</td>
                    <td className="px-3 py-2 text-zinc-700">{formatCents(item.closingBalanceCents, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
