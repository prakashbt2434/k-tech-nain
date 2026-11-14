"use client";

/**
 * Language provider for the whole app.
 *
 * Resolution order for the active language:
 *   1. The logged-in user's `language` field in Firestore (set on /profile)
 *   2. A value saved in localStorage (works for logged-out visitors)
 *   3. The browser language (kn-IN → Kannada), else English
 *
 * Changing the language from the navigation toggle or profile page updates
 * all three, so UI text, emails (server reads users/{uid}.language) and the
 * next visit stay in sync.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  DEFAULT_LANGUAGE,
  getBrowserLanguage,
  getValidLanguage,
  isValidLanguage,
} from "./i18n";
import { translate } from "./translate";

const STORAGE_KEY = "ftt-language";

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: async () => {},
  t: (key, params) => translate(DEFAULT_LANGUAGE, key, params),
});

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isValidLanguage(stored) ? stored : null;
  } catch {
    return null;
  }
}

function storeLanguage(language) {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Storage can be unavailable (private mode); the in-memory value still works.
  }
}

export function LanguageProvider({ children }) {
  // Start with the default so server and first client render match (no hydration mismatch).
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [uid, setUid] = useState(null);

  // Local preference on mount
  useEffect(() => {
    setLanguageState(readStoredLanguage() || getBrowserLanguage());
  }, []);

  // Logged-in user's saved preference wins
  useEffect(() => {
    if (!auth || !db) return undefined;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUid(user?.uid || null);
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const saved = snap.exists() ? snap.data()?.language : null;
        if (isValidLanguage(saved)) {
          setLanguageState(saved);
          storeLanguage(saved);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Could not load language preference:", err?.message);
      }
    });
    return () => unsubscribe();
  }, []);

  // Keep <html lang> in sync for screen readers and font selection
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback(
    async (next, { persistToProfile = true } = {}) => {
      const valid = getValidLanguage(next);
      setLanguageState(valid);
      storeLanguage(valid);
      if (persistToProfile && uid && db) {
        try {
          await updateDoc(doc(db, "users", uid), { language: valid });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("Could not save language preference:", err?.message);
        }
      }
    },
    [uid]
  );

  const t = useCallback(
    (key, params) => translate(language, key, params),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
