'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const COOKIE_CONSENT_KEY = 'slowspot_cookie_consent';

export function CookieBanner() {
  const t = useTranslations('cookieBanner');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
          {t('message')}
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/privacy"
            className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
          >
            {t('learnMore')}
          </Link>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
