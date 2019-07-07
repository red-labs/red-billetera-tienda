import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend

  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(reactI18nextModule)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    Lng: 'es',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;
