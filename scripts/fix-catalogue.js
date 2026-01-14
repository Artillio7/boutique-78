const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../src/data/catalogue.json');
const completPath = path.join(__dirname, '../../catalogue_complet.json');

const store = require(storePath);
const complet = require(completPath);

const QR_IMAGE = '5e1152055e503.jpg';

console.log('Starting catalogue fix...\n');

// 1. Fix images - remove QR code or move to end
let fixedCount = 0;
let qrOnlyCount = 0;

store.products.forEach(p => {
  if (p.images && p.images.length > 0) {
    const originalFirst = p.images[0].url;

    // Separate QR and non-QR images
    const qrImages = p.images.filter(img => img.url.includes(QR_IMAGE));
    const goodImages = p.images.filter(img => !img.url.includes(QR_IMAGE));

    // Put good images first
    if (goodImages.length > 0) {
      p.images = goodImages; // Remove QR entirely if we have good images
      if (originalFirst.includes(QR_IMAGE)) {
        fixedCount++;
      }
    } else {
      // Only QR code - keep it but log warning
      qrOnlyCount++;
      console.log('WARNING: ' + p.slug + ' only has QR code image');
    }
  }
});

console.log('\nFixed ' + fixedCount + ' products (removed QR as first image)');
console.log('Products with only QR: ' + qrOnlyCount);

// 2. Add missing products
const storeIds = new Set(store.products.map(p => p.id));
const missingProducts = [];

complet.categories.forEach(cat => {
  cat.products.forEach(prod => {
    if (!storeIds.has(prod.id)) {
      // Create slug from source URL or title
      let slug = '';
      if (prod.source_url) {
        const match = prod.source_url.match(/\/id\/(\d+)\//);
        slug = match ? 'product-' + match[1] : '';
      }
      if (!slug) {
        slug = prod.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      }

      // Convert to store format
      const newProduct = {
        id: prod.id,
        slug: slug,
        sku: 'SAWEI-' + prod.id,
        title: {
          fr: prod.title_fr,
          en: prod.title_en,
          cn: prod.title_cn
        },
        description: {
          fr: 'Équipement automobile professionnel: ' + prod.title_fr,
          en: 'Professional automotive equipment: ' + prod.title_en,
          cn: '专业汽车设备: ' + prod.title_cn
        },
        category: {
          slug: cat.name_fr,
          name: {
            fr: cat.name_fr.replace(/_/g, ' '),
            en: cat.name_en.replace(/_/g, ' '),
            cn: cat.name_cn
          }
        },
        pricing: {
          original: { cny: prod.price_cny },
          computed: {
            eur: prod.price_eur,
            cny: prod.price_cny,
            xaf: Math.round(prod.price_eur * 655.957)
          }
        },
        images: prod.image_url ? [{ url: prod.image_url, alt: prod.title_fr }] : [],
        sourceUrl: prod.source_url
      };
      missingProducts.push(newProduct);
      console.log('ADDED: ' + prod.title_fr);
    }
  });
});

store.products.push(...missingProducts);

// Update categories list
const categoryMap = new Map();
store.products.forEach(p => {
  if (!categoryMap.has(p.category.slug)) {
    categoryMap.set(p.category.slug, p.category.name);
  }
});

store.categories = Array.from(categoryMap.entries()).map(([slug, name]) => ({
  slug,
  name
}));

console.log('\n--- SUMMARY ---');
console.log('Total products now: ' + store.products.length);
console.log('Categories: ' + store.categories.length);

// Save
fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
console.log('\nSaved catalogue.json');
