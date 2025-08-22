const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
// Go to Project Settings > Service Accounts > Generate New Private Key
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim(email) {
  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    
    console.log(`✅ Successfully set admin claim for user: ${email}`);
    console.log(`User UID: ${userRecord.uid}`);
    
    // Force token refresh (optional)
    await admin.auth().revokeRefreshTokens(userRecord.uid);
    
    console.log('🔄 User will need to sign out and sign back in for changes to take effect');
    
  } catch (error) {
    console.error('❌ Error setting admin claim:', error.message);
  }
}

async function removeAdminClaim(email) {
  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Remove custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: false });
    
    console.log(`✅ Successfully removed admin claim for user: ${email}`);
    
    // Force token refresh (optional)
    await admin.auth().revokeRefreshTokens(userRecord.uid);
    
    console.log('🔄 User will need to sign out and sign back in for changes to take effect');
    
  } catch (error) {
    console.error('❌ Error removing admin claim:', error.message);
  }
}

async function checkAdminStatus(email) {
  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    console.log(`👤 User: ${email}`);
    console.log(`UID: ${userRecord.uid}`);
    console.log(`Custom Claims:`, userRecord.customClaims);
    
  } catch (error) {
    console.error('❌ Error checking user status:', error.message);
  }
}

// Example usage:
// Replace 'admin@tam.com' with the email you want to make admin

// Set admin claim
setAdminClaim('admin@tam.com'); // Replace with your actual email

// Remove admin claim
// removeAdminClaim('admin@tam.com');

// Check admin status
// checkAdminStatus('admin@tam.com');

console.log('🔧 Admin Setup Script');
console.log('📝 To use this script:');
console.log('1. Download your service account key from Firebase Console');
console.log('2. Update the path in require() statement');
console.log('3. Uncomment the function call you want to use');
console.log('4. Run: node scripts/setup-admin.js');
