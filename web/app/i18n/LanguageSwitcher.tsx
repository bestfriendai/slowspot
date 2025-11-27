'use client';

import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { i18nConfig, languageNames } from './config';
import './languageSwitcher.css';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: typeof i18nConfig.locales[number]) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <button
        className="language-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t.languageSwitcher.label}
      >
        <span className="language-icon">🌐</span>
        <span className="language-current">{languageNames[locale]}</span>
        <span className={`language-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <>
          <div className="language-overlay" onClick={() => setIsOpen(false)} />
          <div className="language-dropdown">
            {i18nConfig.locales.map((loc) => (
              <button
                key={loc}
                className={`language-option ${locale === loc ? 'active' : ''}`}
                onClick={() => handleLocaleChange(loc)}
              >
                <span className="language-name">{languageNames[loc]}</span>
                {locale === loc && <span className="language-check">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
