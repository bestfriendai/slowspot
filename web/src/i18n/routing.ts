import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'pl', 'de', 'es', 'fr', 'hi', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const languageNames: Record<Locale, string> = {
  en: 'English',
  pl: 'Polski',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  hi: 'हिन्दी',
  zh: '中文',
};

export const flags: Record<Locale, string> = {
  en: '🇬🇧',
  pl: '🇵🇱',
  de: '🇩🇪',
  es: '🇪🇸',
  fr: '🇫🇷',
  hi: '🇮🇳',
  zh: '🇨🇳',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always', // Always show locale in URL for SEO
});
