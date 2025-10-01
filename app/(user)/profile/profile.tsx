"use client";

import Button from "@/components/client/Button";
import Input from "@/components/client/Input";
import SearchableDropdown from "@/components/client/SearchableDropdown";
import { dataVn } from "@/data";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setUser } from "@/redux/slices/userSlice";
import { fetchUpdateUser } from "@/services/userService";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProfilePgae() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector((state) => state.user);
  const [form, setForm] = useState<User>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  //address
  const [street, setStreet] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedWart, setSelectedWart] = useState<
    { Code: string; FullName: string; ProvinceCode: string }[] | undefined
  >(undefined);
  const [ward, setWard] = useState<string>("");

  useEffect(() => {
    const city = dataVn.find((isCity) => isCity.FullName === selectedCity);
    if (city) {
      setSelectedWart(city.Wards);
      setWard("");
    }
  }, [selectedCity]);

  //end address

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (user.user) {
      if (user.user && user.user.address) {
        const [street, ward, city] = user.user.address
          .split(",")
          .map((s) => s.trim());

        setStreet(street || "");
        setWard(ward || "");
        setSelectedCity(city || "");
      }

      setForm(user.user);
    }
  }, [user.user]);

  const OnUpdateUser = async () => {
    if (user.token && user.isLoggedIn) {
      const address = `${street}, ${ward}, ${selectedCity}`;

      if (form.phone) {
        if (!/^\d{9,11}$/.test(form.phone)) {
          toast.error("Số điện thoại phải là số và có từ 9 đến 11 chữ số");
          return;
        }
      }

      setLoading(true);
      const res = await fetchUpdateUser({
        form: {
          ...form,
          address,
        },
        token: user.token,
      });
      setLoading(false);
      if (res.success) {
        router.push("/");
        toast.success("Lưu thông tin thành công");
        dispatch(setUser({ user: res.data }));
      }
    }
  };

  return (
    <div className="max-w-laptop mx-auto px-[15px] pt-[40px] md:pt-[30px]">
      <h1 className="text-[20px] text-primary font-bold">
        Thông tin tài khoản
      </h1>
      <div className="mt-[10px]">
        <div className="flex flex-col gap-4">
          <Input
            onChangeForm={onChangeForm}
            type="text"
            nameInput="name"
            label="Họ và tên  "
            value={form.name ?? ""}
            className="w-full shadow"
          />
          <div className="flex flex-col sm:flex-row sm:gap-[22px] sm:items-center gap-[6px] ">
            <div className="flex-1">
              <Input
                onChangeForm={onChangeForm}
                type="text"
                nameInput="phone"
                label="Số điện thoại "
                value={form.phone ?? ""}
                className="w-full shadow  "
              />
            </div>

            <div className="flex-1">
              <Input
                type="text"
                nameInput="email"
                label="Địa chỉ email"
                value={form.email ?? ""}
                className="w-full cursor-default shadow-none "
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-[22px] sm:items-center gap-[6px] ">
            <div className="flex-1">
              <SearchableDropdown
                label="Tỉnh/Thành phố "
                placeholder="Chọn tỉnh/thành phố"
                items={dataVn}
                selected={selectedCity}
                setSelected={setSelectedCity}
              />
            </div>
            <div className="flex-1">
              <SearchableDropdown
                label="Phường/Xã "
                placeholder="Chọn phường/xã"
                items={selectedWart || []}
                selected={ward}
                setSelected={setWard}
              />
            </div>
          </div>

          <Input
            onChangeForm={(e) => setStreet(e.target.value)}
            type="text"
            nameInput="street"
            label="Địa chỉ cụ thể"
            value={street}
            className="w-full shadow"
          />
        </div>
      </div>
      <div className="mt-[30px]">
        <Button
          onClick={() => OnUpdateUser()}
          disabled={loading}
          className="px-3 py-2 bg-primary hover:bg-[#cc1212] transition-colors duration-200 text-white font-bold "
        >
          {loading ? "Đang cập nhật..." : " Lưu thông tin"}
        </Button>
      </div>
    </div>
  );
}
