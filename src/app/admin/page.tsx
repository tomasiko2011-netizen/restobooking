export const dynamic = "force-dynamic";
import { db } from "@/db";
import { cities, restaurants, reservations } from "@/db/schema";
import { count, eq, sql } from "drizzle-orm";
import Link from "next/link";

export default async function AdminPage() {
  const allCities = await db.select({
    id: cities.id,
    name: cities.name,
    slug: cities.slug,
    restaurantCount: count(restaurants.id),
  })
    .from(cities)
    .leftJoin(restaurants, eq(cities.id, restaurants.cityId))
    .groupBy(cities.id)
    .orderBy(cities.name);

  const [totalRes] = await db.select({ count: count() }).from(restaurants);
  const [totalBookings] = await db.select({ count: count() }).from(reservations);
  const [pendingBookings] = await db.select({ count: count() }).from(reservations)
    .where(eq(reservations.status, "pending"));
  const [confirmedBookings] = await db.select({ count: count() }).from(reservations)
    .where(eq(reservations.status, "confirmed"));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex gap-4 text-sm">
            <Link href="/dashboard" className="hover:text-orange-400">Dashboard</Link>
            <Link href="/" className="hover:text-orange-400">Сайт</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold">{totalRes?.count || 0}</div>
            <div className="text-sm text-gray-500">Ресторанов</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold">{totalBookings?.count || 0}</div>
            <div className="text-sm text-gray-500">Всего броней</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-yellow-600">{pendingBookings?.count || 0}</div>
            <div className="text-sm text-gray-500">Ожидают</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-green-600">{confirmedBookings?.count || 0}</div>
            <div className="text-sm text-gray-500">Подтверждено</div>
          </div>
        </div>

        {/* Cities */}
        <h2 className="font-bold text-lg mb-4">Города</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {allCities.map((c) => (
            <Link
              key={c.id}
              href={`/${c.slug}`}
              className="bg-white rounded-xl p-4 shadow-sm border hover:border-orange-300 transition text-center"
            >
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-gray-500">{c.restaurantCount} ресторанов</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
