export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityBySlug, getRestaurantsByCity } from "@/lib/queries";
import SearchFilter from "@/components/SearchFilter";

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  const allRestaurants = await getRestaurantsByCity(city.id);

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/" className="text-sm opacity-75 hover:opacity-100">&larr; Все города</Link>
          <h1 className="text-3xl font-bold mt-2">Рестораны в {city.name}</h1>
          <p className="opacity-75 mt-1">{allRestaurants.length} заведений</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {allRestaurants.length === 0 ? (
          <p className="text-center text-gray-500 py-20">Рестораны скоро появятся</p>
        ) : (
          <SearchFilter restaurants={allRestaurants} citySlug={citySlug} />
        )}
      </main>
    </div>
  );
}
