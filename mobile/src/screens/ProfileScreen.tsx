import { logger } from '../utils/logger';
/**
 * ProfileScreen - User profile with session history and statistics
 *
 * Displays comprehensive user statistics, session history, custom session management,
 * and achievements tracking with gamification elements.
 * Uses extracted components for better code organization and maintainability.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import {
  ProfileHeader,
  ProfileStatsGrid,
  WeeklyActivityChart,
  SessionHistoryList,
  SessionDetailsModal,
} from '../components/profile';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { featureColorPalettes } from '../theme/colors';
import {
  getProgressStats,
  getCompletedSessions,
  getSessionsInRange,
  getTotalStreak,
  ProgressStats,
  CompletedSession,
} from '../services/progressTracker';
import { getAllSessions } from '../services/customSessionStorage';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { useUserProfile } from '../contexts/UserProfileContext';

interface ProfileScreenProps {
  isDark?: boolean;
  onNavigateToCustom?: () => void;
}

interface WeeklyActivityData {
  dayKey: string;
  dayLabel: string;
  sessions: number;
  minutes: number;
  date: Date;
}

const SESSIONS_PER_PAGE = 5;

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ isDark = false, onNavigateToCustom }) => {
  const { t, i18n } = useTranslation();
  const { currentTheme } = usePersonalization();
  const { userName, setUserName, isLoading: isProfileLoading } = useUserProfile();
  const currentLocale = i18n.language;

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    // Card shadows
    cardShadow: isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    statCardShadow: isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
      backgroundColor: 'transparent',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 10,
      backgroundColor: 'transparent',
    },
    // Icon box backgrounds
    iconBoxBg: isDark ? `rgba(${featureColorPalettes.emerald.rgb}, 0.25)` : `rgba(${featureColorPalettes.emerald.rgb}, 0.15)`,
    iconBoxBgBlue: isDark ? `rgba(${featureColorPalettes.indigo.rgb}, 0.25)` : `rgba(${featureColorPalettes.indigo.rgb}, 0.15)`,
    iconBoxBgOrange: isDark ? `rgba(${featureColorPalettes.amber.rgb}, 0.25)` : `rgba(${featureColorPalettes.amber.rgb}, 0.15)`,
    iconBoxBgPurple: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}26`,
    // Icon colors
    iconEmerald: isDark ? featureColorPalettes.emerald.darkIcon : featureColorPalettes.emerald.lightIcon,
    iconBlue: isDark ? featureColorPalettes.indigo.darkIcon : featureColorPalettes.indigo.lightIcon,
    iconOrange: isDark ? featureColorPalettes.amber.darkIcon : featureColorPalettes.amber.lightIcon,
    iconPurple: currentTheme.primary,
  }), [colors, isDark, currentTheme]);

  // Data state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<ProgressStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
  });
  const [totalStreakData, setTotalStreakData] = useState<{ total: number; imported: number }>({ total: 0, imported: 0 });
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityData[]>([]);
  const [customSessionCount, setCustomSessionCount] = useState(0);
  const [selectedSession, setSelectedSession] = useState<CompletedSession | null>(null);
  const [visibleSessionsCount, setVisibleSessionsCount] = useState(SESSIONS_PER_PAGE);

  /**
   * Get day labels for weekly activity chart
   */
  const getDayLabel = useCallback((dayIndex: number): string => {
    const dayKeys = ['daySun', 'dayMon', 'dayTue', 'dayWed', 'dayThu', 'dayFri', 'daySat'];
    return t(`profile.${dayKeys[dayIndex]}`);
  }, [t]);

  /**
   * Calculate weekly activity data
   */
  const calculateWeeklyActivity = useCallback(async (): Promise<WeeklyActivityData[]> => {
    const today = new Date();
    const weekData: WeeklyActivityData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const daySessions = await getSessionsInRange(date, endDate);
      const dayMinutes = Math.floor(
        daySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
      );

      weekData.push({
        dayKey: `day${date.getDay()}`,
        dayLabel: getDayLabel(date.getDay()),
        sessions: daySessions.length,
        minutes: dayMinutes,
        date: date,
      });
    }

    return weekData;
  }, [getDayLabel]);

  /**
   * Load all profile data
   */
  const loadProfileData = useCallback(async () => {
    try {
      const [progressStats, completedSessions, customSessions, weeklyData, streakData] = await Promise.all([
        getProgressStats(),
        getCompletedSessions(),
        getAllSessions(),
        calculateWeeklyActivity(),
        getTotalStreak(),
      ]);

      setStats(progressStats);
      setSessions(completedSessions.reverse()); // Most recent first
      setCustomSessionCount(customSessions.length);
      setWeeklyActivity(weeklyData);
      setTotalStreakData({ total: streakData.total, imported: streakData.imported });
    } catch (error) {
      logger.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [calculateWeeklyActivity]);

  /**
   * Initial data load
   */
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfileData();
  }, [loadProfileData]);

  /**
   * Name editing handlers
   */
  const handleStartEditName = useCallback(() => {
    setEditedName(userName || '');
    setIsEditingName(true);
  }, [userName]);

  const handleSaveName = useCallback(async () => {
    try {
      await setUserName(editedName.trim() || undefined);
      setIsEditingName(false);
    } catch (error) {
      logger.error('Failed to save name:', error);
    }
  }, [editedName, setUserName]);

  const handleCancelEditName = useCallback(() => {
    setIsEditingName(false);
    setEditedName('');
  }, []);

  /**
   * Session handlers
   */
  const handleSessionPress = useCallback((session: CompletedSession) => {
    setSelectedSession(session);
  }, []);

  const handleShowMore = useCallback(() => {
    setVisibleSessionsCount((prev) => prev + SESSIONS_PER_PAGE);
  }, []);

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentTheme.primary} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ResponsiveContainer scrollable scrollViewProps={{
        refreshControl: (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={currentTheme.primary}
          />
        )
      }} contentContainerStyle={styles.scrollContent}>

        {/* Header with editable name */}
        <ProfileHeader
          userName={userName}
          isEditing={isEditingName}
          editedName={editedName}
          primaryColor={currentTheme.primary}
          colors={colors}
          isDark={isDark}
          onStartEdit={handleStartEditName}
          onSave={handleSaveName}
          onCancel={handleCancelEditName}
          onNameChange={setEditedName}
        />

        {/* Statistics Grid */}
        <ProfileStatsGrid
          totalSessions={stats.totalSessions}
          totalMinutes={stats.totalMinutes}
          currentStreak={totalStreakData.total}
          longestStreak={Math.max(stats.longestStreak, totalStreakData.total)}
          themeGradients={themeGradients}
          isDark={isDark}
          colors={colors}
          iconColors={{
            emerald: dynamicStyles.iconEmerald,
            blue: dynamicStyles.iconBlue,
            orange: dynamicStyles.iconOrange,
            purple: dynamicStyles.iconPurple,
          }}
          iconBgColors={{
            emerald: dynamicStyles.iconBoxBg,
            blue: dynamicStyles.iconBoxBgBlue,
            orange: dynamicStyles.iconBoxBgOrange,
            purple: dynamicStyles.iconBoxBgPurple,
          }}
          cardShadow={dynamicStyles.statCardShadow}
        />

        {/* Weekly Activity Chart */}
        <WeeklyActivityChart
          weeklyActivity={weeklyActivity}
          primaryColor={currentTheme.primary}
          themeGradients={themeGradients}
          isDark={isDark}
          colors={colors}
          iconBgBlue={dynamicStyles.iconBoxBgBlue}
          iconBlue={dynamicStyles.iconBlue}
          cardShadow={dynamicStyles.cardShadow}
        />

        {/* Recent Sessions */}
        <SessionHistoryList
          sessions={sessions}
          visibleCount={visibleSessionsCount}
          primaryColor={currentTheme.primary}
          themeGradients={themeGradients}
          isDark={isDark}
          colors={colors}
          iconBgEmerald={dynamicStyles.iconBoxBg}
          iconEmerald={dynamicStyles.iconEmerald}
          cardShadow={dynamicStyles.cardShadow}
          currentLocale={currentLocale}
          onSessionPress={handleSessionPress}
          onShowMore={handleShowMore}
        />

        {/* Custom Sessions */}
        <View style={styles.customContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('profile.customSessions')}</Text>
          <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.customCard, dynamicStyles.cardShadow]} isDark={isDark}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBgBlue }]}>
                <Ionicons name="construct" size={24} color={currentTheme.primary} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                  {customSessionCount} {t('profile.saved')}
                </Text>
                <Text style={[styles.cardDescription, { color: colors.text.secondary }]}>
                  {t('profile.customSessions')}
                </Text>
              </View>
            </View>
            {onNavigateToCustom && (
              <TouchableOpacity
                style={[styles.customButton, { backgroundColor: currentTheme.primary }]}
                onPress={onNavigateToCustom}
                accessibilityLabel={t('profile.manageCustomSessions')}
                accessibilityRole="button"
              >
                <Ionicons name="arrow-forward-circle-outline" size={20} color={theme.colors.neutral.white} />
                <Text style={styles.customButtonText}>
                  {t('profile.manageCustomSessions')}
                </Text>
              </TouchableOpacity>
            )}
          </GradientCard>
        </View>
      </ResponsiveContainer>

      {/* Session Details Modal */}
      <SessionDetailsModal
        session={selectedSession}
        visible={selectedSession !== null}
        primaryColor={currentTheme.primary}
        themeGradients={themeGradients}
        isDark={isDark}
        colors={colors}
        iconColors={{
          emerald: dynamicStyles.iconEmerald,
          purple: dynamicStyles.iconPurple,
        }}
        iconBgColors={{
          emerald: dynamicStyles.iconBoxBg,
          blue: dynamicStyles.iconBoxBgBlue,
          purple: dynamicStyles.iconBoxBgPurple,
        }}
        cardShadow={dynamicStyles.cardShadow}
        currentLocale={currentLocale}
        onClose={() => setSelectedSession(null)}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: theme.layout.screenPadding,
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginBottom: theme.spacing.md,
  },
  customContainer: {
    gap: theme.spacing.md,
  },
  customCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    gap: theme.spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
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
    gap: 2,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: 20,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
  },
  customButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.neutral.white,
  },
});
