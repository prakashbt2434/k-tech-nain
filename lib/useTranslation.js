/**
 * Translation hook for React components.
 *
 *   const { t, language, setLanguage } = useTranslation();
 *   t("deals.confirmDeal")
 *   t("browse.countMany", { count: 5 })
 *
 * The active language comes from <LanguageProvider> (see lib/LanguageContext.jsx),
 * so every component re-renders when the user switches language.
 */

import { useLanguage } from "./LanguageContext";
import { translate } from "./translate";
import { SUPPORTED_LANGUAGES, getValidLanguage } from "./i18n";

export function useTranslation() {
  return useLanguage();
}

/**
 * Translation function for a fixed language (non-component contexts).
 * @param {string} language - Language code
 */
export function getTranslationFunction(language = SUPPORTED_LANGUAGES.EN) {
  const valid = getValidLanguage(language);
  return (key, params) => translate(valid, key, params);
}
