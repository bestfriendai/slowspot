import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, G, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

// Beautiful lotus icon with glow effect
const BeautifulLotusIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
        <Stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.1" />
        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id="innerGlow" cx="50%" cy="45%" r="40%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
      </RadialGradient>
    </Defs>

    {/* Outer glow */}
    <Circle cx="50" cy="50" r="48" fill="url(#outerGlow)" />

    {/* Modern lotus - elegant minimalist design */}
    <G transform="translate(50, 52)">
      {/* Center petal - main */}
      <Path
        d="M0,-30 Q12,-15 0,2 Q-12,-15 0,-30"
        fill="url(#innerGlow)"
      />

      {/* Left petals */}
      <Path
        d="M-3,-2 Q-22,-18 -30,-6 Q-18,6 -3,-2"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <Path
        d="M-5,2 Q-26,8 -28,22 Q-12,14 -5,2"
        fill="#FFFFFF"
        opacity="0.8"
      />

      {/* Right petals */}
      <Path
        d="M3,-2 Q22,-18 30,-6 Q18,6 3,-2"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <Path
        d="M5,2 Q26,8 28,22 Q12,14 5,2"
        fill="#FFFFFF"
        opacity="0.8"
      />

      {/* Back accent petals */}
      <Path
        d="M-2,-5 Q-16,-30 -24,-26 Q-12,-10 -2,-5"
        fill="#FFFFFF"
        opacity="0.65"
      />
      <Path
        d="M2,-5 Q16,-30 24,-26 Q12,-10 2,-5"
        fill="#FFFFFF"
        opacity="0.65"
      />
    </G>
  </Svg>
);

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(20)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(15)).current;
  const dotFade = useRef(new Animated.Value(0)).current;

  // Animated ripple circles - centered with logo
  const circle1Scale = useRef(new Animated.Value(1)).current;
  const circle2Scale = useRef(new Animated.Value(1)).current;
  const circle3Scale = useRef(new Animated.Value(1)).current;
  const circle1Opacity = useRef(new Animated.Value(0)).current;
  const circle2Opacity = useRef(new Animated.Value(0)).current;
  const circle3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered title animation with slide
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Dot animation (the ".me" accent)
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(dotFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered subtitle animation with slide
    Animated.sequence([
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(subtitleFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Breathing animation for the icon
    const breatheAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.06,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    breatheAnimation.start();

    // Ripple effect - expanding circles (starts from scale 1 = same size as icon)
    const createRipple = (
      scaleAnim: Animated.Value,
      opacityAnim: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 2.8,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(opacityAnim, {
                toValue: 0.5,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 2600,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    const ripple1 = createRipple(circle1Scale, circle1Opacity, 0);
    const ripple2 = createRipple(circle2Scale, circle2Opacity, 1000);
    const ripple3 = createRipple(circle3Scale, circle3Opacity, 2000);

    ripple1.start();
    ripple2.start();
    ripple3.start();

    // Auto-hide splash screen after 2.8 seconds
    const timer = setTimeout(() => {
      breatheAnimation.stop();
      ripple1.stop();
      ripple2.stop();
      ripple3.stop();

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2800);

    return () => {
      clearTimeout(timer);
      breatheAnimation.stop();
      ripple1.stop();
      ripple2.stop();
      ripple3.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative background elements */}
        <View style={styles.bgDecoration1} />
        <View style={styles.bgDecoration2} />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon container with breathing animation and centered ripples */}
          <View style={styles.iconWrapper}>
            {/* Animated ripple circles - positioned relative to icon */}
            <Animated.View
              style={[
                styles.rippleCircle,
                {
                  transform: [{ scale: circle1Scale }],
                  opacity: circle1Opacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.rippleCircle,
                {
                  transform: [{ scale: circle2Scale }],
                  opacity: circle2Opacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.rippleCircle,
                {
                  transform: [{ scale: circle3Scale }],
                  opacity: circle3Opacity,
                },
              ]}
            />

            <Animated.View
              style={[
                styles.iconContainer,
                { transform: [{ scale: breatheAnim }] },
              ]}
            >
              <View style={styles.iconInner}>
                <BeautifulLotusIcon size={90} />
              </View>
            </Animated.View>
          </View>

          {/* App Name with beautiful styling */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: titleFade,
                transform: [{ translateY: titleSlide }],
              },
            ]}
          >
            <Text style={styles.titleMain}>Slow Spot</Text>
            <Animated.Text style={[styles.titleAccent, { opacity: dotFade }]}>
              .me
            </Animated.Text>
          </Animated.View>

          {/* Tagline with staggered animation */}
          <Animated.Text
            style={[
              styles.subtitle,
              {
                opacity: subtitleFade,
                transform: [{ translateY: subtitleSlide }],
              },
            ]}
          >
            {t('splash.tagline')}
          </Animated.Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const ICON_SIZE = 130;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bgDecoration1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  bgDecoration2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
  },
  rippleCircle: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // Glass effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  titleMain: {
    fontSize: 44,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  titleAccent: {
    fontSize: 44,
    fontWeight: '700',
    color: '#FCD34D', // Golden yellow accent for ".me"
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
