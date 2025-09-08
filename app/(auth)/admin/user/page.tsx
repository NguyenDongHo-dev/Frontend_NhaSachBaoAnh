"use client";

import { Search } from "lucide-react";
import Button from "@/components/client/Button";
import Loading from "@/components/loading ";
import { useAppSelector } from "@/hooks/redux";
import { fetchAllUser, fetchDeleteUser } from "@/services/userService";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-toastify";

export default function page() {
  const limit = 20;
  const user = useAppSelector((state) => state.user);
  const [sort, setSort] = useState<string>("latest");
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);

  //hook
  const debouncedSearch = useDebounce(search, 500);

  const [loading, setLoading] = useState(true);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const dataRes = await fetchAllUser({
        token: user.token,
        page,
        limit,
        sort,
        searchEmail: debouncedSearch,
      });

      const { data: allUser } = dataRes;

      setData(allUser);

      setLoading(false);
    };
    fetchUsers();
  }, [user, debouncedSearch, sort]);

  //delete user
  const handleDelete = async (id: number) => {
    const res = await fetchDeleteUser({ id, token: user.token });
    if (!res) {
      toast.error("Xóa thất bại");
      return;
    }
    const { success } = res;
    if (success) {
      setData((pew) => pew.filter((u) => u.id !== id));
    }
  };

  if (loading) return <Loading />;
  return (
    <div className="">
      <h1 className="font-bold text-primary text-[20px]">Quản lý người dùng</h1>
      <div className="py-[10px] flex justify-between ">
        <div className="flex items-center gap-5">
          <div className="flex">
            <input
              onChange={handleSearch}
              className="py-[3px] pl-[10px] border-t border-l border-b focus:outline-none rounded-tl-[3px] rounded-b-[3px] w-[300px]"
              placeholder="Tìm kiếm Email..."
            />
            <div className="p-[3px]  border flex items-center justify-center bg-blue-500 cursor-pointer hover:bg-blue-400 duration-200 transition-colors ">
              <Search color="white" />
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <div>Lọc:</div>
            <select
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSort(e.target.value)
              }
              value={sort}
              className="border-1 w-auto h-[30px] pl-[11px] pr-[22px]"
            >
              <option value="latest">Mới nhất</option>
              <option value="is_user">Tài khoảng khách hàng</option>
              <option value="is_admin">Tài khoảng quản trị</option>
            </select>
          </div>
        </div>

        <Link href={"/admin/user/create"}>
          <Button className="bg-green-500 border-white rounded-[5px] text-white hover:bg-green-600 duration-200 transition-colors">
            Thêm người dùng
          </Button>
        </Link>
      </div>

      <div className="relative flex flex-col w-full h-full  text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50 w-[300px]">
                Tên
              </th>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50 w-[300px]">
                Email
              </th>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50">
                Địa chỉ
              </th>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50 w-[150px]">
                SĐT
              </th>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50 w-[80px] text-center">
                Role
              </th>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50 w-[120px] text-center">
                Action
              </th>
              <th className="p-2 border-b border-blue-gray-100 bg-blue-gray-50"></th>
            </tr>
          </thead>
          <tbody>
            {!debouncedSearch && data?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  Chưa có người dùng nào, vui lòng tạo mới người dùng
                </td>
              </tr>
            )}
            {debouncedSearch && data.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            )}
            {data?.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border-b border-blue-gray-50">
                  {user.name ? user.name : "---chưa có thông tin---"}
                </td>
                <td className="p-2 border-b border-blue-gray-50">
                  {user.email}
                </td>
                <td className="p-2 border-b border-blue-gray-50 whitespace-nowrap">
                  {user.address ? user.address : "---chưa có thông tin---"}
                </td>
                <td className="p-2 border-b border-blue-gray-50">
                  {user.phone ? user.phone : "---"}
                </td>
                <td className="p-2 border-b border-blue-gray-50 text-center">
                  {user.role === 0 ? "User" : "Admin"}
                </td>
                <td className="p-2 border-b border-blue-gray-50 text-center">
                  <div className="flex flex-col gap-1 items-center">
                    <Link href={`/admin/user/update/${user.id}`}>
                      <Button className="text-blue-600 text-sm hover:underline w-[90px]">
                        Update
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 text-sm hover:underline w-[90px]"
                    >
                      Delete
                    </Button>
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
