'use client';

import Script from 'next/script';

interface ProductJsonLdProps {
  name: string;
  description: string;
  sku: string;
  image: string;
  price: number;
  currency: string;
  url: string;
  brand?: string;
  category?: string;
}

export function ProductJsonLd({
  name,
  description,
  sku,
  image,
  price,
  currency,
  url,
  brand = 'SAWEI',
  category,
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku,
    image: [image],
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    ...(category && { category }),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'SAWEI',
      },
    },
  };

  return (
    <Script
      id={`product-jsonld-${sku}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
