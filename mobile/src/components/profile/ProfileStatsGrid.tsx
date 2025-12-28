/**
 * ProfileStatsGrid - Statistics cards grid
 * Extracted from ProfileScreen for better code organization
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { GradientCard } from '../GradientCard';
import { ResponsiveGrid } from '../ResponsiveGrid';
import theme, { getThemeGradients } from '../../theme';

// Type for theme gradients returned by getThemeGradients
type ThemeGradients = ReturnType<typeof getThemeGradients>;

interface ProfileStatsGridProps {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  themeGradients: ThemeGradients;
  isDark: boolean;
  colors: {
    text: {
      primary: string;
      secondary: string;
    };
  };
  iconColors: {
    emerald: string;
    blue: string;
    orange: string;
    purple: string;
  };
  iconBgColors: {
    emerald: string;
    blue: string;
    orange: string;
    purple: string;
  };
  cardShadow: object;
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  suffix?: string;
  iconColor: string;
  iconBg: string;
  themeGradients: ThemeGradients;
  isDark: boolean;
  colors: {
    text: {
      primary: string;
      secondary: string;
    };
  };
  cardShadow: object;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  suffix,
  iconColor,
  iconBg,
  themeGradients,
  isDark,
  colors,
  cardShadow,
}) => (
  <View style={[styles.statCardWrapperInner, cardShadow]}>
    <GradientCard gradient={themeGradients.card.whiteCard} style={styles.statCard} isDark={isDark}>
      <View style={[styles.statIconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: colors.text.primary }]}>
          {value}
          {suffix && <Text style={[styles.statSuffix, { color: colors.text.secondary }]}> {suffix}</Text>}
        </Text>
        <Text style={[styles.statLabel, { color: colors.text.secondary }]}>{label}</Text>
      </View>
    </GradientCard>
  </View>
);

export const ProfileStatsGrid: React.FC<ProfileStatsGridProps> = ({
  totalSessions,
  totalMinutes,
  currentStreak,
  longestStreak,
  themeGradients,
  isDark,
  colors,
  iconColors,
  iconBgColors,
  cardShadow,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.statsContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        {t('profile.statistics')}
      </Text>
      <ResponsiveGrid
        columns={{ phone: 2, tablet: 4, desktop: 4 }}
        gap={theme.spacing.md}
        equalHeight
        itemAspectRatio={1}
      >
        <StatCard
          icon="checkmark-circle"
          value={totalSessions}
          label={t('profile.totalSessions')}
          iconColor={iconColors.emerald}
          iconBg={iconBgColors.emerald}
          themeGradients={themeGradients}
          isDark={isDark}
          colors={colors}
          cardShadow={cardShadow}
        />
        <StatCard
          icon="time"
          value={totalMinutes}
          label={t('profile.totalMinutes')}
          iconColor={iconColors.blue}
          iconBg={iconBgColors.blue}
          themeGradients={themeGradients}
          isDark={isDark}
          colors={colors}
          cardShadow={cardShadow}
        />
        <StatCard
          icon="flame"
          value={currentStreak}
          label={t('profile.currentStreak')}
          suffix={t('profile.days')}
          iconColor={iconColors.orange}
          iconBg={iconBgColors.orange}
          themeGradients={themeGradients}
          isDark={isDark}
          colors={colors}
          cardShadow={cardShadow}
        />
        <StatCard
          icon="trophy"
          value={longestStreak}
          label={t('profile.longestStreak')}
          suffix={t('profile.days')}
          iconColor={iconColors.purple}
          iconBg={iconBgColors.purple}
          themeGradients={themeGradients}
          isDark={isDark}
          colors={colors}
          cardShadow={cardShadow}
        />
      </ResponsiveGrid>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginBottom: theme.spacing.md,
  },
  statCardWrapperInner: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
  },
  statCard: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  statContent: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 36,
    fontWeight: theme.typography.fontWeights.bold,
    lineHeight: 40,
    textAlign: 'center',
  },
  statSuffix: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
  },
});
