'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Currency = 'EUR' | 'CNY' | 'XAF';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceEur: number) => string;
  convertPrice: (priceEur: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Conversion rates (EUR as base)
const RATES: Record<Currency, number> = {
  EUR: 1,
  CNY: 7.69,      // 1 EUR ≈ 7.69 CNY
  XAF: 655.957    // Fixed parity: 1 EUR = 655.957 XAF
};

const FORMATS: Record<Currency, { locale: string; currency: string; symbol: string }> = {
  EUR: { locale: 'fr-FR', currency: 'EUR', symbol: '€' },
  CNY: { locale: 'zh-CN', currency: 'CNY', symbol: '¥' },
  XAF: { locale: 'fr-FR', currency: 'XAF', symbol: 'FCFA' }
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('EUR');

  const convertPrice = useCallback((priceEur: number): number => {
    return priceEur * RATES[currency];
  }, [currency]);

  const formatPrice = useCallback((priceEur: number): string => {
    const converted = convertPrice(priceEur);
    const format = FORMATS[currency];

    if (currency === 'XAF') {
      return `${Math.round(converted).toLocaleString('fr-FR')} ${format.symbol}`;
    }

    return new Intl.NumberFormat(format.locale, {
      style: 'currency',
      currency: format.currency,
      minimumFractionDigits: currency === 'CNY' ? 0 : 2,
      maximumFractionDigits: currency === 'CNY' ? 0 : 2
    }).format(converted);
  }, [currency, convertPrice]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Currency selector component
export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      className="bg-transparent border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="EUR">€ EUR</option>
      <option value="CNY">¥ CNY</option>
      <option value="XAF">FCFA</option>
    </select>
  );
}
