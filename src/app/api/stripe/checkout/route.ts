import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductById } from '@/lib/data';

// Initialize Stripe (use test key for development)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

interface CartItem {
  productId: string;
  quantity: number;
}

function calculateUnitAmount(priceEur: number, currency: string): { amount: number; stripeCurrency: string } {
  switch (currency.toUpperCase()) {
    case 'XAF':
      return { amount: Math.round(priceEur * 655.957), stripeCurrency: 'xaf' };
    case 'CNY':
      return { amount: Math.round(priceEur * 7.8 * 100), stripeCurrency: 'cny' };
    case 'EUR':
    default:
      return { amount: Math.round(priceEur * 100), stripeCurrency: 'eur' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, productId, currency = 'eur', locale = 'fr', quantity = 1 } = body;
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Handle cart checkout (multiple items)
    if (items && Array.isArray(items) && items.length > 0) {
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      const { stripeCurrency } = calculateUnitAmount(1, currency);

      for (const item of items as CartItem[]) {
        const product = getProductById(item.productId);
        if (!product) continue;

        const { amount } = calculateUnitAmount(product.pricing.computed.eur, currency);
        lineItems.push({
          price_data: {
            currency: stripeCurrency,
            product_data: {
              name: product.title.fr,
              description: product.description?.fr?.substring(0, 100) || '',
              images: product.images.slice(0, 1).map(img => img.url).filter(url => url.startsWith('http')),
            },
            unit_amount: amount,
          },
          quantity: item.quantity,
        });
      }

      if (lineItems.length === 0) {
        return NextResponse.json({ error: 'No valid products in cart' }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        currency: stripeCurrency,
        locale: locale as Stripe.Checkout.SessionCreateParams.Locale,
        line_items: lineItems,
        success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/${locale}/checkout`,
      });

      return NextResponse.json({ url: session.url, sessionId: session.id });
    }

    // Handle single product checkout (legacy)
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const { amount, stripeCurrency } = calculateUnitAmount(product.pricing.computed.eur, currency);

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
              description: product.description?.fr?.substring(0, 100) || '',
              images: product.images.slice(0, 1).map(img => img.url).filter(url => url.startsWith('http')),
            },
            unit_amount: amount,
          },
          quantity,
        },
      ],
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/products/${product.slug}`,
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
