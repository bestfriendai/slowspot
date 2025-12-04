/**
 * Unified animation constants and presets for consistent animations across the app.
 *
 * Based on best practices from Material Design and Apple HIG:
 * - Micro-animations (UI feedback): 150-200ms
 * - Standard transitions: 250-350ms
 * - Complex animations: 400-600ms
 *
 * @see https://m3.material.io/styles/motion/duration
 * @see https://developer.apple.com/design/human-interface-guidelines/motion
 */

import { FadeIn, FadeInDown, FadeInUp, FadeOut, ZoomIn, SlideInDown } from 'react-native-reanimated';

// ============================================
// DURATION CONSTANTS
// ============================================

/** Micro-interactions: button presses, checkbox toggles */
export const DURATION_MICRO = 150;

/** Quick feedback: tooltips, small state changes */
export const DURATION_QUICK = 200;

/** Standard UI transitions: modals, cards, lists */
export const DURATION_STANDARD = 300;

/** Screen transitions: navigation between screens */
export const DURATION_SCREEN = 350;

/** Emphasis: celebration effects, important reveals */
export const DURATION_EMPHASIS = 500;

/** Complex: multi-step animations, intro sequences */
export const DURATION_COMPLEX = 600;

// ============================================
// DELAY CONSTANTS (for staggered animations)
// ============================================

/** No delay */
export const DELAY_NONE = 0;

/** First item in sequence */
export const DELAY_FIRST = 100;

/** Second item in sequence */
export const DELAY_SECOND = 200;

/** Third item in sequence */
export const DELAY_THIRD = 300;

/** Fourth item in sequence */
export const DELAY_FOURTH = 400;

/** Increment between staggered items */
export const DELAY_STAGGER = 100;

// ============================================
// ANIMATION PRESETS
// Reusable animation configurations for common patterns
// ============================================

/**
 * Standard fade-in for screen elements (staggered)
 * Use for cards, sections, list headers
 */
export const screenElementAnimation = (staggerIndex: number = 0) =>
  FadeInDown.delay(DELAY_FIRST + (staggerIndex * DELAY_STAGGER)).duration(DURATION_STANDARD);

/**
 * Quick fade-in for secondary elements
 * Use for subtitles, metadata, helper text
 */
export const secondaryElementAnimation = (staggerIndex: number = 0) =>
  FadeIn.delay(DELAY_SECOND + (staggerIndex * DELAY_STAGGER)).duration(DURATION_QUICK);

/**
 * Modal/overlay entrance animation
 */
export const modalEnterAnimation = () =>
  FadeIn.duration(DURATION_QUICK);

/**
 * Modal/overlay exit animation
 */
export const modalExitAnimation = () =>
  FadeOut.duration(DURATION_MICRO);

/**
 * Celebration/emphasis animation (from bottom)
 * For celebration screen with longer, more dramatic staggered entrance
 */
export const celebrationAnimation = (staggerIndex: number = 0) =>
  FadeInUp.delay(DELAY_SECOND + (staggerIndex * DELAY_STAGGER)).duration(DURATION_EMPHASIS);

/**
 * Celebration header animation (from top)
 * For main celebration title/header
 */
export const celebrationHeaderAnimation = (staggerIndex: number = 0) =>
  FadeInDown.delay(DELAY_SECOND + (staggerIndex * DELAY_STAGGER)).duration(DURATION_COMPLEX);

/**
 * Zoom-in for badges, icons, important elements
 */
export const emphasizeAnimation = (delay: number = DELAY_THIRD) =>
  ZoomIn.delay(delay).duration(DURATION_STANDARD);

/**
 * Slide-in from bottom for modals with spring effect
 */
export const slideInModalAnimation = () =>
  SlideInDown.springify().damping(20).stiffness(200);

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Creates conditional animation based on settings
 * @param animation - The animation to apply
 * @param enabled - Whether animations are enabled (from settings)
 * @returns The animation or undefined if disabled
 */
export const conditionalAnimation = <T>(animation: T, enabled: boolean): T | undefined =>
  enabled ? animation : undefined;

/**
 * Helper to create staggered delay values
 * @param index - Item index in the list
 * @param baseDelay - Starting delay (default: DELAY_FIRST)
 * @param increment - Delay increment per item (default: DELAY_STAGGER)
 */
export const staggerDelay = (
  index: number,
  baseDelay: number = DELAY_FIRST,
  increment: number = DELAY_STAGGER
): number => baseDelay + (index * increment);
