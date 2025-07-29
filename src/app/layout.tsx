import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TAM - Technology Awareness Month',
  description: 'Technology Awareness Month - Bridging the gap between students and cutting-edge technology through interactive events, workshops, and discussions.',
  keywords: 'technology, awareness, events, workshops, students, innovation, TAM',
  authors: [{ name: 'TAM Team' }],
  creator: 'Technology Awareness Month',
  publisher: 'TAM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'TAM - Technology Awareness Month',
    description: 'Technology Awareness Month - Bridging the gap between students and cutting-edge technology',
    url: 'https://tam-website.vercel.app',
    siteName: 'TAM',
    images: [
      {
        url: '/tam-logo.png',
        width: 1200,
        height: 630,
        alt: 'TAM - Technology Awareness Month',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAM - Technology Awareness Month',
    description: 'Technology Awareness Month - Bridging the gap between students and cutting-edge technology',
    images: ['/tam-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 