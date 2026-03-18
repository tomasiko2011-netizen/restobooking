"use client";

interface Props {
  occupancy: { time: string; booked: number }[];
  capacity: number;
  openTime: string;
  closeTime: string;
}

export default function AvailabilityGrid({ occupancy, capacity, openTime, closeTime }: Props) {
  const slots: string[] = [];
  const startH = parseInt(openTime.split(":")[0]);
  const endH = parseInt(closeTime.split(":")[0]);
  for (let h = startH; h < endH; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
  }

  const occMap = new Map(occupancy.map((o) => [o.time, o.booked]));

  const getColor = (booked: number) => {
    const ratio = booked / capacity;
    if (ratio < 0.5) return "bg-green-100 text-green-700 border-green-200";
    if (ratio < 0.8) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
      {slots.map((time) => {
        const booked = occMap.get(time) || 0;
        return (
          <div
            key={time}
            className={`text-center text-xs py-2 px-1 rounded-lg border ${getColor(booked)}`}
          >
            <div className="font-medium">{time}</div>
            <div className="opacity-75">{booked}/{capacity}</div>
          </div>
        );
      })}
    </div>
  );
}
