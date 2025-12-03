import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import theme, { getThemeColors } from '../theme';
import { usePersonalization } from '../contexts/PersonalizationContext';

interface SuccessModalButton {
  title: string;
  onPress: () => void;
  primary?: boolean;
  style?: 'default' | 'cancel' | 'destructive';
}

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttons?: SuccessModalButton[];
  isDark?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  title,
  message,
  buttons = [{ title: 'OK', onPress: () => {}, primary: true }],
  isDark = false,
  icon = 'checkmark-circle',
}) => {
  const { currentTheme, settings } = usePersonalization();
  const colors = getThemeColors(isDark);

  // Animation values
  const iconScale = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Haptic feedback on show
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Animate icon
      iconScale.value = withSpring(1, { damping: 12, stiffness: 150 });
      checkScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.2, { damping: 8 }),
          withSpring(1, { damping: 12 })
        )
      );
    } else {
      iconScale.value = 0;
      checkScale.value = 0;
    }
  }, [visible]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleButtonPress = (button: SuccessModalButton) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    button.onPress();
    onClose();
  };

  const dynamicStyles = {
    container: {
      backgroundColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.white,
    },
    title: {
      color: colors.text.primary,
    },
    message: {
      color: colors.text.secondary,
    },
    iconCircle: {
      backgroundColor: isDark ? `${currentTheme.primary}30` : `${currentTheme.primary}15`,
    },
    primaryButton: {
      backgroundColor: currentTheme.primary,
    },
    secondaryButton: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
    secondaryButtonText: {
      color: colors.text.secondary,
    },
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView
          intensity={20}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          entering={settings.animationsEnabled ? FadeIn.duration(200) : undefined}
          exiting={settings.animationsEnabled ? FadeOut.duration(150) : undefined}
          style={[styles.container, dynamicStyles.container]}
        >
          {/* Success Icon */}
          <View style={styles.iconWrapper}>
            <Animated.View style={[styles.iconCircle, dynamicStyles.iconCircle, iconAnimatedStyle]}>
              <Animated.View style={checkAnimatedStyle}>
                <Ionicons
                  name={icon}
                  size={48}
                  color={currentTheme.primary}
                />
              </Animated.View>
            </Animated.View>
          </View>

          {/* Title */}
          <Text style={[styles.title, dynamicStyles.title]}>
            {title}
          </Text>

          {/* Message */}
          <Text style={[styles.message, dynamicStyles.message]}>
            {message}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => {
              const isPrimary = button.primary || (buttons.length === 1 && index === 0);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    isPrimary ? [styles.primaryButton, dynamicStyles.primaryButton] : [styles.secondaryButton, dynamicStyles.secondaryButton],
                    buttons.length > 1 && index === 0 && styles.buttonSpacing,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.buttonText,
                    isPrimary ? styles.primaryButtonText : dynamicStyles.secondaryButtonText,
                  ]}>
                    {button.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 320,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 12,
  },
  iconWrapper: {
    marginBottom: theme.spacing.lg,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  buttonsContainer: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    // backgroundColor set dynamically
  },
  buttonSpacing: {
    marginBottom: theme.spacing.xs,
  },
  buttonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
});

export default SuccessModal;
