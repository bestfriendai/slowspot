# 🗑️ Cleanup Guide - Zarządzanie miejscem na buildach

## Przegląd

Projekt automatycznie zarządza starymi buildami, aby nie zapychać miejsca. Domyślnie zachowywane jest **5 ostatnich buildów**.

---

## 🤖 Automatyczne czyszczenie (GitHub Actions)

### Co jest czyszczone automatycznie?

**1. Workflow Runs (historia wykonań)**
- Zachowywane: 5 ostatnich runów
- Starsze niż: 7 dni są usuwane
- Automatycznie: Po każdym buildzie + co tydzień

**2. Artifacts (pliki binarne)**
- Zachowywane: 5 ostatnich
- Starsze niż: 7 dni są usuwane
- Automatycznie: Po każdym buildzie + co tydzień

**3. Cache**
- GitHub automatycznie usuwa cache starszy niż 7 dni
- Limit: 10GB całkowity rozmiar cache

---

## 📋 Workflow: Cleanup Old Builds

**Plik:** `.github/workflows/cleanup-old-builds.yml`

### Kiedy się uruchamia?

```yaml
# 1. Automatycznie po każdym buildzie
workflow_run:
  workflows: ["EAS Preview Build", "EAS Production Build", "EAS Update"]
  types: [completed]

# 2. Co tydzień (niedziela o północy)
schedule:
  - cron: '0 0 * * 0'

# 3. Ręcznie przez GitHub UI
workflow_dispatch
```

### Ręczne uruchomienie:

1. Idź do: https://github.com/Slow-Spot/app/actions
2. Wybierz: **"Cleanup Old Builds"**
3. Kliknij: **"Run workflow"**
4. Opcjonalnie zmień liczbę zachowanych buildów (domyślnie: 5)
5. Kliknij: **"Run workflow"**

---

## 🧹 Czyszczenie EAS Builds (Expo Cloud)

GitHub Actions **NIE czyszczą** buildów na serwerach Expo. Musisz to zrobić ręcznie.

### Opcja A: Automatyczny Script (POLECANE) ⭐

```bash
cd mobile
../scripts/cleanup-eas-builds.sh
```

Script:
- 📊 Pokaże listę wszystkich buildów
- 💬 Zapyta ile zachować (domyślnie: 5)
- 🗑️ Usunie starsze buildy
- ✅ Pokaże podsumowanie

### Opcja B: Ręcznie przez Dashboard

1. Otwórz: https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds
2. Kliknij na build który chcesz usunąć
3. Kliknij: **"Delete build"**
4. Potwierdź

### Opcja C: Przez CLI

```bash
cd mobile

# Lista buildów
eas build:list

# Usuń konkretny build
eas build:delete --id <BUILD_ID>
```

---

## 💾 Ile miejsca zajmują buildy?

### GitHub Actions
- **Workflow runs**: ~1-5 MB każdy (głównie logi)
- **Artifacts**: GitHub przechowuje tylko cache i logi (nie APK/IPA)
- **Cache**: ~500 MB dla node_modules
- **Limit**: 2000 minut/miesiąc (Free tier), 500 MB storage

### Expo Cloud
- **Android APK**: ~30-50 MB każdy
- **iOS IPA**: ~50-80 MB każdy
- **Limit**: Unlimited buildy, ale dobrą praktyką jest czyszczenie starych

---

## ⚙️ Konfiguracja - Zmiana liczby zachowanych buildów

### GitHub Actions (workflow runs + artifacts)

Edytuj `.github/workflows/cleanup-old-builds.yml`:

```yaml
keep_minimum_runs: 5  # Zmień na np. 10
```

Lub przez workflow_dispatch:
- Actions → Cleanup Old Builds → Run workflow
- Wpisz nową liczbę (np. 10)

### EAS Builds (Expo Cloud)

Przy każdym uruchomieniu script zapyta:
```bash
../scripts/cleanup-eas-builds.sh
# Prompt: How many recent builds to keep? [5]
# Wpisz: 10
```

---

## 📊 Monitoring miejsca

### GitHub Storage

```bash
# Sprawdź usage (wymaga GitHub CLI)
gh api /repos/Slow-Spot/app/actions/cache/usage
```

Lub przez UI:
- Settings → Actions → General
- Sekcja "Storage"

### Expo Storage

Dashboard:
https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds

Nie ma limitu, ale dobrze jest czyścić co ~30 buildów.

---

## 🚨 Troubleshooting

### "Failed to delete workflow run"
```bash
# Brak uprawnień - sprawdź GITHUB_TOKEN permissions
# W .github/workflows/cleanup-old-builds.yml dodaj:
permissions:
  actions: write
  contents: read
```

### "No builds found" (EAS cleanup)
```bash
# Sprawdź czy jesteś zalogowany
npx expo whoami

# Zaloguj się jeśli nie
npx expo login
```

### Cleanup działa zbyt często
```bash
# Wyłącz automatyczne czyszczenie po każdym buildzie
# Edytuj .github/workflows/cleanup-old-builds.yml
# Usuń sekcję "workflow_run:"
# Zostaw tylko "schedule:" (co tydzień)
```

---

## 📅 Rekomendowany harmonogram czyszczenia

### Dla małych projektów (< 10 buildów/tydzień)
- **GitHub**: Automatyczne (domyślne ustawienia)
- **Expo**: Raz w miesiącu

### Dla średnich projektów (10-50 buildów/tydzień)
- **GitHub**: Automatyczne (domyślne ustawienia)
- **Expo**: Raz w tygodniu

### Dla dużych projektów (> 50 buildów/tydzień)
- **GitHub**: Automatyczne + zmień na 3 ostatnie buildy
- **Expo**: 2 razy w tygodniu lub po każdym release

---

## 🔧 Szybkie komendy

```bash
# Cleanup EAS builds (interaktywny)
cd mobile && ../scripts/cleanup-eas-builds.sh

# Lista EAS builds
cd mobile && eas build:list --limit=20

# Usuń konkretny EAS build
cd mobile && eas build:delete --id <BUILD_ID>

# Sprawdź GitHub Actions storage (wymaga gh CLI)
gh api /repos/Slow-Spot/app/actions/cache/usage
```

---

## 💡 Best Practices

1. **Zachowuj przynajmniej 5 ostatnich buildów** - na wypadek rollbacku
2. **Czyść regularnie** - raz w tygodniu lub po dużych release'ach
3. **Tag production builds** - przed usunięciem upewnij się że production ma tag
4. **Archiwizuj ważne buildy** - pobierz APK/IPA lokalnie przed usunięciem z Expo
5. **Monitor storage** - sprawdzaj co miesiąc czy nie przekraczasz limitów

---

## 📖 Więcej informacji

- **GitHub Actions Storage**: https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions
- **EAS Build Limits**: https://docs.expo.dev/eas/
- **Główna dokumentacja**: `DEPLOYMENT_PIPELINES.md`

---

**Gotowe! Automatyczne czyszczenie zaoszczędzi miejsce i utrzyma porządek w buildach.** 🎉
