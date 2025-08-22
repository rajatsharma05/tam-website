import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Checkin } from '@/types'
import * as XLSX from 'xlsx'
import { Query, CollectionReference } from 'firebase-admin/firestore'

// GET - Fetch check-ins with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const lastDocId = searchParams.get('lastDocId')
    
    let queryRef: Query | CollectionReference = adminDb.collection('checkins')
    
    if (eventId) {
      queryRef = queryRef.where('eventId', '==', eventId)
    }
    
    // Add pagination
    if (lastDocId && lastDocId !== 'null') {
      const lastDoc = await adminDb.collection('checkins').doc(lastDocId).get()
      if (lastDoc.exists) {
        queryRef = queryRef.orderBy('checkInTime', 'desc').startAfter(lastDoc).limit(pageSize)
      }
    } else {
      queryRef = queryRef.orderBy('checkInTime', 'desc').limit(pageSize)
    }
    
    const snapshot = await queryRef.get()
    const checkins: (Checkin & { id: string })[] = []
    
    snapshot.forEach((doc) => {
      checkins.push({ id: doc.id, ...doc.data() } as Checkin & { id: string })
    })
    
    const hasNext = snapshot.docs.length === pageSize
    const lastVisible = snapshot.docs[snapshot.docs.length - 1]
    
    return NextResponse.json({ 
      success: true, 
      checkins,
      hasNext,
      lastDocId: lastVisible ? lastVisible.id : null
    })
  } catch (error) {
    console.error('Error fetching check-ins:', error)
    return NextResponse.json({ error: 'Failed to fetch check-ins' }, { status: 500 })
  }
}

// POST - Export check-ins to Excel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId } = body
    
    let queryRef: Query | CollectionReference = adminDb.collection('checkins')
    if (eventId) {
      queryRef = queryRef.where('eventId', '==', eventId)
    }
    
    const snapshot = await queryRef.get()
    const checkins: Record<string, unknown>[] = []
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      checkins.push({
        'Event Name': data.eventName,
        'Registrant Name': data.registrantName,
        'Member Name': data.memberName || 'N/A',
        'Roll Number': data.rollNumber,
        'Department/Section': data.departmentSection,
        'Email': data.email || 'N/A',
        'Phone': data.phone,
        'Team Name': data.teamName || 'N/A',
        'Check-in Time': data.checkInTime ? new Date(data.checkInTime.seconds * 1000).toLocaleString() : 'N/A',
        'Payment Method': data.paymentMethod || 'N/A',
        'Payment Status': data.paymentStatus || 'N/A',
        'Payment Amount': data.paymentAmount || 0,
        'QR Code': data.qrCode
      })
    })
    
    // Generate Excel file
    const worksheet = XLSX.utils.json_to_sheet(checkins)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Check-ins')
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    const base64Data = excelBuffer.toString('base64')
    
    return NextResponse.json({ 
      success: true, 
      excelData: base64Data,
      message: 'Excel file generated successfully' 
    })
  } catch (error) {
    console.error('Error exporting check-ins:', error)
    return NextResponse.json({ error: 'Failed to export check-ins' }, { status: 500 })
  }
}
