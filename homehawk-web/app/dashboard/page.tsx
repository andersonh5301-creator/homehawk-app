import { createClient } from "@supabase/supabase-js";

export default async function Dashboard() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: services } = await supabase.from("services").select("*").eq("active", true);

  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="grid gap-3">
        <h3 className="font-medium">Available Services</h3>
        <ul className="list-disc pl-6">
          {(services || []).map((s: any) => (
            <li key={s.id}>
              {s.display_name} — ${(s.base_price_cents / 100).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
