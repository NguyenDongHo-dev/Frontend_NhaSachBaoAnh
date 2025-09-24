import Banner from "@/components/Banner";
import Cart from "@/components/client/Cart";
import TitleHome from "@/components/TitleHome";
import {
  fetchAllCategory,
  getProductsByCategory,
} from "@/services/categoryService";
import { fetchAllProduct } from "@/services/productService";
import { notFound } from "next/navigation";

async function Home() {
  const page = 1;
  const limitShort = 4;
  const limitLong = 12;
  const sortDiscount = "discount";
  const sortNew = "latest";

  const categories = await fetchAllCategory();

  const { data: dataCategories } = categories;

  const productByCategoryPromises = dataCategories.map((cat) =>
    getProductsByCategory(cat.slug, page, limitLong, sortNew)
  );

  const [
    discountProducts,
    newProduct,
    productsByCategory,
    discountProductsLong,
  ] = await Promise.all([
    fetchAllProduct({ page, limit: limitShort, sort: sortDiscount }),
    fetchAllProduct({ page, limit: limitShort, sort: sortNew }),
    Promise.all(productByCategoryPromises),
    fetchAllProduct({ page, limit: limitLong, sort: sortDiscount }),
  ]);

  if (
    !discountProducts ||
    !newProduct ||
    !productsByCategory ||
    !discountProductsLong
  ) {
    notFound();
  }

  const categoriesWithProducts = dataCategories.map((cat, index) => ({
    ...cat,
    products: productsByCategory[index].data.products,
  }));

  return (
    <div className="">
      <Banner />
      <div className="pt-[30px] mx-auto max-w-laptop">
        <div className="">
          <TitleHome>SÁCH GIẢM GIÁ</TitleHome>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ">
            {discountProducts?.data?.map((item) => (
              <div key={item.id}>
                <Cart data={item} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[50px]">
          <TitleHome>MỚI CẬP NHẬT</TitleHome>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ">
            {newProduct?.data?.map((item) => (
              <div key={item.id}>
                <Cart data={item} />
              </div>
            ))}
          </div>
        </div>
        {categoriesWithProducts.map((category) => (
          <div key={category.id} className="mt-[50px]">
            <TitleHome>{category.name}</TitleHome>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ">
              {category.products.map((product) => (
                <div key={product.id}>
                  <Cart data={product} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-[50px]">
          <TitleHome>SÁCH GIẢM GIÁ</TitleHome>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ">
            {discountProductsLong?.data?.map((item) => (
              <div key={item.id}>
                <Cart data={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
