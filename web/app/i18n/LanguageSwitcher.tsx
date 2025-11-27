'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { i18nConfig, languageNames } from './config';

// SVG Icons
const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Language flags
const flags: Record<string, string> = {
  en: '🇬🇧',
  pl: '🇵🇱',
  de: '🇩🇪',
  es: '🇪🇸',
  fr: '🇫🇷',
  hi: '🇮🇳',
  zh: '🇨🇳',
};

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDark(stored === 'dark');
      document.documentElement.classList.toggle('light', stored === 'light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle('light', !prefersDark);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('light', !newIsDark);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLocaleChange = (newLocale: typeof i18nConfig.locales[number]) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2" ref={dropdownRef}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="nav-control-btn group"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="nav-icon-wrapper nav-icon-theme">
          {isDark ? <SunIcon /> : <MoonIcon />}
        </div>
      </button>

      {/* Language Dropdown Container */}
      <div className="relative">
        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`nav-control-btn nav-control-btn-wide group ${isOpen ? 'nav-control-active' : ''}`}
          aria-label={t.languageSwitcher.label}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {/* Globe Icon */}
          <div className="nav-icon-wrapper nav-icon-globe">
            <GlobeIcon />
          </div>

          {/* Current Language */}
          <div className="flex items-center gap-1.5">
            <span className="text-base">{flags[locale]}</span>
            <span className="nav-lang-text hidden sm:inline">{languageNames[locale]}</span>
          </div>

          {/* Chevron */}
          <div className="nav-chevron">
            <ChevronIcon isOpen={isOpen} />
          </div>
        </button>

        {/* Dropdown Menu */}
        <div
          className={`nav-dropdown ${isOpen ? 'nav-dropdown-open' : 'nav-dropdown-closed'}`}
          role="listbox"
          aria-label={t.languageSwitcher.label}
        >
          {/* Header */}
          <div className="nav-dropdown-header">
            <p className="nav-dropdown-title">
              {t.languageSwitcher.label}
            </p>
          </div>

          {/* Language Options */}
          <div className="py-1">
            {i18nConfig.locales.map((loc) => {
              const isSelected = locale === loc;
              return (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`nav-dropdown-item ${isSelected ? 'nav-dropdown-item-selected' : ''}`}
                  role="option"
                  aria-selected={isSelected}
                >
                  {/* Flag */}
                  <span className="text-xl">{flags[loc]}</span>

                  {/* Language Name */}
                  <span className={`flex-1 text-left text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                    {languageNames[loc]}
                  </span>

                  {/* Check Icon */}
                  {isSelected && (
                    <span className="nav-check-icon">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
