import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    // 1. Auth Shield: Verify Authorization Header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or malformed Authorization header.' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;

    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (authError: any) {
      console.error('Firebase Auth Verification Failed:', authError);
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or expired authentication token.' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // 2. Fetch User's Past Analyses from Firestore (Ordered by newest first)
    const snapshot = await adminDb
      .collection('users')
      .doc(userId)
      .collection('analyses')
      .orderBy('createdAt', 'desc')
      .get();

    const history = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        fileName: data.fileName,
        fileType: data.fileType,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        data: data.data,
      };
    });

    // 3. Return History List
    return NextResponse.json(
      {
        success: true,
        count: history.length,
        history,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('API /api/history Handler Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analysis history.' },
      { status: 500 }
    );
  }
}
