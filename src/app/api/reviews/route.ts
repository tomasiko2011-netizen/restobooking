export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, restaurants } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";

// GET /api/reviews?restaurant_id=
export async function GET(req: NextRequest) {
  const restaurantId = req.nextUrl.searchParams.get("restaurant_id");
  if (!restaurantId) return NextResponse.json({ error: "restaurant_id required" }, { status: 400 });

  const result = await db.select().from(reviews)
    .where(eq(reviews.restaurantId, restaurantId))
    .orderBy(desc(reviews.createdAt))
    .limit(50);

  return NextResponse.json(result);
}

// POST /api/reviews
export async function POST(req: NextRequest) {
  const { restaurantId, rating, comment } = await req.json();
  if (!restaurantId || !rating) return NextResponse.json({ error: "restaurantId and rating required" }, { status: 400 });
  if (rating < 1 || rating > 5) return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 });

  const id = uuid();
  await db.insert(reviews).values({
    id,
    userId: "anonymous",
    restaurantId,
    rating,
    comment: comment || null,
  });

  // Recalculate restaurant rating
  const [avg] = await db.select({
    avgRating: sql<number>`AVG(${reviews.rating})`,
    count: sql<number>`COUNT(*)`,
  }).from(reviews).where(eq(reviews.restaurantId, restaurantId));

  if (avg) {
    await db.update(restaurants)
      .set({ rating: Math.round((avg.avgRating || 0) * 10) / 10, reviewCount: avg.count || 0 })
      .where(eq(restaurants.id, restaurantId));
  }

  return NextResponse.json({ ok: true, reviewId: id });
}
