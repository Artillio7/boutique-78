'use client';

import { useTranslations } from 'next-intl';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

// WhatsApp number - configure in env or hardcode for MVP
const WHATSAPP_NUMBER = '33600000000';

interface WhatsAppButtonProps {
  productTitle: string;
  productUrl?: string;
  floating?: boolean;
}

export function WhatsAppButton({ productTitle, productUrl, floating = false }: WhatsAppButtonProps) {
  const t = useTranslations('whatsapp');

  const message = t('message', { product: productTitle });
  const fullMessage = productUrl ? `${message}\n\n${productUrl}` : message;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;

  if (floating) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
        aria-label={t('contact')}
      >
        <Phone className="h-6 w-6" />
      </a>
    );
  }

  return (
    <Button asChild variant="outline" className="gap-2 border-green-500 text-green-600 hover:bg-green-50">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Phone className="h-4 w-4" />
        WhatsApp
      </a>
    </Button>
  );
}
