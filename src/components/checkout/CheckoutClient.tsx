'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Trash2, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/cart';
import { useCurrency } from '@/lib/currency';

export function CheckoutClient() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          currency: currency.toLowerCase(),
          locale,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('empty')}</h2>
        <Link href={`/${locale}/products`}>
          <Button>{t('continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <Card key={item.productId}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted shrink-0">
                  <Image
                    src={item.image || '/placeholder.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${locale}/products/${item.slug}`}
                    className="font-medium hover:text-primary line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <p className="text-primary font-semibold mt-1">
                    {formatPrice(item.priceEur)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeFromCart(item.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">{t('subtotal')}</h3>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-2">
                    {item.title} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.priceEur * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>{t('total')}</span>
              <span className="text-primary">{formatPrice(getCartTotal())}</span>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                t('checkout')
              )}
            </Button>

            <Link href={`/${locale}/products`} className="block">
              <Button variant="outline" className="w-full">
                {t('continueShopping')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
