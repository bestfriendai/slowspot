# Slow Spot Design System

Spójny system projektowy dla aplikacji Slow Spot - medytacja i mindfulness.

## 🎨 Filozofia Designu

- **Spokój** - Łagodne kolory, delikatne gradienty
- **Przejrzystość** - Czytelna typografia, odpowiednie odstępy
- **Spójność** - Te same komponenty wszędzie
- **Dostępność** - Wysoki kontrast, czytelne czcionki

---

## 📦 Komponenty

### Badge

Małe etykiety do oznaczania i kategoryzacji.

```tsx
import { Badge } from '../components';

// Podstawowe użycie
<Badge label="Relaksacja" variant="primary" size="sm" />

// Z zaznaczeniem (selected state)
<Badge label="Spokój" variant="primary" size="sm" selected />

// Tylko obramowanie
<Badge label="Energia" variant="success" size="sm" outlined />

// Z możliwością usunięcia
<Badge label="Tag" variant="default" removable onRemove={() => {}} />
```

**Warianty:**
- `default` - szary
- `primary` - niebieski
- `secondary` - fioletowy
- `success` - zielony
- `warning` - żółty
- `error` - czerwony
- `info` - turkusowy

**Rozmiary:**
- `sm` - mały (24px)
- `md` - średni (28px)
- `lg` - duży (32px)

**Props:**
- `label: string` - tekst badge'a
- `variant?: BadgeVariant` - wariant kolorystyczny
- `size?: BadgeSize` - rozmiar
- `selected?: boolean` - czy zaznaczony
- `outlined?: boolean` - czy tylko obramowanie
- `removable?: boolean` - czy można usunąć
- `onRemove?: () => void` - callback przy usunięciu

---

### Button

Uniwersalny przycisk z różnymi wariantami.

```tsx
import { Button } from '../components';

// Primary - główne akcje
<Button title="Zapisz" variant="primary" onPress={() => {}} />

// Secondary - drugoplanowe akcje
<Button title="Anuluj" variant="secondary" onPress={() => {}} />

// Outline - minimalistyczny
<Button title="Więcej" variant="outline" onPress={() => {}} />

// Ghost - transparentny
<Button title="Pomiń" variant="ghost" onPress={() => {}} />

// Destructive - akcje usuwania
<Button title="Usuń" variant="destructive" onPress={() => {}} />

// Z ikonami
<Button
  title="Dalej"
  variant="primary"
  rightIcon={<Icon name="arrow-forward" />}
  onPress={() => {}}
/>
```

**Warianty:**
- `primary` - niebieski solid
- `secondary` - szary solid
- `outline` - przezroczysty z borderem
- `ghost` - przezroczysty bez bordera
- `destructive` - czerwony solid

**Rozmiary:**
- `sm` - mały (36px)
- `md` - średni (44px)
- `lg` - duży (52px)

**Props:**
- `title: string` - tekst przycisku
- `onPress: () => void` - callback
- `variant?: ButtonVariant` - wariant
- `size?: ButtonSize` - rozmiar
- `disabled?: boolean` - czy wyłączony
- `loading?: boolean` - loading state
- `fullWidth?: boolean` - pełna szerokość
- `leftIcon?: ReactNode` - ikona po lewej
- `rightIcon?: ReactNode` - ikona po prawej

---

### GradientButton

Przycisk z gradientem - dla głównych CTA.

```tsx
import { GradientButton } from '../components';
import { gradients } from '../theme';

<GradientButton
  title="Rozpocznij Medytację"
  gradient={gradients.button.primary}
  onPress={() => {}}
  size="lg"
/>
```

**Dostępne gradienty:**
- `gradients.button.primary` - niebieski
- `gradients.button.secondary` - fioletowy
- `gradients.button.accent` - teal

**Rozmiary:**
- `sm`, `md`, `lg` - jak w Button

---

### GradientCard

Karta z gradientowym tłem.

```tsx
import { GradientCard } from '../components';
import { gradients } from '../theme';

<GradientCard gradient={gradients.card.lightCard}>
  <Text>Zawartość karty</Text>
</GradientCard>
```

**Dostępne gradienty:**
- `gradients.card.lightCard` - jasna karta
- `gradients.card.blueCard` - niebieska
- `gradients.card.purpleCard` - fioletowa
- `gradients.card.greenCard` - zielona

---

## 🎯 Kiedy używać którego komponentu?

### Badge
✅ **Używaj do:**
- Tagów kategorii (Relaksacja, Spokój, etc.)
- Statusów (Aktywny, Zakończony)
- Culture tags (Buddhist, Zen, Sufi)
- Filtrów

❌ **Nie używaj do:**
- Akcji (użyj Button)
- Długich tekstów (max 2-3 słowa)

### Button vs GradientButton

**Button** - używaj do:
- Drugorzędnych akcji (Anuluj, Wstecz)
- Akcji destrukcyjnych (Usuń)
- List akcji
- Nawigacji

**GradientButton** - używaj do:
- Głównego CTA na ekranie
- "Start" / "Rozpocznij"
- Ważnych akcji (Zapisz, Potwierdź)

---

## 📐 Spacing & Layout

```tsx
// Standardowe odstępy z theme
import theme from '../theme';

// Małe odstępy
marginBottom: theme.spacing.xs    // 4px
marginBottom: theme.spacing.sm    // 8px

// Średnie odstępy
marginBottom: theme.spacing.md    // 16px
marginBottom: theme.spacing.lg    // 24px

// Duże odstępy
marginBottom: theme.spacing.xl    // 32px
marginBottom: theme.spacing.xxl   // 48px
```

---

## 🎨 Kolory

**WAŻNE**: ZAWSZE używaj kolorów z `theme.colors` - NIGDY hardcoded hex!

```tsx
import theme from '../theme';

// ✅ Accent colors - WCAG AA compliant
theme.colors.accent.blue[50]      // #F0F9FF - Very light
theme.colors.accent.blue[100]     // #EBF5FF - Light backgrounds
theme.colors.accent.blue[200]     // #D6EBFF - Borders
theme.colors.accent.blue[500]     // #2B8FE8 - Interactive
theme.colors.accent.blue[600]     // #1976D2 - Primary (UŻYJ DO TEKSTU)
theme.colors.accent.blue[700]     // #1565C0 - Dark text

theme.colors.accent.purple[...]   // Fioletowy (warianty jak blue)
theme.colors.accent.green[...]    // Zielony (success)
theme.colors.accent.red[...]      // Czerwony (error)
theme.colors.accent.teal[...]     // Turkusowy (info)

// ✅ Neutrals
theme.colors.neutral.white        // #FFFFFF
theme.colors.neutral.gray[100]    // #F2F2F7 - Jasne tła
theme.colors.neutral.gray[300]    // #D1D1D6 - Borders
theme.colors.neutral.gray[500]    // #8E8E93 - Disabled text
theme.colors.neutral.gray[700]    // #48484A - Ciemny tekst
theme.colors.neutral.charcoal[200]// #1C1C1E - Bardzo ciemny

// ✅ Text colors - używaj ZAWSZE
theme.colors.text.primary         // Główny tekst (dark)
theme.colors.text.secondary       // Drugorzędny tekst (gray)
theme.colors.text.tertiary        // Trzecioplanowy (lighter gray)
theme.colors.text.disabled        // Wyłączony (very light)
theme.colors.text.inverse         // Biały (na ciemnym tle)

// ✅ Border colors
theme.colors.border.light         // Jasny border
theme.colors.border.default       // Standardowy border
theme.colors.border.dark          // Ciemny border
```

### Paleta kolorów dla ekranów

```tsx
// Delikatny błękitny - główny kolor aplikacji
gradients.primary.subtleBlue      // Od #EBF5FF do white - spokojny, uniwersalny

// Dla różnych sekcji (jeśli potrzebne)
gradients.primary.calmMint        // Miętowy - relaksacja
gradients.primary.softLavender    // Lawendowy - spokój
```

---

## ✨ Przykłady użycia

### Ekran z tagami

```tsx
import { Badge, Button, GradientCard } from '../components';
import { gradients } from '../theme';

const TagScreen = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <GradientCard gradient={gradients.card.lightCard}>
      <Text>Wybierz tagi:</Text>

      <View style={styles.tagsContainer}>
        {tags.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => toggleTag(tag)}
          >
            <Badge
              label={tag}
              variant="primary"
              size="sm"
              selected={selected.includes(tag)}
              outlined={!selected.includes(tag)}
            />
          </Pressable>
        ))}
      </View>

      <Button
        title="Zapisz"
        variant="primary"
        fullWidth
        onPress={handleSave}
      />
    </GradientCard>
  );
};
```

### Formularz z akcjami

```tsx
import { Button, GradientButton } from '../components';
import { gradients } from '../theme';

const Form = () => (
  <View>
    {/* Główna akcja */}
    <GradientButton
      title="Zapisz zmiany"
      gradient={gradients.button.primary}
      size="lg"
      onPress={handleSave}
    />

    {/* Akcje drugorzędne */}
    <View style={styles.secondaryActions}>
      <Button
        title="Anuluj"
        variant="outline"
        onPress={handleCancel}
      />
      <Button
        title="Usuń"
        variant="destructive"
        onPress={handleDelete}
      />
    </View>
  </View>
);
```

---

## 🚀 Best Practices

1. **Spójność**: Używaj tych samych komponentów w całej aplikacji
2. **Hierarchia**: GradientButton tylko dla głównego CTA
3. **Czytelność**: Badge max 2-3 słowa
4. **Dostępność**: Odpowiedni kontrast kolorów
5. **Spacing**: Używaj theme.spacing, nie hardcoded wartości
6. **Importy**: Importuj z `../components` zamiast bezpośrednich ścieżek

---

## 🔄 Migracja z old styles

### Przed:
```tsx
<View style={styles.customBadge}>
  <Text style={styles.customBadgeText}>Tag</Text>
</View>
```

### Po:
```tsx
<Badge label="Tag" variant="primary" size="sm" />
```

---

## 📝 Checklist dla nowych ekranów

- [ ] Używam Badge zamiast custom badge styles
- [ ] Używam Button/GradientButton zamiast custom Pressable
- [ ] Używam GradientCard dla sekcji
- [ ] Używam theme.spacing zamiast hardcoded px
- [ ] Używam theme.colors zamiast hex colors
- [ ] Jeden GradientButton per ekran (główny CTA)
- [ ] Spójne rozmiary (sm/md/lg)

---

## 🎨 Ilustracje i grafiki (Opensource)

**Zasada**: Używaj spójnych, profesjonalnych ilustracji z darmowych źródeł.

### Rekomendowane źródła:

1. **unDraw** (https://undraw.co/)
   - Najlepsze do medytacji/wellness
   - Customizable colors - ustaw na #1976D2 (theme.colors.accent.blue[600])
   - SVG - łatwe skalowanie
   - ```bash
     # Przykładowe ilustracje:
     - Meditation illustration
     - Mindfulness illustration
     - Breathing exercise
     - Yoga poses
     ```

2. **Humaaans** (https://www.humaaans.com/)
   - Ilustracje ludzi w różnych pozycjach
   - Mix & match części ciała
   - Świetne do onboardingu

3. **Storyset** (https://storyset.com/)
   - Animowane i statyczne ilustracje
   - Kategoria "Health & Wellness"
   - Edytowalne kolory

4. **Illustrations.co** (https://illlustrations.co/)
   - 100 darmowych ilustracji
   - Minimalistyczny styl
   - Pasują do spokojnego designu

5. **Lukasz Adam Free Illustrations** (https://lukaszadam.com/illustrations)
   - Darmowe ilustracje o medytacji
   - PNG i SVG

### Jak używać ilustracji:

```tsx
import { Image } from 'react-native';

// SVG (preferowane)
import MeditationSvg from '../assets/illustrations/meditation.svg';

<MeditationSvg width={200} height={200} />

// PNG fallback
<Image
  source={require('../assets/illustrations/meditation.png')}
  style={{ width: 200, height: 200 }}
  resizeMode="contain"
/>
```

### Wytyczne dla ilustracji:

- ✅ Ustaw kolor główny na #1976D2 (theme.colors.accent.blue[600])
- ✅ Użyj SVG gdy możliwe (lepsze skalowanie)
- ✅ Spójny styl we całej aplikacji (wybierz JEDEN zestaw)
- ✅ Umieść w `assets/illustrations/`
- ❌ Nie mieszaj różnych stylów ilustracji
- ❌ Nie używaj zbyt wielu ilustracji (minimalizm!)

---

## 🎯 Typography System

**ZAWSZE używaj z theme.typography**

```tsx
import theme from '../theme';

// ✅ Font sizes
theme.typography.fontSizes.xs      // 12px - małe etykiety
theme.typography.fontSizes.sm      // 14px - body text small
theme.typography.fontSizes.md      // 16px - body text (DEFAULT)
theme.typography.fontSizes.lg      // 18px - subheadings
theme.typography.fontSizes.xl      // 20px - headings
theme.typography.fontSizes.xxl     // 24px - big headings
theme.typography.fontSizes.xxxl    // 32px - hero text
theme.typography.fontSizes.display // 40px - display text
theme.typography.fontSizes.hero    // 48px - hero sections

// ✅ Font weights
theme.typography.fontWeights.light      // '300'
theme.typography.fontWeights.regular    // '400' (DEFAULT)
theme.typography.fontWeights.medium     // '500' - labels
theme.typography.fontWeights.semiBold   // '600' - headings
theme.typography.fontWeights.bold       // '700' - emphasis
theme.typography.fontWeights.extraBold  // '800' - hero

// ✅ Line heights
theme.typography.lineHeights.tight    // 1.2 - headings
theme.typography.lineHeights.normal   // 1.5 - body (DEFAULT)
theme.typography.lineHeights.relaxed  // 1.75 - comfortable reading
theme.typography.lineHeights.loose    // 2 - very spacious
```

---

## ⚡ Animations & Transitions

**ZAWSZE używaj z theme.durations i theme.easings**

```tsx
import theme from '../theme';
import { Animated } from 'react-native';

// ✅ Durations
theme.durations.fast      // 150ms - micro-interactions
theme.durations.normal    // 300ms - standard (DEFAULT)
theme.durations.slow      // 500ms - emphasis
theme.durations.verySlow  // 1000ms - meditation, breathing

// ✅ Example breathing animation
const breathingDuration = theme.durations.verySlow * 4; // 4 seconds

// ✅ Opacity scale
theme.opacity.disabled    // 0.4
theme.opacity.muted       // 0.6
theme.opacity.subtle      // 0.7
theme.opacity.normal      // 1.0
```

---

## 🧘 Meditation Screen Guidelines

### Animacja oddychania

```tsx
// ✅ ZAWSZE widoczna, płynna animacja
// ✅ 4 sekundy wdech, 4 sekundy wydech
// ✅ Scale: 0.7 → 1.3 (60% różnicy)
// ✅ Opacity: 0.4 → 0.8 (40% różnicy)

const breathingScale = useSharedValue(0.7);
const breathingOpacity = useSharedValue(0.4);

breathingScale.value = withRepeat(
  withSequence(
    withTiming(1.3, { duration: 4000 }),  // Inhale
    withTiming(0.7, { duration: 4000 })   // Exhale
  ),
  -1 // infinite
);
```

### Co pokazywać na ekranie medytacji:

- ✅ Instrukcje oddychania: "Wdech" / "Wydech"
- ✅ Tekst "W TRAKCIE" (nie pokazuj %)
- ✅ Duże, widoczne koło oddechowe
- ✅ Przyciski: "Pauza" i "Zakończ"
- ❌ NIE pokazuj % postępu (stresuje użytkownika!)
- ❌ NIE pokazuj dokładnego czasu pozostałego
- ❌ NIE używaj jasnych kolorów tekstu na jasnym tle

---

## 🎨 Spójność designu - REGUŁY

### 1. Gradienty tła

```tsx
// ✅ ZAWSZE używaj tych samych gradientów
import { gradients } from '../theme';

// Ekran przygotowania & medytacji
<GradientBackground gradient={gradients.primary.subtleBlue} />

// Tylko jeśli NAPRAWDĘ potrzebne:
<GradientBackground gradient={gradients.primary.calmMint} />   // Relaksacja
<GradientBackground gradient={gradients.primary.softLavender} /> // Spokój
```

### 2. Przyciski

```tsx
// ✅ Główny CTA (jeden na ekran!)
<GradientButton
  title="Rozpocznij"
  gradient={gradients.button.primary}
/>

// ✅ Drugorzędne akcje
<Button title="Wstecz" variant="outline" />
<Button title="Anuluj" variant="secondary" />

// ❌ NIGDY nie używaj random kolorów!
```

### 3. Spacing

```tsx
// ✅ ZAWSZE używaj theme.spacing
padding: theme.spacing.md        // 16px
marginBottom: theme.spacing.lg   // 24px
gap: theme.spacing.sm            // 8px

// ❌ NIGDY hardcoded
padding: 16  // ❌ ZŁE!
```

---

## ✅ Checklist przed mergem

- [ ] Używam `theme.colors` zamiast hex
- [ ] Używam `theme.spacing` zamiast px
- [ ] Używam `theme.typography` dla czcionek
- [ ] Używam `gradients` dla tła
- [ ] Ilustracje z opensource (unDraw/Humaaans)
- [ ] Ilustracje mają kolor #1976D2
- [ ] Tylko JEDEN GradientButton na ekran
- [ ] Animacja oddychania widoczna (scale 0.7-1.3)
- [ ] Brak % na ekranie medytacji
- [ ] Dobry kontrast tekstu (WCAG AA)
- [ ] Spójny styl z resztą app

---

## 📚 Dodatkowe zasoby

- [unDraw](https://undraw.co/) - Illustrations
- [Humaaans](https://www.humaaans.com/) - People illustrations
- [Coolors](https://coolors.co/) - Paleta kolorów
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Test kontrastu

---

Utworzono: 2025-01-15
Ostatnia aktualizacja: 2025-01-15
Wersja: 2.0 - Kompletny system projektowy
