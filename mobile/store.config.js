/**
 * EAS Metadata configuration for App Store Connect
 *
 * This file is used by `eas metadata:push` to automatically update
 * App Store Connect metadata from the store/metadata.json file.
 *
 * Usage:
 *   eas metadata:push --platform ios
 *
 * @see https://docs.expo.dev/eas-metadata/introduction/
 */

const fs = require('fs');
const path = require('path');

// Load metadata from JSON file
const metadataPath = path.join(__dirname, 'store', 'metadata.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Map locale codes to App Store Connect locale codes
const localeMapping = {
  'en-US': 'en-US',
  'pl': 'pl',
  'de-DE': 'de-DE',
  'es-ES': 'es-ES',
  'fr-FR': 'fr-FR',
  'zh-Hans': 'zh-Hans',
  'hi': 'hi',
};

// Build localized info for each language
const localizedInfo = {};

for (const [localeKey, data] of Object.entries(metadata.locales)) {
  const appStoreLocale = localeMapping[localeKey] || localeKey;

  localizedInfo[appStoreLocale] = {
    title: data.name,
    subtitle: data.subtitle,
    description: data.description,
    keywords: data.keywords.split(','),
    promotionalText: data.promotionalText,
    whatsNew: data.whatsNew,
  };
}

/** @type {import('@expo/eas-metadata').StoreConfig} */
module.exports = {
  configVersion: 0,

  // App information
  app: {
    copyright: metadata.app.copyright,
    primaryCategory: 'HEALTH_AND_FITNESS',
    secondaryCategory: 'LIFESTYLE',

    // Privacy information (required for App Store)
    privacyManifest: {
      // App doesn't collect any data
      NSPrivacyTracking: false,
      NSPrivacyTrackingDomains: [],
      NSPrivacyCollectedDataTypes: [],
      NSPrivacyAccessedAPITypes: [
        {
          // File timestamp APIs for AsyncStorage
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['C617.1'],
        },
        {
          // User defaults for app preferences
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
      ],
    },
  },

  // Version-specific info
  version: {
    // Localized app info
    localizedInfo,

    // App Review information
    appReviewInfo: {
      contactEmail: 'support@slowspot.me',
      contactFirstName: 'Leszek',
      contactLastName: 'Szpunar',
      contactPhone: '+48000000000',
      demoAccountName: null, // No login required
      demoAccountPassword: null,
      demoAccountRequired: false,
      notes: 'This is a meditation timer app. No login is required. All data is stored locally on the device.',
    },
  },
};
