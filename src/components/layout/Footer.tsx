'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Facebook, Linkedin, MessageCircle } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  const quickLinks = [
    { href: `/${locale}/products`, label: tNav('catalogue') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: tNav('contact') },
  ];

  const legalLinks = [
    { href: `/${locale}`, label: t('legal') },
    { href: `/${locale}`, label: t('privacy') },
    { href: `/${locale}`, label: t('terms') },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Social */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SAWEI
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('tagline')}
            </p>
            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="WeChat"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t('links')}</h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t('contact')}</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a
                href="mailto:contact@sawei.com"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>contact@sawei.com</span>
              </a>
              <a
                href="https://wa.me/86123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+86 123 456 789</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>China • France • Cameroun</span>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t('legalTitle')}</h4>
            <nav className="flex flex-col space-y-2">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
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
