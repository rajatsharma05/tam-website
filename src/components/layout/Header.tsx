'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Logo from '@/components/ui/Logo'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { user, loading, isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  
  // Check if we're on the home page (with hero background)
  const isHomePage = pathname === '/'
  
  // Handle scroll effect for homepage
  useEffect(() => {
    if (!isHomePage) return
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      // Change header style when scrolled past hero section (approximately 100vh)
      setIsScrolled(scrollPosition > window.innerHeight * 0.8)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className={`backdrop-blur-md shadow-lg border-b sticky top-0 z-50 transition-all duration-300 relative ${
      isHomePage 
        ? isScrolled 
          ? 'bg-white/95 border-gray-200' 
          : 'bg-white/20 border-white/20'
        : 'bg-white/95 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group">
              <Logo size="lg" className="group-hover:scale-105 transition-transform duration-300" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`transition-all duration-200 font-medium relative group ${
                isHomePage 
                  ? isScrolled 
                    ? 'text-gray-700 hover:text-primary-600' 
                    : 'text-white hover:text-white/80 drop-shadow-lg'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                isHomePage 
                  ? isScrolled ? 'bg-primary-600' : 'bg-white'
                  : 'bg-primary-600'
              }`}></span>
            </Link>
            <Link 
              href="/events" 
              className={`transition-all duration-200 font-medium relative group ${
                isHomePage 
                  ? isScrolled 
                    ? 'text-gray-700 hover:text-primary-600' 
                    : 'text-white hover:text-white/80 drop-shadow-lg'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Events
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                isHomePage 
                  ? isScrolled ? 'bg-primary-600' : 'bg-white'
                  : 'bg-primary-600'
              }`}></span>
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className={`transition-all duration-200 font-medium relative group ${
                  isHomePage 
                    ? isScrolled 
                      ? 'text-gray-700 hover:text-primary-600' 
                      : 'text-white hover:text-white/80 drop-shadow-lg'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Admin Panel
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  isHomePage 
                    ? isScrolled ? 'bg-primary-600' : 'bg-white'
                    : 'bg-primary-600'
                }`}></span>
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className={`w-24 h-10 rounded animate-pulse backdrop-blur-sm ${
                isHomePage 
                  ? isScrolled ? 'bg-gray-200' : 'bg-white/20'
                  : 'bg-gray-200'
              }`} />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border ${
                    isHomePage 
                      ? isScrolled 
                        ? 'bg-primary/10 border-primary/20' 
                        : 'bg-white/20 border-white/30'
                      : 'bg-primary/10 border-primary/20'
                  }`}>
                    <span className={`font-medium text-sm ${
                      isHomePage 
                        ? isScrolled 
                          ? 'text-primary-700' 
                          : 'text-white drop-shadow-lg'
                        : 'text-primary-700'
                    }`}>
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${
                      isHomePage 
                        ? isScrolled 
                          ? 'text-gray-700' 
                          : 'text-white drop-shadow-lg'
                        : 'text-gray-700'
                    }`}>Welcome back!</span>
                    <span className={`text-xs ${
                      isHomePage 
                        ? isScrolled 
                          ? 'text-gray-500' 
                          : 'text-white/80 drop-shadow-lg'
                        : 'text-gray-500'
                    }`}>{user.email}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className={`shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm ${
                    isHomePage 
                      ? isScrolled 
                        ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' 
                        : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button className={`shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold ${
                  isHomePage 
                    ? isScrolled 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-900'
                    : 'bg-primary text-white'
                }`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 backdrop-blur-sm transform hover:scale-105 ${
                isHomePage 
                  ? isScrolled 
                    ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-100' 
                    : 'text-white hover:text-white/80 hover:bg-white/20'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              <svg className={`w-6 h-6 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-md shadow-xl z-50 border-t transform transition-all duration-300 ease-out animate-slide-down ${
            isHomePage 
              ? isScrolled 
                ? 'bg-white/95 border-gray-200' 
                : 'bg-white/20 border-white/20'
              : 'bg-white/95 border-gray-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`transition-all duration-300 font-medium px-4 py-3 rounded-lg flex items-center transform hover:scale-105 hover:shadow-lg ${
                  isHomePage 
                    ? isScrolled 
                      ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50' 
                      : 'text-white hover:text-white/80 hover:bg-white/20 drop-shadow-lg'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <Link 
                href="/events" 
                className={`transition-all duration-300 font-medium px-4 py-3 rounded-lg flex items-center transform hover:scale-105 hover:shadow-lg ${
                  isHomePage 
                    ? isScrolled 
                      ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50' 
                      : 'text-white hover:text-white/80 hover:bg-white/20 drop-shadow-lg'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Events
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={`transition-all duration-300 font-medium px-4 py-3 rounded-lg flex items-center transform hover:scale-105 hover:shadow-lg ${
                    isHomePage 
                      ? isScrolled 
                        ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50' 
                        : 'text-white hover:text-white/80 hover:bg-white/20 drop-shadow-lg'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Admin Panel
                </Link>
              )}
              {user && (
                <div className={`px-4 py-4 border-t ${
                  isHomePage 
                    ? isScrolled ? 'border-gray-200' : 'border-white/20'
                    : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center border ${
                      isHomePage 
                        ? isScrolled 
                          ? 'bg-primary/10 border-primary/20' 
                          : 'bg-white/20 border-white/30'
                        : 'bg-primary/10 border-primary/20'
                    }`}>
                      <span className={`font-medium text-sm ${
                        isHomePage 
                          ? isScrolled 
                            ? 'text-primary-700' 
                            : 'text-white drop-shadow-lg'
                          : 'text-primary-700'
                      }`}>
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                                      <div className="flex flex-col">
                    <span className={`text-sm font-medium ${
                      isHomePage 
                        ? isScrolled 
                          ? 'text-gray-700' 
                          : 'text-white drop-shadow-lg'
                        : 'text-gray-700'
                    }`}>Welcome back!</span>
                    <span className={`text-xs ${
                      isHomePage 
                        ? isScrolled 
                          ? 'text-gray-500' 
                          : 'text-white/80 drop-shadow-lg'
                        : 'text-gray-500'
                    }`}>{user.email}</span>
                  </div>
                </div>
                <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className={`w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm ${
                      isHomePage 
                        ? isScrolled 
                          ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' 
                          : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </Button>
                </div>
              )}
            </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 