# Slow Spot i18n System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐         ┌────────────────────────────┐   │
│  │ LanguageSwitcher│         │     page.tsx (Landing)     │   │
│  │   Component     │◄────────┤   Uses: useLanguage()      │   │
│  │  (Dropdown UI)  │         │   Gets: { t, locale }      │   │
│  └────────┬────────┘         └─────────────┬──────────────┘   │
│           │                                 │                   │
│           │ setLocale()                     │ t.hero.title      │
│           │                                 │                   │
└───────────┼─────────────────────────────────┼───────────────────┘
            │                                 │
            ▼                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     React Context Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              ┌────────────────────────────────┐                │
│              │     LanguageContext.tsx        │                │
│              ├────────────────────────────────┤                │
│              │  State:                        │                │
│              │  - locale: 'en' | 'pl' | ...   │                │
│              │  - translations: Translations  │                │
│              │  - isLoading: boolean          │                │
│              │                                │                │
│              │  Functions:                    │                │
│              │  - setLocale(locale)           │                │
│              │  - getInitialLocale()          │                │
│              │  - loadTranslation()           │                │
│              └────────┬───────────────────────┘                │
│                       │                                         │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Translation Loading Layer                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              ┌────────────────────────────────┐                │
│              │     translations.ts            │                │
│              ├────────────────────────────────┤                │
│              │  loadTranslation(locale)       │                │
│              │    ↓                           │                │
│              │  Dynamic import                │                │
│              │    import(`./locales/${locale}.json`) │         │
│              │    ↓                           │                │
│              │  Return: Translations object   │                │
│              │  Fallback: English if missing  │                │
│              └────────┬───────────────────────┘                │
│                       │                                         │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Translation Files Layer                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    locales/                                                     │
│    ├── en.json  ✅ Complete                                     │
│    ├── pl.json  ⏳ To be added                                  │
│    ├── de.json  ⏳ To be added                                  │
│    ├── es.json  ⏳ To be added                                  │
│    ├── fr.json  ⏳ To be added                                  │
│    ├── hi.json  ⏳ To be added                                  │
│    └── zh.json  ⏳ To be added                                  │
│                                                                 │
│    Each file structure:                                         │
│    {                                                            │
│      "hero": { ... },                                           │
│      "appPreview": { ... },                                     │
│      "features": { ... },                                       │
│      "testimonials": { ... },                                   │
│      "download": { ... },                                       │
│      "footer": { ... },                                         │
│      "languageSwitcher": { ... }                                │
│    }                                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Initial Load
```
User opens page
      │
      ▼
layout.tsx renders
      │
      ▼
LanguageProvider initializes
      │
      ├─► Check URL: ?lang=pl
      ├─► Check localStorage: locale='pl'
      ├─► Check browser: navigator.language
      └─► Default: 'en'
      │
      ▼
Load translation file
      │
      ├─► Try: import('./locales/pl.json')
      └─► Fallback: import('./locales/en.json')
      │
      ▼
Store in Context state
      │
      ▼
Render page.tsx with translations
```

### 2. Language Switch
```
User clicks language switcher
      │
      ▼
Select new language (e.g., 'de')
      │
      ▼
setLocale('de') called
      │
      ├─► Save to localStorage
      ├─► Update URL: ?lang=de
      ├─► Update <html lang="de">
      └─► Set isLoading = true
      │
      ▼
Load German translations
      │
      ├─► import('./locales/de.json')
      └─► Store in Context
      │
      ▼
Re-render page with German text
      │
      ▼
isLoading = false
```

### 3. Translation Usage
```
Component calls useLanguage()
      │
      ▼
Get { t, locale, setLocale } from Context
      │
      ▼
Access translation: t.hero.title
      │
      ▼
Return: "Discover Calm in the Chaos" (en)
    or: "Odkryj spokój w chaosie" (pl)
    or: [other language]
```

## Component Hierarchy

```
layout.tsx
  └── LanguageProvider
        ├── children (page.tsx)
        │     ├── LanguageSwitcher
        │     ├── Hero Section (uses t.hero.*)
        │     ├── App Preview (uses t.appPreview.*)
        │     ├── Features (uses t.features.*)
        │     ├── Testimonials (uses t.testimonials.*)
        │     ├── Download (uses t.download.*)
        │     └── Footer (uses t.footer.*)
        └── [other pages in future]
```

## State Management

### Context State
```typescript
interface LanguageContextType {
  locale: Locale;              // Current language code
  setLocale: (locale: Locale) => void;  // Change language
  t: Translations;             // Translation object
  isLoading: boolean;          // Loading state
}
```

### Persistence
```
┌──────────────┐
│  localStorage │ ─────► 'locale': 'pl'
└──────────────┘

┌──────────────┐
│  URL param   │ ─────► ?lang=pl
└──────────────┘

┌──────────────┐
│  HTML attr   │ ─────► <html lang="pl">
└──────────────┘
```

## Type Safety Flow

```typescript
// 1. Base translations (English)
import en from './locales/en.json';

// 2. Type inference
export type Translations = typeof en;

// 3. Type-safe access
const { t } = useLanguage();
t.hero.title        // ✅ Type: string
t.hero.unknown      // ❌ TypeScript error
t.features.cards.progressive.title  // ✅ Type: string
```

## Error Handling

```
Try to load translation file
      │
      ▼
  Success? ─────────► Use translation
      │
      │ No
      ▼
  Missing file
      │
      ▼
  Log warning to console
      │
      ▼
  Fallback to English (en.json)
      │
      ▼
  Page still works!
```

## Performance Optimizations

1. **Lazy Loading**: Translation files loaded only when needed
2. **Caching**: Once loaded, translations stay in memory
3. **No Re-renders**: Context updates don't re-render entire app
4. **Small Bundle**: Only selected language loaded, not all 7

## File Dependencies

```
page.tsx
  └── imports: './i18n'
        └── exports: { useLanguage, LanguageSwitcher }
              ├── LanguageContext.tsx
              │     └── uses: config.ts, translations.ts
              ├── LanguageSwitcher.tsx
              │     └── uses: LanguageContext.tsx, config.ts
              │     └── imports: languageSwitcher.css
              └── translations.ts
                    └── uses: config.ts
                    └── imports: locales/*.json
```

## CSS Architecture

```
languageSwitcher.css
  ├── .language-switcher (container)
  ├── .language-switcher-button (trigger)
  ├── .language-dropdown (menu)
  ├── .language-option (menu items)
  ├── @media (max-width: 768px) (responsive)
  └── @media (prefers-color-scheme: dark) (dark mode)
```

## Integration Points

### Current Integration
- ✅ Layout (LanguageProvider wrapper)
- ✅ Landing page (all text translated)

### Future Integration Possibilities
- [ ] /support page
- [ ] /privacy page
- [ ] /terms page
- [ ] Meta tags (SEO)
- [ ] Error pages
- [ ] Loading states

## Extension Points

### Adding New Language
1. Create `locales/[code].json`
2. Translation loads automatically
3. Appears in switcher automatically

### Adding New Section
1. Update `en.json` with new keys
2. Types update automatically
3. Use in components: `t.newSection.key`

### Adding New Page
1. Page already wrapped in LanguageProvider
2. Import `useLanguage` in new page
3. Access translations with `t.*`

## Security Considerations

1. **JSON Validation**: Files validated at load time
2. **XSS Protection**: React escapes all text by default
3. **No User Input**: Translations are static files
4. **Type Safety**: TypeScript prevents invalid access

## Browser Compatibility

```
Feature                  Support
──────────────────────────────────
localStorage            ✅ All modern browsers
Dynamic import          ✅ All modern browsers
React Context           ✅ React 16.3+
URL params              ✅ Universal
HTML lang attribute     ✅ Universal
```

## Future Architecture Considerations

### Possible Enhancements
1. **Server-Side Rendering**: Pre-render with correct language
2. **URL Routing**: `/pl`, `/de` instead of query params
3. **CDN Optimization**: Serve translations from CDN
4. **Compression**: Gzip/Brotli compression
5. **Incremental Loading**: Load sections as needed
6. **Translation Management**: Integration with translation platform

### Scalability
- System handles 7 languages easily
- Can scale to 50+ languages without changes
- Each language file ~10KB (minimal impact)
- No performance degradation with more languages

## Testing Architecture

```
┌──────────────────────────┐
│   Validation Tests       │
├──────────────────────────┤
│ ✅ JSON syntax valid      │
│ ✅ All keys present       │
│ ✅ No extra keys          │
│ ✅ Type consistency       │
└──────────────────────────┘

┌──────────────────────────┐
│   Functional Tests       │
├──────────────────────────┤
│ ⏳ Language switching     │
│ ⏳ Persistence            │
│ ⏳ Fallback to English    │
│ ⏳ URL parameter          │
└──────────────────────────┘

┌──────────────────────────┐
│   UI/UX Tests            │
├──────────────────────────┤
│ ⏳ Text overflow          │
│ ⏳ Mobile responsive      │
│ ⏳ Dark mode              │
│ ⏳ Accessibility          │
└──────────────────────────┘
```

---

**Last Updated**: November 2024
**Next.js Version**: 15.5.6
**Architecture Status**: ✅ Complete
