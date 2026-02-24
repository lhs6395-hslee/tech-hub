'use client';

import { useLocaleStore } from '@/stores/locale-store';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
  const { locale, toggleLocale } = useLocaleStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="gap-1.5 text-xs h-8"
    >
      <Languages className="h-3.5 w-3.5" />
      {locale === 'ko' ? 'EN' : '한국어'}
    </Button>
  );
}
