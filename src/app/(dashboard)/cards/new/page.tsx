"use client";

import Link from "next/link";
import { CardForm } from "@/components/card-form";
import { Card, PageHeader, SecondaryButton } from "@/components/ui";

export default function NewCardPage() {
  return (
    <div>
      <PageHeader
        title="New card"
        description="Add a credit card to track cardholders and EMI purchases."
        actions={
          <Link href="/cards">
            <SecondaryButton type="button">Back to cards</SecondaryButton>
          </Link>
        }
      />
      <Card>
        <CardForm cancelHref="/cards" />
      </Card>
    </div>
  );
}
