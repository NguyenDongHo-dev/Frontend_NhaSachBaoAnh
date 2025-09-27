"use client";

import { useAppSelector } from "@/hooks/redux";
import { fetchDetailUserByAdmin } from "@/services/userService";
import { User } from "@/types/user";
import React, { useEffect, useState } from "react";
import FormUpdateUser from "./FormUpdateUser";
import Link from "next/link";

export default function UpdateUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = useAppSelector((state) => state.user);
  const { id } = React.use(params);
  const [data, setData] = useState<User>({
    id: 0,
    name: "",
    address: "",
    phone: "",
    role: 0,
    email: "",
  });

  useEffect(() => {
    const fetchDetailUser = async () => {
      if (!user.token) return;
      const dataRes = await fetchDetailUserByAdmin({
        token: user.token,
        id: Number(id),
      });
      const { data: dataUser } = dataRes;

      if (!dataUser) {
        return (
          <div className="h-full w-full flex items-center justify-center">
            <p> Đã có lỗi xảy ra</p>
            <div className="mt-2">
              <Link href={"/admin/users"}>Quay lại</Link>
            </div>
          </div>
        );
      }

      setData({
        id: dataUser.id,
        name: dataUser.name,
        address: dataUser.address,
        phone: dataUser.phone,
        role: dataUser.role,
        email: dataUser.email,
      });
    };

    fetchDetailUser();
  }, [user.token, id]);

  return (
    <div>
      <h1 className="font-bold text-primary text-[20px] pb-2">
        Cập nhật người dùng
      </h1>
      <FormUpdateUser data={data} />
    </div>
  );
}
