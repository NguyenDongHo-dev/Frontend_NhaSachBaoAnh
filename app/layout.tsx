// app/layout.tsx
"use client";

import { Quicksand } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./providers";
import AppWrapper from "@/components/client/ClientLayout";
import ToastContainerMain from "@/components/client/ToastContainer";
import { usePathname } from "next/navigation";
import AdminShell from "./(auth)/AdminShell";
import ClientShell from "./(user)/ClientShell";

const QuicksandSans = Quicksand({
  variable: "--font-Quicksand-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

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
