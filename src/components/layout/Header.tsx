'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CurrencySelector } from '@/lib/currency';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            SAWEI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href={`/${locale}`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('home')}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('catalogue')}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('categories')}
          </Link>
        </nav>

        {/* Search, Currency, Locale */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 md:w-64"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Currency & Locale - Hidden on mobile */}
          <div className="hidden sm:flex items-center space-x-2">
            <CurrencySelector />
            <LocaleSwitcher />
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link
                  href={`/${locale}`}
                  className="text-lg font-medium hover:text-primary"
                >
                  {t('home')}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="text-lg font-medium hover:text-primary"
                >
                  {t('catalogue')}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="text-lg font-medium hover:text-primary"
                >
                  {t('categories')}
                </Link>

                <div className="pt-4 border-t">
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <Input
                      type="search"
                      placeholder={t('search')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <CurrencySelector />
                  <LocaleSwitcher />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
