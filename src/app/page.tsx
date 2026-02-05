import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-brand-300 text-sm font-medium">Dynamic QR codes with real-time analytics</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6 text-balance">
            QR codes that{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              adapt and track
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Create dynamic QR codes where you can change the destination URL anytime. Track every scan
            with detailed analytics — location, device, time, and referrer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-xl text-lg font-medium transition-colors shadow-lg shadow-brand-600/25"
            >
              Create Free QR Code
            </Link>
            <Link
              href="/dashboard"
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-8 py-3.5 rounded-xl text-lg font-medium transition-colors border border-gray-700"
            >
              View Dashboard
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">No signup required • 3 free QR codes</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔄',
              title: 'Dynamic URLs',
              desc: 'Change the destination URL anytime without reprinting the QR code. Perfect for menus, events, and campaigns.',
            },
            {
              icon: '📊',
              title: 'Detailed Analytics',
              desc: 'Track total scans, geographic distribution, device types, referrers, and scan patterns over time.',
            },
            {
              icon: '🎨',
              title: 'Customizable Design',
              desc: 'Choose colors, sizes, and download in PNG, SVG, or PDF. Make your QR code match your brand.',
            },
            {
              icon: '⚡',
              title: 'Instant Redirect',
              desc: 'Lightning-fast redirects. Users scan and land on your page in milliseconds.',
            },
            {
              icon: '🔒',
              title: 'Toggle On/Off',
              desc: 'Deactivate QR codes anytime. Reactivate when ready. Full control over your codes.',
            },
            {
              icon: '🆓',
              title: 'Free to Start',
              desc: 'Create up to 3 QR codes without even signing up. Upgrade to unlimited for $9/month.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-brand-900/50 to-purple-900/50 border border-brand-800/50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to trace your QR codes?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Join thousands of marketers, restaurants, and businesses who use QrTrace to create
            smart, trackable QR codes.
          </p>
          <Link
            href="/create"
            className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-xl text-lg font-medium transition-colors"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
