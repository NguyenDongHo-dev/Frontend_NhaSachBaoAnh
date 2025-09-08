import { fetchAllDetailsProduct } from "@/services/productService";
import DetailsProduct from "./detailsProduct";
import { getProductsByCategory } from "@/services/categoryService";

export default async function pageDetailsProduct({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetchAllDetailsProduct(slug);
  const { data } = res;

  const page = 1;
  const limit = 24;
  const sort = "latest";

  const similarProducts = await getProductsByCategory(
    data.category.slug,
    page,
    limit,
    sort
  );
  const { data: dataSimilarProducts } = similarProducts;

  return (
    <div>
      <DetailsProduct data={data} similarProducts={dataSimilarProducts} />
    </div>
  );
}
