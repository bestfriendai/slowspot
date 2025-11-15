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

```tsx
import theme from '../theme';

// Accent colors
theme.colors.accent.blue[600]     // Primary blue
theme.colors.accent.purple[600]   // Secondary purple
theme.colors.accent.green[600]    // Success green
theme.colors.accent.red[600]      // Error red

// Neutrals
theme.colors.neutral.white
theme.colors.neutral.gray[100]
theme.colors.neutral.gray[500]

// Text
theme.colors.text.primary         // Główny tekst
theme.colors.text.secondary       // Drugorzędny tekst
theme.colors.text.tertiary        // Trzecioplanowy tekst
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

Utworzono: 2025-01-15
Ostatnia aktualizacja: 2025-01-15
