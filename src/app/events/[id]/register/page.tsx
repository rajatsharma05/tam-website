'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Event } from '@/types'
import { useAuth } from '@/components/auth/AuthProvider'
import RegistrationForm from '@/components/events/RegistrationForm'

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

  // Add explicit types for formData
  interface IndividualFormData {
    name: string;
    rollNumber: string;
    departmentSection: string;
    phone: string;
  }
  interface TeamFormData {
    teamName: string;
    teamLeaderEmail: string;
    teamMembers: Array<{ name: string; rollNumber: string; departmentSection: string; phone: string }>;
  }

  const handleRegistrationSubmit = async (formData: IndividualFormData | TeamFormData) => {
    if (!event) return;
    setSubmitting(true);
    try {
      if ('teamName' in formData && 'teamLeaderEmail' in formData && 'teamMembers' in formData) {
        // TEAM REGISTRATION
        const qrData = `${event.id}-team-${formData.teamName.replace(/\s+/g, '')}-${Date.now()}`;
        const registrationData = {
          eventId: event.id,
          eventName: event.title,
          teamName: formData.teamName,
          teamLeaderEmail: formData.teamLeaderEmail,
          teamMembers: formData.teamMembers,
          qrCode: qrData,
          isCheckedIn: false,
          createdAt: new Date()
        };
        await addDoc(collection(db, 'registrations'), registrationData);
        await updateDoc(doc(db, 'events', event.id), {
          registeredCount: increment(formData.teamMembers.length)
        });
        // Send QR to team leader
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.teamLeaderEmail,
            eventName: event.title,
            teamName: formData.teamName,
            qrCode: qrData
          }),
        });
        router.push(`/events/${event.id}/success`);
      } else {
        // INDIVIDUAL REGISTRATION (existing logic)
        if (!user) return;
        const qrData = `${event.id}-${user.uid}-${Date.now()}`;
        const registrationData = {
          eventId: event.id,
          eventName: event.title,
          registrantName: (formData as IndividualFormData).name,
          rollNumber: (formData as IndividualFormData).rollNumber,
          departmentSection: (formData as IndividualFormData).departmentSection,
          email: user.email,
          phone: (formData as IndividualFormData).phone,
          qrCode: qrData,
          isCheckedIn: false,
          createdAt: new Date()
        };
        await addDoc(collection(db, 'registrations'), registrationData);
        await updateDoc(doc(db, 'events', event.id), {
          registeredCount: increment(1)
        });
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            eventName: event.title,
            registrantName: (formData as IndividualFormData).name,
            qrCode: qrData
          }),
        });
        router.push(`/events/${event.id}/success`);
      }
    } catch {
      alert('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <button
            onClick={() => router.push('/auth')}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Sign In
          </button>
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

  return (
    <RegistrationForm
      event={event}
      userEmail={user.email || ''}
      onSubmit={handleRegistrationSubmit}
      loading={submitting}
    />
  )
} 