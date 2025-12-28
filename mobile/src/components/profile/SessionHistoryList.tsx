/**
 * SessionHistoryList - Session history with grouped sessions
 * Extracted from ProfileScreen for better code organization
 */

import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientCard } from '../GradientCard';
import { MoodIcon } from '../MoodIcon';
import { CompletedSession } from '../../services/progressTracker';
import theme from '../../theme';

interface GroupedSessions {
  today: CompletedSession[];
  yesterday: CompletedSession[];
  thisWeek: CompletedSession[];
  earlier: CompletedSession[];
}

interface SessionHistoryListProps {
  sessions: CompletedSession[];
  visibleCount: number;
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
      secondary: string;
      tertiary: string;
    };
  };
  iconBgEmerald: string;
  iconEmerald: string;
  cardShadow: object;
  currentLocale: string;
  onSessionPress: (session: CompletedSession) => void;
  onShowMore: () => void;
}

export const SessionHistoryList: React.FC<SessionHistoryListProps> = ({
  sessions,
  visibleCount,
  primaryColor,
  themeGradients,
  isDark,
  colors,
  iconBgEmerald,
  iconEmerald,
  cardShadow,
  currentLocale,
  onSessionPress,
  onShowMore,
}) => {
  const { t } = useTranslation();

  // Group sessions by date categories
  const groupedSessions = useMemo((): GroupedSessions => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups: GroupedSessions = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: [],
    };

    sessions.forEach((session) => {
      const sessionDate = new Date(session.date);
      const sessionDay = new Date(
        sessionDate.getFullYear(),
        sessionDate.getMonth(),
        sessionDate.getDate()
      );

      if (sessionDay.getTime() === today.getTime()) {
        groups.today.push(session);
      } else if (sessionDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(session);
      } else if (sessionDay >= weekAgo) {
        groups.thisWeek.push(session);
      } else {
        groups.earlier.push(session);
      }
    });

    return groups;
  }, [sessions]);

  // Get visible sessions
  const getVisibleSessions = useMemo(() => {
    const allSessions = [
      ...groupedSessions.today,
      ...groupedSessions.yesterday,
      ...groupedSessions.thisWeek,
      ...groupedSessions.earlier,
    ];
    return allSessions.slice(0, visibleCount);
  }, [groupedSessions, visibleCount]);

  const hasMoreSessions = sessions.length > visibleCount;

  // Format session time
  const formatSessionTime = useCallback(
    (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleTimeString(currentLocale, { hour: '2-digit', minute: '2-digit' });
    },
    [currentLocale]
  );

  // Format duration
  const formatDuration = useCallback(
    (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      return t('meditation.minutes', { count: minutes }) || `${minutes} min`;
    },
    [t]
  );

  const handleSessionPress = (session: CompletedSession) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSessionPress(session);
  };

  const handleShowMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onShowMore();
  };

  // Render session item
  const renderSessionItem = (session: CompletedSession) => (
    <TouchableOpacity
      key={`${session.id}-${session.date}`}
      style={[
        styles.sessionItemCard,
        {
          backgroundColor: isDark ? colors.background.secondary : '#FFFFFF',
          ...cardShadow,
        },
      ]}
      onPress={() => handleSessionPress(session)}
      activeOpacity={0.7}
      accessibilityLabel={`${session.title}, ${formatDuration(session.durationSeconds)}`}
      accessibilityRole="button"
    >
      <MoodIcon mood={session.mood} size="card" />
      <View style={styles.sessionInfo}>
        <Text style={[styles.sessionTitle, { color: colors.text.primary }]} numberOfLines={1}>
          {session.title}
        </Text>
        <View style={styles.sessionMeta}>
          <Text style={[styles.sessionTime, { color: colors.text.secondary }]}>
            {formatSessionTime(session.date)}
          </Text>
          <Text style={[styles.sessionDot, { color: colors.text.tertiary }]}> • </Text>
          <Text style={[styles.sessionDuration, { color: colors.text.secondary }]}>
            {formatDuration(session.durationSeconds)}
          </Text>
        </View>
      </View>
      {session.intention && (
        <Ionicons
          name="flag"
          size={14}
          color={primaryColor}
          style={styles.sessionIntentionBadge}
        />
      )}
      <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
    </TouchableOpacity>
  );

  // Render session group
  const renderSessionGroup = (title: string, groupSessions: CompletedSession[]) => {
    if (groupSessions.length === 0) return null;

    return (
      <View style={styles.sessionGroup}>
        <Text style={[styles.groupTitle, { color: colors.text.secondary }]}>{title}</Text>
        <View style={styles.sessionList}>
          {groupSessions.map((session) => renderSessionItem(session))}
        </View>
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <GradientCard
      gradient={themeGradients.card.whiteCard}
      style={[styles.historyCard, cardShadow]}
      isDark={isDark}
    >
      <View style={styles.emptyState}>
        <View style={[styles.emptyIconBox, { backgroundColor: iconBgEmerald }]}>
          <Ionicons name="leaf-outline" size={48} color={iconEmerald} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
          {t('profile.noSessionsYet')}
        </Text>
        <Text style={[styles.emptyMessage, { color: colors.text.secondary }]}>
          {t('profile.startMeditating')}
        </Text>
      </View>
    </GradientCard>
  );

  // Get visible grouped sessions
  const visibleGrouped = {
    today: getVisibleSessions.filter((s) => groupedSessions.today.includes(s)),
    yesterday: getVisibleSessions.filter((s) => groupedSessions.yesterday.includes(s)),
    thisWeek: getVisibleSessions.filter((s) => groupedSessions.thisWeek.includes(s)),
    earlier: getVisibleSessions.filter((s) => groupedSessions.earlier.includes(s)),
  };

  return (
    <View style={styles.historyContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        {t('profile.recentSessions')}
      </Text>
      {sessions.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.sessionsListContainer}>
          {renderSessionGroup(t('profile.today'), visibleGrouped.today)}
          {renderSessionGroup(t('profile.yesterday'), visibleGrouped.yesterday)}
          {renderSessionGroup(t('profile.thisWeek'), visibleGrouped.thisWeek)}
          {renderSessionGroup(t('profile.earlier'), visibleGrouped.earlier)}

          {hasMoreSessions && (
            <TouchableOpacity
              style={[
                styles.showMoreButton,
                { backgroundColor: isDark ? colors.background.tertiary : `${primaryColor}1A` },
              ]}
              onPress={handleShowMore}
              activeOpacity={0.7}
              accessibilityLabel={t('profile.showMore', 'Show more')}
              accessibilityRole="button"
            >
              <Text style={[styles.showMoreText, { color: primaryColor }]}>
                {t('profile.showMore') || 'Show more'} ({sessions.length - visibleCount})
              </Text>
              <Ionicons name="chevron-down" size={18} color={primaryColor} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginBottom: theme.spacing.md,
  },
  historyCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
  },
  sessionsListContainer: {
    gap: theme.spacing.md,
  },
  sessionGroup: {
    marginBottom: theme.spacing.lg,
  },
  groupTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sessionList: {
    gap: theme.spacing.sm,
  },
  sessionItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
  },
  sessionInfo: {
    flex: 1,
    gap: 2,
  },
  sessionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionTime: {
    fontSize: theme.typography.fontSizes.sm,
  },
  sessionDot: {
    fontSize: theme.typography.fontSizes.sm,
  },
  sessionDuration: {
    fontSize: theme.typography.fontSizes.sm,
  },
  sessionIntentionBadge: {
    marginRight: theme.spacing.xs,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.sm,
  },
  showMoreText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
  },
});
