import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Registration } from '@/types'
// Email sending is handled by /api/send-email route

// Input validation function
function validatePaymentApprovalInput(data: Record<string, unknown>): { isValid: boolean; error?: string } {
  const { registrationId } = data as {
    registrationId?: string;
  }

  // Check if registrationId is present
  if (!registrationId) {
    return { 
      isValid: false, 
      error: 'Missing required field: registrationId' 
    }
  }

  // Validate registrationId format (basic check)
  if (typeof registrationId !== 'string' || registrationId.trim().length === 0) {
    return { 
      isValid: false, 
      error: 'Invalid registration ID format' 
    }
  }

  return { isValid: true }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>
    const { registrationId } = body as {
      registrationId?: string;
    }

    // Validate input
    const validation = validatePaymentApprovalInput(body)
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: validation.error 
      }, { status: 400 })
    }

    const trimmedRegistrationId = registrationId!.trim()
    console.log(`Processing payment approval for registration: ${trimmedRegistrationId}`)

    // Get registration from Firestore
    const registrationRef = doc(db, 'registrations', trimmedRegistrationId)
    const registrationDoc = await getDoc(registrationRef)

    if (!registrationDoc.exists()) {
      return NextResponse.json({ 
        error: 'Registration not found' 
      }, { status: 404 })
    }

    const registration = registrationDoc.data() as Registration
    console.log(`Found registration for: ${registration.registrantName} (${registration.email})`)

    // Check if payment is already approved
    if (registration.paymentStatus === 'approved') {
      return NextResponse.json({ 
        error: 'Payment is already approved' 
      }, { status: 400 })
    }

    // Update payment status to approved
    await updateDoc(registrationRef, {
      paymentStatus: 'approved',
      paymentApprovedAt: new Date(),
      paymentApprovedBy: 'admin'
    })

    // Update event capacity for approved cash payments
    const eventRef = doc(db, 'events', registration.eventId)
    const increment = 1 // For team events, count as 1 team registration, not individual members
    
    // Get current event data to update capacity
    const eventDoc = await getDoc(eventRef)
    if (eventDoc.exists()) {
      const eventData = eventDoc.data()
      await updateDoc(eventRef, {
        registeredCount: (eventData.registeredCount || 0) + increment
      })
    }

    console.log(`Payment approved for registration: ${trimmedRegistrationId}`)

    // Send confirmation email
    try {
      const emailData = {
        email: registration.email,
        eventName: registration.eventName,
        qrCode: registration.qrCode,
        ...(registration.teamName 
          ? { teamName: registration.teamName }
          : { registrantName: registration.registrantName }
        )
      }

      const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      })

      if (!emailResponse.ok) {
        console.warn('Email sending failed, but payment was approved')
        return NextResponse.json({ 
          success: true, 
          message: 'Payment approved successfully, but email sending failed',
          registration: {
            id: registrationDoc.id,
            registrantName: registration.registrantName,
            email: registration.email,
            eventName: registration.eventName,
            paymentStatus: 'approved'
          }
        })
      } else {
        console.log('Confirmation email sent successfully')
        return NextResponse.json({ 
          success: true, 
          message: 'Payment approved and confirmation email sent successfully',
          registration: {
            id: registrationDoc.id,
            registrantName: registration.registrantName,
            email: registration.email,
            eventName: registration.eventName,
            paymentStatus: 'approved'
          }
        })
      }
    } catch (emailError) {
      console.warn('Email sending failed:', emailError)
      return NextResponse.json({ 
        success: true, 
        message: 'Payment approved successfully, but email sending failed',
        registration: {
          id: registrationDoc.id,
          registrantName: registration.registrantName,
          email: registration.email,
          eventName: registration.eventName,
          paymentStatus: 'approved'
        }
      })
    }
  } catch (error) {
    console.error('Error approving payment:', error)
    return NextResponse.json({ 
      error: 'Failed to approve payment. Please try again.' 
    }, { status: 500 })
  }
} 