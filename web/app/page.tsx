export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Find Your Inner Peace</h1>
          <p>
            Progressive meditation learning with personalized experiences.
            No login required, 6 languages supported.
          </p>
          <div className="cta-buttons">
            <a href="#" className="btn btn-primary">
              Download for iOS
            </a>
            <a href="#" className="btn btn-primary">
              Download for Android
            </a>
            <a href="#features" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2>Why Slow Spot?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚫</div>
              <h3>No Login Required</h3>
              <p>
                Start meditating immediately. No accounts, no barriers, just pure focus on your wellbeing.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Multi-Language</h3>
              <p>
                Fully localized in 6 languages: English, Polish, Spanish, German, French, and Hindi.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📴</div>
              <h3>Offline-First</h3>
              <p>
                Meditate anywhere, anytime. All content cached locally for uninterrupted practice.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>3-Layer Audio</h3>
              <p>
                Voice guidance, ambient sounds, and chimes work together for immersive meditation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Progress Tracking</h3>
              <p>
                Track your meditation streaks, total sessions, and minutes practiced.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💭</div>
              <h3>Unique Quotes</h3>
              <p>
                Non-repeating inspirational quotes that adapt to your language preference.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Progressive Learning</h3>
              <p>
                5 levels from beginner to master. Learn at your own pace with guided sessions.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h3>Dark Mode</h3>
              <p>
                Easy on the eyes with automatic dark mode support for evening meditation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Cultural Themes</h3>
              <p>
                Meditations inspired by Zen, Mindfulness, Vipassana, and more traditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero" style={{ minHeight: '60vh' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '2rem' }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            Join thousands discovering the power of meditation
          </p>
          <div className="cta-buttons">
            <a href="#" className="btn btn-primary">
              Get Started Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <h3>Slow Spot</h3>
          <p>© 2025 Slow Spot. All rights reserved.</p>
          <p style={{ marginTop: '1rem' }}>
            Built with ❤️ for mindfulness
          </p>
        </div>
      </footer>
    </>
  )
}
