import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import FloatingSearch from "@/components/layout/FloatingSearch";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "One Box Shop",
  description:
    "One Box Shop ร้านโมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์จากประเทศญี่ปุ่น Ichiban Kuji, MASTERLISE, Grandista และ Prize Figure สำหรับนักสะสมทุกระดับ",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-hidden font-sans">
        <CartProvider>
          {children}
          <FloatingSearch />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
