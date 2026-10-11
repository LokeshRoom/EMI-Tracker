import EmiEdit from "@/components/emi-edit";

export function generateStaticParams() {
  return [{ cardId: "_", emiId: "_" }];
}

export default function EmiEditPage() {
  return <EmiEdit />;
}

