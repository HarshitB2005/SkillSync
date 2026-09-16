import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Prevent initializing multiple admin instances during hot-reloading in Next.js development
if (!getApps().length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    storageBucket: `${process.env.FIREBASE_ADMIN_PROJECT_ID}.firebasestorage.app`,
  });
}

// Export admin instances for server-side usage
export const adminAuth = getAuth();
export const adminDb = getFirestore();
export const adminStorage = getStorage();