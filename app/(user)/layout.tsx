import ClientShell from "./ClientShell";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientShell>{children}</ClientShell>;
}
