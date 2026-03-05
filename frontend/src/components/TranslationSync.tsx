import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * TranslationSync - Ensures i18next and LanguageContext stay in sync
 * Wrap your App with this component
 */
export const TranslationSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguage();

  // Sync i18next with LanguageContext on mount
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, []);

  // Listen to i18next language changes and sync to LanguageContext
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (lng !== language) {
        setLanguage(lng as any);
      }
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, language, setLanguage]);

  return <>{children}</>;
};
