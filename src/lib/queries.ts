import { db } from "@/db";
import { cities, restaurants, reservations, pricingRules } from "@/db/schema";
import { eq, and, sql, gte, lte, count } from "drizzle-orm";

// === CITIES ===
export async function getCities() {
  return db.select().from(cities).where(eq(cities.isActive, true)).orderBy(cities.name);
}

export async function getCityBySlug(slug: string) {
  const [city] = await db.select().from(cities).where(eq(cities.slug, slug)).limit(1);
  return city || null;
}

// === RESTAURANTS ===
export async function getRestaurantsByCity(cityId: string) {
  return db.select().from(restaurants)
    .where(and(eq(restaurants.cityId, cityId), eq(restaurants.isActive, true)))
    .orderBy(sql`${restaurants.rating} DESC`);
}

export async function getRestaurantBySlug(cityId: string, slug: string) {
  const [r] = await db.select().from(restaurants)
    .where(and(eq(restaurants.cityId, cityId), eq(restaurants.slug, slug)))
    .limit(1);
  return r || null;
}

export async function getRestaurantById(id: string) {
  const [r] = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
  return r || null;
}

// === AVAILABILITY ===
export async function getSlotOccupancy(restaurantId: string, date: string, time: string) {
  const [result] = await db.select({ count: count() })
    .from(reservations)
    .where(and(
      eq(reservations.restaurantId, restaurantId),
      eq(reservations.date, date),
      eq(reservations.time, time),
      sql`${reservations.status} IN ('pending', 'confirmed')`,
    ));
  return result?.count || 0;
}

export async function getDateOccupancy(restaurantId: string, date: string) {
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
  return result;
}

// === PRICING ===
export async function getPricingRules(restaurantId: string) {
  return db.select().from(pricingRules)
    .where(and(eq(pricingRules.restaurantId, restaurantId), eq(pricingRules.isActive, true)));
}

export function calculateMultiplier(
  rules: { dayOfWeek: number | null; timeStart: string; timeEnd: string; multiplier: number }[],
  dayOfWeek: number,
  time: string,
): number {
  let multiplier = 1.0;
  for (const rule of rules) {
    if (rule.dayOfWeek !== null && rule.dayOfWeek !== dayOfWeek) continue;
    if (time >= rule.timeStart && time < rule.timeEnd) {
      multiplier = Math.max(multiplier, rule.multiplier); // take highest applicable
    }
  }
  return multiplier;
}

export function getOccupancyLevel(booked: number, capacity: number): "green" | "yellow" | "red" {
  const ratio = booked / capacity;
  if (ratio < 0.5) return "green";
  if (ratio < 0.8) return "yellow";
  return "red";
}
