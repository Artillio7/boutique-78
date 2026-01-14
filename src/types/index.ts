// Types for SAWEI Store

export type Locale = 'fr' | 'en' | 'cn';
export type Currency = 'EUR' | 'CNY' | 'XAF';

export interface LocalizedString {
  fr: string;
  en: string;
  cn: string;
}

export interface Category {
  id?: string;
  slug: string;
  name: LocalizedString;
  productCount?: number;
}

export interface ProductImage {
  url: string;
  localPath?: string;
  alt?: string;
}

export interface ProductPricing {
  original: {
    cny: number;
  };
  computed: {
    eur: number;
    cny: number;
    xaf: number;
  };
  // Legacy fields (optional for backwards compatibility)
  baseCny?: number;
  margin?: number;
  fxRates?: {
    eur: number;
    xaf: number;
  };
  display?: {
    eur: string;
    cny: string;
    xaf: string;
  };
}

export interface Product {
  id: string;
  slug: string;
  sku?: string;
  title: LocalizedString;
  description: LocalizedString;
  shortDescription?: {
    fr?: string;
    en?: string;
  };
  category: {
    id?: string;
    slug: string;
    name: LocalizedString;
  };
  pricing: ProductPricing;
  images: ProductImage[];
  stock?: number;
  sourceUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CatalogueData {
  products: Product[];
  categories: Category[];
  metadata: {
    totalProducts: number;
    totalCategories: number;
    generatedAt: string;
    source: string;
    // Legacy fields (optional)
    totalImages?: number;
    lastUpdated?: string;
    fxRates?: {
      eurCny: number;
      eurXaf: number;
    };
  };
}
