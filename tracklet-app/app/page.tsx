import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { signOut } from './actions/auth';

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900">
      {/*background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/*Navbar*/}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tracklet
            </span>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#features" className="text-gray-700 hover:text-gray-900">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-gray-900">
                How it works
              </a>
              <a href="#faq" className="text-gray-700 hover:text-gray-900">
                FAQ
              </a>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="hidden sm:inline text-xs sm:text-sm text-gray-700 px-3 py-1.5 glass rounded-xl border border-white/20">
                    {user.email}
                  </span>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-xs sm:text-sm glass rounded-xl border border-white/20 text-gray-700 hover:bg-white/30 font-medium transition-all"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-24 sm:space-y-32">
        {/*Hero Section */}
        <section className="grid gap-10 lg:grid-cols-2 items-center pt-8">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/30 text-xs font-medium text-gray-700 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Organized receipts, stress-free returns.
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Never lose a receipt again.
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-xl">
              Tracklet is your smart receipt vault. Store receipts, track return
              windows, and stay on top of warranty expirations&mdash;all in one
              beautiful, secure place.
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <Link
                href="/register"
                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm sm:text-base"
              >
                Get started free
              </Link>
              <a
                href="#preview"
                className="px-6 sm:px-8 py-3 glass border border-white/30 text-gray-800 hover:bg-white/30 font-semibold rounded-xl transition-all text-sm sm:text-base"
              >
                View demo
              </a>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              No credit card required. Sync across devices.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-4 h-24 w-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-blue-500 opacity-70 blur-xl" />
            <div className="absolute bottom-0 -left-6 h-24 w-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-60 blur-xl" />

            <div className="relative glass rounded-3xl border border-white/40 shadow-2xl p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Today
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    Recent purchases
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-medium border border-emerald-500/40">
                  3 items protected
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between glass rounded-2xl px-4 py-3 border border-white/30">
                  <div>
                    <p className="font-medium text-gray-900">MacBook Pro 14”</p>
                    <p className="text-xs text-gray-600">Apple Store – Jan 12</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-emerald-600">
                      25 days left
                    </p>
                    <p className="text-[11px] text-gray-500">Return window</p>
                  </div>
                </div>

                <div className="flex items-center justify-between glass rounded-2xl px-4 py-3 border border-white/30">
                  <div>
                    <p className="font-medium text-gray-900">Noise-cancelling headphones</p>
                    <p className="text-xs text-gray-600">Best Buy – Jan 5</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-amber-600">
                      3 months left
                    </p>
                    <p className="text-[11px] text-gray-500">Warranty</p>
                  </div>
                </div>

                <div className="flex items-center justify-between glass rounded-2xl px-4 py-3 border border-white/30">
                  <div>
                    <p className="font-medium text-gray-900">Running shoes</p>
                    <p className="text-xs text-gray-600">Nike – Dec 28</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-red-500">
                      2 days left
                    </p>
                    <p className="text-[11px] text-gray-500">Return window</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*Benefits Section*/}
        <section id="features" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Everything you need to stay on top of purchases
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Tracklet keeps your receipts safe and turns boring paperwork into a
              simple, visual dashboard.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass rounded-2xl p-6 border border-white/30 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Receipt Vault</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload and store all your receipts in one secure place. Search by
                store, item, or date in seconds.
              </p>
              <p className="text-xs text-gray-500">
                Supported: photos, scans, and PDFs.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Return Countdown</h3>
              <p className="text-sm text-gray-600 mb-4">
                See exactly how many days you have left to return items before
                it&apos;s too late.
              </p>
              <p className="text-xs text-gray-500">
                Smart timelines for each purchase.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Warranty Tracker</h3>
              <p className="text-sm text-gray-600 mb-4">
                Know what&apos;s still covered and when warranties expire, so you
                never miss a claim window.
              </p>
              <p className="text-xs text-gray-500">
                Perfect for electronics, appliances, and more.
              </p>
            </div>
          </div>
        </section>

        {/* How it works sec*/}
        <section id="how-it-works" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              How Tracklet works
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Three simple steps to turn messy drawers of paper into a clean,
              searchable history.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass rounded-2xl p-6 border border-white/30 shadow-lg">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Step 1
              </p>
              <h3 className="text-lg font-semibold mb-2">Add an item</h3>
              <p className="text-sm text-gray-600">
                Enter the item name, store, purchase date, and optional details
                like category and price.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 shadow-lg">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Step 2
              </p>
              <h3 className="text-lg font-semibold mb-2">Upload receipt</h3>
              <p className="text-sm text-gray-600">
                Attach a photo or PDF of your receipt. Tracklet links it to the
                item so it&apos;s always one tap away.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 shadow-lg">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Step 3
              </p>
              <h3 className="text-lg font-semibold mb-2">
                Track return &amp; warranty
              </h3>
              <p className="text-sm text-gray-600">
                See return deadlines and warranty coverage at a glance. Coming
                soon: smart reminders.
              </p>
            </div>
          </div>
        </section>

        {/*Product preview section */}
        <section id="preview" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              See Tracklet in action
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              A clean, focused dashboard designed for receipts, not spreadsheets.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="glass rounded-3xl border border-white/30 shadow-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Items overview
                  </p>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-medium border border-emerald-500/40">
                    Example
                  </span>
                </div>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center glass rounded-2xl px-3 sm:px-4 py-3 border border-white/30">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Living room TV
                      </p>
                      <p className="text-[11px] text-gray-600">
                        Best Buy &bull; Warranty: 1 year
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-500">Return in</p>
                      <p className="text-xs font-semibold text-emerald-600">
                        12 days
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center glass rounded-2xl px-3 sm:px-4 py-3 border border-white/30">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Espresso machine
                      </p>
                      <p className="text-[11px] text-gray-600">
                        Amazon &bull; Warranty: 2 years
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-500">Warranty</p>
                      <p className="text-xs font-semibold text-amber-600">
                        1y 3m left
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center glass rounded-2xl px-3 sm:px-4 py-3 border border-white/30">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Winter jacket
                      </p>
                      <p className="text-[11px] text-gray-600">
                        Zara &bull; Seasonal return
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-500">Return in</p>
                      <p className="text-xs font-semibold text-red-500">
                        3 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-3xl border border-white/30 shadow-2xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Why Tracklet feels different
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tracklet is built specifically for receipts, return windows,
                  and warranties. No clutter, no spreadsheets, just the signals
                  you need.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Clean, focused UI inspired by modern OS design.</li>
                  <li>• Designed for quick capture on the go and deep search later.</li>
                  <li>• Built on Supabase for secure storage and easy sync.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/*FAQ Section*/}
        <section id="faq" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Frequently asked questions
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about how Tracklet handles your
              receipts and data.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            <details className="glass rounded-2xl border border-white/30 p-4 group">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="font-medium text-sm sm:text-base">
                  Is Tracklet free?
                </span>
                <span className="text-xs text-gray-500 group-open:rotate-90 transition-transform">
                  ▶
                </span>
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                During the early stages, Tracklet is free to use. In the future,
                we may introduce paid plans for advanced features, but core
                receipt tracking will have a generous free tier.
              </p>
            </details>

            <details className="glass rounded-2xl border border-white/30 p-4 group">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="font-medium text-sm sm:text-base">
                  Where are my receipts stored?
                </span>
                <span className="text-xs text-gray-500 group-open:rotate-90 transition-transform">
                  ▶
                </span>
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                Your receipt files are stored securely in Supabase Storage, and
                only your account can access them. We never sell your data or
                share your receipts with third parties.
              </p>
            </details>

            <details className="glass rounded-2xl border border-white/30 p-4 group">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="font-medium text-sm sm:text-base">
                  Can I access Tracklet from multiple devices?
                </span>
                <span className="text-xs text-gray-500 group-open:rotate-90 transition-transform">
                  ▶
                </span>
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                Yes. As long as you sign in with the same account, your items
                and receipts stay in sync across desktop and mobile browsers.
              </p>
            </details>

            <details className="glass rounded-2xl border border-white/30 p-4 group">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="font-medium text-sm sm:text-base">
                  What file types are supported?
                </span>
                <span className="text-xs text-gray-500 group-open:rotate-90 transition-transform">
                  ▶
                </span>
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                Tracklet supports common receipt formats: JPG, PNG, and PDF. You
                can upload photos from your phone or scans from your computer.
              </p>
            </details>

            <details className="glass rounded-2xl border border-white/30 p-4 group">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="font-medium text-sm sm:text-base">
                  How do reminders work?
                </span>
                <span className="text-xs text-gray-500 group-open:rotate-90 transition-transform">
                  ▶
                </span>
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                Reminder notifications for return deadlines and warranty
                expirations are coming soon. You&apos;ll be able to choose how
                early you want to be notified.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/*Footer*/}
      <footer className="relative border-t border-white/20 glass-dark backdrop-blur-xl mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Tracklet. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-gray-900">
              How it works
            </a>
            <a href="#faq" className="hover:text-gray-900">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

