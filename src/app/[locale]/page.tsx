import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllProducts, getAllCategories } from '@/lib/data';
import { ProductGrid } from '@/components/catalogue/ProductGrid';
import { ArrowRight, Shield, Truck, Headphones } from 'lucide-react';
import type { Locale } from '@/types';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const products = getAllProducts().slice(0, 8);
  const categories = getAllCategories();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl space-y-6">
            <Badge variant="secondary" className="mb-4">
              🚗 Équipements Professionnels
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="gap-2">
                <Link href={`/${locale}/products`}>
                  {t('hero.cta')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t('features.quality')}</h3>
                <p className="text-sm text-muted-foreground">{t('features.qualityDesc')}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t('features.shipping')}</h3>
                <p className="text-sm text-muted-foreground">{t('features.shippingDesc')}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t('features.support')}</h3>
                <p className="text-sm text-muted-foreground">{t('features.supportDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Catégories</h2>
            <Button variant="ghost" asChild>
              <Link href={`/${locale}/products`} className="gap-1">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${locale}/products?category=${cat.slug}`}
                className="group p-4 bg-muted/50 rounded-lg hover:bg-primary/10 transition-colors text-center"
              >
                <p className="font-medium group-hover:text-primary transition-colors">
                  {cat.name[locale as Locale]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {cat.productCount} produits
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Produits Populaires</h2>
            <Button variant="ghost" asChild>
              <Link href={`/${locale}/products`} className="gap-1">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Besoin d'un devis personnalisé ?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Contactez-nous pour obtenir un devis sur mesure. Livraison possible en France, Afrique et Asie.
          </p>
          <Button variant="secondary" size="lg" className="mt-4">
            Demander un devis
          </Button>
        </div>
      </section>
    </div>
  );
}
