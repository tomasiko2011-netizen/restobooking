export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getCities } from "@/lib/queries";

export async function GET() {
  const cities = await getCities();
  return NextResponse.json(cities);
}
