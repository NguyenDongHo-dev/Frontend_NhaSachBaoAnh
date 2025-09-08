import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppWrapper from "@/components/client/ClientLayout";
import { ReduxProvider } from "../providers";
import Badge from "@/components/client/Badge";
import ToastContainerMain from "@/components/client/ToastContainer";

const QuicksandSans = Quicksand({
  variable: "--font-Quicksand-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nhà sách Bảo Anh - Sách và văn phòng phẩm Online",
  description: "Bán các loại sách",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${QuicksandSans.variable} flex flex-col min-h-screen`}>
        <ReduxProvider>
          <AppWrapper>
            <ToastContainerMain />
            <Header />
            <main className="flex-1 pt-[130px] pb-[100px]">
              {children}
              <Badge />
            </main>
            <Footer />
          </AppWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
