import {
  geetDetailsCatogory,
  getProductsByCategory,
} from "@/services/categoryService";
import NotFondComponent from "@/components/client/NotFond";
import ProductListPage from "./productList";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await geetDetailsCatogory(slug);

  if (!res || !res.data) {
    return {
      title: "Danh mục không tồn tại",
      description: "Không tìm thấy danh mục sản phẩm",
    };
  }

  const category = res.data;

  return {
    title: `${category.name} –  Nhà Sách Bảo Anh`,
    description: `Khám phá sản phẩm trong danh mục ${category.name} tại Nhà Sách Bảo Anh.`,
    openGraph: {
      title: `${category.name} – Nhà Sách Bảo Anh.`,
      description: `Khám phá sản phẩm trong danh mục ${category.name}.`,
      url: `${baseUrl}/danh-muc-san-pham/${slug}`,
      siteName: "Nhà Sách Bảo Anh",
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: category.name,
      description: `Khám phá sản phẩm trong danh mục ${category.name} tại Nhà Sách Bảo Anh.`,
      images: `${baseUrl}/logo.png`,
    },
    alternates: {
      canonical: `${baseUrl}/danh-muc-san-pham/${slug}`,
    },
  };
}

export default async function PageCategory({ params }: PageProps) {
  const { slug } = await params;

  const page = 1;
  const limit = 12;
  const sort = "latest";
  const data = await getProductsByCategory(slug, page, limit, sort);

  if (data?.data.products.length === 0) {
    return <NotFondComponent />;
  }

  return (
    <div className="md:mt-0 mt-[30px] pt-5  max-w-laptop mx-auto md:max-w-laptop md:mx-auto w-full px-[15px]">
      <ProductListPage slug={slug} dataRer={data} />
    </div>
  );
}
