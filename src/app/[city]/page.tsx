export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityBySlug, getRestaurantsByCity } from "@/lib/queries";

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  const allRestaurants = await getRestaurantsByCity(city.id);

  const priceLabel = (n: number) => "₸".repeat(n);
  const ratingColor = (r: number) => r >= 4.5 ? "text-green-600" : r >= 4 ? "text-yellow-600" : "text-gray-500";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/" className="text-sm opacity-75 hover:opacity-100">&larr; Все города</Link>
          <h1 className="text-3xl font-bold mt-2">Рестораны в {city.name}</h1>
          <p className="opacity-75 mt-1">{allRestaurants.length} заведений</p>
        </div>
      </header>

      {/* Restaurant List */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {allRestaurants.length === 0 ? (
          <p className="text-center text-gray-500 py-20">Рестораны скоро появятся</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allRestaurants.map((r) => (
              <Link
                key={r.id}
                href={`/${citySlug}/restaurant/${r.slug}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-orange-300 overflow-hidden"
              >
                {/* Photo placeholder */}
                <div className="h-40 bg-gradient-to-br from-orange-100 to-red-50 flex items-center justify-center">
                  <span className="text-5xl">🍽️</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">
                      {r.name}
                    </h3>
                    <span className="text-sm text-gray-400">{priceLabel(r.priceRange ?? 2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{r.cuisine}</p>
                  <p className="text-sm text-gray-400 mb-3">{r.address}</p>
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${ratingColor(r.rating ?? 0)}`}>
                      ★ {(r.rating ?? 0).toFixed(1)}
                    </span>
                    {r.depositRequired && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        Депозит {r.depositAmount?.toLocaleString()}₸
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
