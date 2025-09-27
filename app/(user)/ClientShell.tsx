import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Badge from "@/components/client/Badge";
import { fetchAllCategory } from "@/services/categoryService";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-[130px] pb-[100px]">
        {children}
        <Badge />
      </main>
      <Footer />
    </div>
  );
}
