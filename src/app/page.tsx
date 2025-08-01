'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import HeroBackground from '@/components/HeroBackground'

export default function HomePage() {
  const { user, loading } = useAuth()
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center -mt-20">
        {/* Auto-scrolling background */}
        <HeroBackground />
        
        {/* Content Container */}
        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
            <div className="text-center">
              
              {/* Logo Section */}
              <div className="mb-8 animate-fade-in">
                <div className="inline-block">
                  <Image
                    src="/tam-logo.png"
                    alt="TAM Logo"
                    width={160}
                    height={160}
                    className="h-32 w-32 md:h-40 md:w-40 object-contain drop-shadow-lg"
                  />
                </div>
              </div>
              
              {/* Main Heading */}
              <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Technology Awareness Month
                </h1>
              </div>
              
              {/* Subtitle */}
              <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                  Bridging the gap between students and cutting-edge technology through interactive events, workshops, and discussions.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <Link href="/events">
                  <Button size="lg" className="text-base px-8 py-4 h-auto bg-white text-gray-900 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Browse Events
                  </Button>
                </Link>
                
                {!user && !loading && (
                  <Link href="/auth">
                    <Button variant="outline" size="lg" className="text-base px-8 py-4 h-auto bg-white/10 text-white font-semibold border-2 border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.8s' }}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">10+</div>
                  <div className="text-white/80 text-sm md:text-base">Years of Impact</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
                  <div className="text-white/80 text-sm md:text-base">Students Reached</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
                  <div className="text-white/80 text-sm md:text-base">Events Hosted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About TAM Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
              <span className="text-sm font-medium text-primary-700">About Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What is <span className="text-gradient">TAM</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Technology Awareness Month (TAM) bridges the gap between students and cutting-edge technology through interactive events, workshops, and discussions. Our mission is to inspire curiosity, foster innovation, and build a community of tech-driven leaders. With 10+ years of impact, we continue to connect students with the ever-evolving world of technology.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="card-hover border-0 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-primary"></div>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation Hub</h3>
                <p className="text-gray-600">Explore cutting-edge technologies and innovative solutions through hands-on workshops and demonstrations.</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-0 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-primary"></div>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community Building</h3>
                <p className="text-gray-600">Connect with like-minded students and industry professionals to build lasting relationships and networks.</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-0 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-primary"></div>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Knowledge Sharing</h3>
                <p className="text-gray-600">Learn from experts and share your knowledge through interactive sessions and collaborative projects.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join us in exploring the future of technology</p>
          <div className="flex justify-center">
            <Link href="/events">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 