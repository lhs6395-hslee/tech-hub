'use client';

import { useLocaleStore } from '@/stores/locale-store';
import { ko } from './locales/ko';
import { en } from './locales/en';

export type Locale = 'ko' | 'en';

const translations = { ko, en } as const;

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<typeof ko>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function useTranslation() {
  const locale = useLocaleStore((state) => state.locale);

  function t(key: string, params?: Record<string, string | number>): string {
    let value = getNestedValue(
      translations[locale] as unknown as Record<string, unknown>,
      key
    );

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(`{{${paramKey}}}`, String(paramValue));
      });
    }

    return value;
  }

  return { t, locale };
}
