"use client";

import Button from "@/components/client/Button";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { EllipsisVertical, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import RequestProduct from "./requestProduct";
import { useSearchParams } from "next/navigation";
import { fetchAllProduct, fetchDeleteProduct } from "@/services/productService";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppSelector } from "@/hooks/redux";
import Loading from "@/components/loading ";
import { toast } from "react-toastify";

export default function DataProduct({
  dataProduct,
}: {
  dataProduct: Product[];
}) {
  const user = useAppSelector((state) => state.user);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId") || "";
  const status = searchParams.get("status") || "all";
  const page = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "latest";
  const searchName = searchParams.get("name") || "";
  const debounce = useDebounce(searchName);

  const limit = 20;

  const [ellipsis, setEllipsis] = useState<number | null>();
  const [product, setProduct] = useState<Product[]>(dataProduct);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const requestProduct = async () => {
      setLoading(true);
      const res = await fetchAllProduct({
        page,
        limit,
        sort,
        status,
        categoryId,
        searchName: debounce,
      });
      if (res) {
        const { data } = res;
        setProduct(data);
      }
      setLoading(false);
    };
    requestProduct();
  }, [categoryId, status, page, sort, debounce]);

  const handlerEllipsis = (index: number) => {
    setEllipsis(index);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setEllipsis(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setEllipsis]);

  ///delete product
  const handlerDelete = async (id: number) => {
    const { success } = await fetchDeleteProduct({ id, token: user.token });
    if (success) {
      setProduct((pew) => pew.filter((p) => p.id !== id));
      toast.success("Xóa thành công");
    }
  };

  return (
    <div className="">
      {loading && <Loading />}
      <div className="py-[10px] flex justify-between ">
        <RequestProduct />

        <Link href={"/admin/product/create"}>
          <Button className="bg-green-500 px-3 py-2 border-white rounded-[5px] text-white hover:bg-green-600 duration-200 transition-colors">
            Thêm mới sản phẩm
          </Button>
        </Link>
      </div>
      <div className="relative flex flex-col w-full h-full  text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b">
              <th className="p-3 text-center  w-[200px] ">Hình ảnh</th>
              <th className="p-3 text-center  w-full ">Tên sản phẩm</th>
              <th className="p-3 text-center  w-[200px] ">Giá</th>
              <th className="p-3 text-center  w-[100px] ">Tồn kho</th>
              <th className="p-3 text-center  w-[200px] ">Danh mục</th>
              <th className="p-3 text-center  w-[80px] ">Status</th>
              <th className="p-3 text-center  w-[200px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {product && product.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  {!debounce
                    ? "Chưa có sản phẩm nào, vui lòng tạo mới sản phẩm"
                    : "Không có dữ liệu phù hợp"}
                </td>
              </tr>
            )}
            {product?.map((item, index) => (
              <tr
                key={item.id}
                className={`w-full hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className=" p-2  flex justify-center  w-[200px]">
                  <Image
                    className="object-contain"
                    alt={`${item.name}`}
                    height={60}
                    width={60}
                    src={`${process.env.API_SERVER}/${item.image[0].url}`}
                  />
                </td>
                <td className=" p-2  w-full ">
                  <div>
                    <div className="flex items-center  ">
                      <div className="line-clamp-2 ">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className=" p-2  text-center ">{item.price}</td>
                <td
                  className={`p-2  w-[100px] text-center ${
                    item.stock <= 5
                      ? "text-red-500 border-black  "
                      : "text-black"
                  } `}
                >
                  {item.stock}
                </td>
                <td className=" p-2  text-center">{item.category.name}</td>
                <td className="p-2   text-center align-middle  w-[80px]">
                  <div
                    className={`${
                      item.status ? "bg-green-500" : "bg-red-500"
                    } text-white w-[100px] font-bold px-3 py-2 rounded-full inline-block text-sm text-center `}
                  >
                    {item.status ? "Hoạt động" : "Ẩn"}
                  </div>
                </td>
                <td className=" text-center relative  w-[200px]">
                  <div
                    ref={menuRef}
                    className="flex flex-col gap-1 items-center"
                  >
                    <div onClick={() => handlerEllipsis(index)}>
                      <EllipsisVertical />
                      {ellipsis === index && (
                        <div
                          ref={menuRef}
                          className="absolute left-1/2 z-30 bg-white -translate-x-1/2 shadow inline-block border rounded-[10px] "
                        >
                          <div className="flex flex-col gap-2 p-1 items-start">
                            <Link href={`/admin/product/show/${item.slug}`}>
                              <div className="px-2 rounded-[10px] hover:bg-gray-500 duration-200 transition-colors hover:text-white w-full cursor-pointer">
                                Show
                              </div>
                            </Link>
                            <Link href={`/admin/product/update/${item.slug}`}>
                              <div className="px-2 rounded-[10px] hover:bg-gray-500 duration-200 transition-colors hover:text-white w-full cursor-pointer">
                                Edit
                              </div>
                            </Link>

                            <div
                              onClick={() => handlerDelete(item.id)}
                              className="px-2 rounded-[10px] hover:bg-gray-500 duration-200 transition-colors hover:text-white w-full cursor-pointer"
                            >
                              Delete
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
