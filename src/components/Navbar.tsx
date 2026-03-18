"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-orange-600">
          RestoBooking
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="text-sm text-gray-600">{session.user.name}</span>
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-orange-600">
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-400 hover:text-red-500"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
