import { ReduxProvider } from "./providers";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const QuicksandSans = Quicksand({
  variable: "--font-Quicksand-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nhà sách Bảo Anh - Sách và văn phòng phẩm Online",
  description: "Bán các loại sách",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${QuicksandSans.variable} flex flex-col min-h-screen `}>
        <ReduxProvider>
          <Header />
          <main className="flex-1 pt-[130px] pb-[50px]">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
