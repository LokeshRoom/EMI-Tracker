import CardDetail from "@/components/card-detail";

export function generateStaticParams() {
  return [{ cardId: "_" }];
}

export default function CardDetailPage() {
  return <CardDetail />;
}

