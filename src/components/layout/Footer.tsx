import Logo from '@/components/ui/Logo'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary to-purple-600 py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Content */}
          <div className="mb-12">
            <div className="flex justify-center items-center mb-6">
              <Logo size="lg" showText={true} variant="white" className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Technology Awareness Month</h3>
            <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
              Bridging the gap between students and cutting-edge technology through interactive events, workshops, and discussions.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-12">
            {/* Gmail Icon */}
            <a href="mailto:technologyawarenessmonth@gmail.com" className="group">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
            </a>

            {/* Instagram Icon */}
            <a href="https://instagram.com/smec.tam" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>

            {/* LinkedIn Icon */}
            <a href="https://linkedin.com/company/technologyawarenessmonth" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
            </a>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/" className="block text-white/80 hover:text-white transition-colors duration-200">Home</Link>
                <Link href="/events" className="block text-white/80 hover:text-white transition-colors duration-200">Events</Link>
                <Link href="/auth" className="block text-white/80 hover:text-white transition-colors duration-200">Sign In</Link>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2">
                <a href="mailto:technologyawarenessmonth@gmail.com" className="block text-white/80 hover:text-white transition-colors duration-200">technologyawarenessmonth@gmail.com</a>
                <a href="tel:+916395896319" className="block text-white/80 hover:text-white transition-colors duration-200">+91 6395896319</a>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="space-y-2">
                <a href="https://instagram.com/smec.tam" target="_blank" rel="noopener noreferrer" className="block text-white/80 hover:text-white transition-colors duration-200">Instagram</a>
                <a href="https://linkedin.com/company/technologyawarenessmonth" target="_blank" rel="noopener noreferrer" className="block text-white/80 hover:text-white transition-colors duration-200">LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="border-t border-white/20 pt-8">
            <div className="text-white/90 font-mono text-sm">
              <span className="inline-block border border-white/30 px-2 py-1 rounded mr-2">©</span>
              2025 TAM LTD. ALL RIGHTS RESERVED.
            </div>
            <p className="text-white/70 text-xs mt-2">Technology Awareness Month - Empowering students through technology</p>
          </div>
        </div>
      </div>
    </footer>
  )
} 