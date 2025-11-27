import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Slow Spot',
  description: 'Privacy Policy for Slow Spot meditation app. Your data stays on your device.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-slate-800 hover:text-teal-600 transition-colors">
            <span className="font-light">Slow</span> <span className="text-teal-600">Spot</span>
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/terms" className="text-slate-600 hover:text-teal-600 transition-colors">Terms</Link>
            <Link href="/support" className="text-slate-600 hover:text-teal-600 transition-colors">Support</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light text-slate-800 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last Updated: November 27, 2024</p>

        {/* Summary Box */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-teal-800 mb-3">Summary (TL;DR)</h2>
          <ul className="space-y-2 text-teal-700">
            <li className="flex items-center gap-2"><span className="text-teal-500">✓</span> Your data stays on your device</li>
            <li className="flex items-center gap-2"><span className="text-teal-500">✓</span> No accounts, no sign-in, no tracking</li>
            <li className="flex items-center gap-2"><span className="text-teal-500">✓</span> No analytics, no ads, no third-party services</li>
            <li className="flex items-center gap-2"><span className="text-teal-500">✓</span> Optional calendar permission for reminders only</li>
            <li className="flex items-center gap-2"><span className="text-teal-500">✓</span> Delete anytime by uninstalling the app</li>
            <li className="flex items-center gap-2"><span className="text-teal-500">✓</span> 100% offline compatible</li>
          </ul>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2>Introduction</h2>
          <p>
            Slow Spot ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
            explains how our mobile meditation application handles your information.
          </p>

          <h2>Our Privacy Philosophy</h2>
          <p className="text-lg font-medium text-slate-800">
            Simple Truth: Your data stays on your device. We don't collect, transmit, or store any of
            your personal information on external servers.
          </p>
          <p>
            Slow Spot is designed to operate <strong>100% offline</strong>. All your meditation sessions,
            preferences, and personal data remain private and stored locally on your device.
          </p>

          <h2>Information We Do NOT Collect</h2>
          <p>We want to be crystal clear about what we DON'T do:</p>
          <ul>
            <li>We do NOT collect your name, email, or any personal identifiers</li>
            <li>We do NOT track your location</li>
            <li>We do NOT collect your meditation intentions or personal notes</li>
            <li>We do NOT use analytics or tracking services</li>
            <li>We do NOT share your data with third parties</li>
            <li>We do NOT transmit any data to external servers</li>
            <li>We do NOT use cookies or similar tracking technologies</li>
            <li>We do NOT serve advertisements</li>
          </ul>

          <h2>Information Stored Locally on Your Device</h2>
          <p>The following information is stored <strong>ONLY</strong> on your device using secure local storage:</p>

          <h3>1. User Preferences</h3>
          <ul>
            <li><strong>Language selection</strong> (English, Polish, Spanish, German, French, Hindi)</li>
            <li><strong>Theme preference</strong> (Light, Dark, or System)</li>
            <li><strong>Purpose:</strong> To provide a personalized experience</li>
          </ul>

          <h3>2. Meditation Session History</h3>
          <ul>
            <li><strong>Session duration</strong> and <strong>completion date</strong></li>
            <li><strong>Session type</strong> (e.g., Morning Awakening, Loving Kindness)</li>
            <li><strong>Custom session configurations</strong> (if you create custom sessions)</li>
            <li><strong>Purpose:</strong> To track your meditation progress and maintain streaks</li>
          </ul>

          <h3>3. Progress Statistics</h3>
          <ul>
            <li><strong>Total sessions completed</strong></li>
            <li><strong>Total minutes meditated</strong></li>
            <li><strong>Current and longest meditation streaks</strong></li>
            <li><strong>Achievement progress</strong> (e.g., "10 sessions completed" badge)</li>
            <li><strong>Purpose:</strong> To motivate and celebrate your meditation journey</li>
          </ul>

          <h3>4. Calendar Events (Optional)</h3>
          <ul>
            <li><strong>Meditation reminders</strong> (if you enable calendar integration)</li>
            <li><strong>Stored in:</strong> Your device's native calendar app</li>
            <li><strong>Purpose:</strong> To help you maintain a consistent meditation practice</li>
          </ul>

          <h2>Permissions We Request</h2>

          <h3>Required Permissions</h3>
          <p><strong>None.</strong> The app works without any required permissions.</p>

          <h3>Optional Permissions</h3>
          <p>The following permissions are <strong>optional</strong> and only used if you choose to enable specific features:</p>

          <h4>Calendar Access</h4>
          <ul>
            <li><strong>Why:</strong> To schedule meditation reminders in your device's calendar</li>
            <li><strong>When:</strong> Only when you tap "Schedule Reminder" in the Profile screen</li>
            <li><strong>What:</strong> Creates recurring meditation reminders at your chosen time</li>
            <li><strong>You can:</strong> Disable this anytime by deleting the calendar events or denying permission</li>
          </ul>

          <h2>How Your Data is Protected</h2>

          <h3>Local Storage Only</h3>
          <p>All data is stored using your device's secure local storage.</p>

          <h3>No Network Transmission</h3>
          <p>The app operates in <strong>airplane mode compatible</strong> fashion. Your meditation data never leaves your device.</p>

          <h3>No Account Required</h3>
          <p>You don't need to create an account, provide an email, or sign in. Start meditating immediately.</p>

          <h2>Children's Privacy</h2>
          <p>
            Slow Spot does not collect any data from anyone, including children under 13 (or 16 in the EU).
            The app is family-friendly and suitable for all ages.
          </p>

          <h2>Your Rights</h2>

          <h3>Right to Access</h3>
          <p>All your data is visible within the app:</p>
          <ul>
            <li>View your meditation history in the <strong>Profile</strong> screen</li>
            <li>View your statistics and progress in the <strong>Profile</strong> screen</li>
            <li>View your custom sessions in the <strong>Meditation</strong> screen</li>
          </ul>

          <h3>Right to Delete</h3>
          <p>You can delete your data at any time:</p>
          <ul>
            <li><strong>Individual sessions:</strong> Long-press a custom session and select "Delete"</li>
            <li><strong>All app data:</strong> Use "Clear Data" in Settings or uninstall the app</li>
          </ul>
          <p>There is no "account" to delete because we don't store your data anywhere except your device.</p>

          <h2>Third-Party Services</h2>

          <h3>We Do NOT Use:</h3>
          <ul>
            <li>Analytics services (no Google Analytics, Firebase Analytics, etc.)</li>
            <li>Advertising networks</li>
            <li>Social media SDKs</li>
            <li>Cloud storage services</li>
            <li>Backend servers or APIs</li>
          </ul>

          <h3>Audio Content Sources:</h3>
          <p>
            The meditation bells and ambient sounds included in the app are sourced from royalty-free,
            Creative Commons (CC0) licensed content. These services do NOT have access to your app
            usage or personal data.
          </p>

          <h2>Legal Compliance</h2>
          <p>This Privacy Policy complies with:</p>
          <ul>
            <li><strong>GDPR</strong> (General Data Protection Regulation - EU)</li>
            <li><strong>CCPA</strong> (California Consumer Privacy Act - USA)</li>
            <li><strong>COPPA</strong> (Children's Online Privacy Protection Act - USA)</li>
            <li><strong>Apple App Store Review Guidelines</strong></li>
            <li><strong>Google Play Store Developer Policy</strong></li>
          </ul>

          <h2>Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. When we do:</p>
          <ul>
            <li>We'll update the "Last Updated" date at the top</li>
            <li>We'll notify you via an in-app message for major changes</li>
          </ul>

          <h2>Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@slowspot.app">privacy@slowspot.app</a></li>
            <li><strong>Website:</strong> <a href="https://slowspot.app">https://slowspot.app</a></li>
          </ul>
          <p><strong>Response Time:</strong> We aim to respond to all privacy inquiries within 48 hours.</p>

          <h2>Your Trust</h2>
          <p>
            We built Slow Spot with privacy as a core principle, not an afterthought. Your meditation
            practice is personal and sacred. We will never compromise your privacy for profit or analytics.
          </p>
          <p className="text-lg font-medium text-teal-700">
            Thank you for trusting Slow Spot with your meditation journey.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500">
          <p className="font-light text-lg mb-1">
            <span className="font-light">Slow</span> <span className="text-teal-600 font-semibold">Spot</span>
          </p>
          <p className="text-sm">Mindfulness. Simplicity. Privacy.</p>
          <p className="text-sm mt-2">Version 1.0.0</p>
        </div>
      </article>
    </main>
  );
}
