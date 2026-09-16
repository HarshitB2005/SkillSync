import { auth } from '@/lib/firebaseClient';

/**
 * 1. Retrieve Current User Token
 * Securely grabs the live JWT Bearer token after ensuring Firebase Auth state is ready.
 */
export async function getAuthToken(): Promise<string | null> {
  // Wait for Firebase to finish restoring persistent auth state
  await auth.authStateReady();

  const user = auth.currentUser;
  
  if (!user) {
    return null;
  }
  
  // Gets the token, automatically refreshing it if expired
  return await user.getIdToken();
}

/**
 * 2. Standardized API Fetch Wrapper
 * Intercepts fetch calls to inject the Authorization header and handle errors globally.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('Authentication required. Please log in before making this request.');
  }

  // Preserve custom headers passed into the function
  const headers = new Headers(options.headers || {});
  
  // Inject the Bearer token for backend authentication
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  // Global error handling: catches 400/401/500 backend responses
  if (!response.ok) {
    throw new Error(data.error || `API Request failed with status ${response.status}`);
  }

  return data;
}