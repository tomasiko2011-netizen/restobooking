import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ==================== CITIES ====================
export const cities = sqliteTable("cities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),           // "Алматы"
  slug: text("slug").notNull().unique(),   // "almaty"
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  timezone: text("timezone").default("Asia/Almaty"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// ==================== USERS ====================
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  name: text("name"),
  phone: text("phone"),
  image: text("image"),
  role: text("role", { enum: ["user", "owner", "admin"] }).default("user"),
  cityId: text("city_id").references(() => cities.id),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// ==================== RESTAURANTS ====================
export const restaurants = sqliteTable("restaurants", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").references(() => users.id),
  cityId: text("city_id").notNull().references(() => cities.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  cuisine: text("cuisine"),                // "Узбекская, Казахская"
  address: text("address").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  phone: text("phone"),                    // скрыт до подтверждения брони
  photoUrl: text("photo_url"),
  rating: real("rating").default(4.5),
  reviewCount: integer("review_count").default(0),
  priceRange: integer("price_range").default(2), // 1-4 ($-$$$$)
  capacityPerSlot: integer("capacity_per_slot").default(20),
  depositAmount: integer("deposit_amount").default(0),       // 0 = no deposit
  depositRequired: integer("deposit_required", { mode: "boolean" }).default(false),
  refundHours: integer("refund_hours").default(24),          // cancel before N hours for refund
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  openTime: text("open_time").default("10:00"),
  closeTime: text("close_time").default("23:00"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
}, (table) => [
  index("idx_restaurants_city").on(table.cityId),
  uniqueIndex("idx_restaurants_slug_city").on(table.cityId, table.slug),
]);

// ==================== RESERVATIONS ====================
export const reservations = sqliteTable("reservations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  restaurantId: text("restaurant_id").notNull().references(() => restaurants.id),
  cityId: text("city_id").notNull().references(() => cities.id),
  date: text("date").notNull(),            // "2026-03-20"
  time: text("time").notNull(),            // "19:00"
  guests: integer("guests").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "cancelled", "no_show"] }).default("pending"),
  paymentRequired: integer("payment_required", { mode: "boolean" }).default(false),
  paymentStatus: text("payment_status", { enum: ["none", "pending", "paid", "refunded"] }).default("none"),
  totalPrice: integer("total_price").default(0),
  note: text("note"),
  cancelledAt: text("cancelled_at"),
  confirmedAt: text("confirmed_at"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
}, (table) => [
  index("idx_reservations_restaurant_date").on(table.restaurantId, table.date),
  index("idx_reservations_city").on(table.cityId),
  index("idx_reservations_user").on(table.userId),
]);

// ==================== PAYMENTS ====================
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  reservationId: text("reservation_id").notNull().references(() => reservations.id),
  amount: integer("amount").notNull(),     // in tenge
  status: text("status", { enum: ["pending", "paid", "refunded", "forfeited"] }).default("pending"),
  provider: text("provider").default("kaspi"),
  providerRef: text("provider_ref"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
}, (table) => [
  index("idx_payments_reservation").on(table.reservationId),
]);

// ==================== PRICING RULES ====================
export const pricingRules = sqliteTable("pricing_rules", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurant_id").notNull().references(() => restaurants.id),
  dayOfWeek: integer("day_of_week"),       // 0=Sun, 1=Mon... null=all
  timeStart: text("time_start").notNull(), // "19:00"
  timeEnd: text("time_end").notNull(),     // "21:00"
  multiplier: real("multiplier").notNull(),// 1.5 = +50%, 0.8 = -20%
  label: text("label"),                    // "Скидка 20%" / "Peak hours"
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
}, (table) => [
  index("idx_pricing_restaurant").on(table.restaurantId),
]);

// ==================== RESTAURANT PHOTOS ====================
export const restaurantPhotos = sqliteTable("restaurant_photos", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurant_id").notNull().references(() => restaurants.id),
  url: text("url").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").default(0),
});

// ==================== REVIEWS ====================
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  restaurantId: text("restaurant_id").notNull().references(() => restaurants.id),
  reservationId: text("reservation_id").references(() => reservations.id),
  rating: integer("rating").notNull(),     // 1-5
  comment: text("comment"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
}, (table) => [
  index("idx_reviews_restaurant").on(table.restaurantId),
]);
