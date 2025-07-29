'use client'

import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AddTestEventPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const addTestEvent = async () => {
    setLoading(true)
    setMessage('')

    try {
      const testEvent = {
        title: "Test Workshop - UI/UX Design",
        description: "Join us for an exciting workshop on UI/UX design fundamentals. Learn about user interface design, user experience principles, and modern design tools. This hands-on workshop will cover wireframing, prototyping, and user testing methodologies.",
        date: "2024-02-15",
        time: "14:00",
        location: "Conference Room A, Tech Building",
        capacity: 25,
        registeredCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await addDoc(collection(db, 'events'), testEvent)
      setMessage('Test event added successfully! You can now test registration.')
    } catch (error) {
      console.error('Error adding test event:', error)
      setMessage('Error adding test event. Please check your Firebase configuration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Add Test Event</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              This will add a test event to your database to verify registration functionality.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-blue-900 mb-2">Test Event Details:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Title:</strong> Test Workshop - UI/UX Design</li>
                <li>• <strong>Date:</strong> February 15, 2024</li>
                <li>• <strong>Time:</strong> 2:00 PM</li>
                <li>• <strong>Location:</strong> Conference Room A, Tech Building</li>
                <li>• <strong>Capacity:</strong> 25 people</li>
              </ul>
            </div>

            <Button 
              onClick={addTestEvent} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Adding Test Event...' : 'Add Test Event'}
            </Button>

            {message && (
              <div className={`mt-4 p-3 rounded-md ${
                message.includes('Error') 
                  ? 'bg-red-50 border border-red-200 text-red-600' 
                  : 'bg-green-50 border border-green-200 text-green-600'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                After adding the test event, you can:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Go to <strong>/events</strong> to see the event</li>
                <li>• Register for the event to test the full flow</li>
                <li>• Check your email for the QR code</li>
                <li>• Use the QR code in the check-in system</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 