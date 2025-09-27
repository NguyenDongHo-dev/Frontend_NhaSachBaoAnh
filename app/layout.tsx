import { Quicksand } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./providers";
import AppWrapper from "@/components/client/ClientLayout";
import ToastContainerMain from "@/components/client/ToastContainer";
import AdminShell from "./(auth)/AdminShell";
import ClientShell from "./(user)/ClientShell";
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
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className={`${QuicksandSans.variable}`}>
        <ReduxProvider>
          <AppWrapper>
            <ToastContainerMain />
            {isAdmin ? (
              <AdminShell>{children}</AdminShell>
            ) : (
              <ClientShell>{children}</ClientShell>
            )}
          </AppWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
