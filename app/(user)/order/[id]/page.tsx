// app/orders/[id]/page.tsx
import type { Metadata } from "next";
import DetailsOrderPage from "./detailOrder";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Đơn hàng #${params.id} – My Shop`,
    robots: { index: false, follow: false },
  };
}

export default function OrderDetailsPage({ params }: Props) {
  return <DetailsOrderPage id={params.id} />;
}
