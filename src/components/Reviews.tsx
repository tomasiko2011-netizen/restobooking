"use client";

import { useState, useEffect } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | null;
}

interface Props {
  restaurantId: string;
}

export default function Reviews({ restaurantId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?restaurant_id=${restaurantId}`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {});
  }, [restaurantId, submitted]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, rating, comment }),
      });
      if (res.ok) {
        setSubmitted(true);
        setComment("");
        setRating(5);
      }
    } catch {}
    setLoading(false);
  }

  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div className="space-y-4">
      {/* Submit form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-2xl ${n <= rating ? "text-yellow-500" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ваш отзыв..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none h-20 focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? "..." : "Отправить отзыв"}
          </button>
        </form>
      ) : (
        <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm">Спасибо за отзыв!</div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 && (
        <div className="space-y-3 mt-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-gray-100 pb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-yellow-500 text-sm">{stars(r.rating)}</span>
                <span className="text-xs text-gray-400">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString("ru") : ""}
                </span>
              </div>
              {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
