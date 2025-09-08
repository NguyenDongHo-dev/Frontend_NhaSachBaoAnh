import { fetchAllDetailsProduct } from "@/services/productService";
import FormUpdate from "./formUpdate";

export default async function UpdateProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetchAllDetailsProduct(slug);
  const { data } = res;

  return (
    <div>
      <h1 className="font-bold text-primary text-[20px]">Cập nhật sản phẩm</h1>
      <FormUpdate data={data} />
    </div>
  );
}
