import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

// Only initialize Firebase Admin in server environment
if (typeof window !== 'undefined') {
  throw new Error('Server-side only module')
}

// Check if required environment variables are set (without exposing names)
const requiredEnvVars = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
}

// Validate all required environment variables exist
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  throw new Error(`Missing required environment configuration`)
}

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: cert({
    projectId: requiredEnvVars.projectId!,
    clientEmail: requiredEnvVars.clientEmail!,
    privateKey: requiredEnvVars.privateKey!.replace(/\\n/g, '\n'),
  }),
}

// Initialize the app if it hasn't been initialized
let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0]
} catch (error) {
  // Log generic error without sensitive details
  console.error('Firebase Admin initialization failed')
  
  // In development, log minimal error info
  if (process.env.NODE_ENV === 'development') {
    console.error('Error type:', error instanceof Error ? error.constructor.name : 'Unknown')
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
  }
  
  throw new Error('Service initialization failed')
}

// Export Firestore and Auth instances
export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)

export default app
