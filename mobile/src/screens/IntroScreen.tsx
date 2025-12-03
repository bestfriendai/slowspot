/**
 * IntroScreen - Premium onboarding experience
 *
 * Beautiful animated 3-slide onboarding with:
 * - Reanimated smooth transitions
 * - Personalized gradient themes
 * - Subtle, non-jarring animations
 * - Modern minimalist design inspired by Headspace/Calm
 */

import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import theme from '../theme';
import { brandColors } from '../theme/colors';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { logger } from '../utils/logger';

const { width, height } = Dimensions.get('window');

const INTRO_COMPLETED_KEY = '@slow_spot_intro_completed';

interface Slide {
  key: string;
  titleKey: string;
  subtitleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentIcon?: keyof typeof Ionicons.glyphMap;
}

const slides: Slide[] = [
  {
    key: '1',
    titleKey: 'onboarding.slide1.title',
    subtitleKey: 'onboarding.slide1.subtitle',
    icon: 'leaf',
    accentIcon: 'sparkles',
  },
  {
    key: '2',
    titleKey: 'onboarding.slide2.title',
    subtitleKey: 'onboarding.slide2.subtitle',
    icon: 'timer-outline',
    accentIcon: 'flash',
  },
  {
    key: '3',
    titleKey: 'onboarding.slide3.title',
    subtitleKey: 'onboarding.slide3.subtitle',
    icon: 'heart',
    accentIcon: 'trending-up',
  },
];

interface IntroScreenProps {
  onDone: () => void;
}

// Animated floating particle
const FloatingParticle: React.FC<{
  delay: number;
  size: number;
  left: number;
  top: number;
  animationsEnabled: boolean;
}> = ({ delay, size, left, top, animationsEnabled }) => {
  const opacity = useSharedValue(0.3);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (animationsEnabled) {
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );
      translateY.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            withTiming(10, { duration: 3000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );
    }
  }, [animationsEnabled]);

  const particleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: `${left}%`,
          top: `${top}%`,
        },
        particleStyle,
      ]}
    />
  );
};

// Animated icon with pulse effect
const AnimatedIcon: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  accentIcon?: keyof typeof Ionicons.glyphMap;
  primaryColor: string;
  animationsEnabled: boolean;
}> = ({ icon, accentIcon, primaryColor, animationsEnabled }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (animationsEnabled) {
      // Subtle breathing effect
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [animationsEnabled]);

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.iconWrapper, iconContainerStyle]}>
      {/* Outer glow ring */}
      <View style={[styles.iconGlow, { backgroundColor: `${primaryColor}20` }]} />
      <View style={[styles.iconGlowInner, { backgroundColor: `${primaryColor}30` }]} />

      {/* Main icon container */}
      <LinearGradient
        colors={[`${primaryColor}40`, `${primaryColor}20`]}
        style={styles.iconContainer}
      >
        <Ionicons name={icon} size={64} color={primaryColor} />
      </LinearGradient>

      {/* Accent icon */}
      {accentIcon && (
        <Animated.View
          entering={FadeIn.delay(500).duration(400)}
          style={[styles.accentIconContainer, { backgroundColor: primaryColor }]}
        >
          <Ionicons name={accentIcon} size={20} color="#FFF" />
        </Animated.View>
      )}
    </Animated.View>
  );
};

// Single slide component
const OnboardingSlide: React.FC<{
  item: Slide;
  index: number;
  scrollX: Animated.SharedValue<number>;
  primaryColor: string;
  animationsEnabled: boolean;
}> = ({ item, index, scrollX, primaryColor, animationsEnabled }) => {
  const { t } = useTranslation();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [30, 0, 30],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <View style={styles.slide}>
      <StatusBar barStyle="dark-content" />

      {/* Floating particles */}
      <FloatingParticle delay={0} size={8} left={15} top={20} animationsEnabled={animationsEnabled} />
      <FloatingParticle delay={500} size={6} left={80} top={15} animationsEnabled={animationsEnabled} />
      <FloatingParticle delay={1000} size={10} left={70} top={35} animationsEnabled={animationsEnabled} />
      <FloatingParticle delay={1500} size={5} left={25} top={40} animationsEnabled={animationsEnabled} />

      <Animated.View style={[styles.slideContent, animatedStyle]}>
        {/* Icon */}
        <AnimatedIcon
          icon={item.icon}
          accentIcon={item.accentIcon}
          primaryColor={primaryColor}
          animationsEnabled={animationsEnabled}
        />

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: primaryColor }]}>
            {t(item.titleKey)}
          </Text>
          <Text style={styles.subtitle}>
            {t(item.subtitleKey)}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

// Pagination dots
const PaginationDots: React.FC<{
  data: Slide[];
  scrollX: Animated.SharedValue<number>;
  primaryColor: string;
}> = ({ data, scrollX, primaryColor }) => {
  return (
    <View style={styles.pagination}>
      {data.map((_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [8, 32, 8],
            Extrapolation.CLAMP
          );

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolation.CLAMP
          );

          return {
            width: dotWidth,
            opacity,
            backgroundColor: primaryColor,
          };
        });

        return (
          <Animated.View
            key={index}
            style={[styles.dot, animatedDotStyle]}
          />
        );
      })}
    </View>
  );
};

export const IntroScreen: React.FC<IntroScreenProps> = ({ onDone }) => {
  const { t } = useTranslation();
  const { currentTheme, settings } = usePersonalization();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const primaryColor = currentTheme.primary;

  const handleDone = async () => {
    try {
      if (settings.hapticEnabled) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      await AsyncStorage.setItem(INTRO_COMPLETED_KEY, 'true');
      onDone();
    } catch (error) {
      logger.error('Error saving intro completion:', error);
      onDone();
    }
  };

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      if (settings.hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleDone();
    }
  }, [currentIndex, settings.hapticEnabled]);

  const handleSkip = useCallback(async () => {
    if (settings.hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    handleDone();
  }, [settings.hapticEnabled]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useMemo(() => ({
    viewAreaCoveragePercentThreshold: 50,
  }), []);

  const isLastSlide = currentIndex === slides.length - 1;

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(1) }],
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FAFBFC', '#F0F2F5', '#E8ECF0']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Skip button */}
      {!isLastSlide && (
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.skipContainer}
        >
          <AnimatedPressable
            onPress={handleSkip}
            style={styles.skipButton}
            hapticType="light"
          >
            <Text style={[styles.skipText, { color: primaryColor }]}>
              {t('onboarding.skip', 'Pomiń')}
            </Text>
          </AnimatedPressable>
        </Animated.View>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.key}
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <OnboardingSlide
            item={item}
            index={index}
            scrollX={scrollX}
            primaryColor={primaryColor}
            animationsEnabled={settings.animationsEnabled}
          />
        )}
      />

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Pagination */}
        <PaginationDots
          data={slides}
          scrollX={scrollX}
          primaryColor={primaryColor}
        />

        {/* Action button */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(500)}
          style={styles.buttonContainer}
        >
          <AnimatedPressable
            onPress={handleNext}
            style={[styles.actionButton, buttonAnimatedStyle]}
            pressScale={0.96}
            hapticType="medium"
          >
            <LinearGradient
              colors={currentTheme.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              {isLastSlide ? (
                <>
                  <Text style={styles.buttonText}>
                    {t('onboarding.getStarted', 'Rozpocznij')}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
                </>
              ) : (
                <>
                  <Text style={styles.buttonText}>
                    {t('onboarding.next', 'Dalej')}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFF" style={styles.buttonIcon} />
                </>
              )}
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
};

// Helper function to check if intro has been completed
export const hasCompletedIntro = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(INTRO_COMPLETED_KEY);
    return value === 'true';
  } catch (error) {
    logger.error('Error checking intro completion:', error);
    return false;
  }
};

// Helper function to reset intro (for testing)
export const resetIntro = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(INTRO_COMPLETED_KEY);
  } catch (error) {
    logger.error('Error resetting intro:', error);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    paddingTop: 100,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  iconGlowInner: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  accentIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  bottomSection: {
    paddingBottom: 50,
    paddingHorizontal: 32,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  actionButton: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});
