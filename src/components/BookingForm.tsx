"use client";

import { useState } from "react";

interface Props {
  restaurantId: string;
  cityId: string;
  capacity: number;
  depositAmount: number;
  depositRequired: boolean;
  openTime: string;
  closeTime: string;
}

export default function BookingForm({ restaurantId, cityId, capacity, depositAmount, depositRequired, openTime, closeTime }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const timeSlots: string[] = [];
  const startH = parseInt(openTime.split(":")[0]);
  const endH = parseInt(closeTime.split(":")[0]);
  for (let h = startH; h < endH; h++) {
    timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, cityId, date, time, guests, note }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: "Бронь создана! Ожидайте подтверждения." });
        setDate("");
        setTime("");
        setGuests(2);
        setNote("");
      } else {
        setResult({ ok: false, message: data.error || "Ошибка" });
      }
    } catch {
      setResult({ ok: false, message: "Ошибка сети" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
        />
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
        >
          <option value="">Выберите время</option>
          {timeSlots.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Guests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Гости</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
          >
            -
          </button>
          <span className="text-xl font-semibold w-8 text-center">{guests}</span>
          <button
            type="button"
            onClick={() => setGuests(Math.min(20, guests + 1))}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Пожелания</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Детский стульчик, у окна..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none h-20"
        />
      </div>

      {/* Deposit info */}
      {depositRequired && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700">
          Требуется депозит <strong>{depositAmount.toLocaleString()}₸</strong>.
          Возвращается при отмене за 24ч.
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !date || !time}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors text-lg"
      >
        {loading ? "Отправка..." : depositRequired ? `Забронировать (${depositAmount.toLocaleString()}₸)` : "Забронировать бесплатно"}
      </button>

      {/* Result */}
      {result && (
        <div className={`p-3 rounded-xl text-sm ${result.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {result.message}
        </div>
      )}
    </form>
  );
}
