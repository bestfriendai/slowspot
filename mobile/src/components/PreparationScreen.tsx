import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { api, Quote } from '../services/api';

interface PreparationScreenProps {
  onReady: () => void;
}

export const PreparationScreen: React.FC<PreparationScreenProps> = ({ onReady }) => {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuote();
  }, []);

  const loadQuote = async () => {
    try {
      setLoading(true);
      const randomQuote = await api.quotes.getRandom(i18n.language);
      setQuote(randomQuote);
    } catch (error) {
      console.error('Failed to load quote:', error);
      // Continue without quote
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.content}>
        {/* Breathing prompt */}
        <View style={styles.breathingSection}>
          <Text style={[styles.breathingText, isDark ? styles.darkText : styles.lightText]}>
            {t('meditation.takeDeepBreath') || 'Take a deep breath'}
          </Text>
        </View>

        {/* Quote section */}
        <View style={styles.quoteSection}>
          {loading ? (
            <ActivityIndicator size="large" color={isDark ? '#0A84FF' : '#007AFF'} />
          ) : quote ? (
            <>
              <Text style={[styles.quoteText, isDark ? styles.darkText : styles.lightText]}>
                "{quote.text}"
              </Text>
              {quote.author && (
                <Text style={[styles.authorText, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
                  — {quote.author}
                </Text>
              )}
            </>
          ) : null}
        </View>

        {/* Ready button */}
        <TouchableOpacity
          style={[styles.button, isDark ? styles.darkButton : styles.lightButton]}
          onPress={onReady}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {t('meditation.imReady') || "I'm Ready"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightBg: {
    backgroundColor: '#FFFFFF',
  },
  darkBg: {
    backgroundColor: '#1A1A1A',
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breathingSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingText: {
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'center',
  },
  quoteSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    gap: 16,
  },
  quoteText: {
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 36,
  },
  authorText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightPlaceholder: {
    color: '#8E8E93',
  },
  darkPlaceholder: {
    color: '#8E8E93',
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  lightButton: {
    backgroundColor: '#007AFF',
  },
  darkButton: {
    backgroundColor: '#0A84FF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
});
