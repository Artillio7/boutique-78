import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FileQuestion, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="container py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">404</h1>
            <h2 className="text-xl font-semibold">{t('title')}</h2>
            <p className="text-muted-foreground">{t('message')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/" className="gap-2">
                <Home className="h-4 w-4" />
                {t('backHome')}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                {t('browseCatalogue')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
