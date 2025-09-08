import { getProductsByCategory } from "@/services/categoryService";
import ProductList from "./productList";

export default async function PageCategory({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = 1;
  const limit = 12;
  const sort = "latest";
  const data = await getProductsByCategory(slug, page, limit, sort);

  return (
    <div className="md:mt-0 mt-[30px] pt-5  max-w-laptop mx-auto md:max-w-laptop md:mx-auto w-full px-[15px]">
      <ProductList slug={slug} dataRer={data} />
    </div>
  );
}
