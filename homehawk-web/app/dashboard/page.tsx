"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/signin";
        return;
      }
      setUser(user);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setSubscription(sub);

      const { data: serviceOrders } = await supabase
        .from("service_orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders(serviceOrders ?? []);

      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="grid gap-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Account</h3>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Subscription</h3>
        {subscription ? (
          <div className="text-sm">
            <p>Plan: <span className="font-medium capitalize">{subscription.tier}</span></p>
            <p>Status: <span className="font-medium capitalize">{subscription.status}</span></p>
            <p>Renews: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No active subscription.{" "}
            <a href="/plans" className="underline" style={{ color: "var(--brand-primary)" }}>Choose a plan</a>
          </p>
        )}
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Service Orders</h3>
        {orders.length > 0 ? (
          <ul className="text-sm space-y-2">
            {orders.map((order: any) => (
              <li key={order.id} className="flex justify-between">
                <span className="capitalize">{order.type.replace("_", " ")}</span>
                <span className="text-gray-600 capitalize">{order.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No service orders yet.</p>
        )}
      </div>
    </div>
  );
}
