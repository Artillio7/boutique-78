import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Award, DollarSign, Headphones, Wrench, Paintbrush, Car, Gauge, Droplets, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const services = [
    { icon: Wrench, key: 'equipment' },
    { icon: Paintbrush, key: 'spray' },
    { icon: Car, key: 'tire' },
    { icon: Gauge, key: 'diagnostic' },
    { icon: Droplets, key: 'washing' },
    { icon: Settings, key: 'oil' },
  ];

  const whyUs = [
    { icon: Award, key: 'quality' },
    { icon: DollarSign, key: 'price' },
    { icon: Headphones, key: 'support' },
  ];

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Intro */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-lg text-center">{t('intro')}</p>
          </CardContent>
        </Card>

        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('mission.title')}</h2>
          <p className="text-muted-foreground">{t('mission.text')}</p>
        </section>

        <Separator className="my-8" />

        {/* Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('services.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card key={service.key}>
                <CardContent className="p-4 flex items-center gap-3">
                  <service.icon className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">{t(`services.items.${service.key}`)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Why Us */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{t('whyUs.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyUs.map((item) => (
              <Card key={item.key}>
                <CardContent className="p-6 text-center">
                  <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t(`whyUs.${item.key}`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`whyUs.${item.key}Desc`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
