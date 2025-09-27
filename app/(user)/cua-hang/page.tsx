import type { Metadata } from "next";
import StorePage from "./store";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Nhà sách Bảo Anh – Cửa hàng sách trực tuyến",
  description:
    "Khám phá các đầu sách mới nhất, bán chạy nhất tại Nhà sách Bảo Anh.",
  openGraph: {
    title: "Nhà sách Bảo Anh – Cửa hàng sách trực tuyến",
    description:
      "Khám phá các đầu sách mới nhất, bán chạy nhất tại Nhà sách Bảo Anh.",
    url: `${baseUrl}/cua-hang`,
    siteName: "Nhà sách Bảo Anh",
    type: "website",
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nhà sách Bảo Anh – Cửa hàng sách trực tuyến",
    description:
      "Khám phá các đầu sách mới nhất, bán chạy nhất tại Nhà sách Bảo Anh.",
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: `${baseUrl}/cua-hang`,
  },
};

export default function Store() {
  return <StorePage />;
}
