export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getCityBySlug, getRestaurantBySlug, getPricingRules, getDateOccupancy } from "@/lib/queries";
import BookingForm from "@/components/BookingForm";
import AvailabilityGrid from "@/components/AvailabilityGrid";

export default async function RestaurantPage({ params }: { params: Promise<{ city: string; slug: string }> }) {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  const restaurant = await getRestaurantBySlug(city.id, slug);
  if (!restaurant) notFound();

  const rules = await getPricingRules(restaurant.id);
  const today = new Date().toISOString().split("T")[0];
  const occupancy = await getDateOccupancy(restaurant.id, today);

  const priceLabel = (n: number) => "₸".repeat(n);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <a href={`/${citySlug}`} className="text-sm opacity-75 hover:opacity-100">&larr; Рестораны в {city.name}</a>
          <h1 className="text-3xl font-bold mt-2">{restaurant.name}</h1>
          <p className="opacity-75 mt-1">{restaurant.cuisine} &bull; {priceLabel(restaurant.priceRange ?? 2)}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Info — 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            {/* Photo */}
            <div className="h-64 bg-gradient-to-br from-orange-100 to-red-50 rounded-2xl flex items-center justify-center">
              <span className="text-7xl">🍽️</span>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-xl mb-4">О ресторане</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Адрес</span>
                  <span className="font-medium">{restaurant.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Рейтинг</span>
                  <span className="font-medium text-green-600">★ {(restaurant.rating ?? 0).toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Время работы</span>
                  <span className="font-medium">{restaurant.openTime} — {restaurant.closeTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Вместимость</span>
                  <span className="font-medium">{restaurant.capacityPerSlot} мест/слот</span>
                </div>
                {restaurant.depositRequired && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Депозит</span>
                    <span className="font-medium text-orange-600">{restaurant.depositAmount?.toLocaleString()}₸</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Телефон</span>
                  <span className="text-gray-400 italic">Доступен после подтверждения брони</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-xl mb-4">Загруженность сегодня</h2>
              <AvailabilityGrid
                occupancy={occupancy}
                capacity={restaurant.capacityPerSlot ?? 20}
                openTime={restaurant.openTime ?? "10:00"}
                closeTime={restaurant.closeTime ?? "23:00"}
              />
            </div>

            {/* Pricing */}
            {rules.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-xl mb-4">Цены</h2>
                <div className="space-y-2">
                  {rules.map((rule) => (
                    <div key={rule.id} className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {rule.label || `${rule.timeStart}–${rule.timeEnd}`}
                      </span>
                      <span className={`font-medium ${rule.multiplier < 1 ? "text-green-600" : rule.multiplier > 1 ? "text-red-500" : ""}`}>
                        {rule.multiplier < 1 ? `Скидка ${Math.round((1 - rule.multiplier) * 100)}%` :
                         rule.multiplier > 1 ? `+${Math.round((rule.multiplier - 1) * 100)}%` : "Стандарт"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form — 2 cols */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <h2 className="font-bold text-xl mb-4">Забронировать</h2>
              <BookingForm
                restaurantId={restaurant.id}
                cityId={city.id}
                capacity={restaurant.capacityPerSlot ?? 20}
                depositAmount={restaurant.depositAmount ?? 0}
                depositRequired={restaurant.depositRequired ?? false}
                openTime={restaurant.openTime ?? "10:00"}
                closeTime={restaurant.closeTime ?? "23:00"}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
