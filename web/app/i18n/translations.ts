import { Locale } from './config';

// Import all translation files
import en from './locales/en.json';

// Translation type based on English translations
export type Translations = typeof en;

// Store for translations
const translations: Partial<Record<Locale, Translations>> = {
  en,
};

// Load translation function
export async function loadTranslation(locale: Locale): Promise<Translations> {
  if (translations[locale]) {
    return translations[locale]!;
  }

  try {
    // Dynamically import the translation file
    const translation = await import(`./locales/${locale}.json`);
    translations[locale] = translation.default;
    return translation.default;
  } catch (error) {
    console.warn(`Translation for ${locale} not found, falling back to English`);
    return en;
  }
}

// Get translation synchronously (for already loaded translations)
export function getTranslation(locale: Locale): Translations {
  return translations[locale] || en;
}

// Helper to get nested translation values
export function getNestedTranslation(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? '';
}
