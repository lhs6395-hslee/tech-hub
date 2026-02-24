'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import DbSelector from '@/components/common/DbSelector';
import LanguageToggle from '@/components/common/LanguageToggle';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Database } from 'lucide-react';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600">
            <Database className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm hidden sm:inline-block">
            {t('common.appName')}
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/levels/beginner" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.levels')}
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <DbSelector />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
