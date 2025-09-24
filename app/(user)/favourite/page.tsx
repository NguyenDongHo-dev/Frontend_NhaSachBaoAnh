"use client";

import Button from "@/components/client/Button";
import Cart from "@/components/client/Cart";
import Loading from "@/components/loading ";
import { useAppSelector } from "@/hooks/redux";
import { fetchProductOfFavourite } from "@/services/favouriteService";
import { Product } from "@/types/product";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FavouritePage() {
  const user = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [favourite, setFavourite] = useState<Product[]>();

  useEffect(() => {
    const apiFavourite = async () => {
      if (user.token && user.isLoggedIn) {
        setLoading(true);
        const res = await fetchProductOfFavourite({
          idUser: user.user?.id,
          token: user.token,
        });
        setLoading(false);
        if (res && res.success) {
          setFavourite(res.data);
        }
      }
    };
    apiFavourite();
  }, [user.token, user.user?.id]);

  const handleRemoved = (id: number) => {
    setFavourite((prev) => prev?.filter((p) => p.id !== id));
  };

  if (favourite?.length === 0) {
    return (
      <div className="max-w-laptop mx-auto mt-[60px]">
        <div className="flex items-center justify-center ">
          <div className="flex flex-col gap-2 items-center">
            <p>Chưa có sản phẩm yêu thích</p>
            <Link href={"/cua-hang"}>
              <Button className="bg-primary text-white font-bold py-2 px-3">
                Quay trở lại cửa hàng
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="md:mt-0 mt-[30px] pt-5  max-w-laptop mx-auto md:max-w-laptop md:mx-auto w-full px-[15px]">
          <h1 className="text-[20px] text-primary font-bold">
            Sản phẩm đã yêu thích
          </h1>
          <div className="grid grid-cols-4 gap-5">
            {favourite?.map((item) => (
              <Cart
                key={item.id}
                data={item}
                isShowFavouriteText
                handleRemoved={handleRemoved}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
