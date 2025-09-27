import { fetchAllDetailsProduct } from "@/services/productService";
import DetailsProduct from "./detailsProduct";
import { getProductsByCategory } from "@/services/categoryService";
import NotFondComponent from "@/components/client/NotFond";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetchAllDetailsProduct(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!res || !res.data) {
    return {
      title: "Sản phẩm không tồn tại",
      description: "Không tìm thấy sản phẩm",
    };
  }

  const product = res.data;

  return {
    title: `${product.name} - Nhà sách Bảo Anh`,
    description: product.description || "Chi tiết sản phẩm",
    openGraph: {
      title: product.name,
      description: product.description || "Chi tiết sản phẩm",
      url: `${baseUrl}/san-pham/${slug}`,
      siteName: "Nhà sách Bảo Anh",
      images: [
        {
          url: product.image?.[0]?.url || `${baseUrl}/noImage.jpg`,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || "Chi tiết sản phẩm",
      images: [product.image?.[0]?.url || `${baseUrl}/noImage.jpg`],
    },
  };
}

export default async function PageDetailsProduct({ params }: PageProps) {
  const { slug } = await params;
  const page = 1;
  const limit = 24;
  const sort = "latest";

  const res = await fetchAllDetailsProduct(slug);

  if (!res || !res.data) {
    return <NotFondComponent />;
  }

  const data = res.data;

  const similarProducts = await getProductsByCategory(
    data.category.slug,
    page,
    limit,
    sort
  );

  return (
    <div>
      <DetailsProduct data={data} similarProducts={similarProducts.data} />
    </div>
  );
}
