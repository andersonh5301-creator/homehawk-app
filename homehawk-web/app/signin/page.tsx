"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handle = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else setSent(true);
  };

  return (
    <div className="max-w-sm grid gap-3">
      <h2 className="text-xl font-semibold">Sign in</h2>
      <input
        className="border p-2 rounded"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="p-2 rounded text-white"
        style={{ backgroundColor: "var(--brand-primary)" }}
        onClick={handle}
      >
        Send magic link
      </button>
      {sent && <p>Check your inbox for a login link.</p>}
    </div>
  );
}
