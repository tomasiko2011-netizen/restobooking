"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface City {
  slug: string;
  name: string;
  lat: number;
  lng: number;
}

interface Props {
  cities: City[];
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function GeoDetect({ cities }: Props) {
  const [detected, setDetected] = useState<City | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("resto_city_dismissed")) return;

    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearest: City | null = null;
        let minDist = Infinity;
        for (const city of cities) {
          const d = haversine(latitude, longitude, city.lat, city.lng);
          if (d < minDist) {
            minDist = d;
            nearest = city;
          }
        }
        if (nearest && minDist < 100) {
          setDetected(nearest);
        }
      },
      () => {},
      { timeout: 5000 }
    );
  }, [cities]);

  if (!detected || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-2xl shadow-xl border border-orange-200 p-4 z-50 animate-slide-up">
      <p className="text-sm text-gray-600 mb-2">
        Похоже вы в <strong className="text-orange-600">{detected.name}</strong>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => router.push(`/${detected.slug}`)}
          className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-orange-600"
        >
          Перейти
        </button>
        <button
          onClick={() => {
            setDismissed(true);
            localStorage.setItem("resto_city_dismissed", "1");
          }}
          className="px-4 py-2 text-gray-400 text-sm hover:text-gray-600"
        >
          Нет
        </button>
      </div>
    </div>
  );
}
