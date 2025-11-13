import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Audio } from 'expo-av';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import theme from '../theme';
import { ChimePoint } from '../types/customSession';

interface MeditationTimerProps {
  totalSeconds: number;
  onComplete: () => void;
  onCancel: () => void;
  chimePoints?: ChimePoint[];
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  totalSeconds,
  onComplete,
  onCancel,
  chimePoints = [],
}) => {
  const { t } = useTranslation();
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true); // Auto-start enabled
  const playedChimes = useRef<Set<number>>(new Set());
  const chimeSound = useRef<Audio.Sound | null>(null);

  // ✨ Reanimated 4 - Smooth 60fps breathing animation
  // 4 seconds inhale, 4 seconds exhale
  const breathingScale = useSharedValue(0.85);
  const breathingOpacity = useSharedValue(0.3);

  // Load chime sound
  useEffect(() => {
    const loadSound = async () => {
      try {
        // TODO: Add chime.mp3 file to assets/sounds/
        // const { sound } = await Audio.Sound.createAsync(
        //   require('../../assets/sounds/chime.mp3')
        // );
        // chimeSound.current = sound;
        console.log('Chime sound loading disabled - add chime.mp3 to assets/sounds/');
      } catch (error) {
        console.error('Error loading chime sound:', error);
      }
    };

    loadSound();

    return () => {
      if (chimeSound.current) {
        chimeSound.current.unloadAsync();
      }
    };
  }, []);

  // Start breathing animation loop
  useEffect(() => {
    if (isRunning) {
      // Inhale and exhale sequence with infinite repeat
      breathingScale.value = withRepeat(
        withSequence(
          withTiming(1.0, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.85, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // infinite repeat
        false
      );

      breathingOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.3, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // infinite repeat
        false
      );
    } else {
      // Cancel animations when paused
      cancelAnimation(breathingScale);
      cancelAnimation(breathingOpacity);
    }

    return () => {
      cancelAnimation(breathingScale);
      cancelAnimation(breathingOpacity);
    };
  }, [isRunning, breathingScale, breathingOpacity]);

  // Animated style for breathing circle
  const breathingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: breathingOpacity.value,
    transform: [{ scale: breathingScale.value }],
  }));

  // Play chime at designated time
  const playChime = async () => {
    if (chimeSound.current) {
      try {
        await chimeSound.current.replayAsync();
      } catch (error) {
        console.error('Error playing chime:', error);
      }
    }
  };

  // Check and play chimes
  useEffect(() => {
    const elapsedSeconds = totalSeconds - remainingSeconds;

    for (const chime of chimePoints) {
      if (
        elapsedSeconds >= chime.timeInSeconds &&
        !playedChimes.current.has(chime.timeInSeconds)
      ) {
        playedChimes.current.add(chime.timeInSeconds);
        playChime();
      }
    }
  }, [remainingSeconds, chimePoints, totalSeconds]);

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  // Circle calculations
  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View style={styles.container}>
      {/* Circular Progress */}
      <View style={styles.circleContainer}>
        {/* Breathing Circle Animation - Powered by Reanimated 4 */}
        <Animated.View style={[styles.breathingCircle, breathingAnimatedStyle]}>
          <View style={styles.breathingCircleInner} />
        </Animated.View>

        <Svg width={size} height={size} style={styles.svg}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.accent.blue[500]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        {/* Progress Indicator - No exact time shown */}
        <View style={styles.timerOverlay}>
          <Text style={styles.progressText}>
            {Math.round(progress)}%
          </Text>
          <Text style={styles.minutesText}>
            {t('meditation.inProgress', 'In Progress')}
          </Text>
        </View>
      </View>

      {/* Progress Bar with Chime Markers */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressIndicator,
              { width: `${progress}%` }
            ]}
          />

          {/* Chime markers */}
          {chimePoints.map((chime, index) => {
            const position = (chime.timeInSeconds / totalSeconds) * 100;
            const isPassed = (totalSeconds - remainingSeconds) >= chime.timeInSeconds;

            return (
              <View
                key={index}
                style={[
                  styles.chimeMarker,
                  { left: `${position}%` },
                  isPassed && styles.chimeMarkerPassed,
                ]}
              >
                {chime.label && (
                  <Text style={styles.chimeLabel}>{chime.label}</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>
            {t('meditation.finish')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => {
            setIsRunning(!isRunning);
          }}
        >
          <Text style={styles.primaryButtonText}>
            {isRunning
              ? t('meditation.pause')
              : t('meditation.resume')
            }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xxxl,
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  breathingCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  breathingCircleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  timerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 72,
    fontWeight: theme.typography.fontWeights.light,
    color: theme.colors.text.inverse,
  },
  minutesText: {
    fontSize: theme.typography.fontSizes.md,
    marginTop: theme.spacing.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBarContainer: {
    width: '80%',
    paddingVertical: theme.spacing.md,
  },
  progressBar: {
    position: 'relative',
    width: '100%',
    height: 8,
    borderRadius: theme.borderRadius.sm,
    overflow: 'visible',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressIndicator: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.accent.blue[500],
  },
  controls: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    maxWidth: 150,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.accent.blue[500],
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  primaryButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  buttonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.inverse,
  },
  chimeMarker: {
    position: 'absolute',
    top: -10,
    width: 4,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
    transform: [{ translateX: -2 }],
  },
  chimeMarkerPassed: {
    backgroundColor: theme.colors.accent.blue[300],
  },
  chimeLabel: {
    position: 'absolute',
    top: -22,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
    minWidth: 40,
    transform: [{ translateX: -18 }],
  },
});
