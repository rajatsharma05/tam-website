'use client'

import { useState } from 'react'
import { Event } from '@/types'
import { Button } from '@/components/ui/button'
import AddEventForm from './AddEventForm'
import EventCard from './EventCard'

interface EventsTabProps {
  events: Event[]
  onAddEvent: (eventData: {
    title: string
    description: string
    date: string
    time: string
    location: string
    capacity: number
  }) => void
  onToggleEvent: (eventId: string, isActive: boolean) => void
  onDeleteEvent: (eventId: string) => void
}

export default function EventsTab({ 
  events, 
  onAddEvent, 
  onToggleEvent, 
  onDeleteEvent 
}: EventsTabProps) {
  const [showAddEvent, setShowAddEvent] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
        <Button onClick={() => setShowAddEvent(!showAddEvent)}>
          {showAddEvent ? 'Cancel' : 'Add Event'}
        </Button>
      </div>

      {showAddEvent && (
        <AddEventForm
          onSubmit={(eventData) => {
            onAddEvent(eventData)
            setShowAddEvent(false)
          }}
          onCancel={() => setShowAddEvent(false)}
        />
      )}

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600">Create your first event to get started!</p>
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onToggle={onToggleEvent}
              onDelete={onDeleteEvent}
            />
          ))
        )}
      </div>
    </div>
  )
} 