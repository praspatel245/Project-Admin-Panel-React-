import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "header.title": "Admin Panel",
      "footer.text": "© 2024 Admin Panel",
      "login.title": "Login",
      "register.title": "Register",
      "forgot_password.title": "Forgot Password"
    }
  },
  fr: {
    translation: {
      "header.title": "Panneau d'Administration",
      "footer.text": "© 2024 Panneau d'Administration",
      "login.title": "Connexion",
      "register.title": "S'inscrire",
      "forgot_password.title": "Mot de passe oublié"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;