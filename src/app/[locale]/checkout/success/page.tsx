import { setRequestLocale } from 'next-intl/server';
import { SuccessClient } from '@/components/checkout/SuccessClient';

interface SuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const { locale } = await params;
  const { session_id } = await searchParams;
  setRequestLocale(locale);

  return (
    <div className="container py-16">
      <SuccessClient sessionId={session_id} />
    </div>
  );
}
