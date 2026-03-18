import Pusher from "pusher";

let pusherInstance: Pusher | null = null;

export function getPusher(): Pusher | null {
  if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_SECRET) return null;

  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
      useTLS: true,
    });
  }
  return pusherInstance;
}

export async function notifyReservationUpdate(restaurantId: string, data: Record<string, unknown>) {
  const pusher = getPusher();
  if (!pusher) return;
  await pusher.trigger(`restaurant-${restaurantId}`, "reservation-update", data);
}

export async function notifyNewReservation(restaurantId: string, data: Record<string, unknown>) {
  const pusher = getPusher();
  if (!pusher) return;
  await pusher.trigger(`restaurant-${restaurantId}`, "new-reservation", data);
}
