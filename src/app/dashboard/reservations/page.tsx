export const dynamic = "force-dynamic";
import { db } from "@/db";
import { reservations, restaurants, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import ReservationActions from "@/components/ReservationActions";

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ restaurant?: string }>;
}) {
  const { restaurant: restaurantId } = await searchParams;

  const allReservations = await db
    .select({
      id: reservations.id,
      date: reservations.date,
      time: reservations.time,
      guests: reservations.guests,
      status: reservations.status,
      paymentStatus: reservations.paymentStatus,
      totalPrice: reservations.totalPrice,
      note: reservations.note,
      createdAt: reservations.createdAt,
      restaurantName: restaurants.name,
      restaurantId: restaurants.id,
    })
    .from(reservations)
    .leftJoin(restaurants, eq(reservations.restaurantId, restaurants.id))
    .where(restaurantId ? eq(reservations.restaurantId, restaurantId) : sql`1=1`)
    .orderBy(desc(reservations.createdAt))
    .limit(100);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
    no_show: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-gray-400 hover:text-gray-600">&larr;</a>
            <h1 className="text-xl font-bold">Брони</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {allReservations.length === 0 ? (
          <p className="text-center text-gray-500 py-20">Нет броней</p>
        ) : (
          <div className="space-y-3">
            {allReservations.map((r) => (
              <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold">{r.restaurantName}</div>
                    <div className="text-sm text-gray-500">
                      {r.date} в {r.time} &bull; {r.guests} гостей
                    </div>
                    {r.note && <div className="text-sm text-gray-400 mt-1">"{r.note}"</div>}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[r.status ?? "pending"]}`}>
                    {r.status === "pending" ? "Ожидает" :
                     r.status === "confirmed" ? "Подтверждено" :
                     r.status === "cancelled" ? "Отменено" : "Неявка"}
                  </span>
                </div>
                {r.status === "pending" && (
                  <ReservationActions reservationId={r.id} />
                )}
                {r.status === "confirmed" && (
                  <ReservationActions reservationId={r.id} showNoShow />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
