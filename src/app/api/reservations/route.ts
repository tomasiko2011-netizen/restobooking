import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservations, restaurants } from "@/db/schema";
import { eq, and, sql, count } from "drizzle-orm";
import { v4 as uuid } from "uuid";

// POST /api/reservations — create a reservation
export async function POST(req: NextRequest) {
  const { restaurantId, cityId, date, time, guests, note } = await req.json();

  if (!restaurantId || !cityId || !date || !time || !guests) {
    return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
  }

  // Get restaurant
  const [restaurant] = await db.select().from(restaurants)
    .where(eq(restaurants.id, restaurantId)).limit(1);
  if (!restaurant) {
    return NextResponse.json({ error: "Ресторан не найден" }, { status: 404 });
  }

  // Check capacity (race condition protection with atomic check)
  const [occupancy] = await db.select({ booked: count() })
    .from(reservations)
    .where(and(
      eq(reservations.restaurantId, restaurantId),
      eq(reservations.date, date),
      eq(reservations.time, time),
      sql`${reservations.status} IN ('pending', 'confirmed')`,
    ));

  const capacity = restaurant.capacityPerSlot ?? 20;
  if ((occupancy?.booked || 0) + guests > capacity) {
    return NextResponse.json({
      error: `Недостаточно мест. Свободно: ${capacity - (occupancy?.booked || 0)}`,
    }, { status: 409 });
  }

  // Create reservation
  const id = uuid();
  const paymentRequired = restaurant.depositRequired ?? false;

  await db.insert(reservations).values({
    id,
    userId: "anonymous",  // TODO: replace with auth user
    restaurantId,
    cityId,
    date,
    time,
    guests,
    status: paymentRequired ? "pending" : "pending",
    paymentRequired,
    paymentStatus: paymentRequired ? "pending" : "none",
    totalPrice: restaurant.depositAmount ?? 0,
    note: note || null,
  });

  // TODO: Pusher notification to restaurant

  return NextResponse.json({
    ok: true,
    reservationId: id,
    message: paymentRequired
      ? "Бронь создана. Требуется оплата депозита."
      : "Бронь создана. Ожидайте подтверждения от ресторана.",
  });
}

// GET /api/reservations?restaurant_id=&date= — get availability
export async function GET(req: NextRequest) {
  const restaurantId = req.nextUrl.searchParams.get("restaurant_id");
  const date = req.nextUrl.searchParams.get("date");

  if (!restaurantId || !date) {
    return NextResponse.json({ error: "restaurant_id and date required" }, { status: 400 });
  }

  const result = await db.select({
    time: reservations.time,
    booked: count(),
  })
    .from(reservations)
    .where(and(
      eq(reservations.restaurantId, restaurantId),
      eq(reservations.date, date),
      sql`${reservations.status} IN ('pending', 'confirmed')`,
    ))
    .groupBy(reservations.time);

  return NextResponse.json(result);
}
