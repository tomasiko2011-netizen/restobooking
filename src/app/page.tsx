export const dynamic = "force-dynamic";
import Link from "next/link";
import { getCities } from "@/lib/queries";
import GeoDetect from "@/components/GeoDetect";

export default async function HomePage() {
  const allCities = await getCities();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">RestoBooking</h1>
          <p className="text-lg sm:text-xl opacity-90 mb-6">
            Забронируйте столик в лучших ресторанах Казахстана
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm opacity-75">
            <span>{allCities.length} городов</span>
            <span>&bull;</span>
            <span>Моментальное подтверждение</span>
            <span>&bull;</span>
            <span>Лучшие цены</span>
          </div>
        </div>
      </header>

      {/* City Grid */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-8 text-center">Выберите город</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {allCities.map((city) => (
            <Link
              key={city.id}
              href={`/${city.slug}`}
              className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-5 sm:p-6 text-center border border-gray-100 hover:border-orange-300 active:scale-95"
            >
              <div className="text-3xl mb-2">🏙️</div>
              <h3 className="font-semibold text-base sm:text-lg group-hover:text-orange-600 transition-colors">
                {city.name}
              </h3>
            </Link>
          ))}
        </div>
      </main>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Как это работает</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-semibold mb-1">Выберите ресторан</h3>
            <p className="text-sm text-gray-500">Фильтруйте по кухне, цене и рейтингу</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-semibold mb-1">Забронируйте</h3>
            <p className="text-sm text-gray-500">Выберите дату, время и количество гостей</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-semibold mb-1">Получите подтверждение</h3>
            <p className="text-sm text-gray-500">Ресторан подтвердит бронь в реальном времени</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2026 RestoBooking.kz — Все права защищены</p>
        </div>
      </footer>

      {/* Geo detect popup */}
      <GeoDetect cities={allCities} />
    </div>
  );
}
