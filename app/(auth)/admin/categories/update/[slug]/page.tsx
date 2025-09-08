import { geetDetailsCatogory } from "@/services/categoryService";
import FormUpdateCategory from "./formUpdate";

export default async function updateCatogoryPgae({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await geetDetailsCatogory(slug);
  if (!res) {
    return <div className="">Khong co danh muc nhu vay</div>;
  }
  const { data } = res;

  return (
    <div>
      <h1 className="font-bold text-primary text-[20px] pb-2">
        Cập nhật danh mục
      </h1>
      <FormUpdateCategory data={data} />
      
    </div>
  );
}
