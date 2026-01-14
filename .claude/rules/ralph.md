# Ralph Configuration - SAWEI Store

## Project Context
- **Name**: sawei-store
- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Architecture**: Feature-based with App Router conventions
- **UI**: shadcn/ui + Framer Motion

## Quality Checks
```bash
# Level 1: Syntax
npm run build   # TypeScript check included

# Level 2: Build
npm run build   # Must pass

# Level 3: Dev test
npm run dev     # Start and verify
```

## Discovered Patterns

### Component Pattern
**Source**: `src/components/catalogue/ProductCard.tsx`
```typescript
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface ComponentProps {
  data: DataType;
  index?: number;
}

export function ComponentName({ data, index = 0 }: ComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Content */}
    </motion.div>
  );
}
```

### Page Pattern (Server Component)
**Source**: `src/app/[locale]/products/page.tsx`
```typescript
import { getTranslations, setRequestLocale } from 'next-intl/server';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('namespace');

  // Server-side data fetching
  const data = getData();

  return (
    <div className="container py-8">
      {/* Content */}
    </div>
  );
}
```

### Data Access Pattern
**Source**: `src/lib/data.ts`
```typescript
import catalogueData from '@/data/catalogue.json';

export function getAllItems(): Item[] {
  return catalogueData.items;
}

export function getItemBySlug(slug: string): Item | undefined {
  return catalogueData.items.find(i => i.slug === slug);
}

export function filterItems(options: FilterOptions): Item[] {
  let filtered = [...catalogueData.items];
  // Apply filters
  return filtered;
}
```

### Context Pattern
**Source**: `src/lib/currency.tsx`
```typescript
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ContextType {
  value: ValueType;
  setValue: (v: ValueType) => void;
}

const MyContext = createContext<ContextType | undefined>(undefined);

export function MyProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<ValueType>(defaultValue);

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('useMyContext must be within MyProvider');
  return context;
}
```

### API Route Pattern
**Source**: `src/app/api/stripe/checkout/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process request
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

## Conventions
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Aliases with @/ prefix
- **Async**: Server components are async, client components use hooks
- **Commits**: Conventional commits (feat, fix, chore)

## Code Constraints

### HARD LIMITS
- Maximum 500 lines per file
- Maximum 50 lines per function
- Maximum 3 levels of nesting
- If file exceeds 500 lines -> SPLIT into modules

### Modularity
- 1 file = 1 purpose
- Export only what's needed
- Use existing shadcn/ui components
- Mirror existing patterns ALWAYS

## Domain Terminology
- **Product**: Article in catalogue with multi-language title/description
- **Category**: Grouping of products (6 categories)
- **Pricing**: Multi-currency (EUR/CNY/XAF) with computed values
- **Locale**: Language code (fr, en, cn)

## File Structure
```
src/
├── app/
│   ├── [locale]/           # i18n routes
│   │   ├── page.tsx        # Home
│   │   ├── products/       # Catalogue
│   │   └── layout.tsx      # Layout with Header/Footer
│   └── api/                # API routes
├── components/
│   ├── catalogue/          # Product-related components
│   ├── layout/             # Header, Footer, etc.
│   └── ui/                 # shadcn components
├── data/                   # JSON data files
├── i18n/                   # Translations
├── lib/                    # Utilities, contexts
└── types/                  # TypeScript types
```
