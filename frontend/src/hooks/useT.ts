import { useTranslation } from 'react-i18next';
import { useLanguage as useLanguageContext } from '../contexts/LanguageContext';
import { useEffect } from 'react';

export const useT = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageContext();

  // Sync i18next with LanguageContext
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang as any);
    i18n.changeLanguage(lang);
  };

  return { t, language, changeLanguage };
};
