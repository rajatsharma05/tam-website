import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import QRCode from 'qrcode'
import { validateEmail, validateStringLength, validateQRCode } from '@/lib/utils'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Input validation function
function validateEmailInput(data: Record<string, unknown>): { isValid: boolean; error?: string } {
  const { email, eventName, registrantName, teamName, qrCode } = data as {
    email?: string;
    eventName?: string;
    registrantName?: string;
    teamName?: string;
    qrCode?: string;
  }

  // Check if all required fields are present
  if (!email || !eventName || !qrCode || (!registrantName && !teamName)) {
    return { 
      isValid: false, 
      error: 'Missing required fields: email, eventName, qrCode, and registrantName or teamName are required' 
    }
  }

  // Validate email format
  if (!validateEmail(email)) {
    return { 
      isValid: false, 
      error: 'Invalid email format' 
    }
  }

  // Validate string lengths
  if (!validateStringLength(eventName, 200)) {
    return { 
      isValid: false, 
      error: 'Invalid event name' 
    }
  }

  if (registrantName && !validateStringLength(registrantName, 100)) {
    return { 
      isValid: false, 
      error: 'Invalid registrant name' 
    }
  }
  if (teamName && !validateStringLength(teamName, 100)) {
    return { 
      isValid: false, 
      error: 'Invalid team name' 
    }
  }

  if (!validateQRCode(qrCode)) {
    return { 
      isValid: false, 
      error: 'Invalid QR code' 
    }
  }

  return { isValid: true }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>
    const { email, eventName, registrantName, teamName, qrCode } = body as {
      email?: string;
      eventName?: string;
      registrantName?: string;
      teamName?: string;
      qrCode?: string;
    }

    console.log('Email API called with:', { email, eventName, registrantName })

    // Validate input
    const validation = validateEmailInput(body)
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: validation.error 
      }, { status: 400 })
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials not configured')
      return NextResponse.json({ 
        error: 'Email service not configured. Please check EMAIL_USER and EMAIL_PASS in .env.local' 
      }, { status: 500 })
    }

    if (!qrCode || typeof qrCode !== 'string') {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 400 })
    }

    // Generate QR code as PNG buffer
    const qrCodeBuffer = await QRCode.toBuffer(qrCode, {
      width: 150,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Registration Confirmation - ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Registration Confirmation</h2>
          <p>Dear ${teamName ? teamName : registrantName},</p>
          <p>Thank you for registering for <strong>${eventName}</strong>!</p>
          <p>Your registration has been confirmed. Please find your QR code below, which you'll need for entry to the event.</p>
          <div style="text-align: center; margin: 30px 0;">
            <img src="cid:qrcodeimage" alt="QR Code" style="border: 2px solid #2563eb; border-radius: 8px; display:block; margin:0 auto;" />
            <div style="font-size:12px; color:#888; margin-top:8px;">If you cannot see the QR code, please contact the event organizer.</div>
          </div>
          <p><strong>Important:</strong> Please present this QR code at the event entrance for quick check-in.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The TAM Team</p>
        </div>
      `,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeBuffer,
          cid: 'qrcodeimage', // same as in the img src above
        },
      ],
    }

    console.log('Attempting to send email to:', email)
    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId
    })

  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ 
      error: 'Failed to send email. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 