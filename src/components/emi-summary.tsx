"use client";

import { useMemo } from "react";
import { calculateEmi } from "@/lib/emi";
import { formatCents } from "@/lib/money";
import type { Cardholder, Emi } from "@/types";
import { Badge, Card, EmptyState, StatCard } from "./ui";

export function EmiSummary({
  emi,
  currency,
  cardholders = [],
}: {
  emi: Emi;
  currency: string;
  cardholders?: Cardholder[];
}) {
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
        paidInstallmentsCount: emi.paidInstallmentsCount,
        splits: emi.splits,
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
      emi.paidInstallmentsCount,
      emi.splits,
    ]
  );

  return (
    <div className="space-y-6">
      {/* Running EMI Alert Banner */}
      {calculation.paidInstallmentsCount > 0 ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Running EMI · {calculation.paidInstallmentsCount} of {emi.tenureMonths} installments completed
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                Remaining installments: {calculation.remainingInstallmentsCount} months
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="block text-xs text-emerald-700">Remaining Principal</span>
                <span className="font-semibold text-emerald-900">
                  {formatCents(calculation.remainingPrincipalBalanceCents, currency)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-emerald-700">Remaining Outlay</span>
                <span className="font-semibold text-emerald-900">
                  {formatCents(calculation.remainingOutlayCents, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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

      {/* Cardholder Split Breakdown Table */}
      {calculation.splits.length > 0 ? (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900">Cardholder Split Breakdown</h2>
            <Badge>Split EMI</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-3 py-2">Cardholder</th>
                  <th className="px-3 py-2">Share %</th>
                  <th className="px-3 py-2">Monthly EMI</th>
                  <th className="px-3 py-2">Total Interest</th>
                  <th className="px-3 py-2">Total Outlay</th>
                </tr>
              </thead>
              <tbody>
                {calculation.splits.map((s) => {
                  const ch = cardholders.find((c) => c.id === s.cardholderId);
                  return (
                    <tr key={s.cardholderId} className="border-b border-zinc-100 last:border-0">
                      <td className="px-3 py-2 font-medium text-zinc-900">{ch?.name ?? "Cardholder"}</td>
                      <td className="px-3 py-2 text-zinc-700">{s.percentage}%</td>
                      <td className="px-3 py-2 font-medium text-zinc-900">{formatCents(s.monthlyEmiCents, currency)}</td>
                      <td className="px-3 py-2 text-zinc-700">{formatCents(s.totalInterestCents, currency)}</td>
                      <td className="px-3 py-2 font-medium text-zinc-900">{formatCents(s.totalOutlayCents, currency)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Monthly schedule</h2>
        {calculation.schedule.length === 0 ? (
          <EmptyState title="No schedule" description="This EMI has no tenure." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-3 py-2">Month</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Opening balance</th>
                  <th className="px-3 py-2">EMI</th>
                  <th className="px-3 py-2">Interest</th>
                  <th className="px-3 py-2">Principal</th>
                  <th className="px-3 py-2">Closing balance</th>
                </tr>
              </thead>
              <tbody>
                {calculation.schedule.map((item) => (
                  <tr
                    key={item.month}
                    className={`border-b border-zinc-100 last:border-0 ${
                      item.isPaid ? "bg-emerald-50/30 text-zinc-600" : ""
                    }`}
                  >
                    <td className="px-3 py-2 font-medium text-zinc-900">{item.month}</td>
                    <td className="px-3 py-2 text-zinc-700">{item.startMonthLabel}</td>
                    <td className="px-3 py-2">
                      {item.isPaid ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                          Upcoming
                        </span>
                      )}
                    </td>
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
