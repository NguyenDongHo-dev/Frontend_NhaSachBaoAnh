import Input from "@/components/client/Input";
import NotFondComponent from "@/components/client/NotFond";
import { fetchAllDetailsProduct } from "@/services/productService";
import Image from "next/image";

export default async function showDetailspage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetchAllDetailsProduct(slug);
  if (!res) {
    return <NotFondComponent />;
  }

  const { data } = res;

  return (
    <div>
      <div>
        <h1 className="font-bold text-primary text-[20px]">
          Chi tiết sản phảm
        </h1>
      </div>
      <div className="space-y-5">
        <Input
          label="Tên sản phẩm"
          nameInput="name"
          className="w-full"
          value={data.name}
        />
        <div className="flex items-center gap-5">
          <div>
            <Input
              readOnly={true}
              label="Giá sản phẩm"
              nameInput="price"
              className="w-full"
              value={String(data.price)}
            />
          </div>

          <Input
            readOnly={true}
            label="Giả giá (%)"
            nameInput="discount"
            className="w-full"
            value={String(data.discount | 0)}
          />
          <div>
            <Input
              readOnly={true}
              label="Số lượng"
              nameInput="stock"
              className="w-full"
              value={String(data.stock)}
            />
          </div>
          <div className="">
            <div className="mb-[6px] ">
              Tên danh muc:{" "}
              <samp className=" text-[#222] font-bold">
                {data.category.name}
              </samp>
            </div>
          </div>
        </div>
        <div className="border p-2 rounded-[4px]">
          <label className=" block ">Mô tả ngắn:</label>
          <div
            dangerouslySetInnerHTML={{
              __html: data.short_description || "Chưa có...",
            }}
          />
        </div>
        <div className="border p-2 rounded-[4px]">
          <label className="py-2 block">Mô tả dài:</label>
          <div
            dangerouslySetInnerHTML={{
              __html: data.description || "Chưa có...",
            }}
          />
        </div>

        <div className="flex items-center gap-1">
          <div>Status:</div>
          <div className="p-2 border rounded-[4px]">
            {data.status === 1 ? "Hiển thị" : "Ẩn"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="items-center gap-1 cursor-pointer inline-block">
            Hình ảnh:
          </label>
          {data.image.map((src, index) => (
            <div
              key={index}
              className="relative group cursor-pointer w-20 h-20"
            >
              <Image
                src={`${process.env.API_SERVER}/${src.url}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={`preview-${index}`}
                className="object-cover rounded border"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
