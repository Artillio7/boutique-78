import catalogueData from '@/data/catalogue.json';
import type { Product, Category, CatalogueData, Locale } from '@/types';

// Type assertion for imported JSON
const catalogue = catalogueData as unknown as CatalogueData;

export function getAllProducts(): Product[] {
  return catalogue.products;
}

export function getAllCategories(): Category[] {
  return catalogue.categories;
}

export function getProductBySlug(slug: string): Product | undefined {
  return catalogue.products.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return catalogue.products.find(p => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return catalogue.products.filter(p => p.category.slug === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return catalogue.categories.find(c => c.slug === slug);
}

export function searchProducts(
  query: string,
  locale: Locale = 'fr'
): Product[] {
  const searchLower = query.toLowerCase();

  return catalogue.products.filter(product => {
    const title = product.title[locale]?.toLowerCase() || '';
    const description = product.description[locale]?.toLowerCase() || '';
    const categoryName = product.category.name[locale]?.toLowerCase() || '';
    const sku = product.sku?.toLowerCase() || '';

    return (
      title.includes(searchLower) ||
      description.includes(searchLower) ||
      categoryName.includes(searchLower) ||
      sku.includes(searchLower) ||
      product.id.includes(query)
    );
  });
}

export function filterProducts(options: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  locale?: Locale;
  sortBy?: 'priceAsc' | 'priceDesc' | 'nameAsc' | 'newest';
}): Product[] {
  const { category, minPrice, maxPrice, search, locale = 'fr', sortBy = 'priceDesc' } = options;

  let filtered = [...catalogue.products];

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category.slug === category);
  }

  // Filter by price range (EUR)
  if (minPrice !== undefined) {
    filtered = filtered.filter(p => p.pricing.computed.eur >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter(p => p.pricing.computed.eur <= maxPrice);
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(product => {
      const title = product.title[locale]?.toLowerCase() || '';
      const categoryName = product.category.name[locale]?.toLowerCase() || '';
      return title.includes(searchLower) || categoryName.includes(searchLower);
    });
  }

  // Sort
  switch (sortBy) {
    case 'priceAsc':
      filtered.sort((a, b) => a.pricing.computed.eur - b.pricing.computed.eur);
      break;
    case 'priceDesc':
      filtered.sort((a, b) => b.pricing.computed.eur - a.pricing.computed.eur);
      break;
    case 'nameAsc':
      filtered.sort((a, b) => (a.title[locale] || '').localeCompare(b.title[locale] || ''));
      break;
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return filtered;
}

export function getRelatedProducts(product: Product, limit: number = 4): Product[] {
  return catalogue.products
    .filter(p => p.category.slug === product.category.slug && p.id !== product.id)
    .slice(0, limit);
}

export function getCatalogueMetadata() {
  return catalogue.metadata;
}

export function getPriceRange(): { min: number; max: number } {
  const prices = catalogue.products.map(p => p.pricing.computed.eur);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}
