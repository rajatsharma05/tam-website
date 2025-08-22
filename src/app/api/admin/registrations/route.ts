import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Registration } from '@/types'
import * as XLSX from 'xlsx'
import { Query, CollectionReference } from 'firebase-admin/firestore'

// GET - Fetch registrations with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const lastDocId = searchParams.get('lastDocId')
    
    let queryRef: Query | CollectionReference = adminDb.collection('registrations')
    
    if (eventId) {
      queryRef = queryRef.where('eventId', '==', eventId)
    }
    
    // Add pagination
    if (lastDocId && lastDocId !== 'null') {
      const lastDoc = await adminDb.collection('registrations').doc(lastDocId).get()
      if (lastDoc.exists) {
        queryRef = queryRef.orderBy('createdAt', 'desc').startAfter(lastDoc).limit(pageSize)
      }
    } else {
      queryRef = queryRef.orderBy('createdAt', 'desc').limit(pageSize)
    }
    
    const snapshot = await queryRef.get()
    const registrations: (Registration & { id: string })[] = []
    
    snapshot.forEach((doc) => {
      registrations.push({ id: doc.id, ...doc.data() } as Registration & { id: string })
    })
    
    const hasNext = snapshot.docs.length === pageSize
    const lastVisible = snapshot.docs[snapshot.docs.length - 1]
    
    return NextResponse.json({ 
      success: true, 
      registrations,
      hasNext,
      lastDocId: lastVisible ? lastVisible.id : null
    })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}

// PUT - Update registration (e.g., payment approval)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { registrationId, ...updateData } = body
    
    await adminDb.collection('registrations').doc(registrationId).update({
      ...updateData,
      updatedAt: new Date()
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration updated successfully' 
    })
  } catch (error) {
    console.error('Error updating registration:', error)
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
  }
}

// POST - Export registrations to Excel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId } = body
    
    let queryRef: Query | CollectionReference = adminDb.collection('registrations')
    if (eventId) {
      queryRef = queryRef.where('eventId', '==', eventId)
    }
    
    const snapshot = await queryRef.get()
    const registrations: Record<string, unknown>[] = []
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      registrations.push({
        'Event Name': data.eventName,
        'Registrant Name': data.registrantName,
        'Roll Number': data.rollNumber,
        'Department/Section': data.departmentSection,
        'Email': data.email,
        'Phone': data.phone,
        'Team Name': data.teamName || 'N/A',
        'Payment Method': data.paymentMethod || 'N/A',
        'Payment Status': data.paymentStatus || 'N/A',
        'Payment Amount': data.paymentAmount || 0,
        'Registration Date': data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
        'Check-in Status': data.isCheckedIn ? 'Yes' : 'No',
        'Check-in Time': data.checkInTime ? new Date(data.checkInTime.seconds * 1000).toLocaleString() : 'N/A'
      })
    })
    
    // Generate Excel file
    const worksheet = XLSX.utils.json_to_sheet(registrations)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations')
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    const base64Data = excelBuffer.toString('base64')
    
    return NextResponse.json({ 
      success: true, 
      excelData: base64Data,
      message: 'Excel file generated successfully' 
    })
  } catch (error) {
    console.error('Error exporting registrations:', error)
    return NextResponse.json({ error: 'Failed to export registrations' }, { status: 500 })
  }
}
