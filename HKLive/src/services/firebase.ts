// Firebase Configuration
// Replace with your Firebase project config from Firebase Console

export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// For development, you can use a mock config
// In production, use real Firebase config from Firebase Console
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== 'YOUR_API_KEY';
};
