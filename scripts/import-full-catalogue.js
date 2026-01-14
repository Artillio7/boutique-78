const fs = require('fs');
const path = require('path');

const CATALOGUE_DIR = path.join(__dirname, '../../Catalogue_Boutique78');
const OUTPUT_PATH = path.join(__dirname, '../src/data/catalogue.json');
const QR_IMAGE = '5e1152055e503.jpg';

// Category translations
const CATEGORY_TRANSLATIONS = {
  'Equipement_de_detection': { fr: 'Équipement de détection', en: 'Detection Equipment', cn: '检测设备' },
  'Equipement_de_levage': { fr: 'Équipement de levage', en: 'Lifting Equipment', cn: '举升设备' },
  'Equipement_pneumatique': { fr: 'Équipement pneumatique', en: 'Pneumatic Equipment', cn: '气动设备' },
  'Equipement_pulverisateur': { fr: 'Équipement pulvérisateur', en: 'Spray Equipment', cn: '喷涂设备' },
  'Materiel_changement_huile': { fr: 'Matériel vidange', en: 'Oil Change Equipment', cn: '换油设备' },
  'Materiel_de_lavage': { fr: 'Matériel de lavage', en: 'Washing Equipment', cn: '清洗设备' },
  'Materiel_de_pneu': { fr: 'Matériel pneumatique', en: 'Tire Equipment', cn: '轮胎设备' },
  'Nouvelles_Energies': { fr: 'Nouvelles Énergies', en: 'New Energy', cn: '新能源设备' },
  'Occasion_Promotions': { fr: 'Occasions & Promotions', en: 'Used & Promotions', cn: '二手与促销' },
  'Outils_generaux': { fr: 'Outils généraux', en: 'General Tools', cn: '通用工具' },
  'Outils_JTC': { fr: 'Outils JTC', en: 'JTC Tools', cn: 'JTC工具' },
  'Outils_SATA': { fr: 'Outils SATA', en: 'SATA Tools', cn: '世达工具' }
};

// Clean title from Chinese format
function cleanTitle(titleCn) {
  if (!titleCn) return null;
  // Remove price, stock info
  let clean = titleCn.split('\n')[0].trim();
  // Remove ¥ prices
  clean = clean.replace(/¥[\d,\.]+/g, '').trim();
  return clean;
}

// Generate French title from Chinese
function generateFrTitle(titleCn, categoryFr) {
  const clean = cleanTitle(titleCn);
  if (!clean) return 'Équipement automobile professionnel';

  // Basic transliteration for common terms
  let title = clean
    .replace(/机/g, ' Machine')
    .replace(/器/g, ' Appareil')
    .replace(/车/g, ' Chariot')
    .replace(/工具/g, ' Outils')
    .replace(/组套/g, ' Kit')
    .replace(/件/g, ' pièces');

  // If still mostly Chinese, use category + ID
  if (/[\u4e00-\u9fff]/.test(title)) {
    return `${categoryFr} - ${clean.substring(0, 30)}`;
  }
  return title.trim();
}

// Generate English title from Chinese
function generateEnTitle(titleCn, categoryEn) {
  const clean = cleanTitle(titleCn);
  if (!clean) return 'Professional automotive equipment';

  let title = clean
    .replace(/机/g, ' Machine')
    .replace(/器/g, ' Device')
    .replace(/车/g, ' Cart')
    .replace(/工具/g, ' Tools')
    .replace(/组套/g, ' Kit')
    .replace(/件/g, ' pieces');

  if (/[\u4e00-\u9fff]/.test(title)) {
    return `${categoryEn} - ${clean.substring(0, 30)}`;
  }
  return title.trim();
}

// Sort images: non-QR first, QR last
function sortImages(images) {
  if (!images || images.length === 0) return [];

  const qrImages = images.filter(img => img.url && img.url.includes(QR_IMAGE));
  const goodImages = images.filter(img => img.url && !img.url.includes(QR_IMAGE));

  // Return good images only (remove QR entirely if we have alternatives)
  if (goodImages.length > 0) {
    return goodImages.map(img => ({ url: img.url, alt: 'Product image' }));
  }

  // If only QR, keep it
  return qrImages.map(img => ({ url: img.url, alt: 'Product image' }));
}

console.log('Starting full catalogue import...\n');

const products = [];
const categories = new Map();
let totalImages = 0;
let qrRemovedCount = 0;

// Scan all category folders
const categoryFolders = fs.readdirSync(CATALOGUE_DIR).filter(f => {
  const fullPath = path.join(CATALOGUE_DIR, f);
  return fs.statSync(fullPath).isDirectory() && !f.startsWith('tmpclaude');
});

console.log(`Found ${categoryFolders.length} categories\n`);

categoryFolders.forEach(categorySlug => {
  const categoryPath = path.join(CATALOGUE_DIR, categorySlug);
  const categoryTrans = CATEGORY_TRANSLATIONS[categorySlug] || {
    fr: categorySlug.replace(/_/g, ' '),
    en: categorySlug.replace(/_/g, ' '),
    cn: categorySlug
  };

  // Store category
  categories.set(categorySlug, categoryTrans);

  // Scan product folders in this category
  const productFolders = fs.readdirSync(categoryPath).filter(f => {
    const fullPath = path.join(categoryPath, f);
    return fs.statSync(fullPath).isDirectory();
  });

  console.log(`${categorySlug}: ${productFolders.length} products`);

  productFolders.forEach(productFolder => {
    const productPath = path.join(categoryPath, productFolder);
    const infoPath = path.join(productPath, 'info_produit.json');

    if (!fs.existsSync(infoPath)) {
      console.log(`  WARNING: No info_produit.json in ${productFolder}`);
      return;
    }

    try {
      const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

      // Process images
      const sortedImages = sortImages(info.images || []);
      totalImages += sortedImages.length;

      // Check if QR was removed
      if (info.images && info.images.length > 0 &&
          info.images[0].url && info.images[0].url.includes(QR_IMAGE) &&
          sortedImages.length > 0 && !sortedImages[0].url.includes(QR_IMAGE)) {
        qrRemovedCount++;
      }

      // Generate titles if missing
      const titleCn = cleanTitle(info.title_cn) || `Produit ${info.id}`;
      const titleFr = info.title_fr || generateFrTitle(info.title_cn, categoryTrans.fr);
      const titleEn = info.title_en || generateEnTitle(info.title_cn, categoryTrans.en);

      // Create product object
      const product = {
        id: info.id,
        slug: info.slug || productFolder,
        sku: info.sku || `SAWEI-${info.id}`,
        title: {
          fr: titleFr,
          en: titleEn,
          cn: titleCn
        },
        description: {
          fr: info.description_fr || `Équipement automobile professionnel: ${titleFr}`,
          en: info.description_en || `Professional automotive equipment: ${titleEn}`,
          cn: info.description_cn || `专业汽车设备: ${titleCn}`
        },
        category: {
          slug: categorySlug,
          name: categoryTrans
        },
        pricing: {
          original: { cny: info.pricing?.price_cny_raw || info.price_cny_raw || 0 },
          computed: {
            eur: info.pricing?.price_eur || info.price_eur || 0,
            cny: info.pricing?.price_cny_raw || info.price_cny_raw || 0,
            xaf: Math.round((info.pricing?.price_eur || info.price_eur || 0) * 655.957)
          }
        },
        images: sortedImages,
        stock: info.stock || 0,
        sourceUrl: info.source_url || ''
      };

      products.push(product);
    } catch (err) {
      console.log(`  ERROR parsing ${productFolder}: ${err.message}`);
    }
  });
});

// Deduplicate products by ID (keep the one with shorter slug - cleaner version)
const productMap = new Map();
let duplicatesRemoved = 0;

products.forEach(product => {
  const existing = productMap.get(product.id);
  if (existing) {
    // Keep the one with shorter slug (cleaner version without price in slug)
    if (product.slug.length < existing.slug.length) {
      productMap.set(product.id, product);
    }
    duplicatesRemoved++;
  } else {
    productMap.set(product.id, product);
  }
});

const uniqueProducts = Array.from(productMap.values());
console.log(`\nDuplicates removed: ${duplicatesRemoved}`);
console.log(`Unique products: ${uniqueProducts.length}`);

// Calculate product count per category
const categoryProductCounts = new Map();
uniqueProducts.forEach(p => {
  const count = categoryProductCounts.get(p.category.slug) || 0;
  categoryProductCounts.set(p.category.slug, count + 1);
});

// Build final catalogue
const catalogue = {
  products: uniqueProducts,
  categories: Array.from(categories.entries()).map(([slug, name]) => ({
    slug,
    name,
    productCount: categoryProductCounts.get(slug) || 0
  })),
  metadata: {
    totalProducts: uniqueProducts.length,
    totalCategories: categories.size,
    generatedAt: new Date().toISOString(),
    source: 'Catalogue_Boutique78'
  }
};

// Save
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(catalogue, null, 2));

console.log('\n--- SUMMARY ---');
console.log(`Total products: ${products.length}`);
console.log(`Total categories: ${categories.size}`);
console.log(`Total images: ${totalImages}`);
console.log(`QR codes removed from first position: ${qrRemovedCount}`);
console.log(`\nSaved to: ${OUTPUT_PATH}`);
