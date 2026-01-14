import FlexSearch from 'flexsearch';
import type { Product, Locale } from '@/types';
import { getAllProducts } from './data';

// Create indexes for each locale
const indexes: Record<Locale, any> = {
  fr: new FlexSearch.Index({ tokenize: 'forward', cache: true }),
  en: new FlexSearch.Index({ tokenize: 'forward', cache: true }),
  cn: new FlexSearch.Index({ tokenize: 'forward', cache: true })
};

let isIndexed = false;
let productMap: Map<string, Product> = new Map();

export function initSearchIndex() {
  if (isIndexed) return;

  const products = getAllProducts();

  products.forEach((product, idx) => {
    productMap.set(product.id, product);

    // Index for each locale
    (['fr', 'en', 'cn'] as Locale[]).forEach(locale => {
      const searchText = [
        product.title[locale],
        product.description[locale],
        product.category.name[locale],
        product.sku,
        product.id
      ].filter(Boolean).join(' ');

      indexes[locale].add(idx, searchText);
    });
  });

  isIndexed = true;
}

export function searchProducts(query: string, locale: Locale = 'fr'): Product[] {
  initSearchIndex();

  if (!query.trim()) {
    return [];
  }

  const results = indexes[locale].search(query, { limit: 20 });
  const products = getAllProducts();

  return results.map((idx: any) => products[idx as number]).filter(Boolean);
}

export function getSearchSuggestions(query: string, locale: Locale = 'fr', limit: number = 5): string[] {
  const results = searchProducts(query, locale);
  const suggestions = new Set<string>();

  results.forEach(product => {
    const title = product.title[locale];
    if (title && title.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(title);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}
