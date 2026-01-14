'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/lib/currency';
import type { Product, Locale } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const locale = useLocale() as Locale;
  const { formatPrice } = useCurrency();

  const title = product.title[locale] || product.title.fr;
  const categoryName = product.category.name[locale] || product.category.name.fr;
  const imageUrl = product.images[0]?.url || '/placeholder.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/${locale}/products/${product.slug}`}>
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm"
            >
              {categoryName}
            </Badge>
          </div>

          <CardContent className="p-4 space-y-2">
            {/* Title */}
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* SKU */}
            <p className="text-xs text-muted-foreground">
              {product.sku}
            </p>

            {/* Price */}
            <div className="pt-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.pricing.computed.eur)}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
