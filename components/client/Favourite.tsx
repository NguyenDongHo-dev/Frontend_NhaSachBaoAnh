"use client";

import { useAppSelector } from "@/hooks/redux";
import { fetchFavourite } from "@/services/favouriteService";
import { Heart } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addFavourite, removeFavourite } from "@/redux/slices/favouriteSlice";

export default function Favourite({ productId }: { productId: number }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);

  const [show, setShow] = useState(false);

  const fetchApiFavourite = async () => {
    if (user.token && user.isLoggedIn) {
      const res = await fetchFavourite({
        idUser: user.user?.id,
        token: user.token,
        product_id: productId,
      });
      if (res?.success) {
        if (res.action === "add") {
          toast.success("Đã thêm vào danh sách yêu thích");
          dispatch(addFavourite(productId));
        } else if (res.action === "removed") {
          toast.info("Đã xóa khỏi danh sách yêu thích");
          dispatch(removeFavourite(productId));
        }
      }
    }
  };

  const handleShow = () => {
    if (user.isLoggedIn || user.token) {
      fetchApiFavourite();
    } else {
      setShow(true);
    }
  };

  return (
    <div>
      {show && (
        <Modal
          label={`Bạn phải đăng nhập mới thục hiện được`}
          onClose={() => setShow(false)}
          onConfirm={() => router.push("/dang-nhap")}
        />
      )}
      <div onClick={handleShow} className="">
        <Heart size={20} />
      </div>
    </div>
  );
}
