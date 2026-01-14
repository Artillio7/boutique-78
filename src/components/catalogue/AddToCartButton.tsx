'use client';

import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  title: string;
  priceEur: number;
  image?: string;
  label: string;
}

export function AddToCartButton({
  productId,
  slug,
  title,
  priceEur,
  image,
  label,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart({ productId, slug, title, priceEur, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      size="lg"
      className="flex-1 gap-2"
      onClick={handleClick}
      variant={added ? 'secondary' : 'default'}
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          ✓
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          {label}
        </>
      )}
    </Button>
  );
}
