import Link from "next/link";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h1 className="text-3xl font-bold mb-4">That page can’t be found.</h1>
      <p className="text-gray-600">Đơn hàng không tồn tại</p>
      <Link href={"/"}>
        <div className="py-2 px-3 bg-primary hover:bg-[#CC1212] transition-colors duration-200 text-white rounded-[4px] font-bold mt-2 ">
          Về trang chủ
        </div>
      </Link>
    </div>
  );
}

export default NotFound;
