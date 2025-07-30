"use client";
import Cart from "@/components/Cart";
import Button from "@/components/client/Button";
import Quantity_button from "@/components/client/Quantity_button";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface IProps {
  data: Product;
  similarProducts: similarProducts;
}

interface similarProducts {
  products?: Product[];
  category?: Category;
}

export default function DetailsProduct(props: IProps) {
  const { data, similarProducts } = props;
  const [indexImage, setIndexImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [tap, setTap] = useState<number>(0);

  const totalImage = data.image.length;

  const handleQuantity = (type: string) => {
    setQuantity((prev) => {
      if (type === "+") return prev + 1;
      if (type === "-" && prev > 1) return prev - 1;
      return prev;
    });
  };

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

  return (
    <div className="md:max-w-laptop md:mx-auto md:w-full px-[15px] md:mt-0 mt-[30px] ">
      <div className="grid grid-cols-1 md:grid-cols-2 py-10 border-b gap-[40px]">
        <div>
          <div className="relative aspect-[4/5] group overflow-hidden ">
            {data.discount > 0 && (
              <div className="absolute top-0 left-0 z-10 mt-[30px] md:text-[1.3em] flex items-center justify-center bg-primary text-[1.2em] font-semibold size-[58px] rounded-full text-white ">
                -12{data.discount}%
              </div>
            )}

            {totalImage > 0 && (
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
              {data.image.map((img: string, idx: number) => (
                <div key={idx} className="w-full min-w-full h-full relative ">
                  <Image
                    src={`${process.env.API_SERVER}/${img}`}
                    alt={data.name}
                    fill
                    className="object-cover select-none pointer-events-none"
                  />
                </div>
              ))}
            </div>

            {totalImage > 0 && (
              <div
                onClick={() => OnImage("right")}
                className="opacity-0 p-2 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-400 absolute z-10 top-1/2 right-0 -translate-y-1/2 hover:text-primary cursor-pointer "
              >
                <ChevronRight size={40} />
              </div>
            )}
          </div>
          {totalImage > 0 && (
            <div className="flex gap-[10px] mt-3">
              {data.image.map((img: string, index: number) => (
                <div
                  onClick={() => setIndexImage(index)}
                  key={index}
                  className={`relative select-none overflow-hidden   cursor-pointer w-[111px] h-[111px] hover:border border-[rgba(0,0,0,.2)]  transition-all duration-200 ${
                    indexImage === index ? "opacity-100" : "opacity-[50%]"
                  }`}
                >
                  <Image
                    src={`${process.env.API_SERVER}/${img}`}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover  translate-y-2 hover:translate-y-0 transition-all duration-400 "
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
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
            <div>{data.rating}*</div>
            <div>(1 danh giá)</div>
            <div className="w-[1px] h-3 bg-[rgb(199,199,199)]"></div>
            <div className="text-[rgb(120,120,120)] text-[14px]">
              Đã bán {data.sold | 0}
            </div>
          </div>
          <div className="flex items-center gap-2 ">
            {data.discount > 0 && (
              <div className="flex items-center gap-1 text-[#111]">
                <div className="font-bold  opacity-60 text-[1.5em]">
                  {data.price / (1 - data.discount / 100)}
                </div>
                <samp className="align-top inline-block">đ</samp>
              </div>
            )}

            <div className="flex items-center gap-1 text-primary">
              <div className="font-bold  opacity-60 text-[1.5em]">
                {data.price}
              </div>
              <samp className="align-top inline-block">đ</samp>
            </div>
          </div>
          <div>{data.short_description}</div>
          <div className=" flex items-center gap-2">
            <Quantity_button
              quantity={quantity}
              setQuantity={setQuantity}
              onClick={handleQuantity}
            />
            <div>
              <Button className=" bg-primary text-white text-[1em] font-semibold hover:bg-[#CC1212]">
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
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
            Đánh giá (0)
          </div>
        </div>
        <div className="pt-4">
          {tap === 0 && (
            <div>
              Với những hướng dẫn tỉ mỉ và những bảng tính dễ sử dụng,
              “Marketing căn bản” mang đến một cái nhìn thực tế về marketing và
              hỗ trợ tất cả những ai muốn tăng doanh thu, lợi nhuận, đồng tiền
              và RIO của doanh nghiệp mình. Dưới sự hướng dẫn của Don Sexton,
              bạn sẽ tự mình khám phá những chiến lược kinh doanh hiệu quả cũng
              như làm chủ chúng để tăng doanh thu, lợi nhuận, xây dựng thương
              hiệu và niềm tin của khách hàng. Được viết với mục đích vừa như
              một cuốn sách vỡ lòng vừa như một cuốn sách hướng dẫn cho các khoá
              học marketing trong trường Đại học Trump, Làm thế nào sử dụng
              những ý tưởng marketing hiệu quả nhất để thu hút khách hàng cung
              cấp tất cả các thông tin và chiến lược cần thiết để marketing
              thành công sản phẩm hoặc dịch vụ. Dù bạn bán cái gì và bán như thế
              nào, bạn điều hành một doanh nghiệp nhỏ hay một tập đoàn lớn, cuốn
              sách hướng dẫn đầy đủ và toàn diện này giải thích tất cả những
              điều bạn nên biết về marketing hiện đại. Tính cập nhật của cuốn
              sách được thể hiện qua những kiến thức mới về marketing trong một
              thế giới phẳng, trong một thời đại mới, khi sự cạnh tranh ngày một
              khốc liệt thì marketing-mix không chỉ bó hẹp trong 4 Ps truyền
              thống.
            </div>
          )}

          {tap === 1 && <div>Danh gia</div>}
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
