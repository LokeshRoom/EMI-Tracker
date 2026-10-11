import CardEdit from "@/components/card-edit";

export function generateStaticParams() {
  return [{ cardId: "_" }];
}

export default function CardEditPage() {
  return <CardEdit />;
}

