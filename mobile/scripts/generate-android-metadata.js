#!/usr/bin/env node

/**
 * Generate Fastlane metadata structure for Google Play from store/metadata.json
 *
 * This script creates the fastlane/metadata/android directory structure
 * required by `fastlane supply` to upload metadata to Google Play Console.
 *
 * Directory structure:
 * fastlane/metadata/android/
 *   en-US/
 *     title.txt
 *     short_description.txt
 *     full_description.txt
 *     changelogs/
 *       default.txt
 *   pl-PL/
 *     ...
 */

const fs = require('fs');
const path = require('path');

// Locale mapping from our format to Google Play format
const LOCALE_MAPPING = {
  'en-US': 'en-US',
  'pl': 'pl-PL',
  'de-DE': 'de-DE',
  'es-ES': 'es-ES',
  'fr-FR': 'fr-FR',
  'zh-Hans': 'zh-CN',
  'hi': 'hi-IN',
};

// Load metadata
const metadataPath = path.join(__dirname, '..', 'store', 'metadata.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Output directory
const outputDir = path.join(__dirname, '..', 'fastlane', 'metadata', 'android');

// Clean and create output directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir, { recursive: true });

console.log('Generating Android metadata for Fastlane...\n');

for (const [sourceLocale, data] of Object.entries(metadata.locales)) {
  const targetLocale = LOCALE_MAPPING[sourceLocale] || sourceLocale;
  const localeDir = path.join(outputDir, targetLocale);
  const changelogDir = path.join(localeDir, 'changelogs');

  // Create directories
  fs.mkdirSync(localeDir, { recursive: true });
  fs.mkdirSync(changelogDir, { recursive: true });

  // Write title (max 30 chars for Google Play)
  const title = data.name.substring(0, 30);
  fs.writeFileSync(path.join(localeDir, 'title.txt'), title);

  // Write short description (max 80 chars)
  const shortDesc = data.subtitle.substring(0, 80);
  fs.writeFileSync(path.join(localeDir, 'short_description.txt'), shortDesc);

  // Write full description (max 4000 chars)
  const fullDesc = data.description.substring(0, 4000);
  fs.writeFileSync(path.join(localeDir, 'full_description.txt'), fullDesc);

  // Write changelog (for release notes)
  const changelog = data.whatsNew || '• Bug fixes and improvements';
  fs.writeFileSync(path.join(changelogDir, 'default.txt'), changelog);

  console.log(`✓ Generated metadata for ${targetLocale}`);
}

console.log('\n✅ Android metadata generated successfully!');
console.log(`   Output: ${outputDir}`);
