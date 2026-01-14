'use client';

import { useCurrency } from '@/lib/currency';

interface ProductPriceDisplayProps {
  priceEur: number;
  showAllCurrencies?: boolean;
}

// Conversion rates for display (EUR as base)
const RATES = {
  CNY: 7.69,
  XAF: 655.957,
};

export function ProductPriceDisplay({ priceEur, showAllCurrencies = false }: ProductPriceDisplayProps) {
  const { formatPrice, currency } = useCurrency();

  if (showAllCurrencies) {
    return (
      <div className="space-y-1">
        <div className="text-3xl font-bold text-primary">
          {formatPrice(priceEur)}
        </div>
        <div className="text-sm text-muted-foreground space-x-4">
          {currency !== 'EUR' && <span>≈ {priceEur.toFixed(2)} €</span>}
          {currency !== 'CNY' && <span>≈ ¥{Math.round(priceEur * RATES.CNY)}</span>}
          {currency !== 'XAF' && <span>≈ {Math.round(priceEur * RATES.XAF).toLocaleString()} FCFA</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="text-3xl font-bold text-primary">
      {formatPrice(priceEur)}
    </div>
  );
}
