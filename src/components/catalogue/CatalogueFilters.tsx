'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import type { Category, Locale } from '@/types';

interface CatalogueFiltersProps {
  categories: Category[];
  totalProducts: number;
}

export function CatalogueFilters({ categories, totalProducts }: CatalogueFiltersProps) {
  const t = useTranslations('catalogue');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'priceDesc';
  const currentSearch = searchParams.get('search') || '';

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/${locale}/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/${locale}/products`);
  };

  const hasFilters = currentCategory !== 'all' || currentSearch || currentSort !== 'priceDesc';

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{totalProducts}</span> {t('products')}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
            <X className="h-4 w-4 mr-1" />
            {t('clearFilters')}
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <Select value={currentCategory} onValueChange={(v) => updateParams('category', v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('allCategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCategories')}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name[locale]} ({cat.productCount})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select value={currentSort} onValueChange={(v) => updateParams('sort', v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priceDesc">{t('sortOptions.priceDesc')}</SelectItem>
            <SelectItem value="priceAsc">{t('sortOptions.priceAsc')}</SelectItem>
            <SelectItem value="nameAsc">{t('sortOptions.nameAsc')}</SelectItem>
            <SelectItem value="newest">{t('sortOptions.newest')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Input */}
        <Input
          type="search"
          placeholder={t('filters')}
          value={currentSearch}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) {
              params.set('search', e.target.value);
            } else {
              params.delete('search');
            }
            router.push(`/${locale}/products?${params.toString()}`);
          }}
          className="w-[200px]"
        />
      </div>
    </div>
  );
}
