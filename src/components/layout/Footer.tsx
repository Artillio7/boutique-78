'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SAWEI
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('tagline')}
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t('links')}</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href={`/${locale}/products`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Catalogue
              </Link>
              <Link
                href={`/${locale}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t('legal')}
              </Link>
              <Link
                href={`/${locale}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t('privacy')}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t('contact')}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 contact@sawei.com</p>
              <p>📱 WhatsApp: +86 xxx xxx xxxx</p>
              <p>🌍 China • France • Cameroun</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h4 className="font-semibold">Paiements</h4>
            <div className="flex flex-wrap gap-2 text-2xl">
              <span title="Stripe">💳</span>
              <span title="Bank Transfer">🏦</span>
              <span title="WeChat Pay">📱</span>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
