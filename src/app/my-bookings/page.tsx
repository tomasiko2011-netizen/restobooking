export const dynamic = "force-dynamic";

import { db } from "@/db";
import { reservations, restaurants, cities } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function MyBookingsPage() {
  // TODO: get userId from session. For now show all.
  const bookings = await db.select({
    id: reservations.id,
    date: reservations.date,
    time: reservations.time,
    guests: reservations.guests,
    status: reservations.status,
    note: reservations.note,
    totalPrice: reservations.totalPrice,
    createdAt: reservations.createdAt,
    confirmedAt: reservations.confirmedAt,
    restaurantName: restaurants.name,
    restaurantSlug: restaurants.slug,
    restaurantPhone: restaurants.phone,
    restaurantAddress: restaurants.address,
    cityName: cities.name,
    citySlug: cities.slug,
  })
    .from(reservations)
    .leftJoin(restaurants, eq(reservations.restaurantId, restaurants.id))
    .leftJoin(cities, eq(reservations.cityId, cities.id))
    .orderBy(desc(reservations.createdAt))
    .limit(50);

  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    pending: { label: "Ожидает", color: "bg-yellow-100 text-yellow-700", icon: "⏳" },
    confirmed: { label: "Подтверждено", color: "bg-green-100 text-green-700", icon: "✅" },
    cancelled: { label: "Отменено", color: "bg-gray-100 text-gray-500", icon: "❌" },
    no_show: { label: "Неявка", color: "bg-red-100 text-red-700", icon: "🚫" },
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Мои брони</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 mb-4">У вас пока нет бронирований</p>
            <Link href="/" className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 inline-block">
              Найти ресторан
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const status = statusConfig[b.status ?? "pending"];
              const showPhone = b.status === "confirmed";

              return (
                <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Link
                        href={`/${b.citySlug}/restaurant/${b.restaurantSlug}`}
                        className="font-bold text-lg hover:text-orange-600"
                      >
                        {b.restaurantName}
                      </Link>
                      <p className="text-sm text-gray-500">{b.cityName} &bull; {b.restaurantAddress}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-400">Дата</span>
                      <div className="font-medium">{b.date}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Время</span>
                      <div className="font-medium">{b.time}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Гости</span>
                      <div className="font-medium">{b.guests}</div>
                    </div>
                  </div>

                  {showPhone && b.restaurantPhone && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
                      <span className="text-green-600 font-medium">Телефон ресторана: </span>
                      <a href={`tel:${b.restaurantPhone}`} className="text-green-800 font-bold hover:underline">
                        {b.restaurantPhone}
                      </a>
                    </div>
                  )}

                  {b.status === "pending" && (
                    <p className="text-xs text-yellow-600 mt-2">Ожидаем подтверждения от ресторана...</p>
                  )}

                  {b.note && (
                    <p className="text-xs text-gray-400 mt-2">Пожелания: {b.note}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
