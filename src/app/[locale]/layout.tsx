import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { locales, type Locale } from '@/i18n/config';
import { CurrencyProvider } from '@/lib/currency';
import { CartProvider } from '@/lib/cart';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface MetadataProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: {
      default: t('title'),
      template: '%s | SAWEI',
    },
    description: t('description'),
    keywords: ['automotive equipment', 'car lift', 'tire changer', 'spray booth', 'garage equipment'],
    authors: [{ name: 'SAWEI' }],
    openGraph: {
      type: 'website',
      locale: locale === 'cn' ? 'zh_CN' : locale === 'fr' ? 'fr_FR' : 'en_US',
      siteName: 'SAWEI',
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
