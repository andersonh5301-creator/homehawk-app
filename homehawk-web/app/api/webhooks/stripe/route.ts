import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-01-28.clover" });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PRICE_TIER: Record<string, string> = {
  [process.env.NEXT_PUBLIC_PRICE_BASIC!]: "basic",
  [process.env.NEXT_PUBLIC_PRICE_PLUS!]:  "plus",
  [process.env.NEXT_PUBLIC_PRICE_PRO!]:   "pro",
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig  = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId  = session.metadata?.userId;
    if (!userId) return NextResponse.json({ error: "No userId in metadata" }, { status: 400 });

    if (session.mode === "subscription") {
      const sub  = await stripe.subscriptions.retrieve(session.subscription as string);
      const firstItem = sub.items.data[0];
      const priceId = firstItem?.price.id ?? "";
      const tier = PRICE_TIER[priceId] ?? "basic";
      const periodEnd = firstItem?.current_period_end ?? 0;

      await supabase.from("subscriptions").upsert({
        user_id:                userId,
        stripe_subscription_id: sub.id,
        tier,
        status:                 sub.status,
        current_period_end:     new Date(periodEnd * 1000).toISOString(),
        updated_at:             new Date().toISOString(),
      }, { onConflict: "stripe_subscription_id" });
    }

    if (session.mode === "payment") {
      const orderType = session.metadata?.orderType ?? "unknown";
      const amount    = session.amount_total ?? 0;

      await supabase.from("service_orders").insert({
        user_id:                  userId,
        stripe_payment_intent_id: session.payment_intent as string,
        type:                     orderType,
        total_amount:             amount,
        status:                   "confirmed",
      });
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const periodEnd = sub.items.data[0]?.current_period_end ?? 0;
    await supabase.from("subscriptions").upsert({
      stripe_subscription_id: sub.id,
      status:                 sub.status,
      current_period_end:     new Date(periodEnd * 1000).toISOString(),
      updated_at:             new Date().toISOString(),
    }, { onConflict: "stripe_subscription_id" });
  }

  return NextResponse.json({ received: true });
}
