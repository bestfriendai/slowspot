'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function SubpageFooter() {
  const t = useTranslations('footer');

  return (
    <footer className="subpage-footer-full">
      <div className="subpage-footer-content">
        {/* Brand */}
        <div className="subpage-footer-brand-section">
          <h3 className="subpage-footer-brand-name">
            <span className="font-light">Slow</span>{' '}
            <span className="subpage-brand-accent font-semibold">Spot</span>
          </h3>
          <p className="subpage-footer-brand-tagline">{t('brand.tagline')}</p>
        </div>

        {/* Links */}
        <div className="subpage-footer-links-section">
          <div className="subpage-footer-link-group">
            <h4 className="subpage-footer-link-title">{t('columns.product.title')}</h4>
            <div className="subpage-footer-link-list">
              <Link href="/#features" className="subpage-footer-link">
                {t('columns.product.links.features')}
              </Link>
              <Link href="/#download" className="subpage-footer-link">
                {t('columns.product.links.download')}
              </Link>
            </div>
          </div>

          <div className="subpage-footer-link-group">
            <h4 className="subpage-footer-link-title">{t('columns.support.title')}</h4>
            <div className="subpage-footer-link-list">
              <Link href="/support" className="subpage-footer-link">
                {t('columns.support.links.help')}
              </Link>
              <a href="mailto:contact@slowspot.me" className="subpage-footer-link">
                {t('columns.support.links.contact')}
              </a>
            </div>
          </div>

          <div className="subpage-footer-link-group">
            <h4 className="subpage-footer-link-title">{t('columns.legal.title')}</h4>
            <div className="subpage-footer-link-list">
              <Link href="/privacy" className="subpage-footer-link">
                {t('columns.legal.links.privacy')}
              </Link>
              <Link href="/terms" className="subpage-footer-link">
                {t('columns.legal.links.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="subpage-footer-bottom">
        <p className="subpage-footer-copyright">
          {t('bottom.copyright', { year: new Date().getFullYear() })}
        </p>
        <p className="subpage-footer-tagline-bottom">{t('bottom.tagline')}</p>
      </div>
    </footer>
  );
}
