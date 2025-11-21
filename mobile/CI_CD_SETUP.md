# CI/CD Setup Documentation

Complete guide for setting up Continuous Integration and Continuous Deployment for Slow Spot APP using GitHub Actions and EAS (Expo Application Services).

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [GitHub Secrets Configuration](#github-secrets-configuration)
4. [Workflows](#workflows)
5. [Analytics Integration](#analytics-integration)
6. [Environment Configuration](#environment-configuration)
7. [Usage Guide](#usage-guide)
8. [Troubleshooting](#troubleshooting)

## Overview

This CI/CD setup provides:

- **Automatic EAS Updates**: Push to `main`, `staging`, or `production` branches triggers automatic over-the-air (OTA) updates
- **Build Automation**: Tag a release or manually trigger builds for iOS and Android
- **Analytics**: Integrated Vexo Analytics and LogRocket for production monitoring
- **Security**: All sensitive keys stored as GitHub Secrets, never in repository

## Prerequisites

Before setting up CI/CD, ensure you have:

1. **Expo Account**: Sign up at [expo.dev](https://expo.dev)
2. **EAS CLI Installed**: `npm install -g eas-cli`
3. **EAS Project Configured**: Run `eas build:configure` in your project
4. **GitHub Repository**: Code hosted on GitHub with Actions enabled
5. **Analytics Accounts** (optional):
   - [Vexo Analytics](https://vexo.co/) account
   - [LogRocket](https://logrocket.com/) account

## GitHub Secrets Configuration

### Required Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

#### 1. EXPO_TOKEN (Required for EAS)

Generate your Expo access token:

```bash
eas login
eas whoami
```

Then create a token at: https://expo.dev/accounts/[your-account]/settings/access-tokens

- **Name**: `EXPO_TOKEN`
- **Value**: Your Expo access token (starts with `expo-`)

#### 2. VEXO_API_KEY (Optional - for Analytics)

Get your API key from [Vexo Analytics Dashboard](https://vexo.co/dashboard)

- **Name**: `VEXO_API_KEY`
- **Value**: Your Vexo API key (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

#### 3. LOGROCKET_APP_ID (Optional - for Session Replay)

Get your app ID from [LogRocket Dashboard](https://app.logrocket.com/)

- **Name**: `LOGROCKET_APP_ID`
- **Value**: Your LogRocket app ID (format: `your-org/your-app-name`)

### Secret Security

- ✅ Secrets are encrypted by GitHub
- ✅ Secrets are never exposed in logs
- ✅ Secrets are only available during workflow execution
- ❌ NEVER commit secrets to the repository
- ❌ NEVER hardcode API keys in source code

## Workflows

### 1. EAS Update Workflow

**File**: `.github/workflows/eas-update.yml`

**Triggers**:
- Push to `main` → Publishes to `development` channel
- Push to `staging` → Publishes to `staging` channel
- Push to `production` → Publishes to `production` channel
- Pull requests to `main` → Validates build

**What it does**:
- Checks out code
- Sets up Node.js 18
- Installs dependencies
- Publishes OTA update to appropriate channel
- Updates appear on [expo.dev](https://expo.dev)

**Example**:
```bash
git push origin main
# Automatically publishes update to development channel
# Users with development build will receive the update
```

### 2. EAS Build Workflow

**File**: `.github/workflows/eas-build.yml`

**Triggers**:
- Tag push matching `v*.*.*` (e.g., `v1.0.0`) → Production build
- Manual trigger via GitHub Actions UI → Choose profile and platform

**What it does**:
- Builds complete iOS and/or Android binaries
- Uses the appropriate build profile (development, preview, production)
- Uploads builds to [expo.dev](https://expo.dev)

**Example - Automatic**:
```bash
git tag v1.0.0
git push origin v1.0.0
# Automatically builds iOS and Android for production
```

**Example - Manual**:
1. Go to GitHub → Actions → EAS Build
2. Click "Run workflow"
3. Select:
   - Profile: `preview` or `production`
   - Platform: `all`, `ios`, or `android`
4. Click "Run workflow"

## Analytics Integration

### Vexo Analytics

Lightweight analytics for tracking user behavior.

**Initialization**: Automatically in production mode (App.tsx:20-30)

**Features**:
- Page views tracking
- User actions
- Custom events
- Real-time dashboard

**Dashboard**: https://vexo.co/dashboard

### LogRocket

Session replay and error monitoring.

**Initialization**: Automatically in production mode (App.tsx:33-43)

**Features**:
- Session replay
- Error tracking
- Performance monitoring
- User identification

**Dashboard**: https://app.logrocket.com/

### Environment Conditions

Analytics only initialize when:
- `APP_ENV === 'production'` (set in eas.json build profiles)
- Environment variables are present
- Production build profile is used

This ensures analytics don't run during development.

## Environment Configuration

### Local Development

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your actual keys:
```env
VEXO_API_KEY=your-actual-vexo-key-here
LOGROCKET_APP_ID=your-org/your-app-name
APP_ENV=development
```

3. The `.env` file is in `.gitignore` and will never be committed

### EAS Build Environment

Environment variables for production builds are configured in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

**Note**: API keys for analytics should be added as GitHub Secrets, not in eas.json

## Usage Guide

### Publishing an Update (OTA)

1. Make your code changes
2. Commit and push to the appropriate branch:

```bash
git add .
git commit -m "feat: Add new meditation session"
git push origin main
```

3. GitHub Actions automatically:
   - Runs the update workflow
   - Publishes to development channel
   - Update appears on expo.dev

4. Users receive the update:
   - Next time they open the app
   - Within minutes (no app store review needed)

### Creating a Production Build

1. Ensure all changes are tested and ready
2. Update version in `app.json`:

```json
{
  "expo": {
    "version": "1.0.1"
  }
}
```

3. Create and push a git tag:

```bash
git tag v1.0.1
git push origin v1.0.1
```

4. GitHub Actions automatically:
   - Builds iOS and Android apps
   - Uses production profile with analytics
   - Uploads to expo.dev

5. Download builds from expo.dev:
   - iOS: Submit to App Store Connect
   - Android: Submit to Google Play Console

### Manual Build Trigger

1. Go to GitHub repository → Actions
2. Select "EAS Build" workflow
3. Click "Run workflow"
4. Choose:
   - **Branch**: Which code to build
   - **Profile**: development, preview, or production
   - **Platform**: all, ios, or android
5. Click "Run workflow"
6. Monitor progress in Actions tab
7. Download from expo.dev when complete

## Troubleshooting

### Build Fails with "Unauthorized"

**Problem**: EXPO_TOKEN is missing or invalid

**Solution**:
1. Generate new token: https://expo.dev/accounts/[your-account]/settings/access-tokens
2. Update GitHub Secret: Settings → Secrets → EXPO_TOKEN
3. Re-run workflow

### Analytics Not Working

**Problem**: Analytics not showing data

**Checklist**:
- ✅ Is `APP_ENV=production` in eas.json production profile?
- ✅ Are VEXO_API_KEY and LOGROCKET_APP_ID set as GitHub Secrets?
- ✅ Is the build using production profile?
- ✅ Are you testing with a production build (not development)?

**Debug**:
Check logs after app starts:
```
✓ Vexo Analytics initialized
✓ LogRocket initialized
```

If you see warnings about missing keys, secrets aren't configured properly.

### Update Not Appearing

**Problem**: OTA update published but users don't receive it

**Checklist**:
- ✅ Is the user's build configured for the same channel?
- ✅ Did the workflow complete successfully?
- ✅ Is the user connected to internet?
- ✅ Has the user restarted the app?

**Solution**:
Updates can take a few minutes. User must:
1. Close the app completely
2. Reopen the app
3. Update downloads on next launch

### Node Version Warnings

**Problem**: EBADENGINE warnings during npm install

**Solution**: These are warnings, not errors. The build will still work. To eliminate warnings:
```bash
nvm install 20.19.4
nvm use 20.19.4
```

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vexo Analytics Docs](https://vexo.co/docs)
- [LogRocket Docs](https://docs.logrocket.com/)

## Support

For issues or questions:
1. Check workflow logs in GitHub Actions tab
2. Review EAS build logs on expo.dev
3. Consult Expo documentation
4. Check analytics platform documentation

---

**Last Updated**: 2025-11-21
**Maintained By**: ITEON Development Team
