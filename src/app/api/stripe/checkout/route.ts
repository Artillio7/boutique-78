import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductById } from '@/lib/data';

// Initialize Stripe (use test key for development)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, currency = 'eur', locale = 'fr', quantity = 1 } = body;

    // Get product
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate price based on currency
    let unitAmount: number;
    let stripeCurrency: string;

    switch (currency.toUpperCase()) {
      case 'XAF':
        // XAF doesn't support decimals, price in cents
        unitAmount = Math.round(product.pricing.computed.xaf);
        stripeCurrency = 'xaf';
        break;
      case 'CNY':
        // CNY in cents
        unitAmount = Math.round(product.pricing.computed.cny * 100);
        stripeCurrency = 'cny';
        break;
      case 'EUR':
      default:
        // EUR in cents
        unitAmount = Math.round(product.pricing.computed.eur * 100);
        stripeCurrency = 'eur';
        break;
    }

    // Get origin for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: stripeCurrency,
      locale: locale as Stripe.Checkout.SessionCreateParams.Locale,
      line_items: [
        {
          price_data: {
            currency: stripeCurrency,
            product_data: {
              name: product.title.fr,
              description: product.shortDescription.fr,
              images: product.images.slice(0, 1).map(img => img.url),
              metadata: {
                product_id: product.id,
                sku: product.sku || '',
              },
            },
            unit_amount: unitAmount,
          },
          quantity,
        },
      ],
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/products/${product.slug}`,
      metadata: {
        product_id: product.id,
        locale,
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
