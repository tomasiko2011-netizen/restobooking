import webpush from "web-push";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || "";

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails("mailto:admin@restobooking.kz", VAPID_PUBLIC, VAPID_PRIVATE);
}

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string; url?: string }
) {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return;
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (e) {
    console.error("Push failed:", e);
  }
}

// Simple email notification (log-based for now, replace with real SMTP later)
export async function sendEmailNotification(to: string, subject: string, body: string) {
  // TODO: integrate with real SMTP (SendGrid, Resend, etc.)
  console.log(`[EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);
}

// Notification templates
export function bookingConfirmedNotification(restaurantName: string, date: string, time: string) {
  return {
    title: "Бронь подтверждена!",
    body: `${restaurantName} — ${date} в ${time}. Телефон ресторана теперь доступен.`,
    url: "/dashboard",
  };
}

export function bookingCancelledNotification(restaurantName: string, date: string, time: string) {
  return {
    title: "Бронь отменена",
    body: `${restaurantName} — ${date} в ${time} отменена.`,
    url: "/",
  };
}

export function newBookingNotification(guestCount: number, date: string, time: string) {
  return {
    title: "Новая бронь!",
    body: `${guestCount} гостей на ${date} в ${time}. Подтвердите в dashboard.`,
    url: "/dashboard/reservations",
  };
}
