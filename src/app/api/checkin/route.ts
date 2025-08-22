import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Registration } from '@/types'
import { validateQRCode } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrCode } = body

    // Input validation
    if (!validateQRCode(qrCode)) {
      return NextResponse.json({ 
        error: 'Invalid QR code format. Please provide a valid QR code.' 
      }, { status: 400 })
    }

    const trimmedQR = qrCode.trim()
    console.log(`Processing check-in for QR code: ${trimmedQR}`)

    // Use a transaction to ensure atomicity
    const result = await adminDb.runTransaction(async (transaction) => {
      // Find registration by QR code
      const registrationsRef = adminDb.collection('registrations')
      const q = registrationsRef.where('qrCode', '==', trimmedQR)
      const querySnapshot = await q.get()

      if (querySnapshot.empty) {
        console.log(`QR code not found: ${trimmedQR}`)
        throw new Error('Invalid QR code')
      }

      const registrationDoc = querySnapshot.docs[0]
      const registration = { id: registrationDoc.id, ...registrationDoc.data() } as Registration

      console.log(`Found registration for: ${registration.registrantName} (${registration.email})`)

      // Check if already checked in within the transaction
      if (registration.isCheckedIn) {
        console.log(`Registration already checked in: ${trimmedQR}`)
        throw new Error('Already checked in')
      }

      // Check if check-in already exists in checkins collection
      const checkinsRef = adminDb.collection('checkins')
      const checkinQuery = checkinsRef.where('qrCode', '==', trimmedQR)
      const checkinSnapshot = await checkinQuery.get()

      if (!checkinSnapshot.empty) {
        console.log(`Check-in record already exists: ${trimmedQR}`)
        throw new Error('Already checked in')
      }

      console.log(`Proceeding with check-in for: ${registration.registrantName}`)

      // Update check-in status in registrations
      const registrationRef = adminDb.collection('registrations').doc(registration.id)
      transaction.update(registrationRef, {
        isCheckedIn: true,
        checkInTime: new Date()
      })

      if (registration.teamMembers && Array.isArray(registration.teamMembers)) {
        // Team check-in: create a check-in record for each member
        const checkinIds: string[] = [];
        (registration.teamMembers as Array<{ name: string; rollNumber: string; departmentSection: string; phone: string }>).forEach((member, idx) => {
          const checkinRef = adminDb.collection('checkins').doc();
          const checkinData = {
            eventId: registration.eventId,
            eventName: registration.eventName,
            teamName: registration.teamName,
            teamLeaderEmail: registration.teamLeaderEmail,
            memberName: member.name,
            registrantName: member.name, // ensure name is always present
            rollNumber: member.rollNumber,
            departmentSection: member.departmentSection,
            phone: member.phone,
            checkInTime: new Date(),
            isCheckedIn: true,
            qrCode: registration.qrCode,
            teamIndex: idx + 1,
            // Include payment information
            paymentMethod: registration.paymentMethod || 'N/A',
            paymentStatus: registration.paymentStatus || 'N/A',
            paymentAmount: registration.paymentAmount || 0,
            // Include referral code
            referralCode: registration.referralCode || 'N/A',
          };
          transaction.set(checkinRef, checkinData);
          checkinIds.push(checkinRef.id);
        });
        return {
          registration,
          checkinIds,
        };
      } else {
        // Individual check-in: ensure registrantName is properly set
        const checkinData = {
          eventId: registration.eventId,
          eventName: registration.eventName,
          registrantName: registration.registrantName || (registration as unknown as { name?: string }).name || 'Unknown',
          rollNumber: registration.rollNumber,
          departmentSection: registration.departmentSection,
          email: registration.email,
          phone: registration.phone,
          qrCode: registration.qrCode,
          checkInTime: new Date(),
          isCheckedIn: true,
          // Include payment information
          paymentMethod: registration.paymentMethod || 'N/A',
          paymentStatus: registration.paymentStatus || 'N/A',
          paymentAmount: registration.paymentAmount || 0,
          // Include referral code
          referralCode: registration.referralCode || 'N/A',
        }
        const checkinRef = adminDb.collection('checkins').doc()
        transaction.set(checkinRef, checkinData)
        return {
          registration,
          checkinId: checkinRef.id,
        }
      }
    })

    console.log(`Check-in completed successfully. Check-in ID: ${result.checkinId}`)

    return NextResponse.json({
      success: true,
      message: 'Check-in successful',
      registration: {
        eventName: result.registration.eventName,
        registrantName: result.registration.registrantName,
        email: result.registration.email,
        rollNumber: result.registration.rollNumber,
        departmentSection: result.registration.departmentSection,
        phone: result.registration.phone,
        checkInTime: new Date()
      }
    })

  } catch (error) {
    console.error('Check-in error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'Invalid QR code') {
        return NextResponse.json({ error: 'Invalid QR code' }, { status: 404 })
      }
      if (error.message === 'Already checked in') {
        return NextResponse.json({ error: 'Already checked in' }, { status: 400 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Internal server error. Please try again.' 
    }, { status: 500 })
  }
} 