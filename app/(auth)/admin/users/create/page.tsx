"use client";

import Button from "@/components/client/Button";
import Input from "@/components/client/Input";
import { useAppSelector } from "@/hooks/redux";
import { fetchCreateUser } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Form {
  name: string;
  email: string;
  phone: string;
  role: number;
  password: string;
  address: string;
  confirmPassword: string;
}

export default function newUserPage() {
  const route = useRouter();
  const user = useAppSelector((state) => state.user);
  const [isClient, setIsClient] = useState(false);

  const [err, setErr] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [form, setForm] = useState<Form>({
    name: "",
    phone: "",
    email: "",
    role: 0,
    address: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const isValidEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: +e.target.value,
    });
  };

  const handleSubmit = async () => {
    const errors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!form.email.trim()) {
      errors.email = "Email không được để trống";
    } else if (!isValidEmail(form.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!form.password.trim()) {
      errors.password = "Mật khẩu không được để trống";
    } else if (form.password.trim().length < 6) {
      errors.password = "Mật khẩu phải lớn hơn 6 kí tự";
    }

    if (!form.confirmPassword.trim()) {
      errors.confirmPassword = "Không được để trống";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Mật khẩu và nhập lại mật khẩu phải giống nhau ";
    }

    if (Object.keys(errors).length > 0) {
      setErr(errors);
      return;
    }
    const res = await fetchCreateUser({ token: user.token, form });

    const { success, status } = res;

    if (status === 422) {
      setErr({
        ...errors,
        email: res.errors?.email?.[0],
      });
      return;
    }

    if (success) {
      route.push("/admin/user");
    }
  };

  return (
    <div>
      <h1 className="font-bold text-primary text-[20px] pb-2 ">
        Tạo mới người dùng
      </h1>
      <div className="space-y-5">
        <Input
          className="w-full"
          label="Tên người dùng"
          nameInput="name"
          value={form.name}
          onChangeForm={onChangeForm}
        />
        <div>
          <Input
            className="w-full"
            label="Email người dùng (*)"
            nameInput="email"
            value={form.email}
            onChangeForm={onChangeForm}
          />
          {err.email && <p className="text-sm text-red-500">{err.email}</p>}
        </div>

        <Input
          className="w-full"
          label="SĐT "
          nameInput="phone"
          value={form.phone}
          onChangeForm={onChangeForm}
        />
        <Input
          className="w-full"
          label="Địa chỉ"
          nameInput="address"
          value={form.address}
          onChangeForm={onChangeForm}
        />
        <div>
          <Input
            className="w-full"
            label="Mật khẩu (*)"
            type="password"
            nameInput="password"
            value={form.password}
            onChangeForm={onChangeForm}
          />
          {err.password && (
            <p className="text-sm text-red-500">{err.password}</p>
          )}
        </div>
        <div>
          <Input
            className="w-full"
            label="Nhập lại mật khẩu (*)"
            type="password"
            nameInput="confirmPassword"
            value={form.confirmPassword}
            onChangeForm={onChangeForm}
          />
          {err.confirmPassword && (
            <p className="text-sm text-red-500">{err.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="">Phân quyền:</div>
          <select
            value={form.role}
            onChange={handleChangeSelect}
            name="role"
            className="border-1 w-[278px] h-[50px] pl-[11px] pr-[22px] block"
          >
            <option value={1}>ADMIN</option>
            <option value={0}>USER</option>
          </select>
        </div>
        <Button
          onClick={handleSubmit}
          className="border-green-600 bg-green-500 "
        >
          Thêm mới người dùng
        </Button>
      </div>
    </div>
  );
}
