"use client";
import Cart from "@/components/client/Cart";
import Button from "@/components/client/Button";
import Quantity_button from "@/components/client/Quantity_button";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem, updateQuantity } from "@/redux/slices/cartSlice";
import { useAppSelector } from "@/hooks/redux";
import { formatPrice } from "@/utils";
import ShowReview from "@/components/client/Review";
import { GetReviews } from "@/types/review";
import { toast } from "react-toastify";

interface IProps {
  data: Product;
  similarProducts: similarProducts;
}

interface similarProducts {
  products: Product[];
  category: Category | null;
}

export default function DetailsProduct(props: IProps) {
  const cart = useAppSelector((state) => state.cart);
  const { data, similarProducts } = props;
  const dispatch = useDispatch();
  const [indexImage, setIndexImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [tap, setTap] = useState<number>(0);

  const totalImage = data.image.length;

  useEffect(() => {
    const existingItem = cart.items.find((item) => item.id === data.id);
    if (existingItem) {
      setQuantity(existingItem.quantity);
    } else {
      setQuantity(1);
    }
  }, []);

  // const handleQuantity = (type: string) => {
  //   setQuantity((prev) => {
  //     if (type === "+") return prev + 1;
  //     if (type === "-" && prev > 1) return prev - 1;
  //     return prev;
  //   });
  // };

  const OnImage = (type: string) => {
    if (type === "left") {
      setIndexImage((prev) => (prev - 1 + totalImage) % totalImage);
    } else {
      setIndexImage((prev) => (prev + 1) % totalImage);
    }
  };

  useEffect(() => {
    if (indexImage > totalImage - 1) {
      setIndexImage(0);
    }

    if (indexImage < 0) {
      setIndexImage(0);
    }
  }, [indexImage]);

  const handleAddCart = () => {
    dispatch(
      addItem({
        id: data.id,
        name: data.name,
        price: data.price,
        quantity,
        image: data.image[0].url,
        slug: data.slug,
        stock: data.stock,
      })
    );
  };

  const handleQuantity = (type: string, productId: number) => {
    const item = cart.items.find((item) => item.id === productId);
    if (!item) return;

    const newQuantity =
      type === "+" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
    if (cart.err) {
      toast.error(
        `Sản phẩm ${item.name} chỉ còn ${item.stock} nên ${cart.err}`
      );
    }
  };

  return (
    <div className="md:max-w-laptop md:mx-auto md:w-full px-[15px] md:mt-0 mt-[30px]">
      <div className="grid grid-cols-1 md:grid-cols-2 py-10 border-b gap-[40px]">
        <div className="relative">
          {data.discount > 0 && (
            <div className="absolute top-0 -left-2 z-10 mt-[30px] md:text-[1.3em] flex items-center justify-center bg-primary text-[1.2em] font-semibold size-[58px] rounded-full text-white ">
              -{data.discount}%
            </div>
          )}
          <div className="relative aspect-[5/4] group overflow-hidden ">
            {totalImage > 1 && (
              <div
                onClick={() => OnImage("left")}
                className="opacity-0 p-2 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-400 absolute z-10 top-1/2 -translate-y-1/2 hover:text-primary cursor-pointer "
              >
                <ChevronLeft size={40} />
              </div>
            )}
            <div
              className="flex  w-full h-full  transition-transform duration-500  "
              style={{ transform: `translateX(-${indexImage * 100}%)` }}
            >
              {data.image.map((img, idx) => (
                <div
                  key={img.id}
                  className="w-full min-w-full h-full relative "
                >
                  <Image
                    src={`${process.env.API_SERVER}/${img.url}`}
                    alt={data.name}
                    fill
                    className="object-contain select-none pointer-events-none"
                  />
                </div>
              ))}
            </div>

            {totalImage > 1 && (
              <div
                onClick={() => OnImage("right")}
                className="opacity-0 p-2 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-400 absolute z-10 top-1/2 right-0 -translate-y-1/2 hover:text-primary cursor-pointer "
              >
                <ChevronRight size={40} />
              </div>
            )}
          </div>
          {totalImage > 1 && (
            <div className="flex gap-[10px] mt-3  ">
              {data.image.map((img, index) => (
                <div
                  onClick={() => setIndexImage(index)}
                  key={index}
                  className={`relative select-none overflow-hidden   cursor-pointer w-[111px] h-[111px] hover:border border-[rgba(0,0,0,.2)]  transition-all duration-200 ${
                    indexImage === index ? "opacity-100" : "opacity-[50%]"
                  }`}
                >
                  <Image
                    src={`${process.env.API_SERVER}/${img.url}`}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover  translate-y-2 hover:translate-y-0 transition-all duration-400 select-none "
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 uppercase text-[hsla(0,0%,40%,.7)]">
            <div className="hover:text-[#111]">
              <Link href="/">Trang chủ</Link>
            </div>
            <samp>/</samp>
            <div className="hover:text-[#111]">
              <Link href={`/danh-muc-san-pham/${data.category.slug}`}>
                Sach tai chinh
              </Link>
            </div>
          </div>
          <h1 className="text-primary font-bold text-[1.4em] md:text-[1.7em]">
            {data?.name}
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {data.rating}
              <span
                className={`
                  text-2xl leading-0
                  text-yellow-500`}
              >
                ★
              </span>
            </div>
            <div>({data.total_reviews} đánh giá)</div>
            <div className="w-[1px] h-3 bg-[rgb(199,199,199)]"></div>
            <div className="text-[rgb(120,120,120)] text-[14px]">
              Đã bán {data.sold | 0}
            </div>
          </div>
          <div className="flex items-center gap-2 ">
            {data.discount > 0 && (
              <div className="flex items-center gap-1 text-[#111] line-through">
                <div className="font-bold  opacity-60 text-[1.5em]">
                  {formatPrice(
                    Math.ceil(data.price / (1 - data.discount / 100) / 1000) *
                      1000
                  )}
                </div>
                <samp className="align-top inline-block">đ</samp>
              </div>
            )}

            <div className="flex items-center gap-1 text-primary">
              <div className="font-bold   text-[1.5em]">
                {formatPrice(data.price)}
              </div>
              <samp className="align-top inline-block">đ</samp>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: data.short_description }} />
          {data.stock > 0 ? (
            <div className=" flex items-center gap-2 mt-2">
              <Quantity_button
                quantity={quantity}
                setQuantity={setQuantity}
                onClick={(type: string) => handleQuantity(type, data.id)}
              />
              <div>
                <Button
                  onClick={handleAddCart}
                  className=" bg-primary text-white text-[1em] font-semibold hover:bg-[#CC1212] py-2 px-[19px]"
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-primary text-white py-2 px-3  w-fit rounded-[4px]">
              Sản phẩm đã hết hàng
            </div>
          )}
        </div>
      </div>
      <div className="py-[30px] border-b">
        <div className="flex flex-col md:flex-row  items-center gap-3 px-[10px] md:px-0">
          <div
            onClick={() => setTap(0)}
            className={` ${
              tap === 0
                ? "text-primary border-primary border-2 rounded-full "
                : "text-[hsla(0,0%,40%,.85)]  hover:text-[hsla(0,0%,7%,.85)] "
            } cursor-pointer uppercase md:w-auto py-[10px] inline-block w-full font-bold text-[.8em] px-[10px] `}
          >
            Mô tả
          </div>
          <div
            onClick={() => setTap(1)}
            className={` ${
              tap === 1
                ? "text-primary border-primary border-2 rounded-full "
                : "text-[hsla(0,0%,40%,.85)]  hover:text-[hsla(0,0%,7%,.85)]"
            } cursor-pointer uppercase md:w-auto py-[10px] inline-block w-full font-bold text-[.8em] px-[10px]  `}
          >
            Đánh giá ({data?.total_reviews})
          </div>
        </div>
        <div className="pt-4">
          <div hidden={tap !== 0}>
            <div dangerouslySetInnerHTML={{ __html: data.description }} />
          </div>

          <div hidden={tap !== 1}>
            <ShowReview product={data} />
          </div>
        </div>
      </div>
      <div className="py-[15px]">
        <h3 className="uppercase text-primary font-bold text-[1em] md:text-[1.25em]  mb-[10px] ">
          Sản phẩm tương tự
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {similarProducts?.products?.map((item) => (
            <Cart key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
