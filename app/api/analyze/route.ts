import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, adminStorage } from '@/lib/firebaseAdmin';
import { parseDocument } from '@/lib/parseDocument';
import { analyzeResumeWithAI } from '@/lib/geminiAnalyzer';
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
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

    // 2. Intercept FormData & Uploaded File
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Bad Request: No file uploaded in request payload.' },
        { status: 400 }
      );
    }

    // 3. Convert File Stream to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Document Processing & Text Extraction (Phase 2)
    const parseResult = await parseDocument(buffer, file.name, file.type);

    // 5. AI Resume Parsing Engine (Phase 3)
    // --- UPDATED: Added an automatic retry loop for Gemini 503 Overload Errors ---
    let analysisPayload;
    let maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        analysisPayload = await analyzeResumeWithAI(parseResult.text);
        break; // If successful, break out of the loop
      } catch (aiError: any) {
        attempt++;
        const errorMessage = aiError.message || '';
        
        // Check if it's a 503 Service Unavailable / High Demand error
        if (errorMessage.includes('503') || errorMessage.includes('high demand') || errorMessage.includes('UNAVAILABLE')) {
          console.warn(`[Gemini API] High demand error (503). Retrying attempt ${attempt} of ${maxRetries}...`);
          
          if (attempt >= maxRetries) {
            throw new Error('Gemini AI is currently overloaded after multiple attempts. Please try again in a few minutes.');
          }
          // Wait for 2.5 seconds before retrying to allow Google's servers to cool down
          await new Promise((resolve) => setTimeout(resolve, 2500));
        } else {
          // If it's a different error (like a bad API key), throw immediately without retrying
          throw aiError;
        }
      }
    }

    // 6. Save Raw File to Firebase Cloud Storage
    //const timestamp = Date.now();
    //const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    //const storagePath = `resumes/${userId}/${timestamp}_${sanitizedFileName}`;
    // const bucket = adminStorage.bucket();
    //const fileRef = bucket.file(storagePath);

    //await fileRef.save(buffer, {
      //metadata: {
      //  contentType: file.type || 'application/octet-stream',
      // },
    //});

    // 7. Save Analysis JSON to Firestore Database
    const analysisRef = adminDb
      .collection('users')
      .doc(userId)
      .collection('analyses')
      .doc();

    const recordData = {
      id: analysisRef.id,
      userId,
      fileName: parseResult.fileName,
      fileType: parseResult.fileType,
      storagePath: "dummy-path/skipped-storage.pdf",
      createdAt: new Date(),
      data: analysisPayload,
    };

    await analysisRef.set(recordData);

    // 8. Return Response Payload with Firestore Analysis ID
    return NextResponse.json(
      {
        success: true,
        analysisId: analysisRef.id,
        userId: userId,
        meta: {
          fileName: parseResult.fileName,
          fileType: parseResult.fileType,
          processedAt: new Date().toISOString(),
        },
        data: analysisPayload,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('API /api/analyze Handler Error:', error);
    const errorMessage = error.message || 'An unexpected server error occurred during processing.';
    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 }
    );
  }
}