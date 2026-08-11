import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminPrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login?reason=session_expired");
  }

  return <>{children}</>;
}
