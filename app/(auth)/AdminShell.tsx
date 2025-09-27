"use client";

import Navbar from "@/components/admin/navbar";
import AdminGuard from "@/components/auth/AdminGuard";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex h-screen w-full">
        <Navbar />
        <main className="ml-[200px] flex-1 p-4">{children}</main>
      </div>
    </AdminGuard>
  );
}
