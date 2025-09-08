// Import global styles and fonts
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFondComponent from "@/components/client/NotFond";
import { ReduxProvider } from "./providers";
import AppWrapper from "@/components/client/ClientLayout";
import ToastContainerMain from "@/components/client/ToastContainer";
import Badge from "@/components/client/Badge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Không tìm thấy trang - Nhà Sách Bảo Anh",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ReduxProvider>
          <AppWrapper>
            <ToastContainerMain />
            <Header />
            <main className="flex-1 pt-[130px] pb-[100px]">
              <NotFondComponent />
              <Badge />
            </main>
            <Footer />
          </AppWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
