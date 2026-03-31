// Firebase Configuration
// HKLive App - Firebase Console

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyD6wBJ9TQcZKJ3a9xLXLZ0M9n9_jgJpl6w",
  authDomain: "hklive-app.firebaseapp.com",
  projectId: "hklive-app",
  storageBucket: "hklive-app.appspot.com",
  messagingSenderId: "729929619431",
  appId: "1:729929619431:web:8e8c0c60f8cc0a0fb3e033"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Development mode - set to true to use local emulators
const useEmulators = false;

if (useEmulators) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== 'YOUR_API_KEY';
};

export default app;
