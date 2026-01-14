import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { filterProducts, getAllCategories } from '@/lib/data';
import { ProductGrid } from '@/components/catalogue/ProductGrid';
import { CatalogueFilters } from '@/components/catalogue/CatalogueFilters';
import { Skeleton } from '@/components/ui/skeleton';
import type { Locale } from '@/types';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const search = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('catalogue');
  const categories = getAllCategories();

  // Get filter params
  const category = search.category;
  const sortBy = (search.sort || 'priceDesc') as 'priceAsc' | 'priceDesc' | 'nameAsc' | 'newest';
  const searchQuery = search.search;
  const minPrice = search.minPrice ? parseFloat(search.minPrice) : undefined;
  const maxPrice = search.maxPrice ? parseFloat(search.maxPrice) : undefined;

  // Filter products
  const products = filterProducts({
    category,
    sortBy,
    search: searchQuery,
    minPrice,
    maxPrice,
    locale: locale as Locale,
  });

  return (
    <div className="container py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">
          Découvrez notre gamme complète d'équipements automobiles professionnels
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <CatalogueFilters
            categories={categories}
            totalProducts={products.length}
          />
        </Suspense>
      </div>

      {/* Products Grid */}
      <Suspense fallback={<ProductsLoading />}>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  );
}
