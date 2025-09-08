import { fetchAllProduct } from "@/services/productService";
import DataProduct from "./dataProduct";
import { fetchAllCategory } from "@/services/categoryService";

export default async function Productpage() {
  const sort = "latest";
  const page = 1;
  const limit = 20;
  const status = "all";

  const res = await fetchAllProduct({ sort, page, limit, status });

  return (
    <div>
      <h1 className="font-bold text-primary text-[20px]">Quản lý sản phẩm</h1>
      <DataProduct dataProduct={res.data} />
    </div>
  );
}
