export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservations, restaurants, pricingRules } from "@/db/schema";
import { eq, and, sql, count } from "drizzle-orm";
import { calculateMultiplier, getOccupancyLevel } from "@/lib/queries";

// GET /api/availability?restaurant_id=&date=
export async function GET(req: NextRequest) {
  const restaurantId = req.nextUrl.searchParams.get("restaurant_id");
  const date = req.nextUrl.searchParams.get("date");

  if (!restaurantId || !date) {
    return NextResponse.json({ error: "restaurant_id and date required" }, { status: 400 });
  }

  // Get restaurant
  const [restaurant] = await db.select().from(restaurants)
    .where(eq(restaurants.id, restaurantId)).limit(1);
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  // Get current bookings per slot
  const bookings = await db.select({
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

  const bookingMap = new Map(bookings.map((b) => [b.time, b.booked]));

  // Get pricing rules
  const rules = await db.select().from(pricingRules)
    .where(and(eq(pricingRules.restaurantId, restaurantId), eq(pricingRules.isActive, true)));

  // Build time slots
  const capacity = restaurant.capacityPerSlot ?? 20;
  const startH = parseInt((restaurant.openTime ?? "10:00").split(":")[0]);
  const endH = parseInt((restaurant.closeTime ?? "23:00").split(":")[0]);
  const dayOfWeek = new Date(date).getDay();

  const slots = [];
  for (let h = startH; h < endH; h++) {
    const time = `${h.toString().padStart(2, "0")}:00`;
    const booked = bookingMap.get(time) || 0;
    const available = Math.max(0, capacity - booked);
    const level = getOccupancyLevel(booked, capacity);
    const multiplier = calculateMultiplier(rules, dayOfWeek, time);

    // Auto-discount: if occupancy < 30%, reduce multiplier
    const occupancyRatio = booked / capacity;
    const effectiveMultiplier = occupancyRatio < 0.3 && multiplier >= 1
      ? Math.max(0.7, multiplier - 0.2)
      : multiplier;

    slots.push({
      time,
      booked,
      available,
      capacity,
      level,
      multiplier: Math.round(effectiveMultiplier * 100) / 100,
      discount: effectiveMultiplier < 1
        ? `Скидка ${Math.round((1 - effectiveMultiplier) * 100)}%`
        : null,
      surcharge: effectiveMultiplier > 1
        ? `+${Math.round((effectiveMultiplier - 1) * 100)}%`
        : null,
    });
  }

  return NextResponse.json({
    restaurant: restaurant.name,
    date,
    capacity,
    slots,
  });
}
