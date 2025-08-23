import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Event } from '@/types'

// GET - Fetch all events
export async function GET() {
  try {
    console.log('GET /api/admin/events - Starting...')
    
    // Test Firebase admin import
    console.log('Testing Firebase admin import...')
    const { adminDb } = await import('@/lib/firebase-admin')
    console.log('Firebase admin imported successfully')
    
    // Test basic Firestore operation
    console.log('Testing Firestore connection...')
    const eventsSnapshot = await adminDb.collection('events').get()
    console.log('Firestore query successful, got', eventsSnapshot.size, 'documents')
    
    const events: (Event & { id: string })[] = []
    
    eventsSnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event & { id: string })
    })
    
    console.log('GET /api/admin/events - Success, returning', events.length, 'events')
    return NextResponse.json({ success: true, events })
  } catch (error) {
    console.error('Error in GET /api/admin/events:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventData = {
      ...body,
      registeredCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const docRef = await adminDb.collection('events').add(eventData)
    
    return NextResponse.json({ 
      success: true, 
      eventId: docRef.id,
      message: 'Event created successfully' 
    })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

// PUT - Update event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, ...updateData } = body
    
    await adminDb.collection('events').doc(eventId).update({
      ...updateData,
      updatedAt: new Date()
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Event updated successfully' 
    })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

// DELETE - Delete event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }
    
    // Delete related registrations and check-ins first
    const batch = adminDb.batch()
    
    // Delete registrations
    const registrationsQuery = adminDb.collection('registrations').where('eventId', '==', eventId)
    const registrationsSnapshot = await registrationsQuery.get()
    registrationsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    
    // Delete check-ins
    const checkinsQuery = adminDb.collection('checkins').where('eventId', '==', eventId)
    const checkinsSnapshot = await checkinsQuery.get()
    checkinsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    
    // Delete the event
    batch.delete(adminDb.collection('events').doc(eventId))
    
    await batch.commit()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Event and related data deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
