"use client";

import Button from "@/components/client/Button";
import Input from "@/components/client/Input";
import { useAppSelector } from "@/hooks/redux";
import { fetchUpdateCategory } from "@/services/categoryService";
import { Category } from "@/types/category";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  data: Category;
}

export default function FormUpdateCategory({ data }: Props) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  const [category, setCategory] = useState(data);

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory({
      ...category,
      [e.target.name]: +e.target.value,
    });
  };

  const handleSubmit = async () => {
    const res = await fetchUpdateCategory({ category, token: user.token });
    if (!res) {
      toast.error("Cập nhật thất bại");
      return;
    }
    const { success } = res;
    router.push("/admin/categories");
    success && toast.success("Cập nhật thành công");
  };

  return (
    <div className="space-y-5 ">
      <Input
        className="w-full"
        label="Tên danh mục"
        nameInput="name"
        value={category.name}
        onChangeForm={onChangeForm}
      />
      <div className="space-y-2">
        <div className="">Cho phép hiện thị hay không?</div>
        <select
          value={category.status}
          onChange={handleChange}
          name="status"
          className="border-1 w-[278px] h-[50px] pl-[11px] pr-[22px] block"
        >
          <option value={1}>Hiện thị</option>
          <option value={0}>Ẩn</option>
        </select>
      </div>
      <Button onClick={handleSubmit} className="border-green-600 bg-green-500 ">
        Cập nhật
      </Button>
    </div>
  );
}
