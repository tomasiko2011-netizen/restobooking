"use client";

import { useState } from "react";

interface Props {
  reservationId: string;
  showNoShow?: boolean;
}

export default function ReservationActions({ reservationId, showNoShow }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function updateStatus(status: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, role: "owner" }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(status);
      } else {
        alert(data.error || "Ошибка");
      }
    } catch {
      alert("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className={`text-sm px-3 py-2 rounded-lg ${
        done === "confirmed" ? "bg-green-50 text-green-700" :
        done === "cancelled" ? "bg-gray-50 text-gray-500" :
        "bg-red-50 text-red-700"
      }`}>
        {done === "confirmed" ? "Подтверждено" : done === "cancelled" ? "Отменено" : "Неявка отмечена"}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {!showNoShow ? (
        <>
          <button
            onClick={() => updateStatus("confirmed")}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 disabled:opacity-50"
          >
            Подтвердить
          </button>
          <button
            onClick={() => updateStatus("cancelled")}
            disabled={loading}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 disabled:opacity-50"
          >
            Отклонить
          </button>
        </>
      ) : (
        <button
          onClick={() => updateStatus("no_show")}
          disabled={loading}
          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-200 disabled:opacity-50"
        >
          Отметить неявку
        </button>
      )}
    </div>
  );
}
