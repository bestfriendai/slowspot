import { logger } from '../utils/logger';
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TextInput, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { GradientButton } from '../components/GradientButton';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { brandColors, primaryColor, featureColorPalettes } from '../theme/colors';
import {
  saveCustomSession,
  updateCustomSession,
  getAllCustomSessions,
  deleteCustomSession,
  SavedCustomSession,
  CustomSessionConfig,
  BreathingPattern,
  CustomBreathingPattern
} from '../services/customSessionStorage';

// Re-export types for external use
export type { CustomSessionConfig, BreathingPattern, CustomBreathingPattern };

interface CustomSessionBuilderScreenProps {
  isDark?: boolean;
  onStartSession: (config: CustomSessionConfig) => void;
  onBack: () => void;
  editSessionId?: string;
  initialConfig?: CustomSessionConfig;
}

const DURATION_PRESETS = [3, 5, 10, 15, 20, 30, 45, 60];
const INTERVAL_PRESETS = [3, 5, 10];

const BREATHING_PATTERNS: { id: BreathingPattern; icon: keyof typeof Ionicons.glyphMap; labelKey: string; descriptionKey: string }[] = [
  { id: 'none', icon: 'remove-circle-outline', labelKey: 'custom.breathingNone', descriptionKey: 'custom.breathingNoneDesc' },
  { id: 'box', icon: 'square-outline', labelKey: 'custom.breathingBox', descriptionKey: 'custom.breathingBoxDesc' },
  { id: '4-7-8', icon: 'moon-outline', labelKey: 'custom.breathing478', descriptionKey: 'custom.breathing478Desc' },
  { id: 'equal', icon: 'swap-horizontal-outline', labelKey: 'custom.breathingEqual', descriptionKey: 'custom.breathingEqualDesc' },
  { id: 'calm', icon: 'leaf-outline', labelKey: 'custom.breathingCalm', descriptionKey: 'custom.breathingCalmDesc' },
  { id: 'custom', icon: 'settings-outline', labelKey: 'custom.breathingCustom', descriptionKey: 'custom.breathingCustomDesc' },
];

export const CustomSessionBuilderScreen: React.FC<CustomSessionBuilderScreenProps> = ({
  isDark = false,
  onStartSession,
  onBack,
  editSessionId,
  initialConfig,
}) => {
  const { t } = useTranslation();

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Feature color palettes for beautiful icons
  const iconColors = useMemo(() => ({
    purple: {
      bg: isDark ? `rgba(${featureColorPalettes.violet.rgb}, 0.2)` : `rgba(${featureColorPalettes.violet.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.violet.darkIcon : featureColorPalettes.violet.lightIcon,
    },
    emerald: {
      bg: isDark ? `rgba(${featureColorPalettes.emerald.rgb}, 0.2)` : `rgba(${featureColorPalettes.emerald.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.emerald.darkIcon : featureColorPalettes.emerald.lightIcon,
    },
    teal: {
      bg: isDark ? `rgba(${featureColorPalettes.teal.rgb}, 0.2)` : `rgba(${featureColorPalettes.teal.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.teal.darkIcon : featureColorPalettes.teal.lightIcon,
    },
    amber: {
      bg: isDark ? `rgba(${featureColorPalettes.amber.rgb}, 0.2)` : `rgba(${featureColorPalettes.amber.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.amber.darkIcon : featureColorPalettes.amber.lightIcon,
    },
    indigo: {
      bg: isDark ? `rgba(${featureColorPalettes.indigo.rgb}, 0.2)` : `rgba(${featureColorPalettes.indigo.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.indigo.darkIcon : featureColorPalettes.indigo.lightIcon,
    },
    rose: {
      bg: isDark ? `rgba(${featureColorPalettes.rose.rgb}, 0.2)` : `rgba(${featureColorPalettes.rose.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.rose.darkIcon : featureColorPalettes.rose.lightIcon,
    },
    sky: {
      bg: isDark ? `rgba(${featureColorPalettes.sky.rgb}, 0.2)` : `rgba(${featureColorPalettes.sky.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.sky.darkIcon : featureColorPalettes.sky.lightIcon,
    },
  }), [isDark]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    backIcon: colors.text.primary,
    sectionTitle: { color: colors.text.primary },
    sectionDescription: { color: colors.text.secondary },
    label: { color: colors.text.secondary },
    currentValue: { color: brandColors.purple.primary },
    textInput: {
      borderColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[300],
      color: colors.text.primary,
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    },
    optionBg: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    optionBorder: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[200],
    optionSelectedBg: isDark ? primaryColor.transparent[25] : primaryColor.transparent[15],
    optionSelectedBorder: brandColors.purple.primary,
    switchTrackFalse: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[300],
    switchTrackTrue: brandColors.purple.primary,
    chevronColor: isDark ? colors.neutral.gray[400] : colors.neutral.gray[500],
    quickStartText: { color: colors.text.secondary },
  }), [colors, isDark]);

  // Session configuration state
  const [durationMinutes, setDurationMinutes] = useState(initialConfig?.durationMinutes || 15);
  const [customDuration, setCustomDuration] = useState('');
  const [ambientSound, setAmbientSound] = useState<CustomSessionConfig['ambientSound']>(
    initialConfig?.ambientSound || 'silence'
  );
  const [intervalBellEnabled, setIntervalBellEnabled] = useState(initialConfig?.intervalBellEnabled || false);
  const [intervalBellMinutes, setIntervalBellMinutes] = useState(initialConfig?.intervalBellMinutes || 5);
  const [customInterval, setCustomInterval] = useState('');
  const [wakeUpChimeEnabled, setWakeUpChimeEnabled] = useState(
    initialConfig?.wakeUpChimeEnabled !== undefined ? initialConfig.wakeUpChimeEnabled : false
  );
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState(initialConfig?.voiceGuidanceEnabled || false);
  const [sessionName, setSessionName] = useState(initialConfig?.name || '');
  const [breathingPattern, setBreathingPattern] = useState<BreathingPattern>(
    initialConfig?.breathingPattern || 'none'
  );
  const [customBreathing, setCustomBreathing] = useState<CustomBreathingPattern>(
    initialConfig?.customBreathing || { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
  );

  // Local editing state
  const [localEditSessionId, setLocalEditSessionId] = useState<string | number | undefined>(editSessionId);

  // Saved sessions state
  const [savedSessions, setSavedSessions] = useState<SavedCustomSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Audio preview
  const [chimeSound, setChimeSound] = useState<AudioPlayer | null>(null);

  useEffect(() => {
    loadSavedSessions();
    loadAudio();

    return () => {
      if (chimeSound) {
        chimeSound.release();
      }
    };
  }, []);

  const loadAudio = async () => {
    try {
      const player = createAudioPlayer(
        require('../../assets/sounds/meditation-bell.mp3')
      );
      setChimeSound(player);
    } catch (error) {
      logger.error('Error loading audio:', error);
    }
  };

  const loadSavedSessions = async () => {
    try {
      setLoadingSessions(true);
      const sessions = await getAllCustomSessions();
      setSavedSessions(sessions);
    } catch (error) {
      logger.error('Error loading saved sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const ambientSoundOptions = [
    { id: 'silence', icon: 'volume-mute-outline' as const, label: t('custom.ambientSilence'), color: iconColors.purple },
    { id: 'nature', icon: 'leaf-outline' as const, label: t('custom.ambientNature'), color: iconColors.emerald },
    { id: 'ocean', icon: 'water-outline' as const, label: t('custom.ambientOcean'), color: iconColors.sky },
    { id: 'forest', icon: 'flower-outline' as const, label: t('custom.ambientForest'), color: iconColors.teal },
    { id: '432hz', icon: 'radio-outline' as const, label: t('custom.ambient432hz'), color: iconColors.indigo },
    { id: '528hz', icon: 'musical-notes-outline' as const, label: t('custom.ambient528hz'), color: iconColors.rose },
  ];

  const getAmbientSoundLabel = (soundId: string | undefined): string => {
    if (!soundId) return t('custom.ambientSilence');
    const option = ambientSoundOptions.find(opt => opt.id === soundId);
    return option?.label || t('custom.ambientSilence');
  };

  const getCurrentConfig = (): CustomSessionConfig => ({
    durationMinutes,
    ambientSound,
    intervalBellEnabled,
    intervalBellMinutes,
    wakeUpChimeEnabled,
    voiceGuidanceEnabled,
    breathingPattern,
    customBreathing: breathingPattern === 'custom' ? customBreathing : undefined,
    name: sessionName || undefined,
  });

  const handleStartSession = () => {
    onStartSession(getCurrentConfig());
  };

  const handleSaveSession = async () => {
    const config = getCurrentConfig();

    if (!config.name || config.name.trim().length === 0) {
      Alert.alert(
        t('custom.saveError') || 'Error',
        t('custom.sessionNameRequired') || 'Please enter a session name before saving.',
        [{ text: t('common.ok') || 'OK' }]
      );
      return;
    }

    const currentEditId = localEditSessionId || editSessionId;

    try {
      if (currentEditId) {
        await updateCustomSession(String(currentEditId), config);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await loadSavedSessions();
        setLocalEditSessionId(undefined);

        Alert.alert(
          t('custom.saveSuccess') || 'Success',
          t('custom.sessionUpdated') || 'Your session has been updated successfully!',
          [{
            text: t('common.ok') || 'OK',
            onPress: () => {
              setSessionName('');
              setDurationMinutes(15);
              setAmbientSound('nature');
              setIntervalBellEnabled(false);
              setWakeUpChimeEnabled(true);
            },
          }]
        );
      } else {
        await saveCustomSession(config);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await loadSavedSessions();

        Alert.alert(
          t('custom.saveSuccess') || 'Success',
          t('custom.sessionSaved') || 'Your session has been saved successfully!',
          [
            {
              text: t('custom.startNow') || 'Start Now',
              onPress: () => onStartSession(config),
            },
            {
              text: t('custom.backToList') || 'Back to List',
              onPress: onBack,
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      logger.error('Error saving custom session:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t('custom.saveError') || 'Error',
        t('custom.saveFailed') || 'Failed to save session. Please try again.',
        [{ text: t('common.ok') || 'OK' }]
      );
    }
  };

  const handleSaveAndStart = async () => {
    const config = getCurrentConfig();

    if (!config.name || config.name.trim().length === 0) {
      onStartSession(config);
      return;
    }

    try {
      if (!editSessionId) {
        await saveCustomSession(config);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onStartSession(config);
    } catch (error) {
      logger.error('Error saving custom session:', error);
      onStartSession(config);
    }
  };

  const handleCustomDurationChange = (text: string) => {
    setCustomDuration(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 120) {
      setDurationMinutes(parsed);
    }
  };

  const handleCustomIntervalChange = (text: string) => {
    setCustomInterval(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 60) {
      setIntervalBellMinutes(parsed);
    }
  };

  const playPreviewSound = async () => {
    if (chimeSound) {
      try {
        chimeSound.seekTo(0);
        chimeSound.play();
      } catch (error) {
        logger.error('Error playing preview sound:', error);
      }
    }
  };

  const handleEditSavedSession = (session: SavedCustomSession) => {
    setDurationMinutes(session.config.durationMinutes);
    setAmbientSound(session.config.ambientSound);
    setIntervalBellEnabled(session.config.intervalBellEnabled);
    setIntervalBellMinutes(session.config.intervalBellMinutes);
    setWakeUpChimeEnabled(session.config.wakeUpChimeEnabled);
    setVoiceGuidanceEnabled(session.config.voiceGuidanceEnabled);
    setBreathingPattern(session.config.breathingPattern || 'none');
    if (session.config.customBreathing) {
      setCustomBreathing(session.config.customBreathing);
    }
    setSessionName(session.title);
    setLocalEditSessionId(session.id);
  };

  const handleDeleteSavedSession = async (session: SavedCustomSession) => {
    Alert.alert(
      t('custom.deleteConfirmTitle') || 'Delete Session',
      t('custom.deleteConfirmMessage', { name: session.title }) || `Are you sure you want to delete "${session.title}"?`,
      [
        { text: t('common.cancel') || 'Cancel', style: 'cancel' },
        {
          text: t('custom.delete') || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCustomSession(String(session.id));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await loadSavedSessions();
            } catch (error) {
              logger.error('Error deleting session:', error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert(
                t('custom.deleteError') || 'Error',
                t('custom.deleteFailed') || 'Failed to delete session. Please try again.',
                [{ text: t('common.ok') || 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const handleLongPressSavedSession = (session: SavedCustomSession) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      session.title,
      t('custom.sessionOptions') || 'What would you like to do?',
      [
        { text: t('custom.editSession') || 'Edit', onPress: () => handleEditSavedSession(session) },
        { text: t('custom.deleteSession') || 'Delete', onPress: () => handleDeleteSavedSession(session), style: 'destructive' },
        { text: t('common.cancel') || 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Render icon box with consistent styling
  const renderIconBox = (iconName: keyof typeof Ionicons.glyphMap, colorSet: { bg: string; icon: string }, size: number = 40) => (
    <View style={[styles.iconBox, { backgroundColor: colorSet.bg, width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name={iconName} size={size * 0.5} color={colorSet.icon} />
    </View>
  );

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={dynamicStyles.backIcon} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.title, dynamicStyles.title]}>{t('custom.title')}</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>{t('custom.subtitle')}</Text>
          </View>
        </View>

        {/* My Saved Sessions */}
        {savedSessions.length > 0 && (
          <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
            <View style={styles.sectionHeader}>
              {renderIconBox('bookmark', iconColors.purple)}
              <View style={styles.sectionHeaderText}>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                  {t('custom.mySavedSessions')}
                </Text>
                <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>
                  {t('custom.savedSessionsHint') || 'Tap to start, hold for options'}
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.savedSessionsScroll}
            >
              {savedSessions.map((session) => (
                <Pressable
                  key={session.id}
                  onPress={() => onStartSession(session.config)}
                  onLongPress={() => handleLongPressSavedSession(session)}
                  style={({ pressed }) => [
                    styles.savedSessionCard,
                    {
                      backgroundColor: dynamicStyles.optionBg,
                      borderColor: dynamicStyles.optionBorder,
                      opacity: pressed ? 0.8 : 1,
                    }
                  ]}
                >
                  <View style={styles.savedSessionContent}>
                    <View style={styles.savedSessionHeader}>
                      <Text style={[styles.savedSessionName, { color: colors.text.primary }]} numberOfLines={1}>
                        {session.title}
                      </Text>
                      <View style={[styles.savedSessionBadge, { backgroundColor: iconColors.emerald.bg }]}>
                        <Ionicons name="play" size={10} color={iconColors.emerald.icon} />
                      </View>
                    </View>
                    <Text style={[styles.savedSessionMeta, { color: colors.text.secondary }]}>
                      {session.config.durationMinutes} {t('custom.min')}
                    </Text>
                    <Text style={[styles.savedSessionMeta, { color: colors.text.tertiary }]} numberOfLines={1}>
                      {getAmbientSoundLabel(session.config.ambientSound)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </GradientCard>
        )}

        {/* Session Name */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.sectionHeader}>
            {renderIconBox('create-outline', iconColors.indigo)}
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.sessionName')}</Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>
                {t('custom.sessionNameHint') || 'Optional - for saving'}
              </Text>
            </View>
          </View>
          <TextInput
            style={[styles.textInput, dynamicStyles.textInput]}
            placeholder={t('custom.sessionNamePlaceholder')}
            value={sessionName}
            onChangeText={setSessionName}
            placeholderTextColor={colors.text.tertiary}
          />
        </GradientCard>

        {/* Duration Selection */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.sectionHeader}>
            {renderIconBox('time-outline', iconColors.amber)}
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.duration')}</Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>{t('custom.durationDescription')}</Text>
            </View>
          </View>

          <View style={styles.optionsGrid}>
            {DURATION_PRESETS.map((minutes) => {
              const isActive = durationMinutes === minutes;
              return (
                <Pressable
                  key={minutes}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDurationMinutes(minutes);
                    setCustomDuration('');
                  }}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: isActive ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                      borderColor: isActive ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                    }
                  ]}
                >
                  <Text style={[
                    styles.optionButtonText,
                    { color: isActive ? brandColors.purple.primary : colors.text.primary }
                  ]}>
                    {minutes}
                  </Text>
                  <Text style={[
                    styles.optionButtonLabel,
                    { color: isActive ? brandColors.purple.primary : colors.text.secondary }
                  ]}>
                    {t('custom.min')}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.customInputRow}>
            <Text style={[styles.label, dynamicStyles.label]}>{t('custom.customDuration')}</Text>
            <TextInput
              style={[styles.smallInput, dynamicStyles.textInput]}
              placeholder="0"
              value={customDuration}
              onChangeText={handleCustomDurationChange}
              keyboardType="number-pad"
              maxLength={3}
              placeholderTextColor={colors.text.tertiary}
            />
            <Text style={[styles.label, dynamicStyles.label]}>{t('custom.min')}</Text>
          </View>

          <View style={[styles.currentValueBadge, { backgroundColor: isDark ? primaryColor.transparent[20] : primaryColor.transparent[10] }]}>
            <Ionicons name="checkmark-circle" size={16} color={brandColors.purple.primary} />
            <Text style={[styles.currentValueText, dynamicStyles.currentValue]}>
              {durationMinutes} {t('custom.min')} {t('custom.selected')}
            </Text>
          </View>
        </GradientCard>

        {/* Breathing Pattern Selection */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.sectionHeader}>
            {renderIconBox('fitness-outline', iconColors.emerald)}
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.breathingPattern')}</Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>
                {t('custom.breathingPatternDescription')}
              </Text>
            </View>
          </View>

          <View style={styles.breathingGrid}>
            {BREATHING_PATTERNS.map((pattern) => {
              const isActive = breathingPattern === pattern.id;
              const patternColors = {
                'none': iconColors.purple,
                'box': iconColors.indigo,
                '4-7-8': iconColors.sky,
                'equal': iconColors.teal,
                'calm': iconColors.emerald,
                'custom': iconColors.amber,
              };
              const colorSet = patternColors[pattern.id];
              return (
                <Pressable
                  key={pattern.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setBreathingPattern(pattern.id);
                  }}
                  style={[
                    styles.breathingOption,
                    {
                      backgroundColor: isActive ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                      borderColor: isActive ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                    }
                  ]}
                >
                  <View style={[styles.breathingIconBox, { backgroundColor: colorSet.bg }]}>
                    <Ionicons name={pattern.icon} size={22} color={isActive ? brandColors.purple.primary : colorSet.icon} />
                  </View>
                  <Text style={[
                    styles.breathingLabel,
                    { color: isActive ? brandColors.purple.primary : colors.text.primary }
                  ]} numberOfLines={1}>
                    {t(pattern.labelKey)}
                  </Text>
                  <Text style={[
                    styles.breathingDescription,
                    { color: colors.text.tertiary }
                  ]} numberOfLines={2}>
                    {t(pattern.descriptionKey)}
                  </Text>
                  {isActive && (
                    <View style={[styles.selectedIndicator, { backgroundColor: brandColors.purple.primary }]}>
                      <Ionicons name="checkmark" size={10} color="white" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Custom Breathing Pattern Inputs */}
          {breathingPattern === 'custom' && (
            <View style={styles.customBreathingContainer}>
              <Text style={[styles.label, dynamicStyles.label, { marginBottom: theme.spacing.md }]}>
                {t('custom.customBreathingTitle')}
              </Text>
              <View style={styles.customBreathingGrid}>
                <View style={styles.customBreathingInput}>
                  <Text style={[styles.customBreathingLabel, { color: colors.text.secondary }]}>
                    {t('custom.inhale')}
                  </Text>
                  <TextInput
                    style={[styles.breathingTimeInput, dynamicStyles.textInput]}
                    value={String(customBreathing.inhale)}
                    onChangeText={(text) => {
                      const val = parseInt(text, 10);
                      if (!isNaN(val) && val >= 1 && val <= 20) {
                        setCustomBreathing({ ...customBreathing, inhale: val });
                      } else if (text === '') {
                        setCustomBreathing({ ...customBreathing, inhale: 1 });
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholderTextColor={colors.text.tertiary}
                  />
                  <Text style={[styles.customBreathingUnit, { color: colors.text.tertiary }]}>s</Text>
                </View>
                <View style={styles.customBreathingInput}>
                  <Text style={[styles.customBreathingLabel, { color: colors.text.secondary }]}>
                    {t('custom.hold')} 1
                  </Text>
                  <TextInput
                    style={[styles.breathingTimeInput, dynamicStyles.textInput]}
                    value={String(customBreathing.hold1)}
                    onChangeText={(text) => {
                      const val = parseInt(text, 10);
                      if (!isNaN(val) && val >= 0 && val <= 20) {
                        setCustomBreathing({ ...customBreathing, hold1: val });
                      } else if (text === '') {
                        setCustomBreathing({ ...customBreathing, hold1: 0 });
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholderTextColor={colors.text.tertiary}
                  />
                  <Text style={[styles.customBreathingUnit, { color: colors.text.tertiary }]}>s</Text>
                </View>
                <View style={styles.customBreathingInput}>
                  <Text style={[styles.customBreathingLabel, { color: colors.text.secondary }]}>
                    {t('custom.exhale')}
                  </Text>
                  <TextInput
                    style={[styles.breathingTimeInput, dynamicStyles.textInput]}
                    value={String(customBreathing.exhale)}
                    onChangeText={(text) => {
                      const val = parseInt(text, 10);
                      if (!isNaN(val) && val >= 1 && val <= 20) {
                        setCustomBreathing({ ...customBreathing, exhale: val });
                      } else if (text === '') {
                        setCustomBreathing({ ...customBreathing, exhale: 1 });
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholderTextColor={colors.text.tertiary}
                  />
                  <Text style={[styles.customBreathingUnit, { color: colors.text.tertiary }]}>s</Text>
                </View>
                <View style={styles.customBreathingInput}>
                  <Text style={[styles.customBreathingLabel, { color: colors.text.secondary }]}>
                    {t('custom.hold')} 2
                  </Text>
                  <TextInput
                    style={[styles.breathingTimeInput, dynamicStyles.textInput]}
                    value={String(customBreathing.hold2)}
                    onChangeText={(text) => {
                      const val = parseInt(text, 10);
                      if (!isNaN(val) && val >= 0 && val <= 20) {
                        setCustomBreathing({ ...customBreathing, hold2: val });
                      } else if (text === '') {
                        setCustomBreathing({ ...customBreathing, hold2: 0 });
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholderTextColor={colors.text.tertiary}
                  />
                  <Text style={[styles.customBreathingUnit, { color: colors.text.tertiary }]}>s</Text>
                </View>
              </View>
              <View style={[styles.currentValueBadge, { backgroundColor: isDark ? primaryColor.transparent[20] : primaryColor.transparent[10], marginTop: theme.spacing.md }]}>
                <Ionicons name="timer-outline" size={16} color={brandColors.purple.primary} />
                <Text style={[styles.currentValueText, dynamicStyles.currentValue]}>
                  {customBreathing.inhale}-{customBreathing.hold1}-{customBreathing.exhale}-{customBreathing.hold2}s {t('custom.cycle')}
                </Text>
              </View>
            </View>
          )}
        </GradientCard>

        {/* Ambient Sound Selection */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.sectionHeader}>
            {renderIconBox('musical-notes-outline', iconColors.rose)}
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.ambientSound')}</Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>{t('custom.ambientDescription')}</Text>
            </View>
          </View>

          <View style={styles.ambientGrid}>
            {ambientSoundOptions.map((option) => {
              const isActive = ambientSound === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setAmbientSound(option.id as CustomSessionConfig['ambientSound']);
                    playPreviewSound();
                  }}
                  style={[
                    styles.ambientOption,
                    {
                      backgroundColor: isActive ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                      borderColor: isActive ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                    }
                  ]}
                >
                  <View style={[styles.ambientIconBox, { backgroundColor: option.color.bg }]}>
                    <Ionicons name={option.icon} size={24} color={isActive ? brandColors.purple.primary : option.color.icon} />
                  </View>
                  <Text style={[
                    styles.ambientLabel,
                    { color: isActive ? brandColors.purple.primary : colors.text.primary }
                  ]} numberOfLines={1}>
                    {option.label}
                  </Text>
                  {isActive && (
                    <View style={[styles.selectedIndicator, { backgroundColor: brandColors.purple.primary }]}>
                      <Ionicons name="checkmark" size={10} color="white" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </GradientCard>

        {/* Interval Bell */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.switchRow}>
            <View style={styles.switchRowLeft}>
              {renderIconBox('notifications-outline', iconColors.teal)}
              <View style={styles.switchRowText}>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.intervalBell')}</Text>
                <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>
                  {t('custom.intervalBellDescription')}
                </Text>
              </View>
            </View>
            <Switch
              value={intervalBellEnabled}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIntervalBellEnabled(value);
              }}
              trackColor={{
                false: dynamicStyles.switchTrackFalse,
                true: dynamicStyles.switchTrackTrue,
              }}
              thumbColor={colors.neutral.white}
            />
          </View>

          {intervalBellEnabled && (
            <View style={styles.intervalOptionsContainer}>
              <Text style={[styles.label, dynamicStyles.label, { marginBottom: theme.spacing.sm }]}>{t('custom.intervalEvery')}</Text>
              <View style={styles.intervalPresets}>
                {INTERVAL_PRESETS.map((minutes) => {
                  const isActive = intervalBellMinutes === minutes && !customInterval;
                  return (
                    <Pressable
                      key={minutes}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setIntervalBellMinutes(minutes);
                        setCustomInterval('');
                      }}
                      style={[
                        styles.smallOptionButton,
                        {
                          backgroundColor: isActive ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                          borderColor: isActive ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                        }
                      ]}
                    >
                      <Text style={[
                        styles.smallOptionText,
                        { color: isActive ? brandColors.purple.primary : colors.text.primary }
                      ]}>
                        {minutes} {t('custom.min')}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.customInputRow}>
                <Text style={[styles.label, dynamicStyles.label]}>{t('custom.customInterval')}</Text>
                <TextInput
                  style={[styles.smallInput, dynamicStyles.textInput]}
                  placeholder="0"
                  value={customInterval}
                  onChangeText={handleCustomIntervalChange}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholderTextColor={colors.text.tertiary}
                />
                <Text style={[styles.label, dynamicStyles.label]}>{t('custom.min')}</Text>
              </View>
            </View>
          )}
        </GradientCard>

        {/* Wake-up Chime */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.switchRow}>
            <View style={styles.switchRowLeft}>
              {renderIconBox('alarm-outline', iconColors.sky)}
              <View style={styles.switchRowText}>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.wakeUpChime')}</Text>
                <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>
                  {t('custom.wakeUpChimeDescription')}
                </Text>
              </View>
            </View>
            <Switch
              value={wakeUpChimeEnabled}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setWakeUpChimeEnabled(value);
              }}
              trackColor={{
                false: dynamicStyles.switchTrackFalse,
                true: dynamicStyles.switchTrackTrue,
              }}
              thumbColor={colors.neutral.white}
            />
          </View>
        </GradientCard>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {(editSessionId || localEditSessionId) ? (
            <GradientButton
              title={t('custom.updateSession') || 'Update Session'}
              onPress={handleSaveSession}
              gradient={themeGradients.button.primary}
              style={styles.actionButton}
            />
          ) : (
            <>
              <GradientButton
                title={t('custom.saveSession') || 'Save Session'}
                onPress={handleSaveSession}
                gradient={themeGradients.button.primary}
                style={styles.actionButton}
              />
              <GradientButton
                title={t('custom.saveAndStart') || 'Save & Start'}
                onPress={handleSaveAndStart}
                gradient={themeGradients.button.primary}
                style={styles.actionButton}
              />
            </>
          )}
        </View>

        {/* Quick Start Button */}
        <Pressable onPress={handleStartSession} style={styles.quickStartButton}>
          <Text style={[styles.quickStartText, dynamicStyles.quickStartText]}>
            {t('custom.startWithoutSaving') || 'Start without saving'}
          </Text>
        </Pressable>
      </ScrollView>
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
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  backButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionHeaderText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: theme.typography.fontSizes.sm,
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '23%',
    aspectRatio: 0.72,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing.md,
  },
  optionButtonText: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  optionButtonLabel: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  smallInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    width: 70,
    textAlign: 'center',
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
  },
  currentValueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    gap: theme.spacing.xs,
  },
  currentValueText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  ambientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  ambientOption: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    position: 'relative',
  },
  ambientIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  ambientLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  switchRowText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  intervalOptionsContainer: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  intervalPresets: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  smallOptionButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
  },
  smallOptionText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  quickStartButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  quickStartText: {
    fontSize: theme.typography.fontSizes.sm,
    textDecorationLine: 'underline',
  },
  savedSessionsScroll: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  savedSessionCard: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    width: 130,
    padding: theme.spacing.md,
  },
  savedSessionContent: {
    flex: 1,
  },
  savedSessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  savedSessionName: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  savedSessionBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedSessionMeta: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
  breathingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  breathingOption: {
    width: '31%',
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    position: 'relative',
    minHeight: 110,
  },
  breathingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  breathingLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
    marginBottom: 2,
  },
  breathingDescription: {
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
  },
  customBreathingContainer: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  customBreathingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  customBreathingInput: {
    width: '48%',
    alignItems: 'center',
  },
  customBreathingLabel: {
    fontSize: theme.typography.fontSizes.xs,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },
  breathingTimeInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    width: 60,
    textAlign: 'center',
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
  },
  customBreathingUnit: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
});
