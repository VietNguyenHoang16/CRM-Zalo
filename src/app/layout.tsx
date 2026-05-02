import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const font = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRM Kết Bạn Zalo",
  description: "Quản lý khách hàng Zalo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={font.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
