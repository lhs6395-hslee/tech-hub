'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import DbSelector from '@/components/common/DbSelector';
import LanguageToggle from '@/components/common/LanguageToggle';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isDatabaseSection = pathname.startsWith('/database');
  const isKubernetesSection = pathname.startsWith('/kubernetes');

  const databaseNavLinks = [
    { href: '/database', label: t('nav.home') },
    { href: '/database/docs', label: t('nav.docs') },
    { href: '/database/learn', label: t('nav.learn') },
    { href: '/database/simulator', label: t('nav.simulator') },
  ];

  const kubernetesNavLinks = [
    { href: '/kubernetes', label: t('nav.home') },
    { href: '/kubernetes/docs', label: t('nav.docs') },
    { href: '/kubernetes/learn', label: t('nav.learn') },
  ];

  const navLinks = isDatabaseSection
    ? databaseNavLinks
    : isKubernetesSection
      ? kubernetesNavLinks
      : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Monitor className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm hidden sm:inline-block">
            {t('common.appName')}
          </span>
        </Link>

        {(isDatabaseSection || isKubernetesSection) && (
          <nav className="flex items-center gap-4 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors',
                  pathname === link.href
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {isDatabaseSection && <DbSelector />}
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
