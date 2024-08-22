import { Dashboard } from "@/components/layouts/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ItIsID Settings",
  description: "Settings for ItIsID",
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Dashboard>{children}</Dashboard>
    </main>
  );
}
