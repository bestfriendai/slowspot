# Translation Template for Slow Spot Landing Page

## Quick Start Guide for Translators

### Your Task
Translate the Slow Spot meditation app landing page from English to [YOUR LANGUAGE].

### Instructions
1. Copy `/web/app/i18n/locales/en.json` to `/web/app/i18n/locales/[language-code].json`
2. Translate all text values while keeping the JSON structure intact
3. Test your translation by visiting the page with `?lang=[language-code]`

---

## Translation Checklist

- [ ] Hero section (title, subtitle, buttons)
- [ ] Statistics (active users, sessions, rating)
- [ ] App preview section
- [ ] All 6 feature cards
- [ ] All 3 testimonials
- [ ] Download section
- [ ] Footer (all columns and links)
- [ ] Language switcher labels

---

## Context for Translators

### About Slow Spot
Slow Spot is a meditation app that:
- Requires no account or registration
- Works offline
- Provides guided meditation sessions
- Tracks user progress and streaks
- Available in multiple languages
- Focuses on privacy and simplicity

### Tone and Style
- **Calming and peaceful**: Use gentle, soothing language
- **Inviting**: Make people feel welcome
- **Simple**: Avoid complex jargon
- **Positive**: Focus on benefits and transformation
- **Authentic**: Sound genuine, not marketing-heavy

### Key Messages to Preserve
1. **No registration required** - This is a key differentiator
2. **Works offline** - Important for user privacy
3. **Multi-language support** - Show inclusivity
4. **Progressive learning** - From beginner to advanced
5. **Privacy-focused** - No data collection

---

## Section-by-Section Translation Guide

### 1. Hero Section
**Purpose**: First impression, grab attention, communicate value proposition

**Key elements:**
- Badge: Welcoming, spiritual tone
- Title: Strong, memorable headline (4-7 words ideal)
- Subtitle: Explain the value proposition clearly
- Primary CTA: Action-oriented, encouraging
- Secondary CTA: Lower commitment, exploratory

**Example approach:**
- Keep it short and impactful
- Use active voice
- Make it feel personal

---

### 2. Stats Section
**Purpose**: Build credibility with social proof

**Numbers**:
- 50K+ Active Users
- 1M+ Sessions Completed
- 4.8★ App Rating

**Note**: You can keep numbers as-is or localize format (e.g., 50.000+ for some European languages)

---

### 3. App Preview Section
**Purpose**: Show what makes the app special

**Three key features:**
1. Instant start (no barriers)
2. Language support (speaks to them)
3. Offline mode (always accessible)

**Translation tips:**
- Keep descriptions concise
- Focus on user benefits, not technical details

---

### 4. Features Grid (6 cards)
**Purpose**: Detailed feature showcase

**Features to translate:**
1. **Progressive Learning**: From beginner to master
2. **Immersive Audio**: 3-layer sound design
3. **Track Your Growth**: Statistics and progress
4. **Daily Wisdom**: Inspirational quotes
5. **Cultural Traditions**: Different meditation styles
6. **Day & Night**: Dark mode support

**Translation tips:**
- Maintain parallel structure (all titles should be similar length/style)
- Keep descriptions to 1-2 sentences
- Emphasize benefits over features

---

### 5. Testimonials Section
**Purpose**: Real user stories for trust and relatability

**3 testimonials from:**
1. Sarah M. - United States (privacy focus)
2. Michael K. - Germany (habit building)
3. Anna W. - Poland (language support)

**Translation options:**
- **Option A**: Translate verbatim (keep names/locations as English)
- **Option B**: Localize names and locations for your culture (but keep them realistic)
- **Option C**: Translate text, keep names/locations as-is

**Recommended**: Option A or C for consistency

---

### 6. Download Section
**Purpose**: Clear call-to-action for app installation

**Elements:**
- Section title: Encouraging, action-oriented
- Subtitle: Reinforce value, mention platforms
- App Store: "Download on the" + "App Store"
- Google Play: "Get it on" + "Google Play"
- Note: Emphasize free and no commitment

**Note**: Some languages keep "App Store" and "Google Play" in English

---

### 7. Footer
**Purpose**: Navigation, legal links, brand reinforcement

**Sections:**
1. Brand tagline (poetic, memorable)
2. Product links (keep short)
3. Support links (helpful, accessible tone)
4. Legal links (formal but clear)
5. Copyright and closing tagline

**Translation tips:**
- Footer text should be consistent with main content tone
- Legal terms like "Privacy Policy" may have standard translations

---

## Cultural Adaptation Guidelines

### DO:
✅ Adapt idioms and expressions to your culture
✅ Use culturally appropriate metaphors
✅ Adjust formality level for your language (formal vs. informal "you")
✅ Consider local meditation terminology
✅ Use native number formatting if standard in your region

### DON'T:
❌ Change the meaning or emphasis of messages
❌ Add or remove content
❌ Change the brand name "Slow Spot"
❌ Alter the JSON structure
❌ Remove or change emojis without good reason
❌ Change URLs or email addresses

---

## Common Translation Challenges

### Challenge: English is more concise
**Solution**: Prioritize clarity over brevity. If your translation is longer, that's okay - just ensure it doesn't break the layout.

### Challenge: "You" - formal or informal?
**Decision**: Choose based on your language's norms for wellness/meditation apps. Generally, informal/friendly is preferred.

### Challenge: Meditation terminology
**Solution**: Use accepted meditation terms in your language. If there's no direct translation, explain the concept simply.

### Challenge: Cultural references
**Solution**: Adapt if something doesn't translate culturally, but preserve the intent.

---

## Quality Checklist

Before submitting your translation, verify:

- [ ] All text is translated (no English remains except brand names)
- [ ] JSON structure is intact (no missing or extra commas, brackets)
- [ ] JSON is valid (test with a JSON validator)
- [ ] Text lengths are reasonable (nothing too long)
- [ ] Tone is consistent throughout
- [ ] Language feels natural, not "translated"
- [ ] Grammar and spelling are correct
- [ ] No cultural insensitivities
- [ ] Numbers and symbols display correctly
- [ ] File is saved with UTF-8 encoding
- [ ] File name is correct: `[language-code].json`

---

## Testing Your Translation

1. Save your file in the correct location
2. Open the landing page
3. Add `?lang=[your-language-code]` to the URL
4. OR use the language switcher in top-right corner
5. Review every section carefully
6. Check on both desktop and mobile
7. Verify no text is cut off or overflowing
8. Test the language switcher functionality

---

## Need Help?

If you have questions about:
- **Meaning/context**: Refer back to this guide or ask the team
- **Technical issues**: Check the README.md file
- **Length concerns**: It's okay if text is longer, but flag if significantly different
- **Cultural sensitivity**: When in doubt, ask for guidance

---

## Example Translation (First Section)

### English (en.json)
```json
{
  "hero": {
    "badge": "🧘 Your Journey to Inner Peace",
    "title": "Discover Calm in the Chaos",
    "subtitle": "Experience meditation reimagined. No accounts, no barriers—just you and tranquility.",
    "ctaPrimary": "Start Meditating Free",
    "ctaSecondary": "Explore Features"
  }
}
```

### Polish (pl.json) - Example
```json
{
  "hero": {
    "badge": "🧘 Twoja podróż do wewnętrznego spokoju",
    "title": "Odkryj spokój w chaosie",
    "subtitle": "Doświadcz medytacji na nowo. Bez kont, bez barier—tylko Ty i ukojenie.",
    "ctaPrimary": "Zacznij medytować za darmo",
    "ctaSecondary": "Zobacz funkcje"
  }
}
```

---

## Contact

For questions, clarifications, or submission of completed translations, please contact the Slow Spot development team.

Thank you for helping make Slow Spot accessible to more people around the world!
