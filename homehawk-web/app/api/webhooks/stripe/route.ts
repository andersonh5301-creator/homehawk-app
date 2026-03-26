import { NextResponse } from 'next/server'
import { stripe, getTierFromPriceId } from '@/lib/stripe'
import { createServiceRoleClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  const supabase = createServiceRoleClient()
  const { data: existing } = await supabase.from('webhook_events').select('id').eq('stripe_event_id', event.id).single()
  if (existing) return NextResponse.json({ received: true, duplicate: true })
  await supabase.from('webhook_events').insert({ stripe_event_id: event.id, event_type: event.type, processed_at: new Date().toISOString() })
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const userId = session.metadata?.userId
        const priceId = session.metadata?.priceId
        if (!userId) break
        if (session.mode === 'subscription') {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          await supabase.from('subscriptions').upsert({ user_id: userId, stripe_subscription_id: sub.id, stripe_customer_id: session.customer, tier: getTierFromPriceId(priceId) || 'basic', status: sub.status, current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(), current_period_end: new Date((sub as any).current_period_end * 1000).toISOString() }, { onConflict: 'user_id' })
        } else {
          await supabase.from('service_orders').insert({ user_id: userId, type: priceId?.includes('knj') ? 'peace_of_mind' : 'pop_in', status: 'paid', total_amount: session.amount_total / 100, stripe_session_id: session.id })
        }
        break
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as any
        await supabase.from('subscriptions').update({ status: sub.status, current_period_start: new Date(sub.current_period_start * 1000).toISOString(), current_period_end: new Date(sub.current_period_end * 1000).toISOString() }).eq('stripe_subscription_id', sub.id)
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any
        await supabase.from('subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', sub.id)
        break
      }
    }
  } catch (err) { console.error('Webhook error:', err) }
  return NextResponse.json({ received: true })
}
