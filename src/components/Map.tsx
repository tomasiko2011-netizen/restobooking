"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  cuisine: string | null;
  rating: number | null;
}

interface Props {
  restaurants: Restaurant[];
  citySlug: string;
  center: [number, number];
}

function MapInner({ restaurants, citySlug, center }: Props) {
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  const L = require("leaflet");

  useEffect(() => {
    // Fix leaflet default icon
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, [L]);

  return (
    <MapContainer center={center} zoom={13} className="h-64 w-full rounded-2xl z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />
      {restaurants.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]}>
          <Popup>
            <a href={`/${citySlug}/restaurant/${r.slug}`} className="font-semibold text-orange-600 hover:underline">
              {r.name}
            </a>
            <br />
            <span className="text-xs text-gray-500">{r.cuisine}</span>
            {r.rating && <span className="text-xs ml-2">★ {r.rating.toFixed(1)}</span>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

const Map = dynamic(() => Promise.resolve(MapInner), { ssr: false });
export default Map;
