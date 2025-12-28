/**
 * SessionDetailsModal - Modal showing detailed session information
 * Extracted from ProfileScreen for better code organization
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { GradientCard } from '../GradientCard';
import { MoodIcon, getMoodColors } from '../MoodIcon';
import { CompletedSession } from '../../services/progressTracker';
import theme from '../../theme';

interface SessionDetailsModalProps {
  session: CompletedSession | null;
  visible: boolean;
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
      primary: string;
    };
    border: {
      light: string;
    };
  };
  iconColors: {
    emerald: string;
    purple: string;
  };
  iconBgColors: {
    emerald: string;
    blue: string;
    purple: string;
  };
  cardShadow: object;
  currentLocale: string;
  onClose: () => void;
}

export const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  session,
  visible,
  primaryColor,
  themeGradients,
  isDark,
  colors,
  iconColors,
  iconBgColors,
  cardShadow,
  currentLocale,
  onClose,
}) => {
  const { t } = useTranslation();

  // Format full date with current locale
  const formatFullDate = useCallback(
    (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString(currentLocale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
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

  // Get mood label
  const getMoodLabel = (mood?: 1 | 2 | 3 | 4 | 5): string => {
    switch (mood) {
      case 1:
        return t('profile.mood1') || 'Very bad';
      case 2:
        return t('profile.mood2') || 'Bad';
      case 3:
        return t('profile.mood3') || 'Neutral';
      case 4:
        return t('profile.mood4') || 'Good';
      case 5:
        return t('profile.mood5') || 'Very good';
      default:
        return t('profile.noMoodRecorded') || 'Not recorded';
    }
  };

  if (!session) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: isDark ? colors.background.primary : '#F5F5F7' },
        ]}
      >
        {/* Modal Header */}
        <View
          style={[
            styles.modalHeader,
            { borderBottomColor: isDark ? colors.border.light : '#E5E5E7' },
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={styles.modalCloseButton}
            accessibilityLabel={t('common.close', 'Close')}
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
            {t('profile.sessionDetails')}
          </Text>
          <View style={styles.modalCloseButton} />
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Session Title Card */}
          <GradientCard
            gradient={themeGradients.card.whiteCard}
            style={[styles.detailCard, cardShadow]}
            isDark={isDark}
          >
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: iconBgColors.blue }]}>
                <Ionicons name="leaf" size={24} color={primaryColor} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.detailTitle, { color: colors.text.primary }]}>
                  {session.title}
                </Text>
                <Text style={[styles.detailSubtitle, { color: colors.text.secondary }]}>
                  {formatFullDate(session.date)}
                </Text>
              </View>
            </View>
          </GradientCard>

          {/* Intention Card - Only show if intention was set */}
          {session.intention && (
            <GradientCard
              gradient={themeGradients.card.whiteCard}
              style={[styles.detailCard, cardShadow]}
              isDark={isDark}
            >
              <View style={styles.intentionCardContent}>
                <View style={styles.cardRow}>
                  <View style={[styles.iconBox, { backgroundColor: iconBgColors.purple }]}>
                    <Ionicons name="flag" size={24} color={iconColors.purple} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                      {t('profile.sessionIntention')}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.intentionTextContainer,
                    {
                      borderLeftColor: primaryColor,
                      backgroundColor: `${primaryColor}0A`,
                    },
                  ]}
                >
                  <Text style={[styles.intentionText, { color: colors.text.primary }]}>
                    "{session.intention}"
                  </Text>
                </View>
              </View>
            </GradientCard>
          )}

          {/* Duration Card */}
          <GradientCard
            gradient={themeGradients.card.whiteCard}
            style={[styles.detailCard, cardShadow]}
            isDark={isDark}
          >
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: iconBgColors.emerald }]}>
                <Ionicons name="time" size={24} color={iconColors.emerald} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                  {t('profile.duration')}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                  {formatDuration(session.durationSeconds)}
                </Text>
              </View>
            </View>
          </GradientCard>

          {/* Mood Card */}
          <GradientCard
            gradient={themeGradients.card.whiteCard}
            style={[styles.detailCard, cardShadow]}
            isDark={isDark}
          >
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: getMoodColors(session.mood).bg }]}>
                <MoodIcon mood={session.mood} size="large" showBackground={false} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                  {t('profile.moodAfterSession')}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                  {getMoodLabel(session.mood)}
                </Text>
              </View>
            </View>
          </GradientCard>

          {/* Notes Card */}
          <GradientCard
            gradient={themeGradients.card.whiteCard}
            style={[styles.detailCard, cardShadow]}
            isDark={isDark}
          >
            <View style={styles.notesCardContent}>
              <View style={styles.notesHeader}>
                <View style={[styles.iconBox, { backgroundColor: iconBgColors.purple }]}>
                  <Ionicons name="document-text" size={24} color={iconColors.purple} />
                </View>
                <Text
                  style={[styles.detailLabel, { color: colors.text.secondary, marginLeft: 12 }]}
                >
                  {t('profile.reflections')}
                </Text>
              </View>
              <Text
                style={[
                  styles.notesText,
                  { color: session.notes ? colors.text.primary : colors.text.tertiary },
                ]}
              >
                {session.notes || t('profile.noNotesRecorded')}
              </Text>
            </View>
          </GradientCard>

          {/* Spacer for bottom */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  detailCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
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
  detailTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  detailSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: theme.typography.fontSizes.sm,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  intentionCardContent: {
    gap: theme.spacing.md,
  },
  intentionTextContainer: {
    marginTop: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderLeftWidth: 3,
    borderRadius: 4,
  },
  intentionText: {
    fontSize: theme.typography.fontSizes.md,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  notesCardContent: {
    gap: theme.spacing.md,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesText: {
    fontSize: theme.typography.fontSizes.md,
    lineHeight: 24,
    fontStyle: 'normal',
  },
});
