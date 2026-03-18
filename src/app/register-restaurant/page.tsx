"use client";

import { useState, useEffect } from "react";

interface City { id: string; name: string; slug: string; }

export default function RegisterRestaurantPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState({
    name: "", cityId: "", cuisine: "", address: "", phone: "",
    priceRange: "2", capacityPerSlot: "25", depositAmount: "0",
    openTime: "10:00", closeTime: "23:00", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/cities").then(r => r.json()).then(setCities).catch(() => {});
  }, []);

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(res.ok ? { ok: true, message: "Ресторан зарегистрирован! Ожидайте модерации." } : { ok: false, message: data.error || "Ошибка" });
    } catch {
      setResult({ ok: false, message: "Ошибка сети" });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Добавить ресторан</h1>
        <p className="text-gray-500 mb-8">Зарегистрируйте свой ресторан на платформе RestoBooking</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input type="text" required value={form.name} onChange={e => update("name", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Название ресторана" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
            <select required value={form.cityId} onChange={e => update("cityId", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none">
              <option value="">Выберите город</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тип кухни</label>
            <input type="text" required value={form.cuisine} onChange={e => update("cuisine", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Узбекская, Казахская" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
            <input type="text" required value={form.address} onChange={e => update("address", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="ул. Абая 100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
            <input type="tel" required value={form.phone} onChange={e => update("phone", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="+7 700 123 4567" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Открытие</label>
              <input type="time" value={form.openTime} onChange={e => update("openTime", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Закрытие</label>
              <input type="time" value={form.closeTime} onChange={e => update("closeTime", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ценовой уровень</label>
              <select value={form.priceRange} onChange={e => update("priceRange", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none">
                <option value="1">₸ Бюджетный</option>
                <option value="2">₸₸ Средний</option>
                <option value="3">₸₸₸ Дорогой</option>
                <option value="4">₸₸₸₸ Премиум</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Мест/слот</label>
              <input type="number" value={form.capacityPerSlot} onChange={e => update("capacityPerSlot", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Депозит ₸</label>
              <input type="number" value={form.depositAmount} onChange={e => update("depositAmount", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none h-24 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Расскажите о вашем ресторане..." />
          </div>

          {result && (
            <div className={`p-3 rounded-xl text-sm ${result.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {result.message}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors text-lg">
            {loading ? "Отправка..." : "Зарегистрировать ресторан"}
          </button>
        </form>
      </div>
    </div>
  );
}
