// Firebase Auth Service
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  language: 'zh-TW' | 'zh-CN' | 'en';
  district: string;
  createdAt: Date;
}

// Sign up with email/password
export const signUp = async (email: string, password: string, name: string): Promise<UserProfile> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user profile in Firestore
  const profile: UserProfile = {
    id: user.uid,
    email: user.email || email,
    name,
    language: 'zh-TW',
    district: '',
    createdAt: new Date(),
  };
  
  await setDoc(doc(db, 'users', user.uid), profile);
  
  return profile;
};

// Sign in with email/password
export const signIn = async (email: string, password: string): Promise<UserProfile> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(userCredential.user.uid);
  return profile;
};

// Sign out
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
