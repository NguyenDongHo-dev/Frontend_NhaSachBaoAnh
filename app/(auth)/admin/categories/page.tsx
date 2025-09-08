import Button from "@/components/client/Button";
import {
  fetchAllCategory,
  fetchDeleteCategory,
} from "@/services/categoryService";
import Link from "next/link";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function Categorypage() {
  const { data } = await fetchAllCategory();

  if (data.length === 0) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center text-gray-500">
        <svg
          className="w-16 h-16 mb-3 text-gray-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008h-.008V9.75zM12 15.75c-1.5 0-2.25-.75-2.25-.75M12 3C7.029 3 3 7.029 3 12s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9z"
          />
        </svg>
        <p className="text-lg font-semibold">Không có danh mục nào</p>
        <p className="text-sm text-gray-400 mt-1">
          Hãy thêm danh mục mới để bắt đầu.
        </p>
        <Link
          className="border p-2 rounded-[5px] bg-green-500 mt-[10px]"
          href={"/admin/categories/new"}
        >
          Thêm mới danh mục
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-bold text-primary text-[20px]">
        Quản lý danh mục sản phẩm
      </h1>
      <Link href={"/admin/categories/new"}>
        <Button className="bg-green-500 py-2 px-3 border-white rounded-[5px] text-white hover:bg-green-600 duration-200 transition-colors mt-2">
          Thêm danh mục
        </Button>
      </Link>
      <div className="relative flex flex-col w-full h-full  text-gray-700 bg-white shadow-md rounded-xl bg-clip-border mt-3">
        <table className="w-full text-left min-w-max">
          <thead>
            <tr>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50  ">
                Tên danh mục
              </th>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50  ">
                Slug
              </th>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50 w-[200px]  text-center">
                Status
              </th>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50 w-[120px] text-center">
                Action
              </th>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50"></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data?.map((category) => (
                <tr key={category.id}>
                  <td className="p-2 border-b border-blue-gray-50">
                    {category.name}
                  </td>
                  <td className="p-2 border-b border-blue-gray-50">
                    {category.slug}
                  </td>
                  <td className="p-1 border-b border-blue-gray-50 text-center align-middle  w-[200px]">
                    <div
                      className={`${
                        category.status ? "bg-green-500" : "bg-red-500"
                      } text-white w-[100px] font-bold px-3 py-2 rounded-full inline-block text-sm text-center `}
                    >
                      {category.status ? "Hoạt động" : "Ẩn"}
                    </div>
                  </td>

                  <td className="p-2 border-b border-blue-gray-50 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <Link href={`/admin/categories/update/${category.slug}`}>
                        <Button className="text-blue-600 text-sm hover:underline w-[90px]">
                          Update
                        </Button>
                      </Link>
                      <DeleteCategoryButton id={category.id} />
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
