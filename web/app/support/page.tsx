import Link from 'next/link';

export const metadata = {
  title: 'Support - Slow Spot',
  description: 'Get help and support for Slow Spot meditation app.',
};

export default function Support() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-slate-800 hover:text-teal-600 transition-colors">
            <span className="font-light">Slow</span> <span className="text-teal-600">Spot</span>
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-slate-600 hover:text-teal-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-slate-600 hover:text-teal-600 transition-colors">Terms</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light text-slate-800 mb-2">Support</h1>
        <p className="text-slate-500 mb-10">We're here to help you with your meditation journey.</p>

        {/* Contact Card */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Contact Us</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-teal-600 font-medium">Email</p>
                <a href="mailto:support@slowspot.app" className="text-teal-800 hover:text-teal-600 transition-colors">
                  support@slowspot.app
                </a>
              </div>
            </div>
            <p className="text-teal-700 text-sm">
              Response time: We aim to respond within 48 hours.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-2">How do I get started with meditation?</h3>
              <p className="text-slate-600">
                Simply open the app and tap the "Medytuj" (Meditate) button on the home screen.
                Choose a preset session or create your own custom session. The app will guide
                you through the meditation with optional bells and ambient sounds.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-2">Does the app work offline?</h3>
              <p className="text-slate-600">
                Yes! Slow Spot is designed to work 100% offline. All meditation sessions,
                sounds, and features are available without an internet connection. Your data
                is stored locally on your device.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-2">How do I set up meditation reminders?</h3>
              <p className="text-slate-600">
                Go to your Profile screen and tap "Schedule Reminder". You can choose your
                preferred time for daily meditation reminders. The app will request calendar
                permission to create these reminders.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-2">Can I create custom meditation sessions?</h3>
              <p className="text-slate-600">
                Yes! Tap the "+" button in the Meditation screen to create a custom session.
                You can customize the duration, ambient sounds, interval bells, and more.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-2">How do I change the app language?</h3>
              <p className="text-slate-600">
                Go to Settings and find the Language section. Slow Spot supports English,
                Polish, Spanish, German, French, and Hindi.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-2">How do I delete my data?</h3>
              <p className="text-slate-600">
                Go to Settings {">"} Data & Privacy {">"} "Clear Data" to delete all your local data.
                Alternatively, uninstalling the app will remove all data from your device.
                Since we don't store any data on servers, there's nothing else to delete.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-2">Is my data private?</h3>
              <p className="text-slate-600">
                Absolutely. Slow Spot doesn't collect, transmit, or store any of your personal
                data on external servers. All your meditation history, preferences, and progress
                remain on your device only. Read our{' '}
                <Link href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>{' '}
                for more details.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-2">The app is not working properly. What should I do?</h3>
              <p className="text-slate-600">
                Try these steps: 1) Close and reopen the app, 2) Restart your device,
                3) Make sure you have the latest version from App Store or Google Play.
                If the problem persists, please contact us at support@slowspot.app with
                details about the issue.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Feedback & Suggestions</h2>
          <p className="text-slate-600 mb-4">
            We love hearing from our users! If you have suggestions for new features,
            improvements, or just want to share your meditation experience, please reach out:
          </p>
          <a
            href="mailto:feedback@slowspot.app"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Feedback
          </a>
        </div>

        {/* App Info */}
        <div className="text-center text-slate-500">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">App Information</h2>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-slate-400 mb-1">Version</p>
              <p className="font-medium text-slate-700">1.0.0</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-slate-400 mb-1">Platform</p>
              <p className="font-medium text-slate-700">iOS & Android</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500">
          <p className="font-light text-lg mb-1">
            <span className="font-light">Slow</span> <span className="text-teal-600 font-semibold">Spot</span>
          </p>
          <p className="text-sm">Mindfulness. Simplicity. Privacy.</p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <Link href="/privacy" className="hover:text-teal-600 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-teal-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
