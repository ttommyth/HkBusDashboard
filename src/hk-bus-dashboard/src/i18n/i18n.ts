import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
      "add_route":"Add Route"
    }
  },
  "zh-HK": {
    translation: {
      "Welcome to React": "Bienvenue à React et react-i18next",
      "add_route":"新堵路線"
    }
  },
  "zh-CN": {
    translation: {
      "Welcome to React": "Bienvenue à React et react-i18next",
      "add_route":"新堵路線"
    }
  }
};

i18n
// detect user language
// learn more: https://github.com/i18next/i18next-browser-languageDetector
.use(LanguageDetector)
// pass the i18n instance to react-i18next.
.use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;