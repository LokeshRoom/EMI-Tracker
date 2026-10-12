"use client";

import { CardholderSection } from "@/components/cardholder-form";
import { PageHeader } from "@/components/ui";

export default function CardholdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cardholders"
        description="Global cardholders directory. Link any cardholder to any EMI purchase or split."
      />
      <CardholderSection />
    </div>
  );
}
