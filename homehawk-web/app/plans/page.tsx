"use client";
import { useState } from "react";

export default function Plans() {
  const [email, setEmail] = useState("");

  const buy = async (priceId: string) => {
    if (!email) { alert("Enter an email for the receipt."); return; }
    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, email }),
    });
    const { url } = await r.json();
    window.location.href = url;
  };

  return (
    <div className="grid gap-4 max-w-lg">
      <h2 className="text-xl font-semibold">Choose your plan</h2>
      <input
        className="border p-2 rounded"
        placeholder="email for receipt"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="grid gap-2">
        <button className="p-2 rounded border" onClick={() => buy(process.env.NEXT_PUBLIC_PRICE_BASIC!)}>
          Basic
        </button>
        <button className="p-2 rounded border" onClick={() => buy(process.env.NEXT_PUBLIC_PRICE_PLUS!)}>
          Plus
        </button>
        <button className="p-2 rounded border" onClick={() => buy(process.env.NEXT_PUBLIC_PRICE_PRO!)}>
          Pro
        </button>
      </div>
    </div>
  );
}
