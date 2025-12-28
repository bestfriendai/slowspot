/**
 * WeeklyActivityChart - Weekly meditation activity visualization
 * Extracted from ProfileScreen for better code organization
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { GradientCard } from '../GradientCard';
import theme from '../../theme';

interface WeeklyActivityData {
  dayKey: string;
  dayLabel: string;
  sessions: number;
  minutes: number;
  date: Date;
}

interface WeeklyActivityChartProps {
  weeklyActivity: WeeklyActivityData[];
  primaryColor: string;
  themeGradients: {
    card: {
      whiteCard: readonly [string, string];
    };
  };
  isDark: boolean;
  colors: {
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    background: {
      tertiary: string;
    };
    border: {
      light: string;
    };
  };
  iconBgBlue: string;
  iconBlue: string;
  cardShadow: object;
}

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  weeklyActivity,
  primaryColor,
  themeGradients,
  isDark,
  colors,
  iconBgBlue,
  iconBlue,
  cardShadow,
}) => {
  const { t } = useTranslation();

  const maxMinutes = Math.max(...weeklyActivity.map((d) => d.minutes), 1);
  const totalSessions = weeklyActivity.reduce((sum, d) => sum + d.sessions, 0);
  const totalMinutes = weeklyActivity.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <View style={styles.weeklyActivityContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        {t('profile.weeklyActivity')}
      </Text>
      <GradientCard
        gradient={themeGradients.card.whiteCard}
        style={[styles.weeklyActivityCard, cardShadow]}
        isDark={isDark}
      >
        {/* Header */}
        <View style={styles.weeklyActivityHeader}>
          <View style={[styles.iconBox, { backgroundColor: iconBgBlue }]}>
            <Ionicons name="bar-chart" size={24} color={iconBlue} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
              {t('profile.weeklyActivity')}
            </Text>
            <Text style={[styles.cardDescription, { color: colors.text.secondary }]}>
              {t('profile.weeklyActivityDescription')}
            </Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          {weeklyActivity.map((day, index) => {
            const barHeight = day.minutes > 0 ? Math.max((day.minutes / maxMinutes) * 100, 8) : 4;
            const isToday = index === weeklyActivity.length - 1;

            return (
              <View key={day.dayKey + index} style={styles.chartBar}>
                <View style={styles.chartBarContainer}>
                  <View
                    style={[
                      styles.chartBarFill,
                      {
                        height: `${barHeight}%`,
                        backgroundColor:
                          day.minutes > 0
                            ? isToday
                              ? primaryColor
                              : `${primaryColor}99`
                            : isDark
                              ? colors.background.tertiary
                              : '#E5E5E7',
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.chartDayLabel,
                    { color: isToday ? primaryColor : colors.text.secondary },
                  ]}
                >
                  {day.dayLabel}
                </Text>
                {day.minutes > 0 && (
                  <Text style={[styles.chartMinuteLabel, { color: colors.text.tertiary }]}>
                    {day.minutes}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Weekly Summary */}
        <View
          style={[
            styles.weeklySummary,
            { borderTopColor: isDark ? colors.border.light : '#E5E5E7' },
          ]}
        >
          <View style={styles.weeklySummaryItem}>
            <Text style={[styles.weeklySummaryValue, { color: colors.text.primary }]}>
              {totalSessions}
            </Text>
            <Text style={[styles.weeklySummaryLabel, { color: colors.text.secondary }]}>
              {t('profile.sessions')}
            </Text>
          </View>
          <View
            style={[
              styles.weeklySummaryDivider,
              { backgroundColor: isDark ? colors.border.light : '#E5E5E7' },
            ]}
          />
          <View style={styles.weeklySummaryItem}>
            <Text style={[styles.weeklySummaryValue, { color: colors.text.primary }]}>
              {totalMinutes}
            </Text>
            <Text style={[styles.weeklySummaryLabel, { color: colors.text.secondary }]}>
              {t('profile.minutes')}
            </Text>
          </View>
        </View>
      </GradientCard>
    </View>
  );
};

const styles = StyleSheet.create({
  weeklyActivityContainer: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginBottom: theme.spacing.md,
  },
  weeklyActivityCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
  },
  weeklyActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
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
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: theme.spacing.xs,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  chartBarContainer: {
    flex: 1,
    width: '70%',
    maxWidth: 32,
    justifyContent: 'flex-end',
    borderRadius: 6,
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4,
  },
  chartDayLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    marginTop: 4,
  },
  chartMinuteLabel: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeights.regular,
  },
  weeklySummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    gap: theme.spacing.xl,
  },
  weeklySummaryItem: {
    alignItems: 'center',
    gap: 2,
  },
  weeklySummaryValue: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  weeklySummaryLabel: {
    fontSize: theme.typography.fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weeklySummaryDivider: {
    width: 1,
    height: 32,
  },
});
