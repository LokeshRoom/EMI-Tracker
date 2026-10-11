import EmiDetail from "@/components/emi-detail";

export function generateStaticParams() {
  return [{ cardId: "_", emiId: "_" }];
}

export default function EmiDetailPage() {
  return <EmiDetail />;
}

