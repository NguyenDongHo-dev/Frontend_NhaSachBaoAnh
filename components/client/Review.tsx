"use client";

import { useAppSelector } from "@/hooks/redux";
import Button from "./Button";
import Input from "./Input";
import { Product } from "@/types/product";
import { useEffect, useRef, useState } from "react";
import {
  fetchAllReviewByProduct,
  fetchNewReview,
} from "@/services/reviewServices";
import { toast } from "react-toastify";
import { GetReviews, Review } from "@/types/review";
import { formatDay } from "@/utils";
import { BadgeAlert } from "lucide-react";
import Link from "next/link";

interface IProps {
  product: Product;
}

interface IErr {
  star?: string;
  review?: string;
}

export default function ShowReview({ product }: IProps) {
  const limit = 5;

  const user = useAppSelector((state) => state.user);
  const [page, setPage] = useState<number>(1);
  const [reviewAll, setReviewAll] = useState<GetReviews>();
  const [star, setStar] = useState<number | undefined>(undefined);
  const [formReview, setFormReview] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<IErr>();

  const fetchedRef = useRef(false);

  const fetchAllreviews = async () => {
    if (page === 1 && fetchedRef.current) return;

    const res = await fetchAllReviewByProduct({ id: product.id, limit, page });

    if (res.success) {
      setReviewAll((prev) => {
        if (!prev) return res;

        const newData = res.data.filter(
          (item) => !prev.data.some((old) => old.id === item.id)
        );

        return {
          ...res,
          data: [...prev.data, ...newData],
        };
      });
    }

    if (page === 1) {
      fetchedRef.current = true;
    }
  };

  useEffect(() => {
    fetchAllreviews();
  }, [page]);

  const setRating = (value: number) => {
    setStar(value);
    setErr((pew) => {
      const newErr = { ...pew };
      delete newErr["star"];
      return newErr;
    });
  };

  const handlePostReview = async () => {
    const errors: {
      star?: string;
      review?: string;
    } = {};

    if (!star) {
      errors.star = "Bạn chưa có chọn số sao";
    }
    if (!formReview) {
      errors.review = "Nội dung đánh giá không được để trống";
    }

    if (Object.keys(errors).length > 0) {
      setErr(errors);
      return;
    }
    const form = {
      rating: star,
      comment: formReview,
      product_id: product.id,
    };
    setLoading(true);
    if (user.token) {
      const res = await fetchNewReview({ token: user.token, form });

      if (res?.success) {
        toast.success("Cảm ơn bạn đã đánh giá");

        const dataRes = res.data;
        setReviewAll((prev) => {
          if (!prev) return undefined;

          return {
            ...prev,
            data: [dataRes, ...prev.data],
            total: prev.total + 1,
          };
        });
      } else {
        toast.error(res?.message);
      }
    }
    setLoading(false);
    setStar(undefined);
    setFormReview("");
  };

  return (
    <div className="">
      <h3 className="font-bold text-[1.25em] text-primary line-clamp-2">
        Đánh giá
      </h3>
      <div className="mt-4">
        {reviewAll?.data?.length === 0 ? (
          <div>Chưa có đánh giá nào.</div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto">
            {reviewAll?.data.map((item) => (
              <div
                key={item.id}
                className="flex items-start border-t border-[rgb(242,242,242)] pt-1 "
              >
                <div className="w-[300px] ">
                  <div className="line-clamp-2 font-bold ">{item.user}</div>
                  <div>Đã tham gia: {formatDay(item.created_at)}</div>
                </div>
                <div className="">
                  <div>
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <span
                        key={i}
                        className={`
                  text-2xl leading-0
                  text-yellow-500`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div>{item.comment}</div>
                </div>
              </div>
            ))}
            {reviewAll?.current_page !== reviewAll?.last_page && (
              <div
                onClick={() => setPage(page + 1)}
                className="text-blue-500 cursor-pointer"
              >
                Tải thêm bình luận
              </div>
            )}
          </div>
        )}

        {user.isLoggedIn && user.user?.email ? (
          <div className="border-2 border-primary px-[30px] pt-[15px] pb-[30px] mt-[50px]">
            <div className="space-y-3">
              <h3 className="font-bold text-[1.25em] text-primary line-clamp-2">
                Hãy nhận xét "{product.name}"
              </h3>
              <div className="text-[#222] text-[.9em] font-bold">
                Đánh giá của bạn *
              </div>
              <div className="flex items-center gap-6 ">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label
                    key={value}
                    className="flex items-center justify-end gap-1 cursor-pointer group w-[120px] "
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={value}
                      className="hidden "
                      onChange={() => setRating(value)}
                    />
                    <div
                      className={`flex relative ${
                        value !== 5 &&
                        "before:absolute before:top-1/2 before:-translate-y-1/2 before:-right-1 before:bg-[#ddd] before:w-[1px] before:h-[28px]"
                      } `}
                    >
                      {Array.from({ length: value }).map((_, i) => (
                        <span
                          key={i}
                          className={`
                  text-2xl
                  text-[#ddd]
                  group-hover:text-[#d26e4b]
                  ${star === value && "text-yellow-500"}
                `}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
              {err?.star && (
                <p className="text-sm text-red-500 mt-1">{err.star}</p>
              )}
              <div className="text-[#222] text-[.9em] font-bold">
                Đánh giá của bạn *
              </div>
              <textarea
                onChange={(e) => {
                  setErr((prev) => {
                    const newErr = { ...prev };
                    delete newErr["review"];
                    return newErr;
                  });

                  setFormReview(e.target.value);
                }}
                cols={45}
                rows={8}
                value={formReview}
                className="p-3 pb-0 shadow border border-[#ddd] focus:outline-none focus:shadow w-[100%] h-[]"
                name="review"
              ></textarea>
              {err?.review && (
                <p className="text-sm text-red-500 mt-1">{err.review}</p>
              )}
              <Input
                label="Email"
                nameInput="email"
                type="email"
                value={user.user?.email!}
                className="w-full focus:shadow-none"
              />
              <Button
                disabled={loading}
                onClick={handlePostReview}
                className="px-3 py-2 bg-primary text-white rounded-[4px] font-bold text-[17px] mb-10 "
              >
                GỬI ĐI
              </Button>
            </div>
          </div>
        ) : (
          <Link href={"/dang-nhap"}>
            <div className="mt-8 border text-yellow-700 border-yellow-400 bg-yellow-50 rounded-md w-fit py-2 px-4 cursor-pointer flex items-center gap-2 shadow-sm hover:bg-yellow-100 transition-colors">
              <BadgeAlert />
              <span className=" font-medium">
                Bạn cần phải đăng nhập mới bình luận được
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
