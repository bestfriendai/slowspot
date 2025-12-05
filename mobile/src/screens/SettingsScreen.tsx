/**
 * SettingsScreen
 *
 * Beautiful settings screen with consistent app styling.
 * Uses white cards with icon boxes and mint accents.
 */

import { logger } from '../utils/logger';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  Switch,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { screenElementAnimation } from '../utils/animations';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { AppModal, AppModalButton } from '../components/AppModal';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { brandColors, primaryColor, featureColorPalettes, semanticColors, getFeatureIconColors } from '../theme/colors';
import { exportAllData, clearAllData, resetOnboarding } from '../services/storage';
import { clearAllCustomSessions } from '../services/customSessionStorage';
import { clearProgress } from '../services/progressTracker';
import { clearAllQuoteHistory } from '../services/quoteHistory';
import { usePersonalization } from '../contexts/PersonalizationContext';

export const LANGUAGE_STORAGE_KEY = 'user_language_preference';
export const THEME_STORAGE_KEY = 'user_theme_preference';

export type ThemeMode = 'light' | 'dark' | 'system';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

const THEME_OPTIONS = [
  { mode: 'light' as ThemeMode, icon: 'sunny' as const, labelKey: 'settings.light' },
  { mode: 'dark' as ThemeMode, icon: 'moon' as const, labelKey: 'settings.dark' },
  { mode: 'system' as ThemeMode, icon: 'phone-portrait' as const, labelKey: 'settings.system' },
];

interface SettingsScreenProps {
  isDark: boolean;
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onNavigateToProfile?: () => void;
  onNavigateToPersonalization?: () => void;
  onRestartOnboarding?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isDark,
  themeMode,
  onThemeChange,
  onNavigateToProfile,
  onNavigateToPersonalization,
  onRestartOnboarding,
}) => {
  const { t, i18n } = useTranslation();
  const {
    currentTheme,
    settings,
    systemSettings,
    effectiveAnimationsEnabled,
    effectiveFontScale,
    setHighContrastMode,
    setLargerTextMode,
    setFollowSystemReduceMotion,
    setFollowSystemFontSize,
  } = usePersonalization();

  // Modal states
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [showDataClearedModal, setShowDataClearedModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [showClearErrorModal, setShowClearErrorModal] = useState(false);

  // Get theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);
  const featureColors = useMemo(() => getFeatureIconColors(isDark), [isDark]);

  // Dynamic styles based on theme - using brand/primary colors for consistency
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    cardTitle: { color: colors.text.primary },
    cardDescription: { color: colors.text.secondary },
    cardShadow: isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    // Icon box backgrounds - using feature color palettes for beautiful, consistent look
    iconBoxBgPurple: isDark ? `${currentTheme.primary}33` : `${currentTheme.primary}1A`,
    iconBoxBgBlue: isDark ? `rgba(${featureColorPalettes.indigo.rgb}, 0.2)` : `rgba(${featureColorPalettes.indigo.rgb}, 0.1)`,
    iconBoxBgRed: isDark ? `rgba(${featureColorPalettes.rose.rgb}, 0.2)` : `rgba(${featureColorPalettes.rose.rgb}, 0.1)`,
    iconBoxBgGreen: isDark ? `rgba(${featureColorPalettes.emerald.rgb}, 0.2)` : `rgba(${featureColorPalettes.emerald.rgb}, 0.1)`,
    iconBoxBgAmber: isDark ? `rgba(${featureColorPalettes.amber.rgb}, 0.2)` : `rgba(${featureColorPalettes.amber.rgb}, 0.1)`,
    iconBoxBgTeal: isDark ? `rgba(${featureColorPalettes.teal.rgb}, 0.2)` : `rgba(${featureColorPalettes.teal.rgb}, 0.1)`,
    // Option styling - using primary/brand colors
    optionBg: isDark ? colors.neutral.charcoal[200] : colors.neutral.lightGray[50],
    optionBorder: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[200],
    optionText: { color: colors.text.primary },
    optionSelectedBg: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}26`,
    optionSelectedBorder: isDark ? `${currentTheme.primary}66` : `${currentTheme.primary}4D`,
    optionSelectedText: { color: currentTheme.primary },
    // Icon colors for different sections
    iconPurple: isDark ? featureColorPalettes.violet.darkIcon : featureColorPalettes.violet.lightIcon,
    iconBlue: isDark ? featureColorPalettes.indigo.darkIcon : featureColorPalettes.indigo.lightIcon,
    iconGreen: isDark ? featureColorPalettes.emerald.darkIcon : featureColorPalettes.emerald.lightIcon,
    iconAmber: isDark ? featureColorPalettes.amber.darkIcon : featureColorPalettes.amber.lightIcon,
    iconTeal: isDark ? featureColorPalettes.teal.darkIcon : featureColorPalettes.teal.lightIcon,
    iconRose: isDark ? featureColorPalettes.rose.darkIcon : featureColorPalettes.rose.lightIcon,
    // For legal section
    iconBoxBg: isDark ? primaryColor.transparent[20] : primaryColor.transparent[10],
    chevronColor: isDark ? colors.neutral.gray[400] : colors.neutral.gray[500],
    // For scientific sources section
    iconBoxBgCyan: isDark ? `rgba(${featureColorPalettes.teal.rgb}, 0.25)` : `rgba(${featureColorPalettes.teal.rgb}, 0.12)`,
    iconCyan: isDark ? featureColorPalettes.teal.darkIcon : featureColorPalettes.teal.lightIcon,
  }), [colors, isDark, featureColors]);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch (error) {
      logger.error('Failed to save language preference:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const payload = await exportAllData();
      await Share.share({ message: payload, title: 'Slow Spot backup (JSON)' });
    } catch (error) {
      logger.error('Failed to export data:', error);
      setShowExportErrorModal(true);
    }
  };

  const handleClearData = () => {
    setShowClearDataModal(true);
  };

  const confirmClearData = async () => {
    try {
      await Promise.all([
        clearAllData(),
        clearAllCustomSessions(),
        clearProgress(),
        clearAllQuoteHistory(),
        AsyncStorage.removeItem('@wellbeing_assessments'),
        AsyncStorage.removeItem('@slow_spot_reminder_settings'),
        AsyncStorage.removeItem('@slow_spot_calendar_id'),
        AsyncStorage.removeItem('@custom_sessions'),
      ]);
      setShowDataClearedModal(true);
    } catch (error) {
      logger.error('Failed to clear data:', error);
      setShowClearErrorModal(true);
    }
  };

  const handleRestartOnboarding = () => {
    setShowOnboardingModal(true);
  };

  const confirmRestartOnboarding = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await resetOnboarding();
      // Call the callback to show onboarding immediately
      onRestartOnboarding?.();
    } catch (error) {
      logger.error('Failed to restart onboarding:', error);
    }
  };

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text
          entering={effectiveAnimationsEnabled ? screenElementAnimation(0) : undefined}
          style={[styles.title, dynamicStyles.title]}
        >
          {t('settings.title')}
        </Animated.Text>

        {/* Profile Card */}
        {onNavigateToProfile && (
          <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(1) : undefined}>
          <GradientCard
            gradient={themeGradients.card.whiteCard}
            style={[styles.card, dynamicStyles.cardShadow]}
            onPress={onNavigateToProfile}
            isDark={isDark}
          >
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
                <Ionicons name="person" size={24} color={currentTheme.primary} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                  {t('settings.viewProfile', 'Zobacz Profil')}
                </Text>
                <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                  {t('settings.viewProfileDescription', 'Zobacz swój postęp i statystyki')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.text.tertiary} />
            </View>
          </GradientCard>
          </Animated.View>
        )}

        {/* Personalization Card */}
        {onNavigateToPersonalization && (
          <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(2) : undefined}>
          <GradientCard
            gradient={themeGradients.card.whiteCard}
            style={[styles.card, dynamicStyles.cardShadow]}
            onPress={onNavigateToPersonalization}
            isDark={isDark}
          >
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
                <Ionicons name="color-wand" size={24} color={currentTheme.primary} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                  {t('settings.personalization', 'Personalizacja')}
                </Text>
                <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                  {t('settings.personalizationDescription', 'Dostosuj kolory aplikacji')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.text.tertiary} />
            </View>
          </GradientCard>
          </Animated.View>
        )}

        {/* Language Selection Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(3) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="globe" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.language', 'Język')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.languageDescription', 'Wybierz język aplikacji')}
              </Text>
            </View>
          </View>
          <View style={styles.optionsGrid}>
            {LANGUAGES.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: isSelected ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                      borderColor: isSelected ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                    },
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionFlag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected ? dynamicStyles.optionSelectedText : dynamicStyles.optionText,
                    ]}
                  >
                    {lang.name}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={currentTheme.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </GradientCard>
        </Animated.View>

        {/* Theme Selection Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(4) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="color-palette" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.theme', 'Motyw')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.themeDescription', 'Dostosuj wygląd aplikacji')}
              </Text>
            </View>
          </View>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map((option) => {
              const isSelected = themeMode === option.mode;
              return (
                <TouchableOpacity
                  key={option.mode}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: isSelected ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                      borderColor: isSelected ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                    },
                  ]}
                  onPress={() => onThemeChange(option.mode)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={isSelected ? currentTheme.primary : colors.text.secondary}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      isSelected ? dynamicStyles.optionSelectedText : dynamicStyles.optionText,
                    ]}
                  >
                    {t(option.labelKey, option.mode)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GradientCard>
        </Animated.View>

        {/* Accessibility Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(5) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="accessibility" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.accessibility')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.accessibilityDescription')}
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityOptions}>
            {/* Follow System Reduce Motion */}
            <View style={[styles.accessibilityOption, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.accessibilityOptionContent}>
                <Ionicons name="flash-off" size={20} color={currentTheme.primary} />
                <View style={styles.accessibilityOptionText}>
                  <Text style={[styles.accessibilityOptionTitle, dynamicStyles.cardTitle]}>
                    {t('settings.followSystemReduceMotion', 'Follow System Reduce Motion')}
                  </Text>
                  <Text style={[styles.accessibilityOptionDesc, dynamicStyles.cardDescription]}>
                    {t('settings.followSystemReduceMotionDescription', 'Respect device accessibility setting for reduced motion')}
                    {systemSettings.reduceMotionEnabled && (
                      <Text style={{ color: currentTheme.primary, fontWeight: '600' }}>
                        {' '}({t('settings.systemEnabled', 'System: ON')})
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.followSystemReduceMotion}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFollowSystemReduceMotion(value);
                }}
                trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}80` }}
                thumbColor={settings.followSystemReduceMotion ? currentTheme.primary : colors.neutral.white}
              />
            </View>
            {/* Follow System Font Size */}
            <View style={[styles.accessibilityOption, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.accessibilityOptionContent}>
                <Ionicons name="resize" size={20} color={currentTheme.primary} />
                <View style={styles.accessibilityOptionText}>
                  <Text style={[styles.accessibilityOptionTitle, dynamicStyles.cardTitle]}>
                    {t('settings.followSystemFontSize', 'Follow System Font Size')}
                  </Text>
                  <Text style={[styles.accessibilityOptionDesc, dynamicStyles.cardDescription]}>
                    {t('settings.followSystemFontSizeDescription', 'Scale text according to device settings')}
                    {systemSettings.systemFontScale !== 1 && (
                      <Text style={{ color: currentTheme.primary, fontWeight: '600' }}>
                        {' '}({t('settings.systemScale', 'Scale')}: {(systemSettings.systemFontScale * 100).toFixed(0)}%)
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.followSystemFontSize}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFollowSystemFontSize(value);
                }}
                trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}80` }}
                thumbColor={settings.followSystemFontSize ? currentTheme.primary : colors.neutral.white}
              />
            </View>
            {/* High Contrast Mode */}
            <View style={[styles.accessibilityOption, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.accessibilityOptionContent}>
                <Ionicons name="contrast" size={20} color={currentTheme.primary} />
                <View style={styles.accessibilityOptionText}>
                  <Text style={[styles.accessibilityOptionTitle, dynamicStyles.cardTitle]}>
                    {t('settings.highContrastMode')}
                  </Text>
                  <Text style={[styles.accessibilityOptionDesc, dynamicStyles.cardDescription]}>
                    {t('settings.highContrastModeDescription')}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.highContrastMode}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setHighContrastMode(value);
                }}
                trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}80` }}
                thumbColor={settings.highContrastMode ? currentTheme.primary : colors.neutral.white}
              />
            </View>
            {/* Larger Text Mode */}
            <View style={[styles.accessibilityOption, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.accessibilityOptionContent}>
                <Ionicons name="text" size={20} color={currentTheme.primary} />
                <View style={styles.accessibilityOptionText}>
                  <Text style={[styles.accessibilityOptionTitle, dynamicStyles.cardTitle]}>
                    {t('settings.largerTextMode')}
                  </Text>
                  <Text style={[styles.accessibilityOptionDesc, dynamicStyles.cardDescription]}>
                    {t('settings.largerTextModeDescription')}
                    {effectiveFontScale !== 1 && (
                      <Text style={{ color: currentTheme.primary, fontWeight: '600' }}>
                        {' '}({t('settings.effectiveScale', 'Effective')}: {(effectiveFontScale * 100).toFixed(0)}%)
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.largerTextMode}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setLargerTextMode(value);
                }}
                trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}80` }}
                thumbColor={settings.largerTextMode ? currentTheme.primary : colors.neutral.white}
              />
            </View>
          </View>
        </GradientCard>
        </Animated.View>

        {/* System Info Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(6) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="phone-portrait" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.systemInfo', 'System Information')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.systemInfoDescription', 'Detected device settings')}
              </Text>
            </View>
          </View>
          <View style={styles.systemInfoGrid}>
            <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <Ionicons name="time" size={18} color={currentTheme.primary} />
              <View style={styles.systemInfoText}>
                <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                  {t('settings.timezone', 'Timezone')}
                </Text>
                <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                  {systemSettings.timezoneAbbreviation}
                </Text>
              </View>
            </View>
            <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <Ionicons name="globe" size={18} color={currentTheme.primary} />
              <View style={styles.systemInfoText}>
                <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                  {t('settings.region', 'Region')}
                </Text>
                <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                  {systemSettings.regionCode || systemSettings.languageCode.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <Ionicons name="thermometer" size={18} color={currentTheme.primary} />
              <View style={styles.systemInfoText}>
                <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                  {t('settings.temperatureUnit', 'Temperature')}
                </Text>
                <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                  {systemSettings.temperatureUnit === 'celsius' ? '°C' : '°F'}
                </Text>
              </View>
            </View>
            <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <Ionicons name="speedometer" size={18} color={currentTheme.primary} />
              <View style={styles.systemInfoText}>
                <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                  {t('settings.measurementSystem', 'Units')}
                </Text>
                <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                  {systemSettings.measurementSystem === 'metric' ? t('settings.metric', 'Metric') : t('settings.imperial', 'Imperial')}
                </Text>
              </View>
            </View>
            <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <Ionicons name="time-outline" size={18} color={currentTheme.primary} />
              <View style={styles.systemInfoText}>
                <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                  {t('settings.timeFormat', 'Time Format')}
                </Text>
                <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                  {systemSettings.uses24HourClock ? '24h' : '12h'}
                </Text>
              </View>
            </View>
            {systemSettings.isRTL && (
              <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
                <Ionicons name="swap-horizontal" size={18} color={currentTheme.primary} />
                <View style={styles.systemInfoText}>
                  <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                    {t('settings.textDirection', 'Text Direction')}
                  </Text>
                  <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                    RTL
                  </Text>
                </View>
              </View>
            )}
          </View>
        </GradientCard>
        </Animated.View>

        {/* Data & Privacy Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(7) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="shield-checkmark" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.dataPrivacy', 'Dane i Prywatność')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.dataPrivacyDescription', 'Wszystkie dane pozostają na tym urządzeniu')}
              </Text>
            </View>
          </View>
          <View style={styles.dataButtons}>
            <TouchableOpacity
              style={[styles.dataButton, { backgroundColor: currentTheme.primary }]}
              onPress={handleExportData}
              activeOpacity={0.8}
            >
              <Ionicons name="download" size={20} color={colors.neutral.white} />
              <Text style={styles.dataButtonText}>
                {t('settings.exportData', 'Eksportuj dane')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dataButton, styles.dangerButton]}
              onPress={handleClearData}
              activeOpacity={0.8}
            >
              <Ionicons name="trash" size={20} color={colors.neutral.white} />
              <Text style={styles.dataButtonText}>
                {t('settings.clearData', 'Wyczyść dane')}
              </Text>
            </TouchableOpacity>
          </View>
        </GradientCard>
        </Animated.View>

        {/* Legal & Support Card - Required for App Store / Google Play */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(8) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
              <Ionicons name="document-text" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.legalTitle', 'Informacje prawne')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.legalDescription', 'Regulamin, polityka prywatności i wsparcie')}
              </Text>
            </View>
          </View>
          <View style={styles.legalLinks}>
            <TouchableOpacity
              style={[styles.legalLink, { backgroundColor: dynamicStyles.optionBg }]}
              onPress={() => {
                const locale = i18n.language === 'pl' ? 'pl' : 'en';
                Linking.openURL(`https://slowspot.me/${locale}/privacy`);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.legalLinkContent}>
                <Ionicons name="shield-checkmark" size={20} color={currentTheme.primary} />
                <Text style={[styles.legalLinkText, dynamicStyles.cardTitle]}>
                  {t('settings.privacyPolicy', 'Polityka prywatności')}
                </Text>
              </View>
              <Ionicons name="open-outline" size={18} color={dynamicStyles.chevronColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.legalLink, { backgroundColor: dynamicStyles.optionBg }]}
              onPress={() => {
                const locale = i18n.language === 'pl' ? 'pl' : 'en';
                Linking.openURL(`https://slowspot.me/${locale}/terms`);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.legalLinkContent}>
                <Ionicons name="document" size={20} color={currentTheme.primary} />
                <Text style={[styles.legalLinkText, dynamicStyles.cardTitle]}>
                  {t('settings.termsOfService', 'Regulamin')}
                </Text>
              </View>
              <Ionicons name="open-outline" size={18} color={dynamicStyles.chevronColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.legalLink, { backgroundColor: dynamicStyles.optionBg }]}
              onPress={() => {
                const locale = i18n.language === 'pl' ? 'pl' : 'en';
                Linking.openURL(`https://slowspot.me/${locale}/support`);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.legalLinkContent}>
                <Ionicons name="help-circle" size={20} color={currentTheme.primary} />
                <Text style={[styles.legalLinkText, dynamicStyles.cardTitle]}>
                  {t('settings.support', 'Wsparcie')}
                </Text>
              </View>
              <Ionicons name="open-outline" size={18} color={dynamicStyles.chevronColor} />
            </TouchableOpacity>
          </View>
        </GradientCard>
        </Animated.View>

        {/* About Card - At the very bottom */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(9) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="information-circle" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.about', 'O aplikacji')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('app.name')} • v1.0.0
              </Text>
            </View>
          </View>
          <View style={[styles.aboutContent, { backgroundColor: dynamicStyles.optionBg }]}>
            <Text style={[styles.aboutTagline, dynamicStyles.cardDescription]}>
              {t('app.tagline')}
            </Text>
            <View style={styles.aboutFeatures}>
              <View style={styles.aboutFeature}>
                <Ionicons name="checkmark-circle" size={16} color={currentTheme.primary} />
                <Text style={[styles.aboutFeatureText, dynamicStyles.cardDescription]}>
                  {t('settings.featureOffline', 'Działa offline')}
                </Text>
              </View>
              <View style={styles.aboutFeature}>
                <Ionicons name="checkmark-circle" size={16} color={currentTheme.primary} />
                <Text style={[styles.aboutFeatureText, dynamicStyles.cardDescription]}>
                  {t('settings.featurePrivacy', 'Bez reklam i śledzenia')}
                </Text>
              </View>
              <View style={styles.aboutFeature}>
                <Ionicons name="checkmark-circle" size={16} color={currentTheme.primary} />
                <Text style={[styles.aboutFeatureText, dynamicStyles.cardDescription]}>
                  {t('settings.featureLocal', 'Dane na urządzeniu')}
                </Text>
              </View>
            </View>
          </View>
          {/* Restart Onboarding button */}
          <TouchableOpacity
            style={[styles.restartOnboardingButton, { backgroundColor: dynamicStyles.optionBg }]}
            onPress={handleRestartOnboarding}
            activeOpacity={0.7}
          >
            <View style={styles.legalLinkContent}>
              <Ionicons name="refresh" size={20} color={currentTheme.primary} />
              <Text style={[styles.legalLinkText, dynamicStyles.cardTitle]}>
                {t('settings.restartOnboarding', 'Uruchom ponownie onboarding')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={dynamicStyles.chevronColor} />
          </TouchableOpacity>
        </GradientCard>
        </Animated.View>
      </ScrollView>

      {/* Restart Onboarding Modal */}
      <AppModal
        visible={showOnboardingModal}
        title={t('settings.restartOnboardingTitle', 'Uruchomić ponownie onboarding?')}
        message={t('settings.restartOnboardingBody', 'Zobaczysz ekran powitalny ponownie.')}
        icon="refresh"
        buttons={[
          { text: t('common.cancel', 'Anuluj'), style: 'cancel' },
          { text: t('common.confirm', 'Potwierdź'), onPress: confirmRestartOnboarding },
        ]}
        onDismiss={() => setShowOnboardingModal(false)}
      />

      {/* Clear Data Confirmation Modal */}
      <AppModal
        visible={showClearDataModal}
        title={t('settings.clearDataTitle', 'Wyczyścić dane lokalne?')}
        message={t('settings.clearDataBody', 'Usunie to wszystkie sesje, postęp, przypomnienia i preferencje z tego urządzenia.')}
        icon="trash"
        iconColor={semanticColors.error.default}
        buttons={[
          { text: t('common.cancel', 'Anuluj'), style: 'cancel' },
          { text: t('common.confirm', 'Potwierdź'), style: 'destructive', onPress: confirmClearData },
        ]}
        onDismiss={() => setShowClearDataModal(false)}
      />

      {/* Data Cleared Success Modal */}
      <AppModal
        visible={showDataClearedModal}
        title={t('settings.dataCleared', 'Dane lokalne wyczyszczone')}
        message={t('settings.dataClearedBody', 'Możesz odbudować swoje preferencje i sesje w dowolnym momencie. Żadne dane nie opuściły tego urządzenia.')}
        icon="checkmark-circle"
        buttons={[{ text: 'OK' }]}
        onDismiss={() => setShowDataClearedModal(false)}
      />

      {/* Export Error Modal */}
      <AppModal
        visible={showExportErrorModal}
        title={t('settings.exportFailed', 'Eksport nie powiódł się')}
        message={t('settings.exportFailedBody', 'Nie można wyeksportować danych. Spróbuj ponownie.')}
        icon="warning"
        iconColor={semanticColors.error.default}
        buttons={[{ text: 'OK' }]}
        onDismiss={() => setShowExportErrorModal(false)}
      />

      {/* Clear Error Modal */}
      <AppModal
        visible={showClearErrorModal}
        title={t('settings.clearError', 'Błąd')}
        message={t('settings.clearErrorBody', 'Nie można wyczyścić wszystkich danych lokalnych.')}
        icon="warning"
        iconColor={semanticColors.error.default}
        buttons={[{ text: 'OK' }]}
        onDismiss={() => setShowClearErrorModal(false)}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  card: {
    // padding handled by GradientCard
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.xs,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.xs,
  },
  // Language options
  optionsGrid: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    gap: theme.spacing.sm,
  },
  optionFlag: {
    fontSize: 20,
  },
  optionText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
  },
  // Theme options
  themeOptions: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    gap: theme.spacing.xs,
  },
  themeOptionText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: '600',
  },
  // Data buttons
  dataButtons: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  dataButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
  },
  dangerButton: {
    backgroundColor: semanticColors.error.default,
  },
  dataButtonText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  // About section
  aboutContent: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  aboutTagline: {
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  aboutFeatures: {
    gap: theme.spacing.sm,
  },
  aboutFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  aboutFeatureText: {
    fontSize: theme.typography.fontSizes.sm,
  },
  // Legal links section
  legalLinks: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  legalLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  legalLinkText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '500',
  },
  // Restart onboarding button
  restartOnboardingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
  },
  // Scientific sources section
  scienceIntro: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  scienceIntroText: {
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  sourcesList: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  sourceItem: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  sourceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  sourceIcon: {
    marginTop: 2,
  },
  sourceTitleContainer: {
    flex: 1,
  },
  sourceTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes.sm,
  },
  sourceAuthors: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 4,
  },
  sourceContent: {
    marginTop: 2,
    marginLeft: 26,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  sourceDescription: {
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  // Accessibility options section
  accessibilityOptions: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  accessibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  accessibilityOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },
  accessibilityOptionText: {
    flex: 1,
  },
  accessibilityOptionTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '500',
  },
  accessibilityOptionDesc: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
  // System Info section
  systemInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  systemInfoItem: {
    width: '48%',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  systemInfoText: {
    gap: 2,
  },
  systemInfoLabel: {
    fontSize: theme.typography.fontSizes.xs,
    opacity: 0.7,
  },
  systemInfoValue: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '500',
  },
});
