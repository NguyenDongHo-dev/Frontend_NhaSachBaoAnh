import { Quicksand } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./providers";
import AppWrapper from "@/components/client/ClientLayout";
import ToastContainerMain from "@/components/client/ToastContainer";
import type { Metadata } from "next";

const QuicksandSans = Quicksand({
  variable: "--font-Quicksand-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nhà sách Bảo Anh - Sách và văn phòng phẩm Online",
  description: "Shop bán sách - văn phòng phẩm",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${QuicksandSans.variable}`}>
        <ReduxProvider>
          <AppWrapper>
            <ToastContainerMain />
            {children}
          </AppWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
