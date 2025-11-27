'use client';

import { useLanguage, LanguageSwitcher } from './i18n';

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <LanguageSwitcher />

      {/* Hero Section with Breathing Animation */}
      <section className="hero">
        <div className="breathing-circle"></div>
        <div className="hero-content">
          <div className="hero-badge">{t.hero.badge}</div>
          <h1>{t.hero.title}</h1>
          <p className="hero-subtitle">
            {t.hero.subtitle}
          </p>
          <div className="cta-buttons">
            <a href="#download" className="btn btn-primary">
              <span className="btn-icon">📱</span>
              {t.hero.ctaPrimary}
            </a>
            <a href="#features" className="btn btn-secondary">
              <span className="btn-icon">✨</span>
              {t.hero.ctaSecondary}
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">{t.hero.stats.users.number}</div>
              <div className="stat-label">{t.hero.stats.users.label}</div>
            </div>
            <div className="stat">
              <div className="stat-number">{t.hero.stats.sessions.number}</div>
              <div className="stat-label">{t.hero.stats.sessions.label}</div>
            </div>
            <div className="stat">
              <div className="stat-number">{t.hero.stats.rating.number}</div>
              <div className="stat-label">{t.hero.stats.rating.label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="app-preview">
        <div className="container">
          <div className="preview-content">
            <div className="preview-text">
              <h2 className="section-title">{t.appPreview.title}</h2>
              <p className="section-subtitle">
                {t.appPreview.subtitle}
              </p>
              <div className="preview-features">
                <div className="preview-feature">
                  <span className="preview-icon">⚡</span>
                  <div>
                    <h4>{t.appPreview.features.instant.title}</h4>
                    <p>{t.appPreview.features.instant.description}</p>
                  </div>
                </div>
                <div className="preview-feature">
                  <span className="preview-icon">🌐</span>
                  <div>
                    <h4>{t.appPreview.features.language.title}</h4>
                    <p>{t.appPreview.features.language.description}</p>
                  </div>
                </div>
                <div className="preview-feature">
                  <span className="preview-icon">📴</span>
                  <div>
                    <h4>{t.appPreview.features.offline.title}</h4>
                    <p>{t.appPreview.features.offline.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="preview-visual">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="app-demo">
                    <div className="demo-circle"></div>
                    <p className="demo-text">{t.appPreview.demoText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.features.sectionTitle}</h2>
            <p className="section-subtitle">
              {t.features.sectionSubtitle}
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🎯</span>
              </div>
              <h3>{t.features.cards.progressive.title}</h3>
              <p>
                {t.features.cards.progressive.description}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🎵</span>
              </div>
              <h3>{t.features.cards.audio.title}</h3>
              <p>
                {t.features.cards.audio.description}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📈</span>
              </div>
              <h3>{t.features.cards.tracking.title}</h3>
              <p>
                {t.features.cards.tracking.description}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">💭</span>
              </div>
              <h3>{t.features.cards.wisdom.title}</h3>
              <p>
                {t.features.cards.wisdom.description}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🎨</span>
              </div>
              <h3>{t.features.cards.cultural.title}</h3>
              <p>
                {t.features.cards.cultural.description}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🌙</span>
              </div>
              <h3>{t.features.cards.theme.title}</h3>
              <p>
                {t.features.cards.theme.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">{t.testimonials.sectionTitle}</h2>
          <div className="testimonials-grid">
            {t.testimonials.items.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-stars">{testimonial.stars}</div>
                <p className="testimonial-text">
                  {testimonial.text}
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.author.avatar}</div>
                  <div>
                    <div className="author-name">{testimonial.author.name}</div>
                    <div className="author-location">{testimonial.author.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section id="download" className="download-section">
        <div className="container">
          <div className="download-content">
            <h2 className="section-title">{t.download.sectionTitle}</h2>
            <p className="section-subtitle">
              {t.download.sectionSubtitle}
            </p>
            <div className="download-buttons">
              <a href="#" className="store-button">
                <div className="store-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5Z" fill="currentColor"/>
                    <path d="M13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="store-text">
                  <div className="store-label">{t.download.appStore.label}</div>
                  <div className="store-name">{t.download.appStore.name}</div>
                </div>
              </a>
              <a href="#" className="store-button">
                <div className="store-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z" fill="currentColor"/>
                    <path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" fill="currentColor"/>
                    <path d="M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81Z" fill="currentColor"/>
                    <path d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="store-text">
                  <div className="store-label">{t.download.googlePlay.label}</div>
                  <div className="store-name">{t.download.googlePlay.name}</div>
                </div>
              </a>
            </div>
            <p className="download-note">{t.download.note}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>{t.footer.brand.name}</h3>
              <p>{t.footer.brand.tagline}</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>{t.footer.columns.product.title}</h4>
                <a href="#features">{t.footer.columns.product.links.features}</a>
                <a href="#download">{t.footer.columns.product.links.download}</a>
              </div>
              <div className="footer-column">
                <h4>{t.footer.columns.support.title}</h4>
                <a href="/support">{t.footer.columns.support.links.help}</a>
                <a href="mailto:support@slowspot.app">{t.footer.columns.support.links.contact}</a>
              </div>
              <div className="footer-column">
                <h4>{t.footer.columns.legal.title}</h4>
                <a href="/privacy">{t.footer.columns.legal.links.privacy}</a>
                <a href="/terms">{t.footer.columns.legal.links.terms}</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t.footer.bottom.copyright}</p>
            <p>{t.footer.bottom.tagline}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
