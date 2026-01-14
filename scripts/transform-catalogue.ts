/**
 * Script to transform scraped catalogue data into e-commerce format
 * Reads from: ../Catalogue_Boutique78/
 * Outputs to: ../sawei-store/src/data/
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOGUE_DIR = path.join(__dirname, '../../Catalogue_Boutique78');
const OUTPUT_DIR = path.join(__dirname, '../src/data');

// FX Rates (EUR/CNY ~0.13, XAF fixed parity with EUR)
const FX_RATES = {
  eurCny: 0.13,
  eurXaf: 655.957 // Fixed parity: 1 EUR = 655.957 XAF
};

const MARGIN = 0.10; // 10% margin

interface RawProduct {
  id: string;
  slug: string;
  category_id: string;
  category_cn: string;
  category_fr: string;
  category_en: string;
  title_cn: string;
  title_fr: string;
  title_en: string;
  description_cn?: string;
  description_fr?: string;
  description_en?: string;
  price_cny_raw: number;
  price_cny_display: string;
  price_eur: number;
  price_eur_display: string;
  margin_applied: number;
  fx_rate: number;
  source_url: string;
  images: Array<{ url: string; local_path: string }>;
  scraped_at: string;
}

function formatPrice(amount: number, currency: 'EUR' | 'CNY' | 'XAF'): string {
  switch (currency) {
    case 'EUR':
      return `${amount.toFixed(2)} €`;
    case 'CNY':
      return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
    case 'XAF':
      return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
  }
}

function generateShortDescription(title: string, category: string, locale: 'fr' | 'en'): string {
  const templates = {
    fr: `${title} - Équipement professionnel de qualité pour garage automobile. Catégorie: ${category}.`,
    en: `${title} - Professional quality equipment for automotive garage. Category: ${category}.`
  };
  const desc = templates[locale];
  return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
}

function transformProduct(raw: RawProduct, categorySlug: string): any {
  const baseCny = raw.price_cny_raw || 0;
  const priceEur = baseCny * FX_RATES.eurCny * (1 + MARGIN);
  const priceCny = baseCny * (1 + MARGIN);
  const priceXaf = priceEur * FX_RATES.eurXaf;

  // Round to marketing prices (.99 or .50)
  const roundToMarketing = (price: number): number => {
    const base = Math.floor(price);
    const decimal = price - base;
    if (decimal < 0.25) return base - 0.01; // .99
    if (decimal < 0.75) return base + 0.50;
    return base + 0.99;
  };

  const eurRounded = roundToMarketing(priceEur);

  return {
    id: raw.id,
    slug: raw.slug,
    sku: `SAWEI-${raw.id}`,
    title: {
      fr: raw.title_fr || raw.title_cn,
      en: raw.title_en || raw.title_fr || raw.title_cn,
      cn: raw.title_cn
    },
    description: {
      fr: raw.description_fr || `Équipement automobile professionnel: ${raw.title_fr || raw.title_cn}`,
      en: raw.description_en || `Professional automotive equipment: ${raw.title_en || raw.title_fr || raw.title_cn}`,
      cn: raw.description_cn || raw.title_cn
    },
    shortDescription: {
      fr: generateShortDescription(raw.title_fr || raw.title_cn, raw.category_fr, 'fr'),
      en: generateShortDescription(raw.title_en || raw.title_fr, raw.category_en, 'en')
    },
    category: {
      id: raw.category_id,
      slug: categorySlug,
      name: {
        fr: raw.category_fr.replace(/_/g, ' '),
        en: raw.category_en.replace(/_/g, ' '),
        cn: raw.category_cn
      }
    },
    pricing: {
      baseCny: baseCny,
      margin: MARGIN,
      fxRates: {
        eur: FX_RATES.eurCny,
        xaf: FX_RATES.eurCny * FX_RATES.eurXaf
      },
      computed: {
        eur: eurRounded,
        cny: Math.round(priceCny),
        xaf: Math.round(priceXaf)
      },
      display: {
        eur: formatPrice(eurRounded, 'EUR'),
        cny: formatPrice(priceCny, 'CNY'),
        xaf: formatPrice(priceXaf, 'XAF')
      }
    },
    images: (raw.images || []).map((img, idx) => ({
      url: img.url,
      localPath: `/images/products/${raw.slug}/${String(idx + 1).padStart(2, '0')}.jpg`,
      alt: `${raw.title_fr || raw.title_cn} - Image ${idx + 1}`
    })),
    sourceUrl: raw.source_url,
    createdAt: raw.scraped_at,
    updatedAt: new Date().toISOString().split('T')[0]
  };
}

async function main() {
  console.log('🔄 Transforming catalogue data...\n');

  const products: any[] = [];
  const categoriesMap = new Map<string, any>();
  const seenIds = new Set<string>();

  // Read all category directories
  const categoryDirs = fs.readdirSync(CATALOGUE_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const categoryDir of categoryDirs) {
    const categoryPath = path.join(CATALOGUE_DIR, categoryDir);
    const productDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(d => d.isDirectory());

    for (const productDir of productDirs) {
      const infoPath = path.join(categoryPath, productDir.name, 'info_produit.json');

      if (!fs.existsSync(infoPath)) continue;

      try {
        const rawData: RawProduct = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));

        // Skip duplicates
        if (seenIds.has(rawData.id)) continue;
        seenIds.add(rawData.id);

        // Skip products without valid price
        if (!rawData.price_cny_raw || rawData.price_cny_raw <= 0) continue;

        const product = transformProduct(rawData, categoryDir);
        products.push(product);

        // Track category
        if (!categoriesMap.has(categoryDir)) {
          categoriesMap.set(categoryDir, {
            id: rawData.category_id,
            slug: categoryDir,
            name: {
              fr: rawData.category_fr.replace(/_/g, ' '),
              en: rawData.category_en.replace(/_/g, ' '),
              cn: rawData.category_cn
            },
            productCount: 0
          });
        }
        categoriesMap.get(categoryDir)!.productCount++;

      } catch (err) {
        console.error(`Error processing ${infoPath}:`, err);
      }
    }
  }

  // Sort products by price (descending)
  products.sort((a, b) => b.pricing.computed.eur - a.pricing.computed.eur);

  const categories = Array.from(categoriesMap.values())
    .sort((a, b) => b.productCount - a.productCount);

  const catalogueData = {
    products,
    categories,
    metadata: {
      totalProducts: products.length,
      totalImages: products.reduce((sum, p) => sum + p.images.length, 0),
      lastUpdated: new Date().toISOString(),
      fxRates: {
        eurCny: FX_RATES.eurCny,
        eurXaf: FX_RATES.eurXaf
      }
    }
  };

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write catalogue data
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'catalogue.json'),
    JSON.stringify(catalogueData, null, 2),
    'utf-8'
  );

  // Write products separately for easier imports
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'products.json'),
    JSON.stringify(products, null, 2),
    'utf-8'
  );

  // Write categories separately
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2),
    'utf-8'
  );

  console.log('✅ Transformation complete!\n');
  console.log(`📦 ${products.length} products`);
  console.log(`📁 ${categories.length} categories`);
  console.log(`🖼️  ${catalogueData.metadata.totalImages} images`);
  console.log(`\n📄 Output: ${OUTPUT_DIR}`);
}

main().catch(console.error);
