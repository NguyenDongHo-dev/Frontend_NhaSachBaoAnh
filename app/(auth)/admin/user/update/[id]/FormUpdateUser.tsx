import Button from "@/components/client/Button";
import Input from "@/components/client/Input";
import { useAppSelector } from "@/hooks/redux";
import { fetchUpdateUserByAdmin } from "@/services/userService";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  data: User;
}

export default function FormUpdateUser({ data }: Props) {
  const route = useRouter();
  const user = useAppSelector((state) => state.user);
  const [isClient, setIsClient] = useState(false);

  const [err, setErr] = useState<{
    email?: string;
  }>({});
  const [form, setForm] = useState(data);

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id ?? 0,
        name: data.name ?? "",
        address: data.address ?? "",
        phone: data.phone ?? "",
        role: data.role ?? 0,
        email: data.email ?? "",
      });
    }
  }, [data]);

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

    if (Object.keys(errors).length > 0) {
      setErr(errors);
      return;
    }

    const res = await fetchUpdateUserByAdmin({ token: user.token, form });

    const { success, status } = res;

    if (status === 422 && !success) {
      setErr({
        ...errors,
        email: res.message,
      });
      return;
    }
    if (success) {
      toast.success("cap nhat nguoi dung thanh cong");
      route.push("/admin/user");
    }
  };

  return (
    <div>
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
          Cập nhật người dụng
        </Button>
      </div>
    </div>
  );
}
