'use client'

import { Event } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EventCardProps {
  event: Event
  onToggle: (eventId: string, isActive: boolean) => void
  onDelete: (eventId: string) => void
}

export default function EventCard({ event, onToggle, onDelete }: EventCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(event.date).toLocaleDateString()} at {event.time} - {event.location}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={event.isActive ? "outline" : "default"}
              onClick={() => onToggle(event.id, event.isActive)}
            >
              {event.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(event.id)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{event.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Capacity: {event.registeredCount}/{event.capacity}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            event.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {event.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
} 