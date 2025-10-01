// app/orders/[id]/page.tsx
import type { Metadata } from "next";
import DetailsOrderPage from "./detailOrder";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Đơn hàng #${id} – My Shop`,
    robots: { index: false, follow: false },
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;
  return <DetailsOrderPage id={id} />;
}
