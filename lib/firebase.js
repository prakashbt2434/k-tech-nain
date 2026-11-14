import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * NEXT_PUBLIC_* variables are inlined at build time. If they are missing,
 * Firebase throws `auth/invalid-api-key` while Next.js prerenders pages and
 * the whole build fails. Instead we skip initialization and let the root
 * layout render a clear configuration message (see components/ConfigError).
 */
export const missingFirebaseEnv = [
  ["NEXT_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["NEXT_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

export const isFirebaseConfigured = missingFirebaseEnv.length === 0;

if (!isFirebaseConfigured && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.error(
    `Firebase is not configured. Missing env vars: ${missingFirebaseEnv.join(
      ", "
    )}. Copy .env.example to .env.local and fill in your Firebase project values.`
  );
}

const isNewApp = isFirebaseConfigured && getApps().length === 0;

const app = isFirebaseConfigured
  ? isNewApp
    ? initializeApp(firebaseConfig)
    : getApp()
  : null;

export const auth = app ? getAuth(app) : null;

// Offline cache (IndexedDB) only in the browser, and only on first init.
// Replaces the deprecated enableIndexedDbPersistence().
function createDb() {
  if (!app) return null;
  if (isNewApp && typeof window !== "undefined") {
    try {
      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Offline persistence unavailable:", err?.message);
    }
  }
  return getFirestore(app);
}

export const db = createDb();

export const storage = app ? getStorage(app) : null;

export default app;
