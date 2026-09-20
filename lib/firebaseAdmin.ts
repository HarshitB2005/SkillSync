import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// 1. Format the private key safely to remove Vercel's accidental wrapping quotes
const formatPrivateKey = (key?: string) => {
  if (!key) return undefined;
  return key.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
};

// 2. Prevent initializing multiple admin instances during hot-reloading
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
    }),
    storageBucket: `${process.env.FIREBASE_ADMIN_PROJECT_ID}.firebasestorage.app`,
  });
}

// 3. Export admin instances for server-side usage
export const adminAuth = getAuth();
export const adminDb = getFirestore();
export const adminStorage = getStorage();