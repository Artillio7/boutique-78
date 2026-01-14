import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProductBySlug, getRelatedProducts, getAllProducts } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProductGrid } from '@/components/catalogue/ProductGrid';
import { ProductImageGallery } from '@/components/catalogue/ProductImageGallery';
import { ProductPriceDisplay } from '@/components/catalogue/ProductPriceDisplay';
import { AddToCartButton } from '@/components/catalogue/AddToCartButton';
import { QuoteForm } from '@/components/catalogue/QuoteForm';
import { WhatsAppButton } from '@/components/catalogue/WhatsAppButton';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';
import { ArrowLeft, Share2 } from 'lucide-react';
import type { Locale } from '@/types';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const localeKey = locale as Locale;
  const title = product.title[localeKey] || product.title.fr;
  const description = product.description[localeKey] || product.description.fr;
  const image = product.images[0]?.url;

  return {
    title: `${title} | SAWEI`,
    description: description.substring(0, 160),
    openGraph: {
      title: `${title} | SAWEI`,
      description: description.substring(0, 160),
      type: 'website',
      images: image ? [{ url: image, width: 800, height: 600, alt: title }] : [],
      siteName: 'SAWEI',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | SAWEI`,
      description: description.substring(0, 160),
      images: image ? [image] : [],
    },
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  const locales = ['fr', 'en', 'cn'];

  return products.flatMap((product) =>
    locales.map((locale) => ({
      locale,
      slug: product.slug,
    }))
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('product');
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);
  const localeKey = locale as Locale;

  const title = product.title[localeKey] || product.title.fr;
  const description = product.description[localeKey] || product.description.fr;
  const categoryName = product.category.name[localeKey] || product.category.name.fr;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sawei.com';

  return (
    <>
      <ProductJsonLd
        name={title}
        description={description}
        sku={product.sku || product.id}
        image={product.images[0]?.url || ''}
        price={product.pricing.computed.eur}
        currency="EUR"
        url={`${baseUrl}/${locale}/products/${product.slug}`}
        category={categoryName}
      />
      <div className="container py-8">
        {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href={`/${locale}/products`} className="hover:text-primary flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          {t('category')}
        </Link>
        <span>/</span>
        <Link
          href={`/${locale}/products?category=${product.category.slug}`}
          className="hover:text-primary"
        >
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-foreground">{title}</span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <ProductImageGallery images={product.images} title={title} />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category Badge */}
          <Badge variant="secondary">{categoryName}</Badge>

          {/* Title */}
          <h1 className="text-3xl font-bold">{title}</h1>

          {/* SKU */}
          <p className="text-sm text-muted-foreground">
            {t('sku')}: <span className="font-mono">{product.sku}</span>
          </p>

          {/* Price */}
          <ProductPriceDisplay priceEur={product.pricing.computed.eur} />

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">{t('description')}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              title={title}
              priceEur={product.pricing.computed.eur}
              image={product.images[0]?.url}
              label={t('buyNow')}
            />
            <QuoteForm productTitle={title} productSku={product.sku || product.id} />
          </div>

          {/* Contact Options */}
          <div className="flex gap-4">
            <WhatsAppButton productTitle={title} />
          </div>

          {/* Share */}
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            {t('shareProduct')}
          </Button>

          <Separator />

          {/* Source Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>ID: {product.id}</p>
            <p>Source: {product.sourceUrl}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">{t('relatedProducts')}</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

        {/* Floating WhatsApp Button */}
        <WhatsAppButton productTitle={title} floating />
      </div>
    </>
  );
}
