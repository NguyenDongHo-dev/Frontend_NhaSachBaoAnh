"use client";
import Input from "@/components/client/Input";
import { useEffect, useState } from "react";
import TextEditor from "@/components/admin/Tiptap";
import { fetchAllCategory } from "@/services/categoryService";
import { Category } from "@/types/category";
import Button from "@/components/client/Button";
import { Images } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { fetchNewProduct } from "@/services/productService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Form {
  name: string;
  description: string;
  short_description: string;
  discount: string;
  price: string;
  category_id: string;
  status: string;
  stock: string;
  images: string[];
}

export default function createProductPage() {
  const route = useRouter();
  const user = useAppSelector((state) => state.user);
  const [err, setErr] = useState<{
    name?: string;
    price?: string;
    stock?: string;
    category?: string;
    image?: string;
  }>({});

  const [categories, setCategories] = useState<Category[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState<Form>({
    name: "",
    description: "",
    short_description: "",
    discount: "",
    price: "",
    category_id: "",
    status: "1",
    stock: "",
    images: [],
  });

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
      category: undefined,
    }));
  };

  const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const newImages = newFiles.map((file) => URL.createObjectURL(file));

    setFiles((prev) => [...prev, ...newFiles]);
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onClickNewProduct = async () => {
    //vadidate
    const errors: {
      name?: string;
      price?: string;
      stock?: string;
      category?: string;
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

    if (!form.category_id || Number(form.category_id) <= 0) {
      errors.category = "Vui lòng chọn danh mục";
    }

    if (files.length === 0) {
      errors.image = "Vui lòng thêm ít nhất 1 ảnh sản phẩm";
    }
    if (Object.keys(errors).length > 0) {
      setErr(errors);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("short_description", form.short_description);
    formData.append("discount", String(form.discount || 0));
    formData.append("price", String(form.price));
    formData.append("category_id", String(form.category_id));
    formData.append("status", String(form.status));
    formData.append("stock", String(form.stock));

    files.forEach((file) => {
      formData.append("images[]", file);
    });

    const res = await fetchNewProduct({
      token: user.token,
      form: formData,
    });

    console.log(res);

    if (res?.success) {
      toast.success("Tạo sản phẩm thành công");
      route.push("/admin/product");
    }
    if (!res?.success && res?.errors) {
      console.log(123);

      Object.values(res.errors).forEach((errArray) => {
        if (Array.isArray(errArray)) {
          toast.error(errArray[0]);
        }
      });
    }
  };

  return (
    <div>
      <h1 className="font-bold text-primary text-[20px]">Thêm mới sản phẩm</h1>
      <div className="space-y-2">
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
              defaultValue={categories[0]?.id}
              value={form.category_id}
              className="h-[40px] px-3 border border-gray-300 rounded-md w-[300px]"
            >
              <option value={""}>---Chọn danh mục---</option>
              {categories.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            {err.category && (
              <p className="text-sm text-red-500 mt-1">{err.category}</p>
            )}
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

            <div className="flex gap-2 flex-wrap mt-2">
              {form.images.map((src, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => removeImage(index)}
                >
                  <img
                    src={src}
                    alt={`preview-${index}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <span className="absolute cursor-pointer top-0 right-0 bg-red-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    X
                  </span>
                </div>
              ))}
            </div>
            {err.image && (
              <p className="text-sm text-red-500 mt-1">{err.image}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Button
          onClick={onClickNewProduct}
          className="bg-green-500 py-2 px-3 border-white rounded-[5px] text-white hover:bg-green-600 duration-200 transition-colors"
        >
          Thêm mới sản phẩm
        </Button>
      </div>
    </div>
  );
}
