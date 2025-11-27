export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'pl', 'de', 'es', 'fr', 'hi', 'zh'],
} as const;

export type Locale = (typeof i18nConfig.locales)[number];

export const languageNames: Record<Locale, string> = {
  en: 'English',
  pl: 'Polski',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  hi: 'हिन्दी',
  zh: '中文',
};
