import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactForm } from '@/components/contact/ContactForm';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  const contactInfo = [
    { icon: Mail, label: t('info.email'), value: 'contact@sawei.com' },
    { icon: Phone, label: t('info.phone'), value: '+86 123 456 7890' },
    { icon: MapPin, label: t('info.address'), value: 'Guangzhou, China' },
    { icon: Clock, label: t('info.hours'), value: t('info.hoursValue') },
  ];

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('info.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
