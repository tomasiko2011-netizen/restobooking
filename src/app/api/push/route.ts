export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

// POST /api/push — register push subscription
export async function POST(req: NextRequest) {
  const { userId, subscription } = await req.json();
  if (!subscription?.endpoint) {
    return NextResponse.json({ error: "subscription required" }, { status: 400 });
  }

  // Store in a simple way — upsert by endpoint
  await db.run(sql`
    INSERT OR REPLACE INTO push_subscriptions (user_id, endpoint, p256dh, auth, created_at)
    VALUES (${userId || "anonymous"}, ${subscription.endpoint}, ${subscription.keys?.p256dh || ""}, ${subscription.keys?.auth || ""}, datetime('now'))
  `);

  return NextResponse.json({ ok: true });
}
