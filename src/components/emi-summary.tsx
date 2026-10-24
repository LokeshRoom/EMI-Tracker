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
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 backdrop-blur-md shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Running EMI · {calculation.paidInstallmentsCount} of {emi.tenureMonths} installments completed
              </p>
              <p className="mt-1 text-xs text-emerald-400">
                Remaining installments: {calculation.remainingInstallmentsCount} months
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="block text-xs text-emerald-400">Remaining Principal</span>
                <span className="font-semibold text-emerald-300 tabular-nums">
                  {formatCents(calculation.remainingPrincipalBalanceCents, currency)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-emerald-400">Remaining Outlay</span>
                <span className="font-semibold text-emerald-300 tabular-nums">
                  {formatCents(calculation.remainingOutlayCents, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="1st Month Payable"
          value={formatCents(calculation.firstMonthPaymentCents, currency)}
          hint={calculation.totalUpfrontFeeCents > 0 ? `Incl. ${formatCents(calculation.totalUpfrontFeeCents, currency)} upfront fee` : "EMI + 18% GST on int."}
        />
        <StatCard
          label="Subsequent Monthly EMI"
          value={formatCents(calculation.monthlyPaymentWithGstCents, currency)}
          hint={`Base: ${formatCents(calculation.emiCents, currency)} + 18% GST on int.`}
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
          label="Upfront fee (PF + GST)"
          value={formatCents(calculation.totalUpfrontFeeCents, currency)}
          hint={`PF: ${formatCents(emi.processingChargeCents, currency)} + 18% GST`}
        />
        <StatCard
          label="GST on processing"
          value={formatCents(calculation.gstOnProcessingChargeCents, currency)}
        />
        <StatCard
          label="Total EMI paid"
          value={formatCents(calculation.totalEmiPaidCents, currency)}
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
            <h2 className="text-lg font-semibold text-slate-100">Cardholder Split Breakdown</h2>
            <Badge variant="purple">Split EMI</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-2">Cardholder</th>
                  <th className="px-3 py-2">Share %</th>
                  <th className="px-3 py-2">1st Month Payable</th>
                  <th className="px-3 py-2">Subsequent EMI</th>
                  <th className="px-3 py-2">Upfront Fee (PF+GST)</th>
                  <th className="px-3 py-2">Total Interest</th>
                  <th className="px-3 py-2">Total Outlay</th>
                </tr>
              </thead>
              <tbody>
                {calculation.splits.map((s) => {
                  const ch = cardholders.find((c) => c.id === s.cardholderId);
                  return (
                    <tr key={s.cardholderId} className="border-b border-white/10 last:border-0">
                      <td className="px-3 py-2 font-medium text-slate-100">{ch?.name ?? "Cardholder"}</td>
                      <td className="px-3 py-2 text-slate-300">{s.percentage}%</td>
                      <td className="px-3 py-2 font-bold text-violet-300 tabular-nums">{formatCents(s.firstMonthPaymentCents, currency)}</td>
                      <td className="px-3 py-2 font-medium text-slate-100 tabular-nums">{formatCents(s.monthlyEmiCents, currency)}</td>
                      <td className="px-3 py-2 text-slate-300 tabular-nums">{formatCents(s.upfrontFeeCents, currency)}</td>
                      <td className="px-3 py-2 text-slate-300 tabular-nums">{formatCents(s.totalInterestCents, currency)}</td>
                      <td className="px-3 py-2 font-medium text-slate-100 tabular-nums">{formatCents(s.totalOutlayCents, currency)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h2 className="text-lg font-semibold text-slate-100">Monthly schedule</h2>
          {calculation.schedule.length > 0 ? (
            <span className="text-[11px] text-slate-500 sm:hidden">Swipe horizontally to view full schedule →</span>
          ) : null}
        </div>
        {calculation.schedule.length === 0 ? (
          <EmptyState title="No schedule" description="This EMI has no tenure." />
        ) : (
          <div className="overflow-x-auto touch-pan-x">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-2">Month</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Opening balance</th>
                  <th className="px-3 py-2">Principal</th>
                  <th className="px-3 py-2">Interest</th>
                  <th className="px-3 py-2">GST (18% Int)</th>
                  <th className="px-3 py-2">Upfront Fee</th>
                  <th className="px-3 py-2">Total Payable</th>
                  <th className="px-3 py-2">Closing balance</th>
                </tr>
              </thead>
              <tbody>
                {calculation.schedule.map((item) => (
                  <tr
                    key={item.month}
                    className={`border-b border-white/10 last:border-0 ${
                      item.isPaid ? "bg-emerald-500/10" : ""
                    }`}
                  >
                    <td className="px-3 py-2 font-medium text-slate-100">{item.month}</td>
                    <td className="px-3 py-2 text-slate-300">{item.startMonthLabel}</td>
                    <td className="px-3 py-2">
                      {item.isPaid ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 border border-emerald-400/25">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-slate-300 border border-white/15">
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-300 tabular-nums">{formatCents(item.openingBalanceCents, currency)}</td>
                    <td className="px-3 py-2 text-slate-300 tabular-nums">{formatCents(item.principalCents, currency)}</td>
                    <td className="px-3 py-2 text-slate-300 tabular-nums">{formatCents(item.interestCents, currency)}</td>
                    <td className="px-3 py-2 text-slate-300 tabular-nums">{formatCents(item.gstOnInterestCents, currency)}</td>
                    <td className="px-3 py-2 text-slate-300 tabular-nums">
                      {item.upfrontFeeCents > 0 ? (
                        <span className="font-semibold text-amber-300">{formatCents(item.upfrontFeeCents, currency)}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-bold text-slate-100 tabular-nums">{formatCents(item.totalMonthlyPaymentCents, currency)}</td>
                    <td className="px-3 py-2 text-slate-300 tabular-nums">{formatCents(item.closingBalanceCents, currency)}</td>
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
