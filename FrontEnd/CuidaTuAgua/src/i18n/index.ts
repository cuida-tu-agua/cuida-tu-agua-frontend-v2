// src/i18n/index.ts
import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import 'intl-pluralrules';
import { initReactI18next } from 'react-i18next';

import enLanding from './translations/en/landing.json';
import esLanding from './translations/es/landing.json';
import frLanding from './translations/fr/landing.json';
import ptLanding from './translations/pt/landing.json';

import enLogin from './translations/en/login.json';
import esLogin from './translations/es/login.json';
import frLogin from './translations/fr/login.json';
import ptLogin from './translations/pt/login.json';

import esRegister from './translations/es/register.json';
import enRegister from './translations/en/register.json';
import frRegister from './translations/fr/register.json';
import ptRegister from './translations/pt/register.json';

import enDashboard from './translations/en/dashboard.json';
import esDashboard from './translations/es/dashboard.json';
import frDashboard from './translations/fr/dashboard.json';
import ptDashboard from './translations/pt/dashboard.json';

import enSettings from './translations/en/settings.json';
import esSettings from './translations/es/settings.json';
import frSettings from './translations/fr/settings.json';
import ptSettings from './translations/pt/settings.json';

import enProfile from './translations/en/profile.json';
import esProfile from './translations/es/profile.json';
import frProfile from './translations/fr/profile.json';
import ptProfile from './translations/pt/profile.json';

import esFooter from './translations/es/footer.json';
import enFooter from './translations/en/footer.json';
import frFooter from './translations/fr/footer.json';
import ptFooter from './translations/pt/footer.json';

// HU-008 / HU-009: pantallas de crear y editar hogar ("lugar")
import esHogar from './translations/es/hogar.json';
import enHogar from './translations/en/hogar.json';
import frHogar from './translations/fr/hogar.json';
import ptHogar from './translations/pt/hogar.json';

const LANGUAGE_KEY = 'appLang';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { 
        landing: esLanding,
        login: esLogin,
        register: esRegister,
        dashboard: esDashboard,
        settings: esSettings,
        profile: esProfile,
        footer: esFooter,
        hogar: esHogar
      },
      fr: { 
        landing: frLanding,
        login: frLogin,
        register: frRegister,
        dashboard: frDashboard,
        settings: frSettings,
        profile: frProfile,
        footer: frFooter,
        hogar: frHogar
      },
      
      pt: { 
        landing: ptLanding,
        login: ptLogin,
        register: ptRegister,
        dashboard: ptDashboard,
        settings: ptSettings,
        profile: ptProfile,
        footer: ptFooter,
        hogar: ptHogar
      },
      en: {
        landing: enLanding,
        login: enLogin,
        register: enRegister,
        dashboard: enDashboard,
        settings: enSettings,
        profile: enProfile,
        footer: enFooter,
        hogar: enHogar
      }
    },
    lng: 'es',
    fallbackLng: 'en',
    ns: ['landing', 'login', 'dashboard', 'settings', 'profile', 'footer', 'register', 'hogar'], 
    defaultNS: 'landing',
    interpolation: {
      escapeValue: false
    }
  });

  // cargar idioma guardado
AsyncStorage.getItem(LANGUAGE_KEY).then(lang => {
  if (lang) i18n.changeLanguage(lang);
});

// guardar cuando cambie
i18n.on('languageChanged', lang => {
  AsyncStorage.setItem(LANGUAGE_KEY, lang);
});

export default i18n;
