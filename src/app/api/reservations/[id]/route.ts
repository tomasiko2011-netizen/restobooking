import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservations, restaurants } from "@/db/schema";
import { eq } from "drizzle-orm";

// PATCH /api/reservations/[id] — update status (confirm, cancel, no_show)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, role } = await req.json();

  // Validate status
  const validStatuses = ["confirmed", "cancelled", "no_show"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Get reservation
  const [reservation] = await db.select().from(reservations)
    .where(eq(reservations.id, id)).limit(1);
  if (!reservation) {
    return NextResponse.json({ error: "Бронь не найдена" }, { status: 404 });
  }

  // Business rules
  if (status === "confirmed" && reservation.status !== "pending") {
    return NextResponse.json({ error: "Можно подтвердить только pending бронь" }, { status: 400 });
  }
  if (status === "no_show" && role !== "owner" && role !== "admin") {
    return NextResponse.json({ error: "Только ресторан может отметить неявку" }, { status: 403 });
  }

  // Update
  const now = new Date().toISOString();
  await db.update(reservations)
    .set({
      status,
      ...(status === "confirmed" ? { confirmedAt: now } : {}),
      ...(status === "cancelled" ? { cancelledAt: now } : {}),
    })
    .where(eq(reservations.id, id));

  // If confirmed, get restaurant phone to reveal
  let phone = null;
  if (status === "confirmed") {
    const [r] = await db.select({ phone: restaurants.phone })
      .from(restaurants)
      .where(eq(restaurants.id, reservation.restaurantId))
      .limit(1);
    phone = r?.phone;
  }

  // TODO: Pusher push event
  // await pusher.trigger(`reservation-${id}`, 'status-update', { status, phone });

  return NextResponse.json({
    ok: true,
    status,
    phone,
    message: status === "confirmed"
      ? "Бронь подтверждена! Телефон ресторана доступен."
      : status === "cancelled"
      ? "Бронь отменена."
      : "Неявка отмечена.",
  });
}

// GET /api/reservations/[id] — get reservation details
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [reservation] = await db.select().from(reservations)
    .where(eq(reservations.id, id)).limit(1);

  if (!reservation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only show phone if confirmed
  let phone = null;
  if (reservation.status === "confirmed") {
    const [r] = await db.select({ phone: restaurants.phone })
      .from(restaurants)
      .where(eq(restaurants.id, reservation.restaurantId))
      .limit(1);
    phone = r?.phone;
  }

  return NextResponse.json({ ...reservation, restaurantPhone: phone });
}
