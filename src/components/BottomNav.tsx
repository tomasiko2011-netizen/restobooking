"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", icon: "🏠", label: "Главная" },
  { href: "/my-bookings", icon: "📋", label: "Брони" },
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/login", icon: "👤", label: "Профиль" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 pb-safe">
      <div className="flex justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                isActive ? "text-orange-600" : "text-gray-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
