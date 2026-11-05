import { createHmac, timingSafeEqual } from "crypto";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, restaurants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export type Role = "user" | "owner" | "admin";
export type CurrentUser = { id: string; role: Role };

/**
 * Текущий пользователь из сессии next-auth. Роль перечитывается из БД,
 * чтобы не доверять ни клиенту, ни устаревшему JWT.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) return null;
  const [u] = await db.select({ id: users.id, role: users.role })
    .from(users).where(eq(users.id, id)).limit(1);
  if (!u) return null;
  return { id: u.id, role: (u.role ?? "user") as Role };
}

/** owner этого ресторана или admin */
export async function canManageRestaurant(user: CurrentUser | null, restaurantId: string): Promise<boolean> {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role !== "owner") return false;
  const [r] = await db.select({ ownerId: restaurants.ownerId })
    .from(restaurants).where(eq(restaurants.id, restaurantId)).limit(1);
  return !!r && r.ownerId === user.id;
}

function tokenSecret(): string | null {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || null;
}

/**
 * Секретный токен гостевой брони: HMAC-SHA256(id) на NEXTAUTH_SECRET.
 * Выдаётся только в ответе на создание брони; без секрета — null (fail closed).
 */
export function reservationToken(reservationId: string): string | null {
  const secret = tokenSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(`reservation:${reservationId}`).digest("hex");
}

export function verifyReservationToken(reservationId: string, token: unknown): boolean {
  if (typeof token !== "string" || token.length === 0) return false;
  const expected = reservationToken(reservationId);
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Для серверных страниц: требует сессию с одной из ролей, иначе redirect на /login.
 */
export async function requireRole(roles: Role[]): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || !roles.includes(user.role)) {
    redirect("/login");
  }
  return user;
}
