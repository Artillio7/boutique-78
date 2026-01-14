'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/lib/cart';

interface SuccessClientProps {
  sessionId?: string;
}

export function SuccessClient({ sessionId }: SuccessClientProps) {
  const t = useTranslations('checkout.success');
  const locale = useLocale();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-lg mx-auto text-center">
      <Card>
        <CardContent className="p-8 space-y-6">
          <CheckCircle className="h-16 w-16 mx-auto text-green-500" />

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground">{t('message')}</p>
          </div>

          {sessionId && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">{t('orderNumber')}</p>
              <p className="font-mono text-sm break-all">{sessionId}</p>
            </div>
          )}

          <Link href={`/${locale}/products`}>
            <Button size="lg" className="w-full">
              {t('backToCatalogue')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
