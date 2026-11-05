export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { v4 as uuid } from "uuid";

// POST /api/restaurants — register new restaurant
export async function POST(req: NextRequest) {
  const { name, cityId, cuisine, address, phone, priceRange, capacityPerSlot, depositAmount, openTime, closeTime, description, rating } = await req.json();

  // rating при регистрации не сохраняется (берётся из отзывов), но если передан — только целое 1..5
  if (rating !== undefined && rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: "rating must be an integer 1-5" }, { status: 400 });
  }

  if (!name || !cityId || !address || !phone) {
    return NextResponse.json({ error: "Все обязательные поля должны быть заполнены" }, { status: 400 });
  }

  const slug = name.toLowerCase()
    .replace(/[а-яё]/g, (c: string) => {
      const map: Record<string, string> = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" };
      return map[c] || c;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const id = uuid();
  await db.insert(restaurants).values({
    id,
    cityId,
    name,
    slug: `${slug}-${id.slice(0, 6)}`,
    cuisine,
    address,
    phone,
    description,
    priceRange: parseInt(priceRange) || 2,
    capacityPerSlot: parseInt(capacityPerSlot) || 20,
    depositAmount: parseInt(depositAmount) || 0,
    depositRequired: parseInt(depositAmount) > 0,
    openTime: openTime || "10:00",
    closeTime: closeTime || "23:00",
    lat: 0, // TODO: geocode from address
    lng: 0,
    isActive: false, // needs moderation
  });

  return NextResponse.json({ ok: true, restaurantId: id });
}
