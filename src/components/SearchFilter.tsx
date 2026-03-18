"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisine: string | null;
  address: string;
  rating: number | null;
  priceRange: number | null;
  depositRequired: boolean | null;
  depositAmount: number | null;
}

interface Props {
  restaurants: Restaurant[];
  citySlug: string;
}

const CUISINES = ["Все", "Узбекская", "Казахская", "Восточная", "Грузинская", "Китайская", "Уйгурская"];
const PRICES = [
  { label: "Все", value: 0 },
  { label: "₸", value: 1 },
  { label: "₸₸", value: 2 },
  { label: "₸₸₸", value: 3 },
  { label: "₸₸₸₸", value: 4 },
];

export default function SearchFilter({ restaurants, citySlug }: Props) {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("Все");
  const [price, setPrice] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "name">("rating");

  const filtered = useMemo(() => {
    let list = restaurants;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || r.cuisine?.toLowerCase().includes(q) || r.address.toLowerCase().includes(q)
      );
    }

    if (cuisine !== "Все") {
      list = list.filter((r) => r.cuisine?.includes(cuisine));
    }

    if (price > 0) {
      list = list.filter((r) => r.priceRange === price);
    }

    list = [...list].sort((a, b) =>
      sortBy === "rating" ? (b.rating ?? 0) - (a.rating ?? 0) : a.name.localeCompare(b.name)
    );

    return list;
  }, [restaurants, search, cuisine, price, sortBy]);

  const priceLabel = (n: number) => "₸".repeat(n);
  const ratingColor = (r: number) => r >= 4.5 ? "text-green-600" : r >= 4 ? "text-yellow-600" : "text-gray-500";

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по названию, кухне, адресу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CUISINES.map((c) => (
          <button
            key={c}
            onClick={() => setCuisine(c)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              cuisine === c ? "bg-orange-500 text-white" : "bg-white border border-gray-200 hover:border-orange-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {PRICES.map((p) => (
          <button
            key={p.value}
            onClick={() => setPrice(p.value)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              price === p.value ? "bg-orange-500 text-white" : "bg-white border border-gray-200 hover:border-orange-300"
            }`}
          >
            {p.label}
          </button>
        ))}
        <div className="ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "rating" | "name")}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="rating">По рейтингу</option>
            <option value="name">По названию</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500 mb-4">{filtered.length} заведений</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <Link
            key={r.id}
            href={`/${citySlug}/restaurant/${r.slug}`}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-orange-300 overflow-hidden"
          >
            <div className="h-40 bg-gradient-to-br from-orange-100 to-red-50 flex items-center justify-center">
              <span className="text-5xl">🍽️</span>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">{r.name}</h3>
                <span className="text-sm text-gray-400">{priceLabel(r.priceRange ?? 2)}</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{r.cuisine}</p>
              <p className="text-sm text-gray-400 mb-3">{r.address}</p>
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${ratingColor(r.rating ?? 0)}`}>★ {(r.rating ?? 0).toFixed(1)}</span>
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
    </div>
  );
}
