import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import pt from "../locales/pt.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: en,
      },
      pt: {
        translation: pt,
      },
    },
    lng: "en", // default language
    fallbackLng: "en", // fallback language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;