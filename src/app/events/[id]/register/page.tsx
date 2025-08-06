'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Event } from '@/types'
import { useAuth } from '@/components/auth/AuthProvider'
import RegistrationForm from '@/components/events/RegistrationForm'
import { Button } from '@/components/ui/button'

export default function EventRegistrationPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, 'events', params.id as string))
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event)
        } else {
          router.push('/events')
        }
      } catch (error) {
        console.error('Error fetching event:', error)
        router.push('/events')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to register for this event.</p>
          <Button
            onClick={() => router.push('/auth')}
            variant="default"
            className="px-6 py-2 mt-2"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/events')}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const handleRegistration = async (
    formData:
      | { name: string; rollNumber: string; departmentSection: string; phone: string }
      | { teamName: string; teamMembers: Array<{ name: string; rollNumber: string; departmentSection: string; phone: string }>; teamLeaderEmail: string }
  ) => {
    if (!event || !user) return

    setSubmitting(true)
    try {
      const qrCode = `${event.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Prepare registration data with correct field names
      const registrationData = {
        eventId: event.id,
        eventName: event.title,
        email: user.email,
        createdAt: new Date(),
        isCheckedIn: false,
        qrCode,
        ...(('teamName' in formData) 
          ? {
              teamName: formData.teamName,
              teamLeaderEmail: formData.teamLeaderEmail,
              teamMembers: formData.teamMembers,
              // For team events, use the first member's details as the main registrant
              registrantName: formData.teamMembers[0].name,
              rollNumber: formData.teamMembers[0].rollNumber,
              departmentSection: formData.teamMembers[0].departmentSection,
              phone: formData.teamMembers[0].phone,
            }
          : {
              registrantName: formData.name,
              rollNumber: formData.rollNumber,
              departmentSection: formData.departmentSection,
              phone: formData.phone,
            }
        )
      }

      // Save registration to Firebase
      await addDoc(collection(db, 'registrations'), registrationData)
      
      // Send confirmation email
      try {
        const emailData = {
          email: user.email,
          eventName: event.title,
          qrCode,
          ...(('teamName' in formData) 
            ? { teamName: formData.teamName }
            : { registrantName: formData.name }
          )
        }

        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData)
        })

        if (!emailResponse.ok) {
          console.warn('Email sending failed, but registration was successful')
        } else {
          console.log('Confirmation email sent successfully')
        }
      } catch (emailError) {
        console.warn('Email sending failed:', emailError)
        // Don't fail the registration if email fails
      }
      
      // Redirect to success page
      router.push(`/events/${event.id}/success`)
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <RegistrationForm
      event={event}
      userEmail={user.email || ''}
      onSubmit={handleRegistration}
      loading={submitting}
    />
  )
} 