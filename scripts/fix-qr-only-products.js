const fs = require('fs');
const path = require('path');

const CATALOGUE_PATH = path.join(__dirname, '../src/data/catalogue.json');
const SCRAPE_DIR = path.join(__dirname, '../../Catalogue_Boutique78');
const QR_IMAGE = '5e1152055e503.jpg';

const catalogue = require(CATALOGUE_PATH);

console.log('Fixing products with QR-only images...\n');

let fixedCount = 0;

catalogue.products.forEach(product => {
  // Check if product only has QR code images
  if (!product.images || product.images.length === 0) return;

  const hasOnlyQR = product.images.every(img => img.url && img.url.includes(QR_IMAGE));
  if (!hasOnlyQR) return;

  console.log(`QR-only: ${product.slug}`);

  // Try to find alternate images from related folders
  const categorySlug = product.category.slug;
  const categoryPath = path.join(SCRAPE_DIR, categorySlug);

  if (!fs.existsSync(categoryPath)) {
    console.log(`  Category not found: ${categorySlug}`);
    return;
  }

  // Look for folders with similar names
  const folders = fs.readdirSync(categoryPath);
  const baseSlug = product.slug.split('-y-')[0]; // Remove price suffix

  const relatedFolders = folders.filter(f => f.startsWith(baseSlug));

  for (const folder of relatedFolders) {
    const infoPath = path.join(categoryPath, folder, 'info_produit.json');
    if (!fs.existsSync(infoPath)) continue;

    try {
      const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
      if (!info.images || info.images.length === 0) continue;

      // Find non-QR images
      const goodImages = info.images.filter(img => img.url && !img.url.includes(QR_IMAGE));

      if (goodImages.length > 0) {
        console.log(`  Found ${goodImages.length} good images in ${folder}`);

        // Update product images
        product.images = goodImages.map(img => ({
          url: img.url,
          alt: product.title.fr || 'Product image'
        }));

        fixedCount++;
        break;
      }
    } catch (err) {
      // Skip errors
    }
  }
});

// Save
fs.writeFileSync(CATALOGUE_PATH, JSON.stringify(catalogue, null, 2));

console.log(`\nFixed ${fixedCount} products`);
console.log('Saved catalogue.json');
