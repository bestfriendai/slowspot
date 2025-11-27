# Quick Start Guide for AI Agents Adding Translations

## TL;DR
You need to create translation files for: PL, DE, ES, FR, HI, ZH

## Step-by-Step Instructions

### 1. Create Your Translation File

Copy the English template:
```bash
cp /Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/web/app/i18n/locales/en.json \
   /Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/web/app/i18n/locales/[LANG_CODE].json
```

Language codes:
- `pl` = Polish (Polski)
- `de` = German (Deutsch)
- `es` = Spanish (Español)
- `fr` = French (Français)
- `hi` = Hindi (हिन्दी)
- `zh` = Chinese (中文)

### 2. Translate the File

**IMPORTANT RULES:**
1. ✅ DO translate all text values
2. ❌ DON'T change JSON structure or keys
3. ❌ DON'T translate "Slow Spot" (brand name)
4. ✅ DO keep emojis (or adapt culturally)
5. ✅ DO maintain the same tone (calm, welcoming)
6. ❌ DON'T remove or add fields

### 3. JSON Structure Overview

```json
{
  "hero": {
    "badge": "Text with emoji",
    "title": "Main headline",
    "subtitle": "Longer description",
    "ctaPrimary": "Button text",
    "ctaSecondary": "Button text",
    "stats": {
      "users": { "number": "50K+", "label": "Label" },
      "sessions": { "number": "1M+", "label": "Label" },
      "rating": { "number": "4.8★", "label": "Label" }
    }
  },
  "appPreview": {
    "title": "Section title",
    "subtitle": "Section description",
    "features": {
      "instant": { "title": "...", "description": "..." },
      "language": { "title": "...", "description": "..." },
      "offline": { "title": "...", "description": "..." }
    },
    "demoText": "Breathe In..."
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
    "items": [ /* 3 testimonials with stars, text, author */ ]
  },
  "download": {
    "sectionTitle": "...",
    "sectionSubtitle": "...",
    "appStore": { "label": "...", "name": "..." },
    "googlePlay": { "label": "...", "name": "..." },
    "note": "..."
  },
  "footer": {
    "brand": { "name": "Slow Spot", "tagline": "..." },
    "columns": { /* product, support, legal sections */ },
    "bottom": { "copyright": "...", "tagline": "..." }
  },
  "languageSwitcher": {
    "label": "Language",
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

### 4. Key Translation Guidelines

#### Tone & Style
- **Calming**: Use peaceful, soothing language
- **Simple**: No complex jargon
- **Welcoming**: Make users feel comfortable
- **Authentic**: Natural, not corporate

#### Context
- Slow Spot is a meditation app
- No registration/account required (key feature!)
- Works offline (important!)
- Privacy-focused
- Multiple languages supported
- Progressive learning (beginner → advanced)

#### Special Notes
- **Stats numbers**: Can keep as-is or localize format
- **"App Store" / "Google Play"**: Often kept in English, but translate if standard in your language
- **Testimonials**: Keep author names/locations or adapt for your culture
- **Emojis**: Keep or adapt (🧘, ⚡, 🌐, 📴, etc.)

### 5. Validation Checklist

Before saving:
- [ ] All English text is translated
- [ ] JSON structure is unchanged
- [ ] No syntax errors (commas, brackets, quotes)
- [ ] Brand name "Slow Spot" is unchanged
- [ ] Language feels natural (not literal translation)
- [ ] Tone is consistent (calm, welcoming)
- [ ] File saved as UTF-8 encoding
- [ ] File named correctly: `[lang-code].json`

### 6. Test Your Translation

Validate JSON syntax:
```bash
node -e "const fs = require('fs'); JSON.parse(fs.readFileSync('/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/web/app/i18n/locales/[LANG].json', 'utf8')); console.log('✅ Valid!');"
```

The translation will automatically appear in the language switcher dropdown!

## Example Translation (Polish)

### English (en.json)
```json
{
  "hero": {
    "badge": "🧘 Your Journey to Inner Peace",
    "title": "Discover Calm in the Chaos"
  }
}
```

### Polish (pl.json)
```json
{
  "hero": {
    "badge": "🧘 Twoja podróż do wewnętrznego spokoju",
    "title": "Odkryj spokój w chaosie"
  }
}
```

## Common Mistakes to Avoid

❌ **Changing structure:**
```json
// WRONG - don't add/remove fields
{
  "hero": {
    "badge": "...",
    "newField": "..."  // DON'T ADD
  }
}
```

❌ **Translating keys:**
```json
// WRONG - don't translate key names
{
  "héroe": {  // Should be "hero"
    "insignia": "..."  // Should be "badge"
  }
}
```

❌ **Breaking JSON:**
```json
// WRONG - missing comma
{
  "hero": {
    "badge": "..."
    "title": "..."  // Missing comma!
  }
}
```

✅ **Correct format:**
```json
{
  "hero": {
    "badge": "Translated text here",
    "title": "Another translated text"
  }
}
```

## Priority Order for Translation

If you can only do some languages:

1. **High Priority**: PL (Polish), DE (German), ES (Spanish)
2. **Medium Priority**: FR (French)
3. **Complex**: HI (Hindi), ZH (Chinese) - may need special characters

## File Paths Reference

- **English template**: `/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/web/app/i18n/locales/en.json`
- **Save your translation**: `/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/web/app/i18n/locales/[LANG_CODE].json`

## Questions?

Read the detailed guides:
- **TRANSLATION_TEMPLATE.md** - Comprehensive translator guide
- **README.md** - Technical documentation
- **IMPLEMENTATION_SUMMARY.md** - System overview

## That's It!

Your translation will automatically work once you save the file. The system will:
1. Detect the new language file
2. Add it to the language switcher
3. Load it when users select that language
4. Fall back to English for any missing keys

Good luck! 🚀
