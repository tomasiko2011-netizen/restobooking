import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RestoBooking — Бронирование ресторанов в Казахстане",
  description: "Забронируйте столик в лучших ресторанах. Алматы, Астана, Шымкент и 20+ городов.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${geist.variable} font-sans bg-gray-50 text-gray-900 antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
