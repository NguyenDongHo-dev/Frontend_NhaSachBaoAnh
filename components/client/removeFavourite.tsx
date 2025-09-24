import { useAppSelector } from "@/hooks/redux";
import { removeFavourite } from "@/redux/slices/favouriteSlice";
import { fetchRemoveFavourite } from "@/services/favouriteService";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function RemoveFavourite({
  idProduct,
  handleRemoved,
}: {
  idProduct: number;
  handleRemoved?: (id: number) => void;
}) {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);

  const handleRemoveFavourite = async (id: number) => {
    if (user.token && user.user) {
      const res = await fetchRemoveFavourite({
        idUser: user.user?.id,
        token: user.token,
        product_id: id,
      });

      if (res && res.success) {
        toast.success("Xỏa sản phẩm yêu thích thành công");
        handleRemoved?.(id);
        dispatch(removeFavourite(id));
      }
    }
  };
  return (
    <div
      onClick={() => handleRemoveFavourite(idProduct)}
      className="px-3 py-1 border mt-3 rounded-[4px] hover:bg-black hover:text-white font-medium w-fit mx-auto cursor-pointer"
    >
      Xóa sản phẩm
    </div>
  );
}
