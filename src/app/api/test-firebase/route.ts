import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if environment variables are accessible
    const envCheck = {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      projectIdLength: process.env.FIREBASE_PROJECT_ID?.length || 0,
      clientEmailLength: process.env.FIREBASE_CLIENT_EMAIL?.length || 0,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV,
    }

    // Try to import Firebase admin
    let firebaseStatus = 'Not imported'
    try {
      const { adminDb } = await import('@/lib/firebase-admin')
      firebaseStatus = 'Successfully imported'
      
      // Try a simple Firestore operation
      const testDoc = await adminDb.collection('test').limit(1).get()
      firebaseStatus = 'Firestore connection successful'
    } catch (firebaseError) {
      firebaseStatus = `Firebase error: ${firebaseError instanceof Error ? firebaseError.message : 'Unknown error'}`
    }

    return NextResponse.json({
      success: true,
      envCheck,
      firebaseStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
