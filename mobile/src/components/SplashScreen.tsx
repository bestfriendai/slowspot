import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Svg, { Path, G, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { brandColors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

// Premium lotus icon with subtle glow effect
const LotusIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    {/* Subtle glow behind lotus */}
    <Circle cx="50" cy="50" r="45" fill="url(#glowGrad)" />
    <G transform="translate(50, 52)">
      {/* Left outer petal */}
      <Path
        d="M-8,2 Q-38,-8 -40,2 Q-30,15 -8,2"
        fill="#FFFFFF"
        opacity="0.7"
      />
      {/* Right outer petal */}
      <Path
        d="M8,2 Q38,-8 40,2 Q30,15 8,2"
        fill="#FFFFFF"
        opacity="0.7"
      />
      {/* Left inner petal */}
      <Path
        d="M-5,0 Q-25,-18 -28,-5 Q-18,10 -5,0"
        fill="#FFFFFF"
        opacity="0.85"
      />
      {/* Right inner petal */}
      <Path
        d="M5,0 Q25,-18 28,-5 Q18,10 5,0"
        fill="#FFFFFF"
        opacity="0.85"
      />
      {/* Center petal (on top, pointing up) */}
      <Path
        d="M0,-38 Q12,-18 0,5 Q-12,-18 0,-38"
        fill="#FFFFFF"
      />
    </G>
  </Svg>
);

// Floating particle for zen effect
const FloatingParticle: React.FC<{
  delay: number;
  startX: number;
  startY: number;
  size: number;
}> = ({ delay, startX, startY, size }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -60,
            duration: 3000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          top: startY,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(15)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Smooth entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 15,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Gentle breathing animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow pulsing
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Title fade and slide in
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
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Subtitle fade in
    Animated.sequence([
      Animated.delay(700),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide splash screen
    const timer = setTimeout(() => {
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
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Generate random particles
  const particles = [
    { delay: 200, startX: width * 0.2, startY: height * 0.6, size: 4 },
    { delay: 600, startX: width * 0.8, startY: height * 0.55, size: 3 },
    { delay: 1000, startX: width * 0.3, startY: height * 0.7, size: 5 },
    { delay: 1400, startX: width * 0.7, startY: height * 0.65, size: 3 },
    { delay: 800, startX: width * 0.5, startY: height * 0.75, size: 4 },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5B4FCF', '#7C3AED', '#9333EA', '#A855F7']}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.gradient}
      >
        {/* Floating particles */}
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo with glow and breathing */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: breatheAnim }],
              },
            ]}
          >
            {/* Outer glow */}
            <Animated.View
              style={[
                styles.logoGlow,
                { opacity: glowAnim }
              ]}
            />
            <LotusIcon size={110} />
          </Animated.View>

          {/* App Name */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: titleFade,
                transform: [{ translateY: titleSlide }],
              }
            ]}
          >
            <Text style={styles.titleMain}>Slow Spot</Text>
            <Text style={styles.titleAccent}>.me</Text>
          </Animated.View>

          {/* Tagline */}
          <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
            {t('splash.tagline')}
          </Animated.Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

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
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  titleMain: {
    fontSize: 44,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  titleAccent: {
    fontSize: 44,
    fontWeight: '600',
    color: '#FCD34D',
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default SplashScreen;
