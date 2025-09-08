"use client";

import Button from "@/components/client/Button";
import { useAppSelector } from "@/hooks/redux";
import { fetchDeleteCategory } from "@/services/categoryService";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

export default function DeleteCategoryButton({ id }: { id: number }) {
  const route = useRouter();
  const user = useAppSelector((state) => state.user);

  const handleDelete = async () => {
    const res = await fetchDeleteCategory({ id, token: user.token });
    if (!res) {
      toast.error("Xóa thất bại");
      return;
    }
    const { success } = res;
    if (success) {
      toast.success("Xóa thành công");
      route.refresh();
    }
  };

  return (
    <Button
      onClick={handleDelete}
      className="text-red-600 text-sm hover:underline  w-[90px]"
    >
      Delete
    </Button>
  );
}
