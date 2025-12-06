# GitHub Actions Workflows

Automated CI/CD pipelines for Slow Spot.

## Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `release.yml` | Push to `main` | Semantic release & versioning |
| `eas-update.yml` | Push to `develop`/`test` | OTA updates for Expo Go (~2 min) |
| `eas-preview-build.yml` | Push to feature branches | Preview builds for testing (~15 min) |
| `eas-production-build.yml` | Tag `v*.*.*` | Production builds for stores |
| `web-deploy.yml` | Push to `main` | Deploy landing page to Vercel |
| `cleanup-old-builds.yml` | Weekly | Clean up old EAS builds |

## Quick Start

### Required Secrets

Add these in `Settings → Secrets and variables → Actions`:

| Secret | Required | Description |
|--------|----------|-------------|
| `EXPO_TOKEN` | Yes | Expo authentication token |
| `VERCEL_TOKEN` | Yes | Vercel deployment token |
| `APPLE_ID` | For iOS submit | Apple ID for App Store |
| `GOOGLE_SERVICE_ACCOUNT` | For Android submit | Google Play credentials |

### Generate Expo Token

```bash
cd mobile
npx expo login
npx expo token:create
# Copy token to GitHub Secrets as EXPO_TOKEN
```

## Usage

### Development (OTA Update)
```bash
git push origin develop
# → Instant update in Expo Go
```

### Production Release
```bash
git tag v1.0.0
git push origin v1.0.0
# → Production build for App Store & Google Play
```

### Manual Trigger
1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow**

## Monitoring

- **Expo Dashboard:** https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds
- **GitHub Actions:** https://github.com/Slow-Spot/app/actions

## Store Submission

Production builds can auto-submit to stores when configured:
- **iOS:** Requires `APPLE_ID` and App Store Connect setup
- **Android:** Requires `GOOGLE_SERVICE_ACCOUNT` JSON

See [EAS Submit docs](https://docs.expo.dev/submit/introduction/) for setup.
