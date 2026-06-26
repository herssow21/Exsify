import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ar: {
        translation: arTranslations
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Apply custom text overrides saved from the Content Editor
function applyTranslationOverrides() {
  try {
    const raw = localStorage.getItem("exsify_translations_override");
    if (!raw) return;
    const overrides = JSON.parse(raw);
    for (const lng of ["en", "ar"]) {
      if (overrides[lng]) {
        i18n.addResourceBundle(lng, "translation", overrides[lng], true, true);
      }
    }
  } catch {
    // ignore invalid override data
  }
}
applyTranslationOverrides();

export default i18n;
