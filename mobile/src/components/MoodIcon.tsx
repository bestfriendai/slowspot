/**
 * MoodIcon - Beautiful mood indicator icons
 *
 * Replaces emoji with styled Ionicons for better cross-platform compatibility
 * and consistent visual design matching the app's aesthetic.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mood color palette - semantic colors for each mood level
const MOOD_COLORS = {
  1: { bg: '#FEE2E2', icon: '#EF4444' }, // Red - Very bad
  2: { bg: '#FEF3C7', icon: '#F59E0B' }, // Amber - Bad
  3: { bg: '#E0E7FF', icon: '#6366F1' }, // Indigo - Neutral
  4: { bg: '#D1FAE5', icon: '#10B981' }, // Emerald - Good
  5: { bg: '#DCFCE7', icon: '#22C55E' }, // Green - Very good
} as const;

// Mood icons mapping
const MOOD_ICONS: Record<1 | 2 | 3 | 4 | 5, keyof typeof Ionicons.glyphMap> = {
  1: 'sad-outline',
  2: 'cloud-outline',
  3: 'remove-outline',
  4: 'happy-outline',
  5: 'heart-outline',
};

interface MoodIconProps {
  mood?: 1 | 2 | 3 | 4 | 5;
  size?: 'small' | 'medium' | 'large';
  showBackground?: boolean;
}

export const MoodIcon: React.FC<MoodIconProps> = ({
  mood,
  size = 'small',
  showBackground = true,
}) => {
  if (!mood) return null;

  const colors = MOOD_COLORS[mood];
  const icon = MOOD_ICONS[mood];

  const sizeConfig = {
    small: { box: 28, icon: 16, radius: 8 },
    medium: { box: 36, icon: 20, radius: 10 },
    large: { box: 48, icon: 24, radius: 14 },
  };

  const config = sizeConfig[size];

  if (!showBackground) {
    return (
      <Ionicons name={icon} size={config.icon} color={colors.icon} />
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: config.box,
          height: config.box,
          borderRadius: config.radius,
          backgroundColor: colors.bg,
        },
      ]}
    >
      <Ionicons name={icon} size={config.icon} color={colors.icon} />
    </View>
  );
};

/**
 * Get mood icon name for use outside the component
 */
export const getMoodIconName = (mood?: 1 | 2 | 3 | 4 | 5): keyof typeof Ionicons.glyphMap | null => {
  if (!mood) return null;
  return MOOD_ICONS[mood];
};

/**
 * Get mood colors for use outside the component
 */
export const getMoodColors = (mood?: 1 | 2 | 3 | 4 | 5) => {
  if (!mood) return { bg: '#F3F4F6', icon: '#9CA3AF' };
  return MOOD_COLORS[mood];
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
