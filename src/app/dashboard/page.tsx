import Link from "next/link";
import { db } from "@/db";
import { reservations, restaurants } from "@/db/schema";
import { eq, and, sql, count } from "drizzle-orm";

export default async function DashboardPage() {
  // TODO: get restaurant from auth session. For now show all.
  const allRestaurants = await db.select().from(restaurants).orderBy(restaurants.name);

  const today = new Date().toISOString().split("T")[0];

  // Stats per restaurant
  const stats = await Promise.all(
    allRestaurants.map(async (r) => {
      const [todayCount] = await db.select({ count: count() }).from(reservations)
        .where(and(eq(reservations.restaurantId, r.id), eq(reservations.date, today), sql`${reservations.status} IN ('pending', 'confirmed')`));
      const [pendingCount] = await db.select({ count: count() }).from(reservations)
        .where(and(eq(reservations.restaurantId, r.id), eq(reservations.status, "pending")));
      const [totalCount] = await db.select({ count: count() }).from(reservations)
        .where(eq(reservations.restaurantId, r.id));
      return {
        ...r,
        todayBookings: todayCount?.count || 0,
        pendingBookings: pendingCount?.count || 0,
        totalBookings: totalCount?.count || 0,
      };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-600">RestoBooking Dashboard</h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">На сайт</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-orange-600">{allRestaurants.length}</div>
            <div className="text-sm text-gray-500">Ресторанов</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-green-600">{stats.reduce((s, r) => s + r.todayBookings, 0)}</div>
            <div className="text-sm text-gray-500">Брони сегодня</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-yellow-600">{stats.reduce((s, r) => s + r.pendingBookings, 0)}</div>
            <div className="text-sm text-gray-500">Ожидают подтверждения</div>
          </div>
        </div>

        {/* Restaurant list */}
        <h2 className="font-bold text-lg mb-4">Мои рестораны</h2>
        <div className="space-y-3">
          {stats.map((r) => (
            <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm border flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{r.name}</h3>
                <p className="text-sm text-gray-500">{r.address}</p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">{r.todayBookings}</div>
                  <div className="text-gray-400">Сегодня</div>
                </div>
                {r.pendingBookings > 0 && (
                  <div className="text-center">
                    <div className="font-bold text-lg text-yellow-600">{r.pendingBookings}</div>
                    <div className="text-gray-400">Pending</div>
                  </div>
                )}
                <Link
                  href={`/dashboard/reservations?restaurant=${r.id}`}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Брони
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
