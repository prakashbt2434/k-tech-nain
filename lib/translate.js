/**
 * Pure translation helper (no React) — usable in components, utilities and tests.
 */

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./i18n";
import en from "../locales/en.json";
import kn from "../locales/kn.json";

export const translations = {
  [SUPPORTED_LANGUAGES.EN]: en,
  [SUPPORTED_LANGUAGES.KN]: kn,
};

function lookup(dictionary, key) {
  const value = key
    .split(".")
    .reduce((current, part) => (current == null ? undefined : current[part]), dictionary);
  return typeof value === "string" ? value : undefined;
}

/**
 * Translate a dot-separated key, e.g. translate("kn", "deals.confirmDeal").
 * Falls back to English, then to the key itself, so a missing Kannada string
 * never blanks out the UI.
 * Supports {param} interpolation: translate("en", "x.hello", { name: "Ravi" }).
 * Pass { defaultValue } to show something other than the key when missing,
 * e.g. free-text category names stored in Firestore.
 */
export function translate(language, key, params = {}) {
  const dictionary = translations[language] || translations[DEFAULT_LANGUAGE];
  let text = lookup(dictionary, key);
  if (text === undefined) text = lookup(translations[DEFAULT_LANGUAGE], key);
  if (text === undefined) return params?.defaultValue ?? key;

  if (params && Object.keys(params).length > 0) {
    text = text.replace(/\{(\w+)\}/g, (match, name) =>
      params[name] !== undefined && params[name] !== null ? String(params[name]) : match
    );
  }
  return text;
}
