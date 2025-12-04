/**
 * Greetings Utility
 *
 * Provides dynamic greetings based on time of day and user context.
 */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Get the current time of day
 */
export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
};

/**
 * Get greeting translation key based on time of day
 */
export const getGreetingKey = (): string => {
  const timeOfDay = getTimeOfDay();

  switch (timeOfDay) {
    case 'morning':
      return 'home.greetingMorning';
    case 'afternoon':
      return 'home.greetingAfternoon';
    case 'evening':
      return 'home.greetingEvening';
    case 'night':
      return 'home.greetingNight';
    default:
      return 'home.greeting';
  }
};

/**
 * Get personalized greeting translation key based on time of day
 * Used when user has set their name
 */
export const getPersonalizedGreetingKey = (): string => {
  const timeOfDay = getTimeOfDay();

  switch (timeOfDay) {
    case 'morning':
      return 'home.greetingMorningPersonal';
    case 'afternoon':
      return 'home.greetingAfternoonPersonal';
    case 'evening':
      return 'home.greetingEveningPersonal';
    case 'night':
      return 'home.greetingNightPersonal';
    default:
      return 'home.greetingPersonal';
  }
};

/**
 * Get suggestion based on time of day
 */
export const getSuggestionKey = (): string => {
  const timeOfDay = getTimeOfDay();

  switch (timeOfDay) {
    case 'morning':
      return 'home.suggestionMorning';
    case 'afternoon':
      return 'home.suggestionAfternoon';
    case 'evening':
      return 'home.suggestionEvening';
    case 'night':
      return 'home.suggestionNight';
    default:
      return 'home.suggestion';
  }
};

/**
 * Get icon name based on time of day
 */
export const getTimeIcon = (): string => {
  const timeOfDay = getTimeOfDay();

  switch (timeOfDay) {
    case 'morning':
      return 'sunny-outline';
    case 'afternoon':
      return 'partly-sunny-outline';
    case 'evening':
      return 'moon-outline';
    case 'night':
      return 'cloudy-night-outline';
    default:
      return 'time-outline';
  }
};

/**
 * Get motivational message based on streak
 */
export const getStreakMessageKey = (streak: number): string => {
  if (streak === 0) {
    return 'home.streakStart';
  } else if (streak === 1) {
    return 'home.streakFirst';
  } else if (streak < 7) {
    return 'home.streakBuilding';
  } else if (streak < 14) {
    return 'home.streakWeek';
  } else if (streak < 30) {
    return 'home.streakTwoWeeks';
  } else if (streak < 100) {
    return 'home.streakMonth';
  } else {
    return 'home.streakMaster';
  }
};
