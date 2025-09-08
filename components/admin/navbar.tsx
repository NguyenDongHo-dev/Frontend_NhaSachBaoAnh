import Link from "next/link";

export default function Navbar() {
  return (
    <div className="min-w-[200px] fixed h-screen top-0 left-0 bottom-0 z-30  py-[15px] px-3 border-r-2 bg-blue-500 text-white ">
      <div className="flex flex-col justify-between h-full">
        <div className="flex-1">
          <h1 className="text-center uppercase font-bold py-[15px]">
            Trang quan trị
          </h1>
          <div className="flex flex-col gap-2 uppercase font-medium">
            <Link
              className="pl-[15px] hover:bg-blue-400 py-2 rounded-[4px]"
              href={"/admin/dashboard"}
            >
              Dashboard
            </Link>
            <Link
              className="pl-[15px] hover:bg-blue-400 py-2 rounded-[4px]"
              href={"/admin/order"}
            >
              Order
            </Link>
            <Link
              className="pl-[15px] hover:bg-blue-400 py-2 rounded-[4px]"
              href={"/admin/product"}
            >
              Product
            </Link>
            <Link
              className="pl-[15px] hover:bg-blue-400 py-2 rounded-[4px]"
              href={"/admin/user"}
            >
              User
            </Link>
            <Link
              className="pl-[15px] hover:bg-blue-400 py-2 rounded-[4px]"
              href={"/admin/categories"}
            >
              Categories
            </Link>
          </div>
        </div>
        <div className="pl-[15px] mb-[20px] cursor-pointer py-2  hover:bg-blue-300 rounded-[4px] uppercase font-bold">
          logout
        </div>
      </div>
    </div>
  );
}
