# Slow Spot Landing Page - Internationalization (i18n)

## Overview

This directory contains the internationalization system for the Slow Spot landing page. The system supports 7 languages: English (EN), Polish (PL), German (DE), Spanish (ES), French (FR), Hindi (HI), and Chinese (ZH).

## Directory Structure

```
i18n/
├── README.md                 # This file
├── config.ts                 # Language configuration
├── translations.ts           # Translation loading utilities
├── LanguageContext.tsx       # React context for language state
├── LanguageSwitcher.tsx      # Language switcher component
├── languageSwitcher.css      # Styles for language switcher
├── index.ts                  # Exports for easy imports
└── locales/                  # Translation files
    ├── en.json               # English translations (base)
    ├── pl.json               # Polish translations (to be added)
    ├── de.json               # German translations (to be added)
    ├── es.json               # Spanish translations (to be added)
    ├── fr.json               # French translations (to be added)
    ├── hi.json               # Hindi translations (to be added)
    └── zh.json               # Chinese translations (to be added)
```

## How It Works

1. **LanguageContext**: Manages the current language state and provides translations via React Context
2. **Language Detection**: Automatically detects language from:
   - URL parameter (`?lang=pl`)
   - localStorage (persists user choice)
   - Browser language settings
   - Falls back to English
3. **Dynamic Loading**: Translation files are loaded dynamically when needed
4. **Language Switcher**: A dropdown component in the top-right corner allows users to change language

## Adding a New Language Translation

To add translations for a new language (e.g., Polish):

### Step 1: Create the Translation File

1. Copy the English translation file as a template:
   ```bash
   cp locales/en.json locales/pl.json
   ```

2. Open `locales/pl.json` and translate all values while keeping the same structure

### Step 2: Translation File Structure

The translation file has the following sections:

```json
{
  "hero": {
    "badge": "...",           // Hero badge text
    "title": "...",           // Main heading
    "subtitle": "...",        // Subtitle paragraph
    "ctaPrimary": "...",      // Primary button text
    "ctaSecondary": "...",    // Secondary button text
    "stats": {                // Statistics section
      "users": { "number": "...", "label": "..." },
      "sessions": { "number": "...", "label": "..." },
      "rating": { "number": "...", "label": "..." }
    }
  },
  "appPreview": {
    "title": "...",
    "subtitle": "...",
    "features": {
      "instant": { "title": "...", "description": "..." },
      "language": { "title": "...", "description": "..." },
      "offline": { "title": "...", "description": "..." }
    },
    "demoText": "..."
  },
  "features": {
    "sectionTitle": "...",
    "sectionSubtitle": "...",
    "cards": {
      "progressive": { "title": "...", "description": "..." },
      "audio": { "title": "...", "description": "..." },
      "tracking": { "title": "...", "description": "..." },
      "wisdom": { "title": "...", "description": "..." },
      "cultural": { "title": "...", "description": "..." },
      "theme": { "title": "...", "description": "..." }
    }
  },
  "testimonials": {
    "sectionTitle": "...",
    "items": [
      {
        "stars": "★★★★★",
        "text": "...",
        "author": {
          "name": "...",
          "location": "...",
          "avatar": "..."
        }
      },
      // ... 2 more testimonials
    ]
  },
  "download": {
    "sectionTitle": "...",
    "sectionSubtitle": "...",
    "appStore": { "label": "...", "name": "..." },
    "googlePlay": { "label": "...", "name": "..." },
    "note": "..."
  },
  "footer": {
    "brand": { "name": "...", "tagline": "..." },
    "columns": {
      "product": {
        "title": "...",
        "links": { "features": "...", "download": "..." }
      },
      "support": {
        "title": "...",
        "links": { "help": "...", "contact": "..." }
      },
      "legal": {
        "title": "...",
        "links": { "privacy": "...", "terms": "..." }
      }
    },
    "bottom": {
      "copyright": "...",
      "tagline": "..."
    }
  },
  "languageSwitcher": {
    "label": "...",
    "languages": {
      "en": "English",
      "pl": "Polski",
      "de": "Deutsch",
      "es": "Español",
      "fr": "Français",
      "hi": "हिन्दी",
      "zh": "中文"
    }
  }
}
```

### Step 3: Important Translation Guidelines

1. **Keep the Structure**: DO NOT change the JSON structure or key names
2. **Translate Values Only**: Only translate the text values, not the keys
3. **Preserve Formatting**: Keep line breaks, special characters, and emojis where appropriate
4. **Numbers**: Statistics numbers (50K+, 1M+, 4.8★) can be localized if needed
5. **Brand Name**: "Slow Spot" should remain unchanged
6. **Testimonials**: You can localize author names and locations, but keep them realistic
7. **Stars**: Keep the star rating as "★★★★★"
8. **Language Names**: In the `languageSwitcher.languages` section, write each language name in its native script

### Step 4: Testing Your Translation

1. Save your translation file in `locales/[language-code].json`
2. The system will automatically detect and load it
3. Test by:
   - Adding `?lang=[language-code]` to the URL
   - Using the language switcher dropdown
   - Checking that all text appears correctly
   - Verifying that there are no missing translations

### Step 5: Special Considerations

- **Right-to-Left (RTL) Languages**: If adding Arabic, Hebrew, etc., additional CSS changes will be needed
- **Long Text**: Some languages may have longer text. Ensure it doesn't break the layout
- **Cultural Sensitivity**: Adapt content where culturally appropriate
- **Emojis**: Some emojis may not display well in all languages/regions

## Example: Polish Translation

Here's an example of translating a section to Polish:

**English (en.json):**
```json
{
  "hero": {
    "title": "Discover Calm in the Chaos",
    "subtitle": "Experience meditation reimagined."
  }
}
```

**Polish (pl.json):**
```json
{
  "hero": {
    "title": "Odkryj spokój w chaosie",
    "subtitle": "Doświadcz medytacji na nowo."
  }
}
```

## Language Codes

Use these ISO 639-1 language codes:

- `en` - English
- `pl` - Polish (Polski)
- `de` - German (Deutsch)
- `es` - Spanish (Español)
- `fr` - French (Français)
- `hi` - Hindi (हिन्दी)
- `zh` - Chinese (中文)

## Usage in Code

If you need to use translations in other components:

```tsx
import { useLanguage } from './i18n';

function MyComponent() {
  const { t, locale, setLocale } = useLanguage();

  return (
    <div>
      <h1>{t.hero.title}</h1>
      <p>Current language: {locale}</p>
    </div>
  );
}
```

## Troubleshooting

**Translation not loading:**
- Check that the file name matches the language code exactly
- Verify the JSON is valid (use a JSON validator)
- Check browser console for errors

**Missing translations:**
- Ensure all keys from `en.json` are present in your translation file
- The system will fall back to English for missing keys

**Layout issues:**
- Some languages require more space - test on mobile and desktop
- Adjust CSS if needed for specific language layouts

## Need Help?

If you encounter issues or need clarification on translations:
1. Check the `en.json` file for the complete structure
2. Review existing translations for reference
3. Test your changes in the browser
4. Contact the development team for technical issues
