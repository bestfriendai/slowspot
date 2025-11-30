'use client';

import { useTranslations } from 'next-intl';
import HeaderWithControls from '../components/HeaderWithControls';

export default function TermsOfService() {
  const t = useTranslations('termsPage');

  // Get summary items array
  const summaryItems = t.raw('summary.items') as string[];

  return (
    <main className="subpage subpage-with-header">
      <HeaderWithControls variant="solid" />

      <article className="subpage-content">
        <h1 className="subpage-title">{t('title')}</h1>
        <p className="subpage-subtitle">{t('lastUpdated')}</p>

        {/* Summary Box */}
        <div className="subpage-highlight-box">
          <h2 className="subpage-highlight-title">{t('summary.title')}</h2>
          <ul className="subpage-highlight-list">
            {summaryItems.map((item, i) => (
              <li key={i} className="subpage-highlight-item">
                <span className="subpage-check">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="subpage-prose">
          {/* Agreement */}
          <h2>{t('sections.acceptance.title')}</h2>
          <p>{t('sections.acceptance.content')}</p>

          {/* What We Offer */}
          <h2>{t('sections.service.title')}</h2>
          <p>{t('sections.service.content')}</p>

          {/* License */}
          <h2>{t('sections.license.title')}</h2>
          <p>{t('sections.license.content')}</p>

          {/* Your Content */}
          <h2>{t('sections.yourContent.title')}</h2>
          <p>{t('sections.yourContent.content')}</p>

          {/* Health Disclaimer */}
          <h2>{t('sections.health.title')}</h2>
          <div className="subpage-warning-box">
            <p className="subpage-warning-title">{t('sections.health.warning')}</p>
            <p className="subpage-warning-text">{t('sections.health.content')}</p>
          </div>

          {/* Disclaimer */}
          <h2>{t('sections.disclaimer.title')}</h2>
          <p>{t('sections.disclaimer.content')}</p>

          {/* Changes */}
          <h2>{t('sections.changes.title')}</h2>
          <p>{t('sections.changes.content')}</p>

          {/* Legal */}
          <h2>{t('sections.governing.title')}</h2>
          <p>{t('sections.governing.content')}</p>

          {/* Contact */}
          <h2>{t('sections.contact.title')}</h2>
          <ul>
            <li>
              <strong>{t('sections.contact.email')}</strong>{' '}
              <a href="mailto:contact@slowspot.me">contact@slowspot.me</a>
            </li>
            <li>
              <strong>{t('sections.contact.website')}</strong>{' '}
              <a href="https://slowspot.me">https://slowspot.me</a>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="subpage-footer">
          <p className="subpage-footer-brand">
            <span className="font-light">Slow</span>{' '}
            <span className="subpage-brand-accent font-semibold">Spot</span>
          </p>
          <p className="subpage-footer-tagline">Mindfulness. Simplicity. Privacy.</p>
        </div>
      </article>
    </main>
  );
}
