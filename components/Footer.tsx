import {
  Truck,
  Undo2,
  UserRoundCheck,
  Shield,
  ChevronRight,
} from "lucide-react";
import logoDark from "../public/logo-dark.png";
import Image from "next/image";
import Link from "next/link";

const policy = [
  {
    href: "/chinh-sach-bao-mat",
    lable: "Chính sách bảo mật",
  },
  {
    href: "/chinh-sach-van-chuyen",
    lable: "Chính sách Vận chuyển",
  },
  {
    href: "/chinh-sach-doi-tra",
    lable: "Chính sách Đổi trả",
  },
  {
    href: "/chinh-sach-hoan-tien",
    lable: "Chính sách Hoàn Tiền",
  },
  {
    href: "/dieu-khoan-va-dieu-kien-terms-conditions",
    lable: "Điều khoản và điều kiện",
  },
];

function Footer() {
  return (
    <footer className="border-t border-[#ececec]">
      <div className="max-w-laptop mx-auto">
        <div className="grid grid-cols-1 gap-5 md:py-7 py-9 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 justify-between items-center">
            <Truck size={28} />
            <div className="text-[14px] text-black font-bold">
              Miễn phí ship cho đơn từ 299k
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-between items-center">
            <Undo2 size={28} />
            <div className="text-[14px] text-black font-bold">
              7 ngày đổi trả miễn phí
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-between items-center">
            <UserRoundCheck size={28} />
            <div className="text-[14px] text-black font-bold">
              Tư vấn, hỗ trợ tận tâm
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-between items-center">
            <Shield size={28} />
            <div className="text-[14px] text-black font-bold">
              Bảo mật thông tin
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black text-[#f1f1f1] text-[16px]">
        <div className="pt-[60px] pb-[120px] max-w-laptop mx-auto">
          <div className="grid grid-cols-1 pt-[30px] gap-[30px] md:grid-cols-3">
            <div className="flex gap-8 flex-col px-[15px]">
              <Link href={"/"}>
                <div className="relative  aspect-[4/5] w-[268px] h-[96px]">
                  <Image
                    alt="logo"
                    src={logoDark}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>
              </Link>
              <ul className="list-disc pl-5">
                <li>
                  <strong className="font-bold">Địa chỉ: </strong>
                  Tầng 5 tòa nhà The Nine số 9 Phạm Văn Đồng, Mai Dịch, Cầu
                  Giấy, Hà Nội
                </li>
              </ul>
            </div>
            <div className="flex gap-2 flex-col px-[15px] ">
              <div className="font-bold mb-[9px] text-[18px]">
                Chính sách & điều khoản
              </div>
              <ul className="flex flex-col ">
                {policy.map((item) => (
                  <li
                    key={item.lable}
                    className="flex items-center gap-[16px] border-b border-[hsla(0,0%,100%,.2)] py-[7px]"
                  >
                    <ChevronRight size={17} color="#7a9c59" />
                    <Link href={item.href}>{item.lable}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 flex-col px-[15px] ">
              <div className="font-bold mb-[9px] text-[18px]">Liên hệ</div>
              <ul className="list-disc pl-5 flex flex-col gap-2 ">
                <li>
                  <strong className="font-bold">Hotline: </strong>
                  0779.718.812
                </li>
                <li>
                  <strong className="font-bold">E-mail: </strong>
                  lienhe@nhasachbaoanh.com
                </li>
                <li>
                  <strong className="font-bold">Email: </strong>
                  nhasachbaoanhbook@gmail.com
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center pt-[10px] pb-[15px] text-[hsla(0,0%,100%,.5)]">
          Copyright 2025 © Bảo Anh Book. Nhà sách Bảo Anh
        </div>
      </div>
    </footer>
  );
}

export default Footer;
