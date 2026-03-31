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

export const signUp = async (email: string, password: string, name: string): Promise<UserProfile> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
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

export const signIn = async (email: string, password: string): Promise<UserProfile> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(userCredential.user.uid);
  if (!profile) {
    throw new Error('User profile not found');
  }
  return profile;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
