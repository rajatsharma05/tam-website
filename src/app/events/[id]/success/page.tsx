'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Event } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RegistrationSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash' | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, 'events', params.id as string))
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event)
        }
        
        // Get payment method from URL params or localStorage
        const urlParams = new URLSearchParams(window.location.search)
        const method = urlParams.get('paymentMethod') as 'online' | 'cash' | null
        setPaymentMethod(method)
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-green-600">
              {paymentMethod === 'cash' ? 'Registration Pending!' : 'Registration Successful!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                You&apos;re registered for {event?.title}
              </h3>
              {paymentMethod === 'cash' ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Cash Payment Required</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Your registration is pending. Please pay ₹{event?.price} at the event venue. 
                          You&apos;ll receive a confirmation email once payment is approved.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">What&apos;s Next?</h4>
                    <ul className="text-sm text-blue-800 space-y-1 text-left">
                      <li>• Pay the registration fee at the event venue</li>
                      <li>• Wait for admin approval of your payment</li>
                      <li>• Check your email for confirmation once approved</li>
                      <li>• Present the QR code at the event entrance</li>
                      <li>• Arrive 15 minutes before the event starts</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    We&apos;ve sent a confirmation email with your QR code. Please check your inbox.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">What&apos;s Next?</h4>
                    <ul className="text-sm text-blue-800 space-y-1 text-left">
                      <li>• Check your email for the confirmation with QR code</li>
                      <li>• Save the QR code to your phone or print it</li>
                      <li>• Present the QR code at the event entrance</li>
                      <li>• Arrive 15 minutes before the event starts</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Link href="/events">
                <Button variant="outline" className="w-full">
                  Browse More Events
                </Button>
              </Link>
              <Button onClick={() => router.push('/')} className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 