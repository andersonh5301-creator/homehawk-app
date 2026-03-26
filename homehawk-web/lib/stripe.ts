import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

export const APPROVED_PRICE_IDS = [
  'price_1SOqBcAj3n8O4cQjJBgz6nS0',
  'price_1SOqLmAj3n8O4cQjQvD1b82M',
  'price_1SOqP1Aj3n8O4cQj7xg48qko',
  'price_1T3knjAj3n8O4cQjrWgOYJHf',
  'price_1T3koZAj3n8O4cQjvkOaC5wM',
] as const

export type ApprovedPriceId = typeof APPROVED_PRICE_IDS[number]

export function isApprovedPriceId(priceId: string): priceId is ApprovedPriceId {
  return APPROVED_PRICE_IDS.includes(priceId as ApprovedPriceId)
}

export const SUBSCRIPTION_PRICE_IDS = [
  'price_1SOqBcAj3n8O4cQjJBgz6nS0',
  'price_1SOqLmAj3n8O4cQjQvD1b82M',
  'price_1SOqP1Aj3n8O4cQj7xg48qko',
]

export function isSubscriptionPrice(priceId: string): boolean {
  return SUBSCRIPTION_PRICE_IDS.includes(priceId)
}

export function getTierFromPriceId(priceId: string): string | null {
  switch (priceId) {
    case 'price_1SOqBcAj3n8O4cQjJBgz6nS0': return 'basic'
    case 'price_1SOqLmAj3n8O4cQjQvD1b82M': return 'plus'
    case 'price_1SOqP1Aj3n8O4cQj7xg48qko': return 'pro'
    default: return null
  }
}
