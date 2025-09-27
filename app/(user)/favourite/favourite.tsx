"use client";

import Button from "@/components/client/Button";
import Cart from "@/components/client/Cart";
import NotFondComponent from "@/components/client/NotFond";
import Pagination from "@/components/client/Pagination";
import Loading from "@/components/loading ";
import { useAppSelector } from "@/hooks/redux";
import { fetchProductOfFavourite } from "@/services/favouriteService";
import { FavouriteOfProductResponse } from "@/types/favourite";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FavouritePage() {
  const user = useAppSelector((state) => state.user);
  const searchParams = useSearchParams();

  const limit = 16;
  const page = Number(searchParams.get("page") || 1);

  const [loading, setLoading] = useState(false);
  const [favourite, setFavourite] = useState<FavouriteOfProductResponse>();

  useEffect(() => {
    const apiFavourite = async () => {
      if (user.token && user.isLoggedIn) {
        setLoading(true);
        const res = await fetchProductOfFavourite({
          idUser: user.user?.id,
          token: user.token,
          limit,
          page,
        });
        setLoading(false);
        if (res && res.success) {
          setFavourite(res);
        }
      }
    };
    apiFavourite();
  }, [user.token, user.user?.id, page]);

  const handleRemoved = (id: number) => {
    setFavourite((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: prev.data.filter((item) => item.id !== id),
        total: prev.total - 1,
      };
    });
  };

  if (!loading && favourite?.total === 0) {
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

  if (favourite && favourite.last_page < page) {
    return <NotFondComponent />;
  }

  return (
    <div className="">
      {!favourite ? (
        <Loading />
      ) : (
        <div className="md:mt-0 mt-[30px] pt-5  max-w-laptop mx-auto md:max-w-laptop md:mx-auto w-full px-[15px]">
          <h1 className="text-[20px] text-primary font-bold">
            Sản phẩm đã yêu thích
          </h1>
          <div className="grid lg:grid-cols-4 gap-4 grid-cols-2 md:grid-cols-3 ">
            {favourite?.data.map((item) => (
              <Cart
                key={item.id}
                data={item}
                isShowFavouriteText
                handleRemoved={handleRemoved}
              />
            ))}
          </div>
          {!loading && favourite && (
            <div className="mt-2">
              <Pagination
                currentPage={favourite?.current_page!}
                lastPage={favourite?.last_page!}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
