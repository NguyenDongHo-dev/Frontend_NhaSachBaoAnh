"use client";

import Button from "@/components/client/Button";
import Input from "@/components/client/Input";
import { useAppSelector } from "@/hooks/redux";
import { fetchNewCategory } from "@/services/categoryService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface FormCategory {
  name: string;
  status: number;
}

export default function NewCategoryPage() {
  const route = useRouter();
  const user = useAppSelector((state) => state.user);
  const [err, setErr] = useState<{ name?: string }>({});
  const [form, setForm] = useState<FormCategory>({
    name: "",
    status: 1,
  });

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: +e.target.value,
    });
  };

  const handleSubmit = async () => {
    const errors: { name?: string } = {};

    if (!form.name.trim()) {
      errors.name = "Tên danh mục không được để trống.";
    } else if (form.name.trim().length < 4) {
      errors.name = "Tên danh mục phải có ít nhất 4 ký tự.";
    }

    if (Object.keys(errors).length > 0) {
      setErr(errors);
      return;
    }

    const res = await fetchNewCategory({ form, token: user.token });
    if (!res) {
      toast.error("Tạo thất bại");
      return;
    }
    const { success } = res;
    if (success) {
      route.push("/admin/categories");
      toast.success("Tạo danh mục thành công");
    }
  };
  return (
    <div>
      <h1 className="font-bold text-primary text-[20px]  pb-2">
        Thêm mới danh mục
      </h1>
      <div className="space-y-5">
        <Input
          className="w-full"
          label="Tên danh mục"
          nameInput="name"
          value={form.name}
          onChangeForm={onChangeForm}
        />
        <div className="space-y-2">
          <div className="">Cho phép hiện thị hay không?</div>
          <select
            value={form.status}
            onChange={handleChangeSelect}
            name="status"
            className="border-1 w-[278px] h-[50px] pl-[11px] pr-[22px] block"
          >
            <option value={1}>Hiện thị</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>
        {err.name && <p className="text-sm text-red-500 mt-1">{err.name}</p>}
        <Button
          onClick={handleSubmit}
          className="border-green-600 bg-green-500 py-2 px-3"
        >
          Thêm mới danh mục
        </Button>
      </div>
    </div>
  );
}
