import { logger } from '../utils/logger';
/**
 * Instructions Screen
 * Meditation techniques and session building guides
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { brandColors, primaryColor, neutralColors, backgrounds } from '../theme/colors';
import { MeditationIntroGuide } from '../components/MeditationIntroGuide';
// Using primaryColor.transparent for consistent brand color opacity

// Pattern configuration for breathing animations
const patternConfig = {
  'box': {
    phases: ['inhale', 'hold', 'exhale', 'rest'] as const,
    durations: [4000, 4000, 4000, 4000],
  },
  '4-7-8': {
    phases: ['inhale', 'hold', 'exhale'] as const,
    durations: [4000, 7000, 8000],
  },
  'equal': {
    phases: ['inhale', 'exhale'] as const,
    durations: [4000, 4000],
  },
  'calm': {
    phases: ['inhale', 'exhale'] as const,
    durations: [2000, 2000],
  },
};

interface Technique {
  id: string;
  translationKey: string;
}

// Technique IDs mapped to translation keys
const TECHNIQUE_KEYS: Technique[] = [
  { id: 'body_scan', translationKey: 'bodyScan' },
  { id: 'breath_focus', translationKey: 'breathFocus' },
  { id: 'loving_kindness', translationKey: 'lovingKindness' },
  { id: 'mindful_observation', translationKey: 'mindfulObservation' },
];

// Session guide IDs mapped to translation keys
const SESSION_GUIDE_KEYS = ['simple12Min', 'deepRelaxation'];

// Breathing exercise patterns with icons
interface BreathingPattern {
  id: string;
  translationKey: string;
  icon: string;
  pattern: string;
}

const BREATHING_PATTERNS: BreathingPattern[] = [
  { id: 'box', translationKey: 'box', icon: 'shield-checkmark', pattern: '4-4-4-4' },
  { id: '4-7-8', translationKey: '478', icon: 'moon-outline', pattern: '4-7-8' },
  { id: 'equal', translationKey: 'equal', icon: 'leaf-outline', pattern: '4-4' },
  { id: 'calm', translationKey: 'calm', icon: 'flash-outline', pattern: '2-2' },
];

interface Props {
  isDark?: boolean;
  navigation: any;
}

const InstructionsScreen: React.FC<Props> = ({ isDark = false, navigation }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Breathing exercise modal state
  const [breathingModalVisible, setBreathingModalVisible] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<'box' | '4-7-8' | 'equal' | 'calm'>('box');
  const [breathingActive, setBreathingActive] = useState(false);

  // Full intro modal state
  const [fullIntroModalVisible, setFullIntroModalVisible] = useState(false);

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Open breathing modal with specific pattern
  const openBreathingModal = (patternId: string) => {
    setSelectedPattern(patternId as 'box' | '4-7-8' | 'equal' | 'calm');
    setBreathingActive(false);
    setBreathingModalVisible(true);
  };

  // Close breathing modal
  const closeBreathingModal = () => {
    setBreathingActive(false);
    setBreathingModalVisible(false);
  };

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    sectionTitle: { color: colors.text.primary },
    card: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
      shadowColor: isDark ? '#000' : '#000',
      shadowOpacity: isDark ? 0.3 : 0.1,
    },
    cardTitle: { color: brandColors.purple.primary },
    cardDescription: { color: colors.text.secondary },
    duration: { color: colors.text.tertiary },
    stepNumber: {
      backgroundColor: isDark ? primaryColor.transparent[20] : primaryColor.transparent[10],
    },
    stepNumberText: { color: brandColors.purple.primary },
    stepText: { color: colors.text.primary },
    buildingIntro: { color: colors.text.secondary },
    structureText: { color: colors.text.primary },
  }), [colors, isDark]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={themeGradients.screen.home.colors}
        start={themeGradients.screen.home.start}
        end={themeGradients.screen.home.end}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, dynamicStyles.title]}>{t('instructionsScreen.title')}</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
              {t('instructionsScreen.subtitle')}
            </Text>
          </View>

          {/* Featured Section: Full Introduction for Beginners */}
          <TouchableOpacity
            style={[styles.featuredCard, dynamicStyles.card]}
            onPress={() => setFullIntroModalVisible(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[brandColors.purple.light, brandColors.purple.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredContent}>
                <View style={styles.featuredIconBox}>
                  <Ionicons name="sparkles" size={32} color={neutralColors.white} />
                </View>
                <View style={styles.featuredTextContainer}>
                  <Text style={styles.featuredTitle}>
                    {t('instructionsScreen.featuredIntro.title', 'Wprowadzenie do Medytacji')}
                  </Text>
                  <Text style={styles.featuredDescription}>
                    {t('instructionsScreen.featuredIntro.description', 'Interaktywny przewodnik krok po kroku. Idealny dla początkujących lub gdy chcesz odświeżyć podstawy.')}
                  </Text>
                </View>
                <View style={styles.featuredArrow}>
                  <Ionicons name="chevron-forward" size={24} color={neutralColors.white} />
                </View>
              </View>
              <View style={styles.featuredBadge}>
                <Ionicons name="time-outline" size={14} color={neutralColors.white} />
                <Text style={styles.featuredBadgeText}>
                  {t('instructionsScreen.featuredIntro.duration', '~5 min')}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Full Intro Modal */}
          <Modal
            visible={fullIntroModalVisible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setFullIntroModalVisible(false)}
          >
            <MeditationIntroGuide
              onClose={() => setFullIntroModalVisible(false)}
              isDark={isDark}
            />
          </Modal>

          {/* Breathing Exercises Section - Moved up for quick access */}
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            {t('instructionsScreen.breathingSection')}
          </Text>
          <Text style={[styles.buildingIntro, dynamicStyles.buildingIntro]}>
            {t('instructionsScreen.breathingIntro')}
          </Text>

          {BREATHING_PATTERNS.map((pattern) => {
            const steps = t(`instructionsScreen.breathingExercises.${pattern.translationKey}.steps`, { returnObjects: true }) as string[];
            return (
              <View key={pattern.id} style={[styles.card, dynamicStyles.card]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.breathingIconBox, { backgroundColor: isDark ? primaryColor.transparent[20] : primaryColor.transparent[10] }]}>
                    <Ionicons name={pattern.icon as any} size={24} color={brandColors.purple.primary} />
                  </View>
                  <View style={styles.breathingTitleContainer}>
                    <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                      {t(`instructionsScreen.breathingExercises.${pattern.translationKey}.name`)}
                    </Text>
                    <Text style={[styles.breathingPattern, dynamicStyles.duration]}>
                      {pattern.pattern}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                  {t(`instructionsScreen.breathingExercises.${pattern.translationKey}.description`)}
                </Text>

                <View style={styles.stepsContainer}>
                  {Array.isArray(steps) && steps.map((step, index) => (
                    <View key={index} style={styles.stepRow}>
                      <View style={[styles.stepNumber, dynamicStyles.stepNumber]}>
                        <Text style={[styles.stepNumberText, dynamicStyles.stepNumberText]}>{index + 1}</Text>
                      </View>
                      <Text style={[styles.stepText, dynamicStyles.stepText]}>{step}</Text>
                    </View>
                  ))}
                </View>

                {/* Try it button */}
                <TouchableOpacity
                  style={[styles.tryButton, { backgroundColor: isDark ? primaryColor.transparent[20] : primaryColor.transparent[10] }]}
                  onPress={() => openBreathingModal(pattern.id)}
                >
                  <Ionicons name="play-circle" size={20} color={brandColors.purple.primary} />
                  <Text style={[styles.tryButtonText, { color: brandColors.purple.primary }]}>
                    {t('instructionsScreen.tryExercise', 'Wypróbuj')}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={brandColors.purple.primary} />
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Techniques Section */}
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { marginTop: theme.spacing.xl }]}>{t('instructionsScreen.techniquesSection')}</Text>
          {TECHNIQUE_KEYS.map((technique) => {
            const steps = t(`instructionsScreen.techniques.${technique.translationKey}.steps`, { returnObjects: true }) as string[];
            return (
              <View key={technique.id} style={[styles.card, dynamicStyles.card]}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                  {t(`instructionsScreen.techniques.${technique.translationKey}.name`)}
                </Text>
                <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                  {t(`instructionsScreen.techniques.${technique.translationKey}.description`)}
                </Text>
                <Text style={[styles.duration, dynamicStyles.duration]}>
                  {t('instructionsScreen.duration', { duration: t(`instructionsScreen.techniques.${technique.translationKey}.duration`) })}
                </Text>

                <View style={styles.stepsContainer}>
                  {Array.isArray(steps) && steps.map((step, index) => (
                    <View key={index} style={styles.stepRow}>
                      <View style={[styles.stepNumber, dynamicStyles.stepNumber]}>
                        <Text style={[styles.stepNumberText, dynamicStyles.stepNumberText]}>{index + 1}</Text>
                      </View>
                      <Text style={[styles.stepText, dynamicStyles.stepText]}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          {/* Breathing Exercise Modal */}
          <Modal
            visible={breathingModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeBreathingModal}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white }]}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={closeBreathingModal} style={styles.modalCloseButton}>
                    <Ionicons name="close" size={24} color={colors.text.primary} />
                  </TouchableOpacity>
                  <View style={styles.modalHeaderCenter}>
                    <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                      {t(`instructionsScreen.breathingExercises.${BREATHING_PATTERNS.find(p => p.id === selectedPattern)?.translationKey}.name`)}
                    </Text>
                    <Text style={[styles.modalPatternInfo, { color: colors.text.secondary }]}>
                      {BREATHING_PATTERNS.find(p => p.id === selectedPattern)?.pattern}
                    </Text>
                  </View>
                  <View style={{ width: 24 }} />
                </View>

                {/* Pattern Selection - only show when not active */}
                {!breathingActive && (
                  <View style={styles.patternSelectionContainer}>
                    {BREATHING_PATTERNS.map((pattern) => (
                      <TouchableOpacity
                        key={pattern.id}
                        style={[
                          styles.patternCard,
                          {
                            backgroundColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.gray[50],
                            borderColor: selectedPattern === pattern.id
                              ? brandColors.purple.primary
                              : isDark ? colors.neutral.charcoal[50] : colors.neutral.gray[200],
                          },
                          selectedPattern === pattern.id && styles.patternCardSelected,
                        ]}
                        onPress={() => setSelectedPattern(pattern.id as 'box' | '4-7-8' | 'equal' | 'calm')}
                      >
                        <View style={[
                          styles.patternIconBox,
                          { backgroundColor: selectedPattern === pattern.id ? brandColors.purple.primary : (isDark ? primaryColor.transparent[20] : primaryColor.transparent[10]) }
                        ]}>
                          <Ionicons
                            name={pattern.icon as any}
                            size={18}
                            color={selectedPattern === pattern.id ? neutralColors.white : brandColors.purple.primary}
                          />
                        </View>
                        <View style={styles.patternTextContainer}>
                          <Text style={[styles.patternName, { color: colors.text.primary }]}>
                            {t(`instructionsScreen.breathingExercises.${pattern.translationKey}.name`)}
                          </Text>
                          <Text style={[styles.patternDesc, { color: colors.text.secondary }]}>
                            {pattern.pattern}
                          </Text>
                        </View>
                        {selectedPattern === pattern.id && (
                          <Ionicons name="checkmark-circle" size={22} color={brandColors.purple.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Animated Breathing Circle */}
                {breathingActive && (
                  <AnimatedBreathingCircle
                    isRunning={breathingActive}
                    pattern={selectedPattern}
                    isDark={isDark}
                    t={t}
                  />
                )}

                {/* Control Buttons */}
                <View style={styles.modalButtons}>
                  {!breathingActive ? (
                    <TouchableOpacity
                      style={styles.modalStartButton}
                      onPress={() => setBreathingActive(true)}
                    >
                      <LinearGradient
                        colors={[brandColors.purple.light, brandColors.purple.primary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalButtonGradient}
                      >
                        <Ionicons name="play" size={24} color={neutralColors.white} />
                        <Text style={styles.modalButtonText}>
                          {t('intention.breathing.start', 'Rozpocznij')}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.modalStopButton, { backgroundColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.gray[100] }]}
                      onPress={() => setBreathingActive(false)}
                    >
                      <Ionicons name="stop" size={24} color={colors.text.primary} />
                      <Text style={[styles.modalStopButtonText, { color: colors.text.primary }]}>
                        {t('intention.breathing.stop', 'Zakończ')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </Modal>

          {/* Session Building Section */}
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { marginTop: theme.spacing.xl }]}>
            {t('instructionsScreen.buildSessionSection')}
          </Text>
          <Text style={[styles.buildingIntro, dynamicStyles.buildingIntro]}>
            {t('instructionsScreen.buildSessionIntro')}
          </Text>

          {SESSION_GUIDE_KEYS.map((guideKey, index) => {
            const structure = t(`instructionsScreen.sessionGuides.${guideKey}.structure`, { returnObjects: true }) as string[];
            return (
              <View key={index} style={[styles.card, dynamicStyles.card]}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                  {t(`instructionsScreen.sessionGuides.${guideKey}.title`)}
                </Text>
                <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                  {t(`instructionsScreen.sessionGuides.${guideKey}.description`)}
                </Text>

                {Array.isArray(structure) && structure.map((item, idx) => (
                  <View key={idx} style={styles.structureItem}>
                    <Text style={[styles.structureText, dynamicStyles.structureText]}>• {item}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.neutral.charcoal[100],
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[600],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.neutral.charcoal[100],
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: brandColors.purple.primary,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[600],
    marginBottom: theme.spacing.sm,
  },
  duration: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral.gray[500],
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
  },
  stepsContainer: {
    marginTop: theme.spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: primaryColor.transparent[10],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  stepNumberText: {
    fontSize: theme.typography.fontSizes.sm,
    color: brandColors.purple.primary,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  stepText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[700],
    lineHeight: 22,
  },
  buildingIntro: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[600],
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  structureItem: {
    marginTop: theme.spacing.xs,
  },
  structureText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[700],
    lineHeight: 22,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  breathingIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingTitleContainer: {
    flex: 1,
  },
  breathingPattern: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: 2,
  },
  // Try button styles
  tryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  tryButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    flex: 1,
  },
  // Featured intro section styles
  featuredCard: {
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
    shadowColor: brandColors.purple.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  featuredGradient: {
    padding: theme.spacing.lg,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  featuredIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: neutralColors.white,
    marginBottom: theme.spacing.xxs,
  },
  featuredDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  featuredArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs,
    marginTop: theme.spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.sm,
  },
  featuredBadgeText: {
    fontSize: theme.typography.fontSizes.xs,
    color: neutralColors.white,
    fontWeight: theme.typography.fontWeights.medium,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: backgrounds.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
  },
  modalPatternInfo: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    marginTop: theme.spacing.xxs,
  },
  modalInstructions: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  modalInstructionText: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  modalStartButton: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  modalButtonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: neutralColors.white,
  },
  modalStopButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  modalStopButtonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  // Modal header center
  modalHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  // Pattern selection styles
  patternSelectionContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  patternCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    gap: theme.spacing.md,
  },
  patternCardSelected: {
    borderWidth: 2,
  },
  patternIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternTextContainer: {
    flex: 1,
  },
  patternName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginBottom: 2,
  },
  patternDesc: {
    fontSize: theme.typography.fontSizes.sm,
  },
  // Breathing animation styles
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginVertical: theme.spacing.lg,
  },
  breathingCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: brandColors.transparent.light25,
    borderWidth: 3,
    borderColor: brandColors.purple.primary,
  },
  breathingText: {
    position: 'absolute',
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
});

// Animated Breathing Circle Component
const AnimatedBreathingCircle: React.FC<{
  isRunning: boolean;
  pattern: 'box' | '4-7-8' | 'equal' | 'calm';
  isDark?: boolean;
  t: any;
}> = ({ isRunning, pattern, isDark, t }) => {
  const scale = useSharedValue(1);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');

  useEffect(() => {
    if (isRunning) {
      const config = patternConfig[pattern] || patternConfig['equal'];

      let phaseIndex = 0;
      let timeoutId: NodeJS.Timeout;

      const animatePhase = (phase: typeof config.phases[number], duration: number) => {
        if (phase === 'inhale') {
          scale.value = withTiming(1.5, { duration, easing: Easing.inOut(Easing.ease) });
        } else if (phase === 'exhale') {
          scale.value = withTiming(1, { duration, easing: Easing.inOut(Easing.ease) });
        }
      };

      const scheduleNextPhase = () => {
        const currentPhase = config.phases[phaseIndex];
        const currentPhaseDuration = config.durations[phaseIndex];

        setBreathingPhase(currentPhase);
        animatePhase(currentPhase, currentPhaseDuration);

        timeoutId = setTimeout(() => {
          phaseIndex = (phaseIndex + 1) % config.phases.length;
          scheduleNextPhase();
        }, currentPhaseDuration);
      };

      scheduleNextPhase();

      return () => clearTimeout(timeoutId);
    } else {
      scale.value = withTiming(1, { duration: 500 });
      setBreathingPhase('inhale');
    }
  }, [isRunning, pattern]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getPhaseText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return t('meditation.breatheIn', 'Wdech');
      case 'hold':
        return t('instructions.breathingPrep.hold', 'Trzymaj');
      case 'exhale':
        return t('meditation.breatheOut', 'Wydech');
      case 'rest':
        return t('instructions.breathingPrep.hold', 'Trzymaj');
      default:
        return t('instructions.breathingPrep.breathe', 'Oddychaj');
    }
  };

  return (
    <View style={styles.breathingContainer}>
      <Reanimated.View style={[styles.breathingCircleWrapper, animatedStyle]}>
        <View style={styles.breathingCircle} />
      </Reanimated.View>
      {isRunning && (
        <Text style={[styles.breathingText, { color: brandColors.purple.primary }]}>
          {getPhaseText()}
        </Text>
      )}
    </View>
  );
};

export default InstructionsScreen;
