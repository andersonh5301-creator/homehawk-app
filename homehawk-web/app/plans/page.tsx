"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const plans = [
  { name: "Basic", price: "$7.99/mo", priceId: process.env.NEXT_PUBLIC_PRICE_BASIC!, mode: "subscription" as const },
  { name: "Plus", price: "$17.99/mo", priceId: process.env.NEXT_PUBLIC_PRICE_PLUS!, mode: "subscription" as const },
  { name: "Pro", price: "$29.99/mo", priceId: process.env.NEXT_PUBLIC_PRICE_PRO!, mode: "subscription" as const },
];

const addons = [
  { name: "Peace of Mind Visit", price: "$100", priceId: process.env.NEXT_PUBLIC_PRICE_PEACE_OF_MIND!, mode: "payment" as const, orderType: "peace_of_mind" },
  { name: "Pop-In Visit", price: "$30", priceId: process.env.NEXT_PUBLIC_PRICE_POP_IN!, mode: "payment" as const, orderType: "pop_in" },
];

export default function Plans() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
  }, []);

  const buy = async (priceId: string, mode: string, orderType?: string) => {
    if (!userId || !email) {
      alert("Please sign in first.");
      window.location.href = "/signin";
      return;
    }

    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, email, userId, mode, orderType }),
    });
    const data = await r.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Something went wrong.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid gap-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Choose Your Plan</h2>

      {!userId && (
        <p className="text-sm text-gray-600">
          <a href="/signin" className="underline" style={{ color: "var(--brand-primary)" }}>Sign in</a> to purchase a plan.
        </p>
      )}

      <div className="grid gap-3">
        <h3 className="text-lg font-semibold">Subscription Plans</h3>
        {plans.map((plan) => (
          <button
            key={plan.name}
            className="p-4 rounded border text-left hover:bg-gray-50 flex justify-between items-center"
            onClick={() => buy(plan.priceId, plan.mode)}
            disabled={!userId}
          >
            <span className="font-medium">{plan.name}</span>
            <span className="text-gray-600">{plan.price}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        <h3 className="text-lg font-semibold">One-Time Add-Ons</h3>
        {addons.map((addon) => (
          <button
            key={addon.name}
            className="p-4 rounded border text-left hover:bg-gray-50 flex justify-between items-center"
            onClick={() => buy(addon.priceId, addon.mode, addon.orderType)}
            disabled={!userId}
          >
            <span className="font-medium">{addon.name}</span>
            <span className="text-gray-600">{addon.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
