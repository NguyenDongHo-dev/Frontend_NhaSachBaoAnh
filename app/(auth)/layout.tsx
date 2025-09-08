import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "../globals.css";
import AppWrapper from "@/components/client/ClientLayout";
import { ReduxProvider } from "../providers";
import Navbar from "@/components/admin/navbar";
import AdminGuard from "@/components/auth/AdminGuard";
import ToastContainerMain from "@/components/client/ToastContainer";

const QuicksandSans = Quicksand({
  variable: "--font-Quicksand-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trang quan tri",
  description: "Trang quan tri chu website",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <ReduxProvider>
          <AppWrapper>
            <AdminGuard>
              <ToastContainerMain />
              <div className="flex h-screen w-full">
                <Navbar />
                <main className="ml-[200px] flex-1 p-4">{children}</main>
              </div>
            </AdminGuard>
          </AppWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
