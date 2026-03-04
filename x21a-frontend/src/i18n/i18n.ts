import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEs from './locales/es/common.json';
import domainEs from './locales/es/domain.json';
import pagesEs from './locales/es/pages.json';
import componentsEs from './locales/es/components.json';

import commonEu from './locales/eu/common.json';
import domainEu from './locales/eu/domain.json';
import pagesEu from './locales/eu/pages.json';
import componentsEu from './locales/eu/components.json';

const resources = {
  es: {
    common: commonEs,
    domain: domainEs,
    pages: pagesEs,
    components: componentsEs
  },
  eu: {
    common: commonEu,
    domain: domainEu,
    pages: pagesEu,
    components: componentsEu
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Idioma por defecto
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React ya protege contra XSS
    }
  });

export default i18n;