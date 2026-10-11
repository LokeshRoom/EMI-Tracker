import NewEmi from "@/components/new-emi";

export function generateStaticParams() {
  return [{ cardId: "_" }];
}

export default function NewEmiPage() {
  return <NewEmi />;
}

