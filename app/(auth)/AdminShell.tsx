"use client";

import Navbar from "@/components/admin/navbar";
import AdminGuard from "@/components/auth/AdminGuard";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="ml-[200px] p-4">{children}</main>
    </div>
  );
}
