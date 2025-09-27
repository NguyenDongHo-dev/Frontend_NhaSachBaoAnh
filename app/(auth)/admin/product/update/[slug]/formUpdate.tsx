"use client";

import TextEditor from "@/components/admin/Tiptap";
import Button from "@/components/client/Button";
import Input from "@/components/client/Input";
import { useAppSelector } from "@/hooks/redux";
import { fetchAllCategory } from "@/services/categoryService";
import { fetchUpdateProduct } from "@/services/productService";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { Images } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type OldImage = {
  id: number;
  url: string;
};

export default function FormUpdate({ data }: { data: Product }) {
  const route = useRouter();
  const user = useAppSelector((state) => state.user);

  const [form, setForm] = useState({
    id: data.id,
    name: data.name,
    description: data.description,
    short_description: data.short_description,
    discount: String(data.discount || 0),
    price: String(data.price || 0),
    stock: String(data.stock || 0),
    category_id: data.category.id,
    status: data.status,
  });
  const [err, setErr] = useState<{
    name?: string;
    price?: string;
    stock?: string;
    image?: string;
  }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [oldImages, setOldImages] = useState<OldImage[]>(data.image || []);

  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetCategoies = async () => {
      const res = await fetchAllCategory();
      const { data } = res;
      setCategories(data);
    };
    fetCategoies();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    setErr((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
    setErr((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setNewFiles((prev) => [...prev, ...files]);
  };

  const removeOldImage = (index: number) => {
    setOldImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onClickUpdateProduct = async () => {
    //vadidate
    const errors: {
      name?: string;
      price?: string;
      stock?: string;
      image?: string;
    } = {};

    if (!form.name.trim()) {
      errors.name = "Tên sản phẩm không được để trống";
    }

    if (!form.price || Number(form.price) <= 0) {
      errors.price = "Giá sản phẩm phải lớn hơn 0";
    }

    if (!form.stock || Number(form.stock) <= 0) {
      errors.stock = "Số lượng phải lớn hơn 0";
    }

    if (oldImages.length === 0 && newFiles.length === 0) {
      errors.image = "Sản phẩm phải có ít nhất 1 ảnh";
    }

    setErr(errors);
    if (Object.keys(errors).length > 0) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description ?? "");
    formData.append("short_description", form.short_description ?? "");
    formData.append("discount", String(form.discount ?? ""));
    formData.append("price", String(form.price));
    formData.append("category_id", String(form.category_id));
    formData.append("status", String(form.status));
    formData.append("stock", String(form.stock));

    newFiles.forEach((file) => {
      formData.append("images[]", file);
    });

    oldImages.forEach((img) => {
      formData.append("old_images[]", String(img.id));
    });

    formData.append("_method", "PUT");

    if (user.token) {
      const res = await fetchUpdateProduct({
        token: user.token,
        form: formData,
        productId: form.id,
      });

      if (!res) {
        toast.error("da co loi xay ra");
        return;
      }
      const { success } = res;
      if (success) {
        toast.success("cap nhat thanh cong");
        route.push("/admin/product");
      }
    }
  };

  return (
    <div>
      <div className="space-y-2 mt-2">
        <Input
          label="Tên sản phẩm (*)"
          nameInput="name"
          className="w-full"
          value={form.name}
          onChangeForm={onChange}
        />
        {err.name && <p className="text-sm text-red-500 mt-1">{err.name}</p>}
        <div className="flex items-start gap-5">
          <div>
            <Input
              label="Giá sản phẩm  (*)"
              nameInput="price"
              className="w-full"
              value={form.price}
              onChangeForm={onChange}
            />
            {err.price && (
              <p className="text-sm text-red-500 mt-1">{err.price}</p>
            )}
          </div>

          <Input
            label="Giả giá (%)"
            nameInput="discount"
            className="w-full"
            value={form.discount}
            onChangeForm={onChange}
          />
          <div>
            <Input
              label="Số lượng  (*)"
              nameInput="stock"
              className="w-full"
              value={form.stock}
              onChangeForm={onChange}
            />
            {err.stock && (
              <p className="text-sm text-red-500 mt-1">{err.stock}</p>
            )}
          </div>

          <div className="">
            <div className="mb-[6px] block text-[#222] font-medium">
              Danh mục sản phẩm (*)
            </div>
            <select
              onChange={onChangeSelect}
              name="category_id"
              value={form.category_id}
              className="h-[40px] px-3 border border-gray-300 rounded-md w-[300px]"
            >
              {categories.map((item) => {
                return (
                  <option key={item.id} value={String(item.id)}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div>
          <label className="py-2 block">Mô tả ngắn</label>
          <TextEditor
            value={form.short_description}
            onChange={(val) => setForm({ ...form, short_description: val })}
          />
        </div>
        <div>
          <label className="py-2 block">Mô tả dài</label>
          <TextEditor
            value={form.description}
            onChange={(val) => setForm({ ...form, description: val })}
          />
        </div>
        <div className="flex items-baseline gap-20">
          <div>
            <div className="py-2">Cho phép hiển thị hay không</div>
            <select
              onChange={onChangeSelect}
              name="status"
              className="h-[40px] px-3 border border-gray-300 rounded-md w-[300px]"
            >
              <option value="1">Hiển thị</option>
              <option value="0">ẨN</option>
            </select>
          </div>
          <div className=" inline-block">
            <label
              htmlFor="images"
              className="flex items-center gap-1 cursor-pointer"
            >
              Thêm ảnh sản phẩm (*)
              <Images />
            </label>
            <input
              onChange={onChangeFiles}
              type="file"
              name="images"
              id="images"
              multiple
              className="hidden"
            />

            <div className="flex items-center gap-2 mt-2">
              <label className="items-center gap-1 cursor-pointer inline-block">
                Hình ảnh:
              </label>
              {oldImages.map((src, index) => (
                <div key={`old-${index}`} className="relative group w-20 h-20">
                  <Image
                    src={`${process.env.API_SERVER}/${src.url}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={`old-${index}`}
                    className="object-cover rounded border"
                  />
                  <span
                    onClick={() => removeOldImage(index)}
                    className="absolute cursor-pointer top-0 right-0 bg-red-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    X
                  </span>
                </div>
              ))}
              {newFiles.map((file, index) => (
                <div key={`new-${index}`} className="relative group w-20 h-20">
                  <Image
                    src={URL.createObjectURL(file)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={`new-${index}`}
                    className="object-cover rounded border"
                  />
                  <span
                    onClick={() => removeNewFile(index)}
                    className="absolute cursor-pointer top-0 right-0 bg-red-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    X
                  </span>
                </div>
              ))}
            </div>
            {err.image && (
              <p className="text-sm text-red-500 mt-1">{err.image}</p>
            )}
          </div>
          <div className="">
            <Button
              onClick={onClickUpdateProduct}
              className="bg-green-500 border-white rounded-[5px] text-white hover:bg-green-600 duration-200 transition-colors"
            >
              Cập nhật sản phẩm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
