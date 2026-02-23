import Stripe from "stripe";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-01-28.clover" });

export async function POST(request: NextRequest) {
  try {
    const { priceId, email, userId, mode, orderType } = await request.json();

    if (!priceId || !email || !userId || !mode) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, orderType: orderType ?? "" },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard?success=true`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/plans?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
