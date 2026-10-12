"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CardholderSection } from "@/components/cardholder-form";
import {
  Badge,
  Button,
  Card,
  DangerButton,
  EmptyState,
  ErrorNotice,
  PageHeader,
  SecondaryButton,
  Spinner,
} from "@/components/ui";
import { useCard, useDeleteCard } from "@/hooks/useCards";
import { useCardholders } from "@/hooks/useCardholders";
import { useEmis } from "@/hooks/useEmis";
import { getErrorMessage } from "@/lib/firebase";
import { calculateEmi } from "@/lib/emi";
import { formatCents } from "@/lib/money";

export default function CardDetail() {
  const params = useParams<{ cardId: string }>();
  const router = useRouter();
  const cardId = params.cardId;
  const card = useCard(cardId);
  const cardholders = useCardholders(cardId);
  const emis = useEmis(cardId);
  const deleteCard = useDeleteCard();

  if (!cardId) {
    return <Spinner label="Loading card..." />;
  }

  if (card.isLoading) {
    return <Spinner label="Loading card..." />;
  }

  if (card.error || !card.data) {
    return (
      <div className="space-y-4">
        <ErrorNotice
          message={card.error ? getErrorMessage(card.error) : "Card not found."}
        />
        <Link href="/cards" className="text-sm font-medium text-zinc-700 underline">
          Back to cards
        </Link>
      </div>
    );
  }

  const currentCard = card.data;

  function handleDelete() {
    if (!window.confirm("Delete this card and all of its EMIs/cardholders?")) return;
    deleteCard.mutate(currentCard.id, {
      onSuccess: () => router.push("/cards"),
    });
  }

  return (
    <div>
      <PageHeader
        title={`${currentCard.bankName} · ${currentCard.cardLabel}`}
        description={`Ends ${currentCard.last4} · ${currentCard.currency}${currentCard.cardOwner ? ` · Owner: ${currentCard.cardOwner}` : ""}`}
        actions={
          <>
            <Link href={`/cards/${currentCard.id}/edit`}>
              <SecondaryButton type="button">
                Edit card
              </SecondaryButton>
            </Link>
            <DangerButton
              type="button"
              onClick={handleDelete}
              disabled={deleteCard.isPending}
            >
              {deleteCard.isPending ? "Deleting..." : "Delete card"}
            </DangerButton>
          </>
        }
      />
      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs sm:text-sm font-medium text-zinc-500">Card Owner</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-bold text-zinc-900 truncate">
            {currentCard.cardOwner || "Self"}
          </p>
        </Card>
        <Card>
          <p className="text-xs sm:text-sm font-medium text-zinc-500">Outstanding</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-bold text-zinc-900 tabular-nums">
            {formatCents(currentCard.outstandingBalanceCents, currentCard.currency)}
          </p>
        </Card>
        <Card>
          <p className="text-xs sm:text-sm font-medium text-zinc-500">Credit Limit</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-semibold text-zinc-900 tabular-nums">
            {currentCard.creditLimitCents !== undefined
              ? formatCents(currentCard.creditLimitCents, currentCard.currency)
              : "Not set"}
          </p>
        </Card>
        <Card>
          <p className="text-xs sm:text-sm font-medium text-zinc-500">Payment Due Day</p>
          <p className="mt-1.5 text-lg sm:text-2xl font-semibold text-zinc-900">
            {currentCard.paymentDueDay ? `${currentCard.paymentDueDay}th of month` : "Not set"}
          </p>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">EMIs</h2>
            <Link href={`/cards/${currentCard.id}/emis/new`}>
              <Button type="button">Add EMI</Button>
            </Link>
          </div>
          {emis.isLoading ? (
            <Spinner label="Loading EMIs..." />
          ) : emis.error ? (
            <ErrorNotice message={getErrorMessage(emis.error)} />
          ) : emis.data?.length === 0 ? (
            <EmptyState
              title="No EMIs yet"
              description="Record an EMI purchase to see its schedule and total cost."
            />
          ) : (
            <ul className="space-y-3">
              {emis.data?.map((emi) => {
                const cardholder = cardholders.data?.find(
                  (item) => item.id === emi.cardholderId
                );
                const calculation = calculateEmi({
                  principalCents: emi.principalCents,
                  annualInterestRatePercent: emi.interestRateAnnualPercent,
                  tenureMonths: emi.tenureMonths,
                  startMonth: emi.startMonth,
                  downPaymentCents: emi.downPaymentCents,
                  processingChargeCents: emi.processingChargeCents,
                  additionalCostCents: emi.additionalCostCents,
                  additionalCostFrequency: emi.additionalCostFrequency,
                });
                return (
                  <li
                    key={emi.id}
                    className="rounded-md border border-zinc-200 px-3 py-2"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link
                          href={`/cards/${currentCard.id}/emis/${emi.id}`}
                          className="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline"
                        >
                          {emi.merchantName}
                        </Link>
                        <p className="mt-1 text-xs text-zinc-500">
                          {cardholder?.name ?? "Unknown cardholder"} · {emi.tenureMonths} months
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-medium text-zinc-900">
                          {formatCents(calculation.emiCents, currentCard.currency)} / month
                        </span>
                        <Badge>{emi.status}</Badge>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <CardholderSection cardId={currentCard.id} />
      </div>
    </div>
  );
}
