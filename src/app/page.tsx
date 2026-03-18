export const dynamic = "force-dynamic";
import Link from "next/link";
import { getCities } from "@/lib/queries";

export default async function HomePage() {
  const allCities = await getCities();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">RestoBooking</h1>
          <p className="text-xl opacity-90 mb-8">
            Забронируйте столик в лучших ресторанах Казахстана
          </p>
          <p className="text-lg opacity-75">
            {allCities.length} городов &bull; Моментальное подтверждение &bull; Лучшие цены
          </p>
        </div>
      </header>

      {/* City Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Выберите город</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allCities.map((city) => (
            <Link
              key={city.id}
              href={`/${city.slug}`}
              className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 text-center border border-gray-100 hover:border-orange-300"
            >
              <div className="text-3xl mb-2">🏙️</div>
              <h3 className="font-semibold text-lg group-hover:text-orange-600 transition-colors">
                {city.name}
              </h3>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2026 RestoBooking.kz — Все права защищены</p>
        </div>
      </footer>
    </div>
  );
}
