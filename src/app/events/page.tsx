'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Event } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EventDetailsModal from '@/components/events/EventDetailsModal'
import Image from 'next/image'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, 'events')
        const q = query(eventsRef, where('isActive', '==', true))
        const querySnapshot = await getDocs(q)
        
        const eventsData: Event[] = []
        querySnapshot.forEach((doc) => {
          eventsData.push({ id: doc.id, ...doc.data() } as Event)
        })
        
        // Sort events by date
        const sortedEvents = eventsData.sort((a, b) => {
          const aDate = a.date ? new Date(a.date).getTime() : 0
          const bDate = b.date ? new Date(b.date).getTime() : 0
          return aDate - bDate
        })
        setEvents(sortedEvents)
        setFilteredEvents(sortedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    const filtered = events.filter(event =>
      (event.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (event.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (event.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    setFilteredEvents(filtered)
  }, [searchTerm, events])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading exciting events...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <span className="text-sm font-medium text-primary-700">🎉 Discover Amazing Events</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover <span className="text-gradient">Events</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore and register for exciting events happening around you. From workshops to competitions, find your next adventure in technology.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-16">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search events by name, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:border-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            />
          </div>
        </div>

        {/* Events Grid */}
        <EventDetailsModal event={selectedEvent} open={modalOpen} onClose={() => setModalOpen(false)} />
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {searchTerm ? 'No events found' : 'No events available'}
            </h3>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search terms or browse all events' : 'Check back later for upcoming events!'}
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm('')}
                variant="outline" 
                className="mt-6 btn-secondary"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <Card 
                key={event.id} 
                className="card-hover border-0 shadow-lg overflow-hidden animate-fade-in flex flex-col h-full min-h-[280px] group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {event.posterUrl && (
                  <Image
                    src={event.posterUrl}
                    alt={`${event.title} poster`}
                    width={600}
                    height={340}
                    className="w-full h-40 object-cover rounded-t-lg"
                    priority={index < 3}
                  />
                )}
                <div className="h-2 bg-gradient-primary group-hover:h-3 transition-all duration-300"></div>
                <CardHeader className="pb-4 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">{event.title}</CardTitle>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                      event.registeredCount >= event.capacity 
                        ? 'bg-red-100 text-red-800 border border-red-200' 
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {event.registeredCount >= event.capacity ? 'Full' : `${event.capacity - event.registeredCount} spots left`}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col flex-1">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors duration-200">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors duration-200">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors duration-200">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="font-medium">{(() => {
                        const date = new Date(`1970-01-01T${event.time}`);
                        if (!isNaN(date.getTime())) {
                          return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                        }
                        return event.time;
                      })()}</span>
                    </div>
                    {event.price !== undefined && event.price > 0 && (
                      <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors duration-200">
                          <span className="text-green-600 font-bold text-lg">₹</span>
                        </div>
                        <span className="font-medium text-green-600">₹{event.price} Registration Fee</span>
                      </div>
                    )}
                    {event.price === 0 && (
                      <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-medium text-blue-600">Free Event</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto space-y-3">
                    <Button 
                      className="btn-secondary w-full group-hover:bg-primary/10 transition-all duration-200 mb-3"
                      variant="outline"
                      onClick={() => {
                        setSelectedEvent(event)
                        setModalOpen(true)
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </Button>
                    <Link href={`/events/${event.id}/register`} className="w-full">
                      <Button
                        className="btn-primary w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        disabled={event.registeredCount >= event.capacity}
                      >
                        {event.registeredCount >= event.capacity ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Event Full
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Register Now
                          </>
                        )}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 