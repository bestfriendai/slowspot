import { logger } from '../utils/logger';
import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeInDown,
  interpolate,
} from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { StreakBadge } from '../components/StreakBadge';
import theme, { getThemeColors, getThemeGradients, getCardStyles } from '../theme';
import { getSectionColors } from '../theme/colors';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { getGreetingKey, getSuggestionKey, getTimeIcon } from '../utils/greetings';
import { getProgressStats, ProgressStats } from '../services/progressTracker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HomeScreenProps {
  isDark?: boolean;
  onNavigateToMeditation: () => void;
  onNavigateToQuotes: () => void;
  onNavigateToCustom?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToInstructions?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  isDark = false,
  onNavigateToMeditation,
  onNavigateToQuotes,
  onNavigateToInstructions,
}) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<ProgressStats | null>(null);

  const { currentTheme, settings } = usePersonalization();

  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);
  const globalCardStyles = useMemo(() => getCardStyles(isDark), [isDark]);
  const sectionThemeColors = useMemo(() => getSectionColors(isDark), [isDark]);

  const greetingKey = useMemo(() => getGreetingKey(), []);
  const suggestionKey = useMemo(() => getSuggestionKey(), []);
  const timeIcon = useMemo(() => getTimeIcon(), []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const progressStats = await getProgressStats();
        setStats(progressStats);
      } catch (error) {
        logger.error('Failed to load stats:', error);
      }
    };
    loadStats();
  }, []);

  // Breathing animation for decorative rings
  const breatheProgress = useSharedValue(0);

  useEffect(() => {
    if (settings.animationsEnabled) {
      breatheProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      breatheProgress.value = 0;
    }
  }, [settings.animationsEnabled]);

  // Animated style for the card itself
  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(breatheProgress.value, [0, 1], [1, 1.01]) }],
  }));

  // Animated styles for decorative rings
  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(breatheProgress.value, [0, 1], [1, 1.15]) }],
    opacity: interpolate(breatheProgress.value, [0, 1], [0.15, 0.08]),
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(breatheProgress.value, [0, 1], [1, 1.25]) }],
    opacity: interpolate(breatheProgress.value, [0, 1], [0.1, 0.04]),
  }));

  const dynamicStyles = useMemo(() => ({
    // Main CTA card shadow - uses global primaryCta style with dynamic shadow color from currentTheme
    mainCardShadow: {
      ...globalCardStyles.primaryCta,
      shadowColor: currentTheme.gradient[0], // Use theme gradient color for glow effect
    },
    // Secondary card styles now come from globalCardStyles.secondary
    greetingText: { color: colors.text.primary },
    suggestionText: { color: colors.text.secondary },
  }), [colors, isDark, currentTheme, globalCardStyles]);

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Calm/Headspace inspired minimalist greeting */}
        <Animated.View
          entering={settings.animationsEnabled ? FadeInDown.delay(100).duration(600) : undefined}
          style={styles.header}
        >
          <View style={styles.greetingContainer}>
            {/* Time-based suggestion - subtle accent */}
            <View style={styles.suggestionPill}>
              <Ionicons
                name={timeIcon as any}
                size={14}
                color={currentTheme.primary}
              />
              <Text style={[styles.suggestionText, { color: currentTheme.primary }]}>
                {t(suggestionKey, 'Czas na chwilę spokoju')}
              </Text>
            </View>
            {/* Main greeting - hero typography */}
            <Text style={[styles.greetingText, dynamicStyles.greetingText]}>
              {t(greetingKey, 'Witaj')}
            </Text>
          </View>

          {stats && stats.currentStreak > 0 && (
            <Animated.View
              entering={settings.animationsEnabled ? FadeIn.delay(400).duration(500) : undefined}
            >
              <StreakBadge
                streak={stats.currentStreak}
                isDark={isDark}
                size="md"
                showLabel={true}
              />
            </Animated.View>
          )}
        </Animated.View>

        {/* Main CTA Card - Headspace style with decorative rings */}
        <Animated.View
          entering={settings.animationsEnabled ? FadeInDown.delay(200).duration(700) : undefined}
          style={styles.mainCardContainer}
        >
          {/* Decorative animated rings behind the card */}
          {settings.animationsEnabled && (
            <>
              <Animated.View
                style={[
                  styles.decorativeRing,
                  styles.ring1,
                  { borderColor: currentTheme.gradient[0] },
                  ring1Style
                ]}
              />
              <Animated.View
                style={[
                  styles.decorativeRing,
                  styles.ring2,
                  { borderColor: currentTheme.gradient[1] },
                  ring2Style
                ]}
              />
            </>
          )}

          <Animated.View style={breatheStyle}>
            <AnimatedPressable
              onPress={onNavigateToMeditation}
              style={[styles.mainCard, dynamicStyles.mainCardShadow]}
              pressScale={0.98}
              hapticType="medium"
              accessibilityLabel={t('home.meditate', 'Medytuj')}
            >
              <LinearGradient
                colors={[...currentTheme.gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainCardGradient}
              >
                <View style={styles.mainCardContent}>
                  <View style={styles.mainCardTextSection}>
                    <Text style={styles.mainCardLabel}>
                      {t('home.readyToMeditate', 'Gotowy na medytację?')}
                    </Text>
                    <Text style={styles.mainCardTitle}>
                      {t('home.meditate', 'Medytuj')}
                    </Text>
                    <View style={styles.mainCardCta}>
                      <Text style={styles.mainCardCtaText}>
                        {t('home.startNow', 'Rozpocznij')}
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.9)" />
                    </View>
                  </View>
                  <View style={styles.mainCardIconSection}>
                    {/* Decorative circles around the icon */}
                    <View style={styles.iconRingsContainer}>
                      <View style={[styles.iconRing, styles.iconRing1]} />
                      <View style={[styles.iconRing, styles.iconRing2]} />
                      <View style={styles.mainCardIconBg}>
                        <Ionicons name="leaf" size={36} color="rgba(255,255,255,0.95)" />
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>
        </Animated.View>

        {/* Section title */}
        <Animated.View
          entering={settings.animationsEnabled ? FadeInDown.delay(200).duration(500) : undefined}
          style={styles.sectionHeader}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            {t('home.explore', 'Odkrywaj')}
          </Text>
        </Animated.View>

        {/* Secondary Cards */}
        <Animated.View
          entering={settings.animationsEnabled ? FadeInDown.delay(250).duration(500) : undefined}
          style={styles.secondaryCards}
        >
          {/* Instructions Card - uses global cardStyles.secondary */}
          <AnimatedPressable
            onPress={onNavigateToInstructions || (() => {})}
            style={[styles.secondaryCard, globalCardStyles.secondary]}
            pressScale={0.98}
            hapticType="light"
            accessibilityLabel={t('home.instructions', 'Instrukcje')}
          >
            <View style={[styles.secondaryCardIcon, { backgroundColor: sectionThemeColors.instructions.background }]}>
              <Ionicons name="book-outline" size={22} color={sectionThemeColors.instructions.icon} />
            </View>
            <Text style={[styles.secondaryCardTitle, { color: colors.text.primary }]}>
              {t('home.instructions', 'Instrukcje')}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
          </AnimatedPressable>

          {/* Inspirations Card - uses global cardStyles.secondary */}
          <AnimatedPressable
            onPress={onNavigateToQuotes}
            style={[styles.secondaryCard, globalCardStyles.secondary]}
            pressScale={0.98}
            hapticType="light"
            accessibilityLabel={t('home.inspirations', 'Inspiracje')}
          >
            <View style={[styles.secondaryCardIcon, { backgroundColor: sectionThemeColors.inspirations.background }]}>
              <Ionicons name="sparkles-outline" size={22} color={sectionThemeColors.inspirations.icon} />
            </View>
            <Text style={[styles.secondaryCardTitle, { color: colors.text.primary }]}>
              {t('home.inspirations', 'Inspiracje')}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
          </AnimatedPressable>
        </Animated.View>
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
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },

  // Header - Modern minimalist style
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
  },
  greetingContainer: {
    flex: 1,
  },
  suggestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  suggestionText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingText: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    letterSpacing: -1,
    lineHeight: theme.typography.fontSizes.hero * 1.1,
  },

  // Main Card - Headspace inspired with decorative elements
  mainCardContainer: {
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  // Decorative animated rings behind the card
  decorativeRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 28,
  },
  ring1: {
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
  },
  ring2: {
    top: -16,
    left: -16,
    right: -16,
    bottom: -16,
  },
  mainCard: {
    // borderRadius, overflow, and shadows come from globalCardStyles.primaryCta via dynamicStyles.mainCardShadow
  },
  mainCardGradient: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  mainCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainCardTextSection: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  mainCardLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: theme.spacing.xs,
  },
  mainCardTitle: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.neutral.white,
    marginBottom: theme.spacing.md,
  },
  mainCardCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  mainCardCtaText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  mainCardIconSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Icon rings container for layered effect
  iconRingsContainer: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconRing1: {
    width: 88,
    height: 88,
  },
  iconRing2: {
    width: 100,
    height: 100,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  mainCardIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section
  sectionHeader: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Secondary Cards
  secondaryCards: {
    gap: theme.spacing.md,
  },
  secondaryCard: {
    // backgroundColor, borderRadius, and shadows come from globalCardStyles.secondary
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  secondaryCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCardTitle: {
    flex: 1,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
  },
});
