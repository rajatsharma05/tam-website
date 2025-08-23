import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

// Only initialize Firebase Admin in server environment
if (typeof window !== 'undefined') {
  throw new Error('Firebase Admin can only be used on the server side')
}

// Check if required environment variables are set
if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('Missing required environment configuration')
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('Missing required environment configuration')
}
if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Missing required environment configuration')
}

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
}

// Initialize the app if it hasn't been initialized
let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0]
} catch (error) {
  console.error('Error initializing Firebase Admin:', error)
  throw error
}

// Export Firestore and Auth instances
export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)

export default app
