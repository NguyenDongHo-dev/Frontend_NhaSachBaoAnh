import { fetchAllDetailsProduct } from "@/services/productService";
import DetailsProduct from "./detailsProduct";
import { getProductsByCategory } from "@/services/categoryService";
import NotFondComponent from "@/components/client/NotFond";

export default async function PageDetailsProduct({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
